"use client";

import { useState } from "react";
import { ImageCreator } from "./_components/ImageCreator";
import { ImageAnalysis } from "./_components/ImageAnalysis";
import { IngredientsRecognition } from "./_components/IngredientRecognition";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [activeTab, setActiveTab] = useState<
    "creator" | "analysis" | "ingredients"
  >("creator");

  return (
    <div className="  min-h-screen w-full px-6 py-8">
      {/* TOP BUTTONS */}
      <div className="flex gap-3 mb-8">
        <Button
          variant={activeTab === "creator" ? "default" : "outline"}
          onClick={() => setActiveTab("creator")}
        >
          Image creator
        </Button>

        <Button
          variant={activeTab === "analysis" ? "default" : "outline"}
          onClick={() => setActiveTab("analysis")}
        >
          Image analysis
        </Button>

        <Button
          variant={activeTab === "ingredients" ? "default" : "outline"}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients recognition
        </Button>
      </div>

      {/* CONTENT */}
      <div className="w-full">
        {activeTab === "creator" && <ImageCreator />}
        {activeTab === "analysis" && <ImageAnalysis />}
        {activeTab === "ingredients" && <IngredientsRecognition />}
      </div>
    </div>
  );
}
