import { X } from "lucide-react"
import { Input } from "@/dashboard/Innovator/components/ui/input"

export function CertificationEntry({
                                       certification,
                                       onChange,
                                       onRemove,
                                       isEditing,
                                       showRemove,
                                   }: {
    certification: {
        id: number
        name: string
        issuer: string
        date: string // expected format: YYYY-MM
    }
    onChange: (updated: any) => void
    onRemove: () => void
    isEditing: boolean
    showRemove: boolean
}) {
    return (
        <div className="space-y-4 relative p-4 dashborder rounded-lg">
            {isEditing && showRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                    <X className="h-5 w-5" />
                </button>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Certification Name</label>
                    {isEditing ? (
                        <Input
                            value={certification.name || ""}
                            onChange={(e) => onChange({ ...certification, name: e.target.value })}
                        />
                    ) : (
                        <p className="text-sm dark:text-white">{certification.name || "N/A"}</p>
                    )}
                </div>

                {/* Issuer */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Issuing Organization</label>
                    {isEditing ? (
                        <Input
                            value={certification.issuer || ""}
                            onChange={(e) =>
                                onChange({ ...certification, issuer: e.target.value })
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">{certification.issuer || "N/A"}</p>
                    )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Date Obtained</label>
                    {isEditing ? (
                        <Input
                            type="month"
                            value={certification.date || ""}
                            onChange={(e) =>
                                onChange({ ...certification, date: e.target.value })
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">
                            {certification.date
                                ? new Date(certification.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                })
                                : "N/A"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
