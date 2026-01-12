'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('올바른 OpenAI API 키 형식이 아닙니다.');
      return;
    }

    onSave(apiKey.trim());
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
              OpenAI API 키 설정
            </h2>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              면접 질문 생성과 피드백을 위해 OpenAI API 키가 필요합니다.
              키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="sk-..."
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
