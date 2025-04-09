"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FileText, Plus, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FileData } from "@/lib/types"

interface FileSystemProps {
  files: FileData[]
  onFileSelect: (file: FileData) => void
  selectedFileId: string | undefined
}

export function FileSystem({ files, onFileSelect, selectedFileId }: FileSystemProps) {
  return (
    <div className="w-64 border-r bg-muted/10 h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Files</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add file</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map((file) => (
            <FileItem key={file.id} file={file} level={0} onFileSelect={onFileSelect} selectedFileId={selectedFileId} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface FileItemProps {
  file: FileData
  level: number
  onFileSelect: (file: FileData) => void
  selectedFileId: string | undefined
}

function FileItem({ file, level, onFileSelect, selectedFileId }: FileItemProps) {
  const [expanded, setExpanded] = useState(true)
  const isFolder = file.type === "folder"
  const isSelected = file.id === selectedFileId

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded)
    } else {
      onFileSelect(file)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-accent/50 group",
          isSelected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
          )
        ) : (
          <div className="w-4 mr-1" />
        )}
        {isFolder ? (
          <Folder className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
        ) : (
          <FileText className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
        )}
        <span className="truncate flex-1">{file.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            {isFolder && <DropdownMenuItem>New File</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isFolder && expanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileItem
              key={child.id}
              file={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

