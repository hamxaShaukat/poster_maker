"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";

const CanvasPrint = ({
  imageBase64,
  canvasWidth,
  canvasHeight,
  borderColor = "white",
  borderSize = 10,
  isFramed = false,
}: {
  imageBase64: string;
  canvasWidth: number;
  canvasHeight: number;
  borderColor?: string;
  borderSize?: number;
  isFramed?: boolean;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load image from base64
  useEffect(() => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => setImage(img);
  }, [imageBase64]);

  // Border size in pixels
  const adjustedBorderSize = borderSize;

  return (
    <div className="flex flex-col items-center justify-center">
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {/* Frame (if enabled) */}
          {isFramed && (
            <Rect
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill="brown"
            />
          )}

          {/* Canvas Border */}
          <Rect
            x={adjustedBorderSize}
            y={adjustedBorderSize}
            width={canvasWidth - 2 * adjustedBorderSize}
            height={canvasHeight - 2 * adjustedBorderSize}
            fill={borderColor}
          />

          {/* Image */}
          {image && (
            <KonvaImage
              image={image}
              x={adjustedBorderSize}
              y={adjustedBorderSize}
              width={canvasWidth - 2 * adjustedBorderSize}
              height={canvasHeight - 2 * adjustedBorderSize}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasPrint;
