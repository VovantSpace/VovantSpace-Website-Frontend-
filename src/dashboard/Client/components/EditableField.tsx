import { Label } from "@/dashboard/Innovator/components/ui/label"
import { Input } from "@/dashboard/Innovator/components/ui/input"

export default function EditableField({
  label,
  value,
  onChange,
  inputType = "text",
  placeholder = "",
  isEditing,
}: {
  label: string
  value: string
  onChange: (newValue: string) => void
  inputType?: string
  placeholder?: string
  isEditing: boolean
}) {
  return (
    <div className="space-y-2">
      <Label className="dashtext">{label}</Label>
      {isEditing ? (
        <Input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dashborder flex-1 bg-white"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
          {value || placeholder}
        </p>
      )}
    </div>
  )
}