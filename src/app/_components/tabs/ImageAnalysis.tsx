"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, RotateCw, Sparkles } from "lucide-react";

import { pipeline } from "@huggingface/transformers";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ImageCaptionOutput = Array<{ generated_text: string }>;
type ImageCaptionPipeline = (image: string) => Promise<ImageCaptionOutput>;

export function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const captionerRef = useRef<ImageCaptionPipeline | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setImagePreview(url);
      setResult(null);
    }
  };

  const handleReset = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setIsLoading(false);
    setIsModelLoading(false);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;

    setIsLoading(true);

    try {
      if (!captionerRef.current) {
        setIsModelLoading(true);
        captionerRef.current = (await pipeline(
          "image-to-text",
          "Xenova/vit-gpt2-image-captioning",
        )) as unknown as ImageCaptionPipeline;
      }
      const output = await captionerRef.current(imagePreview);

      if (output.length > 0) {
        const caption = output[0].generated_text;
        setResult(caption);
      }
    } catch (error) {
      console.error("Error generating caption:", error);
      setResult("Error analyzing image. Please try again.");
    } finally {
      setIsModelLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mt-10 gap-4 w-145">
      <div className="flex justify-between w-full max-w-2xl items-center p-4 mt-8  rounded-lg">
        <p className="flex gap-2 text-xl font-semibold items-center">
          <Sparkles /> Image analysis
        </p>
        <Button variant={"outline"} onClick={handleReset}>
          <RotateCw className="text-gray-400" />
        </Button>
      </div>
      <p className="text-[14px] text-[#71717A] w-full">
        Upload a food photo, and AI will detect the ingredients.
      </p>
      <div className="flex flex-col justify-end items-end w-full gap-2">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer text-sm font-medium"
                >
                  Choose File
                </Label>
                <span className="text-sm text-muted-foreground">
                  {selectedImage ? selectedImage.name : "JPG , PNG"}
                </span>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={1200}
                    height={800}
                    unoptimized
                    className="max-h-64 rounded-lg object-contain"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Button
          className="bg-zinc-800 hover:bg-zinc-700"
          onClick={handleGenerate}
          disabled={!selectedImage || isLoading}
        >
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
      <div className="w-full flex flex-col gap-2 max-w-2xl mt-8 p-4 ">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Here is the summary</h3>
          </div>
          {result ? (
            <p className="text-sm text-foreground bg-muted p-4 rounded-lg">
              {result}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              First, enter your image to recognize an ingredients.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
