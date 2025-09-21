import { useState } from "react"
import { Camera, Edit2, Check, X } from "lucide-react"
import { FaTimes } from "react-icons/fa"

import {Button} from "@/dashboard/Innovator/components/ui/button";
import { Card } from "@/dashboard/Innovator/components/ui/card"

import { Switch } from "@/dashboard/Innovator/components/ui/switch"
import { Separator } from "@/dashboard/Innovator/components/ui/separator"
import { Label } from "@/dashboard/Innovator/components/ui/label"
import { MainLayout } from "../../components/layout/main-layout";
import { ChangePasswordDialog } from "@/dashboard/Innovator/components/modals/change-password-dialog"
import { UploadImageDialog } from "@/dashboard/Innovator/components/modals/upload-image-dialog"
import tick from '@/assets/tick.png'
import { IdentityVerificationDialog } from "@/dashboard/ProblemSolver/components/modals/IdentityVerificationDialogue"

import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

import EditableField from "../../components/EditableField"
import ReauthenticateDialog from "../../components/Reauthenticatedialog"

import { advisorMapping } from "@/components/signup/Client"
import { advisorOptions } from "@/components/signup/Client"

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


export default function ProfilePage() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isGetVerifiedDialogueOpen, setIsGetVerifiedDialogueOpen] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);
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

  const filteredSkills = skillsList.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSkillSelection = (skill: string) => {
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

  const handleAdvisorChange = (e) => {
    setSelectedAdvisor(e.target.value);
    setSelectedReasons([]);
  };

  const handleReasonChange = (reason) => {
    setSelectedReasons((prevSelectedReasons) => {
      if (prevSelectedReasons.includes(reason)) {
        // Remove the reason if it's already selected
        return prevSelectedReasons.filter((r) => r !== reason);
      } else {
        // Add the reason if it's not selected and limit to 3 selections
        if (prevSelectedReasons.length < 3) {
          return [...prevSelectedReasons, reason];
        } else {
          return prevSelectedReasons;
        }
      }
    });
  };


  const removeReason = (reason) => {
    setSelectedReasons(selectedReasons.filter(r => r !== reason));
  };

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
                        onClick={() => setIsGetVerifiedDialogueOpen(true)}
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


              <div className="my-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Preferred Advisor/Mentor Type</label>
                <select className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" onChange={handleAdvisorChange} value={selectedAdvisor} disabled={!isEditing}>
                  <option value="">Select Preferred Advisor/Mentor Type</option>
                  {advisorOptions.map((option, index) => (
                    <option key={index} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                  Reason for Joining (Select up to 3)
                </label>
                <div className="relative max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 dark:text-white">
                  {selectedAdvisor ? (
                    advisorMapping[selectedAdvisor].map((reason, index) => (
                      <div key={index} className="flex items-center mb-1 ">
                        <input
                          type="checkbox"
                          id={`reason-${index}`}
                          value={reason}
                          checked={selectedReasons.includes(reason)}
                          onChange={() => handleReasonChange(reason)}
                          className="mr-2"
                          disabled={!isEditing}

                        />
                        <label htmlFor={`reason-${index}`} className="text-sm text-gray-700 dark:text-white">
                          {reason}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-white">
                      Select Preferred Advisor/Mentor Type first
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1 dark:text-white">
                  {selectedReasons.map((reason, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {reason}
                      <button
                        type="button"
                        className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                        onClick={() => removeReason(reason)}
                        disabled={!isEditing}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>


            </div>
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
        <IdentityVerificationDialog isOpen={isGetVerifiedDialogueOpen} onClose={() => setIsGetVerifiedDialogueOpen(false)} />
      </div>
    </MainLayout>
  )
}
