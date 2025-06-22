/**
 * Image Atom Component
 * Foundational image component with fallback support
 */

import React, { useState } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  'data-testid'?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  width,
  height,
  className = '',
  objectFit = 'cover',
  loading = 'lazy',
  'data-testid': testId,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError && fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsError(true);
    }
  };

  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={handleError}
      className={`${objectFitClasses[objectFit]} ${className}`}
      data-testid={testId}
    />
  );
};

export default Image;
