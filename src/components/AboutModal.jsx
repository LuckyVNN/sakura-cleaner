import React, { useEffect } from 'react';
import { X, Info, Heart, Sparkles, MessageCircle, Code, ShieldCheck, User, Github, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutModal({ isOpen, onClose, authorInfo }) {
  const { t } = useLanguage();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const authorName = authorInfo?.name || t('authorName');
  const authorBio = authorInfo?.bio || 'Creator of Sakura Cleaner (✿◡‿◡)';
  const githubUrl = authorInfo?.githubUrl || 'https://github.com';
  const releasesUrl = authorInfo?.releasesUrl || 'https://github.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sakura-950/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white/95 rounded-3xl p-6 shadow-2xl border border-sakura-200 overflow-hidden z-10 animate-scale-up">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-sakura-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 mb-5 pb-4 border-b border-sakura-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sakura-400 via-pink-400 to-rose-300 flex items-center justify-center text-2xl shadow-glow-pink">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-sakura-600 to-pink-500 bg-clip-text text-transparent">
                  {t('aboutTitle')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sakura-100 text-sakura-600 border border-sakura-200">
                  {t('version')}
                </span>
              </div>
              <p className="text-xs text-sakura-700 font-medium mt-0.5">
                {t('aboutSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sakura-400 hover:text-sakura-700 hover:bg-sakura-100 transition-all"
            title={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3.5 relative z-10 max-h-[70vh] overflow-y-auto pr-1">
          {/* Author Card */}
          <div className="bg-gradient-to-r from-sakura-50/80 via-pink-50/50 to-sakura-50/80 p-4 rounded-2xl border border-sakura-200 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sakura-200/70 border border-sakura-300 flex items-center justify-center text-sakura-700 font-bold shadow-sm">
              <User className="w-6 h-6 text-sakura-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sakura-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-sakura-500 fill-sakura-400" />
                {t('authorTitle')}
              </span>
              <div className="text-sm font-bold text-gray-800 truncate">
                {authorName}
              </div>
              <div className="text-xs text-sakura-700 truncate">
                {authorBio}
              </div>
            </div>
          </div>

          {/* Quick Action Links: GitHub & Releases */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Github className="w-4 h-4 text-white" />
              <span>{t('githubRepoBtn')}</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>

            <a
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-sakura-500 to-pink-500 hover:from-sakura-600 hover:to-pink-600 text-white text-xs font-bold shadow-kawaii hover:shadow-glow-pink transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-4 h-4 text-yellow-200" />
              <span>{t('latestReleasesBtn')}</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>
          </div>

          {/* AMA & Questions Section */}
          <div className="bg-white/90 p-3.5 rounded-2xl border border-sakura-150 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sakura-700">
              <MessageCircle className="w-4 h-4 text-pink-500" />
              <span>{t('amaTitle')}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('amaText')}
            </p>
          </div>

          {/* Built With / Tech Stack */}
          <div className="bg-white/90 p-3.5 rounded-2xl border border-sakura-150 shadow-sm space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sakura-700">
              <Code className="w-4 h-4 text-sakura-500" />
              <span>{t('techStackTitle')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Electron 33', 'React 18', 'Apache ECharts 5', 'Tailwind CSS', 'Node.js', 'Express'].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-xl bg-sakura-50 text-sakura-700 border border-sakura-200 text-[11px] font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Safe Deletion Guarantee */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              {t('safeRecycleNote')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-sakura-100 flex items-center justify-between">
          <div className="text-[11px] text-sakura-600 font-medium flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-400 inline" />
            <span>& Sakura petals</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-bold text-xs shadow-kawaii transition-all"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
