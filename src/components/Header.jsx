import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RefreshCw, PieChart, LayoutGrid, ListTree, Globe, Info, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({
  viewMode,
  setViewMode,
  onOpenSmartClean,
  onRefreshDrives,
  onOpenAbout,
  isScanning
}) {
  const { lang, changeLanguage, t, languages } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header className="kawaii-glass sticky top-0 z-30 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl shadow-kawaii mb-6 transition-all duration-300">
      <div className="flex items-center justify-between gap-2 md:gap-4 flex-nowrap">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-shrink">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sakura-400 to-pink-300 flex items-center justify-center text-xl sm:text-2xl shadow-glow-pink animate-float flex-shrink-0">
            🌸
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-sakura-600 via-pink-500 to-rose-400 bg-clip-text text-transparent whitespace-nowrap">
                {t('appName')}
              </h1>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-sakura-100 text-sakura-700 border border-sakura-200 whitespace-nowrap flex-shrink-0">
                {t('version')}
              </span>
            </div>
            <p className="text-xs text-sakura-700 font-medium truncate hidden xl:block max-w-[260px]">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-sakura-100/80 p-1 sm:p-1.5 rounded-2xl border border-sakura-200 shadow-inner flex-shrink-0">
          <button
            onClick={() => setViewMode('pie')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === 'pie'
                ? 'bg-white text-sakura-600 shadow-sm'
                : 'text-sakura-700 hover:text-sakura-900'
            }`}
            title={t('pieChart')}
          >
            <PieChart className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('pieChart')}</span>
          </button>

          <button
            onClick={() => setViewMode('treemap')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === 'treemap'
                ? 'bg-white text-sakura-600 shadow-sm'
                : 'text-sakura-700 hover:text-sakura-900'
            }`}
            title={t('treemap')}
          >
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('treemap')}</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === 'list'
                ? 'bg-white text-sakura-600 shadow-sm'
                : 'text-sakura-700 hover:text-sakura-900'
            }`}
            title={t('list')}
          >
            <ListTree className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('list')}</span>
          </button>
        </div>

        {/* Action Buttons, Language Dropdown & Info (i) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Cute Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-sakura-700 border border-sakura-200 shadow-sm hover:shadow transition-all text-xs font-bold flex-shrink-0 whitespace-nowrap"
              title={t('language') || 'Language'}
            >
              <Globe className="w-3.5 h-3.5 text-sakura-500 flex-shrink-0" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.label}</span>
              <ChevronDown className={`w-3 h-3 text-sakura-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-sakura-200 py-1.5 z-50 animate-scale-up">
                {languages.map((l) => {
                  const isSelected = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-sakura-100/80 text-sakura-800 font-bold'
                          : 'text-gray-700 hover:bg-sakura-50 hover:text-sakura-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sakura-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* (i) Information / About Button */}
          <button
            onClick={onOpenAbout}
            title={t('infoBtn')}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-sakura-600 hover:text-sakura-800 border border-sakura-200 shadow-sm hover:shadow transition-all group flex-shrink-0"
          >
            <Info className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>

          {/* Refresh Drives Button */}
          <button
            onClick={onRefreshDrives}
            title={t('refreshDrives')}
            disabled={isScanning}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-sakura-600 hover:text-sakura-800 border border-sakura-200 shadow-sm hover:shadow transition-all disabled:opacity-50 flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          </button>

          {/* Smart Clean Button */}
          <button
            onClick={onOpenSmartClean}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sakura-500 to-pink-500 hover:from-sakura-600 hover:to-pink-600 text-white font-bold text-xs shadow-kawaii hover:shadow-glow-pink transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-yellow-200 flex-shrink-0" />
            <span>{t('smartCleanBtn')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
