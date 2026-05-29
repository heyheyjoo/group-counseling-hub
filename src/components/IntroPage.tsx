import React from 'react';

interface IntroPageProps {
  onSelectMode: (mode: 'teacher' | 'student') => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onSelectMode }) => {
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

        <div style={styles.divider} />

        <p style={styles.instruction}>
          동일한 PC에서 시연하려면 <strong>두 개의 브라우저 탭</strong>을 띄운 뒤,<br />
          각각 <strong>선생님 모드</strong>와 <strong>학생 모드</strong>를 선택해 주세요.
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.teacherBtn }}
            onClick={() => onSelectMode('teacher')}
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
            onClick={() => onSelectMode('student')}
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
  divider: {
    height: '1px',
    backgroundColor: '#F3EFEA',
    width: '80%',
    margin: '0 auto 24px',
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
    cursor: 'pointer',
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
