"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Loader2, RotateCw, Sparkles } from "lucide-react";
import { pipeline } from "@huggingface/transformers";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function IngredientRecognition() {
  const [food, setFood] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const modelRef = useRef<any>(null);

  const handleReset = () => {
    setFood("");
    setIngredients([]);
  };

  const handleGenerate = async () => {
    if (!food.trim()) return;

    setLoading(true);
    setIngredients([]);

    try {
      if (!modelRef.current) {
        console.log("Loading model...");
        modelRef.current = await pipeline(
          "text-generation",
          "HuggingFaceTB/SmolLM2-135M-Instruct",
        );
        console.log("Model loaded");
      }

      const prompt = `List ingredients of this food.

Food: ${food}

Ingredients:
-`;

      const output = await modelRef.current(prompt, {
        max_new_tokens: 120,
        temperature: 0.2,
      });

      console.log("RAW OUTPUT:", output);

      const text = output?.[0]?.generated_text || "";

      const cleaned = text.replace(prompt, "").trim();

      const items = cleaned
        .split("\n")
        .map((x: string) => x.replace(/[-*]/g, "").trim())
        .filter(Boolean);

      setIngredients(items);
    } catch (err) {
      console.error(err);
      alert("Model error – console шалга");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  mt-10 gap-4 w-145">
      <div className="flex justify-between w-full max-w-2xl items-center p-4">
        <p className="flex gap-2 text-xl font-semibold items-center">
          <Sparkles /> Ingredient recognition
        </p>
        <Button variant="outline" onClick={handleReset}>
          <RotateCw />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Describe the food, and AI will detect the ingredients.
      </p>
      <div className="flex flex-col justify-end items-end w-full gap-2">
        <Input
          placeholder="Орц тодохойлох"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />

        <Button
          onClick={handleGenerate}
          disabled={!food || loading}
          className="bg-zinc-800 hover:bg-zinc-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <div className="flex items-center gap-2 mb-2">
          <FileSpreadsheet />
          <h3 className="font-semibold">Ingredients</h3>
        </div>

        {ingredients.length > 0 ? (
          <ul className="list-disc pl-6 bg-muted p-4 rounded-lg">
            {ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            First, enter your text to recognize an ingredients.
          </p>
        )}
      </div>
    </div>
  );
}
