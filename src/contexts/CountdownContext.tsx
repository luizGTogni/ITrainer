import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  percentToTimeCountdown: number;
  startCountdown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge, handleNotifyMe } = useContext(ChallengesContext);

  const [minute, setMinute] = useState(0.1);
  const [timeInitial, setTimeInitial] = useState(minute * 60);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(timeInitial / 60);
  const seconds = timeInitial % 60;

  const percentToTimeCountdown = Math.round((timer * 100)) / (minute * 60);

  function startCountdown() {
    handleNotifyMe();
    setIsActive(true);
  }

  function resetCountdown() {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTimeInitial(minute * 60);
    setTimer(0);
  }

  useEffect(() => {
    if (isActive && timeInitial > 0) {
      countdownTimeout = setTimeout(() => {
        setTimer(timer + 1);
        setTimeInitial(timeInitial - 1);
      }, 1000)
    } else if (isActive && timeInitial === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, timeInitial])

  return (
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      percentToTimeCountdown,
      startCountdown,
      resetCountdown,
    }}>
      {children}
    </CountdownContext.Provider>
  )
}