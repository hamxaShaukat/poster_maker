"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Transformer,
} from "react-konva";

const CanvasPrint = ({
  imageBase64,
  canvasWidth,
  canvasHeight,
  borderColor = "white",
  borderSize = 10,
  isFramed = true,
  style,
  action,
}: {
  imageBase64: string;
  canvasWidth: number;
  canvasHeight: number;
  borderColor?: string;
  borderSize?: number;
  isFramed?: boolean;
  style: string;
  action: string;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Load image from base64
  useEffect(() => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      setImage(img);
      setImageDimensions({ width: canvasWidth, height: canvasHeight });
    };
  }, [canvasWidth, canvasHeight, imageBase64]);

  // Delay the appearance of the image
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 1000); // 1 second

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  console.log(action);


  const downloadCanvas = () => {
    if (!stageRef.current) return;

    // Hide transformer before capturing
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }

    // Get canvas URL
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

    // Create download link
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restore transformer
    if (transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  };


  const newAction = action.split("-")[0];
  console.log(style);
  useEffect(() => {
    if (!imageRef.current) return;

    const node = imageRef.current;
    let updatedPosition = { ...imagePosition };
    let updatedDimensions = { ...imageDimensions };

    switch (newAction) {
      case "download":
        downloadCanvas();
        break;
      case "centerX":
        updatedPosition.x = (canvasWidth - imageDimensions.width) / 2;
        break;
      case "centerY":
        updatedPosition.y = (canvasHeight - imageDimensions.height) / 2;
        break;
      case "centerXY":
        updatedPosition.x = (canvasWidth - imageDimensions.width) / 2;
        updatedPosition.y = (canvasHeight - imageDimensions.height) / 2;
        break;
      case "rotateLeft":
        node.rotation(node.rotation() - 90); // Rotate 15 degrees counter-clockwise
        break;
      case "rotateRight":
        node.rotation(node.rotation() + 90); // Rotate 15 degrees clockwise
        break;
      case "fixedToCanvas":
        updatedDimensions.width = canvasWidth;
        updatedDimensions.height = canvasHeight;
        updatedPosition.x = 0;
        updatedPosition.y = 0;
        break;
      case "fixedToWidth":
        updatedDimensions.width = canvasWidth;
        updatedDimensions.height =
          (canvasWidth / imageDimensions.width) * imageDimensions.height;
        updatedPosition.y = (canvasHeight - updatedDimensions.height) / 2;
        updatedPosition.x = 0;
        break;
      case "fixedToHeight":
        updatedDimensions.height = canvasHeight;
        updatedDimensions.width =
          (canvasHeight / imageDimensions.height) * imageDimensions.width;
        updatedPosition.x = (canvasWidth - updatedDimensions.width) / 2;
        updatedPosition.y = 0;
        break;
      default:
        break;
    }

    setImagePosition(updatedPosition);
    setImageDimensions(updatedDimensions);
    node.position(updatedPosition);
    node.width(updatedDimensions.width);
    node.height(updatedDimensions.height);
  }, [newAction]);

  useEffect(() => {
    if (transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [image, showImage]);

  // Border size in pixels
  const adjustedBorderSize = borderSize * 20;

  const createMirroredImage = () => {
    if (!image) return undefined;
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    if (!ctx) return null;
  
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    const borderThickness = adjustedBorderSize;
  
    // Mirror top border
    ctx.save();
    ctx.translate(0, borderThickness); // Move to the top border area
    ctx.scale(1, -1); // Flip vertically
    ctx.drawImage(
      image,
      0, // Crop from the top of the image
      0,
      imageDimensions.width,
      borderThickness, // Height of the mirrored section equals border thickness
      0,
      0,
      canvasWidth,
      borderThickness // Draw the mirrored section at the top
    );
    ctx.restore();
  
    // Mirror bottom border
    ctx.save();
    ctx.translate(0, canvasHeight); // Move to the bottom border area
    ctx.scale(1, -1); // Flip vertically
    ctx.drawImage(
      image,
      0, // Crop from the bottom of the image
      imageDimensions.height - borderThickness,
      imageDimensions.width,
      borderThickness, // Height of the mirrored section equals border thickness
      0,
      -borderThickness, // Adjust for the canvas bottom
      canvasWidth,
      borderThickness
    );
    ctx.restore();
  
    // Mirror left border
    ctx.save();
    ctx.translate(borderThickness, 0); // Move to the left border area
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(
      image,
      0, // Crop from the left side of the image
      0,
      borderThickness,
      imageDimensions.height, // Full height of the image
      -borderThickness, // Adjust for the canvas left edge
      0,
      borderThickness,
      canvasHeight
    );
    ctx.restore();
  
    // Mirror right border
    ctx.save();
    ctx.translate(canvasWidth, 0); // Move to the right border area
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(
      image,
      imageDimensions.width - borderThickness, // Crop from the right side of the image
      0,
      borderThickness,
      imageDimensions.height, // Full height of the image
      -borderThickness, // Adjust for the canvas right edge
      0,
      borderThickness,
      canvasHeight
    );
    ctx.restore();
  
    // Return the mirrored image as a new HTMLImageElement
    const mirroredImage = new Image();
    mirroredImage.src = canvas.toDataURL();
    return mirroredImage;
  };
  

  return (
    <div className="flex flex-col items-center justify-center">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid black", overflow: "visible" }} // Allow overflow visibility
      >
        <Layer>
          {/* Frame (if enabled) */}

          {/* Canvas Border */}
          <Rect
            x={adjustedBorderSize}
            y={adjustedBorderSize}
            width={canvasWidth - 2 * adjustedBorderSize}
            height={canvasHeight - 2 * adjustedBorderSize}
            fill={borderColor}
          />

          {/* Image */}
          {showImage && image && (
            <>
              <KonvaImage
                ref={imageRef}
                image={image}
                x={imagePosition.x}
                y={imagePosition.y}
                draggable // Enable dragging
                width={imageDimensions.width}
                height={imageDimensions.height}
                dragBoundFunc={(pos) => {
                  const { width, height } = imageDimensions;

                  // Clamp x and y to ensure the image stays within bounds
                  const x = Math.max(canvasWidth - width, Math.min(0, pos.x));
                  const y = Math.max(canvasHeight - height, Math.min(0, pos.y));

                  return { x, y };
                }}
                onDragEnd={(e) => {
                  const node = e.target;
                  const { width, height } = imageDimensions;

                  // Calculate clamped x and y positions
                  const x = Math.max(
                    canvasWidth - width,
                    Math.min(0, node.x())
                  );
                  const y = Math.max(
                    canvasHeight - height,
                    Math.min(0, node.y())
                  );

                  setImagePosition({ x, y });
                  node.position({ x, y }); // Correct the position to stay within bounds
                }}
                onTransformEnd={(e) => {
                  const node = imageRef.current;
                  let newWidth = node.width() * node.scaleX();
                  let newHeight = node.height() * node.scaleY();

                  // Restrict size to be no smaller than the canvas dimensions
                  if (newWidth < canvasWidth) newWidth = canvasWidth;
                  if (newHeight < canvasHeight) newHeight = canvasHeight;

                  // Restrict position if the resized image goes out of bounds
                  let x = Math.max(
                    canvasWidth - newWidth,
                    Math.min(0, imagePosition.x)
                  );
                  let y = Math.max(
                    canvasHeight - newHeight,
                    Math.min(0, imagePosition.y)
                  );

                  setImagePosition({ x, y });
                  setImageDimensions({ width: newWidth, height: newHeight });

                  // Reset node scaling and apply restricted dimensions
                  node.scaleX(1);
                  node.scaleY(1);
                  node.width(newWidth);
                  node.height(newHeight);
                  node.position({ x, y });
                }}
              />
              <Transformer
                ref={transformerRef}
                anchorSize={8}
                borderDash={[4, 4]}
                boundBoxFunc={(oldBox, newBox) => {
                  // Prevent scaling below the canvas dimensions
                  if (
                    newBox.width < canvasWidth ||
                    newBox.height < canvasHeight
                  ) {
                    return oldBox; // Reject the transformation and revert to the old box
                  }
                  return newBox; // Accept the transformation
                }}
              />
            </>
          )}
         
    
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasPrint;
