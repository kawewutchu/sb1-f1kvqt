import { useCallback } from 'react';

const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function useSound() {
  const announceQueue = useCallback((serviceName: string, queueNumber: string) => {
    // Play notification sound first
    const audio = new Audio(NOTIFICATION_SOUND);
    
    // Then do voice announcement
    const announcement = new SpeechSynthesisUtterance();
    announcement.lang = 'th-TH';
    announcement.text = `${serviceName} คิวหมายเลข ${queueNumber.split('').join(' ')}`;
    announcement.rate = 0.9; // Slightly slower for clarity
    announcement.volume = 1;

    audio.play()
      .then(() => {
        audio.addEventListener('ended', () => {
          window.speechSynthesis.speak(announcement);
        });
      })
      .catch(() => {
        // Fallback to just voice if sound fails
        window.speechSynthesis.speak(announcement);
      });
  }, []);

  return { announceQueue };
}