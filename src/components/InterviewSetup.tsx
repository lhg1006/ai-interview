'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InterviewSetup as ISetup } from '@/types/interview';

interface InterviewSetupProps {
  onStart: (setup: ISetup) => void;
  isLoading: boolean;
}

const experienceLevels = [
  { value: 'new', label: '신입 (0-1년)' },
  { value: 'junior', label: '주니어 (1-3년)' },
  { value: 'mid', label: '미드레벨 (3-5년)' },
  { value: 'senior', label: '시니어 (5-10년)' },
  { value: 'lead', label: '리드/매니저 (10년+)' },
];

export default function InterviewSetup({ onStart, isLoading }: InterviewSetupProps) {
  const [setup, setSetup] = useState<ISetup>({
    position: '',
    experience: 'junior',
    company: '',
    skills: '',
    additionalInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setup.position && setup.company) {
      onStart(setup);
    }
  };

  const isValid = setup.position.trim() && setup.company.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          면접 정보 입력
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          맞춤형 면접 질문을 생성하기 위해 정보를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 지원 직무 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            지원 직무 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={setup.position}
            onChange={(e) => setSetup({ ...setup, position: e.target.value })}
            placeholder="예: 프론트엔드 개발자, 백엔드 엔지니어, PM..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 경력 수준 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            경력 수준
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setSetup({ ...setup, experience: level.value })}
                className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                  setup.experience === level.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* 지원 회사 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            지원 회사 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={setup.company}
            onChange={(e) => setSetup({ ...setup, company: e.target.value })}
            placeholder="예: 토스, 카카오, 네이버..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 주요 기술/역량 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            주요 기술/역량
          </label>
          <input
            type="text"
            value={setup.skills}
            onChange={(e) => setSetup({ ...setup, skills: e.target.value })}
            placeholder="예: React, TypeScript, Node.js, AWS..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 추가 정보 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            추가 정보 (선택)
          </label>
          <textarea
            value={setup.additionalInfo}
            onChange={(e) => setSetup({ ...setup, additionalInfo: e.target.value })}
            placeholder="면접에서 강조하고 싶은 경험이나 프로젝트가 있다면 적어주세요..."
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 시작 버튼 */}
        <motion.button
          type="submit"
          disabled={!isValid || isLoading}
          whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
          whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin\" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              질문 생성 중...
            </span>
          ) : (
            '면접 시작하기'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
