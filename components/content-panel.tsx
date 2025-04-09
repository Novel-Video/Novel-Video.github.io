"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { PreviewImage, FileContent } from "@/types/file-system"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash, X } from "lucide-react"

interface ContentPanelProps {
  content: FileContent | any
  isEditMode: boolean
  onContentChange: (content: Record<string, string | Record<string, string>>) => void
}

export default function ContentPanel({ content, isEditMode, onContentChange }: ContentPanelProps) {
  // Convert flat content structure to tabbed structure if needed
  const initializeContent = () => {
    if (typeof content === "string") {
      return { Description: { content: content } }
    }

    // Check if content is already in tabbed format
    if (content && typeof content === "object") {
      const hasNestedObjects = Object.values(content).some((value) => typeof value === "object" && value !== null)

      if (hasNestedObjects) {
        // Already in tabbed format
        return content
      } else {
        // Convert flat structure to tabbed
        return {
          "Shot Details": {
            shotDescription: content.shotDescription || "",
          },
          Dialogue: {
            dialogues: content.dialogues || "",
          },
          Action: {
            actions: content.actions || "",
          },
          Camera: {
            cameraMovements: content.cameraMovements || "",
          },
          Positioning: {
            positioning: content.positioning || "",
          },
        }
      }
    }

    return {}
  }

  const [localContent, setLocalContent] = useState<Record<string, Record<string, string>>>(initializeContent)
  const [newTabName, setNewTabName] = useState("")
  const [activeTab, setActiveTab] = useState<string>("")
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureValue, setNewFeatureValue] = useState("")
  const [selectedImage, setSelectedImage] = useState<PreviewImage | null>(null)
  const [showGeneratedPage, setShowGeneratedPage] = useState(false)

  // Sample preview images
  const previewImages: PreviewImage[] = [
    { id: "1", url: "/3d3.png", alt: "Scene preview 1" },
    { id: "2", url: "/3d2.png", alt: "Scene preview 2" },
    { id: "3", url: "/3d1.png", alt: "Scene preview 3" },
    { id: "4", url: "/3d4.png", alt: "Scene preview 5" },
    { id: "5", url: "/3d5.png", alt: "Scene preview 6" },
    { id: "6", url: "/3d6.png", alt: "Scene preview 7" },
    { id: "7", url: "/3d7.png", alt: "Scene preview 8" },
    { id: "8", url: "/3d8.png", alt: "Scene preview 9" },
  ]

  useEffect(() => {
    const initialContent = initializeContent()
    setLocalContent(initialContent)

    // Set active tab to first tab if available
    const tabs = Object.keys(initialContent)
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0])
    }

    // Reset state when content changes
    setShowGeneratedPage(false)
    setSelectedImage(previewImages[0] || null)
  }, [content])

  const addTab = () => {
    if (newTabName.trim() === "") return

    if (!localContent[newTabName]) {
      const updatedContent = { ...localContent, [newTabName]: {} }
      setLocalContent(updatedContent)
      onContentChange(updatedContent)
      setActiveTab(newTabName)
      setNewTabName("")
    }
  }

  const removeTab = (tabName: string) => {
    const updatedContent = { ...localContent }
    delete updatedContent[tabName]
    setLocalContent(updatedContent)
    onContentChange(updatedContent)

    // Set active tab to first available tab
    const remainingTabs = Object.keys(updatedContent)
    if (remainingTabs.length > 0) {
      setActiveTab(remainingTabs[0])
    } else {
      setActiveTab("")
    }
  }

  const addFeature = (tabName: string) => {
    if (newFeatureName.trim() === "" || !activeTab) return

    const tabContent = localContent[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = {
        ...tabContent,
        [newFeatureName]: newFeatureValue,
      }

      const updatedContent = {
        ...localContent,
        [tabName]: updatedTabContent,
      }

      setLocalContent(updatedContent)
      onContentChange(updatedContent)
      setNewFeatureName("")
      setNewFeatureValue("")
    }
  }

  const removeFeature = (tabName: string, featureName: string) => {
    const tabContent = localContent[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = { ...tabContent }
      delete updatedTabContent[featureName]

      const updatedContent = {
        ...localContent,
        [tabName]: updatedTabContent,
      }

      setLocalContent(updatedContent)
      onContentChange(updatedContent)
    }
  }

  const updateFeature = (tabName: string, featureName: string, value: string) => {
    const tabContent = localContent[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = {
        ...tabContent,
        [featureName]: value,
      }

      const updatedContent = {
        ...localContent,
        [tabName]: updatedTabContent,
      }

      setLocalContent(updatedContent)
      onContentChange(updatedContent)
    }
  }

  const handleGenerate = () => {
    setShowGeneratedPage(true)
  }

  const handleBackToPreview = () => {
    setShowGeneratedPage(false)
  }

  // Get all content as a flat object for preview display
  const getFlatContent = () => {
    const result: Record<string, string> = {}

    Object.entries(localContent).forEach(([tabName, tabContent]) => {
      Object.entries(tabContent).forEach(([featureName, value]) => {
        result[`${tabName} - ${featureName}`] = value
      })
    })

    return result
  }

  if (showGeneratedPage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <img
            src={selectedImage?.url || "/placeholder.svg?height=600&width=800"}
            alt={selectedImage?.alt || "Generated scene"}
            className="max-h-[70vh] rounded-lg shadow-lg mb-6"
          />
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleBackToPreview}>
              Back
            </Button>
            <Button>Download</Button>
            <Button>Share</Button>
            <Button variant="secondary">Edit</Button>
            <Button variant="destructive">Regenerate</Button>
          </div>
        </div>
      </div>
    )
  }

  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <Label htmlFor="new-tab">Add New Tab</Label>
            <Input
              id="new-tab"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Enter tab name..."
            />
          </div>
          <Button onClick={addTab} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Tab
          </Button>
        </div>

        {Object.keys(localContent).length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center mb-4">
              <TabsList className="flex-1">
                {Object.keys(localContent).map((tabName) => (
                  <TabsTrigger key={tabName} value={tabName} className="flex items-center gap-1">
                    <span className="capitalize">{tabName}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {activeTab && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTab(activeTab)}
                  className="ml-2 text-destructive"
                >
                  <Trash className="h-4 w-4 mr-1" /> Remove Tab
                </Button>
              )}
            </div>

            {Object.keys(localContent).map((tabName) => {
              const tabContent = localContent[tabName]

              return (
                <TabsContent key={tabName} value={tabName} className="space-y-4">
                  <div className="flex items-end gap-2 mb-4 border-t pt-4">
                    <div className="flex-1">
                      <Label htmlFor="new-feature">Feature Name</Label>
                      <Input
                        id="new-feature"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        placeholder="Enter feature name..."
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="new-feature-value">Feature Value</Label>
                      <Input
                        id="new-feature-value"
                        value={newFeatureValue}
                        onChange={(e) => setNewFeatureValue(e.target.value)}
                        placeholder="Enter feature value..."
                      />
                    </div>
                    <Button onClick={() => addFeature(tabName)} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Feature
                    </Button>
                  </div>

                  {Object.keys(tabContent).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(tabContent).map(([featureName, featureValue]) => (
                        <div key={featureName} className="flex gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`${tabName}-${featureName}`} className="capitalize">
                                {featureName}
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFeature(tabName, featureName)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              id={`${tabName}-${featureName}`}
                              value={featureValue as string}
                              onChange={(e) => updateFeature(tabName, featureName, e.target.value)}
                              placeholder={`Enter ${featureName} details...`}
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No features added to this tab yet. Add a new feature to get started.
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No tabs created yet. Add a new tab to get started.
          </div>
        )}
      </div>
    )
  }

  // Preview mode
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex gap-6">
        <div className="flex-1">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <img
              src={selectedImage?.url || previewImages[0]?.url || "/placeholder.svg?height=400&width=600"}
              alt={selectedImage?.alt || "Scene preview"}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <Tabs defaultValue={Object.keys(localContent)[0]} className="w-full">
            <TabsList className="w-full justify-start">
              {Object.keys(localContent).map((tabName) => (
                <TabsTrigger key={tabName} value={tabName} className="capitalize">
                  {tabName}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(localContent).map((tabName) => {
              const tabContent = localContent[tabName]

              return (
                <TabsContent key={tabName} value={tabName}>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {Object.entries(tabContent).map(([featureName, featureValue]) =>
                      featureValue ? (
                        <Card key={featureName}>
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-1 capitalize">{featureName}</h3>
                            <p className="text-sm whitespace-pre-line">{featureValue as string}</p>
                          </CardContent>
                        </Card>
                      ) : null,
                    )}
                  </div>

                  {Object.keys(tabContent).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No features available in this tab.</div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>

          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={handleGenerate}>
              Generate
            </Button>
          </div>
        </div>

        <div className="w-48 space-y-3">
          <h3 className="font-medium">Preview Options</h3>
          <div className="grid grid-cols-1 gap-3">
            {previewImages.map((image) => (
              <div
                key={image.id}
                className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                  selectedImage?.id === image.id ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

