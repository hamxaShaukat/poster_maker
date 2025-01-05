"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { AlignHorizontalJustifyCenterIcon, AlignVerticalJustifyCenterIcon, MoveIcon, RotateCcwIcon, RotateCwIcon, MonitorIcon, StretchHorizontalIcon, StretchVerticalIcon, DownloadIcon } from 'lucide-react';
import Image from "next/image";
import useImg from "@/lib/ImageStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import CanvasPrint from "./CanvasArea";

const sizeOptions = [
  { label: "8x8", width: 800, height: 800 },
  { label: "8x12", width: 800, height: 1200 },
  { label: "12x12", width: 1200, height: 1200 },
  { label: "16x20", width: 1600, height: 2000 },
  { label: "20x30", width: 2000, height: 3000 },
];
const bleedOptions = ["0mm", "0.5mm", "1mm", "None"];
const styleOptions = ["normal", "solid", "mirror"];

const buttons = [
  { icon: AlignHorizontalJustifyCenterIcon, tooltip: "Center at X axis", action: "centerX" },
  { icon: AlignVerticalJustifyCenterIcon, tooltip: "Center at Y axis", action: "centerY" },
  { icon: MoveIcon, tooltip: "Center at X,Y axis", action: "centerXY" },
  { icon: RotateCcwIcon, tooltip: "Rotate left", action: "rotateLeft" },
  { icon: RotateCwIcon, tooltip: "Rotate right", action: "rotateRight" },
  { icon: MonitorIcon, tooltip: "Fixed to canvas", action: "fixedToCanvas" },
  { icon: StretchHorizontalIcon, tooltip: "Fixed to width", action: "fixedToWidth" },
  { icon: StretchVerticalIcon, tooltip: "Fixed to height", action: "fixedToHeight" },
  {icon:DownloadIcon,tooltip:"Download",action:"download"}
];

export default function Canvas() {
  const { img } = useImg();
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [selectedBleed, setSelectedBleed] = useState(bleedOptions[0]);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [borderColor, setBorderColor] = useState("white");
  const [borderSize, setBorderSize] = useState(10);
  const [isFramed, setIsFramed] = useState(false);
  const [canvasAction, setCanvasAction] = useState("");
  const [curr,setCurr] = useState(0);

  const handleAction = (action: string) => {
    setCanvasAction(action);
    setCurr(Date.now())
  };

  const handleDownload = () => {
    // Implement download functionality here
    console.log("Download initiated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8 bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-md shadow-lg">
          {/* Image Preview */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-1 rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-purple-500"
          >
            <Image height={80} width={80} src={img} alt="Preview" className="rounded-lg" />
          </motion.div>

          {/* Size Selector */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="size-select" className="text-sm font-medium text-purple-200">
              Size
            </Label>
            <Select
              value={selectedSize.label}
              onValueChange={(label) =>
                setSelectedSize(sizeOptions.find((size) => size.label === label)!)
              }
            >
              <SelectTrigger id="size-select" className="w-[120px] bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 text-white">
                {sizeOptions.map((size) => (
                  <SelectItem key={size.label} value={size.label}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bleed Selector */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="bleed-select" className="text-sm font-medium text-purple-200">
              Bleed
            </Label>
            <Select
              value={selectedBleed}
              onValueChange={setSelectedBleed}
            >
              <SelectTrigger id="bleed-select" className="w-[120px] bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select bleed" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 text-white">
                {bleedOptions.map((bleed) => (
                  <SelectItem key={bleed} value={bleed}>
                    {bleed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style Selector */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="style-select" className="text-sm font-medium text-purple-200">
              Style
            </Label>
            <Select
              value={selectedStyle}
              onValueChange={setSelectedStyle}
            >
              <SelectTrigger id="style-select" className="w-[120px] bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 text-white">
                {styleOptions.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frame Toggle */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="frame-toggle" className="text-sm font-medium text-purple-200">
              Frame
            </Label>
            <Switch
              id="frame-toggle"
              checked={isFramed}
              onCheckedChange={setIsFramed}
              className="data-[state=checked]:bg-pink-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-3 mb-8">
          <TooltipProvider>
            {buttons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-white bg-opacity-10 hover:bg-opacity-20 border-none text-white"
                    onClick={() => handleAction(button.action)}
                  >
                    <button.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-indigo-900 text-white border-none">
                  <p>{button.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          
          </TooltipProvider>
        </div>

        {/* Canvas Area */}
        <div className="flex items-center justify-center bg-white bg-opacity-5 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
          <CanvasPrint
            imageBase64={img}
            canvasWidth={selectedSize.width}
            canvasHeight={selectedSize.height}
            borderColor={borderColor}
            borderSize={selectedBleed === "None" ? 0 : parseFloat(selectedBleed.replace("mm", ""))}
            isFramed={isFramed}
            style={selectedStyle}
            action={canvasAction +'-'+curr}
          />
        </div>
      </motion.div>
    </div>
  );
}

