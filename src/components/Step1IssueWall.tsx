import React, { useState } from 'react';
import type { Issue } from '../hooks/useSharedState';

interface Step1IssueWallProps {
  mode: 'teacher' | 'student';
  issues: Issue[];
  addIssue: (text: string, emoji: string) => void;
  fillDummyIssues: () => void;
  onNext: () => void;
}

export const Step1IssueWall: React.FC<Step1IssueWallProps> = ({
  mode,
  issues,
  addIssue,
  fillDummyIssues,
  onNext,
}) => {
  // Student State
  const [worryText, setWorryText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😢');
  const [showSuccess, setShowSuccess] = useState(false);

  const emojis = ['😢', '😰', '😡', '😔', '🔥'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryText.trim()) return;
    
    addIssue(worryText.trim(), selectedEmoji);
    setWorryText('');
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  if (mode === 'student') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.sectionTitle}>나의 마음 터놓기</h2>
          <p style={styles.sectionSub}>누구에게도 털어놓지 못했던 나만의 고민이나 마음을 익명으로 솔직하게 적어 보세요.</p>
        </div>

        {showSuccess && (
          <div style={styles.successBanner}>
            <div style={styles.successIcon}>✓</div>
            <div>
              <strong>고민이 성공적으로 제출되었습니다!</strong>
              <div style={styles.successSub}>작성하신 내용은 선생님 화면에 실시간으로 전달됩니다.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.studentCard}>
          <div style={styles.formGroup}>
            <label style={styles.label}>지금 내 마음 상태를 가장 잘 보여주는 표정은?</label>
            <div style={styles.emojiSelector}>
              {emojis.map((emoji) => {
                const isSelected = selectedEmoji === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      ...styles.emojiBtn,
                      backgroundColor: isSelected ? '#A8D5C2' : '#FDFAF5',
                      borderColor: isSelected ? '#81B8A1' : '#E5E4E7',
                      transform: isSelected ? 'scale(1.15)' : 'none',
                    }}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>고민이나 털어놓고 싶은 감정을 들려주세요 (익명)</label>
            <textarea
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              placeholder="여기에 솔직한 마음을 작성해 주세요. 작성된 모든 내용은 익명으로 보장되며, 집단 전체가 건강하게 고민을 해결하는 데 활용됩니다."
              style={styles.textarea}
              maxLength={200}
              required
            />
            <div style={styles.charCount}>{worryText.length}/200자</div>
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0A481'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F4C2A1'}
          >
            익명으로 고민 올리기
          </button>
        </form>
      </div>
    );
  }

  // Teacher View
  const isAiReady = issues.length >= 5;

  return (
    <div style={styles.container}>
      <div style={styles.teacherHeader}>
        <div>
          <h2 style={styles.sectionTitle}>실시간 고민 수집 벽</h2>
          <p style={styles.sectionSub}>학생들이 익명으로 보내는 감정과 고민들이 실시간으로 수집되는 화면입니다.</p>
        </div>
        <div style={styles.statBadge}>
          수집된 고민 <strong style={styles.statCount}>{issues.length}</strong>개
        </div>
      </div>

      {/* Control Buttons */}
      <div style={styles.controlsRow}>
        <button
          onClick={fillDummyIssues}
          style={styles.dummyBtn}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EBE5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          💡 시연용 더미 데이터 5개 채우기
        </button>

        <button
          onClick={onNext}
          disabled={!isAiReady}
          style={{
            ...styles.nextBtn,
            backgroundColor: isAiReady ? '#A8D5C2' : '#E5E4E7',
            cursor: isAiReady ? 'pointer' : 'not-allowed',
            color: isAiReady ? '#4A4A4A' : '#7E7E7E',
            border: isAiReady ? '2px solid #81B8A1' : '2px solid #D5D3D6',
          }}
          onMouseEnter={(e) => {
            if (isAiReady) {
              e.currentTarget.style.backgroundColor = '#81B8A1';
              e.currentTarget.style.color = '#FFFFFF';
            }
          }}
          onMouseLeave={(e) => {
            if (isAiReady) {
              e.currentTarget.style.backgroundColor = '#A8D5C2';
              e.currentTarget.style.color = '#4A4A4A';
            }
          }}
        >
          {isAiReady ? '✨ AI 분석 및 상담 이론 추천' : '🔒 고민이 5개 이상 필요합니다'}
        </button>
      </div>

      {issues.length === 0 ? (
        <div style={styles.emptyWall}>
          <div style={styles.emptyIcon}>💬</div>
          <p style={styles.emptyText}>아직 등록된 고민이 없습니다.</p>
          <p style={styles.emptySubText}>학생 탭에서 고민을 등록하거나 더미 데이터를 채워주세요.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {issues.map((issue, idx) => {
            // Apply slight random rotation for realistic post-it feel
            const rotation = (idx % 3 === 0) ? '-1.5deg' : (idx % 3 === 1) ? '1.2deg' : '-0.8deg';
            return (
              <div
                key={issue.id}
                style={{
                  ...styles.postIt,
                  transform: `rotate(${rotation})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(74, 74, 74, 0.1)';
                  e.currentTarget.style.zIndex = '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${rotation})`;
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 74, 74, 0.05)';
                  e.currentTarget.style.zIndex = '1';
                }}
              >
                <div style={styles.postItPin} />
                <div style={styles.postItHeader}>
                  <span style={styles.postItEmoji}>{issue.emoji}</span>
                  <span style={styles.postItTime}>{issue.createdAt}</span>
                </div>
                <div style={styles.postItContent}>{issue.text}</div>
                <div style={styles.postItFooter}>익명 집단원</div>
              </div>
            );
          })}
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
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  teacherHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
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
  statBadge: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #A8D5C2',
    padding: '8px 16px',
    borderRadius: '24px',
    fontSize: '14px',
    color: '#4A4A4A',
    boxShadow: '0 2px 6px rgba(168, 213, 194, 0.1)',
  },
  statCount: {
    color: '#81B8A1',
    fontWeight: '700',
    fontSize: '17px',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 6px 16px var(--color-shadow)',
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto',
    border: '1px solid rgba(244, 194, 161, 0.15)',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#4A4A4A',
  },
  emojiSelector: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
  },
  emojiBtn: {
    flex: 1,
    fontSize: '26px',
    padding: '10px',
    borderRadius: '12px',
    border: '2px solid',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textarea: {
    width: '100%',
    height: '140px',
    borderRadius: '12px',
    border: '1.5px solid #E5E4E7',
    padding: '16px',
    fontSize: '14px',
    resize: 'none',
    color: '#4A4A4A',
    transition: 'border-color 0.3s ease',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '12px',
    color: '#7E7E7E',
    marginTop: '6px',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#F4C2A1',
    color: '#4A4A4A',
    fontWeight: '700',
    fontSize: '16px',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(244, 194, 161, 0.2)',
    transition: 'background-color 0.2s ease',
  },
  successBanner: {
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto 20px',
    backgroundColor: '#EBF7F2',
    border: '1.5px solid #A8D5C2',
    color: '#4A4A4A',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    animation: 'popIn 0.4s ease-out',
  },
  successIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    flexShrink: 0,
  },
  successSub: {
    fontSize: '12px',
    opacity: 0.8,
    marginTop: '2px',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  dummyBtn: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #E5E4E7',
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    color: '#4A4A4A',
    boxShadow: '0 2px 6px var(--color-shadow)',
    transition: 'all 0.2s ease',
  },
  nextBtn: {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '15px',
    boxShadow: '0 4px 12px var(--color-shadow)',
    transition: 'all 0.3s ease',
  },
  emptyWall: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px dashed #E5E4E7',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.7,
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '4px',
  },
  emptySubText: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
    padding: '10px 0',
  },
  postIt: {
    backgroundColor: '#FFFFFF',
    padding: '24px 20px 20px',
    borderRadius: '2px',
    boxShadow: '0 4px 10px rgba(74, 74, 74, 0.05)',
    borderLeft: '5px solid #A8D5C2',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '180px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'default',
  },
  postItPin: {
    position: 'absolute',
    top: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#F4C2A1',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  postItHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  postItEmoji: {
    fontSize: '24px',
  },
  postItTime: {
    fontSize: '11px',
    color: '#7E7E7E',
  },
  postItContent: {
    fontSize: '14px',
    color: '#4A4A4A',
    flex: 1,
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  postItFooter: {
    textAlign: 'right',
    fontSize: '12px',
    color: '#81B8A1',
    fontWeight: '700',
    marginTop: '12px',
    borderTop: '1.5px dashed #F3EFEA',
    paddingTop: '8px',
  },
};
