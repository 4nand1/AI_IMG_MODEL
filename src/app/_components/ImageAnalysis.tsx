
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Image, RotateCw, Sparkles } from "lucide-react"

export const ImageAnalysis = () => {
    return (
        <div className="flex items-center flex-col mt-10 gap-4 w=143">
            <div className="flex justify-between w-full max-w-full items-center">
                <p className="flex items-center gap-2 text-xl font-semibold">
               <Sparkles/> Image analysis
                </p>
                <Button variant={"outline"}>
                    <RotateCw className="text-gray-400"/>
                </Button>
            </div>
            <p className="text-[14px] text-[#71717A] w-full">
                Upload a food photo, and AI will detect the ingredients.
            </p>
            <div className="flex flex-col justify-end items-end w-full gap-2">
                <Input placeholder="Choose File JPG, PNG"
                 className="h-31 flex justify-start items-start p-4 w-full max-w-2xl">
                 </Input>
                 <Button className="bg-primary w-23.5" variant={"default"}>
                    Generate
                 </Button>
            </div>
            <div className="w-full flex flex-col gap-2 max-w-2xl mt-8 p-4">
                <p className="text-xl font-semibold flex gap-2 items-center">
                    <Image /> Result
                </p>
                <p className="text-[14px] text-[#71717A]">
                    First enter your text to generate image.
                </p>
            </div>
        </div>
    )
}

