import { useEffect, useRef, useState } from "react";
import { ICircle } from "./App";

interface CircleProps {
  circle: ICircle;
  circlesNumber: number;
  onClickCircle: (id: number) => void;
  isError: boolean;
}

const TIME_TO_DISAPPEAR = 3;

const Circle = ({
  circle,
  circlesNumber,
  onClickCircle,
  isError,
}: CircleProps) => {
  const [timer, setTimer] = useState<number>(TIME_TO_DISAPPEAR);
  const [isClick, setIsClick] = useState<boolean>(false);
  const intervalRef = useRef<number>(null);

  useEffect(() => {
    if (isClick && !isError) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 0.1));
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isClick, isError]);

  const handleClick = (id: number) => {
    if (!isClick) {
      onClickCircle(id);
      setIsClick(true);
    }
  };

  return (
    <div
      key={circle.id}
      className="absolute flex flex-col items-center justify-center rounded-full border size-10 border-red-600 bg-white text-sm leading-4 select-none cursor-pointer"
      style={{
        left: circle.position.x,
        top: circle.position.y,
        zIndex: circlesNumber - circle.id + 1,
        opacity: timer / TIME_TO_DISAPPEAR,
      }}
      onClick={() => handleClick(circle.id)}
    >
      {circle.id}
      <span className="text-xs leading-none">{timer.toFixed(1)}s</span>
    </div>
  );
};

export default Circle;
