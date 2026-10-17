import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Detect all mounted storage drives on Windows
 */
export async function getWindowsDrives() {
  try {
    const psCommand = `powershell -NoProfile -Command "Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object DeviceID, VolumeName, Size, FreeSpace, DriveType | ConvertTo-Json"`;
    const { stdout } = await execPromise(psCommand);
    if (!stdout.trim()) return [];

    let parsed = JSON.parse(stdout);
    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    return parsed
      .filter(d => d.Size && Number(d.Size) > 0)
      .map(d => {
        const total = Number(d.Size);
        const free = Number(d.FreeSpace || 0);
        const used = total - free;
        return {
          id: d.DeviceID,
          name: d.VolumeName ? `${d.VolumeName} (${d.DeviceID})` : `Drive (${d.DeviceID})`,
          path: `${d.DeviceID}\\`,
          totalBytes: total,
          freeBytes: free,
          usedBytes: used,
          usedPercent: Math.round((used / total) * 100),
          isSystem: d.DeviceID.toUpperCase() === 'C:'
        };
      });
  } catch (err) {
    console.error('Error fetching drives:', err);
    // Fallback if PowerShell command fails
    return [{ id: 'C:', name: 'Drive C:', path: 'C:\\', totalBytes: 0, freeBytes: 0, usedBytes: 0, usedPercent: 0, isSystem: true }];
  }
}

/**
 * Format bytes into human readable format
 */
export function formatBytes(bytes) {
  const num = Number(bytes);
  if (!num || isNaN(num) || num <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Scan a directory tree up to maxDepth and build a hierarchical JSON tree
 */
export async function scanDirectoryTree(targetPath, options = {}, onProgress = null) {
  const maxDepth = options.maxDepth || 4;
  const minSizeToInclude = options.minSize || 1024 * 512; // 512 KB
  const startTime = Date.now();

  let filesScanned = 0;
  let dirsScanned = 0;
  let totalBytesScanned = 0;
  let isCancelled = false;

  let lastProgressUpdate = 0;
  const notifyProgress = (currentPath) => {
    const now = Date.now();
    if (now - lastProgressUpdate > 120 && onProgress) {
      lastProgressUpdate = now;
      onProgress({
        filesScanned,
        dirsScanned,
        totalBytesScanned,
        currentPath,
        elapsedMs: now - startTime
      });
    }
  };

  async function crawl(dirPath, depth) {
    if (isCancelled) return null;
    dirsScanned++;
    notifyProgress(dirPath);

    let entries;
    try {
      entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    } catch (e) {
      // Permission denied or locked system folder
      return null;
    }

    let dirSize = 0;
    const children = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip system junctions or circular links
      if (entry.isSymbolicLink()) continue;

      if (entry.isDirectory()) {
        if (depth < maxDepth) {
          const subDirNode = await crawl(fullPath, depth + 1);
          if (subDirNode && subDirNode.value > 0) {
            dirSize += subDirNode.value;
            children.push(subDirNode);
          }
        } else {
          // Beyond max depth, calculate size shallowly or skip deep recursion for speed
          const shallowSize = await getFolderSizeQuick(fullPath);
          dirSize += shallowSize;
          if (shallowSize >= minSizeToInclude) {
            children.push({
              name: entry.name,
              path: fullPath,
              value: shallowSize,
              isDirectory: true,
              children: []
            });
          }
        }
      } else if (entry.isFile()) {
        try {
          const stats = await fs.promises.stat(fullPath);
          const size = stats.size;
          filesScanned++;
          totalBytesScanned += size;
          dirSize += size;

          // Only keep individual files above threshold or if in shallow depth
          if (size >= minSizeToInclude || depth <= 2) {
            children.push({
              name: entry.name,
              path: fullPath,
              value: size,
              isDirectory: false,
              extension: path.extname(entry.name).toLowerCase()
            });
          }
        } catch (e) {
          // File locked or inaccessible
        }
      }
    }

    // Sort children by size descending
    children.sort((a, b) => b.value - a.value);

    return {
      name: path.basename(dirPath) || dirPath,
      path: dirPath,
      value: dirSize,
      isDirectory: true,
      children
    };
  }

  // Quick recursive size sum for deep nodes without building detailed sub-trees
  async function getFolderSizeQuick(dirPath, maxQuickDepth = 2) {
    let size = 0;
    async function quickCrawl(p, d) {
      if (d > maxQuickDepth) return;
      try {
        const list = await fs.promises.readdir(p, { withFileTypes: true });
        for (const item of list) {
          if (item.isSymbolicLink()) continue;
          const sub = path.join(p, item.name);
          if (item.isFile()) {
            const st = await fs.promises.stat(sub);
            size += st.size;
            filesScanned++;
            totalBytesScanned += st.size;
          } else if (item.isDirectory()) {
            await quickCrawl(sub, d + 1);
          }
        }
      } catch (err) {}
    }
    await quickCrawl(dirPath, 0);
    return size;
  }

  const rootNode = await crawl(targetPath, 0);

  return {
    root: rootNode,
    summary: {
      targetPath,
      filesScanned,
      dirsScanned,
      totalBytes: totalBytesScanned,
      durationMs: Date.now() - startTime
    }
  };
}

/**
 * Scan all detected Windows storage drives and return a unified "This PC" root tree
 */
export async function scanAllDrives(options = {}, onProgress = null) {
  const drives = await getWindowsDrives();
  const startTime = Date.now();
  let totalFiles = 0;
  let totalDirs = 0;
  let totalBytes = 0;

  const pcRoot = {
    name: 'This PC',
    path: 'This PC',
    value: 0,
    isDirectory: true,
    isVirtualRoot: true,
    children: []
  };

  for (let i = 0; i < drives.length; i++) {
    const drive = drives[i];
    if (onProgress) {
      onProgress({
        driveIndex: i + 1,
        totalDrives: drives.length,
        currentDrive: drive.name,
        currentPath: drive.path,
        filesScanned: totalFiles,
        dirsScanned: totalDirs,
        totalBytesScanned: totalBytes,
        elapsedMs: Date.now() - startTime
      });
    }

    const driveResult = await scanDirectoryTree(
      drive.path,
      options,
      (p) => {
        if (onProgress) {
          onProgress({
            driveIndex: i + 1,
            totalDrives: drives.length,
            currentDrive: drive.name,
            currentPath: p.currentPath,
            filesScanned: totalFiles + p.filesScanned,
            dirsScanned: totalDirs + p.dirsScanned,
            totalBytesScanned: totalBytes + p.totalBytesScanned,
            elapsedMs: Date.now() - startTime
          });
        }
      }
    );

    if (driveResult && driveResult.root) {
      driveResult.root.name = drive.name;
      pcRoot.children.push(driveResult.root);
      pcRoot.value += driveResult.root.value;
      totalFiles += driveResult.summary.filesScanned;
      totalDirs += driveResult.summary.dirsScanned;
      totalBytes += driveResult.summary.totalBytes;
    }
  }

  // Sort drives by used size descending
  pcRoot.children.sort((a, b) => b.value - a.value);

  return {
    root: pcRoot,
    summary: {
      targetPath: 'This PC (All Drives)',
      drivesCount: drives.length,
      filesScanned: totalFiles,
      dirsScanned: totalDirs,
      totalBytes: totalBytes,
      durationMs: Date.now() - startTime
    }
  };
}

/**
 * Move file or folder safely to Windows Recycle Bin
 */
export async function moveToRecycleBin(targetPath) {
  const sanitizedPath = targetPath.replace(/"/g, '""');
  const psScript = `
    Add-Type -AssemblyName Microsoft.VisualBasic
    $p = "${sanitizedPath}"
    if (Test-Path -LiteralPath $p) {
      if ((Get-Item -LiteralPath $p) -is [System.IO.DirectoryInfo]) {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($p, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin)
      } else {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin)
      }
      Write-Output "SUCCESS"
    } else {
      Write-Output "NOT_FOUND"
    }
  `;

  const { stdout, stderr } = await execPromise(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`);
  if (stdout.includes('SUCCESS')) {
    return { success: true, path: targetPath };
  } else {
    throw new Error(stderr || stdout || 'Failed to move to Recycle Bin');
  }
}

/**
 * Open Windows File Explorer and highlight the item
 */
export async function revealInExplorer(targetPath) {
  const sanitizedPath = targetPath.replace(/"/g, '""');
  await execPromise(`explorer.exe /select,"${sanitizedPath}"`);
  return { success: true };
}


/**
 * Recursive directory stats calculator
 */
async function getFolderStats(dirs) {
  let size = 0, fileCount = 0;
  const paths = Array.isArray(dirs) ? dirs : [dirs];
  for (const dir of paths) {
    if (!fs.existsSync(dir)) continue;
    async function walk(p) {
      try {
        const entries = await fs.promises.readdir(p, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(p, entry.name);
          if (entry.isDirectory()) {
            await walk(full);
          } else if (entry.isFile()) {
            try {
              const st = await fs.promises.stat(full);
              size += st.size;
              fileCount++;
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    await walk(dir);
  }
  return { size, fileCount };
}

/**
 * Discover all profile cache directories for Chromium browsers (Chrome, Edge, Brave, etc.)
 */
function getChromiumCacheDirs(baseUserDataPath) {
  if (!fs.existsSync(baseUserDataPath)) return [];
  const dirs = [];
  try {
    const entries = fs.readdirSync(baseUserDataPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && (entry.name === 'Default' || entry.name.startsWith('Profile '))) {
        dirs.push(path.join(baseUserDataPath, entry.name, 'Cache'));
        dirs.push(path.join(baseUserDataPath, entry.name, 'Code Cache'));
        dirs.push(path.join(baseUserDataPath, entry.name, 'GPUCache'));
        dirs.push(path.join(baseUserDataPath, entry.name, 'DawnGraphiteCache'));
        dirs.push(path.join(baseUserDataPath, entry.name, 'DawnWebGPUCache'));
      }
    }
  } catch (e) {}
  return dirs;
}

/**
 * Scan for common junk locations for Smart Clean
 */
export async function scanSmartJunk() {
  const localAppData = process.env.LOCALAPPDATA || '';
  const appData = process.env.APPDATA || '';
  const systemRoot = process.env.SystemRoot || 'C:\\Windows';

  const chromeCacheDirs = getChromiumCacheDirs(path.join(localAppData, 'Google', 'Chrome', 'User Data'));
  const edgeCacheDirs = getChromiumCacheDirs(path.join(localAppData, 'Microsoft', 'Edge', 'User Data'));
  const discordCacheDirs = [
    path.join(appData, 'discord', 'Cache'),
    path.join(appData, 'discord', 'Code Cache'),
    path.join(appData, 'discord', 'GPUCache'),
    path.join(appData, 'discord', 'discord_asset_cache')
  ];

  const targets = [
    {
      id: 'user_temp',
      name: 'User Temporary Files (%TEMP%)',
      paths: [process.env.TEMP || path.join(localAppData, 'Temp')],
      description: 'Temporary files created by running applications and installers.',
      safe: true,
      category: 'System'
    },
    {
      id: 'windows_temp',
      name: 'Windows System Temp',
      paths: [path.join(systemRoot, 'Temp')],
      description: 'Temporary files generated by OS services and updates.',
      safe: true,
      category: 'System'
    },
    {
      id: 'windows_update_cache',
      name: 'Windows Update Downloads',
      paths: [path.join(systemRoot, 'SoftwareDistribution', 'Download')],
      description: 'Downloaded Windows updates that have already been installed.',
      safe: true,
      category: 'System'
    },
    {
      id: 'crash_dumps',
      name: 'Crash Dumps & Error Reports',
      paths: [path.join(localAppData, 'CrashDumps')],
      description: 'Application error logs and memory crash dumps.',
      safe: true,
      category: 'System'
    },
    {
      id: 'chrome_cache',
      name: 'Google Chrome Cache',
      paths: chromeCacheDirs,
      description: 'Cached images, scripts, code cache, and media from Chrome.',
      safe: false,
      category: 'Browsers'
    },
    {
      id: 'edge_cache',
      name: 'Microsoft Edge Cache',
      paths: edgeCacheDirs,
      description: 'Cached web assets, code cache, and media from Microsoft Edge.',
      safe: false,
      category: 'Browsers'
    },
    {
      id: 'discord_cache',
      name: 'Discord Media Cache',
      paths: discordCacheDirs,
      description: 'Images and stickers cached by Discord chat.',
      safe: true,
      category: 'Apps'
    }
  ];

  const results = [];

  for (const item of targets) {
    const stats = await getFolderStats(item.paths);
    if (stats.size > 0 || item.paths.some(p => fs.existsSync(p))) {
      results.push({
        id: item.id,
        name: item.name,
        paths: item.paths,
        path: item.paths[0] || '',
        description: item.description,
        safe: item.safe,
        category: item.category,
        size: stats.size,
        fileCount: stats.fileCount,
        formattedSize: formatBytes(stats.size)
      });
    }
  }

  // Also check Recycle Bin size with 32-bit signed int overflow fix
  try {
    const psScript = `(New-Object -ComObject Shell.Application).Namespace(0xa).Items() | Measure-Object -Property Size -Sum | Select-Object -ExpandProperty Sum`;
    const { stdout } = await execPromise(`powershell -NoProfile -Command "${psScript}"`);
    let rbBytes = parseInt(stdout.trim(), 10) || 0;
    if (rbBytes < 0) {
      rbBytes = rbBytes + 4294967296; // Fix 32-bit signed overflow when > 2GB or 4GB
    }

    results.unshift({
      id: 'recycle_bin',
      name: 'Windows Recycle Bin',
      paths: ['Recycle Bin'],
      path: 'Recycle Bin',
      description: 'Deleted files waiting in the trash bin.',
      safe: true,
      category: 'Trash',
      size: rbBytes,
      fileCount: 0,
      formattedSize: formatBytes(rbBytes)
    });
  } catch (e) {}

  return results;
}

/**
 * Clean selected smart junk targets
 */
export async function cleanSmartJunkItems(itemIds) {
  const junkList = await scanSmartJunk();
  const cleared = [];

  for (const id of itemIds) {
    if (id === 'recycle_bin') {
      try {
        await execPromise(`powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"`);
        cleared.push('recycle_bin');
      } catch (e) {}
      continue;
    }

    const item = junkList.find(j => j.id === id);
    if (!item) continue;

    const pathsToClean = item.paths || (item.path ? [item.path] : []);

    for (const dirPath of pathsToClean) {
      if (!fs.existsSync(dirPath)) continue;
      try {
        const entries = await fs.promises.readdir(dirPath);
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry);
          try {
            await fs.promises.rm(fullPath, { recursive: true, force: true });
          } catch (e) {
            // Skip files currently locked by open browsers or services
          }
        }
      } catch (e) {}
    }
    cleared.push(id);
  }

  return { success: true, cleared };
}
