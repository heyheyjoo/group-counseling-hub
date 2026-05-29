import React, { useState } from 'react';

interface IntroPageProps {
  onEnter: (username: string, mode: 'teacher' | 'student') => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  const [phase, setPhase] = useState<'name' | 'mode'>('name');
  const [username, setUsername] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [shakeError, setShakeError] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    setUsername(trimmed);
    setPhase('mode');
  };

  // ─── Phase 1: 이름 입력 ───────────────────────────────
  if (phase === 'name') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 style={styles.title}>Group Counseling Hub</h1>
            <span style={styles.badge}>v2.0 Beta</span>
          </div>

          <p style={styles.description}>
            오프라인 현장의 온기를 디지털로 연결하는<br />
            <strong>실시간 현장 연계형 디지털 집단상담 플랫폼</strong>에 오신 것을 환영합니다.
          </p>

          <div style={styles.divider} />

          <p style={styles.nameLabel}>먼저, 누구신가요? 🙂</p>
          <p style={styles.nameHint}>닉네임을 입력하면 나만의 상담 기록이 누적됩니다.</p>

          <form
            onSubmit={handleNameSubmit}
            style={{
              ...styles.nameForm,
              animation: shakeError ? 'shake 0.5s ease' : 'none',
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="예: 김선생님, 박상담사, 이지원..."
              maxLength={20}
              style={styles.nameInput}
              autoFocus
              onFocus={(e) => (e.currentTarget.style.borderColor = '#A8D5C2')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E4E7')}
            />
            <button
              type="submit"
              style={styles.nameBtn}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#81B8A1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#A8D5C2')}
            >
              시작하기 →
            </button>
          </form>

          {shakeError && (
            <p style={styles.errorText}>닉네임을 입력해 주세요 😊</p>
          )}
        </div>
        <div style={styles.footer}>
          © 2026 heyheyjoo/group-counseling-hub. All rights reserved.
        </div>
      </div>
    );
  }

  // ─── Phase 2: 모드 선택 ───────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 style={styles.title}>Group Counseling Hub</h1>
        </div>

        {/* 환영 인사 배지 */}
        <div style={styles.welcomeBadge}>
          <span style={styles.welcomeAvatar}>{username.slice(0, 1)}</span>
          <span style={styles.welcomeText}>
            <strong>{username}</strong>님, 환영합니다 👋
          </span>
          <button
            style={styles.changeNameBtn}
            onClick={() => { setPhase('name'); setInputVal(username); }}
            title="이름 변경"
          >
            ✏️
          </button>
        </div>

        <div style={styles.divider} />

        <p style={styles.instruction}>
          동일한 PC에서 시연하려면 <strong>두 개의 브라우저 탭</strong>을 띄운 뒤,<br />
          각각 <strong>선생님 모드</strong>와 <strong>학생 모드</strong>를 선택해 주세요.
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.teacherBtn }}
            onClick={() => onEnter(username, 'teacher')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(129, 184, 161, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(129, 184, 161, 0.2)';
            }}
          >
            <div style={styles.btnIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={styles.btnTextWrapper}>
              <div style={styles.btnLabel}>상담 및 운영자</div>
              <div style={styles.btnTitle}>선생님 모드 시작</div>
            </div>
          </button>

          <button
            style={{ ...styles.button, ...styles.studentBtn }}
            onClick={() => onEnter(username, 'student')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(244, 194, 161, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 194, 161, 0.2)';
            }}
          >
            <div style={styles.btnIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div style={styles.btnTextWrapper}>
              <div style={styles.btnLabel}>집단 참여자</div>
              <div style={styles.btnTitle}>학생 모드 시작</div>
            </div>
          </button>
        </div>
      </div>
      <div style={styles.footer}>
        © 2026 heyheyjoo/group-counseling-hub. All rights reserved.
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
    minHeight: '80vh',
    animation: 'fadeIn 0.6s ease-out',
    padding: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(74, 74, 74, 0.05)',
    maxWidth: '640px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(168, 213, 194, 0.15)',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  logoIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    backgroundColor: '#A8D5C2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 6px 16px rgba(168, 213, 194, 0.3)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '4px',
    letterSpacing: '-0.5px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#FDFAF5',
    color: '#81B8A1',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid #A8D5C2',
  },
  description: {
    fontSize: '16px',
    color: '#4A4A4A',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#F3EFEA',
    width: '80%',
    margin: '0 auto 24px',
  },
  nameLabel: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4A4A4A',
    marginBottom: '6px',
  },
  nameHint: {
    fontSize: '13px',
    color: '#7E7E7E',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  nameForm: {
    display: 'flex',
    gap: '12px',
    maxWidth: '420px',
    margin: '0 auto',
  },
  nameInput: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1.5px solid #E5E4E7',
    fontSize: '15px',
    color: '#4A4A4A',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
  },
  nameBtn: {
    backgroundColor: '#A8D5C2',
    color: '#4A4A4A',
    fontWeight: '700',
    fontSize: '15px',
    padding: '14px 22px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(168, 213, 194, 0.3)',
    transition: 'background-color 0.2s ease',
    fontFamily: 'inherit',
  },
  errorText: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#E0A481',
    fontWeight: '500',
  },
  // Phase 2 styles
  welcomeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#EBF7F2',
    border: '1.5px solid #A8D5C2',
    borderRadius: '40px',
    padding: '8px 16px',
    marginBottom: '20px',
  },
  welcomeAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#A8D5C2',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  welcomeText: {
    fontSize: '14px',
    color: '#4A4A4A',
  },
  changeNameBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '6px',
    opacity: 0.7,
    transition: 'opacity 0.2s',
  },
  instruction: {
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.5',
    marginBottom: '32px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    flex: '1 1 240px',
    padding: '18px 24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  teacherBtn: {
    backgroundColor: '#EBF7F2',
    border: '2px solid #A8D5C2',
    color: '#4A4A4A',
    boxShadow: '0 4px 12px rgba(129, 184, 161, 0.1)',
  },
  studentBtn: {
    backgroundColor: '#FBE6D8',
    border: '2px solid #F4C2A1',
    color: '#4A4A4A',
    boxShadow: '0 4px 12px rgba(244, 194, 161, 0.1)',
  },
  btnIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4A4A4A',
    flexShrink: 0,
  },
  btnTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  btnLabel: {
    fontSize: '12px',
    opacity: 0.8,
  },
  btnTitle: {
    fontSize: '17px',
    fontWeight: '700',
  },
  footer: {
    marginTop: '24px',
    fontSize: '12px',
    color: '#7E7E7E',
  },
};
