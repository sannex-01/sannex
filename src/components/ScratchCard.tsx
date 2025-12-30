import { useState, useRef, useEffect } from 'react';

interface ScratchCardProps {
  code: string;
  width?: number;
  height?: number;
  onComplete?: () => void;
}

const ScratchCard = ({ code, width = 300, height = 150, onComplete }: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw scratch-off coating
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(0, 0, width, height);

    // Add texture to make it look like scratch card
    ctx.fillStyle = '#9ca3af';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 20,
        Math.random() * 20
      );
    }

    // Add "Scratch Here" text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁 SCRATCH TO REVEAL', width / 2, height / 2);
  }, [width, height]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching && !isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // Erase in a circular pattern
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, width, height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percentage = (transparent / (width * height)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-sm text-muted-foreground mb-2">Your Gift Code</p>
          <p className="text-2xl font-bold text-primary tracking-wider">{code}</p>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseMove={scratch}
        onMouseLeave={() => setIsScratching(false)}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
        className="cursor-pointer border-2 border-gray-300 rounded-lg shadow-lg"
        style={{ touchAction: 'none' }}
      />
      {scratchPercentage > 0 && scratchPercentage < 60 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          {Math.round(scratchPercentage)}% revealed
        </p>
      )}
    </div>
  );
};

export default ScratchCard;
