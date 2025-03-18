import { useCallback, useEffect, useRef, useState } from "react";
import Circle from "./Circle";

export interface ICircle {
  id: number;
  position: {
    x: number;
    y: number;
  };
}

const TIME_TO_DISAPPEAR = 3000;
const FRAME_SIZE = 500;
const CIRCLE_SIZE = 40;

export default function App() {
  const timeoutIdsRef = useRef<number>(0);

  const [circlesNumber, setCirclesNumber] = useState<number>(0);
  const [circles, setCircles] = useState<ICircle[] | null>(null);
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
        setIsRunning(false);
      }
      if (circleId === nextNumber && !isFailed) {
        if (circleId < circlesNumber) setNextNumber(circleId + 1);
        if (circleId === circlesNumber) {
          setTimeout(() => {
            setIsComplete(true);
            setIsRunning(false);
            setCircles(null);
          }, 3000);
        }
      }
    },
    [circlesNumber, isFailed, nextNumber]
  );

  const handleRemove = (circleId: number) => {
    setCircles((circles) =>
      circles ? circles.filter((circle) => circle.id !== circleId) : null
    );
  };

  // timer for game
  useEffect(() => {
    let timerInterval: number | undefined;
    if (isRunning && !isFailed && !isComplete) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev + 0.1);
        if (isComplete) clearInterval(timerInterval);
      }, 100);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isRunning, isFailed, isComplete]);

  const generateCircles = (count: number): ICircle[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      position: {
        x: Math.random() * (FRAME_SIZE - CIRCLE_SIZE),
        y: Math.random() * (FRAME_SIZE - CIRCLE_SIZE),
      },
    }));
  };

  const handlePlayGame = () => {
    if (circlesNumber <= 0) return;
    if (isFailed) setCircles(null);
    setIsFailed(false);
    setIsComplete(false);
    setIsAutoPlay(false);
    setIsRunning(true);
    setNextNumber(1);
    setTimer(0);
    setCircles(generateCircles(circlesNumber));
  };

  const handleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="border p-6 relative">
        {/* header */}
        <div className="flex flex-col items-start gap-3">
          <h2
            className={`font-semibold ${
              isComplete
                ? "text-green-500"
                : isFailed
                ? "text-red-500"
                : "text-black"
            }`}
          >
            {isComplete ? "ALL CLEARED" : isFailed ? "GAME OVER" : "LET'S PLAY"}
          </h2>
          <div className="grid text-start grid-cols-2 max-w-[300px] gap-y-2 text-sm">
            <p>Points:</p>
            <input
              type="text"
              className="border px-1"
              min="1"
              onChange={(e) => setCirclesNumber(+e.target.value)}
              value={circlesNumber}
            />
            <p>Time:</p>
            <p>{timer.toFixed(1)}s</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePlayGame} disabled={circlesNumber <= 0}>
              {circles ? "Restart" : "Play"}
            </button>
            {isRunning && !isFailed && !isComplete && (
              <button onClick={handleAutoPlay}>
                Auto Play {isAutoPlay ? "ON" : "OFF"}
              </button>
            )}
          </div>
        </div>
        {/* point box */}
        <div className="border w-[500px] aspect-square my-3 relative overflow-hidden">
          {circles?.map((circle) => (
            <Circle
              key={`${circle.id}-${circle.position.x}-${circle.position.y}`}
              circle={circle}
              circlesNumber={circlesNumber}
              onClickCircle={handleCircleClick}
              isError={isFailed}
              onRemoveCircle={handleRemove}
            />
          ))}
        </div>

        {isRunning && (
          <span className="text-xs absolute left-6 bottom-4">
            Next: {nextNumber}
          </span>
        )}
      </div>
    </div>
  );
}
