import { useState } from 'react';
import { useSharedState } from './hooks/useSharedState';
import { StepBar } from './components/StepBar';
import { IntroPage } from './components/IntroPage';
import { Step1IssueWall } from './components/Step1IssueWall';
import { Step2AiMatcher } from './components/Step2AiMatcher';
import { Step3LiveSession } from './components/Step3LiveSession';
import { Step4Archiving } from './components/Step4Archiving';
import './App.css';

function App() {
  const {
    step,
    issues,
    stickers,
    sessionLogs,
    activeToolkit,
    isGeneratingReport,
    setStep,
    addIssue,
    fillDummyIssues,
    selectTheory,
    sendSticker,
    endSession,
    resetSession,
    setActiveToolkit,
  } = useSharedState();

  // Local state for selecting role in this specific tab
  const [mode, setMode] = useState<'teacher' | 'student' | null>(null);

  // If local state doesn't have mode, or step is 0, show intro page
  const handleSelectMode = (selectedMode: 'teacher' | 'student') => {
    setMode(selectedMode);
    if (step === 0) {
      setStep(1);
    }
  };

  const handleExitMode = () => {
    setMode(null);
  };

  if (!mode || step === 0) {
    return (
      <div className="app-container">
        <IntroPage onSelectMode={handleSelectMode} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header bar */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBadge}>GCH</div>
          <div>
            <h1 style={styles.logoText}>Group Counseling Hub</h1>
            <span style={styles.modeIndicator}>
              {mode === 'teacher' ? (
                <span style={styles.teacherTag}>🧑‍🏫 선생님 모드</span>
              ) : (
                <span style={styles.studentTag}>🧑‍🎓 학생 모드</span>
              )}
            </span>
          </div>
        </div>
        <button 
          onClick={handleExitMode} 
          style={styles.exitBtn}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EBE5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          🚪 모드 종료
        </button>
      </header>

      {/* Progress step bar */}
      <StepBar currentStep={step} />

      {/* Step Conditional Rendering */}
      <main style={styles.mainContent}>
        {step === 1 && (
          <Step1IssueWall
            mode={mode}
            issues={issues}
            addIssue={addIssue}
            fillDummyIssues={fillDummyIssues}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2AiMatcher
            mode={mode}
            issues={issues}
            onSelectTheory={selectTheory}
          />
        )}

        {step === 3 && (
          <Step3LiveSession
            mode={mode}
            stickers={stickers}
            sendSticker={sendSticker}
            onEndSession={endSession}
            activeToolkit={activeToolkit}
            setActiveToolkit={setActiveToolkit}
          />
        )}

        {step === 4 && (
          <Step4Archiving
            mode={mode}
            sessionLogs={sessionLogs}
            isGeneratingReport={isGeneratingReport}
            onRestart={resetSession}
          />
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(74, 74, 74, 0.03)',
    marginBottom: '20px',
    border: '1px solid rgba(168, 213, 194, 0.12)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: '15px',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4A4A4A',
    lineHeight: '1.2',
  },
  modeIndicator: {
    display: 'inline-block',
    marginTop: '2px',
  },
  teacherTag: {
    color: '#81B8A1',
    fontWeight: '700',
    fontSize: '11px',
    backgroundColor: '#EBF7F2',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  studentTag: {
    color: '#E0A481',
    fontWeight: '700',
    fontSize: '11px',
    backgroundColor: '#FBE6D8',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  exitBtn: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #E5E4E7',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#4A4A4A',
    transition: 'background-color 0.2s ease',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
