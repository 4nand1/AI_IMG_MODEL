"use client";

import { useState, useRef } from "react";
import { Sparkles, FileText, RotateCw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pipeline } from "@huggingface/transformers";

export default function ImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const captionerRef = useRef<any>(null);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    setResult(null);
    const dataUrl = await fileToDataUrl(f);
    setImagePreview(dataUrl);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    try {
      if (!captionerRef.current) {
        setIsModelLoading(true);
        captionerRef.current = await pipeline(
          "image-to-text",
          "Xenova/vit-gpt2-image-captioning"
        );
        setIsModelLoading(false);
      }

      const output = await captionerRef.current(imagePreview);
      const caption = output?.[0]?.generated_text;
      setResult(caption);
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Image analysis</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            Choose File
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg object-contain"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={!selectedFile || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isModelLoading ? "Loading model..." : "Analyzing..."}
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {result && (
        <div className="bg-muted p-4 rounded-lg text-sm">
          <FileText className="inline h-4 w-4 mr-2" />
          {result}
        </div>
      )}
    </div>
  );
}
