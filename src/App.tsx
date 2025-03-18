import { useEffect, useState } from "react";

interface ICircle {
  id: number;
  position: {
    x: number;
    y: number;
  };
};

export default function App() {
  const [circlesNumber, setCirclesNumber] = useState<number>(0);
  const [circles, setCircles] = useState<ICircle[]>([]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  const randomPosition = () => {
    return {
      x: Math.random() * (500 - 40),
      y: Math.random() * (500 - 40),
    };
  };

  const generateCircle = (circles: number) => {
    return Array.from({ length: circles }, (_, index) => ({
      id: index + 1,
      position: randomPosition(),
    }));
  };

  const handlePlayGame = () => {
    const quantity = generateCircle(circlesNumber);
    if (quantity && quantity.length > 0) {
      setCircles(quantity);
      setIsRunning(true);
    }
  };

  const handleDisappear = (circleId: number) => {
    setCircles(circles => circles.filter((circle) => circle.id !== circleId));
  };

  const handleAutoPlay = () => {};

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="border p-6">
        {/* header */}
        <div className="flex flex-col items-start gap-3">
          <h2 className="font-medium">LET'S PLAY</h2>
          <div className="grid text-start grid-cols-2 max-w-[300px] gap-y-2 text-sm">
            <p>Point:</p>
            <input
              type="text"
              className="border px-1"
              onChange={(e) => setCirclesNumber(+e.target.value)}
              value={circlesNumber}
            />
            <p>Time:</p>
            <p>1.1s</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePlayGame}>
              {isRunning ? "Restart" : "Play"}
            </button>
            {isRunning && <button onClick={handleAutoPlay}>Auto Play ON</button>}
          </div>
        </div>
        {/* point box */}
        <div className="border w-[500px] aspect-square my-3 relative overflow-hidden">
          {circles?.map((circle) => {
            return (
              <div
                key={circle.id}
                className="absolute flex flex-col items-center justify-center rounded-full border size-10 border-red-600 bg-white text-sm leading-4"
                style={{
                  left: circle.position.x,
                  top: circle.position.y,
                  zIndex: (circlesNumber - circle.id + 1),
                }}
                onClick={() =>  handleDisappear(circle.id)}
              >
                {circle.id}
                <span className="text-xs leading-none">2.1s</span>
              </div>
            );
          })}
        </div>

        <span className="text-xs">Next: 1</span>
      </div>
    </div>
  );
}
