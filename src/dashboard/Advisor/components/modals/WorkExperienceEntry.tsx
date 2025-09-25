import {X} from "lucide-react"
import {Input} from "@/dashboard/Innovator/components/ui/input"

export function WorkExperienceEntry({
                                        workExperience,
                                        onChange,
                                        onRemove,
                                        isEditing,
                                        showRemove,
                                    }: {
    workExperience: {
        id: number
        company: string
        role: string
        startDate: string
        endDate: string
    }
    onChange: (updated: any) => void
    onRemove: () => void
    isEditing: boolean
    showRemove: boolean
}) {
    return (
        <div className="space-y-4 relative p-4 py-3 dashborder rounded-lg">
            {isEditing && showRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                    <X className="h-4 w-4"/>
                </button>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Company */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Company:</label>
                    {isEditing ? (
                        <Input
                            value={workExperience.company || ""}
                            onChange={(e) =>
                                onChange({...workExperience, company: e.target.value})
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">{workExperience.company || "N/A"}</p>
                    )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Role:</label>
                    {isEditing ? (
                        <Input
                            value={workExperience.role || ""}
                            onChange={(e) =>
                                onChange({...workExperience, role: e.target.value})
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">{workExperience.role || "N/A"}</p>
                    )}
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">Start Date:</label>
                    {isEditing ? (
                        <Input
                            type="month"
                            value={workExperience.startDate || ""}
                            onChange={(e) =>
                                onChange({...workExperience, startDate: e.target.value})
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">
                            {workExperience.startDate
                                ? new Date(workExperience.startDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                })
                                : "N/A"}
                        </p>
                    )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium dashtext">End Date:</label>
                    {isEditing ? (
                        <Input
                            type="month"
                            value={workExperience.endDate || ""}
                            onChange={(e) =>
                                onChange({...workExperience, endDate: e.target.value})
                            }
                        />
                    ) : (
                        <p className="text-sm dark:text-white">
                            {workExperience.endDate
                                ? new Date(workExperience.endDate).toLocaleDateString("en-US", {
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
