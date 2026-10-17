import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MascotBanner from './components/MascotBanner';
import DriveSelector from './components/DriveSelector';
import Breadcrumbs from './components/Breadcrumbs';
import PieChart from './components/PieChart';
import TreemapChart from './components/TreemapChart';
import ListView from './components/ListView';
import ItemDetails from './components/ItemDetails';
import SmartCleanModal from './components/SmartCleanModal';
import AboutModal from './components/AboutModal';
import { Square } from 'lucide-react';
import { formatBytes } from './utils/formatters';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, lang } = useLanguage();
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isFullPCActive, setIsFullPCActive] = useState(false);
  const [viewMode, setViewMode] = useState('pie'); // 'pie' | 'treemap' | 'list'
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [scanSummary, setScanSummary] = useState(null);

  const [treeData, setTreeData] = useState(null);
  const [nodePath, setNodePath] = useState([]); // Hierarchical drill-down path stack
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrillLoading, setIsDrillLoading] = useState(false);

  // Active folder is the tip of the nodePath stack
  const activeNode = nodePath.length > 0 ? nodePath[nodePath.length - 1] : null;

  const [isSmartCleanOpen, setIsSmartCleanOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync scanning status and current language to Electron for close confirmation
  useEffect(() => {
    if (window.electronAPI?.setScanningStatus) {
      window.electronAPI.setScanningStatus(isScanning, lang);
    }
  }, [isScanning, lang]);

  // Prevent accidental tab/browser close when scanning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isScanning) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isScanning]);

  // Connect WebSocket for live scan updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.port === '5173' ? 'localhost:3001' : window.location.host;
    const ws = new WebSocket(`${protocol}//${host}`);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'scan_progress') {
          setScanProgress(msg);
        } else if (msg.type === 'scan_completed') {
          setIsScanning(false);
          setScanSummary(msg.summary);
          showToast(t('scanCompletedToast'), 'success');
        } else if (msg.type === 'scan_cancelled') {
          setIsScanning(false);
          showToast(t('scanCancelledToast'), 'info');
        } else if (msg.type === 'scan_error') {
          setIsScanning(false);
          showToast(t('errorToast', { msg: msg.error }), 'error');
        }
      } catch (err) {}
    };

    return () => {
      ws.close();
    };
  }, []);

  // Fetch drives on load
  const fetchDrives = async () => {
    try {
      const res = await fetch('/api/drives');
      const data = await res.json();
      if (data.success && data.drives.length > 0) {
        setDrives(data.drives);
        if (!selectedDrive) {
          setSelectedDrive(data.drives[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load drives', err);
      showToast('Could not load storage drives', 'error');
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // Cancel ongoing scan
  const handleCancelScan = async () => {
    try {
      await fetch('/api/scan-cancel', { method: 'POST' });
    } catch (e) {
      console.error('Failed to cancel scan', e);
    }
  };

  // Start single drive scanning
  const handleStartScan = async (targetPath) => {
    setIsScanning(true);
    setIsFullPCActive(false);
    setScanProgress(null);
    setScanSummary(null);
    setTreeData(null);
    setNodePath([]);
    setSelectedItem(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetPath, maxDepth: 7 })
      });
      const data = await res.json();
      if (data.success) {
        setTreeData(data.data);
        setNodePath([data.data]);
        setSelectedItem(data.data);
        setScanSummary(data.summary);
      } else if (data.cancelled) {
        showToast(t('scanCancelledToast'), 'info');
      } else {
        showToast(data.error || 'Scan failed', 'error');
      }
    } catch (err) {
      console.error('Scan request error', err);
      showToast('Error requesting scan', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Start Full PC scanning across all drives
  const handleStartScanAll = async () => {
    setIsScanning(true);
    setIsFullPCActive(true);
    setScanProgress(null);
    setScanSummary(null);
    setTreeData(null);
    setNodePath([]);
    setSelectedItem(null);

    try {
      const res = await fetch('/api/scan-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDepth: 7 })
      });
      const data = await res.json();
      if (data.success) {
        setTreeData(data.data);
        setNodePath([data.data]);
        setSelectedItem(data.data);
        setScanSummary(data.summary);
      } else if (data.cancelled) {
        showToast(t('scanCancelledToast'), 'info');
      } else {
        showToast(data.error || 'Full scan failed', 'error');
      }
    } catch (err) {
      console.error('Full scan request error', err);
      showToast('Error requesting full scan', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Deep scan an individual folder on demand when reaching deep paths
  const scanDeeperFolder = async (folderNode) => {
    if (!folderNode || !folderNode.path || folderNode.path === 'This PC') return;
    setIsDrillLoading(true);

    try {
      const res = await fetch('/api/scan-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: folderNode.path, maxDepth: 6 })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const fetchedChildren = data.data.children || [];
        folderNode.children = fetchedChildren;
        folderNode.hasMore = false;
        if (data.data.value && data.data.value > 0) {
          folderNode.value = data.data.value;
        }

        setNodePath((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].path === folderNode.path) {
            next[lastIdx] = { ...folderNode, children: fetchedChildren, hasMore: false };
          }
          return next;
        });

        setSelectedItem({ ...folderNode, children: fetchedChildren, hasMore: false });
      } else {
        showToast(data.error || 'Failed to scan deeper', 'error');
      }
    } catch (e) {
      console.error('Failed to scan deeper', e);
      showToast('Error exploring folder', 'error');
    } finally {
      setIsDrillLoading(false);
    }
  };

  // Drill down from upper level -> lower level
  const handleDrillDown = async (childFolder) => {
    if (!childFolder.isDirectory) return;
    setNodePath((prev) => [...prev, childFolder]);
    setSelectedItem(childFolder);

    // If folder has no loaded children or hasMore flag, automatically explore deeper!
    if (!childFolder.children || childFolder.children.length === 0 || childFolder.hasMore) {
      await scanDeeperFolder(childFolder);
    }
  };

  // Navigate back up one level
  const handleNavigateUp = () => {
    setNodePath((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : prev));
  };

  // Breadcrumb level click
  const handleNavigateToLevel = (levelIndex) => {
    setNodePath((prev) => prev.slice(0, levelIndex + 1));
  };

  // Open item in Windows File Explorer
  const handleOpenInExplorer = async (itemPath) => {
    try {
      const res = await fetch('/api/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: itemPath })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t('openedExplorerToast'), 'success');
      }
    } catch (e) {
      showToast(t('errorToast', { msg: 'Failed to open File Explorer' }), 'error');
    }
  };

  // Move item to Windows Recycle Bin
  const handleTrashItem = async (item) => {
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: item.path })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t('sentToTrashToast', { name: item.name }), 'success');
        if (selectedItem?.path === item.path) {
          setSelectedItem(null);
        }
        if (activeNode) {
          handleStartScan(activeNode.path);
        }
      } else {
        showToast(data.error || 'Failed to move to trash', 'error');
      }
    } catch (e) {
      showToast(t('errorToast', { msg: 'Error moving item to trash' }), 'error');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-kawaii-lg border text-xs font-bold flex items-center gap-2 animate-bounce ${
          toast.type === 'error'
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : 'bg-sakura-100 text-sakura-900 border-sakura-300'
        }`}>
          <span>{toast.type === 'error' ? '⚠️' : '🌸'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenSmartClean={() => setIsSmartCleanOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onRefreshDrives={fetchDrives}
        isScanning={isScanning}
      />

      {/* Cute Anime Mascot Banner */}
      <MascotBanner
        isScanning={isScanning}
        scanProgress={scanProgress}
        scanSummary={scanSummary}
        selectedItem={selectedItem}
        selectedDrive={selectedDrive}
        onCancelScan={handleCancelScan}
      />

      {/* Hard Drives Selector */}
      <DriveSelector
        drives={drives}
        selectedDrive={selectedDrive}
        onSelectDrive={(drive) => {
          setSelectedDrive(drive);
          setIsFullPCActive(false);
        }}
        onStartScan={handleStartScan}
        onStartScanAll={handleStartScanAll}
        onCancelScan={handleCancelScan}
        isScanning={isScanning}
        isFullPCActive={isFullPCActive}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        {/* Main Visualizer Area (3 cols) */}
        <div className="lg:col-span-3 kawaii-glass p-5 rounded-3xl border border-sakura-200/80 shadow-kawaii flex flex-col min-h-[600px]">
          {/* Breadcrumb Navigation */}
          {activeNode && (
            <Breadcrumbs
              nodePath={nodePath}
              onNavigateToLevel={handleNavigateToLevel}
            />
          )}

          {/* Chart or List or Empty State */}
          <div className="flex-1 flex flex-col justify-center">
            {isScanning ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-sakura-100 text-sakura-500 flex items-center justify-center text-4xl animate-bounce shadow-glow-pink mb-4">
                  🧹
                </div>
                <h3 className="text-base font-bold text-slate-800 font-cute">
                  {t('scanningTitle')}
                </h3>
                <p className="text-xs text-sakura-600 mt-1 max-w-md truncate">
                  {scanProgress?.currentPath || t('analyzingFolders')}
                </p>
                <div className="mt-3 text-xs font-mono text-slate-400">
                  {t('filesFoundSoFar', { count: scanProgress?.filesScanned?.toLocaleString() || 0 })}
                </div>
                <button
                  onClick={handleCancelScan}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-kawaii hover:shadow-glow-pink transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{t('cancelScan')}</span>
                </button>
              </div>
            ) : treeData ? (
              <div>
                {viewMode === 'pie' && (
                  <PieChart
                    currentNode={activeNode}
                    onDrillDown={handleDrillDown}
                    onSelectItem={setSelectedItem}
                    onNavigateUp={handleNavigateUp}
                    canNavigateUp={nodePath.length > 1}
                    onScanDeeper={scanDeeperFolder}
                    isDrillLoading={isDrillLoading}
                    onSwitchToListView={() => setViewMode('list')}
                  />
                )}
                {viewMode === 'treemap' && (
                  <TreemapChart
                    data={activeNode}
                    onSelectItem={setSelectedItem}
                    totalDriveBytes={selectedDrive?.totalBytes}
                  />
                )}
                {viewMode === 'list' && (
                  <ListView
                    node={activeNode}
                    onSelectItem={setSelectedItem}
                    onDrillDown={handleDrillDown}
                    onOpenInExplorer={handleOpenInExplorer}
                    onTrashItem={handleTrashItem}
                    onScanDeeper={scanDeeperFolder}
                    isDrillLoading={isDrillLoading}
                  />
                )}
              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-sakura-100/70 border border-sakura-200 flex items-center justify-center text-5xl mb-4 animate-float">
                  🌸
                </div>
                <h3 className="text-base font-bold text-slate-700 font-cute">
                  {t('noResultsTitle')}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {t('noResultsDesc')}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleStartScanAll}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sakura-500 via-pink-500 to-rose-500 hover:from-sakura-600 hover:to-rose-600 text-white font-bold text-xs shadow-kawaii hover:shadow-glow-pink transition-all flex items-center gap-2"
                  >
                    <span>{t('fullScanBtn')}</span>
                  </button>
                  {selectedDrive && (
                    <button
                      onClick={() => handleStartScan(selectedDrive.path)}
                      className="px-5 py-2.5 rounded-2xl bg-white hover:bg-sakura-50 text-sakura-700 border border-sakura-200 font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                    >
                      <span>{t('scanDriveOnly', { name: selectedDrive.name })}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Item Details Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <ItemDetails
            selectedItem={selectedItem}
            onOpenInExplorer={handleOpenInExplorer}
            onTrashItem={handleTrashItem}
          />
        </div>
      </div>

      {/* Smart Clean Modal */}
      <SmartCleanModal
        isOpen={isSmartCleanOpen}
        onClose={() => setIsSmartCleanOpen(false)}
        onCleanSuccess={() => {
          fetchDrives();
          showToast('Smart Clean complete! 🎉', 'success');
        }}
      />

      {/* About & Info (i) Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        authorInfo={{
          name: 'Trung Pham (LuckyVNN)',
          bio: 'Creator of Sakura Cleaner 🌸 (✿◡‿◡)',
          githubUrl: 'https://github.com/LuckyVNN/sakura-cleaner',
          releasesUrl: 'https://github.com/LuckyVNN/sakura-cleaner/releases'
        }}
      />
    </div>
  );
}
