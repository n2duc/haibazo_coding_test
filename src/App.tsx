import { useCallback, useEffect, useState } from "react";
import Circle from "./Circle";

export interface ICircle {
  id: number;
  position: {
    x: number;
    y: number;
  };
};

const TIME_TO_DISAPPEAR = 3000;
const FRAME_SIZE = 500;
const CIRCLE_SIZE = 40;

export default function App() {
  const [circlesNumber, setCirclesNumber] = useState<number>(0);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [nextNumber, setNextNumber] = useState<number>(1);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const handleCircleClick = useCallback(
    (circleId: number) => {
      if (circleId !== nextNumber) {
        setIsFailed(true);
        setIsAutoPlay(false);
      } else if (circleId === nextNumber && !isFailed) {
        if (circleId < circlesNumber) setNextNumber(circleId + 1);
        setTimeout(() => {
          setCircles(circles => circles.filter((circle) => circle.id !== circleId));
          if (circleId === circlesNumber) {
            setIsComplete(true);
            setIsAutoPlay(false);
            setCircles([]);
          };
        }, TIME_TO_DISAPPEAR);
      }
    },
    [circlesNumber, isFailed, nextNumber]  
  );

  useEffect(() => {
    let timeoutId: number | undefined;
    if (isAutoPlay && !isFailed && !isComplete) {
      timeoutId = setInterval(() => {
        handleCircleClick(nextNumber);
      }, TIME_TO_DISAPPEAR);
    } else {
      clearInterval(timeoutId);
    }
    return () => clearInterval(timeoutId);
  }, [isAutoPlay, nextNumber, circles, handleCircleClick, isFailed, isComplete]);

  useEffect(() => {
    let timerInterval: number | undefined;
    if (isRunning && !isFailed && !isComplete) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval)
    };
  }, [isRunning, isFailed, isComplete]);

  
  const handlePlayGame = () => {
    const generateCircles = (circles: number) => {
      return Array.from({ length: circles }, (_, index) => ({
        id: index + 1,
        position: {
          x: Math.random() * (FRAME_SIZE - CIRCLE_SIZE),
          y: Math.random() * (FRAME_SIZE - CIRCLE_SIZE),
        },
      }));
    };
    const quantity = generateCircles(circlesNumber);
    if (quantity && quantity.length > 0) {
      setCircles(quantity);
      setIsRunning(true);
      setNextNumber(1);
      setIsFailed(false);
      setTimer(0);
      setIsComplete(false);
      setIsAutoPlay(false);
    }
  };

  const handleAutoPlay = () => {
    setIsAutoPlay(prev => !prev);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="border p-6 relative">
        {/* header */}
        <div className="flex flex-col items-start gap-3">
          <h2 className={`font-semibold ${isComplete ? "text-green-500" : isFailed ? "text-red-500" : "text-black"}`}>
            {isComplete ? "ALL CLEARED" : isFailed ? "GAME OVER" : "LET'S PLAY"}
          </h2>
          <div className="grid text-start grid-cols-2 max-w-[300px] gap-y-2 text-sm">
            <p>Points:</p>
            <input
              type="text"
              className="border px-1"
              onChange={(e) => setCirclesNumber(+e.target.value)}
              value={circlesNumber}
            />
            <p>Time:</p>
            <p>{timer.toFixed(1)}s</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePlayGame}>
              {isRunning ? "Restart" : "Play"}
            </button>
            {isRunning && !isFailed && !isComplete && <button onClick={handleAutoPlay}>Auto Play {isAutoPlay ? "ON" : "OFF"}</button>}
          </div>
        </div>
        {/* point box */}
        <div className="border w-[500px] aspect-square my-3 relative overflow-hidden">
          {circles?.map((circle) => {
            return (
              <Circle
                key={circle.id}
                circle={circle}
                circlesNumber={circlesNumber}
                onClickCircle={handleCircleClick}
                isError={isFailed}
              />
            );
          })}
        </div>

        {isRunning && <span className="text-xs absolute left-6 bottom-4">Next: {nextNumber}</span>}
      </div>
    </div>
  );
}
