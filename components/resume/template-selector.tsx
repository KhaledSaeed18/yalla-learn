"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useResumeContext } from "@/lib/resume/resume-context"

interface TemplateSelectorProps {
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
}

export default function TemplateSelector({ activeTemplate, setActiveTemplate }: TemplateSelectorProps) {
  const isMobile = useMediaQuery("(max-width: 639px)")

  return (
    <div className="space-y-4">
      <Label>Resume Template</Label>
      <RadioGroup
        value={activeTemplate}
        onValueChange={setActiveTemplate}
        className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"} gap-4 `}
      >
        <div>
          <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
          <Label
            htmlFor="professional"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
              <div className="w-3/4 h-5/6 flex flex-col">
                <div className="h-1/4 bg-gray-300 mb-2"></div>
                <div className="flex-1 flex">
                  <div className="w-1/3 bg-gray-200 mr-2"></div>
                  <div className="flex-1 bg-gray-200"></div>
                </div>
              </div>
            </div>
            <span className="block w-full text-center text-sm">Professional</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
          <Label
            htmlFor="modern"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
              <div className="w-3/4 h-5/6 flex flex-col">
                <div className="h-1/4 bg-blue-200 mb-2"></div>
                <div className="flex-1 flex">
                  <div className="w-1/3 bg-gray-200 mr-2"></div>
                  <div className="flex-1 bg-gray-200"></div>
                </div>
              </div>
            </div>
            <span className="block w-full text-center text-sm">Modern</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="minimal" id="minimal" className="peer sr-only" />
          <Label
            htmlFor="minimal"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
              <div className="w-3/4 h-5/6 flex flex-col">
                <div className="h-1/6 bg-gray-300 mb-2"></div>
                <div className="flex-1 flex flex-col space-y-2">
                  <div className="h-2 bg-gray-200"></div>
                  <div className="h-2 bg-gray-200"></div>
                  <div className="h-2 bg-gray-200"></div>
                </div>
              </div>
            </div>
            <span className="block w-full text-center text-sm">Minimal</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="creative" id="creative" className="peer sr-only" />
          <Label
            htmlFor="creative"
            className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
              <div className="w-3/4 h-5/6 flex">
                <div className="w-1/3 bg-purple-200"></div>
                <div className="flex-1 flex flex-col p-1">
                  <div className="h-1/4 bg-gray-300 mb-1"></div>
                  <div className="flex-1 bg-gray-200"></div>
                </div>
              </div>
            </div>
            <span className="block w-full text-center text-sm">Creative</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

