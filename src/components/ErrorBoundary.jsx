import React from 'react';
import { AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Sakura Cleaner caught an error in component tree:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, copied: false });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleCopy = () => {
    if (this.state.error) {
      navigator.clipboard.writeText(this.state.error.stack || this.state.error.toString());
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fff0f3] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-sakura-200 shadow-kawaii text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sakura-100 flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">
              🌸
            </div>
            <h2 className="text-lg font-black text-sakura-900 font-cute">
              Oopsie! Something went wrong (｡•́︿•̀｡)
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sakura Cleaner caught an unexpected error while rendering this view. Don't worry, your data and files are completely safe!
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-rose-600 max-h-36 overflow-y-auto select-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sakura-500 to-pink-500 hover:from-sakura-600 hover:to-pink-600 text-white font-bold text-xs shadow-kawaii transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleCopy}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-sakura-50 hover:bg-sakura-100 text-sakura-700 font-bold text-xs border border-sakura-200 transition-colors"
              >
                {this.state.copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{this.state.copied ? 'Copied' : 'Copy Error'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
