import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showPadding?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className,
  showPadding = true 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      "max-w-md mx-auto relative",
      "border-x border-border",
      showPadding && "px-6 py-4",
      className
    )}>
      {children}
    </div>
  );
};