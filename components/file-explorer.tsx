"use client"

import type { FileSystemItem } from "@/types/file-system"
import { Folder, Video, Film, Clapperboard } from "lucide-react"

interface FileExplorerProps {
  items: FileSystemItem[]
  expandedFolders: Set<string>
  selectedItem: FileSystemItem | null
  onItemClick: (item: FileSystemItem) => void
  onItemDoubleClick: (item: FileSystemItem) => void
  level?: number
}

export default function FileExplorer({
  items,
  expandedFolders,
  selectedItem,
  onItemClick,
  onItemDoubleClick,
  level = 0,
}: FileExplorerProps) {
  const getIcon = (item: FileSystemItem) => {
    if (item.type === "file") {
      return <Clapperboard className="h-4 w-4 mr-2 flex-shrink-0" />
    }

    switch (item.folderType) {
      case "episode":
        return <Video className="h-4 w-4 mr-2 flex-shrink-0" />
      case "scene":
        return <Film className="h-4 w-4 mr-2 flex-shrink-0" />
      case "cut":
        return <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
      default:
        return <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
    }
  }

  return (
    <ul className={`space-y-1 ${level > 0 ? "ml-4" : ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <div
            className={`flex items-center p-2 rounded-md cursor-pointer ${
              selectedItem?.id === item.id ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent/50"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onItemClick(item)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              onItemDoubleClick(item)
            }}
          >
            {getIcon(item)}
            <span className="truncate">{item.name}</span>
          </div>
          {item.type === "folder" && item.children && expandedFolders.has(item.id) && (
            <FileExplorer
              items={item.children}
              expandedFolders={expandedFolders}
              selectedItem={selectedItem}
              onItemClick={onItemClick}
              onItemDoubleClick={onItemDoubleClick}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

