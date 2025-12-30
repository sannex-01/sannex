import { useState, useEffect } from 'react';

interface WordByWordProps {
  text: string;
  delay?: number;
  className?: string;
}

const WordByWord = ({ text, delay = 50, className = '' }: WordByWordProps) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    setVisibleWords(0);
    
    const timer = setInterval(() => {
      setVisibleWords((prev) => {
        if (prev >= words.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay, words.length]);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline ${index < visibleWords ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
};

export default WordByWord;
