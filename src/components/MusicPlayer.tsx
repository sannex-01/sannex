import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MusicPlayer = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedAutoplay = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2025/04/01/audio_02ca8fbc5a.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Attempt to auto-play music on page load
    const attemptAutoplay = async () => {
      if (audioRef.current && !hasAttemptedAutoplay.current) {
        hasAttemptedAutoplay.current = true;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Auto-play was prevented by browser, user will need to click
          console.log('Auto-play prevented:', error);
          setIsPlaying(false);
        }
      }
    };

    // Try to autoplay after 2 seconds of page loaded
    const timer = setTimeout(attemptAutoplay, 2000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlay}
      aria-label={isPlaying ? t('musicPlayer.pause') : t('musicPlayer.play')}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};

export default MusicPlayer;
