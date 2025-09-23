// Create a new component EditableSection.tsx
import { useState } from "react"
import ReauthenticateDialog  from "@/dashboard/Client/components/Reauthenticatedialog"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Edit2} from "lucide-react"

export function EditableSection({
  title,
  children,
  onSave,
  onCancel,
  isEditing,
  setIsEditing
}: {
  title: string
  children: React.ReactNode
  onSave: () => void
  onCancel: () => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleAuthSuccess = () => {
    setIsEditing(true)
    setShowAuthDialog(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dashtext">{title}</h2>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setShowAuthDialog(true)}
            className="text-emerald-600 border-emerald-600 font-bold p-1 px-3 rounded-full"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {children}

      {isEditing && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button onClick={onSave} className="dashbutton" size="sm">
            Save
          </Button>
        </div>
      )}

      <ReauthenticateDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}