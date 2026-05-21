import React, { useState, useEffect } from 'react';

interface Step2AiMatcherProps {
  mode: 'teacher' | 'student';
  onSelectTheory: (theory: string) => void;
}

export const Step2AiMatcher: React.FC<Step2AiMatcherProps> = ({ mode, onSelectTheory }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  
  const allTags = ['대인관계 갈등', '학업 긴장', '감정 조절의 어려움', '충동적 분노', '부모님 소통 부재'];

  useEffect(() => {
    if (mode === 'student') return; // Student just waits

    // Staggered tags appearance
    const tagTimers = allTags.map((tag, idx) => {
      return setTimeout(() => {
        setVisibleTags((prev) => [...prev, tag]);
      }, (idx + 1) * 500); // 500ms, 1000ms, 1500ms, etc.
    });

    // End analyzing state after 3 seconds
    const finishTimer = setTimeout(() => {
      setAnalyzing(false);
    }, 3200);

    return () => {
      tagTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [mode]);

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

  // Teacher View
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>AI 분석 및 상담 이론 추천</h2>
        <p style={styles.sectionSub}>수집된 고민 키워드를 분석하여 효과가 검증된 상담 기법을 추천합니다.</p>
      </div>

      {analyzing ? (
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>집단원들의 고민 키워드를 분석하는 중입니다...</p>
          
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
          {/* Main recommendation (DBT) */}
          <div 
            style={styles.dbtCard}
            onClick={() => onSelectTheory('변증법적 행동치료 (DBT)')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(129, 184, 161, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(129, 184, 161, 0.1)';
            }}
          >
            <div style={styles.dbtBadge}>추천도 94% • 최적 기법</div>
            <div style={styles.dbtHeader}>
              <h3 style={styles.theoryTitle}>변증법적 행동치료 (DBT)</h3>
              <span style={styles.selectPrompt}>선택하기 →</span>
            </div>
            <p style={styles.theoryDesc}>
              집단원들의 고민에서 <strong>대인관계 갈등</strong>과 <strong>충동적 분노/감정조절 어려움</strong>의 키워드가 다수 검출되었습니다. 
              DBT는 감정조절 장애와 대인관계 효율성 개선을 위한 TIPP(신체 감각 자극) 기법 및 마음챙김 호흡 훈련을 내포하고 있어 현 상태에 최적입니다.
            </p>
            <div style={styles.tagList}>
              <span style={styles.tag}>#감정조절</span>
              <span style={styles.tag}>#TIPP 기법</span>
              <span style={styles.tag}>#마음챙김 호흡</span>
            </div>
          </div>

          <div style={styles.dividerTitle}>다른 제안된 대안 기법</div>

          {/* Alternative recommendations (CBT & SFBT) */}
          <div style={styles.alternativesGrid}>
            <div 
              style={styles.altCard}
              onClick={() => onSelectTheory('인지행동치료 (CBT)')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={styles.altBadge}>매칭률 76%</div>
              <h4 style={styles.altTitle}>인지행동치료 (CBT)</h4>
              <p style={styles.altDesc}>부정적 인지왜곡 및 시험 스트레스 등 사고 패턴 교정에 유용합니다.</p>
              <div style={styles.tagListSmall}>
                <span>#생각기록장</span>
                <span>#자동적사고</span>
              </div>
            </div>

            <div 
              style={styles.altCard}
              onClick={() => onSelectTheory('해결중심 단기치료 (SFBT)')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={styles.altBadge}>매칭률 68%</div>
              <h4 style={styles.altTitle}>해결중심 단기치료 (SFBT)</h4>
              <p style={styles.altDesc}>과거 원인 규명보다는 예외적 상황을 찾아 해결책을 모색하는 강점 기반 치료입니다.</p>
              <div style={styles.tagListSmall}>
                <span>#기적질문</span>
                <span>#예외질문</span>
              </div>
            </div>
          </div>
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
    boxShadow: '0 8px 24px var(--color-shadow)',
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
    animation: 'float 1.5s infinite ease-in-out', // reusable movement
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '48px 32px',
    boxShadow: '0 8px 24px var(--color-shadow)',
    maxWidth: '640px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '300px',
    justifyContent: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #FDFAF5',
    borderTop: '4px solid #A8D5C2',
    borderRadius: '50%',
    animation: 'popIn 1s infinite linear', // using rotate styled inline
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
  dbtCard: {
    backgroundColor: '#FFFFFF',
    border: '2.5px solid #A8D5C2',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 6px 18px rgba(129, 184, 161, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    marginBottom: '32px',
  },
  dbtBadge: {
    position: 'absolute',
    top: '-14px',
    left: '32px',
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 14px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(129, 184, 161, 0.3)',
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
  },
  tag: {
    fontSize: '12px',
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    padding: '4px 12px',
    borderRadius: '8px',
    fontWeight: '700',
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
  },
};

// Add rotation style block inside component manually since spinner doesn't run default css rotates
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner-active {
      animation: spin 1s infinite linear !important;
    }
  `;
  document.head.appendChild(style);
}
