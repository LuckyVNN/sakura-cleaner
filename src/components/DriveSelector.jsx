import React from 'react';
import { HardDrive, Search, AlertCircle, Zap, Square } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function DriveSelector({
  drives,
  selectedDrive,
  onSelectDrive,
  onStartScan,
  onStartScanAll,
  onCancelScan,
  isScanning,
  isFullPCActive
}) {
  const { t } = useLanguage();

  const totalPCBytes = drives.reduce((sum, d) => sum + (d.totalBytes || 0), 0);
  const usedPCBytes = drives.reduce((sum, d) => sum + (d.usedBytes || 0), 0);
  const usedPCPercent = totalPCBytes > 0 ? Math.round((usedPCBytes / totalPCBytes) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 font-cute">
            <span>💾 {t('storageDrives')}</span>
            <span className="text-xs font-normal text-sakura-600 bg-sakura-100 px-2 py-0.5 rounded-full">
              {t('detectedCount', { count: drives.length })}
            </span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {t('usedOfTotal', {
              used: formatBytes(usedPCBytes),
              total: formatBytes(totalPCBytes),
              percent: usedPCPercent
            })}
          </span>
        </div>

        {/* Action Buttons: Full Scan & Cancel Scan */}
        <div className="flex items-center gap-2">
          {isScanning && onCancelScan && (
            <button
              onClick={onCancelScan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all shadow-kawaii bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-glow-pink animate-pulse transform hover:-translate-y-0.5 active:translate-y-0"
              title={t('cancelScan')}
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>{t('cancelScan')}</span>
            </button>
          )}

          {/* ⚡ Full PC Scan Button */}
          <button
            onClick={onStartScanAll}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all shadow-kawaii transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              isFullPCActive
                ? 'bg-gradient-to-r from-sakura-600 via-pink-600 to-rose-600 text-white ring-2 ring-sakura-400 shadow-glow-pink'
                : 'bg-gradient-to-r from-sakura-500 via-pink-500 to-rose-500 hover:from-sakura-600 hover:to-rose-600 text-white hover:shadow-glow-pink'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-pulse" />
            <span>{t('fullScanBtn')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {drives.map((drive) => {
          const isSelected = !isFullPCActive && selectedDrive?.id === drive.id;
          const isFull = drive.usedPercent > 85;

          return (
            <div
              key={drive.id}
              onClick={() => !isScanning && onSelectDrive(drive)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${
                isSelected
                  ? 'bg-white border-sakura-400 shadow-glow-pink ring-2 ring-sakura-300'
                  : 'bg-white/70 hover:bg-white border-sakura-100 hover:border-sakura-200 shadow-sm hover:shadow'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-sakura-500 text-white shadow-sm'
                        : 'bg-sakura-100 text-sakura-600 group-hover:bg-sakura-200'
                    }`}
                  >
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span>{drive.name}</span>
                      {drive.isSystem && (
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-semibold">
                          OS
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {t('freeOf', {
                        free: formatBytes(drive.freeBytes),
                        total: formatBytes(drive.totalBytes)
                      })}
                    </p>
                  </div>
                </div>

                {/* Scan Single Drive Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDrive(drive);
                    onStartScan(drive.path);
                  }}
                  disabled={isScanning}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-sakura-500 hover:bg-sakura-600 text-white shadow-sm'
                      : 'bg-sakura-50 hover:bg-sakura-100 text-sakura-700'
                  } disabled:opacity-50`}
                  title={t('scanSingleDrive', { name: drive.name })}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFull
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-sakura-400 to-pink-500'
                  }`}
                  style={{ width: `${drive.usedPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                <span>{t('percentUsed', { percent: drive.usedPercent })}</span>
                {isFull && (
                  <span className="text-rose-500 font-bold flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {t('almostFull')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
