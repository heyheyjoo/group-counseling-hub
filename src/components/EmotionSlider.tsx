import React, { useState } from 'react';

interface EmotionSliderProps {
  sendSticker: (emoji: string) => void;
  onTemperatureSubmit?: (temp: number) => void;
}

export const EmotionSlider: React.FC<EmotionSliderProps> = ({ sendSticker, onTemperatureSubmit }) => {
  const [temperature, setTemperature] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [recentSticker, setRecentSticker] = useState<string | null>(null);

  const getTemperatureColor = (temp: number) => {
    if (temp <= 30) return '#A8D5C2';
    if (temp <= 60) return '#F4C2A1';
    if (temp <= 80) return '#E0A481';
    return '#D4756B';
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 20) return '😌 매우 안정';
    if (temp <= 40) return '🙂 약간 안정';
    if (temp <= 60) return '😐 보통';
    if (temp <= 80) return '😰 약간 불안';
    return '🔥 매우 불안';
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (onTemperatureSubmit) {
      onTemperatureSubmit(temperature);
    }
    // Broadcast temperature via BroadcastChannel
    const channel = new BroadcastChannel('group_counseling_channel');
    channel.postMessage({ type: 'EMOTION_TEMP_SUBMITTED', payload: temperature });
    channel.close();

    setTimeout(() => {
      setHasCompleted(true);
    }, 2000);
  };

  const stickers = ['💚', '🌿', '✨', '🌸', '☁️'];

  const handleSendSticker = (emoji: string) => {
    sendSticker(emoji);
    setRecentSticker(emoji);
    setTimeout(() => {
      setRecentSticker(null);
    }, 1500);
  };

  if (hasCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.completedCard}>
          <div style={styles.successBadge}>✓ 감정 온도 제출 완료</div>
          <h2 style={styles.completedTitle}>감정 체크인 완료!</h2>
          <p style={styles.completedDesc}>
            나의 감정 온도 <strong style={{ color: getTemperatureColor(temperature) }}>{temperature}°</strong>를 선생님께 전달했어요.<br />
            집단원들과 선생님에게 <strong>따뜻한 마음의 스티커</strong>를 전송해 보세요.
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
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.titleArea}>
          <h2 style={styles.cardTitle}>감정 온도계</h2>
          <p style={styles.cardSub}>
            지금 이 순간 나의 감정 상태를 온도로 표현해 보세요.<br />
            1°는 매우 안정된 상태, 100°는 매우 불안한 상태를 뜻합니다.
          </p>
        </div>

        <div style={styles.thermometerArea}>
          {/* Thermometer visual */}
          <div style={styles.thermometerTrack}>
            <div
              style={{
                ...styles.thermometerFill,
                height: `${temperature}%`,
                backgroundColor: getTemperatureColor(temperature),
              }}
            />
            <div style={styles.thermometerBulb}>
              <div
                style={{
                  ...styles.bulbInner,
                  backgroundColor: getTemperatureColor(temperature),
                }}
              />
            </div>
          </div>

          <div style={styles.sliderArea}>
            <div style={styles.temperatureDisplay}>
              <span style={{
                ...styles.tempValue,
                color: getTemperatureColor(temperature),
              }}>
                {temperature}°
              </span>
              <span style={styles.tempLabel}>{getTemperatureLabel(temperature)}</span>
            </div>

            <input
              type="range"
              min={1}
              max={100}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              style={styles.slider}
            />

            <div style={styles.scaleLabels}>
              <span>1° 안정</span>
              <span>50° 보통</span>
              <span>100° 불안</span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            style={styles.submitBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0A481'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F4C2A1'}
          >
            감정 온도 제출하기
          </button>
        ) : (
          <div style={styles.submittedBanner}>
            ✓ 제출 완료! 잠시 후 스티커 화면으로 넘어갑니다...
          </div>
        )}
      </div>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '36px 24px',
    boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(168, 213, 194, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleArea: {
    marginBottom: '32px',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '8px',
  },
  cardSub: {
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.6',
  },
  thermometerArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    width: '100%',
    marginBottom: '32px',
  },
  thermometerTrack: {
    width: '36px',
    height: '200px',
    backgroundColor: '#FDFAF5',
    borderRadius: '18px 18px 0 0',
    border: '2px solid #E5E4E7',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  thermometerFill: {
    width: '100%',
    borderRadius: '14px 14px 0 0',
    transition: 'height 0.4s ease, background-color 0.4s ease',
  },
  thermometerBulb: {
    position: 'absolute',
    bottom: '-24px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#FDFAF5',
    border: '2px solid #E5E4E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbInner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    transition: 'background-color 0.4s ease',
  },
  sliderArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    maxWidth: '300px',
  },
  temperatureDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tempValue: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1',
    transition: 'color 0.3s ease',
  },
  tempLabel: {
    fontSize: '14px',
    color: '#7E7E7E',
    marginTop: '8px',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: '8px',
    appearance: 'none' as React.CSSProperties['appearance'],
    backgroundColor: '#FDFAF5',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '11px',
    color: '#7E7E7E',
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
    maxWidth: '400px',
  },
  submittedBanner: {
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    fontWeight: '700',
    fontSize: '14px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1.5px solid #A8D5C2',
    width: '100%',
    maxWidth: '400px',
    animation: 'popIn 0.4s ease-out',
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)',
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
