import { ReactNode, useRef } from 'react';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { useSafeAreaInsets } from '@/hooks/useSafeAreaInsets';
import { cn } from '@/lib/utils';

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
}

export const ScrollableContainer = ({ children, className }: ScrollableContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const needsScroll = useScrollDetection({ containerRef });
  const { insets } = useSafeAreaInsets();

  return (
    <div
      ref={containerRef}
      className={cn(
        'scrollable-container bg-background h-screen',
        needsScroll ? 'scrollable-enabled' : '',
        className
      )}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};
