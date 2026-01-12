'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { InterviewQuestion, UserAnswer } from '@/types/interview';

interface InterviewSessionProps {
  questions: InterviewQuestion[];
  onComplete: (answers: UserAnswer[]) => void;
  onFeedback: (question: InterviewQuestion, answer: string) => void;
  feedbackContent: string;
  isLoadingFeedback: boolean;
}

const categoryLabels: Record<string, string> = {
  technical: '기술',
  behavioral: '행동',
  situational: '상황',
  culture: '컬처핏',
};

const categoryColors: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  behavioral: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  situational: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  culture: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function InterviewSession({
  questions,
  onComplete,
  onFeedback,
  feedbackContent,
  isLoadingFeedback,
}: InterviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      answer: currentAnswer.trim(),
      timestamp: new Date(),
    };

    setAnswers((prev) => [...prev, answer]);
    setShowFeedback(true);
    onFeedback(currentQuestion, currentAnswer.trim());
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setShowFeedback(false);
    } else {
      // 면접 완료
      onComplete(answers);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>질문 {currentIndex + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Category Badge */}
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryColors[currentQuestion.category]}`}>
            {categoryLabels[currentQuestion.category]}
          </span>

          {/* Question */}
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h3>

          {/* Tips */}
          {currentQuestion.tips && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              💡 {currentQuestion.tips}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Answer Section */}
      {!showFeedback ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="답변을 입력해주세요... (충분히 구체적으로 작성할수록 더 좋은 피드백을 받을 수 있습니다)"
            rows={6}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            className="w-full rounded-xl bg-blue-500 py-4 font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
          >
            답변 제출 및 피드백 받기
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* User Answer */}
          <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-700">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">내 답변:</p>
            <p className="text-gray-800 dark:text-gray-200">{currentAnswer}</p>
          </div>

          {/* AI Feedback */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">AI 피드백:</p>
            {isLoadingFeedback && !feedbackContent ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                피드백 생성 중...
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-p:my-3 prose-ul:my-2 prose-strong:block prose-strong:mt-4 prose-strong:mb-2">
                <ReactMarkdown>{feedbackContent}</ReactMarkdown>
                {isLoadingFeedback && <span className="inline-block h-4 w-1 animate-pulse bg-blue-500 ml-1" />}
              </div>
            )}
          </div>

          {/* Next Button */}
          {!isLoadingFeedback && feedbackContent && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl"
            >
              {currentIndex < questions.length - 1 ? '다음 질문' : '면접 완료 및 리포트 보기'}
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
