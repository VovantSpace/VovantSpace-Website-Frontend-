import {MapPin, Briefcase, GraduationCap, CheckCircle, Calendar, Star} from "lucide-react"
import {Dialog, DialogContent} from "@/dashboard/Innovator/components/ui/dialog"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import StarRating from "@/dashboard/Client/components/star-rating"
import {Avatar, AvatarImage} from '@/dashboard/Innovator/components/ui/avatar'


interface Education {
    institution: string
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

//Certification interface
interface Certification {
    name: string
    issuer: string;
    date: string;
}

//Work experience interface
interface WorkExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
}

// Interface for the mentor
interface Mentor {
    initial: string;
    name: string;
    rating: number;
    reviewCount: number;
    location: string;
    language: string;
    experience: string;
    sessionsCompleted: number;
    about: string;
    specializations: string[];
    sessionRate: number;
    education?: Education[];
    certifications?: Certification[];
    workExperience?: WorkExperience[];
}

interface MentorProfileInterface {
    open: boolean
    onOpenChange: (open: boolean) => void
    mentor: Mentor;
    onBookSession: () => void;
}

export function MentorProfileDialog({open, onOpenChange, mentor, onBookSession}: MentorProfileInterface) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl secondbg dark:!text-white overflow-y-auto max-h-[90vh]">
                <div className="flex items-center gap-2 ">
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                        {mentor.initial}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{mentor.name}</h2>
                        <StarRating rating={mentor.rating} showCount count={mentor.reviewCount}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground dark:text-gray-300"/>
                        <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground dark:text-gray-300">Language:</span>
                        <span>{mentor.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground dark:text-gray-300"/>
                        <span>{mentor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground dark:text-gray-300">Sessions:</span>
                        <span>{mentor.sessionsCompleted} completed</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium">About</h3>
                        <p className="mt-1 text-sm">{mentor.about}</p>
                    </div>

                    <div>
                        <h3 className="font-medium">Expertise</h3>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{mentor.about}</p>
                    </div>

                    <div>
                        <h3 className="font-medium">Specialties</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {mentor.specializations.map((specialization) => (
                                <span key={specialization} className="rounded-md dashbg px-3 py-1 text-xs">
                  {specialization}
                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* New Sections for additional fields */}
                <div className="space-y-4">

                    <div>
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                            <GraduationCap className="h-5 w-5 text-emerald-400"/>
                            Education
                        </h3>
                        {mentor.education && mentor.education.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {mentor.education.map((edu, index) => (
                                    <div key={index} className="secondbg p-4 px-2 rounded-xl border border-[#2a3142]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-base font-semibold">{edu.institution}</h3>
                                            <span
                                                className="text-xs text-emerald-400">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <div
                                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <Briefcase className="h-4 w-4"/>
                                            <span>{edu.degree} in {edu.field}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">No Education Details
                                Available.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400"/>
                            Certifications
                        </h3>
                        {mentor.certifications && mentor.certifications.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {mentor.certifications.map((cert, index) => (
                                    <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-base font-semibold">{cert.name}</h3>
                                            <span className="text-xs text-emerald-400">{cert.date}</span>
                                        </div>
                                        <div
                                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <Briefcase className="h-4 w-4"/>
                                            <span>{cert.issuer}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">No certifications
                                available.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-medium flex items-center gap-2  mb-2">
                            <Briefcase className="h-5 w-5 text-emerald-400"/>
                            Work Experience
                        </h3>
                        {mentor.workExperience && mentor.workExperience.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {mentor.workExperience.map((exp, index) => (
                                    <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-base font-semibold">{exp.company}</h3>
                                            <div className="text-xs text-emerald-400">{exp.role}</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4"/>
                                            <span>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                    </div>
                                ))}f
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">No work experience
                                available.</p>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <section className="pt-2 space-y-2">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400"/>
                            Client/Mentee Reviews (127)
                        </h2>

                        <div className="space-y-4">
                            {[1].map((_, index) => (
                                <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-base">John Carter</h4>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">Healthcare
                                                    Startup CEO</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-400"/>
                                            <span className="font-medium text-sm">4.8</span>
                                        </div>
                                    </div>
                                    <div>
                                        <img
                                            src="https://codewithrafay.netlify.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.8438b86a.png&w=1080&q=75"
                                            className="w-96" alt=""/>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                                            "Absolutely phenomenal work! Delivered beyond expectations and provided
                                            valuable insights we hadn't even considered. Will definitely work with
                                            again."
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">March 15, 2023</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>


                <div className="rounded-md dashbg p-4 mt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Session Rate</h3>
                            <p className="text-sm text-muted-foreground dark:text-gray-300">30-minute session</p>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">${mentor.sessionRate}</div>
                    </div>
                </div>

                <div>
                    <Button className="w-full dashbutton !text-white" onClick={onBookSession}>
                        Book a Session
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}