import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Folder, ArrowUp, CornerDownRight, FileText } from 'lucide-react';
import { formatBytes, kawaiiPalette } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export default function PieChart({
  currentNode,
  onDrillDown,
  onSelectItem,
  onNavigateUp,
  canNavigateUp
}) {
  const { t } = useLanguage();

  const { chartData, rawItems, totalCurrentSize } = useMemo(() => {
    if (!currentNode || !currentNode.children || currentNode.children.length === 0) {
      return { chartData: [], rawItems: [], totalCurrentSize: currentNode?.value || 0 };
    }

    const sorted = [...currentNode.children].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);

    // Limit to top 8 items + 'Others' to keep pie chart clean and 60fps snappy
    const MAX_SLICES = 8;
    let slices = [];
    let othersSum = 0;
    let othersCount = 0;

    sorted.forEach((item, index) => {
      if (index < MAX_SLICES) {
        slices.push({
          name: item.name,
          value: item.value,
          itemData: item
        });
      } else {
        othersSum += item.value;
        othersCount++;
      }
    });

    if (othersCount > 0) {
      const othersLabel = t('others', { count: othersCount });
      slices.push({
        name: othersLabel,
        value: othersSum,
        itemData: {
          name: othersLabel,
          value: othersSum,
          isDirectory: false,
          isOthers: true,
          path: `${currentNode.path} (various smaller files)`
        }
      });
    }

    return {
      chartData: slices,
      rawItems: sorted,
      totalCurrentSize: total
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
              const name = params.name.length > 14 ? params.name.slice(0, 12) + '…' : params.name;
              return `${name}\n${params.percent}%`;
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
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
          📁
        </div>
        <h4 className="font-bold text-sm text-slate-800 font-cute">
          {currentNode ? t('noSubfolders', { name: currentNode.name }) : 'No data'}
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          {formatBytes(currentNode?.value || 0)}
        </p>
        {canNavigateUp && (
          <button
            onClick={onNavigateUp}
            className="mt-4 px-4 py-2 rounded-xl bg-sakura-100 hover:bg-sakura-200 text-sakura-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
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

      {/* Subfolder Clickable Pill Cards */}
      <div className="w-full mt-2 pt-3 border-t border-sakura-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          {t('subfolderTitle')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
          {rawItems.map((child, index) => {
            const percent = totalCurrentSize > 0 ? ((child.value / totalCurrentSize) * 100).toFixed(1) : 0;
            return (
              <div
                key={index}
                onClick={() => {
                  onSelectItem(child);
                  if (child.isDirectory) onDrillDown(child);
                }}
                className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  child.isDirectory
                    ? 'bg-sakura-50/70 hover:bg-sakura-100 border-sakura-200 text-sakura-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  {child.isDirectory ? (
                    <Folder className="w-3.5 h-3.5 text-sakura-500 flex-shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="truncate font-semibold text-[11px]">{child.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 font-mono text-[10px]">
                  <span className="font-bold">{formatBytes(child.value)}</span>
                  <span className="text-slate-400">({percent}%)</span>
                  {child.isDirectory && (
                    <CornerDownRight className="w-3 h-3 text-sakura-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
