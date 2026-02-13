"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageAnalysis from "@/app/components/tabs/ImageAnalysis";
import IngredientRecognition from "@/app/components/tabs/ImageCreator";
import ImageCreator from "@/app/components/tabs/IngredientTab";
import ChatWidget from "./components/tabs/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">AI tools</h1>
      </header>

      <main className="flex justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="image-analysis" className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="image-analysis">Image analysis</TabsTrigger>
              <TabsTrigger value="ingredient-recognition">
                Ingredient recognition
              </TabsTrigger>
              <TabsTrigger value="image-creator">Image creator</TabsTrigger>
            </TabsList>

            <TabsContent value="image-analysis">
              <ImageAnalysis />
            </TabsContent>

            <TabsContent value="ingredient-recognition">
              <IngredientRecognition />
            </TabsContent>
            <TabsContent value="image-creator">
              <ImageCreator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <ChatWidget/>
    </div>
  );
}
