import { useState, useEffect } from "react";
import { Camera, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/dashboard/Innovator/components/ui/switch";
import { Separator } from "@/dashboard/Innovator/components/ui/separator";
import { Label } from "@/dashboard/Innovator/components/ui/label";
import { MainLayout } from "@/dashboard/component/main-layout";
import { ChangePasswordDialog } from "@/dashboard/Innovator/components/modals/change-password-dialog";
import { UploadImageDialog } from "@/dashboard/Innovator/components/modals/upload-image-dialog";
import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime";
import tick from "@/assets/tick.png";
import { IdentityVerificationDialog } from "@/dashboard/ProblemSolver/components/modals/IdentityVerificationDialogue";
import { Textarea } from "@/dashboard/Innovator/components/ui/textarea";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { EditableSection } from "@/dashboard/ProblemSolver/components/modals/EditableSection";
import { EducationEntry } from "@/dashboard/ProblemSolver/components/modals/EducationEntry";
import { CertificationEntry } from "@/dashboard/ProblemSolver/components/modals/CertificationEntry";
import ReauthenticateDialog from "@/dashboard/Client/components/Reauthenticatedialog";
import EditableField from "@/dashboard/Client/components/EditableField";
import Select from "react-select";
import { WorkExperienceEntry } from "@/dashboard/Advisor/components/modals/WorkExperienceEntry";
import { useUserService, NotificationPreferences } from "@/hooks/userService";

const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" },
];

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    expertise: Yup.string().required("Expertise is required"),
    specialties: Yup.array()
        .max(3, "Maximum 3 specialties allowed")
        .required("At least one specialty is required"),
    languages: Yup.array().min(1, "At least one language is required"),
    bio: Yup.string().max(300, "Maximum 300 characters").required("Bio is required"),
});

export default function ProfilePage() {
    const {
        user,
        authLoading,
        authError,
        updateProfile,
        refreshProfile,
        uploadProfilePicture,
        profileLoading,
        profileError,
        notificationPreferences,
        updateNotificationPreferences,
        notificationLoading,
    } = useUserService();

    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isGetVerifiedDialogueOpen, setIsGetVerifiedDialogueOpen] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    // === Formik setup ===
    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
            industry: user?.industry || "",
            skills: Array.isArray(user?.skills) ? user.skills : [],
            expertise: user?.expertise || "",
            specialties: Array.isArray(user?.specialties) ? user.specialties : [],
            languages: Array.isArray(user?.languages) ? user.languages : [],
            experience: user?.experience || "",
            portfolio: user?.portfolio || "",
            advisorType: user?.advisorType || "",
            reason: Array.isArray(user?.reason) ? user.reason : [],
            experienceLevel: user?.experienceLevel || "",
        },
        enableReinitialize: true, // important: syncs with latest `user`
        validationSchema,
        onSubmit: async (values) => {
            try {
                await updateProfile(values);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } catch (error: any) {
                toast.error(error.message || "Failed to update profile");
            }
        },
    });

    const handleSave = () => {
        formik.handleSubmit();
    };

    const handleCancel = () => {
        formik.resetForm();
        setIsEditing(false);
    };

    const handleNotificationUpdate = async (key: keyof NotificationPreferences, value: boolean) => {
        try {
            await updateNotificationPreferences({ [key]: value });
            toast.success("Notification preferences updated");
        } catch (error: any) {
            toast.error(error.message || "Failed to update notification preferences");
        }
    };

    // Loading and error states
    if (authLoading || profileLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading profile...</p>
                </div>
            </MainLayout>
        );
    }

    if (authError || profileError) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-600">Error: {authError || profileError}</p>
                    <button onClick={() => refreshProfile()} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
                        Retry
                    </button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 md:p-6 px-3">
                {/* === Header === */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                    {!isEditing ? (
                        <Button onClick={() => setShowAuthDialog(true)} variant="outline" className="text-emerald-600">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleCancel} variant="outline" size="sm">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="dashbutton" size="sm">
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>

                {/* === Profile Info === */}
                <Card className="p-6">
                    <h2 className="mb-6 text-lg font-semibold">Profile Information</h2>

                    {/* Example field */}
                    <EditableField
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={(v) => formik.setFieldValue("firstName", v)}
                        isEditing={isEditing}
                    />

                    <EditableField
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={(v) => formik.setFieldValue("lastName", v)}
                        isEditing={isEditing}
                    />

                    <EditableField
                        label="Email"
                        value={formik.values.email}
                        onChange={(v) => formik.setFieldValue("email", v)}
                        isEditing={isEditing}
                        inputType="email"
                    />

                    <div className="mt-4">
                        <Label>Phone</Label>
                        {isEditing ? (
                            <PhoneInput
                                country="us"
                                value={formik.values.phone}
                                onChange={(phone) => formik.setFieldValue("phone", phone)}
                            />
                        ) : (
                            <p>{formik.values.phone || "Not set"}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <Label>Bio</Label>
                        {isEditing ? (
                            <Textarea
                                value={formik.values.bio}
                                onChange={(e) => formik.setFieldValue("bio", e.target.value)}
                                maxLength={300}
                            />
                        ) : (
                            <p>{formik.values.bio || "No bio yet"}</p>
                        )}
                    </div>
                </Card>

                {/* === Notifications === */}
                <Card className="p-6">
                    <h2 className="mb-6 text-lg font-semibold">Notification Preferences</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Email Notifications</Label>
                            <Switch
                                checked={notificationPreferences?.emailNotifications || false}
                                onCheckedChange={(v) => handleNotificationUpdate("emailNotifications", v)}
                                disabled={notificationLoading}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label>New Messages</Label>
                            <Switch
                                checked={notificationPreferences?.newMessages || false}
                                onCheckedChange={(v) => handleNotificationUpdate("newMessages", v)}
                                disabled={notificationLoading}
                            />
                        </div>
                    </div>
                </Card>

                {/* === Security === */}
                <Card className="p-6">
                    <h2 className="mb-6 text-lg font-semibold">Security Settings</h2>
                    <Button variant="outline" className="w-full" onClick={() => setIsPasswordDialogOpen(true)}>
                        Change Password
                    </Button>
                </Card>

                {/* === Modals === */}
                <ReauthenticateDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} onSuccess={() => setIsEditing(true)} />
                <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} />
                <UploadImageDialog
                    isOpen={isUploadDialogOpen}
                    onClose={() => setIsUploadDialogOpen(false)}
                    onImageUploaded={() => refreshProfile()}
                    uploadFunction={uploadProfilePicture}
                    isUpLoading={profileLoading}
                />
                <IdentityVerificationDialog isOpen={isGetVerifiedDialogueOpen} onClose={() => setIsGetVerifiedDialogueOpen(false)} />
            </div>
        </MainLayout>
    );
}
