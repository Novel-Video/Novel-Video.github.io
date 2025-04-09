"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConfigPanelProps {
  config: Record<string, string | Record<string, string>>
  isEditMode: boolean
  onConfigChange: (config: Record<string, string | Record<string, string>>) => void
}

export default function ConfigPanel({ config, isEditMode, onConfigChange }: ConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, string | Record<string, string>>>(config)
  const [newTabName, setNewTabName] = useState("")
  const [activeTab, setActiveTab] = useState<string>("")
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureValue, setNewFeatureValue] = useState("")

  useEffect(() => {
    setLocalConfig(config)
    // Set active tab to first tab if available
    const tabs = Object.keys(config)
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0])
    }
  }, [config])

  const addTab = () => {
    if (newTabName.trim() === "") return

    if (!localConfig[newTabName]) {
      const updatedConfig = { ...localConfig, [newTabName]: {} }
      setLocalConfig(updatedConfig)
      onConfigChange(updatedConfig)
      setActiveTab(newTabName)
      setNewTabName("")
    }
  }

  const removeTab = (tabName: string) => {
    const updatedConfig = { ...localConfig }
    delete updatedConfig[tabName]
    setLocalConfig(updatedConfig)
    onConfigChange(updatedConfig)

    // Set active tab to first available tab
    const remainingTabs = Object.keys(updatedConfig)
    if (remainingTabs.length > 0) {
      setActiveTab(remainingTabs[0])
    } else {
      setActiveTab("")
    }
  }

  const addFeature = (tabName: string) => {
    if (newFeatureName.trim() === "" || !activeTab) return

    const tabContent = localConfig[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = {
        ...tabContent,
        [newFeatureName]: newFeatureValue,
      }

      const updatedConfig = {
        ...localConfig,
        [tabName]: updatedTabContent,
      }

      setLocalConfig(updatedConfig)
      onConfigChange(updatedConfig)
      setNewFeatureName("")
      setNewFeatureValue("")
    }
  }

  const removeFeature = (tabName: string, featureName: string) => {
    const tabContent = localConfig[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = { ...tabContent }
      delete updatedTabContent[featureName]

      const updatedConfig = {
        ...localConfig,
        [tabName]: updatedTabContent,
      }

      setLocalConfig(updatedConfig)
      onConfigChange(updatedConfig)
    }
  }

  const updateFeature = (tabName: string, featureName: string, value: string) => {
    const tabContent = localConfig[tabName]
    if (typeof tabContent === "object") {
      const updatedTabContent = {
        ...tabContent,
        [featureName]: value,
      }

      const updatedConfig = {
        ...localConfig,
        [tabName]: updatedTabContent,
      }

      setLocalConfig(updatedConfig)
      onConfigChange(updatedConfig)
    }
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

        {Object.keys(localConfig).length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center mb-4">
              <TabsList className="flex-1">
                {Object.keys(localConfig).map((tabName) => (
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

            {Object.keys(localConfig).map((tabName) => {
              const tabContent = localConfig[tabName]

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

                  {typeof tabContent === "object" && Object.keys(tabContent).length > 0 ? (
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
                              className="min-h-[80px]"
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

  // Preview mode - show a representative image and config details
  return (
    <div className="space-y-6">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <img
          src="/video_image1.png"
          alt="Preview"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <Tabs defaultValue={Object.keys(localConfig)[0]} className="w-full">
        <TabsList className="w-full justify-start">
          {Object.keys(localConfig).map((tabName) => (
            <TabsTrigger key={tabName} value={tabName} className="capitalize">
              {tabName}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(localConfig).map((tabName) => {
          const tabContent = localConfig[tabName]

          return (
            <TabsContent key={tabName} value={tabName}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {typeof tabContent === "object" &&
                  Object.entries(tabContent).map(([featureName, featureValue]) =>
                    featureValue ? (
                      <Card key={featureName}>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1 capitalize">{featureName}</h3>
                          <p className="text-sm text-muted-foreground">{featureValue as string}</p>
                        </CardContent>
                      </Card>
                    ) : null,
                  )}
              </div>

              {(typeof tabContent !== "object" || Object.keys(tabContent).length === 0) && (
                <div className="text-center text-muted-foreground py-8">No features available in this tab.</div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {Object.keys(localConfig).length === 0 && (
        <div className="text-center text-muted-foreground py-8">No configuration details available.</div>
      )}
    </div>
  )
}

