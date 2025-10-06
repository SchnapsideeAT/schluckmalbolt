import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export const Confetti = ({ 
  trigger = false, 
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.5 }
}: ConfettiProps) => {
  useEffect(() => {
    if (trigger) {
      // Fire confetti
      confetti({
        particleCount,
        spread,
        origin,
        colors: ['#f2c94c', '#eb5757', '#6fcf97', '#56ccf2', '#9b51e0'],
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
      });

      // Fire a second burst after a delay
      setTimeout(() => {
        confetti({
          particleCount: particleCount / 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f2c94c', '#eb5757', '#6fcf97'],
        });
        confetti({
          particleCount: particleCount / 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#56ccf2', '#9b51e0', '#f2c94c'],
        });
      }, 250);
    }
  }, [trigger, particleCount, spread, origin]);

  return null;
};

// Utility function to trigger confetti programmatically
export const triggerConfetti = (options?: Partial<ConfettiProps>) => {
  const {
    particleCount = 100,
    spread = 70,
    origin = { x: 0.5, y: 0.5 }
  } = options || {};

  confetti({
    particleCount,
    spread,
    origin,
    colors: ['#f2c94c', '#eb5757', '#6fcf97', '#56ccf2', '#9b51e0'],
    ticks: 200,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
  });

  setTimeout(() => {
    confetti({
      particleCount: particleCount / 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#f2c94c', '#eb5757', '#6fcf97'],
    });
    confetti({
      particleCount: particleCount / 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#56ccf2', '#9b51e0', '#f2c94c'],
    });
  }, 250);
};
