import {useState, useEffect} from "react"
import {Camera, Edit2} from "lucide-react";
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Switch} from "@/dashboard/Innovator/components/ui/switch"
import {Separator} from "@/dashboard/Innovator/components/ui/separator"
import {Label} from "@/dashboard/Innovator/components/ui/label"
import {MainLayout} from "@/dashboard/ProblemSolver/components/layout/main-layout";
import {ChangePasswordDialog} from "@/dashboard/Innovator/components/modals/change-password-dialog"
import {UploadImageDialog} from "@/dashboard/Innovator/components/modals/upload-image-dialog"
import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime"
import tick from '@/assets/tick.png'
import {IdentityVerificationDialog} from "@/dashboard/ProblemSolver/components/modals/IdentityVerificationDialogue"
import {Textarea} from "@/dashboard/Innovator/components/ui/textarea"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {toast} from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import ReauthenticateDialog from "@/dashboard/Client/components/Reauthenticatedialog";
import EditableField from "@/dashboard/Client/components/EditableField";
import {useUserService, NotificationPreferences} from '@/hooks/userService'

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    industry: string;
    skills: string[];
    expertise: string;
    specialties: string[];
    languages: string[];
    experience?: string;
    portfolio?: string;
    advisorType?: string;
    reason?: string[];
    experienceLevel?: string;
    education?: string[];
}

const industry = [
    "Healthcare",
    "Education",
    "Engineering",
    "Manufacturing",
    "Energy & Sustainability",
    "Media & Entertainment",
    "Retail & E-commerce",
    "Transportation",
    "Agriculture",
    "Real Estate",
    "Social Impact",
    "Government & Public Policy"
];

const languageOptions = [
    {value: 'English', label: 'English'},
    {value: 'Spanish', label: 'Spanish'},
    {value: 'French', label: 'French'},
    {value: 'German', label: 'German'},
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    expertise: Yup.string().required('Expertise is required'),
    specialties: Yup.array()
        .max(3, 'Maximum 3 specialties allowed')
        .required('At least one specialty is required'),
    languages: Yup.array().min(1, 'At least one language is required'),
    experience: Yup.string(),
    skills: Yup.array()
        .of(Yup.string())
});


export default function ProfilePage() {
    const {
        user,
        isAuthenticated,
        authLoading,
        authError,
        updateProfile,
        refreshProfile,
        uploadProfilePicture,
        updateUserRole,
        profileLoading,
        profileError,
        notificationPreferences,
        updateNotificationPreferences,
        notificationsLoading
    } = useUserService()

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isGetVerifiedDialogueOpen, setIsGetVerifiedDialogueOpen] = useState(false)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingEducation, setIsEditingEducation] = useState(false)
    const [isEditingCertification, setIsEditingCertification] = useState(false)
    const [isEditingExperience, setIsEditingExperience] = useState(false)
    const [tempEducations, setTempEducations] = useState<any[]>([])
    const [tempCertifications, setTempCertifications] = useState<any[]>([])
    const [workExperiences, setWorkExperiences] = useState<any[]>([])
    const [tempProfileData, setTempProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        industry: "",
        organization: "",
        website: "",
        linkedin: "",
        skills: [] as string[],
        experience: "",
        portfolio: "",
        expertise: "",
        specialties: [] as string[],
        languages: [] as string[],
        advisorType: "",
        reason: [] as string[],
        experienceLevel: ""
    })

    const [originalProfileData, setOriginalProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        industry: "",
        organization: "",
        website: "",
        linkedin: "",
        skills: [] as string[],
        experience: "",
        portfolio: "",
        expertise: "",
        specialties: [] as string[],
        languages: [] as string[],
        advisorType: "",
        reason: [] as string[],
        experienceLevel: "",
    })

    const [selectedSkill, setSelectedSkill] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const formik = useFormik<FormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            expertise: '',
            skills: [],
            specialties: [],
            experienceLevel: '',
            portfolio: '',
            languages: [],
            bio: '',
            advisorType: '',
            reason: [],
            industry: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await handleSave()
                setIsEditing(false)
                toast.success('Profile updated successfully!')
            } catch (error: any) {
                console.error('Failed to update Profile:', error)
                toast.error(error.message || "Failed to update Profile")
            }
        }
    });

    // Initialize profile data when user changes
    useEffect(() => {
        if (user) {
            const profileData = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
                industry: user.industry || "",
                organization: user.organization || "",
                website: user.website || "",
                linkedin: user.linkedin || "",
                skills: Array.isArray(user.skills) ? user.skills : (user.skills ? [user.skills] : []),
                experience: user.experience || "",
                portfolio: user.portfolio || "",
                expertise: user.expertise || "",
                specialties: Array.isArray(user.specialties) ? user.specialties : [],
                languages: Array.isArray(user.languages) ? user.languages : [],
                advisorType: user.advisorType || "",
                reason: Array.isArray(user.reason) ? user.reason : [],
                experienceLevel: user.experienceLevel || "",
            }

            setTempProfileData(profileData);
            setOriginalProfileData(profileData);
            setTempEducations(user.education || []);
            setTempCertifications(user.certification || []);
            setWorkExperiences(user.workExperience || []);

            // Update formik values directly
            formik.setValues({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                phone: profileData.phone,
                bio: profileData.bio,
                industry: profileData.industry,
                skills: profileData.skills,
                expertise: profileData.expertise,
                specialties: profileData.specialties,
                languages: profileData.languages,
                experience: profileData.experience,
                portfolio: profileData.portfolio,
                advisorType: profileData.advisorType,
                reason: profileData.reason,
                experienceLevel: profileData.experienceLevel,
            });
        }
    }, [user])

    // Handle Save
    const handleSave = async () => {
        try {
            console.log('handleSave called'); // Debug log

            // Use formik's validateForm method (returns Promise<FormikErrors>)
            const errors = await formik.validateForm();

            if (Object.keys(errors).length > 0) {
                console.log('Validation errors:', errors); // Debug log

                // Set all fields as touched to show validation errors
                const touchedFields = Object.keys(errors).reduce((acc, key) => ({
                    ...acc,
                    [key]: true
                }), {});

                formik.setTouched(touchedFields);
                toast.error('Please fix validation errors before saving');
                return;
            }

            const profileUpdateData = {
                firstName: tempProfileData.firstName,
                lastName: tempProfileData.lastName,
                email: tempProfileData.email,
                phone: tempProfileData.phone,
                bio: tempProfileData.bio,
                industry: tempProfileData.industry,
                organization: tempProfileData.organization,
                website: tempProfileData.website,
                linkedin: tempProfileData.linkedin,
                skills: formik.values.skills || [],
                experience: formik.values.experience || "",
                portfolio: formik.values.portfolio || "",
                expertise: formik.values.expertise || "",
                specialties: formik.values.specialties || [],
                languages: formik.values.languages || [],
                advisorType: formik.values.advisorType || "",
                reason: formik.values.reason || [],
                experienceLevel: formik.values.experienceLevel || "",
                education: tempEducations || [],
                certification: tempCertifications || [],
                workExperience: workExperiences || [],
            };

            console.log('Saving profile data:', profileUpdateData); // Debug log

            const updatedUser = await updateProfile(profileUpdateData);

            // Update original data after successful save
            const updatedProfileData = {
                firstName: tempProfileData.firstName,
                lastName: tempProfileData.lastName,
                email: tempProfileData.email,
                phone: tempProfileData.phone,
                bio: tempProfileData.bio,
                industry: tempProfileData.industry,
                organization: tempProfileData.organization,
                website: tempProfileData.website,
                linkedin: tempProfileData.linkedin,
                skills: formik.values.skills || [],
                experience: formik.values.experience || "",
                portfolio: formik.values.portfolio || "",
                expertise: formik.values.expertise || "",
                specialties: formik.values.specialties || [],
                languages: formik.values.languages || [],
                advisorType: formik.values.advisorType || "",
                reason: formik.values.reason || [],
                experienceLevel: formik.values.experienceLevel || "",
            };

            setOriginalProfileData(updatedProfileData);
            setIsEditing(false);
            toast.success('Profile updated successfully!');

        } catch (error) {
            console.error('Failed to update Profile:', error);

            let errorMessage = 'Failed to update profile';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            toast.error(errorMessage);
        }
    };

    const handleImageUploaded = (imageUrl: string) => {
        toast.success("Profile Picture updated successfully")
        refreshProfile()
    }

    const handleSkillSelection = (skill: string) => {
        setSelectedSkill(prev => prev === skill ? '' : skill);
    };


    const handleAuthSuccess = () => {
        setIsEditing(true)
        setShowAuthDialog(false)
    }


    const handleCancel = () => {
        setIsEditing(false)
        // Reset both tempProfileData and formik to original data
        setTempProfileData(originalProfileData)
        if (user) {
            formik.resetForm({
                values: {
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    bio: user.bio || "",
                    industry: user.industry || "",
                    skills: Array.isArray(user.skills) ? user.skills : (user.skills ? [user.skills] : []),
                    expertise: user.expertise || "",
                    specialties: Array.isArray(user.specialties) ? user.specialties : [],
                    languages: Array.isArray(user.languages) ? user.languages : [],
                    experience: user.experience || "",
                    portfolio: user.portfolio || "",
                    advisorType: user.advisorType || "",
                    reason: Array.isArray(user.reason) ? user.reason : [],
                    experienceLevel: user.experienceLevel || "",
                }
            })
        }

        setTempEducations(user?.education || [])
        setTempCertifications(user?.certification || [])
        setWorkExperiences(user?.workExperience || [])
    }

    // Loading states and error handling
    if (authLoading || profileLoading) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center min-h-screen'}>
                    <div className={'text-center'}>
                        <div
                            className={'animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto'}></div>
                        <p className={'mt-4 text-gray-600'}>Loading profile...</p>
                    </div>
                </div>
            </MainLayout>
        )
    }

    if (authError || profileError) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center min-h-screen'}>
                    <div className={'text-center'}>
                        <p className={'text-red-600'}>Error: {authError || profileError}</p>
                        <button
                            onClick={() => refreshProfile()}
                            className={'mt-4 px-4 py-2 bg-emerald-600 text-white rounded'}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const handleNotificationUpdate = async (key: keyof NotificationPreferences, value: boolean) => {
        try {
            await updateNotificationPreferences({
                [key]: value
            })
            toast.success('Notification preferences updated')
        } catch (error: any) {
            console.error('Failed to update notification preferences:', error)
            toast.error(error.message || "Failed to update notification preferences")
        }
    }

    const getUserInitials = () => {
        if (!user?.firstName || !user?.lastName) return "U"
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
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
                                <Edit2 className="h-4 w-4"/>
                            </Button>
                        )}
                        {isEditing && (
                            <div className="flex justify-end gap-2 relative sm:bottom-0 bottom-14 left-7">
                                <Button variant="outline" onClick={handleCancel} size="sm">
                                    Cancel
                                </Button>
                                <Button type={'submit'} onClick={handleSave} className='dashbutton' size="sm"
                                        disabled={formik.isSubmitting}>
                                    {formik.isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6">
                    <Card className="secondbg md:p-6 p-3">
                        <h2 className="mb-6 text-lg font-semibold dashtext">Profile Information</h2>
                        <div className="mb-5">
                            {/*Avatar x Name*/}
                            <div className="mb-6 flex items-center md:gap-6 gap-3">
                                <div className="relative">
                                    <div
                                        className=" relative flex h-24 w-24 items-center justify-center rounded-full bg-[#00bf8f] text-3xl dashtext">
                                        {user?.profilePicture ? (
                                            <img src={`${API_BASE_URL}${user.profilePicture}`} alt=""
                                                 className={'h-full w-full object-cover'}/>
                                        ) : (
                                            getUserInitials()
                                        )}
                                    </div>
                                    <Button
                                        size="icon"
                                        className="absolute bottom-0 right-0 rounded-full bg-black"
                                        onClick={() => setIsUploadDialogOpen(true)}
                                    >
                                        <Camera className="h-4 w-4 text-white"/>
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
                                                <img src={tick} alt="Verification Tick" className="w-5"/>
                                                <span className="dark:text-white font-semibold tracking-wide">Get verified</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-left mt-1 dark:text-white">{tempProfileData.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/*Basic Information*/}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-left">
                                <EditableField
                                    label="First Name"
                                    value={tempProfileData.firstName}
                                    onChange={(value) => setTempProfileData(p => ({...p, firstName: value}))}
                                    isEditing={isEditing}
                                />
                                <EditableField
                                    label="Last Name"
                                    value={tempProfileData.lastName}
                                    onChange={(value) => setTempProfileData(p => ({...p, lastName: value}))}
                                    isEditing={isEditing}
                                />
                                <EditableField
                                    label="Email"
                                    value={tempProfileData.email}
                                    onChange={(value) => setTempProfileData(p => ({...p, email: value}))}
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
                                                setTempProfileData((p) => ({...p, phone}))
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

                            {/*Country and Time*/}
                            <div className="mt-5">
                                <CountryandTime disable={!isEditing} flex={''}/>
                            </div>


                            {/* Expertise */}
                            <div className="mt-5 space-y-2">
                                <Label className={'dashtext'}>Industry</Label>
                                {isEditing ? (
                                    <select
                                        className={'w-full border rounded-lg p-2 text-sm'}
                                        value={formik.values.industry}
                                        onChange={(e) => {
                                            formik.setFieldValue("industry", e.target.value);
                                            setTempProfileData((p) => ({
                                                ...p,
                                                industry: e.target.value
                                            }))
                                        }}
                                    >
                                        <option value="">Select Industry</option>
                                        {industry.map((ind) => (
                                            <option key={ind} value={ind}>
                                                {ind}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className={'text-sm py-2 px-3 rounded-md bg-white text-black'}>
                                        {tempProfileData.industry || "Select your industry"}
                                    </p>
                                )}
                            </div>

                            {/*Organization*/}
                            <div className={'mt-5 space-y-2'}>
                                <EditableField
                                    label={'Organization'}
                                    value={tempProfileData.organization}
                                    onChange={(value) => setTempProfileData((p) => ({...p, organization: value}))}
                                    isEditing={isEditing}
                                />
                            </div>

                            {/*Bio*/}
                            <div className="mt-6">
                                <div className="space-y-2">
                                    <Label className="dashtext">Short Bio/About You (Max 300 Characters)</Label>
                                    {isEditing ? (
                                        <>
                                            <Textarea
                                                value={tempProfileData.bio}
                                                onChange={(e) => setTempProfileData(p => ({...p, bio: e.target.value}))}
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

                    {/*Security Settings*/}
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
                                    <p className="text-sm text-gray-400">Receive important updates about your session
                                        via email</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.emailNotifications || false}
                                    onCheckedChange={(checked) =>
                                        handleNotificationUpdate('emailNotifications', checked)
                                    }
                                    disabled={notificationsLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">Session Updates</Label>
                                    <p className="text-sm text-gray-400">Receive updates about your Sessions</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.challengeUpdates || false}
                                    onCheckedChange={(checked) => handleNotificationUpdate('challengeUpdates', checked)}
                                    disabled={notificationsLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">New Messages</Label>
                                    <p className="text-sm text-gray-400">Receive updates about new messages</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.newMessages || false}
                                    onCheckedChange={(checked) => handleNotificationUpdate('newMessages', checked)}
                                    disabled={notificationsLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">Marketing Emails</Label>
                                    <p className="text-sm text-gray-400">Receive marketing emails</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.marketingEmails || false}
                                    onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                                    disabled={notificationsLoading}
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
                <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}/>
                <UploadImageDialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)}
                                   onImageUploaded={handleImageUploaded} uploadFunction={uploadProfilePicture}
                                   isUpLoading={profileLoading}/>
                <IdentityVerificationDialog isOpen={isGetVerifiedDialogueOpen}
                                            onClose={() => setIsGetVerifiedDialogueOpen(false)}/>
            </div>
        </MainLayout>
    )
}