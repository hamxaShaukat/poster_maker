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
import { ChevronDown, ImageIcon } from "lucide-react";
import Image from "next/image";

const sizeOptions = ["8x8", "8x12", "12x12", "16x20", "20x30"];
const bleedOptions = ["0mm", "0.5mm", "1mm", "None"];

export default function Canvas() {
  const [imageUrl, setImageUrl] = useState(
    "/image.png"
  );
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [selectedBleed, setSelectedBleed] = useState(bleedOptions[0]);
  console.log(selectedSize, selectedBleed)
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
          className="mb-6  p-1 rounded-lg shadow-lg"
        >
          <Image
            height={60}
            width={60}
            src={imageUrl}
            alt="Preview"
        
          />
        </motion.div>

        {/* Size Accordion */}
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="size" className="border-b border-gray-600">
            <AccordionTrigger className="text-lg font-semibold hover:text-gray-300 transition-colors">
              Size
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="space-y-2"
              >
                {sizeOptions.map((size) => (
                  <div
                    key={size}
                    className="flex items-center space-x-2 hover:bg-gray-700 hover:bg-opacity-50 p-2 rounded-md transition-colors"
                  >
                    <RadioGroupItem
                      value={size}
                      id={size}
                      className="border-gray-400 text-gray-400"
                    />
                    <Label htmlFor={size} className="cursor-pointer">
                      {size}
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
      </motion.div>

      {/* Right Panel - 75% width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-3/4 p-6 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="h-full flex items-center justify-center text-4xl font-bold text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
          Your Canvas
        </div>
      </motion.div>
    </div>
  );
}
