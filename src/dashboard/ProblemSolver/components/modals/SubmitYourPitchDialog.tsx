import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent } from "@innovator/components/ui/dialog"
import { Input } from "@innovator/components/ui/input"
import { Button } from "@innovator/components/ui/button"
import { Badge } from "@innovator/components/ui/badge"
import { X, PaperclipIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import RichTextEditor from "@/dashboard/Innovator/components/modals/RichTextEditor"

interface SubmitPitchDialogProps {
  isOpen: boolean
  onClose: () => void
  challenge: {
    title: string
    skills: string[]
  }
}

export function SubmitPitchDialog({ isOpen, onClose, challenge }: SubmitPitchDialogProps) {
  const [name, setName] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const skillsList = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile App Development",
    "Game Development",
    "Software Engineering",
    "Data Science & Analytics",
    "Machine Learning & AI",
    "Blockchain Development",
    "Cybersecurity",
    "Cloud Computing",
    "Internet of Things (IoT)",
    "DevOps & Automation",
    "Database Management",
    "API Development & Integration",
    "Business Strategy & Growth Hacking",
    "Entrepreneurship & Startups",
    "Digital Marketing",
    "Branding & Personal Branding",
    "Sales & Lead Generation",
    "Market Research & Consumer Insights",
    "Financial Analysis & Investment Strategy",
    "E-commerce Strategy",
    "Project Management",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil & Structural Engineering",
    "Robotics & Automation",
    "Product Design & Prototyping",
    "Medical Research & Data Analysis",
    "HealthTech & Telemedicine Solutions",
    "Biotechnology & Biomedical Engineering",
    "Mental Health & Therapy Counseling",
    "Nutrition & Dietetics",
    "UI/UX Design",
    "Graphic Design",
    "Video Editing & Motion Graphics",
    "Content Writing & Copywriting",
    "Music Production & Sound Engineering",
    "Photography & Digital Arts",
    "Renewable Energy Solutions",
    "Climate Change & Environmental Science",
    "Sustainable Agriculture & Food Tech",
    "Smart Cities & Urban Planning",
    "Teaching & Coaching",
    "Curriculum Development & E-learning",
    "Research & Academic Writing",
    "Nonprofit & Social Entrepreneurship",
    "CivicTech & Government Innovation",
    "Diversity, Equity & Inclusion Initiatives"
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles])
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    onClose()
  }


  const handleSkillSelection = (skill: string) => {
    setSelectedSkill(prev => prev === skill ? '' : skill);
  };



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
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Submit Your Pitch</h2>
            <p className="text-sm ">
              Share your solution for <span className="dark:text-white">"{challenge.title}"</span>
            </p>
          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Challenge Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Challenge Title</label>
            <Input
              value={challenge.title}
              disabled
              className="
                secondbg 
                border 
                border-gray-300 
                dark:border-gray-700 
                dark:bg-[#2a2a2a] 
                dark:text-white
                text-black
                font-medium
              "
            />
          </div>

          {/* Your Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled
              className="
            secondbg 
                border 
                border-gray-300 
                dark:border-gray-700 
                dark:bg-[#2a2a2a] 
                dark:text-white
                text-black
                font-medium
              "
            />
          </div>

          {/* Solution Summary */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Solution Summary</label>
            <RichTextEditor />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Select Skill/Expertise:</label>
            <div className="flex flex-wrap gap-2">
              {challenge.skills.map((skill) => (
                <Badge
                  key={skill}
                  onClick={() => handleSkillSelection(skill)}
                  className={`cursor-pointer hover:bg-muted ${selectedSkill === skill ? "bg-emerald-600 hover:text-black text-white" : "bg-muted hover:text-black text-black"}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>



          {/* Supporting Documents */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Supporting Documents</label>
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
              <PaperclipIcon className="h-8 w-8 text-gray-500 mb-2 dark:text-gray-400" />
              <p className="text-center mb-1 dark:text-white">Upload files or drag and drop</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PDF, DOC, JPEG or PNG up to 10MB
              </p>
            </div>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-400 dark:text-gray-300">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="
              w-full 
              bg-emerald-600 
              hover:bg-emerald-700 
              text-white 
              dashbutton
            "
          >
            Submit Pitch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
