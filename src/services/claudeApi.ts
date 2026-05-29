import type { Issue } from '../hooks/useSharedState';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const PROXY_URL = '/api/claude/v1/messages';

export interface TheoryRecommendation {
  theory: string;
  matchRate: number;
  reason: string;
  tags: string[];
}

export interface AnalysisResult {
  recommendations: TheoryRecommendation[];
  keywords: string[];
}

// ─────────────────────────────────────────────────────────
// 내부 헬퍼: Claude API 호출
// ─────────────────────────────────────────────────────────
async function callClaude(prompt: string): Promise<string> {
  if (!API_KEY || API_KEY.includes('여기에')) {
    throw new Error('API_KEY_NOT_SET');
  }

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API Error:', response.status, errorText);
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text as string;
}

// ─────────────────────────────────────────────────────────
// 1. 고민 분석 및 상담 이론 추천
// ─────────────────────────────────────────────────────────
export async function analyzeIssuesWithClaude(issues: Issue[]): Promise<AnalysisResult> {
  const issueListText = issues
    .map((issue, idx) => `${idx + 1}. [${issue.emoji}] ${issue.text}`)
    .join('\n');

  const prompt = `당신은 전문 임상심리사이자 집단상담 전문가입니다.
다음은 집단상담 세션에서 학생들이 익명으로 제출한 고민 목록입니다:

${issueListText}

위 고민들을 분석하여 아래 세 가지 상담 이론 중 가장 적합한 것을 추천하고 매칭률을 산출해주세요:
- DBT (변증법적 행동치료): 감정조절, 대인관계, 충동성 문제에 특화
- CBT (인지행동치료): 부정적 사고패턴, 불안, 우울에 특화
- SFBT (해결중심 단기치료): 강점 기반, 해결책 탐색, 자원 활용에 특화

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 다른 텍스트는 절대 포함하지 마세요:
{
  "recommendations": [
    {
      "theory": "이론명 (영문약어)",
      "matchRate": 숫자,
      "reason": "이 이론을 추천하는 구체적 이유 (고민 내용 기반, 2~3문장)",
      "tags": ["키워드1", "키워드2", "키워드3"]
    }
  ],
  "keywords": ["주요 키워드1", "키워드2", "키워드3", "키워드4", "키워드5"]
}

recommendations 배열에는 DBT, CBT, SFBT 순서로 3개 모두 포함하고, matchRate 합계는 238을 넘지 않게 하세요. 가장 높은 것이 1위입니다.`;

  const rawText = await callClaude(prompt);

  // JSON 파싱 (마크다운 코드블록 제거 후 파싱)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('JSON_PARSE_ERROR');
  const result = JSON.parse(jsonMatch[0]) as AnalysisResult;

  // matchRate 내림차순 정렬
  result.recommendations.sort((a, b) => b.matchRate - a.matchRate);

  return result;
}

// ─────────────────────────────────────────────────────────
// 2. 세션 종합 리포트 자동 생성
// ─────────────────────────────────────────────────────────
export interface SessionReportInput {
  date: string;
  theory: string;
  issueCount: number;
  stickerCount: number;
  toolkits: string[];
  issues: Issue[];
}

export async function generateSessionReport(input: SessionReportInput): Promise<string> {
  const issuesSummary = input.issues
    .slice(0, 8) // 최대 8개만 전달 (토큰 절약)
    .map((i) => `"${i.text}"`)
    .join(', ');

  const prompt = `당신은 전문 심리상담 보고서 작성가입니다.
다음 집단상담 세션 데이터를 바탕으로 전문적이고 따뜻한 종합 리포트를 작성해주세요.

세션 정보:
- 날짜: ${input.date}
- 적용 이론: ${input.theory}
- 수집된 고민 수: ${input.issueCount}개
- 집단원 간 긍정 스티커 교환: ${input.stickerCount}개
- 사용된 상담 기법: ${input.toolkits.join(', ')}
- 주요 고민 내용 발췌: ${issuesSummary}

다음 조건으로 리포트를 작성해주세요:
1. 3~4문장 분량
2. 집단의 주요 심리적 특성과 니즈를 진단하는 문장 1개
3. 적용된 이론과 기법의 효과를 서술하는 문장 1~2개
4. 집단원들의 긍정적 변화 가능성을 격려하는 마무리 문장 1개
5. 전문적이고 따뜻한 한국어 톤

리포트 텍스트만 응답하세요. 별도의 제목이나 JSON 형식 없이 순수 텍스트로만 작성하세요.`;

  const report = await callClaude(prompt);
  return report.trim();
}
