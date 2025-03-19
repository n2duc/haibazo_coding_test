import { useEffect, useRef, useState } from "react";
import { ICircle } from "./App";

interface CircleProps {
  circle: ICircle;
  circlesNumber: number;
  onClickCircle: (id: number) => void;
  onRemoveCircle: (id: number) => void;
  isError: boolean;
  isAutoPlay?: boolean;
  nextNumber: number;
}

const TIME_TO_DISAPPEAR = 3;

const Circle = ({
  circle,
  circlesNumber,
  onClickCircle,
  onRemoveCircle,
  isError,
  isAutoPlay,
  nextNumber,
}: CircleProps) => {
  const [timer, setTimer] = useState<number>(TIME_TO_DISAPPEAR);
  const [isClick, setIsClick] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer === 0) {
      onRemoveCircle(circle.id);
    }
  }, [timer, onRemoveCircle, circle.id]);

  useEffect(() => {
    if (isAutoPlay && !isError) {
      if (circle.id === nextNumber) {
        setIsClick(true);
      }
      if (timer === 0) {
        onClickCircle(circle.id);
        onRemoveCircle(circle.id);
      }
    }
  }, [isAutoPlay, nextNumber, circle.id, isError, timer]);

  useEffect(() => {
    if (isClick && !isError) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 0.1));
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isError, isClick]);

  const handleClick = (id: number) => {
    console.log("id", id);
    setIsClick(prev => !prev);
    onClickCircle(id);
  };

  return (
    <button
      key={circle.id}
      className={`absolute flex flex-col items-center justify-center rounded-full border size-10 border-red-600 text-sm leading-4 select-none cursor-pointer ${isClick ? "bg-orange-700" : "bg-white"}`}
      style={{
        left: circle.position.x,
        top: circle.position.y,
        zIndex: circlesNumber - circle.id + 1,
        opacity: timer / TIME_TO_DISAPPEAR,
      }}
      onClick={() => handleClick(circle.id)}
      disabled={isError}
    >
      {circle.id}
      {isClick && <span className="text-xs leading-none text-white">{timer.toFixed(1)}s</span>}
    </button>
  );
};

export default Circle;
