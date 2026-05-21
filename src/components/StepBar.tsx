import React from 'react';

interface StepBarProps {
  currentStep: number;
}

export const StepBar: React.FC<StepBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: '고민 수집' },
    { number: 2, label: 'AI 이론 추천' },
    { number: 3, label: '라이브 세션' },
    { number: 4, label: '기록실' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.progressLineContainer}>
        <div style={styles.progressLineBack} />
        <div 
          style={{
            ...styles.progressLineActive,
            width: `${((Math.max(1, currentStep) - 1) / (steps.length - 1)) * 100}%`
          }} 
        />
      </div>
      <div style={styles.stepsWrapper}>
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepCircle,
                  backgroundColor: isCompleted 
                    ? '#A8D5C2' 
                    : isActive 
                      ? '#FFFFFF' 
                      : '#FFFFFF',
                  borderColor: isActive || isCompleted ? '#81B8A1' : '#E5E4E7',
                  color: isCompleted ? '#FFFFFF' : isActive ? '#4A4A4A' : '#7E7E7E',
                  fontWeight: isActive ? '700' : '400',
                  boxShadow: isActive ? '0 0 0 4px rgba(168, 213, 194, 0.3)' : '0 2px 4px var(--color-shadow)',
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                style={{
                  ...styles.stepLabel,
                  color: isActive ? '#4A4A4A' : isCompleted ? '#81B8A1' : '#7E7E7E',
                  fontWeight: isActive ? '700' : '400',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    padding: '24px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(74, 74, 74, 0.03)',
    position: 'relative',
    marginBottom: '24px',
  },
  stepsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    margin: '0 auto',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '8px',
  },
  stepLabel: {
    fontSize: '14px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  progressLineContainer: {
    position: 'absolute',
    top: '40px',
    left: 'calc(12.5% + 16px)',
    right: 'calc(12.5% + 16px)',
    height: '3px',
    zIndex: 1,
  },
  progressLineBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FDFAF5',
    borderRadius: '2px',
  },
  progressLineActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#A8D5C2',
    borderRadius: '2px',
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
