"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FileData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Save, Eye, Edit2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface ArticleEditorProps {
  file: FileData | null
  onContentChange: (content: string) => void
}

export function ArticleEditor({ file, onContentChange }: ArticleEditorProps) {
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState("edit")

  useEffect(() => {
    if (file) {
      setContent(file.content || "")
    }
  }, [file])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onContentChange(newContent)
  }

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No file selected</h3>
          <p className="text-muted-foreground mt-1">Select a file from the sidebar to edit</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg truncate">{file.name}</h2>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-1">
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" className="ml-2">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === "edit" ? (
          <Textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full resize-none p-4 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Start writing your article..."
          />
        ) : (
          <ScrollArea className="h-full p-6">
            <div className="max-w-3xl mx-auto prose prose-sm sm:prose lg:prose-lg">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

