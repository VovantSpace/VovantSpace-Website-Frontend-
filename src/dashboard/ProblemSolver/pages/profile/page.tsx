import { useState } from "react"
import { Camera, Edit2, Check, X } from "lucide-react"

import { Button } from "@innovator/components/ui/button"
import { Card } from "@innovator/components/ui/card"
import { Input } from "@innovator/components/ui/input"
import { Switch } from "@innovator/components/ui/switch"
import { Separator } from "@innovator/components/ui/separator"
import { Label } from "@innovator/components/ui/label"
import { MainLayout } from "@problemsolver/components/layout/main-layout"
import { ChangePasswordDialog } from "@innovator/components/modals/change-password-dialog"
import { UploadImageDialog } from "@innovator/components/modals/upload-image-dialog"
import CountryandTime from "./CountryandTime"
import tick from '@/assets/tick.png'
import { IdentityVerificationDialog } from "../../components/modals/IdentityVerificationDialogue"
import { Textarea } from "@/dashboard/Innovator/components/ui/textarea"
import { ReauthenticateDialog } from "../../components/modals/ReauthencticateDialog"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { EditableSection } from "../../components/modals/EditableSection"
import { EducationEntry } from "../../components/modals/EducationEntry"
import { PortfolioEntry } from "../../components/modals/PortfolioEntry"
import { CertificationEntry } from "../../components/modals/CertificationEntry"

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


function EditableField({
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

export default function ProfilePage() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isGetVerifiedDialogueOpen, setisGetVerifiedDialogueOpen] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempProfileData, setTempProfileData] = useState({
    firstName: "Vovant",
    lastName: "Space",
    email: "vovant@example.com",
    phone: '',
    bio: "This is the bio of Vovant Space",
    industry: "Coding",
  })
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    challengeUpdates: true,
    newMessages: true,
    marketingEmails: false,
  })
  const [selectedSkill, setSelectedSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingEducation, setIsEditingEducation] = useState(false)
  const [isEditingCertification, setIsEditingCertification] = useState(false)
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)

  const filteredSkills = skillsList.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSkillSelection = (skill) => {
    setSelectedSkill(prev => prev === skill ? '' : skill);
  };


  const handleAuthSuccess = () => {
    setIsEditing(true)
    setShowAuthDialog(false)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Add your save API call here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
    setTempProfileData({
      firstName: "Vovant",
      lastName: "Space",
      email: "vovant@example.com",
      phone: "",
      bio: "",
      industry: "",
    })
  }
  const [tempEducations, setTempEducations] = useState([
    {
      id: 1,
      institution: "Massachusetts Institute of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science & AI",
      startYear: "2015",
      endYear: "2019"
    }
  ])

  const [tempCertifications, setTempCertifications] = useState([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022"
    }
  ])

  const [tempPortfolios, setTempPortfolios] = useState([
    {
      id: 1,
      title: "AI Healthcare Platform",
      url: "https://example.com/healthcare-ai",
      description: "Developed ML system for patient diagnosis"
    }
  ])

  return (
    <MainLayout>
      <div className="space-y-6 md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 dashbg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dashtext">Profile Settings</h1>
          <div className="relative top-20 right-7 ">
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setShowAuthDialog(true)}
                className=" text-emerald-600 border-emerald-600 font-bold transition-colors p-1 px-3 rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {isEditing && (
              <div className="flex justify-end gap-2 relative sm:bottom-0 bottom-14 left-7">
                <Button variant="outline" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSave} className='dashbutton' size="sm">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="secondbg md:p-6 p-3">
            <h2 className="mb-6 text-lg font-semibold dashtext">Profile Information</h2>
            <div className="mb-5">
              <div className="mb-6 flex items-center md:gap-6 gap-3">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00bf8f] text-3xl dashtext">
                    VS
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-black"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <div className="md:flex items-center justify-center md:mb-4">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-lg font-semibold dashtext">
                        {tempProfileData.firstName} {tempProfileData.lastName}
                      </h3>
                      <div
                        className="flex items-center text-xs gap-2 bg-transparent py-0.5 px-2 rounded-full border border-gray-500 cursor-pointer"
                        onClick={() => setisGetVerifiedDialogueOpen(true)}
                      >
                        <img src={tick} alt="Verification Tick" className="w-5" />
                        <span className="dark:text-white font-semibold tracking-wide">Get verified</span>
                      </div>
                    </div>
                    <p className="text-sm text-left mt-1 dark:text-white">{tempProfileData.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-left">
                <EditableField
                  label="First Name"
                  value={tempProfileData.firstName}
                  onChange={(value) => setTempProfileData(p => ({ ...p, firstName: value }))}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Last Name"
                  value={tempProfileData.lastName}
                  onChange={(value) => setTempProfileData(p => ({ ...p, lastName: value }))}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Email"
                  value={tempProfileData.email}
                  onChange={(value) => setTempProfileData(p => ({ ...p, email: value }))}
                  inputType="email"
                  isEditing={isEditing}
                />
                <div className="space-y-2 w-full">
                  <Label className="dashtext">Phone</Label>
                  {isEditing ? (
                    <PhoneInput
                      country={"us"}
                      value={tempProfileData.phone}
                      onChange={(phone) =>
                        setTempProfileData((p) => ({ ...p, phone }))
                      }
                      inputStyle={{
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                        paddingLeft: "55px"
                      }}
                      containerClass="flex"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                      {'+' + tempProfileData.phone || "Enter phone number"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <CountryandTime disable={!isEditing} flex={''} />
              </div>

              <div className="my-4">
                <label className="block text-sm text-gray-700 dark:text-white font-medium mb-2">Skill/Expertise</label>
                <input
                  type="text"
                  placeholder="Search skills..."
                  className="w-full border rounded-lg p-2 text-sm bg-white mb-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!isEditing}
                />
                <div className="border rounded-lg p-4 h-32 overflow-y-auto ">
                  {filteredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        id={`skill-${index}`}
                        className="mr-2"
                        checked={selectedSkill === skill}
                        onChange={() => handleSkillSelection(skill)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`skill-${index}`} className="text-gray-700 dark:text-white">{skill}</label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedSkill && (
                <div className="mt-4 mb-2">
                  <h3 className="text-md mb-1 font-medium text-gray-700 dark:text-white ">Selected Skill:</h3>
                  <ul className="flex flex-wrap gap-2">
                    <li className="bg-green-700 text-sm px-2 py-1 text-white rounded-xl">{selectedSkill}</li>
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-gray-700 font-medium mb-2 dark:text-white">Years of Experience</label>
                <select className="w-full border rounded-lg p-2 text-sm" disabled={!isEditing}>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option selected>4-6 years</option>
                  <option>7-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>

              <div className="mt-6">
                <div className="space-y-2">
                  <Label className="dashtext">Short Bio/About You (Max 300 Characters)</Label>
                  {isEditing ? (
                    <>
                      <Textarea
                        value={tempProfileData.bio}
                        onChange={(e) => setTempProfileData(p => ({ ...p, bio: e.target.value }))}
                        className="mt-2 dashborder"
                        maxLength={300}
                      />
                      <p className="text-right text-sm text-gray-400">
                        {tempProfileData.bio.length}/300
                      </p>
                    </>
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                      {tempProfileData.bio || "Enter your bio"}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </Card>

          {/* education */}
          <Card className="secondbg p-6">
            <EditableSection
              title="Education:"
              isEditing={isEditingEducation}
              setIsEditing={setIsEditingEducation}
              onSave={() => setIsEditingEducation(false)}
              onCancel={() => setIsEditingEducation(false)}
            >
              <div className="space-y-6">
                {tempEducations.map((edu, index) => (
                  <EducationEntry
                    key={edu.id}
                    education={edu}
                    degree
                    field
                    startYear
                    EndYear
                    isEditing={isEditingEducation}
                    showRemove={tempEducations.length > 1}
                    onChange={(updated) => {
                      const updatedEducations = [...tempEducations]
                      updatedEducations[index] = updated
                      setTempEducations(updatedEducations)
                    }}
                    onRemove={() => setTempEducations(tempEducations.filter((_, i) => i !== index))}
                  />
                ))}

                {isEditingEducation && tempEducations.length < 3 && (
                  <Button
                    variant="outline"
                    className="w-full dashborder dashbutton text-white"
                    onClick={() => {
                      setTempEducations([
                        ...tempEducations,
                        {
                          id: Date.now(),
                          institution: "",
                          degree: "",
                          field: "",
                          startYear: "",
                          endYear: ""
                        }
                      ])
                    }}
                  >
                    + Add Another Education
                  </Button>
                )}
              </div>
            </EditableSection>
          </Card>

          {/* Certifications Section */}
          <Card className="secondbg p-6">
            <EditableSection
              title="Certifications:"
              isEditing={isEditingCertification}
              setIsEditing={setIsEditingCertification}
              onSave={() => setIsEditingCertification(false)}
              onCancel={() => setIsEditingCertification(false)}
            >
              <div className="space-y-6">
                {tempCertifications.map((cert, index) => (
                  <CertificationEntry
                    key={cert.id}
                    certification={cert}
                    isEditing={isEditingCertification}
                    showRemove={tempCertifications.length > 1}
                    onChange={(updated) => {
                      const updatedCerts = [...tempCertifications]
                      updatedCerts[index] = updated
                      setTempCertifications(updatedCerts)
                    }}
                    onRemove={() => setTempCertifications(tempCertifications.filter((_, i) => i !== index))}
                  />
                ))}

                {isEditingCertification && tempCertifications.length < 3 && (
                  <Button
                    variant="outline"
                       className="w-full dashborder dashbutton text-white"
                    onClick={() => {
                      setTempCertifications([
                        ...tempCertifications,
                        {
                          id: Date.now(),
                          name: "",
                          issuer: "",
                          date: ""
                        }
                      ])
                    }}
                  >
                    + Add Another Certification
                  </Button>
                )}
              </div>
            </EditableSection>
          </Card>

          {/* Portfolio Section */}
          <Card className="secondbg p-6">
            <EditableSection
              title="Portfolio:"
              isEditing={isEditingPortfolio}
              setIsEditing={setIsEditingPortfolio}
              onSave={() => setIsEditingPortfolio(false)}
              onCancel={() => setIsEditingPortfolio(false)}
            >
              <div className="space-y-6">
                {tempPortfolios.map((project, index) => (
                  <PortfolioEntry
                    key={project.id}
                    project={project}
                    isEditing={isEditingPortfolio}
                    onChange={(updated) => {
                      const updatedProjects = [...tempPortfolios]
                      updatedProjects[index] = updated
                      setTempPortfolios(updatedProjects)
                    }}
                    onRemove={() => setTempPortfolios(tempPortfolios.filter((_, i) => i !== index))}
                  />
                ))}

                {isEditingPortfolio && (
                  <Button
                    variant="outline"
                        className="w-full dashborder dashbutton text-white"
                    onClick={() => {
                      setTempPortfolios([
                        ...tempPortfolios,
                        {
                          id: Date.now(),
                          title: "",
                          url: "",
                          description: ""
                        }
                      ])
                    }}
                  >
                    + Add New Project
                  </Button>
                )}
              </div>
            </EditableSection>
          </Card>

          <Card className="secondbg p-6">
            <h2 className="mb-6 text-lg font-semibold dashtext">Security Settings</h2>
            <Button
              variant="outline"
              className="w-full text-left border dashborder"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change Password
              <span className="ml-auto text-gray-400">••••••••</span>
            </Button>
          </Card>

          <Card className="secondbg p-6">
            <h2 className="mb-6 text-lg font-semibold dashtext">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="dashtext">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive important updates about your challenges via email</p>
                </div>
                <Switch
                  checked={notificationPreferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>
              <Separator className="secondbg" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="dashtext">Challenge Updates</Label>
                  <p className="text-sm text-gray-400">Receive updates about your challenges</p>
                </div>
                <Switch
                  checked={notificationPreferences.challengeUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      challengeUpdates: checked,
                    }))
                  }
                />
              </div>
              <Separator className="secondbg" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="dashtext">New Messages</Label>
                  <p className="text-sm text-gray-400">Receive updates about new messages</p>
                </div>
                <Switch
                  checked={notificationPreferences.newMessages}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      newMessages: checked,
                    }))
                  }
                />
              </div>
              <Separator className="secondbg" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="dashtext">Marketing Emails</Label>
                  <p className="text-sm text-gray-400">Receive marketing emails</p>
                </div>
                <Switch
                  checked={notificationPreferences.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences((prev) => ({
                      ...prev,
                      marketingEmails: checked,
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        <ReauthenticateDialog
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onSuccess={handleAuthSuccess}
        />
        <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} />
        <UploadImageDialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} />
        <IdentityVerificationDialog isOpen={isGetVerifiedDialogueOpen} onClose={() => setisGetVerifiedDialogueOpen(false)} />
      </div>
    </MainLayout>
  )
}
