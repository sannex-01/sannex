const BACKGROUND_MUSIC_URL = "https://cdn.pixabay.com/audio/2025/04/01/audio_02ca8fbc5a.mp3";

type MusicListener = (isPlaying: boolean) => void;

let audioElement: HTMLAudioElement | null = null;
let hasAttemptedAutoplay = false;
let isPlaying = false;
const listeners = new Set<MusicListener>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(isPlaying));
};

const ensureAudioElement = () => {
  if (!audioElement) {
    audioElement = new Audio(BACKGROUND_MUSIC_URL);
    audioElement.loop = true;
    audioElement.volume = 0.3;

    audioElement.addEventListener("play", () => {
      isPlaying = true;
      notifyListeners();
    });

    audioElement.addEventListener("pause", () => {
      isPlaying = false;
      notifyListeners();
    });

    audioElement.addEventListener("ended", () => {
      isPlaying = false;
      notifyListeners();
    });
  }

  return audioElement;
};

export const subscribeToBackgroundMusic = (listener: MusicListener) => {
  listeners.add(listener);
  listener(isPlaying);

  return () => {
    listeners.delete(listener);
  };
};

export const isBackgroundMusicPlaying = () => isPlaying;

export const playBackgroundMusic = async () => {
  const audio = ensureAudioElement();

  try {
    await audio.play();
    return true;
  } catch (error) {
    console.log("Background music play prevented:", error);
    isPlaying = !audio.paused;
    notifyListeners();
    return false;
  }
};

export const pauseBackgroundMusic = () => {
  const audio = ensureAudioElement();
  audio.pause();
};

export const attemptBackgroundMusicAutoplayOnce = (delayMs = 2000) => {
  if (hasAttemptedAutoplay) {
    return;
  }

  hasAttemptedAutoplay = true;

  window.setTimeout(() => {
    void playBackgroundMusic();
  }, delayMs);
};
