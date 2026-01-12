'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProvider } from '@/lib/openai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, provider: AIProvider) => void;
  currentProvider?: AIProvider;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, currentProvider = 'openai' }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>(currentProvider);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    if (provider === 'openai' && !apiKey.startsWith('sk-')) {
      setError('올바른 OpenAI API 키 형식이 아닙니다. (sk-로 시작)');
      return;
    }

    if (provider === 'claude' && !apiKey.startsWith('sk-ant-')) {
      setError('올바른 Claude API 키 형식이 아닙니다. (sk-ant-로 시작)');
      return;
    }

    onSave(apiKey.trim(), provider);
    setApiKey('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              API 키 설정
            </h2>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              면접 질문 생성과 피드백을 위해 API 키가 필요합니다.
              키는 브라우저에만 저장됩니다.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Provider Selection */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI 제공자 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('openai');
                      setError('');
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      provider === 'openai'
                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                    }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                    </svg>
                    OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProvider('claude');
                      setError('');
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      provider === 'claude'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                    }`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.709 15.955l4.72-2.647.08-.08-.08-.08-2.086-1.2-5.207 2.967.08.08 2.493-.96v1.92zm8.478-7.487l-3.958 2.247v4.013l7.916-4.493-.08-.08-3.878.313zm-3.958 8.527l3.958 2.246.08-.08v-3.686l-3.958-2.246-.08.08v3.686zm4.038-12.94L9.23 6.302l-.08.08.08.08 2.086 1.2 5.207-2.967-.08-.08-2.493.96V3.655l-.08.08-.603.32zm3.678 6.934l-3.598-2.007-.08.08v3.925l3.598 2.007.08-.08V10.99zm-12.236.24v4.254l.08.08 3.598-2.007v-4.334l-.08-.08-3.598 2.087z"/>
                    </svg>
                    Claude
                  </button>
                </div>
              </div>

              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

              {error && (
                <p className="mb-3 text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-500 py-3 font-medium text-white hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
