import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  attemptBackgroundMusicAutoplayOnce,
  isBackgroundMusicPlaying,
  pauseBackgroundMusic,
  playBackgroundMusic,
  subscribeToBackgroundMusic,
} from "@/lib/backgroundMusic";

const MusicPlayer = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(isBackgroundMusicPlaying());

  useEffect(() => {
    const unsubscribe = subscribeToBackgroundMusic(setIsPlaying);
    attemptBackgroundMusicAutoplayOnce(2000);

    return unsubscribe;
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      pauseBackgroundMusic();
      return;
    }

    await playBackgroundMusic();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlay}
      aria-label={isPlaying ? t("musicPlayer.pause") : t("musicPlayer.play")}
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
