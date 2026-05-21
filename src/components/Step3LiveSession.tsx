import React, { useEffect, useState } from 'react';
import { TippTimer } from './TippTimer';
import type { Sticker } from '../hooks/useSharedState';

interface Step3LiveSessionProps {
  mode: 'teacher' | 'student';
  stickers: Sticker[];
  sendSticker: (emoji: string) => void;
  onEndSession: () => void;
}

export const Step3LiveSession: React.FC<Step3LiveSessionProps> = ({
  mode,
  stickers,
  sendSticker,
  onEndSession,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Counselor's timer showing elapsed time of the active session
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (mode === 'teacher' && isActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isActive]);

  const formatTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (mode === 'student') {
    return (
      <div style={styles.studentContainer}>
        <TippTimer sendSticker={sendSticker} />
      </div>
    );
  }

  // Teacher View
  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* Left Panel - Counselor Guide (40% width) */}
        <div style={styles.leftPanel}>
          <div style={styles.panelHeader}>
            <span style={styles.liveIndicator}>● LIVE</span>
            <h3 style={styles.panelTitle}>상담자 가이드라인</h3>
          </div>

          <div style={styles.guidelineContent}>
            <h4 style={styles.guideSubtitle}>변증법적 행동치료(DBT) - TIPP 기법</h4>
            <p style={styles.guideDesc}>
              집단원들의 급격한 감정적 불안이나 충동성을 완화하기 위해 신체 감각을 자극하고 마음챙김 호흡을 돕는 기법입니다.
            </p>

            <div style={styles.guideStepCard}>
              <div style={styles.stepNum}>1</div>
              <div style={styles.stepText}>
                <strong>T (Temperature - 온도 자극)</strong><br />
                차가운 물을 세수하거나 얼음을 쥐어 감정적 흥분을 가라앉히도록 제안합니다.
              </div>
            </div>

            <div style={styles.guideStepCard}>
              <div style={styles.stepNum}>2</div>
              <div style={styles.stepText}>
                <strong>I (Intense Exercise - 강렬한 운동)</strong><br />
                가벼운 제자리 뛰기나 스트레칭을 통해 축적된 신체 에너지를 소모시킵니다.
              </div>
            </div>

            <div style={styles.guideStepCard}>
              <div style={styles.stepNum}>3</div>
              <div style={styles.stepText}>
                <strong>P (Paced Breathing - 조율된 호흡)</strong><br />
                학생 화면의 <strong>TippTimer</strong>를 함께 바라보며, 4초간 들이쉬고 6초간 천천히 내쉬는 1분 호흡을 차분히 지도합니다.
              </div>
            </div>

            <div style={styles.guideStepCard}>
              <div style={styles.stepNum}>4</div>
              <div style={styles.stepText}>
                <strong>P (Paired Muscle Relaxation - 점진적 이완)</strong><br />
                호흡이 끝난 뒤 온몸의 근육에 힘을 주었다가 한번에 툭 풀 수 있도록 유도합니다.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsActive(false);
              onEndSession();
            }}
            style={styles.endBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0A481'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F4C2A1'}
          >
            🏁 세션 종료 및 기록실 이동
          </button>
        </div>

        {/* Right Panel - Session Info & Stickers Board (60% width) */}
        <div style={styles.rightPanel}>
          <div style={styles.rightHeader}>
            <div>
              <h3 style={styles.panelTitle}>실시간 집단 반응 보드</h3>
              <p style={styles.panelSubText}>집단원들의 호흡 현황 및 감정 스티커 피드백이 실시간으로 동기화됩니다.</p>
            </div>
            <div style={styles.sessionTimer}>
              <span style={styles.timerLabel}>세션 시간</span>
              <div style={styles.timerDigits}>{formatTime(elapsedSeconds)}</div>
            </div>
          </div>

          {/* Sticker Board */}
          <div style={styles.stickerBoard}>
            <div style={styles.boardHeader}>
              <span>✨ 전송받은 감정 스티커 (총 {stickers.length}개)</span>
            </div>

            {stickers.length === 0 ? (
              <div style={styles.emptyStickers}>
                <div style={styles.emptyPulse}>🌸</div>
                <p style={styles.emptyStickerText}>호흡을 완료한 집단원들의 응원이 여기에 나타납니다.</p>
                <p style={styles.emptyStickerSubText}>학생 탭의 타이머 완료 후 이모지 스티커를 클릭해 보세요.</p>
              </div>
            ) : (
              <div style={styles.stickersGrid}>
                {stickers.slice(-16).map((sticker) => (
                  <div key={sticker.id} style={styles.stickerCard}>
                    <span style={styles.stickerEmoji}>{sticker.emoji}</span>
                    <span style={styles.stickerTag}>집단원</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
  studentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: '70vh',
  },
  layout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  leftPanel: {
    flex: '2 1 400px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 12px var(--color-shadow)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid rgba(168, 213, 194, 0.15)',
    minHeight: '600px',
  },
  rightPanel: {
    flex: '3 1 550px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 12px var(--color-shadow)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(168, 213, 194, 0.15)',
    minHeight: '600px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1.5px dashed #F3EFEA',
    paddingBottom: '12px',
  },
  liveIndicator: {
    color: '#E0A481',
    fontWeight: '700',
    fontSize: '13px',
    backgroundColor: '#FBE6D8',
    padding: '2px 8px',
    borderRadius: '12px',
    animation: 'float 1.5s infinite ease-in-out',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4A4A4A',
  },
  guidelineContent: {
    flex: 1,
    marginBottom: '24px',
  },
  guideSubtitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#81B8A1',
    marginBottom: '8px',
  },
  guideDesc: {
    fontSize: '13px',
    color: '#7E7E7E',
    marginBottom: '20px',
  },
  guideStepCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    gap: '14px',
    marginBottom: '12px',
    border: '1px solid rgba(168, 213, 194, 0.1)',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '13px',
    color: '#4A4A4A',
    lineHeight: '1.5',
  },
  endBtn: {
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
  rightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1.5px dashed #F3EFEA',
    paddingBottom: '16px',
    gap: '16px',
  },
  panelSubText: {
    fontSize: '13px',
    color: '#7E7E7E',
    marginTop: '4px',
  },
  sessionTimer: {
    textAlign: 'right',
    backgroundColor: '#EBF7F2',
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid #A8D5C2',
  },
  timerLabel: {
    fontSize: '11px',
    color: '#81B8A1',
    fontWeight: '700',
    display: 'block',
  },
  timerDigits: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4A4A4A',
    fontFamily: 'monospace',
  },
  stickerBoard: {
    backgroundColor: '#FDFAF5',
    borderRadius: '16px',
    border: '1.5px solid #E5E4E7',
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  boardHeader: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '16px',
  },
  emptyStickers: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyPulse: {
    fontSize: '44px',
    marginBottom: '12px',
    animation: 'float 2s infinite ease-in-out',
  },
  emptyStickerText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '4px',
  },
  emptyStickerSubText: {
    fontSize: '12px',
    color: '#7E7E7E',
  },
  stickersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    overflowY: 'auto',
    maxHeight: '380px',
    padding: '6px',
  },
  stickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 12px',
    boxShadow: '0 3px 8px var(--color-shadow)',
    textAlign: 'center',
    animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    border: '1px solid rgba(168, 213, 194, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stickerEmoji: {
    fontSize: '32px',
    marginBottom: '6px',
  },
  stickerTag: {
    fontSize: '10px',
    color: '#7E7E7E',
    backgroundColor: '#FDFAF5',
    padding: '2px 8px',
    borderRadius: '8px',
  },
};
