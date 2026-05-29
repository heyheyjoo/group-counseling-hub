import type { Issue } from '../hooks/useSharedState';

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
// 1. 고민 분석 및 상담 이론 추천 (Mock Data)
// ─────────────────────────────────────────────────────────
export async function analyzeIssuesWithClaude(issues: Issue[]): Promise<AnalysisResult> {
  // 모의 지연 (API 호출을 흉내냄)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const result: AnalysisResult = {
    recommendations: [
      {
        theory: '변증법적 행동치료 (DBT)',
        matchRate: 98,
        reason: '제출된 고민들에서 감정조절의 어려움, 대인관계 불안, 충동성 등이 두드러집니다. 이런 경우 고통 감내와 감정 조절 기법을 훈련하는 변증법적 행동치료(DBT)가 매우 효과적입니다.',
        tags: ['#감정조절', '#충동성감소', '#고통감내', '#대인관계']
      }
    ],
    keywords: ['감정 조절', '충동성', '대인관계 불안', '스트레스', '공허함']
  };

  return result;
}

// ─────────────────────────────────────────────────────────
// 2. 세션 종합 리포트 자동 생성 (Mock Data)
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
  // 모의 지연 (API 호출을 흉내냄)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const issuesSummary = input.issues.slice(0, 3).map(i => i.text).join(', ');
  
  return `오늘 세션에서는 총 ${input.issueCount}개의 고민이 접수되었으며, 주된 심리적 특성으로 학업 및 진로에 대한 불안감이 관찰되었습니다. ${input.theory} 이론을 기반으로 한 접근과 ${input.toolkits.join(', ')} 기법을 활용하여 참여자들의 부정적 인지를 다루고 정서적 이완을 돕고자 했습니다. 집단원 간 ${input.stickerCount}개의 긍정 스티커가 교환되는 등 상호 지지적인 분위기가 형성되었습니다. 향후 세션에서도 이러한 긍정적 자원 교환이 지속된다면 학생들의 심리적 회복탄력성이 크게 향상될 것으로 기대됩니다.`;
}
