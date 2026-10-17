import React from 'react';
import { formatBytes } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function MascotBanner({
  isScanning,
  scanProgress,
  scanSummary,
  selectedItem,
  selectedDrive
}) {
  const { t } = useLanguage();

  // Determine mascot expression and message
  let mascotAvatar = '🌸';
  let kaomoji = '(◕‿◕)';
  let speech = t('mascotIdle');

  if (isScanning && scanProgress) {
    mascotAvatar = '🧹';
    kaomoji = '(ง •̀_•́)ง';
    if (scanProgress.totalDrives) {
      speech = t('mascotFullScanSweeping', {
        index: scanProgress.driveIndex,
        total: scanProgress.totalDrives,
        drive: scanProgress.currentDrive || '',
        count: scanProgress.filesScanned?.toLocaleString() || 0,
        size: formatBytes(scanProgress.totalBytesScanned)
      });
    } else {
      speech = t('mascotSweeping', {
        path: scanProgress.currentPath || 'files',
        count: scanProgress.filesScanned?.toLocaleString() || 0,
        size: formatBytes(scanProgress.totalBytesScanned)
      });
    }
  } else if (selectedItem && selectedItem.value > 1024 * 1024 * 1024 * 10) { // > 10GB
    mascotAvatar = '👀';
    kaomoji = '(⊙_⊙)';
    speech = t('mascotHugeFolder', {
      name: selectedItem.name,
      size: formatBytes(selectedItem.value)
    });
  } else if (scanSummary) {
    mascotAvatar = '💖';
    kaomoji = '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧';
    speech = t('mascotScanComplete', {
      count: scanSummary.filesScanned?.toLocaleString() || 0,
      size: formatBytes(scanSummary.totalBytes),
      time: ((scanSummary.durationMs || 0) / 1000).toFixed(1)
    });
  }

  return (
    <div className="kawaii-glass p-4 rounded-2xl shadow-kawaii mb-6 border border-sakura-200/80 relative overflow-hidden transition-all">
      {/* Decorative background hearts/sparkles */}
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none">
        🌸
      </div>

      <div className="flex items-center gap-4">
        {/* Mascot Face Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sakura-200 to-pink-100 border-2 border-white shadow-md flex items-center justify-center text-3xl animate-bounce flex-shrink-0">
          {mascotAvatar}
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sakura-600 font-cute">{t('sakuraChan')}</span>
            <span className="text-xs text-sakura-400 font-mono">{kaomoji}</span>
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-700 truncate">
            {speech}
          </p>

          {/* Live Scan Progress Bar */}
          {isScanning && scanProgress && (
            <div className="mt-2.5">
              <div className="w-full bg-sakura-200/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sakura-400 via-pink-500 to-rose-400 h-2.5 rounded-full animate-pulse transition-all duration-300"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-sakura-700 mt-1">
                <span>📁 {t('foldersCount', { count: scanProgress.dirsScanned?.toLocaleString() || 0 })}</span>
                <span>📄 {t('filesCount', { count: scanProgress.filesScanned?.toLocaleString() || 0 })}</span>
                <span>⏱️ {t('elapsedTime', { time: ((scanProgress.elapsedMs || 0) / 1000).toFixed(1) })}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
