import { X } from "lucide-react"
import { Input } from "@innovator/components/ui/input"
import { Textarea } from "@innovator/components/ui/textarea"

export function PortfolioEntry({
  project,
  onChange,
  onRemove,
  isEditing
}: {
  project: any
  onChange: (updated: any) => void
  onRemove: () => void
  isEditing: boolean
}) {
  return (
    <div className="space-y-4 relative p-4 dashborder rounded-lg">
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-btn"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium dashtext dark:text-white">Project Title:</label>
          {isEditing ? (
            <Input
              value={project.title}
              onChange={(e) => onChange({ ...project, title: e.target.value })}
              placeholder="VovantSpace Project"
            />
          ) : (
            <p className="text-sm font-medium dark:text-white">{project.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Project URL:</label>
          {isEditing ? (
            <Input
              value={project.url}
              onChange={(e) => onChange({ ...project, url: e.target.value })}
              placeholder="https://example.com"
            />
          ) : (
            <a 
              href={project.url} 
              className="text-sm text-emerald-500 hover:underline block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.url}
            </a>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dashtext">Description:</label>
          {isEditing ? (
            <>
              <Textarea
                value={project.description}
                onChange={(e) => onChange({ ...project, description: e.target.value })}
                rows={3}
                className="mt-2 dashborder"
                maxLength={300}
                placeholder="This Project was created to..."
              />
              <p className="text-right text-sm text-gray-400">
                {project.description.length}/300
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">{project.description}</p>
          )}
        </div>
        
        <div className="">
          <label className="text-sm font-medium dashtext">Portfolio Image:</label>
          {isEditing ? (
            <input
              type="file"
              accept="image/*"
              className="dark:text-white ml-4 text-sm"
              onChange={(e) => {
                const file = e.target?.files ? e.target?.files[0] : null;
                onChange({ ...project, image: file });
              }}
            />
          ) : (
            project.image && (
              <img 
                src={typeof project?.image === "string" ? project?.image : URL.createObjectURL(project?.image)} 
                alt="Portfolio" 
                className="w-96 " 
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
