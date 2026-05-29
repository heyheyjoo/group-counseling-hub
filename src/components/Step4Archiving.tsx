import React from 'react';
import type { SessionLog } from '../hooks/useSharedState';

interface Step4ArchivingProps {
  mode: 'teacher' | 'student';
  sessionLogs: SessionLog[];
  onRestart: () => void;
  isGeneratingReport: boolean;
}

export const Step4Archiving: React.FC<Step4ArchivingProps> = ({
  mode,
  sessionLogs,
  onRestart,
  isGeneratingReport,
}) => {
  
  const handleExport = () => {
    if (sessionLogs.length === 0) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `group-counseling-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>집단상담 기록실</h2>
        <p style={styles.sectionSub}>지금까지 진행된 실시간 집단상담의 세션 요약 데이터가 저장되는 공간입니다.</p>
      </div>

      {/* Button Row */}
      <div style={styles.controlsRow}>
        <button
          onClick={handleExport}
          disabled={sessionLogs.length === 0}
          style={{
            ...styles.exportBtn,
            opacity: sessionLogs.length === 0 ? 0.5 : 1,
            cursor: sessionLogs.length === 0 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (sessionLogs.length > 0) e.currentTarget.style.backgroundColor = '#F0EBE5';
          }}
          onMouseLeave={(e) => {
            if (sessionLogs.length > 0) e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          💾 기록 내보내기 (JSON 다운로드)
        </button>

        {mode === 'teacher' ? (
          <button
            onClick={onRestart}
            style={styles.restartBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#81B8A1'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A8D5C2'}
          >
            🔄 새 세션 시작하기 (1단계로)
          </button>
        ) : (
          <div style={styles.studentWaitBadge}>
            선생님이 '새 세션'을 시작하면 자동으로 1단계로 이동합니다.
          </div>
        )}
      </div>

      {/* Logs List */}
      {sessionLogs.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIllustration}>🗄️</div>
          <p style={styles.emptyText}>아직 기록된 세션이 없습니다.</p>
          <p style={styles.emptySubText}>3단계를 완료하면 세션 통계 및 요약이 이곳에 누적 저장됩니다.</p>
        </div>
      ) : (
        <div style={styles.logsList}>
          {sessionLogs.map((log) => (
            <div key={log.id} style={styles.logCard}>
              <div style={styles.logCardHeader}>
                <div style={styles.dateBadge}>{log.date}</div>
                <div style={styles.theoryTag}>{log.theory}</div>
              </div>
              
              <div style={styles.logStats}>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>수집된 고민</span>
                  <strong style={styles.statVal}>{log.issueCount}개</strong>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>나눈 스티커</span>
                  <strong style={styles.statVal}>{log.stickerCount}개</strong>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>사용된 기법</span>
                  <strong style={styles.statVal}>{log.toolkits?.length || 0}개</strong>
                </div>
              </div>

              {/* Toolkits used */}
              {log.toolkits && log.toolkits.length > 0 && (
                <div style={styles.toolkitsRow}>
                  {log.toolkits.map((toolkit) => (
                    <span key={toolkit} style={styles.toolkitBadge}>
                      {toolkit === 'TIPP 호흡 타이머' ? '🧘' : toolkit === '감정 온도계' ? '🌡️' : '🛑'} {toolkit}
                    </span>
                  ))}
                </div>
              )}

              <div style={styles.logDivider} />

              <div style={styles.logSummary}>
                <div style={styles.summaryLabelRow}>
                  <strong style={styles.summaryLabel}>종합 요약 :</strong>
                  {isGeneratingReport && sessionLogs.indexOf(log) === 0 ? (
                    <span style={styles.aiGeneratingBadge}>
                      <span style={styles.dotSpinner}>⋯</span> Claude AI 리포트 생성 중
                    </span>
                  ) : (
                    <span style={styles.aiReportBadge}>✨ AI 생성 리포트</span>
                  )}
                </div>
                {isGeneratingReport && sessionLogs.indexOf(log) === 0 ? (
                  <div style={styles.reportLoading}>
                    <div style={styles.reportSpinner} />
                    <p style={styles.reportLoadingText}>Claude AI가 세션 데이터를 분석하여 전문 리포트를 작성하고 있습니다...</p>
                  </div>
                ) : (
                  <p style={styles.summaryText}>{log.summary}</p>
                )}
              </div>
            </div>
          ))}
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
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
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
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  exportBtn: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #E5E4E7',
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    color: '#4A4A4A',
    boxShadow: '0 2px 6px rgba(74, 74, 74, 0.08)',
    transition: 'all 0.2s ease',
  },
  restartBtn: {
    backgroundColor: '#A8D5C2',
    border: '2px solid #81B8A1',
    color: '#4A4A4A',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(129, 184, 161, 0.2)',
    transition: 'all 0.2s ease',
  },
  studentWaitBadge: {
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    border: '1.5px solid #A8D5C2',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px dashed #E5E4E7',
    textAlign: 'center',
  },
  emptyIllustration: {
    fontSize: '56px',
    marginBottom: '16px',
    opacity: 0.6,
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
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: '40px',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(74, 74, 74, 0.08)',
    border: '1px solid rgba(168, 213, 194, 0.12)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  logCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  dateBadge: {
    fontSize: '12px',
    color: '#7E7E7E',
    fontWeight: '700',
    backgroundColor: '#FDFAF5',
    padding: '4px 12px',
    borderRadius: '8px',
  },
  theoryTag: {
    backgroundColor: '#EBF7F2',
    color: '#81B8A1',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '8px',
  },
  logStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  statBox: {
    backgroundColor: '#FDFAF5',
    padding: '10px 16px',
    borderRadius: '10px',
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#7E7E7E',
  },
  statVal: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4A4A4A',
  },
  toolkitsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  toolkitBadge: {
    backgroundColor: '#FBE6D8',
    color: '#E0A481',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid #F4C2A1',
  },
  logDivider: {
    height: '1px',
    backgroundColor: '#F3EFEA',
    margin: '16px 0',
  },
  logSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#81B8A1',
    fontWeight: '700',
  },
  summaryText: {
    fontSize: '13px',
    color: '#4A4A4A',
    lineHeight: '1.6',
  },
  summaryLabelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    flexWrap: 'wrap' as const,
  },
  aiReportBadge: {
    backgroundColor: '#F0EBFF',
    color: '#7C5CBF',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '10px',
    border: '1px solid #C8B4F0',
  },
  aiGeneratingBadge: {
    backgroundColor: '#FFF8EC',
    color: '#D4870A',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '10px',
    border: '1px solid #F4C2A1',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  dotSpinner: {
    fontSize: '16px',
    animation: 'float 1s infinite ease-in-out',
    letterSpacing: '2px',
  },
  reportLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FDFAF5',
    borderRadius: '10px',
    padding: '14px 18px',
    border: '1px dashed #F4C2A1',
  },
  reportSpinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #FDFAF5',
    borderTop: '3px solid #A8D5C2',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
    flexShrink: 0,
  },
  reportLoadingText: {
    fontSize: '13px',
    color: '#7E7E7E',
    fontStyle: 'italic',
  },
};
