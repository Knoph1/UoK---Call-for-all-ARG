"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  File,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  X,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  status: "uploading" | "completed" | "error"
  progress: number
  url?: string
}

interface FileUploadSystemProps {
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  maxFiles?: number
  onFilesUploaded?: (files: UploadedFile[]) => void
}

export function FileUploadSystem({
  maxFileSize = 10,
  allowedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".zip"],
  maxFiles = 10,
  onFilesUploaded,
}: FileUploadSystemProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split(".").pop()
    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-red-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-8 w-8 text-green-500" />
      case "ppt":
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-8 w-8 text-purple-500" />
      case "mp3":
      case "wav":
        return <Music className="h-8 w-8 text-pink-500" />
      case "zip":
      case "rar":
        return <Archive className="h-8 w-8 text-gray-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive",
      })
      return false
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Only ${allowedTypes.join(", ")} files are allowed`,
        variant: "destructive",
      })
      return false
    }

    // Check max files limit
    if (uploadedFiles.length >= maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...f, progress: 100, status: "completed" }
            }
            return { ...f, progress: newProgress }
          }
          return f
        }),
      )
    }, 500)
  }

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          status: "uploading",
          progress: 0,
        }

        setUploadedFiles((prev) => [...prev, uploadedFile])
        simulateUpload(uploadedFile)
      }
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const downloadFile = (file: UploadedFile) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}`,
    })
  }

  const previewFile = (file: UploadedFile) => {
    toast({
      title: "Preview",
      description: `Opening preview for ${file.name}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-sky-600" />
            <span>File Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-sky-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Maximum file size: {maxFileSize}MB. Allowed types: {allowedTypes.join(", ")}
            </p>
            <input
              type="file"
              multiple
              accept={allowedTypes.join(",")}
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-sky-600 hover:bg-sky-700" asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Uploaded Files ({uploadedFiles.length}/{maxFiles})
              </span>
              <Badge variant="outline">{uploadedFiles.filter((f) => f.status === "completed").length} completed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {file.status === "uploading" && <Clock className="h-4 w-4 text-yellow-500" />}
                        {file.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {file.status === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <Badge
                          className={
                            file.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : file.status === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {file.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        {file.status === "completed" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => previewFile(file)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => downloadFile(file)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    {file.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
