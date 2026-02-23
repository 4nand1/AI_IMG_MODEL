"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, RotateCw, Sparkles } from "lucide-react";
import React, { useState } from "react";

export const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to generate image");
      }

      const blob = await res.blob();
      setGeneratedImage(URL.createObjectURL(blob));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error generating image:", error);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="flex items-center flex-col mt-10 gap-4 w-full">
      <div className="flex justify-between w-full max-w-2xl items-center p-4 mt-8 rounded-lg">
        <p className="flex gap-2 text-xl font-semibold items-center">
          <Sparkles /> Food image creator
        </p>

        <Button variant="outline" onClick={handleReset}>
          <RotateCw className="text-gray-400" />
        </Button>
      </div>

      <p className="text-[14px] text-[#71717A] w-full max-w-2xl">
        What food image do you want? Describe it briefly.
      </p>

      <div className="flex flex-col justify-end items-end w-full gap-2">
        <Input
          placeholder="Хоолны тайлбар..."
          className="h-14 p-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          className="bg-zinc-800 hover:bg-zinc-700"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      <div className="w-full flex flex-col gap-2 max-w-2xl mt-8 p-4">
        <p className="text-xl font-semibold flex gap-2 items-center">
          <Image /> Result
        </p>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            Error: {error}
          </p>
        )}

        {!generatedImage ? (
          <p className="text-[14px] text-[#71717A]">
            First, enter your text to generate an image.
          </p>
        ) : (
          <img
            src={generatedImage}
            alt="Generated"
            className="rounded-lg w-full object-cover"
          />
        )}
      </div>
    </div>
  );
};
