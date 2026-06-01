import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-accent',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`}
      style={{ borderStyle: 'solid', borderColor: 'currentColor', borderTopColor: 'transparent' }}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream-DEFAULT/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-900 rounded-full animate-spin" />
          <p className="text-primary-900 font-medium font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
