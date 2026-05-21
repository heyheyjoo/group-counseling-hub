import React, { useState, useEffect } from 'react';

interface TippTimerProps {
  sendSticker: (emoji: string) => void;
}

export const TippTimer: React.FC<TippTimerProps> = ({ sendSticker }) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [recentSticker, setRecentSticker] = useState<string | null>(null);

  const totalDuration = 60;
  const cycleDuration = 10;

  useEffect(() => {
    // Start timer automatically on mount
    setIsActive(true);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setHasCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  // Calculate breathing phase
  const elapsed = totalDuration - secondsLeft;
  const indexInCycle = elapsed % cycleDuration;
  // First 4s (0, 1, 2, 3) = Inhale; next 6s (4, 5, 6, 7, 8, 9) = Exhale
  const isInhale = secondsLeft > 0 && indexInCycle < 4;

  const remainingCycles = Math.max(0, Math.ceil(secondsLeft / cycleDuration));
  const stickers = ['💚', '🌿', '✨', '🌸', '☁️'];

  const handleSendSticker = (emoji: string) => {
    sendSticker(emoji);
    setRecentSticker(emoji);
    setTimeout(() => {
      setRecentSticker(null);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {!hasCompleted ? (
        <div style={styles.timerCard}>
          <div style={styles.topInfo}>
            <span style={styles.cycleBadge}>남은 호흡 사이클</span>
            <div style={styles.cycleCount}>
              <strong style={styles.highlight}>{remainingCycles}</strong> / 6 회
            </div>
          </div>

          <div style={styles.breathingArea}>
            <div
              style={{
                ...styles.breathingCircle,
                width: isInhale ? '200px' : '120px',
                height: isInhale ? '200px' : '120px',
                backgroundColor: isInhale ? '#A8D5C2' : '#FDFAF5',
                borderColor: isInhale ? '#81B8A1' : '#A8D5C2',
                color: isInhale ? '#FFFFFF' : '#4A4A4A',
                boxShadow: isInhale 
                  ? '0 0 40px rgba(168, 213, 194, 0.6)' 
                  : '0 4px 15px rgba(168, 213, 194, 0.2)',
                transition: isInhale 
                  ? 'width 4s ease-in-out, height 4s ease-in-out, background-color 1s ease, color 1s ease, border-color 1s ease, box-shadow 4s ease-in-out' 
                  : 'width 6s ease-in-out, height 6s ease-in-out, background-color 1s ease, color 1s ease, border-color 1s ease, box-shadow 6s ease-in-out',
              }}
            >
              <span style={styles.breathingText}>
                {isInhale ? '들이쉬어요' : '내쉬어요'}
              </span>
            </div>
          </div>

          <div style={styles.bottomInfo}>
            <div style={styles.timeLeftLabel}>전체 남은 시간</div>
            <div style={styles.timeValue}>{secondsLeft}초</div>
            <p style={styles.tipText}>
              {isInhale 
                ? '코로 숨을 깊고 부드럽게 들이마셔 보세요 (4초)' 
                : '입으로 끝까지 천천히 내쉬며 몸의 긴장을 풀어 보세요 (6초)'}
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.completedCard}>
          <div style={styles.successBadge}>✓ 1분 호흡 완료</div>
          <h2 style={styles.completedTitle}>마음 챙김 완료!</h2>
          <p style={styles.completedDesc}>
            긴장 완화 호흡을 무사히 마치셨습니다.<br />
            지금 함께하고 있는 집단원들과 선생님에게 <strong>따뜻한 마음의 스티커</strong>를 실시간으로 전송해 보세요.
          </p>

          {recentSticker && (
            <div style={styles.feedbackPopup}>
              {recentSticker} 전송 완료!
            </div>
          )}

          <div style={styles.stickerRow}>
            {stickers.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSendSticker(emoji)}
                style={styles.stickerBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.25)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(74,74,74,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div style={styles.waitingTeacherText}>
            선생님이 세션을 마무리할 때까지 대기해 주세요.
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
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '40px 16px',
    animation: 'fadeIn 0.5s ease-out',
    width: '100%',
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '36px 24px',
    boxShadow: '0 8px 24px var(--color-shadow)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(168, 213, 194, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topInfo: {
    marginBottom: '28px',
  },
  cycleBadge: {
    fontSize: '12px',
    color: '#7E7E7E',
    fontWeight: '700',
    backgroundColor: '#FDFAF5',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #E5E4E7',
  },
  cycleCount: {
    fontSize: '20px',
    color: '#4A4A4A',
    marginTop: '8px',
  },
  highlight: {
    color: '#81B8A1',
    fontSize: '28px',
    fontWeight: '700',
  },
  breathingArea: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: '20px',
  },
  breathingCircle: {
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
  },
  breathingText: {
    fontSize: '16px',
    fontWeight: '700',
  },
  bottomInfo: {
    width: '100%',
  },
  timeLeftLabel: {
    fontSize: '12px',
    color: '#7E7E7E',
  },
  timeValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4A4A4A',
    margin: '4px 0 12px',
  },
  tipText: {
    fontSize: '13px',
    color: '#7E7E7E',
    lineHeight: '1.5',
    maxWidth: '360px',
    margin: '0 auto',
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 8px 24px var(--color-shadow)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    border: '1.5px solid #A8D5C2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  successBadge: {
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 14px',
    borderRadius: '12px',
    border: '1px solid #A8D5C2',
    marginBottom: '20px',
  },
  completedTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '12px',
  },
  completedDesc: {
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  feedbackPopup: {
    position: 'absolute',
    top: '16px',
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    animation: 'popIn 0.3s ease-out',
  },
  stickerRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '32px',
    width: '100%',
  },
  stickerBtn: {
    fontSize: '36px',
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: '#FDFAF5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    border: '1.5px solid #E5E4E7',
  },
  waitingTeacherText: {
    fontSize: '12px',
    color: '#7E7E7E',
    backgroundColor: '#FDFAF5',
    padding: '8px 16px',
    borderRadius: '20px',
    width: '100%',
  },
};
