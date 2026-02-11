"use client";

import { useState } from "react";
import { Sparkles, RotateCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

export default function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      if (!HF_TOKEN) {
        setError("Missing NEXT_PUBLIC_HF_TOKEN");
        return;
      }

      const res = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!res.ok) {
        setError("HF API error");
        return;
      }

      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      setError("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setImageUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Food image creator</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full border rounded-lg p-4"
        placeholder="Хоолны тайлбар"
      />

      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <img src={imageUrl} alt="Generated" className="rounded-lg" />
      )}
    </div>
  );
}
