import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatBytes, kawaiiPalette } from '../utils/formatters';

export default function TreemapChart({
  data,
  onSelectItem,
  totalDriveBytes
}) {
  const option = useMemo(() => {
    if (!data) return {};

    function transformTree(node) {
      if (!node) return null;
      return {
        name: node.name,
        value: node.value,
        path: node.path,
        isDirectory: node.isDirectory,
        children: node.children ? node.children.map(transformTree).filter(Boolean) : []
      };
    }

    const chartData = [transformTree(data)];

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const { name, value, data: itemData } = params;
          const formatted = formatBytes(value);
          const percent = totalDriveBytes ? ((value / totalDriveBytes) * 100).toFixed(1) : null;
          return `
            <div style="font-family: 'Nunito', sans-serif; padding: 4px;">
              <div style="font-weight: bold; color: #e11d4d; margin-bottom: 2px;">
                ${itemData.isDirectory ? '📁 ' : '📄 '} ${name}
              </div>
              <div style="font-size: 12px; color: #475569;">
                Size: <b>${formatted}</b> ${percent ? `(${percent}%)` : ''}
              </div>
              <div style="font-size: 10px; color: #94a3b8; word-break: break-all; max-width: 280px; margin-top: 4px;">
                ${itemData.path || ''}
              </div>
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#fea3b4',
        borderWidth: 1,
        textStyle: { color: '#334155' },
        extraCssText: 'border-radius: 12px; box-shadow: 0 8px 24px rgba(244, 63, 104, 0.15);'
      },
      series: [
        {
          type: 'treemap',
          data: chartData,
          roam: false,
          leafDepth: 2,
          drillDownIcon: '🌸',
          breadcrumb: {
            show: true,
            top: 10,
            itemStyle: {
              color: '#ffe3e8',
              borderColor: '#fea3b4',
              textStyle: {
                color: '#be123e',
                fontFamily: 'Nunito',
                fontWeight: 'bold'
              }
            }
          },
          levels: [
            {
              itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2,
                gapWidth: 2
              }
            },
            {
              color: kawaiiPalette,
              colorMappingBy: 'id',
              itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2,
                gapWidth: 2
              }
            },
            {
              colorSaturation: [0.35, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 1,
                borderWidth: 1
              }
            }
          ]
        }
      ]
    };
  }, [data, totalDriveBytes]);

  const onEvents = {
    click: (params) => {
      if (params.data && onSelectItem) {
        onSelectItem(params.data);
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center relative">
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ width: '100%', height: '550px' }}
      />
    </div>
  );
}
