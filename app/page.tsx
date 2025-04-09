"use client"

import { useState } from "react"
import FileExplorer from "@/components/file-explorer"
import ConfigPanel from "@/components/config-panel"
import ContentPanel from "@/components/content-panel"
import type { FileSystemItem, FolderType } from "@/types/file-system"
import { Button } from "@/components/ui/button"

// Sample initial data structure
const initialData: FileSystemItem[] = [
  {id: "2", name: "Episode 1", type: "folder", folderType: "episode"},
  {
    id: "1",
    name: "Grove of Titans",
    type: "folder",
    folderType: "episode",
    children: [
      {id: "1-2", name: "Scene 1", type: "folder", folderType: "scene"},
      {
        id: "1-1",
        name: "Fighting with two green giants",
        type: "folder",
        folderType: "scene",
        children: [
          {id: "1-1-20", name: "Cut 1", type: "folder", folderType: "cut"},
          {
            id: "1-1-1",
            name: "running away from two green giants",
            type: "folder",
            folderType: "cut",
            children: [
              {
                id: "1-1-1-1",
                name: "front shot",
                type: "file",
                content: {
                  "Shot Details": {
                    shotDescription: "Opening shot of the city skyline at dawn.",
                  },
                  Dialogue: {
                    dialogues: "None",
                  },
                  Action: {
                    actions: "Character A stands on a balcony looking thoughtful.",
                  },
                  Camera: {
                    cameraMovements: "Slow pan from left to right, establishing the scene.",
                  },
                  Positioning: {
                    positioning: "Character A positioned center-right, facing left toward the city view.",
                  },
                },
              },
              {
                id: "1-1-1-2",
                name: "Shot 2",
                type: "file",
                content: {
                  "Shot Details": {
                    shotDescription: "Interior of apartment, morning light streaming in.",
                  },
                  Dialogue: {
                    dialogues: 'Character A: "Another day begins."',
                  },
                  Action: {
                    actions: "Character A turns from the balcony, walks to the kitchen counter.",
                  },
                  Camera: {
                    cameraMovements: "Follow shot, keeping Character A in frame.",
                  },
                  Positioning: {
                    positioning: "Character A moves from right to center of frame.",
                  },
                },
              },
            ],
            config: {
              Character: {
                name: "Main protagonist",
                age: "30s",
                attire: "Casual clothing",
              },
              Setting: {
                location: "Modern apartment",
                time: "Morning",
                weather: "Clear skies",
              },
              Audio: {
                music: "Soft ambient",
                sfx: "City sounds, birds",
              },
            },
          },
          {id: "1-1-2", name: "Cut 2", type: "folder", folderType: "cut"},
        ],
        config: {
          Overview: {
            character: "Main protagonist",
            location: "City apartment",
          },
          Timing: {
            time: "Early morning",
            duration: "3 minutes",
          },
          Mood: {
            atmosphere: "Contemplative",
            lighting: "Warm morning light",
          },
        },
      },
      {id: "1-3", name: "Scene 3", type: "folder", folderType: "scene"},
    ],
    config: {
      "Basic Info": {
        title: "New Beginnings",
        theme: "Fresh start, opportunities",
      },
      Characters: {
        mainCharacters: "Character A, Character B",
        supporting: "Character C, Character D",
      },
      World: {
        setting: "Modern city, present day",
        era: "Contemporary",
      },
    },
  },
  {id: "3", name: "Episode 3", type: "folder", folderType: "episode"},
  {id: "4", name: "Episode 4", type: "folder", folderType: "episode"},
]

export default function Home() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(initialData)
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1", "1-1", "1-1-1"]))
  const [isEditMode, setIsEditMode] = useState(true)

  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item)
  }

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      const newExpandedFolders = new Set(expandedFolders)
      if (newExpandedFolders.has(item.id)) {
        newExpandedFolders.delete(item.id)
      } else {
        newExpandedFolders.add(item.id)
      }
      setExpandedFolders(newExpandedFolders)
    }
  }

  const handleConfigChange = (config: Record<string, string | Record<string, string>>) => {
    if (!selectedItem || selectedItem.type !== "folder") return

    const updateItemConfig = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map((item) => {
        if (item.id === selectedItem.id) {
          return { ...item, config }
        }
        if (item.children) {
          return { ...item, children: updateItemConfig(item.children) }
        }
        return item
      })
    }

    const updatedFileSystem = updateFileSystem(fileSystem)
    setFileSystem(updatedFileSystem)

    // Update the selected item with the new config
    setSelectedItem({ ...selectedItem, config })
  }

  const handleContentChange = (content: any) => {
    if (!selectedItem || selectedItem.type !== "file") return

    const updateItemContent = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map((item) => {
        if (item.id === selectedItem.id) {
          return { ...item, content }
        }
        if (item.children) {
          return { ...item, children: updateItemContent(item.children) }
        }
        return item
      })
    }

    const updatedFileSystem = updateFileSystem(fileSystem)
    setFileSystem(updatedFileSystem)

    // Update the selected item with the new content
    setSelectedItem({ ...selectedItem, content })
  }

  const updateFileSystem = (items: FileSystemItem[]): FileSystemItem[] => {
    return items.map((item) => {
      if (item.id === selectedItem?.id) {
        return selectedItem.type === "folder"
          ? { ...item, config: selectedItem.config }
          : { ...item, content: selectedItem.content }
      }
      if (item.children) {
        return { ...item, children: updateFileSystem(item.children) }
      }
      return item
    })
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const addNewItem = (type: "file" | "folder", folderType?: FolderType) => {
    // If no item is selected, add to root
    if (!selectedItem) {
      if (type === "folder" && folderType === "episode") {
        const newEpisode: FileSystemItem = {
          id: `episode-${Date.now()}`,
          name: "New Episode",
          type: "folder",
          folderType: "episode",
          children: [],
          config: {},
        }
        setFileSystem([...fileSystem, newEpisode])
      }
      return
    }

    // If a folder is selected, add as a child based on hierarchy rules
    if (selectedItem.type === "folder") {
      let canAdd = false
      let newItem: FileSystemItem | null = null

      // Apply hierarchy rules
      if (selectedItem.folderType === "episode" && type === "folder" && folderType === "scene") {
        canAdd = true
        newItem = {
          id: `scene-${Date.now()}`,
          name: "New Scene",
          type: "folder",
          folderType: "scene",
          children: [],
          config: {},
        }
      } else if (selectedItem.folderType === "scene" && type === "folder" && folderType === "cut") {
        canAdd = true
        newItem = {
          id: `cut-${Date.now()}`,
          name: "New Cut",
          type: "folder",
          folderType: "cut",
          children: [],
          config: {},
        }
      } else if (selectedItem.folderType === "cut" && type === "file") {
        canAdd = true
        newItem = {
          id: `shot-${Date.now()}`,
          name: "New Shot",
          type: "file",
          content: {
            "Shot Details": {
              shotDescription: "",
            },
            Dialogue: {
              dialogues: "",
            },
            Action: {
              actions: "",
            },
            Camera: {
              cameraMovements: "",
            },
            Positioning: {
              positioning: "",
            },
          },
        }
      }

      if (canAdd && newItem) {
        // Add the new item to the selected folder's children
        const addItemToChildren = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.map((item) => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                children: [...(item.children || []), newItem!],
              }
            }
            if (item.children) {
              return { ...item, children: addItemToChildren(item.children) }
            }
            return item
          })
        }

        const updatedFileSystem = addItemToChildren(fileSystem)
        setFileSystem(updatedFileSystem)

        // Ensure the parent folder is expanded
        if (!expandedFolders.has(selectedItem.id)) {
          setExpandedFolders(new Set([...expandedFolders, selectedItem.id]))
        }
      }
    }
  }

  return (
    <main className="flex flex-col h-screen bg-background">
      <div className="flex-1 flex">
        <div className="w-1/4 border-r border-border overflow-auto flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold">Novel Video</h1>
          </div>
          <div className="p-2 border-b border-border flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => addNewItem("folder", "episode")} className="flex-1">
              Add Episode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNewItem("folder", "scene")}
              className="flex-1"
              disabled={!selectedItem || selectedItem.type !== "folder" || selectedItem.folderType !== "episode"}
            >
              Add Scene
            </Button>
          </div>
          <div className="p-2 border-b border-border flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNewItem("folder", "cut")}
              className="flex-1"
              disabled={!selectedItem || selectedItem.type !== "folder" || selectedItem.folderType !== "scene"}
            >
              Add Cut
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNewItem("file")}
              className="flex-1"
              disabled={!selectedItem || selectedItem.type !== "folder" || selectedItem.folderType !== "cut"}
            >
              Add Shot
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <FileExplorer
              items={fileSystem}
              expandedFolders={expandedFolders}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
              onItemDoubleClick={handleItemDoubleClick}
            />
          </div>
        </div>
        <div className="w-3/4 overflow-auto">
          {selectedItem ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="text-xl font-semibold">
                  {selectedItem.name}
                  {selectedItem.type === "folder" && selectedItem.folderType && (
                    <span className="ml-2 text-sm text-muted-foreground capitalize">({selectedItem.folderType})</span>
                  )}
                  {selectedItem.type === "file" && <span className="ml-2 text-sm text-muted-foreground">(Shot)</span>}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleEditMode}
                    className={`px-3 py-1 rounded-md ${isEditMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className={`px-3 py-1 rounded-md ${!isEditMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                {selectedItem.type === "folder" ? (
                  <ConfigPanel
                    config={selectedItem.config || {}}
                    isEditMode={isEditMode}
                    onConfigChange={handleConfigChange}
                  />
                ) : (
                  <ContentPanel
                    content={selectedItem.content || {}}
                    isEditMode={isEditMode}
                    onContentChange={handleContentChange}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a file or folder to view details
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

