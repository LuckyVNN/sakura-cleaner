import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Folder, ArrowUp, CornerDownRight, FileText, ListTree } from 'lucide-react';
import { formatBytes, kawaiiPalette } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function PieChart({
  currentNode,
  onDrillDown,
  onSelectItem,
  onNavigateUp,
  canNavigateUp,
  onScanDeeper,
  isDrillLoading,
  onSwitchToListView
}) {
  const { t } = useLanguage();

  const { chartData, rawItems, totalCurrentSize } = useMemo(() => {
    if (!currentNode || !currentNode.children || currentNode.children.length === 0) {
      return { chartData: [], rawItems: [], totalCurrentSize: currentNode?.value || 0 };
    }

    const sorted = [...currentNode.children].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);

    // Filter out any virtual others to ensure 100% clean real items
    const realItems = sorted.filter((item) => !item.isOthers);
    const backendOthers = sorted.filter((item) => item.isOthers);

    // Limit to top 6 items + 1 single unified 'Others' to keep pie chart clean and 60fps snappy
    const MAX_SLICES = 6;
    let slices = [];
    let topSlicesSum = 0;

    realItems.slice(0, MAX_SLICES).forEach((item) => {
      slices.push({
        name: item.name,
        value: item.value,
        itemData: item
      });
      topSlicesSum += item.value;
    });

    // Unify all remaining items and backend counts into ONE single clean Others slice
    const totalFolderSize = currentNode.value || total;
    const unifiedOthersSum = Math.max(0, totalFolderSize - topSlicesSum);
    const remainingCount = (realItems.length - Math.min(realItems.length, MAX_SLICES)) + backendOthers.reduce((acc, it) => acc + (it.count || 1), 0);

    if (unifiedOthersSum > 0 && remainingCount > 0) {
      const othersLabel = t('others', { count: remainingCount });
      slices.push({
        name: othersLabel,
        value: unifiedOthersSum,
        itemData: {
          name: othersLabel,
          value: unifiedOthersSum,
          isDirectory: false,
          isOthers: true,
          path: currentNode.path // Real parent folder path on disk
        }
      });
    }

    return {
      chartData: slices,
      rawItems: realItems,
      totalCurrentSize: totalFolderSize
    };
  }, [currentNode, t]);

  const option = useMemo(() => {
    if (chartData.length === 0) return {};

    return {
      color: kawaiiPalette,
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const item = params.data?.itemData;
          if (!item) return '';
          const formatted = formatBytes(params.value);
          const percent = params.percent;
          const isFolder = item.isDirectory;

          return `
            <div style="font-family: 'Nunito', sans-serif; padding: 6px; max-width: 280px;">
              <div style="font-weight: bold; color: #e11d4d; font-size: 13px; margin-bottom: 2px;">
                ${isFolder ? '📁 ' : '📄 '} ${params.name}
              </div>
              <div style="font-size: 12px; color: #334155;">
                ${t('sizeLabel')} <b>${formatted}</b> (${percent}%)
              </div>
              <div style="font-size: 10px; color: #94a3b8; word-break: break-all; margin-top: 4px;">
                ${item.path || ''}
              </div>
              ${isFolder ? `<div style="margin-top: 6px; font-size: 11px; font-weight: bold; color: #f43f68;">${t('clickToDrill')}</div>` : ''}
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#fea3b4',
        borderWidth: 1.5,
        textStyle: { color: '#334155' },
        extraCssText: 'border-radius: 14px; box-shadow: 0 10px 30px rgba(244, 63, 104, 0.2);'
      },
      series: [
        {
          name: currentNode?.name || 'Storage',
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#ffffff',
            borderWidth: 3
          },
          label: {
            show: true,
            formatter: (params) => {
              const safeName = params?.name || '';
              const name = safeName.length > 14 ? safeName.slice(0, 12) + '…' : safeName;
              return `${name}\n${params?.percent ?? 0}%`;
            },
            fontSize: 11,
            fontWeight: 'bold',
            color: '#475569'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bolder',
              color: '#841433'
            },
            itemStyle: {
              shadowBlur: 14,
              shadowOffsetX: 0,
              shadowColor: 'rgba(244, 63, 104, 0.35)'
            }
          },
          data: chartData
        }
      ]
    };
  }, [chartData, currentNode, t]);

  const onEvents = {
    click: (params) => {
      const item = params.data?.itemData;
      if (!item) return;

      onSelectItem(item);

      // If clicked item is a folder, drill down into it!
      if (item.isDirectory && onDrillDown) {
        onDrillDown(item);
      }
    }
  };

  if (!currentNode || chartData.length === 0) {
    if (isDrillLoading) {
      return (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center text-3xl mb-3 animate-spin shadow-glow-pink">
            🌸
          </div>
          <h4 className="font-bold text-sm text-slate-800 font-cute">
            {t('scanningDeeper', { name: currentNode?.name || '' })}
          </h4>
          <p className="text-xs text-sakura-600 mt-1 font-mono">
            {formatBytes(currentNode?.value || 0)}
          </p>
        </div>
      );
    }

    const hasValue = (currentNode?.value || 0) > 0;

    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
          📁
        </div>
        <h4 className="font-bold text-sm text-slate-800 font-cute">
          {hasValue
            ? t('noSubfolders', { name: currentNode?.name || '' })
            : t('folderEmpty', { name: currentNode?.name || '' })}
        </h4>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          {formatBytes(currentNode?.value || 0)}
        </p>

        {/* Scan Deeper button */}
        {currentNode?.isDirectory && onScanDeeper && (
          <button
            onClick={() => onScanDeeper(currentNode)}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sakura-500 via-pink-500 to-rose-500 hover:from-sakura-600 hover:to-rose-600 text-white font-bold text-xs shadow-kawaii hover:shadow-glow-pink transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <span>🔍</span>
            <span>{t('scanDeeperBtn')}</span>
          </button>
        )}

        {canNavigateUp && (
          <button
            onClick={onNavigateUp}
            className="mt-3 px-4 py-2 rounded-xl bg-sakura-100 hover:bg-sakura-200 text-sakura-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            <span>{t('goBackUp')}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative w-full">
      {/* Top Level Quick Action */}
      <div className="w-full flex items-center justify-between mb-2 px-2">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-bold text-sakura-700 font-cute">{t('level')}</span>
          <span className="font-bold text-slate-700 truncate max-w-xs">{currentNode.name}</span>
          <span className="text-slate-400 font-mono">({formatBytes(totalCurrentSize)})</span>
        </div>

        {canNavigateUp && (
          <button
            onClick={onNavigateUp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sakura-100 hover:bg-sakura-200 text-sakura-800 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t('goUpBtn')}</span>
          </button>
        )}
      </div>

      {/* Donut Chart Container */}
      <div className="w-full relative min-h-[440px] flex items-center justify-center">
        <ReactECharts
          option={option}
          onEvents={onEvents}
          style={{ width: '100%', height: '460px' }}
        />

        {/* Center Donut Info Badge */}
        <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center max-w-[150px] p-2">
          <span className="text-2xl animate-float">🌸</span>
          <span className="text-xs font-bold text-sakura-900 truncate max-w-full mt-1">
            {currentNode.name}
          </span>
          <span className="text-xs font-black text-sakura-600 font-mono">
            {formatBytes(totalCurrentSize)}
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">
            {t('clickSliceHint')}
          </span>
        </div>
      </div>

      {/* Clean Bottom Bar: Summary, Subfolders & Switch to List View */}
      <div className="w-full mt-2 pt-3 border-t border-sakura-100/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 mb-2">
          <div className="flex items-center gap-2 text-xs text-sakura-800 font-medium">
            <span>🌸</span>
            <span>
              {t('totalItemsSummary', {
                count: (rawItems || []).length.toLocaleString(),
                size: formatBytes(totalCurrentSize || 0)
              })}
            </span>
          </div>

          {onSwitchToListView && (
            <button
              onClick={onSwitchToListView}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sakura-500 to-pink-500 hover:from-sakura-600 hover:to-pink-600 text-white font-bold text-xs shadow-sm hover:shadow-glow-pink transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title={t('viewInListView')}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>{t('viewInListView')}</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* If there are direct subfolders, show a compact, clean chip row (directories only) */}
        {rawItems.filter((i) => i.isDirectory).length > 0 && (
          <div className="mt-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
              <span>{t('subfoldersCount', { count: rawItems.filter((i) => i.isDirectory).length })}</span>
              <span className="text-[10px] text-sakura-500 font-normal">{t('clickToDrill')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
              {rawItems
                .filter((i) => i.isDirectory)
                .slice(0, 8)
                .map((folder, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectItem(folder);
                      if (onDrillDown) onDrillDown(folder);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-sakura-100/80 border border-sakura-200 text-sakura-900 text-xs font-semibold shadow-2xs hover:shadow-sm transition-all group"
                    title={folder.path}
                  >
                    <Folder className="w-3 h-3 text-sakura-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{folder.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({formatBytes(folder.value)})</span>
                    <CornerDownRight className="w-2.5 h-2.5 text-sakura-400 flex-shrink-0" />
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
