import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { InterviewSetup, InterviewQuestion, InterviewReport } from '@/types/interview';

export type AIProvider = 'openai' | 'claude';

// 면접 질문 생성
export async function generateQuestions(
  apiKey: string,
  setup: InterviewSetup,
  provider: AIProvider = 'openai'
): Promise<InterviewQuestion[]> {
  const prompt = `당신은 전문 면접관입니다. 다음 지원자 정보를 바탕으로 면접 질문 7개를 생성해주세요.

지원자 정보:
- 지원 직무: ${setup.position}
- 경력 수준: ${setup.experience}
- 지원 회사: ${setup.company}
- 주요 기술/역량: ${setup.skills}
- 추가 정보: ${setup.additionalInfo || '없음'}

질문 구성:
- 기술 질문 (technical): 3개
- 행동 질문 (behavioral): 2개
- 상황 질문 (situational): 1개
- 컬처핏 질문 (culture): 1개

JSON 형식으로 응답해주세요:
[
  {
    "id": "q1",
    "category": "technical",
    "question": "질문 내용",
    "tips": "답변 팁"
  }
]`;

  if (provider === 'claude') {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      system: '당신은 한국어로 응답하는 전문 면접관입니다. JSON 형식으로만 응답합니다.',
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse questions:', e);
    }
  } else {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 한국어로 응답하는 전문 면접관입니다. JSON 형식으로만 응답합니다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '[]';

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse questions:', e);
    }
  }

  return [];
}

// 단일 답변 피드백 (스트리밍)
export async function* streamFeedback(
  apiKey: string,
  question: InterviewQuestion,
  answer: string,
  provider: AIProvider = 'openai'
): AsyncGenerator<string> {
  const prompt = `면접 질문과 지원자의 답변을 분석해주세요.

질문 (${question.category}): ${question.question}

지원자 답변: ${answer}

다음 형식으로 피드백을 제공해주세요:

**강점:**
- (답변에서 좋았던 점들)

**개선점:**
- (보완이 필요한 점들)

**예시 답변:**
(더 나은 답변 예시)

**점수: X/10**`;

  if (provider === 'claude') {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      system: '당신은 친절하고 건설적인 피드백을 제공하는 면접 코치입니다. 한국어로 응답합니다.',
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } else {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 친절하고 건설적인 피드백을 제공하는 면접 코치입니다. 한국어로 응답합니다.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

// 최종 리포트 생성
export async function generateReport(
  apiKey: string,
  setup: InterviewSetup,
  questions: InterviewQuestion[],
  answers: { questionId: string; answer: string }[],
  provider: AIProvider = 'openai'
): Promise<InterviewReport> {
  const qaList = questions.map((q, i) => {
    const answer = answers.find(a => a.questionId === q.id)?.answer || '(답변 없음)';
    return `Q${i + 1}. [${q.category}] ${q.question}\nA: ${answer}`;
  }).join('\n\n');

  const prompt = `면접 전체를 분석하고 종합 리포트를 작성해주세요.

지원자 정보:
- 직무: ${setup.position}
- 경력: ${setup.experience}
- 회사: ${setup.company}

면접 내용:
${qaList}

다음 JSON 형식으로 응답해주세요:
{
  "overallScore": (1-100 점수),
  "summary": "(전체 면접 요약)",
  "questionFeedbacks": [
    {
      "questionId": "q1",
      "strengths": ["강점1", "강점2"],
      "improvements": ["개선점1"],
      "suggestedAnswer": "예시 답변",
      "score": (1-10)
    }
  ],
  "generalAdvice": ["조언1", "조언2", "조언3"]
}`;

  if (provider === 'claude') {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: '당신은 전문 면접 코치입니다. JSON 형식으로만 응답합니다.',
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse report:', e);
    }
  } else {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '당신은 전문 면접 코치입니다. JSON 형식으로만 응답합니다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content || '{}';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse report:', e);
    }
  }

  return {
    overallScore: 0,
    summary: '리포트 생성에 실패했습니다.',
    questionFeedbacks: [],
    generalAdvice: []
  };
}
