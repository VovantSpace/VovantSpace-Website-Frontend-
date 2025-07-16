import { X } from "lucide-react"
import { Input } from "@innovator/components/ui/input"

export function EducationEntry({
  education,
  degree,
  field,
  startYear,
  endYear,
  onChange,
  onRemove,
  isEditing,
  showRemove
}: {
  education: any
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
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Institution:</label>
          {isEditing ? (
            <Input
              value={education.institution}
              onChange={(e) => onChange({ ...education, institution: e.target.value })}
            />
          ) : (
            <p className="text-sm dark:text-white">{education.institution}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Degree:</label>
          {isEditing ? (
            <Input
              value={education.degree}
              onChange={(e) => onChange({ ...education, degree: e.target.value })}
            />
          ) : (
            <p className="text-sm dark:text-white">{education.degree}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Field:</label>
          {isEditing ? (
            <Input
              value={education.field}
              onChange={(e) => onChange({ ...education, field: e.target.value })}
            />
          ) : (
            <p className="text-sm dark:text-white">{education.field}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Start Date:</label>
          {isEditing ? (
            <Input
              type="month"
              value={education.startYear}
              onChange={(e) => onChange({ ...education, startYear: e.target.value  })}
            />
          ) : (
            <p className="text-sm dark:text-white">{new Date(education.startYear).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">End Date:</label>
          {isEditing ? (
            <Input
              type="month"
              value={education.endYear}
              onChange={(e) => onChange({ ...education, endYear: e.target.value  })}
            />
          ) : (
            <p className="text-sm dark:text-white">{new Date(education.endYear).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          )}
        </div>
       
      </div>
    </div>
  )
}