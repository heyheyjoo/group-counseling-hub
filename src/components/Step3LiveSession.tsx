import React, { useEffect, useState } from 'react';
import { TippTimer } from './TippTimer';
import { EmotionSlider } from './EmotionSlider';
import { StopCards } from './StopCards';
import type { Sticker, ToolkitType } from '../hooks/useSharedState';

interface Step3LiveSessionProps {
  mode: 'teacher' | 'student';
  stickers: Sticker[];
  sendSticker: (emoji: string) => void;
  onEndSession: () => void;
  activeToolkit: ToolkitType;
  setActiveToolkit: (toolkit: ToolkitType) => void;
}

const TOOLKIT_INFO: Record<ToolkitType, { label: string; icon: string; desc: string }> = {
  tipp: {
    label: 'TIPP 호흡 타이머',
    icon: '🧘',
    desc: '4초 들이쉬기, 6초 내쉬기를 반복하는 1분 마음챙김 호흡 훈련입니다. 학생 화면에 호흡 원이 실시간으로 나타납니다.',
  },
  emotion: {
    label: '감정 온도계',
    icon: '🌡️',
    desc: '학생이 1~100 사이의 감정 온도를 드래그하여 제출합니다. 선생님 화면에 학급 평균 온도가 표시됩니다.',
  },
  stop: {
    label: 'STOP 성찰 카드',
    icon: '🛑',
    desc: 'S(멈추기) → T(물러서기) → O(관찰하기) → P(마음챙김 나아가기) 4단계 카드 덱으로 성찰을 안내합니다.',
  },
};

export const Step3LiveSession: React.FC<Step3LiveSessionProps> = ({
  mode,
  stickers,
  sendSticker,
  onEndSession,
  activeToolkit,
  setActiveToolkit,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [emotionTemps, setEmotionTemps] = useState<number[]>([]);

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

  // Listen for emotion temperature submissions (teacher only)
  useEffect(() => {
    if (mode !== 'teacher') return;
    const channel = new BroadcastChannel('group_counseling_channel');
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'EMOTION_TEMP_SUBMITTED') {
        setEmotionTemps((prev) => [...prev, event.data.payload]);
      }
    };
    channel.onmessage = handler;
    return () => { channel.close(); };
  }, [mode]);

  const formatTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const averageTemp = emotionTemps.length > 0
    ? Math.round(emotionTemps.reduce((a, b) => a + b, 0) / emotionTemps.length)
    : null;

  if (mode === 'student') {
    return (
      <div style={styles.studentContainer}>
        {activeToolkit === 'tipp' && <TippTimer sendSticker={sendSticker} />}
        {activeToolkit === 'emotion' && <EmotionSlider sendSticker={sendSticker} />}
        {activeToolkit === 'stop' && <StopCards sendSticker={sendSticker} />}
      </div>
    );
  }

  // Teacher View
  const toolkitKeys: ToolkitType[] = ['tipp', 'emotion', 'stop'];

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* Left Panel - Counselor Guide (40% width) */}
        <div style={styles.leftPanel}>
          <div style={styles.panelHeader}>
            <span style={styles.liveIndicator}>● LIVE</span>
            <h3 style={styles.panelTitle}>상담자 기법 선택</h3>
          </div>

          {/* Toolkit Tab Buttons */}
          <div style={styles.toolkitTabs}>
            {toolkitKeys.map((key) => {
              const info = TOOLKIT_INFO[key];
              const isSelected = activeToolkit === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveToolkit(key)}
                  style={{
                    ...styles.toolkitTab,
                    backgroundColor: isSelected ? '#EBF7F2' : '#FDFAF5',
                    borderColor: isSelected ? '#A8D5C2' : '#E5E4E7',
                    color: isSelected ? '#4A4A4A' : '#7E7E7E',
                    boxShadow: isSelected ? '0 2px 8px rgba(168, 213, 194, 0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F5F0EB';
                      e.currentTarget.style.borderColor = '#A8D5C2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#FDFAF5';
                      e.currentTarget.style.borderColor = '#E5E4E7';
                    }
                  }}
                >
                  <span style={styles.tabIcon}>{info.icon}</span>
                  <span style={styles.tabLabel}>{info.label}</span>
                  {isSelected && <span style={styles.activeIndicator}>●</span>}
                </button>
              );
            })}
          </div>

          {/* Selected Toolkit Guideline */}
          <div style={styles.guidelineContent}>
            <h4 style={styles.guideSubtitle}>
              {TOOLKIT_INFO[activeToolkit].icon} {TOOLKIT_INFO[activeToolkit].label}
            </h4>
            <p style={styles.guideDesc}>{TOOLKIT_INFO[activeToolkit].desc}</p>

            {activeToolkit === 'tipp' && (
              <>
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
                    학생 화면의 <strong>TippTimer</strong>를 함께 바라보며, 4초간 들이쉬고 6초간 내쉬는 1분 호흡을 지도합니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>4</div>
                  <div style={styles.stepText}>
                    <strong>P (Paired Muscle Relaxation - 점진적 이완)</strong><br />
                    호흡이 끝난 뒤 온몸의 근육에 힘을 주었다가 한번에 풀 수 있도록 유도합니다.
                  </div>
                </div>
              </>
            )}

            {activeToolkit === 'emotion' && (
              <>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>1</div>
                  <div style={styles.stepText}>
                    <strong>감정 인식</strong><br />
                    학생들에게 "지금 이 순간의 마음 상태를 온도로 표현해 보세요"라고 안내합니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>2</div>
                  <div style={styles.stepText}>
                    <strong>온도 제출</strong><br />
                    학생들이 드래그 슬라이더를 통해 자신의 감정 온도(1~100)를 제출합니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>3</div>
                  <div style={styles.stepText}>
                    <strong>학급 평균 확인</strong><br />
                    우측 패널에서 학급 전체의 평균 감정 온도를 확인하고 함께 이야기를 나눕니다.
                  </div>
                </div>
              </>
            )}

            {activeToolkit === 'stop' && (
              <>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>S</div>
                  <div style={styles.stepText}>
                    <strong>Stop (멈추기)</strong><br />
                    학생들에게 하던 것을 잠시 멈추고 눈을 감도록 안내합니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>T</div>
                  <div style={styles.stepText}>
                    <strong>Take a step back (물러서기)</strong><br />
                    감정에 이름을 붙이고 거리를 두는 연습을 하도록 이끕니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>O</div>
                  <div style={styles.stepText}>
                    <strong>Observe (관찰하기)</strong><br />
                    몸의 감각을 판단 없이 알아차리도록 안내합니다.
                  </div>
                </div>
                <div style={styles.guideStepCard}>
                  <div style={styles.stepNum}>P</div>
                  <div style={styles.stepText}>
                    <strong>Proceed mindfully (나아가기)</strong><br />
                    충동이 아닌 가치에 따라 행동을 선택하도록 안내합니다.
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={styles.actionBtnRow}>
            {activeToolkit === 'tipp' && (
              <button
                onClick={() => {
                  const channel = new BroadcastChannel('group_counseling_channel');
                  channel.postMessage({ type: 'FORCE_TIMER_COMPLETE' });
                  channel.close();
                }}
                style={styles.forceCompleteBtn}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#81B8A1'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A8D5C2'}
              >
                🧘 호흡 즉시 완료
              </button>
            )}
            <button
              onClick={() => {
                setIsActive(false);
                onEndSession();
              }}
              style={{
                ...styles.endBtn,
                flex: activeToolkit === 'tipp' ? 1 : undefined,
                width: activeToolkit !== 'tipp' ? '100%' : undefined,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0A481'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F4C2A1'}
            >
              🏁 세션 종료 및 이동
            </button>
          </div>
        </div>

        {/* Right Panel - Session Info & Stickers Board (60% width) */}
        <div style={styles.rightPanel}>
          <div style={styles.rightHeader}>
            <div>
              <h3 style={styles.panelTitle}>실시간 집단 반응 보드</h3>
              <p style={styles.panelSubText}>집단원들의 활동 현황 및 감정 스티커 피드백이 실시간으로 동기화됩니다.</p>
            </div>
            <div style={styles.headerRightActions}>
              <div style={styles.sessionTimer}>
                <span style={styles.timerLabel}>세션 시간</span>
                <div style={styles.timerDigits}>{formatTime(elapsedSeconds)}</div>
              </div>
            </div>
          </div>

          {/* Emotion Temperature Average (only when emotion toolkit is active) */}
          {activeToolkit === 'emotion' && (
            <div style={styles.tempAvgSection}>
              <div style={styles.tempAvgCard}>
                <span style={styles.tempAvgLabel}>🌡️ 학급 평균 감정 온도</span>
                <div style={styles.tempAvgValue}>
                  {averageTemp !== null ? `${averageTemp}°` : '대기 중...'}
                </div>
                <span style={styles.tempAvgSub}>
                  {emotionTemps.length}명 제출 완료
                </span>
              </div>
            </div>
          )}

          {/* Sticker Board */}
          <div style={styles.stickerBoard}>
            <div style={styles.boardHeader}>
              <span>✨ 전송받은 감정 스티커 (총 {stickers.length}개)</span>
            </div>

            {stickers.length === 0 ? (
              <div style={styles.emptyStickers}>
                <div style={styles.emptyPulse}>🌸</div>
                <p style={styles.emptyStickerText}>활동을 완료한 집단원들의 응원이 여기에 나타납니다.</p>
                <p style={styles.emptyStickerSubText}>학생 탭에서 활동 완료 후 이모지 스티커를 클릭해 보세요.</p>
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
    boxShadow: '0 4px 12px rgba(74, 74, 74, 0.08)',
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
    boxShadow: '0 4px 12px rgba(74, 74, 74, 0.08)',
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
  toolkitTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  toolkitTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
  },
  tabIcon: {
    fontSize: '18px',
  },
  tabLabel: {
    flex: 1,
  },
  activeIndicator: {
    color: '#A8D5C2',
    fontSize: '10px',
  },
  guidelineContent: {
    flex: 1,
    marginBottom: '24px',
    overflowY: 'auto',
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
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  guideStepCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    gap: '14px',
    marginBottom: '10px',
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
    fontSize: '12px',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '12px',
    color: '#4A4A4A',
    lineHeight: '1.5',
  },
  actionBtnRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  forceCompleteBtn: {
    flex: 1,
    backgroundColor: '#A8D5C2',
    color: '#4A4A4A',
    fontWeight: '700',
    fontSize: '14px',
    padding: '16px 8px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(168, 213, 194, 0.2)',
    transition: 'background-color 0.2s ease',
    textAlign: 'center',
  },
  endBtn: {
    flex: 1,
    backgroundColor: '#F4C2A1',
    color: '#4A4A4A',
    fontWeight: '700',
    fontSize: '14px',
    padding: '16px 8px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(244, 194, 161, 0.2)',
    transition: 'background-color 0.2s ease',
    textAlign: 'center',
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
  headerRightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  tempAvgSection: {
    marginBottom: '20px',
  },
  tempAvgCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: '16px',
    border: '1.5px solid #F4C2A1',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  tempAvgLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4A4A4A',
  },
  tempAvgValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#E0A481',
  },
  tempAvgSub: {
    fontSize: '12px',
    color: '#7E7E7E',
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
    boxShadow: '0 3px 8px rgba(74, 74, 74, 0.08)',
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
