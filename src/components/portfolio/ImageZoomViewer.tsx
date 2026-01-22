"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomViewerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function ImageZoomViewer({
  src,
  alt,
  width,
  height,
}: ImageZoomViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const minScale = 1;
  const maxScale = 3;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.25, minScale);
      if (newScale === minScale) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleReset = () => {
    setScale(minScale);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex flex-col items-center h-full">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          disabled={scale >= maxScale}
          size="icon"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70 text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          disabled={scale <= minScale}
          size="icon"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70 text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleReset}
          disabled={scale === minScale}
          size="icon"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden cursor-move w-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="max-w-full max-h-[70vh] object-contain"
            priority
          />
        </div>
      </div>

      {/* Hint Text */}
      <p className="text-sm text-muted-foreground mt-4">
        Use mouse wheel or +/- keys to zoom, drag to pan
      </p>
    </div>
  );
}
