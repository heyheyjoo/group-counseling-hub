import { useState, useEffect, useRef } from 'react';
import { generateSessionReport } from '../services/claudeApi';

export interface Issue {
  id: string;
  text: string;
  emoji: string;
  createdAt: string;
}

export interface Sticker {
  id: string;
  emoji: string;
  timestamp: number;
}

export interface SessionLog {
  id: string;
  date: string;
  theory: string;
  issueCount: number;
  stickerCount: number;
  toolkits: string[];
  summary: string;
}

export type ToolkitType = 'tipp' | 'emotion' | 'stop';

const CHANNEL_NAME = 'group_counseling_channel';

// Helper to safe-parse LocalStorage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage parse error for key', key, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('LocalStorage save error for key', key, error);
  }
};

export const useSharedState = () => {
  // 1. React States initialized from LocalStorage
  const [step, setStepState] = useState<number>(() => getLocalStorage('gc_step', 0));
  const [issues, setIssuesState] = useState<Issue[]>(() => getLocalStorage('gc_issues', []));
  const [theory, setTheoryState] = useState<string | null>(() => getLocalStorage('gc_theory', null));
  const [stickers, setStickersState] = useState<Sticker[]>(() => getLocalStorage('gc_stickers', []));
  const [sessionLogs, setSessionLogsState] = useState<SessionLog[]>(() => getLocalStorage('gc_session_logs', []));
  const [activeToolkit, setActiveToolkitState] = useState<ToolkitType>(() => getLocalStorage('gc_active_toolkit', 'tipp'));

  // Track which toolkits have been used in this session
  const [usedToolkits, setUsedToolkits] = useState<string[]>(() => {
    const stored = getLocalStorage<string[]>('gc_used_toolkits', []);
    return stored;
  });

  // Claude 리포트 생성 중 여부
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // 2. BroadcastChannel ref to keep a stable channel instance
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel and listen for events
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case 'SYNC_STEP':
          setStepState(payload);
          break;
        case 'SYNC_ISSUES':
          setIssuesState(payload);
          break;
        case 'SYNC_THEORY':
          setTheoryState(payload);
          break;
        case 'SYNC_STICKERS':
          setStickersState(payload);
          break;
        case 'SYNC_SESSION_LOGS':
          setSessionLogsState(payload);
          break;
        case 'SYNC_ACTIVE_TOOLKIT':
          setActiveToolkitState(payload);
          break;
        case 'STICKER_RECEIVED':
          // Append to local stickers list
          setStickersState((prev) => {
            const next = [...prev, payload];
            setLocalStorage('gc_stickers', next);
            return next;
          });
          break;
        default:
          break;
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // 3. Setter & Action functions that update state locally, save to LS, and broadcast

  const setStep = (newStep: number) => {
    setStepState(newStep);
    setLocalStorage('gc_step', newStep);
    channelRef.current?.postMessage({ type: 'SYNC_STEP', payload: newStep });
  };

  const addIssue = (text: string, emoji: string) => {
    const newIssue: Issue = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      emoji,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    const nextIssues = [...issues, newIssue];
    setIssuesState(nextIssues);
    setLocalStorage('gc_issues', nextIssues);
    channelRef.current?.postMessage({ type: 'SYNC_ISSUES', payload: nextIssues });
  };

  const fillDummyIssues = () => {
    const dummyData: Issue[] = [
      {
        id: 'dummy-1',
        text: '갑자기 화가 치밀어 오를 때 감정을 주체하기가 너무 힘들어요.',
        emoji: '😡',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-2',
        text: '친구와 사소한 다툼이 생기면 관계가 끝날까 봐 극도로 불안해집니다.',
        emoji: '😰',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-3',
        text: '스트레스를 받으면 충동적으로 행동해서 나중에 항상 후회해요.',
        emoji: '💥',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-4',
        text: '내 감정이 뭔지 잘 모르겠고, 텅 빈 것 같은 기분이 들 때가 많아요.',
        emoji: '🫥',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-5',
        text: '부정적인 생각이 한 번 들면 멈추기가 어려워서 너무 괴롭습니다.',
        emoji: '🌪️',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    const nextIssues = [...issues, ...dummyData];
    setIssuesState(nextIssues);
    setLocalStorage('gc_issues', nextIssues);
    channelRef.current?.postMessage({ type: 'SYNC_ISSUES', payload: nextIssues });
  };

  const selectTheory = (selectedTheory: string) => {
    setTheoryState(selectedTheory);
    setLocalStorage('gc_theory', selectedTheory);
    channelRef.current?.postMessage({ type: 'SYNC_THEORY', payload: selectedTheory });

    // Transition to step 3 (Live Session)
    setStep(3);
  };

  const setActiveToolkit = (toolkit: ToolkitType) => {
    setActiveToolkitState(toolkit);
    setLocalStorage('gc_active_toolkit', toolkit);
    channelRef.current?.postMessage({ type: 'SYNC_ACTIVE_TOOLKIT', payload: toolkit });

    // Track used toolkits
    const toolkitLabel = toolkit === 'tipp' ? 'TIPP 호흡 타이머' : toolkit === 'emotion' ? '감정 온도계' : 'STOP 성찰 카드';
    setUsedToolkits((prev) => {
      if (prev.includes(toolkitLabel)) return prev;
      const next = [...prev, toolkitLabel];
      setLocalStorage('gc_used_toolkits', next);
      return next;
    });
  };

  const sendSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Math.random().toString(36).substring(2, 9),
      emoji,
      timestamp: Date.now(),
    };
    
    // Add locally
    setStickersState((prev) => {
      const next = [...prev, newSticker];
      setLocalStorage('gc_stickers', next);
      return next;
    });

    // Send via broadcast
    channelRef.current?.postMessage({ type: 'STICKER_RECEIVED', payload: newSticker });
  };

  const endSession = async () => {
    const sessionDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Include current active toolkit if not already tracked
    const currentLabel = activeToolkit === 'tipp' ? 'TIPP 호흡 타이머' : activeToolkit === 'emotion' ? '감정 온도계' : 'STOP 성찰 카드';
    const finalToolkits = usedToolkits.includes(currentLabel) ? usedToolkits : [...usedToolkits, currentLabel];

    // Go to step 4 immediately (with placeholder summary)
    const placeholderSummary = `총 ${issues.length}개의 고민을 중심으로 ${theory || 'DBT'} 기법을 활용한 ${finalToolkits.join(', ')} 활동을 진행하였습니다. Claude AI가 종합 리포트를 생성 중입니다...`;

    const newLog: SessionLog = {
      id: Math.random().toString(36).substring(2, 9),
      date: sessionDate,
      theory: theory || 'DBT (변증법적 행동치료)',
      issueCount: issues.length,
      stickerCount: stickers.length,
      toolkits: finalToolkits,
      summary: placeholderSummary,
    };

    const nextLogs = [newLog, ...sessionLogs];
    setSessionLogsState(nextLogs);
    setLocalStorage('gc_session_logs', nextLogs);
    channelRef.current?.postMessage({ type: 'SYNC_SESSION_LOGS', payload: nextLogs });
    setStep(4);

    // Claude API로 리포트 비동기 생성
    setIsGeneratingReport(true);
    try {
      const aiSummary = await generateSessionReport({
        date: sessionDate,
        theory: theory || 'DBT (변증법적 행동치료)',
        issueCount: issues.length,
        stickerCount: stickers.length,
        toolkits: finalToolkits,
        issues: issues,
      });

      // 생성 완료 후 최신 로그의 summary 업데이트
      setSessionLogsState((prev) => {
        const updated = prev.map((log) =>
          log.id === newLog.id ? { ...log, summary: aiSummary } : log
        );
        setLocalStorage('gc_session_logs', updated);
        channelRef.current?.postMessage({ type: 'SYNC_SESSION_LOGS', payload: updated });
        return updated;
      });
    } catch (err) {
      console.warn('Claude 리포트 생성 실패, 기본 요약 유지:', err);
      // 폴백: 기존 placeholder 유지, 단 문구 교체
      setSessionLogsState((prev) => {
        const updated = prev.map((log) =>
          log.id === newLog.id
            ? { ...log, summary: `친구 갈등 및 불안 등 총 ${issues.length}개의 고민을 중심으로, ${theory || 'DBT'} 기법을 활용한 ${finalToolkits.join(', ')} 활동을 성공적으로 진행하였습니다. 집단원들이 총 ${stickers.length}개의 긍정적인 응원 스티커를 실시간으로 주고받으며 심리적 안정감을 공유했습니다.` }
            : log
        );
        setLocalStorage('gc_session_logs', updated);
        channelRef.current?.postMessage({ type: 'SYNC_SESSION_LOGS', payload: updated });
        return updated;
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetSession = () => {
    // Clear issues, theory, stickers, toolkit, but keep session logs
    setIssuesState([]);
    setLocalStorage('gc_issues', []);
    channelRef.current?.postMessage({ type: 'SYNC_ISSUES', payload: [] });

    setTheoryState(null);
    setLocalStorage('gc_theory', null);
    channelRef.current?.postMessage({ type: 'SYNC_THEORY', payload: null });

    setStickersState([]);
    setLocalStorage('gc_stickers', []);
    channelRef.current?.postMessage({ type: 'SYNC_STICKERS', payload: [] });

    setActiveToolkitState('tipp');
    setLocalStorage('gc_active_toolkit', 'tipp');
    channelRef.current?.postMessage({ type: 'SYNC_ACTIVE_TOOLKIT', payload: 'tipp' });

    setUsedToolkits([]);
    setLocalStorage('gc_used_toolkits', []);

    // Go to step 1
    setStep(1);
  };

  return {
    step,
    issues,
    theory,
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
  };
};
