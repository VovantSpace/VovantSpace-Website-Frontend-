import {useState, useEffect} from "react"
import {Camera, Edit2, Check, X} from "lucide-react"
import {
    FaChartLine
} from 'react-icons/fa';
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Switch} from "@/dashboard/Innovator/components/ui/switch"
import {Separator} from "@/dashboard/Innovator/components/ui/separator"
import {Label} from "@/dashboard/Innovator/components/ui/label"
import {MainLayout} from "../../../component/main-layout";
import {ChangePasswordDialog} from "@/dashboard/Innovator/components/modals/change-password-dialog"
import {UploadImageDialog} from "@/dashboard/Innovator/components/modals/upload-image-dialog"
import CountryandTime from "@/dashboard/ProblemSolver/pages/profile/CountryandTime"
import tick from '@/assets/tick.png'
import {IdentityVerificationDialog} from "@/dashboard/ProblemSolver/components/modals/IdentityVerificationDialogue"
import {Textarea} from "@/dashboard/Innovator/components/ui/textarea"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/dashboard/Innovator/components/ui/dialog"
import {Link} from "react-router-dom"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {toast} from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {EditableSection} from "@/dashboard/ProblemSolver/components/modals/EditableSection"
import {EducationEntry} from "@/dashboard/ProblemSolver/components/modals/EducationEntry"
import {PortfolioEntry} from "@/dashboard/ProblemSolver/components/modals/PortfolioEntry"
import {CertificationEntry} from "@/dashboard/ProblemSolver/components/modals/CertificationEntry"

import ReauthenticateDialog from "@/dashboard/Client/components/Reauthenticatedialog";
import EditableField from "@/dashboard/Client/components/EditableField";
import Select from "react-select";
import {WorkExperienceEntry} from "../../components/modals/WorkExperienceEntry";
import {useUserService, NotificationPreferences} from '@/hooks/userService'
import {valueContainerCSS} from "react-select/dist/declarations/src/components/containers";

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
    education?: string;
}

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

const EXPERTISE_SPECIALTIES = {
    'Business & Entrepreneurship': [
        'Startup Growth & Scaling',
        'Leadership & Executive Coaching',
        'Business Strategy',
        'Marketing & Branding',
        'Product Development',
        'Fundraising & Venture Capital',
        'Sales & Client Acquisition',
        'E-commerce'
    ],
    'Mental Health & Therapy': [
        'Anxiety & Stress Management',
        'Depression & Emotional Well-being',
        'Cognitive Behavioral Therapy (CBT)',
        'Family & Relationship Counseling',
        'Trauma & PTSD Support',
        'Grief Counseling',
        'Addiction Recovery'
    ],
    'Career Coaching & Personal Development': [
        'Resume & LinkedIn Optimization',
        'Interview Preparation',
        'Salary Negotiation',
        'Public Speaking & Communication',
        'Confidence & Motivation Coaching',
        'Productivity & Time Management',
        'Work-Life Balance'
    ],
    'Technology & Software Development': [
        'Software Engineering (Frontend, Backend, Full-Stack)',
        'Artificial Intelligence (AI) & Machine Learning',
        'Data Science & Analytics',
        'Cybersecurity & Ethical Hacking',
        'Blockchain & Web3 Development',
        'UI/UX Design',
        'Mobile App Development'
    ],
    'Finance, Investing & Wealth Management': [
        'Personal Finance & Budgeting',
        'Investing & Stock Market Strategies',
        'Cryptocurrency & Blockchain Investments',
        'Real Estate Investing',
        'Tax Planning',
        'Retirement Planning'
    ],
    'Relationships': [
        'Dating & Romantic Relationships',
        'Marriage Counseling',
        'Conflict Resolution',
        'Family Relationships'
    ],
    'Life Coaching': [
        'Goal Setting & Achievement',
        'Mindfulness & Meditation',
        'Work-Life Balance',
        'Spiritual Growth'
    ],
    'Cryptocurrency & Blockchain': [
        'Crypto Investing',
        'DeFi (Decentralized Finance)',
        'NFT & Web3 Development',
        'Smart Contracts'
    ],
    'Health, Wellness & Nutrition': [
        'Diet & Nutrition Planning',
        'Weight Loss & Fitness Coaching',
        'Sleep Optimization',
        'Women’s Health',
        'Chronic Illness Management'
    ],
    'Legal & Compliance Consulting': [
        'Business & Corporate Law',
        'Intellectual Property (IP) & Trademarks',
        'Contract Law & Negotiation',
        'Employment & Labor Law',
        'Data Privacy & GDPR Compliance'
    ],
    'Education & Learning': [
        'Study & Exam Preparation',
        'Language Learning',
        'College Admissions & Scholarships',
        'E-learning & Online Course Creation'
    ],
    'Creative & Media Coaching': [
        'Graphic Design & Branding',
        'Content Writing & Copywriting',
        'Video Production & Editing',
        'Social Media Growth',
        'Public Relations & Brand Management'
    ]
} as const;

type ExpertiseKey = keyof typeof EXPERTISE_SPECIALTIES;

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    expertise: Yup.string().required('Expertise is required'),
    specialties: Yup.array()
        .max(3, 'Maximum 3 specialties allowed')
        .required('At least one specialty is required'),
    languages: Yup.array().min(1, 'At least one language is required'),
    bio: Yup.string()
        .max(300, 'Maximum 300 characters')
        .required('Bio is required'),
    experience: Yup.string(),
    skills: Yup.array()
        .of(Yup.string())
});


export default function ProfilePage() {
    const {
        user,
        isAuthenticated,
        loading: authLoading,
        error: authError,
        updateProfile,
        refreshProfile,
        uploadProfilePicture,
        updateUserRole,
        profileLoading,
        profileError,
        notificationPreferences,
        updateNotificationPreferences,
        notificationLoading
    } = useUserService()

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isGetVerifiedDialogueOpen, setIsGetVerifiedDialogueOpen] = useState(false)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingEducation, setIsEditingEducation] = useState(false)
    const [isEditingCertification, setIsEditingCertification] = useState(false)
    const [isEditingExperience, setIsEditingExperience] = useState(false)
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

    const [originalProfileData, setOriginalProfileData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        bio: string;
        industry: string;
        organization: string;
        website: string;
        linkedin: string;
        skills: string[];
        experience: string;
        portfolio: string;
        expertise: string;
        specialties: string[];
        languages: string[];
        advisorType: string;
        reason: string[];
        experienceLevel: string;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        industry: "",
        organization: "",
        website: "",
        linkedin: "",
        skills: [],
        experience: "",
        portfolio: "",
        expertise: "",
        specialties: [],
        languages: [],
        advisorType: "",
        reason: [],
        experienceLevel: ""
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
                await updateProfile(values)
                setIsEditing(false)
                toast.success('Profile updated successfully!')
            } catch (error: any) {
                console.error('Failed to update Profile:', error)
                toast.error(error || "Failed to update Profile:", error)
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

            setTempProfileData(profileData)
            setOriginalProfileData(profileData)

            // Update formik values
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
            })
        }
    }, [user])

    // Handle Save
    const handleSave = async () => {
        try {
            // validate using formik
            const errors = await formik.validateForm()
            if (Object.keys(errors).length > 0) {
                await formik.setTouched(
                    Object.keys(errors).reduce((acc, key) => ({...acc, [key]: true}), {})
                )
                return;
            }

            const profileUpdateData = {
                ...tempProfileData,
                ...formik.values
            }

            await updateProfile(profileUpdateData)
            setIsEditing(false)
            toast.success('Profile updated successfully!')
        }catch (error: any) {
            console.error('Failed to update Profile:', error)
            toast.error(error)
        }
    }

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
    }

    // Loading states and error handling
    if (authLoading || profileLoading) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center min-h-screen'}>
                    <div className={'text-center'}>
                        <div className={'animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto'}></div>
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
                [key]: valueContainerCSS
            })
        }catch (error: any) {
            console.error('Failed to update notification preferences:', error)
            toast.error("Failed to update notification preferences:", error)
        }
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

    const [workExperiences, setWorkExperiences] = useState([
        {
            id: Date.now(),
            company: "AWS Certified Solutions Architect",
            role: "sdf",
            startDate: "asdf",
            endDate: "asdf"
        }
    ]);

    const languageOptions = [
        {value: "English", label: "English"},
        {value: "Spanish", label: "Spanish"},
        {value: "French", label: "French"},
        {value: "German", label: "German"},
        {value: "Chinese", label: "Chinese"},
    ];


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
                                    <div
                                        className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00bf8f] text-3xl dashtext">
                                        VS
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

                            <div className="mt-5">
                                <CountryandTime disable={!isEditing} flex={''}/>
                            </div>


                            {/* Expertise */}
                            <div className="!text-sm space-y-2">
                                <div>
                                    <label
                                        className="block text-gray-700 dark:text-white font-medium my-2 mt-4 text-sm">Expertise</label>
                                    <div className="relative">
                                        <select
                                            className="w-full pl-3 pr-3 py-2 border rounded-lg focus:outline-none "
                                            {...formik.getFieldProps('expertise')}
                                            onChange={e => {
                                                formik.setFieldValue('expertise', e.target.value);
                                                formik.setFieldValue('specialties', []);
                                            }}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Select Expertise</option>
                                            {Object.keys(EXPERTISE_SPECIALTIES).map(expertise => (
                                                <option key={expertise} value={expertise}>{expertise}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 dark:text-white font-medium mb-2 mt-4">Specialties
                                        (Select up to 3)</label>
                                    <div className="flex flex-col space-y-2">
                                        {formik.values.expertise ? (
                                            EXPERTISE_SPECIALTIES[formik.values.expertise as ExpertiseKey]?.map(specialty => (
                                                <label key={specialty}
                                                       className="inline-flex items-center dark:text-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        name="specialties"
                                                        value={specialty}
                                                        disabled={!isEditing}
                                                        checked={formik.values.specialties.includes(specialty)}
                                                        onChange={e => {
                                                            const checked = e.target.checked;
                                                            let newSpecialties = [...formik.values.specialties];
                                                            if (checked) {
                                                                if (newSpecialties.length < 3) {
                                                                    newSpecialties.push(specialty);
                                                                }
                                                            } else {
                                                                newSpecialties = newSpecialties.filter(s => s !== specialty);
                                                            }
                                                            formik.setFieldValue('specialties', newSpecialties);
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    {specialty}
                                                </label>
                                            ))
                                        ) : <span className="dark:text-gray-300 ml-2">No Expertise Selected</span>
                                        }
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formik.values.specialties.map(specialty => (
                                            <div key={specialty}
                                                 className="bg-black text-white px-3 py-1 rounded-full flex items-center">
                                                {specialty}
                                                <button
                                                    type="button"
                                                    onClick={() => formik.setFieldValue(
                                                        'specialties',
                                                        formik.values.specialties.filter(s => s !== specialty)
                                                    )}
                                                    className="ml-2 hover:text-gray-400"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-white font-medium mb-2">Languages
                                        Spoken</label>
                                    <div className="mt-2">
                                        <Select
                                            isMulti
                                            name="languages"
                                            isDisabled={!isEditing}
                                            options={languageOptions}
                                            className="w-full border rounded-lg"
                                            classNamePrefix="select"
                                            value={languageOptions.filter(option => formik.values.languages.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                formik.setFieldValue(
                                                    "languages",
                                                    selectedOptions ? selectedOptions.map(option => option.value) : []
                                                );
                                            }}
                                        />


                                        {formik.touched.languages && formik.errors.languages && (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.languages}</div>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formik.values.languages.map(language => (
                                            <div key={language}
                                                 className="bg-black text-white px-3 py-1 rounded-full flex items-center">
                                                {language}
                                                <button
                                                    type="button"
                                                    onClick={() => formik.setFieldValue(
                                                        'languages',
                                                        formik.values.languages.filter(l => l !== language)
                                                    )}
                                                    disabled={!isEditing}
                                                    className="ml-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {selectedSkill && (
                                    <div className="mt-4 mb-2">
                                        <h3 className="text-md mb-1 font-medium text-gray-700 dark:text-white">Selected
                                            Skill:</h3>
                                        <ul className="flex flex-wrap gap-2">
                                            <li className="bg-black text-sm px-2 py-1 text-white rounded-xl">{selectedSkill}</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-700 font-medium mb-2 mt-2 dark:text-white">Years
                                    of Experience</label>
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
                                        endYear
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


                    {/* Work Experience */}
                    <Card className="secondbg p-6">
                        <EditableSection
                            title="Work Experience:"
                            isEditing={isEditingExperience}
                            setIsEditing={setIsEditingExperience}
                            onSave={() => setIsEditingExperience(false)}
                            onCancel={() => setIsEditingExperience(false)}
                        >
                            <div className="space-y-6">
                                {workExperiences.map((exp, index) => (
                                    <WorkExperienceEntry
                                        key={exp.id}
                                        workExperience={exp}
                                        isEditing={isEditingExperience}
                                        showRemove={workExperiences.length > 1}
                                        onChange={(updated: { id: number; company: string; role: string; startDate: string; endDate: string; }) => {
                                            const updatedExperiences = [...workExperiences];
                                            updatedExperiences[index] = updated;
                                            setWorkExperiences(updatedExperiences);
                                        }}
                                        onRemove={() =>
                                            setWorkExperiences(workExperiences.filter((_, i) => i !== index))
                                        }
                                    />
                                ))}

                                {isEditingExperience && workExperiences.length < 3 && (
                                    <Button
                                        variant="outline"
                                        className="w-full dashborder dashbutton text-white"
                                        onClick={() => {
                                            setWorkExperiences([
                                                ...workExperiences,
                                                {id: Date.now(), company: "", role: "", startDate: "", endDate: ""},
                                            ]);
                                        }}
                                    >
                                        + Add Another Work Experience
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
                                    <p className="text-sm text-gray-400">Receive important updates about your session
                                        via email</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.challengeUpdates || false}
                                    onCheckedChange={(checked) =>
                                        handleNotificationUpdate('emailNotifications', checked)
                                    }
                                    disabled={notificationLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">Session Updates</Label>
                                    <p className="text-sm text-gray-400">Receive updates about your Sessions</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.challengeUpdates}
                                    onCheckedChange={(checked) => handleNotificationUpdate('challengeUpdates', checked)}
                                    disabled={notificationLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">New Messages</Label>
                                    <p className="text-sm text-gray-400">Receive updates about new messages</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.newMessages}
                                    onCheckedChange={(checked) => handleNotificationUpdate('newMessages', checked)}
                                    disabled={notificationLoading}
                                />
                            </div>
                            <Separator className="secondbg"/>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="dashtext">Marketing Emails</Label>
                                    <p className="text-sm text-gray-400">Receive marketing emails</p>
                                </div>
                                <Switch
                                    checked={notificationPreferences?.marketingEmails}
                                    onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                                    disabled={notificationLoading}
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
                <UploadImageDialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)}/>
                <IdentityVerificationDialog isOpen={isGetVerifiedDialogueOpen}
                                            onClose={() => setIsGetVerifiedDialogueOpen(false)}/>
            </div>
        </MainLayout>
    )
}