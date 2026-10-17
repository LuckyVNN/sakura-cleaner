import React from 'react';
import { Folder, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function ListView({
  node,
  onSelectItem,
  onDrillDown,
  onOpenInExplorer,
  onTrashItem
}) {
  const { t } = useLanguage();

  if (!node || !node.children) {
    return (
      <div className="p-8 text-center text-slate-400">
        No folder contents to display.
      </div>
    );
  }

  const items = [...node.children].sort((a, b) => b.value - a.value);
  const total = node.value || 1;

  return (
    <div className="bg-white/80 rounded-2xl border border-sakura-200/70 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-sakura-50/80 border-b border-sakura-100 flex items-center justify-between text-xs font-bold text-sakura-800">
        <span>{t('nameAndPath', { count: items.length })}</span>
        <div className="flex items-center gap-12">
          <span>{t('proportion')}</span>
          <span>{t('sizeLabel')}</span>
          <span className="w-16 text-right">{t('actions')}</span>
        </div>
      </div>

      <div className="divide-y divide-sakura-50 max-h-[500px] overflow-y-auto">
        {items.map((item, idx) => {
          const percent = ((item.value / total) * 100).toFixed(1);
          return (
            <div
              key={idx}
              onClick={() => {
                onSelectItem(item);
                if (item.isDirectory && onDrillDown) {
                  onDrillDown(item);
                }
              }}
              className="px-5 py-3 flex items-center justify-between hover:bg-sakura-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                <div className={`p-2 rounded-xl flex-shrink-0 ${item.isDirectory ? 'bg-sakura-100 text-sakura-600' : 'bg-slate-100 text-slate-500'}`}>
                  {item.isDirectory ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-800 truncate flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.isDirectory && (
                      <span className="text-[10px] text-sakura-500 font-normal">
                        ({t('itemsCount', { count: item.children?.length || 0 })})
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.path}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Proportion Bar */}
                <div className="w-24 flex items-center gap-2">
                  <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sakura-500 h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-8 text-right font-mono">{percent}%</span>
                </div>

                {/* Formatted Size */}
                <span className="text-xs font-bold text-slate-700 w-20 text-right font-mono">
                  {formatBytes(item.value)}
                </span>

                {/* Quick Actions */}
                <div className="flex items-center gap-1.5 w-16 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenInExplorer(item.path);
                    }}
                    title={t('revealExplorer')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-sakura-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrashItem(item);
                    }}
                    title={t('sendRecycleBin')}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
