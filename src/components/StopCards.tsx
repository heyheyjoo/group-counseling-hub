import React, { useState } from 'react';

interface StopCardsProps {
  sendSticker: (emoji: string) => void;
}

const STOP_STEPS = [
  {
    letter: 'S',
    title: 'Stop (멈추기)',
    color: '#A8D5C2',
    instruction: '지금 하고 있는 모든 행동을 멈추세요.',
    detail: '감정이 몰려올 때, 가장 먼저 해야 할 일은 \'멈춤\'입니다. 충동적으로 반응하기 전에, 잠깐 시간을 가져보세요. 눈을 감고, 손을 무릎 위에 올려놓고, 깊게 한 번 숨을 들이마시세요.',
    tip: '💡 3초간 천천히 눈을 감아 보세요.',
  },
  {
    letter: 'T',
    title: 'Take a step back (한 발 물러서기)',
    color: '#F4C2A1',
    instruction: '상황에서 잠시 거리를 두세요.',
    detail: '지금 느끼는 감정에 이름을 붙여 봅시다. "나는 지금 화가 나 있구나", "나는 지금 불안해하고 있구나"라고 조용히 속으로 말해 보세요. 감정에 이름을 붙이는 것만으로도 감정의 강도가 줄어드는 효과가 있습니다.',
    tip: '💡 "나는 지금 ___을 느끼고 있어."라고 속으로 말해 보세요.',
  },
  {
    letter: 'O',
    title: 'Observe (관찰하기)',
    color: '#81B8A1',
    instruction: '자신의 몸, 감정, 생각을 관찰하세요.',
    detail: '판단하지 말고 지금 이 순간 몸에서 느껴지는 감각을 관찰해 보세요. 어깨가 뻣뻣한가요? 심장이 빠르게 뛰고 있나요? 주먹을 꽉 쥐고 있진 않나요? 있는 그대로 알아차리는 것이 마음챙김의 시작입니다.',
    tip: '💡 몸의 긴장된 부위를 하나씩 살펴보세요.',
  },
  {
    letter: 'P',
    title: 'Proceed mindfully (마음챙김으로 나아가기)',
    color: '#E0A481',
    instruction: '현명하게 다음 행동을 선택하세요.',
    detail: '이제 자신에게 물어보세요. "내가 진짜 원하는 것은 뭘까?" "이 상황에서 최선의 행동은 뭘까?" 충동이 아닌 가치에 따라 다음 한 걸음을 내딛어 봅시다. 작은 변화가 큰 차이를 만들어냅니다.',
    tip: '💡 "내가 진짜 원하는 것은?" 이라고 스스로에게 질문하세요.',
  },
];

export const StopCards: React.FC<StopCardsProps> = ({ sendSticker }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [recentSticker, setRecentSticker] = useState<string | null>(null);

  const stickers = ['💚', '🌿', '✨', '🌸', '☁️'];

  const handleNext = () => {
    if (currentIndex < STOP_STEPS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setHasCompleted(true);
    }
  };

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
          <div style={styles.successBadge}>✓ STOP 성찰 완료</div>
          <h2 style={styles.completedTitle}>마음 챙김 완료!</h2>
          <p style={styles.completedDesc}>
            STOP 기법으로 마음을 살펴보았습니다.<br />
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

  const step = STOP_STEPS[currentIndex];

  return (
    <div style={styles.container}>
      {/* Progress dots */}
      <div style={styles.progressDots}>
        {STOP_STEPS.map((s, i) => (
          <div
            key={s.letter}
            style={{
              ...styles.dot,
              backgroundColor: i <= currentIndex ? s.color : '#E5E4E7',
              width: i === currentIndex ? '32px' : '10px',
              borderRadius: i === currentIndex ? '5px' : '50%',
            }}
          />
        ))}
      </div>

      <div
        key={currentIndex}
        style={{
          ...styles.card,
          borderColor: step.color,
        }}
      >
        <div style={{
          ...styles.letterBadge,
          backgroundColor: step.color,
        }}>
          {step.letter}
        </div>

        <h2 style={styles.cardTitle}>{step.title}</h2>
        <p style={styles.cardInstruction}>{step.instruction}</p>

        <div style={styles.divider} />

        <p style={styles.cardDetail}>{step.detail}</p>

        <div style={{
          ...styles.tipBox,
          borderLeftColor: step.color,
        }}>
          {step.tip}
        </div>

        <button
          onClick={handleNext}
          style={{
            ...styles.nextBtn,
            backgroundColor: step.color,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'none';
          }}
        >
          {currentIndex < STOP_STEPS.length - 1
            ? `다음 단계 → ${STOP_STEPS[currentIndex + 1].letter}`
            : '성찰 완료하기 ✓'}
        </button>

        <div style={styles.stepCounter}>
          {currentIndex + 1} / {STOP_STEPS.length}
        </div>
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
    padding: '24px 16px',
    animation: 'fadeIn 0.5s ease-out',
    width: '100%',
  },
  progressDots: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '24px',
  },
  dot: {
    height: '10px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)',
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
    border: '2.5px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'fadeIn 0.4s ease-out',
  },
  letterBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '8px',
  },
  cardInstruction: {
    fontSize: '15px',
    color: '#81B8A1',
    fontWeight: '700',
    marginBottom: '20px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#F3EFEA',
    width: '80%',
    marginBottom: '20px',
  },
  cardDetail: {
    fontSize: '14px',
    color: '#4A4A4A',
    lineHeight: '1.7',
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  tipBox: {
    backgroundColor: '#FDFAF5',
    borderLeft: '4px solid',
    padding: '12px 16px',
    borderRadius: '0 8px 8px 0',
    fontSize: '13px',
    color: '#4A4A4A',
    width: '100%',
    textAlign: 'left',
    marginBottom: '28px',
    fontWeight: '500',
  },
  nextBtn: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '16px',
    padding: '16px 32px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    width: '100%',
    maxWidth: '300px',
  },
  stepCounter: {
    marginTop: '16px',
    fontSize: '12px',
    color: '#7E7E7E',
    fontWeight: '700',
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
