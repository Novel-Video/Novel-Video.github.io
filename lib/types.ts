export interface FileData {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileData[]
}

