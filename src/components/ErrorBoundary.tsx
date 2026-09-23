import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LeoFamily ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-amber-200 text-center space-y-6 shadow-sm max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-playfair text-2xl font-bold text-gray-800">
              {this.props.fallbackTitle || 'मॉड्यूल लोड करने में क्षणिक समस्या (Temporary Loading Notice)'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              इस अनुभाग का डेटा पुनः लोड करने के लिए नीचे दिए गए बटन पर क्लिक करें अथवा मुख्य पृष्ठ पर वापस जाएं।
            </p>
            {this.state.error && (
              <p className="text-[10px] font-mono text-rose-500 bg-rose-50 p-2 rounded-xl max-w-md mx-auto truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="bg-[#D97706] hover:bg-[#B45309] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>पुनः प्रयास करें (Retry)</span>
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>मुख्य पृष्ठ (Go to Hub)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
