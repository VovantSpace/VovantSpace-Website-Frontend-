import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"

import { Button } from "@/dashboard/Innovator/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {toast} from 'react-hot-toast'

interface UploadImageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImageUploaded?: (imageUrl: string) => void;
    uploadFunction: (file: File) => Promise<string>;
    isUpLoading: boolean;
}

export function UploadImageDialog({
                                      isOpen,
                                      onClose,
                                      onImageUploaded,
                                      uploadFunction,
                                      isUpLoading
                                  }: UploadImageDialogProps) {

    const [preview, setPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUpLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/gif']
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPG, PNG, GIF)')
                return
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size must be less than 5MB')
                return
            }

            setSelectedFile(file) // Store the actual file

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/gif']
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPG, PNG, GIF)')
                return
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size must be less than 5MB')
                return
            }

            setSelectedFile(file) // Store the actual file

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }

    const handleUpLoad = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first')
            return
        }

        try {
            setUpLoading(true)
            const imageUrl = await uploadFunction(selectedFile)

            if (onImageUploaded) {
                onImageUploaded(imageUrl)
            }

            toast.success('Profile picture uploaded successfully.')
            handleClose()
        } catch (error: any) {
            console.error('Upload failed:', error)
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setUpLoading(false)
        }
    }

    const handleClose = () => {
        setPreview(null)
        setSelectedFile(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] secondbg dashtext max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Upload Profile Image
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">Drag and drop an image or click to browse</DialogDescription>
                </DialogHeader>
                <div
                    className="flex flex-col items-center justify-center gap-4 py-8"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {preview ? (
                        <div className="relative h-32 w-32">
                            <img
                                src={preview || "/placeholder.svg"}
                                alt="Preview"
                                className="h-full w-full rounded-full object-cover"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-2 -top-2 h-8 w-8 rounded-full secondbg"
                                onClick={() => {
                                    setPreview(null)
                                    setSelectedFile(null)
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-600 secondbg transition-colors hover:border-gray-400"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-400">Upload Image</span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <p className="text-sm text-gray-400">Supported formats: JPG, PNG, GIF (max 5MB)</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} className="secondbg">
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#00bf8f] hover:bg-[#31473A]"
                        disabled={!preview || uploading || isUpLoading}
                        onClick={handleUpLoad}
                    >
                        {uploading || isUpLoading ? 'Uploading...' : 'Save Image'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}