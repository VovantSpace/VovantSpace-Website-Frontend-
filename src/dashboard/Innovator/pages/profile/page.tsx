import { useState } from "react"
import { Camera, Edit2, Check, X } from "lucide-react"

import { Button } from "@innovator/components/ui/button"
import { Card } from "@innovator/components/ui/card"
import { Input } from "@innovator/components/ui/input"
import { Switch } from "@innovator/components/ui/switch"
import { Separator } from "@innovator/components/ui/separator"
import { Label } from "@innovator/components/ui/label"
import { MainLayout } from "@innovator/components/layout/main-layout"
import { ChangePasswordDialog } from "@innovator/components/modals/change-password-dialog"
import { UploadImageDialog } from "@innovator/components/modals/upload-image-dialog"
import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime"
import tick from '@/assets/tick.png'
import { IdentityVerificationDialog } from "@problemsolver/components/modals/IdentityVerificationDialogue"
import { Textarea } from "@/dashboard/Innovator/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@innovator/components/ui/dialog"
import { Link } from "react-router-dom"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"


function ReauthenticateDialog({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      // Add your authentication API call here
      // await verifyPassword(password)
      onSuccess()
      onClose()
    } catch (err) {
      setError("Incorrect password. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 rounded-md dark:bg-[#131313] border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dashtext">Re-enter Password</DialogTitle>
          <p className="text-sm text-gray-400 mt-1">We need to verify it's really you.</p>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className=" text-black dark:text-white">v...@gmail.com</span>
            <Link to={'/login'}>
              <button className="text-xs text-emerald-500 hover:underline">Not you?</button>
            </Link>
          </div>
          <Label htmlFor="password" className="block text-sm dashtext">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <Link to={'/forget'}>
              <button className="text-xs text-emerald-500 hover:underline">Forgot password?</button>
            </Link>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose} className="dashbutton text-white">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="dashbutton">
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
    organization: "VovantSpace",
    bio: "This is the bio of Vovant Space",
    industry: "Coding",
  })
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    challengeUpdates: true,
    newMessages: true,
    marketingEmails: false,
  })

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
      organization: "",
      bio: "",
      industry: "",
    })
  }

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
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className='dashbutton'>
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
                        setTempProfileData((p) => ({ ...p, phone}))
                      }
                      inputStyle={{
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                        paddingLeft:"55px"
                      }}
                      containerClass="flex"
                    />
                  ) : (
                    <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                      {'+'+tempProfileData.phone || "Enter phone number"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <CountryandTime disable={isEditing ? false : true} flex={''} />
              </div>

              <div className="mt-6">
                <h2 className="mb-4 text-sm font-medium dashtext">Industry</h2>
                <div className="flex gap-2 text-sm">
                  <select
                    className="p-2 border dashborder w-full rounded-md"
                    value={tempProfileData.industry}
                    onChange={(e) => setTempProfileData(p => ({ ...p, industry: e.target.value }))}
                    disabled={!isEditing}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Energy & Sustainability">Energy & Sustainability</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Social Impact">Social Impact</option>
                    <option value="Government & Public Policy">Government & Public Policy</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <EditableField
                  label="Organization Name"
                  value={tempProfileData.organization}
                  onChange={(value) => setTempProfileData(p => ({ ...p, organization: value }))}
                  isEditing={isEditing}
                />
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
