import React from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumbs({ nodePath = [], onNavigateToLevel }) {
  const { t } = useLanguage();
  if (!nodePath || nodePath.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs py-2 px-4 bg-white/70 rounded-xl border border-sakura-200/60 shadow-sm mb-4 overflow-x-auto whitespace-nowrap">
      {nodePath.map((node, index) => {
        const isRoot = index === 0;
        const isCurrent = index === nodePath.length - 1;

        let displayName = node.name;
        if (node.path === 'This PC') {
          displayName = t('thisPC');
        } else if (isRoot && !displayName) {
          displayName = t('root');
        }

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-sakura-300 flex-shrink-0" />
            )}
            <button
              onClick={() => onNavigateToLevel(index)}
              disabled={isCurrent}
              className={`flex items-center gap-1 transition-colors ${
                isCurrent
                  ? 'text-sakura-800 font-bold bg-sakura-100/70 px-2 py-0.5 rounded-lg'
                  : 'text-sakura-600 hover:text-sakura-900 font-medium hover:underline'
              }`}
            >
              {isRoot ? (
                <span className="font-bold">🌸 {displayName}</span>
              ) : (
                <>
                  <Folder className="w-3 h-3 text-sakura-400" />
                  <span>{displayName}</span>
                </>
              )}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
