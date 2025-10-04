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
                            {/* Skill / Expertise */}
                            <div className="mt-6 space-y-2">
                                <Label className="dashtext">Skill / Expertise</Label>

                                {isEditing ? (
                                    <>
                                        {/* Search box */}
                                        <input
                                            type="text"
                                            placeholder="Search skills..."
                                            className="w-full border rounded-lg p-2 mb-2 text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />

                                        {/* Scrollable list */}
                                        <div className="border rounded-lg p-3 h-32 overflow-y-auto bg-white">
                                            {skillsList
                                                .filter((skill) =>
                                                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((skill, index) => (
                                                    <div key={index} className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`skill-${index}`}
                                                            className="mr-2 cursor-pointer"
                                                            checked={formik.values.expertise === skill}
                                                            onChange={() => {
                                                                const newSkill =
                                                                    formik.values.expertise === skill ? "" : skill;
                                                                formik.setFieldValue("expertise", newSkill);
                                                                setTempProfileData((p) => ({
                                                                    ...p,
                                                                    expertise: newSkill
                                                                }));
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`skill-${index}`}
                                                            className="text-gray-700 text-sm cursor-pointer"
                                                        >
                                                            {skill}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Show selected skill */}
                                        {formik.values.expertise && (
                                            <div className="mt-3">
                                                <h3 className="text-sm font-semibold mb-1">Selected Skill:</h3>
                                                <span
                                                    className="bg-green-700 text-white px-3 py-1 text-sm rounded-xl inline-flex items-center gap-2">
            {formik.values.expertise}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            formik.setFieldValue("expertise", "");
                                                            setTempProfileData((p) => ({...p, expertise: ""}));
                                                        }}
                                                        className="text-white hover:text-red-200 text-lg leading-none"
                                                    >
              ×
            </button>
          </span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                                        {tempProfileData.expertise || "Select your skill/expertise"}
                                    </p>
                                )}

                                {formik.touched.expertise && formik.errors.expertise && (
                                    <p className="text-sm text-red-500">{formik.errors.expertise}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="mt-6 space-y-2">
                                <Label className="dashtext">Years of Experience</Label>
                                {isEditing ? (
                                    <select
                                        className="w-full border rounded-lg p-2 text-sm"
                                        value={formik.values.experienceLevel}
                                        onChange={(e) => formik.setFieldValue("experienceLevel", e.target.value)}
                                    >
                                        <option value="">Select experience level</option>
                                        <option value="0-1 years">0-1 years</option>
                                        <option value="1-3 years">1-3 years</option>
                                        <option value="4-6 years">4-6 years</option>
                                        <option value="7-10 years">7-10 years</option>
                                        <option value="10+ years">10+ years</option>
                                    </select>
                                ) : (
                                    <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                                        {formik.values.experienceLevel || "Select your experience level"}
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

                    {/* ===================== Education ===================== */}
                    <Card className="secondbg p-6 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold dashtext">Education</h2>
                            {isEditing && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-emerald-600 border-emerald-600"
                                    onClick={() => {
                                        const newEdu = {
                                            institution: "",
                                            degree: "",
                                            field: "",
                                            startDate: "",
                                            endDate: "",
                                        };
                                        const updated = [...(formik.values.education || []), newEdu];
                                        formik.setFieldValue("education", updated);
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>

                        {formik.values.education && formik.values.education.length > 0 ? (
                            formik.values.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="border rounded-md p-4 mb-3 flex flex-col md:flex-row md:justify-between md:gap-6"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">Institution:</p>
                                        {isEditing ? (
                                            <input
                                                className="border rounded p-1 text-sm w-full"
                                                value={edu.institution}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        `education[${index}].institution`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{edu.institution || "Not specified"}</p>
                                        )}

                                        <p className="font-semibold mt-2">Field:</p>
                                        {isEditing ? (
                                            <input
                                                className="border rounded p-1 text-sm w-full"
                                                value={edu.field}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`education[${index}].field`, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <p>{edu.field || "Not specified"}</p>
                                        )}

                                        <p className="font-semibold mt-2">End Date:</p>
                                        {isEditing ? (
                                            <input
                                                type="month"
                                                className="border rounded p-1 text-sm w-full"
                                                value={edu.endDate}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`education[${index}].endDate`, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <p>{edu.endDate || "Not specified"}</p>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">Degree:</p>
                                        {isEditing ? (
                                            <input
                                                className="border rounded p-1 text-sm w-full"
                                                value={edu.degree}
                                                onChange={(e) =>
                                                    formik.setFieldValue(`education[${index}].degree`, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <p>{edu.degree || "Not specified"}</p>
                                        )}

                                        <p className="font-semibold mt-2">Start Date:</p>
                                        {isEditing ? (
                                            <input
                                                type="month"
                                                className="border rounded p-1 text-sm w-full"
                                                value={edu.startDate}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        `education[${index}].startDate`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{edu.startDate || "Not specified"}</p>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 mt-2 md:mt-0"
                                            onClick={() => {
                                                const filtered = formik.values.education.filter((_, i) => i !== index);
                                                formik.setFieldValue("education", filtered);
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No education details added yet.</p>
                        )}
                    </Card>

                    {/* ===================== Certifications ===================== */}
                    <Card className="secondbg p-6 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold dashtext">Certifications</h2>
                            {isEditing && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-emerald-600 border-emerald-600"
                                    onClick={() => {
                                        const newCert = {
                                            certificationName: "",
                                            issuingOrganization: "",
                                            dateObtained: "",
                                        };
                                        const updated = [...(formik.values.certifications || []), newCert];
                                        formik.setFieldValue("certifications", updated);
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>

                        {formik.values.certifications && formik.values.certifications.length > 0 ? (
                            formik.values.certifications.map((cert, index) => (
                                <div
                                    key={index}
                                    className="border rounded-md p-4 mb-3 flex flex-col md:flex-row md:justify-between md:gap-6"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">Certification Name:</p>
                                        {isEditing ? (
                                            <input
                                                className="border rounded p-1 text-sm w-full"
                                                value={cert.certificationName}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        `certifications[${index}].certificationName`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{cert.certificationName || "Not specified"}</p>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">Issuing Organization:</p>
                                        {isEditing ? (
                                            <input
                                                className="border rounded p-1 text-sm w-full"
                                                value={cert.issuingOrganization}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        `certifications[${index}].issuingOrganization`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{cert.issuingOrganization || "Not specified"}</p>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">Date Obtained:</p>
                                        {isEditing ? (
                                            <input
                                                type="month"
                                                className="border rounded p-1 text-sm w-full"
                                                value={cert.dateObtained}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        `certifications[${index}].dateObtained`,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{cert.dateObtained || "Not specified"}</p>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 mt-2 md:mt-0"
                                            onClick={() => {
                                                const filtered = formik.values.certifications.filter((_, i) => i !== index);
                                                formik.setFieldValue("certifications", filtered);
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No certifications added yet.</p>
                        )}
                    </Card>

                    {/* ===================== Portfolio ===================== */}
                    <Card className="secondbg p-6 mt-6">
                        <h2 className="text-lg font-semibold dashtext mb-3">Portfolio</h2>
                        {isEditing ? (
                            <input
                                type="url"
                                placeholder="https://github.com/username"
                                className="w-full border rounded p-2"
                                value={formik.values.portfolio || ""}
                                onChange={(e) => formik.setFieldValue("portfolio", e.target.value)}
                            />
                        ) : (
                            <p className="text-sm py-2 px-3 rounded-md bg-white text-black">
                                {formik.values.portfolio || "Add a portfolio or GitHub link"}
                            </p>
                        )}
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