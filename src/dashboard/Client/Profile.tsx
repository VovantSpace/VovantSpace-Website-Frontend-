import {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Camera, Edit2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Switch} from "@/dashboard/Innovator/components/ui/switch";
import {Label} from "@/dashboard/Innovator/components/ui/label";
import {Separator} from "@/dashboard/Innovator/components/ui/separator";
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout";
import {ChangePasswordDialog} from "@/dashboard/Innovator/components/modals/change-password-dialog";
import {UploadImageDialog} from "@/dashboard/Innovator/components/modals/upload-image-dialog";
import notificationService from '@/hooks/notificationService'
import {toast} from "react-hot-toast";
import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime";
import ReauthenticateDialog from "@/dashboard/Client/components/Reauthenticatedialog";
import tick from "@/assets/tick.png";
import {useNotifications} from "@/hooks/useNotifications"
import {useAuth} from "@/context/AuthContext";
import api from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Expertise → Specialties
const EXPERTISE_SPECIALTIES = {
    "Business & Entrepreneurship": [
        "Startup Growth & Scaling",
        "Leadership & Executive Coaching",
        "Business Strategy",
        "Marketing & Branding",
        "Product Development",
        "Fundraising & Venture Capital",
        "Sales & Client Acquisition",
        "E-commerce",
    ],
    "Mental Health & Therapy": [
        "Anxiety & Stress Management",
        "Depression & Emotional Well-being",
        "Family & Relationship Counseling",
        "Trauma & PTSD Support",
    ],
    "Career Coaching & Personal Development": [
        "Resume & LinkedIn Optimization",
        "Interview Preparation",
        "Public Speaking & Communication",
        "Confidence & Motivation Coaching",
        "Work-Life Balance",
    ],
    "Technology & Software Development": [
        "Software Engineering",
        "Data Science & Analytics",
        "Cybersecurity & Ethical Hacking",
        "Blockchain & Web3 Development",
        "UI/UX Design",
    ],
    "Finance, Investing & Wealth Management": [
        "Personal Finance",
        "Investing & Stock Market Strategies",
        "Cryptocurrency & Blockchain Investments",
        "Real Estate Investing",
        "Tax Planning",
    ],
};

type NotificationPreferences = {
    emailNotifications: boolean;
    challengeUpdates: boolean;
    newMessages: boolean;
}

const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email"),
    phone: Yup.string(),
    advisorType: Yup.string().required("Please select a preferred advisor/mentor type"),
    reason: Yup.array().min(1, "Select at least one reason").max(3, "Select up to 3 reasons"),
});

export default function ClientProfilePage() {
    const {user, authLoading, authError, refreshProfile} = useAuth()
    const {notifications, loading: notificationsLoading} = useNotifications(
        user?.role === "Advisor/Mentor" ? "mentor" :
            user?.role === "Innovator" ? "innovator" :
                "mentee"
    )

    const [profileLoading, setProfileLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState<any>(null)

    type ProfileFormValues = {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        country: string;
        timeZone: string;
        advisorType: string;
        reason: string[]
    }

    // --- Formik Setup ---
    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            country: user?.country || "",
            timeZone: user?.timeZone || "",
            advisorType: user?.advisorType || "",
            reason: Array.isArray(user?.reason) ? user.reason : [],
        },
        validationSchema,
        onSubmit: async (values, {setSubmitting}) => {
            console.log("Form submission triggered with values:", values)
            try {
                const payload = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    advisorType: values.advisorType,
                    reason: values.reason,
                    country: values.country,
                    timeZone: values.timeZone,

                    // Preserve the rest of the user's data
                    bio: user?.bio || "",
                    industry: user?.industry || "",
                    organization: user?.organization || "",
                    website: user?.website || "",
                    linkedin: user?.linkedin || "",
                    skills: user?.skills || [],
                    experience: user?.experience || "",
                    portfolio: user?.portfolio || "",
                    expertise: user?.expertise || "",
                    specialties: user?.specialties || [],
                    languages: user?.languages || [],
                    experienceLevel: user?.experienceLevel || "",
                    education: user?.education || [],
                    certifications: user?.certification || [],
                    workExperience: user?.workExperience || [],
                };

                console.log("Submitting updated profile:", payload);
                //const updatedUser = await updateProfile(payload);

                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } catch (err: any) {
                console.error("Error updating profile:", err);
                toast.error(err.message || "Failed to update profile");
            } finally {
                setSubmitting(false);
            }
        },
    });


    // --- Load user data into form ---
    useEffect(() => {
        if (user && !isEditing) {
            formik.setValues({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                country: user.country || "",
                timeZone: user.timeZone || "",
                advisorType: user.advisorType || "",
                reason: Array.isArray(user.reason) ? user.reason : [],
            });
        }
    }, [user]);

    const getUserInitials = () => {
        if (!user?.firstName || !user?.lastName) return "U";
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };


    const uploadProfilePicture = async (file: File) => {
        try {
            setProfileLoading(true)

            const formData = new FormData();
            formData.append('image', file);

            const res = await api.post('/user/profile-picture', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            return res.data?.imageUrl

            // toast.success("Profile picture updated")
            // await refreshProfile()
        } catch (err)  {
            console.error(err)
            toast.error("Failed to upload profile picture")
        } finally {
            setProfileLoading(false)
        }
    }

    // Function that handles notification update
    const handleNotificationUpdate = async (key: string, value: boolean) => {
        const updated = await notificationService.updateNotificationPreferences({
            ...notificationPreferences,
            [key]: value,
        })

        setNotificationPreferences(updated)
    }

    useEffect(() => {
        console.log("Formik initialized")
    }, [formik]);

    const NOTIFICATION_OPTIONS: {
        label: string;
        desc: string;
        key: keyof NotificationPreferences;
    }[] = [
        {
            label: "Email Notifications",
            desc: "Receive important updates about your session via email",
            key: "emailNotifications",
        },
        {
            label: "Session Updates",
            desc: "Receive updates about your Sessions",
            key: "challengeUpdates",
        },
        {
            label: "New Messages",
            desc: "Receive updates about new messages",
            key: "newMessages",
        },
    ];


    return (

        <MainLayout>
            <div className="min-h-screen bg-[#EAF5F1] p-6 space-y-8">
                {/* ---------- PROFILE CARD ---------- */}
                <Card className="bg-[#EAF5F1] border-none shadow-none p-6 space-y-6">
                    <h2 className="text-xl font-bold text-black mb-4">Profile Information</h2>

                    {/* Profile Header */}
                    {/* ---------- PROFILE HEADER + FORM ---------- */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-5 mb-6">
                            <div className="relative">
                                <div
                                    className="h-24 w-24 rounded-full bg-[#00BF8F] flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.profilePicture ? (
                                        <img
                                            src={`${API_BASE_URL}${user.profilePicture}`}
                                            alt=""
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        getUserInitials()
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    size="icon"
                                    className="absolute bottom-0 right-0 bg-black rounded-full"
                                    onClick={() => setIsUploadDialogOpen(true)}
                                >
                                    <Camera className="h-4 w-4 text-white"/>
                                </Button>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-black">
                                        {formik.values.firstName} {formik.values.lastName}
                                    </h3>
                                    <div
                                        className="flex items-center text-xs gap-1 border border-gray-500 rounded-full px-2 py-0.5 cursor-pointer"
                                        onClick={() => toast("Verification pending")}
                                    >
                                        <img src={tick} alt="Tick" className="w-4"/>
                                        <span className="font-semibold text-gray-700">Get verified</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{formik.values.email}</p>
                            </div>

                            {!isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="ml-auto border-[#00BF8F] text-[#00BF8F] rounded-full px-3"
                                    onClick={() => setShowAuthDialog(true)}
                                >
                                    <Edit2 className="h-4 w-4"/>
                                </Button>
                            )}
                            {isEditing && (
                                <div className="ml-auto flex gap-2">
                                    {/* ✅ Cancel button – force native behavior */}
                                    <Button
                                        asChild={false}
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>

                                    {/* ✅ Save button – force native button + Formik submit */}
                                    <Button
                                        className="bg-[#00BF8F] text-white"
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        onClick={(e) => {
                                            console.log("Save button clicked");
                                            console.log("Form is submitting:", formik.isSubmitting);
                                            console.log("Form values:", formik.values);
                                            console.log("Form errors:", formik.errors);
                                            console.log("Form is valid:", formik.isValid);
                                        }}

                                    >
                                        {formik.isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Profile Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>First Name</Label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps("firstName")}
                                    disabled={!isEditing}
                                    className="w-full mt-1 border rounded-lg p-2 bg-white"
                                />
                            </div>
                            <div>
                                <Label>Last Name</Label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps("lastName")}
                                    disabled={!isEditing}
                                    className="w-full mt-1 border rounded-lg p-2 bg-white"
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <input
                                    type="email"
                                    {...formik.getFieldProps("email")}
                                    disabled
                                    className="w-full mt-1 border rounded-lg p-2 bg-white"
                                />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps("phone")}
                                    disabled={!isEditing}
                                    className="w-full mt-1 border rounded-lg p-2 bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <CountryandTime disable={!isEditing} flex=""/>
                        </div>

                        {/* Advisor Type */}
                        <div>
                            <Label>Preferred Advisor/Mentor Type</Label>
                            <select
                                {...formik.getFieldProps("advisorType")}
                                disabled={!isEditing}
                                onChange={(e) => {
                                    formik.setFieldValue("advisorType", e.target.value);
                                    formik.setFieldValue("reason", []);
                                }}
                                className="w-full mt-1 border rounded-lg p-2 bg-white"
                            >
                                <option value="">Select Preferred Advisor/Mentor Type</option>
                                {Object.keys(EXPERTISE_SPECIALTIES).map((key) => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reason for Joining */}
                        <div>
                            <Label className="block mb-2">Reason for Joining (Select up to 3)</Label>
                            {formik.values.advisorType ? (
                                <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg border border-gray-200">
                                    {(EXPERTISE_SPECIALTIES[
                                        formik.values.advisorType as keyof typeof EXPERTISE_SPECIALTIES
                                        ] ?? []).map((specialty) => {
                                        const isSelected = formik.values.reason.includes(specialty);
                                        return (
                                            <button
                                                key={specialty}
                                                type="button"
                                                disabled={!isEditing}
                                                onClick={() => {
                                                    let updated = [...formik.values.reason];
                                                    if (isSelected) {
                                                        updated = updated.filter((r) => r !== specialty);
                                                    } else if (updated.length < 3) {
                                                        updated.push(specialty);
                                                    } else {
                                                        toast.error("You can select up to 3 options");
                                                        return;
                                                    }
                                                    formik.setFieldValue("reason", updated);
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                                    isSelected
                                                        ? "bg-[#00BF8F] text-white border-[#00BF8F]"
                                                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                                                } ${!isEditing ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                                            >
                                                {specialty}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm mt-1 italic">
                                    Select Preferred Advisor/Mentor Type first
                                </p>
                            )}
                        </div>
                    </form>
                </Card>

                {/* ---------- SECURITY SETTINGS ---------- */}
                <Card className="bg-[#EAF5F1] border-none p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Security Settings</h2>
                    <Button
                        variant="outline"
                        className="w-full text-left border"
                        onClick={() => setIsPasswordDialogOpen(true)}
                    >
                        Change Password
                        <span className="ml-auto text-gray-400">••••••••</span>
                    </Button>
                </Card>

                {/* ---------- NOTIFICATIONS ---------- */}
                {/* ---------- NOTIFICATIONS ---------- */}
                <Card className="bg-[#EAF5F1] border-none p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-black">
                        Notification Preferences
                    </h2>

                    {NOTIFICATION_OPTIONS.map((n) => (
                        <div key={n.key} className="flex items-center justify-between">
                            <div>
                                <Label className="text-black">{n.label}</Label>
                                <p className="text-sm text-gray-600">{n.desc}</p>
                            </div>

                            <Switch
                                checked={notificationPreferences?.[n.key] ?? false}
                                onCheckedChange={(checked) =>
                                    handleNotificationUpdate(n.key, checked)
                                }
                                disabled={notificationsLoading}
                            />
                        </div>
                    ))}

                    <Separator className="bg-gray-300" />
                </Card>


                {/* ---------- DIALOGS ---------- */}
                <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}/>
                <UploadImageDialog
                    isOpen={isUploadDialogOpen}
                    onClose={() => setIsUploadDialogOpen(false)}
                    onImageUploaded={() => refreshProfile()}
                    uploadFunction={uploadProfilePicture}
                    isUpLoading={profileLoading}
                />
                <ReauthenticateDialog
                    isOpen={showAuthDialog}
                    onClose={() => setShowAuthDialog(false)}
                    onSuccess={() => setIsEditing(true)}
                />
            </div>
        </MainLayout>
    );
}