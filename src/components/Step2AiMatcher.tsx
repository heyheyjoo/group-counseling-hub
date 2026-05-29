import React, { useState, useEffect } from 'react';
import type { Issue } from '../hooks/useSharedState';
import { analyzeIssuesWithClaude } from '../services/claudeApi';
import type { TheoryRecommendation } from '../services/claudeApi';

interface Step2AiMatcherProps {
  mode: 'teacher' | 'student';
  onSelectTheory: (theory: string) => void;
  issues: Issue[];
}

// 폴백 데이터 (API Key 없거나 오류 시 사용)
const FALLBACK_RECOMMENDATIONS: TheoryRecommendation[] = [
  {
    theory: '변증법적 행동치료 (DBT)',
    matchRate: 98,
    reason:
      '집단원들의 고민에서 대인관계 갈등과 충동적 분노/감정조절 어려움의 키워드가 다수 검출되었습니다. DBT는 감정조절 장애와 대인관계 효율성 개선을 위한 TIPP(신체 감각 자극) 기법 및 마음챙김 호흡 훈련을 내포하고 있어 현 상태에 최적입니다.',
    tags: ['#감정조절', '#TIPP 기법', '#마음챙김 호흡'],
  }
];

const FALLBACK_KEYWORDS = [
  '대인관계 갈등',
  '감정 조절의 어려움',
  '충동적 분노',
  '공허함',
  '스트레스 내성 저하',
];

export const Step2AiMatcher: React.FC<Step2AiMatcherProps> = ({
  mode,
  onSelectTheory,
  issues,
}) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<TheoryRecommendation[]>([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'student') return;

    let cancelled = false;

    const runAnalysis = async () => {
      // 1단계: 키워드 태그 스태거 애니메이션 (AI 분석 중 표시)
      const placeholderTags = ['고민 수집 완료', 'AI 분석 시작...', '감정 패턴 파악 중', '이론 매칭 중', '결과 생성 중'];
      for (let i = 0; i < placeholderTags.length; i++) {
        await new Promise((res) => setTimeout(res, 500));
        if (cancelled) return;
        setVisibleTags((prev) => [...prev, placeholderTags[i]]);
      }

      // 2단계: Claude API 호출
      try {
        const result = await analyzeIssuesWithClaude(issues);
        if (cancelled) return;

        setRecommendations(result.recommendations);
        setIsAiGenerated(true);
        setVisibleTags(result.keywords);
      } catch (err) {
        if (cancelled) return;
        const errMsg = err instanceof Error ? err.message : 'UNKNOWN';
        if (errMsg === 'API_KEY_NOT_SET') {
          setErrorMsg('API Key가 설정되지 않아 기본 분석 결과를 표시합니다.');
        } else {
          setErrorMsg('Claude AI 분석 중 오류가 발생하여 기본 결과를 표시합니다.');
        }
        setRecommendations(FALLBACK_RECOMMENDATIONS);
        setVisibleTags(FALLBACK_KEYWORDS);
        setIsAiGenerated(false);
      } finally {
        if (!cancelled) setAnalyzing(false);
      }
    };

    runAnalysis();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ─── 학생 화면 ───────────────────────────────────────────
  if (mode === 'student') {
    return (
      <div style={styles.container}>
        <div style={styles.studentCard}>
          <div style={styles.pulseContainer}>
            <div style={styles.pulseInnerCircle} />
            <div style={styles.pulseOuterCircle} />
            <span style={styles.pulseIcon}>🧭</span>
          </div>
          <h2 style={styles.waitingTitle}>상담 기법 조율 중</h2>
          <p style={styles.waitingSub}>
            선생님이 집단원들이 제출한 고민을 분석하여<br />
            가장 알맞은 <strong>상담 치료 방법</strong>을 선택하고 계십니다. 잠시만 기다려 주세요.
          </p>
          <div style={styles.progressBar}>
            <div style={styles.progressBarFill} />
          </div>
        </div>
      </div>
    );
  }

  // ─── 선생님 화면 ─────────────────────────────────────────
  const topRec = recommendations[0];
  const altRecs = recommendations.slice(1);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>AI 분석 및 상담 이론 추천</h2>
        <p style={styles.sectionSub}>
          {isAiGenerated
            ? 'Claude AI가 실제 고민 내용을 분석하여 최적의 상담 기법을 추천합니다.'
            : '수집된 고민 키워드를 분석하여 효과가 검증된 상담 기법을 추천합니다.'}
        </p>
      </div>

      {analyzing ? (
        <div style={styles.loadingCard}>
          <div style={styles.spinnerWrapper}>
            <div style={styles.spinner} />
            {isAiGenerated && <div style={styles.aiGlow} />}
          </div>
          <p style={styles.loadingText}>
            Claude AI가 {issues.length}개의 고민을 심층 분석하는 중입니다...
          </p>

          <div style={styles.tagsContainer}>
            {visibleTags.map((tag, idx) => (
              <span key={idx} style={styles.keywordTag}>
                🔍 {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.recommendationWrapper}>

          {/* 오류 / 폴백 알림 */}
          {errorMsg && (
            <div style={styles.errorNotice}>
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* 1위 추천 카드 */}
          {topRec && (
            <div
              style={styles.dbtCard}
              onClick={() => onSelectTheory(topRec.theory)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(129, 184, 161, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(129, 184, 161, 0.1)';
              }}
            >
              <div style={styles.dbtBadgeRow}>
                <div style={styles.dbtBadge}>
                  추천도 {topRec.matchRate}% • 최적 기법
                </div>
                {isAiGenerated && (
                  <div style={styles.aiGeneratedBadge}>✨ Claude AI 분석 결과</div>
                )}
              </div>
              <div style={styles.dbtHeader}>
                <h3 style={styles.theoryTitle}>{topRec.theory}</h3>
                <span style={styles.selectPrompt}>선택하기 →</span>
              </div>
              <p style={styles.theoryDesc}>{topRec.reason}</p>
              <div style={styles.tagList}>
                {topRec.tags.map((tag, i) => (
                  <span key={i} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* 고민 키워드 뱃지 */}
          {visibleTags.length > 0 && (
            <div style={styles.keywordsSection}>
              <div style={styles.dividerTitle}>📊 분석된 주요 고민 키워드</div>
              <div style={styles.keywordsRow}>
                {visibleTags.map((kw, i) => (
                  <span key={i} style={styles.kwBadge}>🔍 {kw}</span>
                ))}
              </div>
            </div>
          )}

          {altRecs.length > 0 && (
            <>
              <div style={styles.dividerTitle}>다른 제안된 대안 기법</div>
              <div style={styles.alternativesGrid}>
                {altRecs.map((rec) => (
                  <div
                    key={rec.theory}
                    style={styles.altCard}
                    onClick={() => onSelectTheory(rec.theory)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    <div style={styles.altBadge}>매칭률 {rec.matchRate}%</div>
                    <h4 style={styles.altTitle}>{rec.theory}</h4>
                    <p style={styles.altDesc}>{rec.reason}</p>
                    <div style={styles.tagListSmall}>
                      {rec.tags.map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    animation: 'fadeIn 0.5s ease-out',
    alignItems: 'center',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '8px',
  },
  sectionSub: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '48px 32px',
    boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)',
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
    marginTop: '40px',
    border: '1px solid rgba(168, 213, 194, 0.15)',
  },
  pulseContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseIcon: {
    fontSize: '32px',
    zIndex: 3,
  },
  pulseInnerCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#A8D5C2',
    opacity: 0.25,
    zIndex: 1,
  },
  pulseOuterCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#A8D5C2',
    opacity: 0.15,
    zIndex: 2,
    animation: 'float 2s infinite ease-in-out',
  },
  waitingTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '12px',
  },
  waitingSub: {
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#FDFAF5',
    borderRadius: '2px',
    overflow: 'hidden',
    width: '80%',
    margin: '0 auto',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A8D5C2',
    width: '50%',
    borderRadius: '2px',
    animation: 'float 1.5s infinite ease-in-out',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '48px 32px',
    boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)',
    maxWidth: '640px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '300px',
    justifyContent: 'center',
  },
  spinnerWrapper: {
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #FDFAF5',
    borderTop: '4px solid #A8D5C2',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
  },
  aiGlow: {
    position: 'absolute',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,213,194,0.3) 0%, transparent 70%)',
    animation: 'float 2s infinite ease-in-out',
  },
  loadingText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4A4A4A',
    margin: '20px 0 24px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    maxWidth: '480px',
  },
  keywordTag: {
    backgroundColor: '#FDFAF5',
    border: '1px solid #A8D5C2',
    color: '#4A4A4A',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500',
    animation: 'tagFadeIn 0.3s ease-out forwards',
  },
  recommendationWrapper: {
    maxWidth: '800px',
    width: '100%',
  },
  errorNotice: {
    backgroundColor: '#FFF8EC',
    border: '1.5px solid #F4C2A1',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#7E5C3C',
    fontWeight: '500',
  },
  dbtBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  dbtCard: {
    backgroundColor: '#FFFFFF',
    border: '2.5px solid #A8D5C2',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 6px 18px rgba(129, 184, 161, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    marginBottom: '24px',
  },
  dbtBadge: {
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 14px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(129, 184, 161, 0.3)',
    display: 'inline-block',
  },
  aiGeneratedBadge: {
    backgroundColor: '#F0EBFF',
    color: '#7C5CBF',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #C8B4F0',
    display: 'inline-block',
  },
  dbtHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    marginTop: '4px',
  },
  theoryTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4A4A4A',
  },
  selectPrompt: {
    fontSize: '14px',
    color: '#81B8A1',
    fontWeight: '700',
  },
  theoryDesc: {
    fontSize: '14px',
    color: '#4A4A4A',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  tagList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '12px',
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    padding: '4px 12px',
    borderRadius: '8px',
    fontWeight: '700',
  },
  keywordsSection: {
    marginBottom: '24px',
  },
  keywordsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  kwBadge: {
    backgroundColor: '#FDFAF5',
    border: '1px solid #A8D5C2',
    color: '#4A4A4A',
    padding: '5px 12px',
    borderRadius: '14px',
    fontSize: '12px',
    fontWeight: '500',
  },
  dividerTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#7E7E7E',
    marginBottom: '16px',
    textAlign: 'left',
  },
  alternativesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  altCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    border: '1.5px solid #E5E4E7',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  altBadge: {
    fontSize: '11px',
    color: '#7E7E7E',
    fontWeight: '700',
    marginBottom: '8px',
  },
  altTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '8px',
  },
  altDesc: {
    fontSize: '13px',
    color: '#7E7E7E',
    lineHeight: '1.5',
    marginBottom: '16px',
    flex: 1,
  },
  tagListSmall: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    fontSize: '12px',
    color: '#81B8A1',
  },
};
