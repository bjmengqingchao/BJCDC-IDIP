import React from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  content: string;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, loading, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-medical-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={20} className="animate-pulse" />
            <h3 className="font-bold text-lg">AI 智能防控研判</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto min-h-[200px] text-slate-700 leading-relaxed">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-12 h-12 border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Gemini 正在分析全市疫情数据...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3">
                <AlertCircle className="text-yellow-600 shrink-0" size={18} />
                <p className="text-xs text-yellow-800">
                    此报告由AI生成，仅供参考。具体防控措施请以市疾控中心官方发布为准。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
