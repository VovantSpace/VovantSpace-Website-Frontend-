import type React from "react"
import {useState} from "react"
import {Dialog, DialogContent} from "@/dashboard/Innovator/components/ui/dialog"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {Badge} from "@/dashboard/Innovator/components/ui/badge"
import {PaperclipIcon, XCircle, CheckCircle2, Trash2} from "lucide-react"
import {useDropzone} from "react-dropzone"
import RichTextEditor from "@/dashboard/Innovator/components/modals/RichTextEditor"
import {useProblemSolverProfile, useSubmitPitch} from "@/hooks/useProblemSolver"
import {useFileUpload} from "@/hooks/useFileUpload"

interface SubmitPitchDialogProps {
    isOpen: boolean
    onClose: () => void
    challenge: {
        id: string
        title: string
        skills: { name: string; budget: number }[]
    }
}

interface UploadedAttachment {
    filename: string
    url: string
    fileType: string
    status: "pending" | "success" | "error"
}

export function SubmitPitchDialog({
                                      isOpen,
                                      onClose,
                                      challenge,
                                  }: SubmitPitchDialogProps) {
    const [attachments, setAttachments] = useState<UploadedAttachment[]>([])
    const [selectedSkill, setSelectedSkill] = useState<string>("")
    const [solutionSummary, setSolutionSummary] = useState<string>("")
    const {uploadFile} = useFileUpload()
    const {submitPitch, loading, error, success} = useSubmitPitch()
    const {profile, loading: profileLoading} = useProblemSolverProfile()

    // File dropzone
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc", ".docx"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        maxSize: 10 * 1024 * 1024,
        onDrop: async (acceptedFiles) => {
            const pending = acceptedFiles.map((file) => ({
                filename: file.name,
                url: URL.createObjectURL(file),
                fileType: file.type,
                status: "pending" as const,
            }))

            setAttachments((prev) => [...prev, ...pending])

            for (const file of acceptedFiles) {
                const uploaded = await uploadFile(file)
                setAttachments((prev) =>
                    prev.map((att) =>
                        att.filename === file.name && att.status === "pending"
                            ? uploaded
                                ? {...att, url: uploaded.url, status: "success"}
                                : {...att, status: "error"}
                            : att
                    )
                )
            }
        },
    })

    // Remove file from preview
    const handleRemoveFile = (filename: string) => {
        setAttachments((prev) => prev.filter((att) => att.filename !== filename))
    }

    // Submit pitch
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const successfulAttachments = attachments.filter(
            (a) => a.status === "success"
        )

        const payload = {
            solutionSummary,
            skillTags: selectedSkill ? [selectedSkill] : [],
            attachments: successfulAttachments.map(({filename, url, fileType}) => ({
                filename,
                url,
                fileType,
            })),
        }

        // ✅ Always submit with challenge.id
        await submitPitch(challenge.id, payload)

        if (success) {
            setAttachments([])
            setSolutionSummary("")
            setSelectedSkill("")
            onClose()
        }
    }

    const handleSkillSelection = (skill: string) => {
        setSelectedSkill((prev) => (prev === skill ? "" : skill))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="
          sm:max-w-[600px]
          secondbg
          dark:bg-[#1a1a1a]
          dark:text-white
          p-6
          max-h-[90vh]
          overflow-y-auto
          rounded-md
        "
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-0">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 dark:text-white">
                            Submit Your Pitch
                        </h2>
                        <p className="text-sm ">
                            Share your solution for{" "}
                            <span className="dark:text-white">"{challenge.title}"</span>
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Challenge Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Challenge Title
                        </label>
                        <Input value={challenge.title} disabled/>
                    </div>

                    {/* Your Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Your Name
                        </label>
                        <Input
                            value={profileLoading ? "Loading..." : profile?.fullName || "Unknown"}
                            readOnly
                        />
                    </div>

                    {/* Solution Summary */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Solution Summary
                        </label>
                        <RichTextEditor
                            value={solutionSummary}
                            onChange={setSolutionSummary}
                        />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Select Skill/Expertise:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {challenge.skills.map((skill) => (
                                <Badge
                                    key={skill.name}
                                    onClick={() => handleSkillSelection(skill.name)}
                                    className={`cursor-pointer hover:bg-muted ${
                                        selectedSkill === skill.name
                                            ? "bg-emerald-600 hover:text-black text-white"
                                            : "bg-muted hover:text-black text-black"
                                    }`}
                                >
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-white">
                            Supporting Documents
                        </label>
                        <div
                            {...getRootProps()}
                            className={`
                border-2 border-dashed rounded-lg p-8
                flex flex-col items-center justify-center
                cursor-pointer
                transition-colors
                ${isDragActive ? "border-primary" : ""}
                border-primary
                dark:border-gray-600
              `}
                        >
                            <input {...getInputProps()} />
                            <PaperclipIcon className="h-8 w-8 text-gray-500 mb-2 dark:text-gray-400"/>
                            <p className="text-center mb-1 dark:text-white">
                                Upload files or drag and drop
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                PDF, DOC, JPEG or PNG up to 10MB
                            </p>
                        </div>

                        {/* Preview uploads with status + remove */}
                        {attachments.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {attachments.map((file) => (
                                    <div
                                        key={file.filename}
                                        className="group relative flex flex-col items-center text-xs text-gray-500 dark:text-gray-300"
                                    >
                                        {file.fileType.startsWith("image/") ? (
                                            <img
                                                src={file.url}
                                                alt={file.filename}
                                                className="h-16 w-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="truncate max-w-[80px]">
                        {file.filename}
                      </span>
                                        )}

                                        {/* Status indicator */}
                                        {file.status === "pending" && (
                                            <span className="text-yellow-500 mt-1">Uploading...</span>
                                        )}
                                        {file.status === "success" && (
                                            <CheckCircle2 className="text-emerald-500 h-4 w-4 mt-1"/>
                                        )}
                                        {file.status === "error" && (
                                            <div className="flex items-center gap-1 text-red-500 mt-1">
                                                <XCircle className="h-4 w-4"/>
                                                <span>Error</span>
                                            </div>
                                        )}

                                        {/* Remove button (hover only) */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(file.filename)}
                                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dashbutton"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Pitch"}
                    </Button>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    {success && (
                        <p className="text-sm text-green-500 mt-2">
                            Pitch Submitted Successfully
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
