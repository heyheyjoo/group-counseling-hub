import { useState, useEffect, useRef } from 'react';

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
  summary: string;
}

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
        text: '친구 관계가 요즘 너무 삐걱거려서 학교 가는 게 무섭고 스트레스 받아요.',
        emoji: '😢',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-2',
        text: '시험 기간이 다가올 때마다 심장이 터질 것 같고 아무것도 손에 안 잡혀요.',
        emoji: '😰',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-3',
        text: '작은 일에도 갑자기 감정이 욱하고 솟구쳐서 나중에 후회하곤 해요.',
        emoji: '😡',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-4',
        text: '부모님이 제 이야기를 전혀 들어주지 않으시는 것 같아 집에서도 외롭습니다.',
        emoji: '😔',
        createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'dummy-5',
        text: '순간적으로 참지 못하고 화를 내거나 충동적으로 행동해서 큰 오해를 사요.',
        emoji: '🔥',
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

  const endSession = () => {
    const sessionDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLog: SessionLog = {
      id: Math.random().toString(36).substring(2, 9),
      date: sessionDate,
      theory: theory || 'DBT (변증법적 행동치료)',
      issueCount: issues.length,
      stickerCount: stickers.length,
      summary: `친구 갈등 및 불안 등 총 ${issues.length}개의 고민을 중심으로, ${theory || 'DBT'} 기법을 활용한 1분 호흡(TIPP) 훈련을 성공적으로 진행하였습니다. 집단원들이 총 ${stickers.length}개의 긍정적인 응원 스티커를 실시간으로 주고받으며 심리적 안정감을 공유했습니다.`,
    };

    const nextLogs = [newLog, ...sessionLogs];
    setSessionLogsState(nextLogs);
    setLocalStorage('gc_session_logs', nextLogs);
    channelRef.current?.postMessage({ type: 'SYNC_SESSION_LOGS', payload: nextLogs });

    // Go to step 4
    setStep(4);
  };

  const resetSession = () => {
    // Clear issues, theory, stickers, but keep session logs
    setIssuesState([]);
    setLocalStorage('gc_issues', []);
    channelRef.current?.postMessage({ type: 'SYNC_ISSUES', payload: [] });

    setTheoryState(null);
    setLocalStorage('gc_theory', null);
    channelRef.current?.postMessage({ type: 'SYNC_THEORY', payload: null });

    setStickersState([]);
    setLocalStorage('gc_stickers', []);
    channelRef.current?.postMessage({ type: 'SYNC_STICKERS', payload: [] });

    // Go to step 1
    setStep(1);
  };

  // Full reset option (clean everything including logs)
  const fullReset = () => {
    localStorage.clear();
    setStepState(1);
    setIssuesState([]);
    setTheoryState(null);
    setStickersState([]);
    setSessionLogsState([]);
  };

  return {
    step,
    issues,
    theory,
    stickers,
    sessionLogs,
    setStep,
    addIssue,
    fillDummyIssues,
    selectTheory,
    sendSticker,
    endSession,
    resetSession,
    fullReset,
  };
};
