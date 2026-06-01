import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count,
}) => {
  const [hovered, setHovered] = useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
  };

  const containerSizes = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  const displayRating = interactive ? (hovered || rating) : rating;

  return (
    <div className={`flex items-center ${containerSizes[size]}`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.floor(displayRating);
        const partial = !filled && starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;
        const fillPercent = partial ? (displayRating % 1) * 100 : 0;

        return (
          <button
            key={i}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} disabled:cursor-default`}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            {partial ? (
              <span className="relative inline-block">
                <Star className={`${sizeClasses[size]} text-gray-300`} />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star className={`${sizeClasses[size]} text-accent fill-accent`} />
                </span>
              </span>
            ) : (
              <Star
                className={`${sizeClasses[size]} ${
                  filled
                    ? 'text-accent fill-accent'
                    : interactive && hovered >= starValue
                    ? 'text-accent/60 fill-accent/60'
                    : 'text-gray-300'
                }`}
              />
            )}
          </button>
        );
      })}
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
