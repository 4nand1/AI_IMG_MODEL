"use client";

import { useState, useRef } from "react";
import { Sparkles, RotateCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pipeline } from "@huggingface/transformers";

export default function IngredientRecognition() {
  const [foodText, setFoodText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const ingredientRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (!foodText.trim()) return;

    setLoading(true);
    try {
      if (!ingredientRef.current) {
        setModelLoading(true);
        ingredientRef.current = await pipeline(
          "text2text-generation",
          "Xenova/flan-t5-base"
        );
        setModelLoading(false);
      }

      const prompt = `Extract ingredients as JSON array. Only output JSON. Text: "${foodText}"`;
      const out = await ingredientRef.current(prompt);
      setResult(out?.[0]?.generated_text ?? "[]");
    } catch (e) {
      console.error(e);
      setResult("Error extracting ingredients.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFoodText("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Ingredient recognition</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <textarea
        value={foodText}
        onChange={(e) => setFoodText(e.target.value)}
        className="w-full border rounded-lg p-4"
        placeholder="Орц тодорхойлох"
      />

      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {modelLoading ? "Loading model..." : "Analyzing..."}
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {result && (
        <div className="bg-muted p-4 rounded-lg text-sm">{result}</div>
      )}
    </div>
  );
}
