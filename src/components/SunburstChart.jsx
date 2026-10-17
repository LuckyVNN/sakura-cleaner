import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatBytes, kawaiiPalette } from '../utils/formatters';

export default function SunburstChart({
  data,
  onSelectItem,
  totalDriveBytes
}) {
  const option = useMemo(() => {
    if (!data) return {};

    // Transform node tree to ECharts Sunburst format
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
      color: kawaiiPalette,
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
      series: {
        type: 'sunburst',
        data: chartData,
        radius: ['12%', '90%'],
        sort: undefined,
        emphasis: {
          focus: 'ancestor',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(244, 63, 104, 0.4)'
          }
        },
        levels: [
          {},
          {
            r0: '0%',
            r: '20%',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#ffffff',
              color: '#fda4af'
            },
            label: {
              rotate: 'tangential',
              fontSize: 11,
              fontWeight: 'bold',
              color: '#841433'
            }
          },
          {
            r0: '20%',
            r: '46%',
            itemStyle: {
              borderWidth: 1.5,
              borderColor: '#ffffff'
            },
            label: {
              align: 'right',
              fontSize: 10,
              color: '#475569'
            }
          },
          {
            r0: '46%',
            r: '72%',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#ffffff'
            },
            label: {
              position: 'outside',
              padding: 3,
              silent: false,
              fontSize: 9,
              color: '#64748b'
            }
          },
          {
            r0: '72%',
            r: '88%',
            itemStyle: {
              borderWidth: 0.5,
              borderColor: '#ffffff',
              opacity: 0.9
            },
            label: {
              show: false
            }
          }
        ]
      }
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
