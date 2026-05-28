'use client';

import React from 'react';
import Image from 'next/image';

/**
 * ProtectedImage Component
 * Prevents users from easily downloading images by:
 * - Disabling right-click context menu
 * - Blocking drag and drop
 * - Preventing image selection
 * - Adding transparent overlay
 */
export default function ProtectedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  fill = false,
  ...rest 
}) {
  // Prevent right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent selection
  const handleSelectStart = (e) => {
    e.preventDefault();
    return false;
  };

  // When using fill, we need the wrapper to be positioned
  const wrapperStyle = fill ? {
    position: 'absolute',
    inset: 0,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
  } : {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
  };

  return (
    <div
      className={`select-none ${fill ? 'absolute inset-0' : 'relative'}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onSelectStart={handleSelectStart}
      style={wrapperStyle}
    >
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        draggable={false}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        className={className}
        style={{
          userSelect: 'none',
          WebkitUserDrag: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
        }}
        {...rest}
      />

      {/* Transparent overlay to prevent direct interaction */}
      <div 
        className="absolute inset-0 cursor-default z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
}
