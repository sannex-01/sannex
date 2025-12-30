import { useEffect, useState } from 'react';

const SnowEffect = () => {
  const [showSnow, setShowSnow] = useState(false);

  useEffect(() => {
    // Check if current month is December (11) or January (0)
    const currentMonth = new Date().getMonth();
    setShowSnow(currentMonth === 11 || currentMonth === 0);
  }, []);

  if (!showSnow) return null;

  // Generate snowflakes with varying properties
  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${8 + Math.random() * 4}s`,
    size: `${8 + Math.random() * 8}px`,
    opacity: Math.random() * 0.6 + 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white animate-snowfall animate-blink"
          style={{
            left: flake.left,
            top: '-10vh',
            animationDelay: flake.animationDelay,
            animationDuration: flake.animationDuration,
            fontSize: flake.size,
            opacity: flake.opacity,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  );
};

export default SnowEffect;
