'use client';

import { motion } from 'framer-motion';
import { InterviewReport as IReport, InterviewQuestion } from '@/types/interview';

interface InterviewReportProps {
  report: IReport;
  questions: InterviewQuestion[];
  onRestart: () => void;
}

export default function InterviewReport({ report, questions, onRestart }: InterviewReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          면접 결과 리포트
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI가 분석한 면접 결과입니다
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">종합 점수</p>
        <div className={`mb-4 text-6xl font-bold ${getScoreColor(report.overallScore)}`}>
          {report.overallScore}
          <span className="text-2xl text-gray-400">/100</span>
        </div>
        <div className="mx-auto h-3 max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={`h-full bg-gradient-to-r ${getScoreGradient(report.overallScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${report.overallScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          종합 평가
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{report.summary}</p>
      </motion.div>

      {/* Question Feedbacks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          질문별 피드백
        </h3>

        {report.questionFeedbacks.map((feedback, index) => {
          const question = questions.find((q) => q.id === feedback.questionId);
          return (
            <motion.div
              key={feedback.questionId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Q{index + 1}</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {question?.question || '질문'}
                  </p>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(feedback.score * 10)}`}>
                  {feedback.score}/10
                </span>
              </div>

              {/* Strengths */}
              {feedback.strengths.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1 text-xs font-medium text-green-600 dark:text-green-400">강점</p>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-green-500">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1 text-xs font-medium text-orange-600 dark:text-orange-400">개선점</p>
                  <ul className="space-y-1">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-orange-500">→</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Answer */}
              {feedback.suggestedAnswer && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">예시 답변</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.suggestedAnswer}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* General Advice */}
      {report.generalAdvice.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20"
        >
          <h3 className="mb-3 text-lg font-semibold text-purple-900 dark:text-purple-100">
            전반적인 조언
          </h3>
          <ul className="space-y-2">
            {report.generalAdvice.map((advice, i) => (
              <li key={i} className="flex items-start gap-2 text-purple-800 dark:text-purple-200">
                <span>💡</span> {advice}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Restart Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onRestart}
        className="w-full rounded-xl border-2 border-gray-300 py-4 font-bold text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        새로운 면접 시작하기
      </motion.button>
    </div>
  );
}
