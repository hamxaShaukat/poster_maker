"use client";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-1/3">
        <ImageUpload
          value={image}
          onChange={(img) => setImage(img)}
          label="Input Image"
        />
        <div className="w-full flex justify-center my-6">
          <Button className="w-full">Next</Button>
        </div>
      </div>
    </div>
  );
}
