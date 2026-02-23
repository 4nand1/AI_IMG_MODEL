"use client";

import Image from "next/image";
import { ImageAnalysis } from "./_components/tabs/ImageAnalysis";
import { IngredientRecognition } from "./_components/tabs/IngredientRecognition";
import { ImageCreator } from "./_components/tabs/ImageCreator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChatWidget from "./_components/tabs/ChatWidget";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "analysis" | "ingredient" | "creator"
  >("analysis");

  return (
    <div className="flex flex-col justify-between h-screen pb-30 items-end">
      <div className="flex flex-col justify-center items-center w-screen">
        <div className="p-6 w-full max-w-xl">
          <div className="h-9 bg-secondary rounded flex gap-1">
            <Button
              variant={activeTab === "analysis" ? "default" : "secondary"}
              className="flex-1"
              onClick={() => setActiveTab("analysis")}
            >
              Image analysis
            </Button>

            <Button
              variant={activeTab === "ingredient" ? "default" : "secondary"}
              className="flex-1"
              onClick={() => setActiveTab("ingredient")}
            >
              Ingredient recognition
            </Button>

            <Button
              variant={activeTab === "creator" ? "default" : "secondary"}
              className="flex-1"
              onClick={() => setActiveTab("creator")}
            >
              Image creator
            </Button>
          </div>

          <div className="mt-6">
            {activeTab === "analysis" && <ImageAnalysis />}
            {activeTab === "ingredient" && <IngredientRecognition />}
            {activeTab === "creator" && <ImageCreator />}
          </div>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
