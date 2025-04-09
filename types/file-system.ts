export type FolderType = "episode" | "scene" | "cut"

export interface FileContent {
  shotDescription: string
  dialogues: string
  actions: string
  cameraMovements: string
  positioning: string
}

export interface FileSystemItem {
  id: string
  name: string
  type: "file" | "folder"
  folderType?: FolderType
  children?: FileSystemItem[]
  content?: Record<string, Record<string, string>> | FileContent | string
  config?: Record<string, string | Record<string, string>>
}

export interface PreviewImage {
  id: string
  url: string
  alt: string
}

