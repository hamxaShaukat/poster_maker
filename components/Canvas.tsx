"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ImageIcon,
  AlignHorizontalJustifyCenterIcon,
  AlignVerticalJustifyCenterIcon,
  MoveIcon,
  RotateCcwIcon,
  RotateCwIcon,
  MonitorIcon,
  StretchHorizontalIcon,
  StretchVerticalIcon,
} from "lucide-react";
import Image from "next/image";
import useImg from "@/lib/ImageStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import CanvasPrint from "./CanvasArea"; // Import CanvasPrint component

const sizeOptions = [
  { label: "8x8", width: 800, height: 800 },
  { label: "8x12", width: 800, height: 1200 },
  { label: "12x12", width: 1200, height: 1200 },
  { label: "16x20", width: 1600, height: 2000 },
  { label: "20x30", width: 2000, height: 3000 },
];
const bleedOptions = ["0mm", "0.5mm", "1mm", "None"];

export default function Canvas() {
  const { img } = useImg();
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [selectedBleed, setSelectedBleed] = useState(bleedOptions[0]);
  const [borderColor, setBorderColor] = useState("white");
  const [borderSize, setBorderSize] = useState(10);
  const [isFramed, setIsFramed] = useState(false);

  const buttons = [
    { icon: AlignHorizontalJustifyCenterIcon, tooltip: "Center at X axis" },
    { icon: AlignVerticalJustifyCenterIcon, tooltip: "Center at Y axis" },
    { icon: MoveIcon, tooltip: "Center at X,Y axis" },
    { icon: RotateCcwIcon, tooltip: "Rotate left" },
    { icon: RotateCwIcon, tooltip: "Rotate right" },
    { icon: MonitorIcon, tooltip: "Fixed to canvas" },
    { icon: StretchHorizontalIcon, tooltip: "Fixed to width" },
    { icon: StretchVerticalIcon, tooltip: "Fixed to height" },
  ];

  let num = parseFloat(bleedOptions[2].replace("mm", ""));
  console.log(num)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200">
      {/* Left Panel - 25% width */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/4 p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl overflow-y-auto"
      >
        {/* Image Preview */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-6 p-1 rounded-lg shadow-lg"
        >
          <Image height={60} width={60} src={img} alt="Preview" />
        </motion.div>

        {/* Size Accordion */}
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="size" className="border-b border-gray-600">
            <AccordionTrigger className="text-lg font-semibold hover:text-gray-300 transition-colors">
              Size
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={selectedSize.label}
                onValueChange={(label) =>
                  setSelectedSize(sizeOptions.find((size) => size.label === label)!)
                }
                className="space-y-2"
              >
                {sizeOptions.map((size) => (
                  <div
                    key={size.label}
                    className="flex items-center space-x-2 hover:bg-gray-700 hover:bg-opacity-50 p-2 rounded-md transition-colors"
                  >
                    <RadioGroupItem
                      value={size.label}
                      id={size.label}
                      className="border-gray-400 text-gray-400"
                    />
                    <Label htmlFor={size.label} className="cursor-pointer">
                      {size.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bleed Options */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <ImageIcon className="mr-2 h-5 w-5 text-gray-400" />
            Bleed
          </h3>
          <RadioGroup
            value={selectedBleed}
            onValueChange={setSelectedBleed}
            className="space-y-2"
          >
            {bleedOptions.map((bleed) => (
              <div
                key={bleed}
                className="flex items-center space-x-2 hover:bg-gray-700 hover:bg-opacity-50 p-2 rounded-md transition-colors"
              >
                <RadioGroupItem
                  value={bleed}
                  id={bleed}
                  className="border-gray-400 text-gray-400"
                />
                <Label htmlFor={bleed} className="cursor-pointer">
                  {bleed}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Frame Options */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Frame</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isFramed}
              onChange={(e) => setIsFramed(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Enable Frame</span>
          </label>
        </div>
      </motion.div>

      {/* Right Panel - 75% width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-3/4 p-6 bg-gradient-to-br from-gray-900 to-black flex flex-col"
      >
        {/* Buttons */}
        <div className="flex justify-center space-x-2 mb-4">
          <TooltipProvider>
            {buttons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-gray-800 hover:bg-gray-700">
                    <button.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Canvas Area */}
        <div className="flex-grow flex items-center justify-center">
          <CanvasPrint
            imageBase64={img}
            canvasWidth={selectedSize.width}
            canvasHeight={selectedSize.height}
            borderColor={borderColor}
            borderSize={selectedBleed === "None" ? 0 : parseFloat(selectedBleed.replace("mm", ""))}
            isFramed={isFramed}
          />
        </div>
      </motion.div>
    </div>
  );
}
