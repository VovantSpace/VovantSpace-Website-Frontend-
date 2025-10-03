import {useState} from 'react'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const uploadFile = async (file: File) => {
        try {
            setUploading(true)
            setError(null)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", UPLOAD_PRESET || "")

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
                {method: "POST", body: formData}
            )
            const data = await res.json()

            if (data.secure_url) {
                return {
                    filename: file.name,
                    url: data.secure_url,
                    fileType: file.type
                }
            } else {
                setError("Upload failed")
                return null
            }
        } catch (err: any) {
            setError("Upload failed")
            return null
        } finally {
            setUploading(false)
        }
    }

    return {uploading, uploadFile, error}
}