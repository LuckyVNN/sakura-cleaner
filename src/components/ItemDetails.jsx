import React, { useState } from 'react';
import { Folder, FileText, ExternalLink, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function ItemDetails({
  selectedItem,
  onOpenInExplorer,
  onTrashItem
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState(false);

  if (!selectedItem) {
    return (
      <div className="kawaii-glass p-5 rounded-2xl border border-sakura-200/60 shadow-sm text-center">
        <div className="text-3xl mb-2 opacity-50">🌸</div>
        <p className="text-xs font-semibold text-sakura-800 font-cute">{t('nothingSelected')}</p>
        <p className="text-[11px] text-slate-400 mt-1">
          {t('nothingSelectedDesc')}
        </p>
      </div>
    );
  }

  const handleCopyPath = () => {
    navigator.clipboard.writeText(selectedItem.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="kawaii-glass p-5 rounded-2xl border border-sakura-300 shadow-kawaii">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-2xl ${
          selectedItem.isDirectory
            ? 'bg-gradient-to-tr from-sakura-400 to-pink-300 text-white shadow-glow-pink'
            : 'bg-sakura-100 text-sakura-600'
        }`}>
          {selectedItem.isDirectory ? <Folder className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sakura-100 text-sakura-700">
              {selectedItem.isDirectory ? t('folderType') : (selectedItem.extension || 'File')}
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-800 truncate mt-0.5" title={selectedItem.name}>
            {selectedItem.name}
          </h3>
        </div>
      </div>

      {/* Size Card */}
      <div className="bg-sakura-50/80 rounded-xl p-3 border border-sakura-200/60 mb-4">
        <div className="text-[10px] text-sakura-700 font-bold uppercase font-cute">{t('occupiedSpace')}</div>
        <div className="text-2xl font-black text-sakura-700 font-mono mt-0.5">
          {formatBytes(selectedItem.value)}
        </div>
        {selectedItem.isDirectory && (
          <div className="text-[11px] text-slate-500 mt-1">
            {t('topLevelEntries', { count: selectedItem.children?.length || 0 })}
          </div>
        )}
      </div>

      {/* Path */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between">
          <span>{t('location')}</span>
          <button
            onClick={handleCopyPath}
            className="text-sakura-600 hover:text-sakura-800 flex items-center gap-1 font-semibold"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? t('copied') : t('copy')}</span>
          </button>
        </div>
        <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-sakura-100 break-all select-all font-mono">
          {selectedItem.path}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => onOpenInExplorer(selectedItem.path)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-sakura-50 text-sakura-700 font-bold text-xs border border-sakura-200 shadow-sm transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('revealExplorer')}</span>
        </button>

        {confirmTrash ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{t('confirmTrashTitle')}</span>
            </div>
            <p className="text-[10px] text-rose-600 mb-2">
              {t('confirmTrashDesc')}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onTrashItem(selectedItem);
                  setConfirmTrash(false);
                }}
                className="flex-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                {t('yesSendTrash')}
              </button>
              <button
                onClick={() => setConfirmTrash(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmTrash(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('sendRecycleBin')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
