import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, AlertCircle, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function SmartCleanModal({
  isOpen,
  onClose,
  onCleanSuccess
}) {
  const { t } = useLanguage();
  const [junkList, setJunkList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [cleanResult, setCleanResult] = useState(null);

  const fetchJunk = async () => {
    setLoading(true);
    setCleanResult(null);
    try {
      const res = await fetch('/api/smart-junk');
      const data = await res.json();
      if (data.success) {
        setJunkList(data.junk);
        // Default select all safe items that have size > 0
        const safeIds = new Set(
          data.junk
            .filter((item) => item.safe && item.size > 0)
            .map((item) => item.id)
        );
        setSelectedIds(safeIds);
      }
    } catch (err) {
      console.error('Failed to load junk list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchJunk();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAllSafe = () => {
    const safeIds = new Set(
      junkList.filter((item) => item.safe && item.size > 0).map((item) => item.id)
    );
    setSelectedIds(safeIds);
  };

  // Calculate total reclaimable space for selected items
  const totalReclaimable = junkList
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.size, 0);

  const handleClean = async () => {
    if (selectedIds.size === 0) return;
    setCleaning(true);
    try {
      const res = await fetch('/api/clean-junk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: Array.from(selectedIds) })
      });
      const data = await res.json();
      if (data.success) {
        setCleanResult({
          cleared: data.cleared,
          reclaimedBytes: totalReclaimable
        });
        if (onCleanSuccess) onCleanSuccess();
        fetchJunk();
      }
    } catch (err) {
      console.error('Cleaning error', err);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="kawaii-glass w-full max-w-2xl rounded-3xl shadow-kawaii-lg border border-sakura-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sakura-100 via-pink-100 to-rose-100 border-b border-sakura-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-sakura-500 shadow-sm flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 font-cute flex items-center gap-2">
                <span>{t('smartCleanTitle')}</span>
                <span className="text-[10px] bg-sakura-200 text-sakura-800 font-bold px-2 py-0.5 rounded-full">
                  {t('safePresetsBadge')}
                </span>
              </h2>
              <p className="text-xs text-sakura-700">
                {t('smartCleanSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/70 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Success Banner if clean completed */}
          {cleanResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 border border-sakura-300 shadow-sm flex items-center gap-3 animate-wiggle">
              <div className="text-2xl">🎉</div>
              <div>
                <h4 className="font-bold text-xs text-sakura-900">
                  {t('cleanSuccessTitle', { size: formatBytes(cleanResult.reclaimedBytes) })}
                </h4>
                <p className="text-[11px] text-sakura-700">
                  {t('cleanSuccessSubtitle')}
                </p>
              </div>
            </div>
          )}

          {/* Quick Filter Bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">{t('detectedJunk')}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAllSafe}
                className="text-sakura-600 hover:text-sakura-800 font-bold underline"
              >
                {t('selectAllSafe')}
              </button>
              <button
                onClick={fetchJunk}
                disabled={loading}
                className="p-1 text-slate-400 hover:text-sakura-600"
                title="Rescan"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sakura-500 flex flex-col items-center gap-2">
              <div className="text-3xl animate-bounce">🧹</div>
              <span className="text-xs font-bold">{t('scanningJunk')}</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {junkList.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const hasFiles = item.size > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => hasFiles && toggleSelect(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-sakura-50/90 border-sakura-400 shadow-sm'
                        : 'bg-white/70 border-sakura-100 hover:border-sakura-200'
                    } ${!hasFiles ? 'opacity-50 cursor-default' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-sakura-500 border-sakura-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 truncate">
                            {item.name}
                          </span>
                          {item.safe ? (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-green-100 text-green-700 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> {t('safeBadge')}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-amber-100 text-amber-700 flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" /> {t('reviewBadge')}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-mono font-bold text-xs text-slate-700">
                        {item.formattedSize}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.fileCount} files
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white/90 border-t border-sakura-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">{t('reclaimableSpace')}</div>
            <div className="text-lg font-black text-sakura-600 font-mono">
              {formatBytes(totalReclaimable)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t('close')}
            </button>
            <button
              onClick={handleClean}
              disabled={cleaning || totalReclaimable === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sakura-500 to-pink-500 hover:from-sakura-600 hover:to-pink-600 text-white font-bold text-xs shadow-kawaii hover:shadow-glow-pink transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{cleaning ? t('cleaningProgress') : t('cleanWithLove')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
