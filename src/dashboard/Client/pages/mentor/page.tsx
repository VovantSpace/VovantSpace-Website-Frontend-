import {JSX, useState, useMemo} from "react"
import {AlertCircle, Search} from "lucide-react"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {MentorCard} from "@/dashboard/Client/components/mentor-card"
import {MentorProfileDialog} from "@/dashboard/Client/components/mentor-profile-dialog"
import {BookSessionDialog} from "@/dashboard/Client/components/book-session-dialog"
import {ConfirmSessionDialog} from "@/dashboard/Client/components/confirm-session-dialog"
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout"
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {useMentorSearch} from "@/hooks/useMentorSearch";


const LoadingStats = (): JSX.Element => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        ))}
    </div>
);

// Error block
const ErrorMessage = ({
                          message,
                          onRetry,
                      }: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <Button onClick={onRetry} variant="outline" className="dark:text-black">
                Try again
            </Button>
        </div>
    </div>
);

export default function Mentors() {
    const [searchQuery, setSearchQuery] = useState("")
    const [expertise, setExpertise] = useState("")
    const [experience, setExperience] = useState("")
    const [priceRange, setPriceRange] = useState("")
    const [language, setLanguage] = useState("")

    const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [bookingDetails, setBookingDetails] = useState<{
        date: string
        time: { id: string; time: string }
        topic: string
    } | null>(null)

    // prepare filters for hook
    const filters = useMemo(
        () => ({
            search: searchQuery,
            expertise,
            experience,
            priceRange,
            language,
            sortBy: "rating" as const,
            page: 1,
            limit: 12
        }),
        [searchQuery, expertise, experience, priceRange, language]
    )

    // fetch mentors from backend
    const {mentors, loading, error, refresh} = useMentorSearch(filters)

    const handleSeeProfile = (mentorId: string) => {
        setSelectedMentor(mentorId)
        setIsProfileOpen(true)
    }

    const handleBookNow = (mentorId: string) => {
        setSelectedMentor(mentorId)
        setIsBookingOpen(true)
    }

    const handleBookSession = () => {
        setIsProfileOpen(false)
        setIsBookingOpen(true)
    }

    const handleConfirmBooking = (date: string, timeSlot: { id: string; time: string }, topic: string) => {
        setBookingDetails({date, time: timeSlot, topic})
        setIsBookingOpen(false)
        setIsConfirmOpen(true)
    }

    const handleConfirmRequest = () => {
        setIsConfirmOpen(false)
        // Handle session request confirmation
    }

    const selectedMentorData = mentors?.find((m) => m.id === selectedMentor) || mentors[0] || null;

    return (
        <MainLayout>
            <div className="min-h-screen dashbg p-4 ">
                {/* Search and filters */}
                <div className="mb-6 space-y-4">
                    <div className="relative ">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            className="pl-10 secondbg dark:text-white"
                            placeholder="Search Advisor/mentor by name, expertise, or keywords"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/*Filters*/}
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                        <select
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
                            <option value={''}>All Expertise</option>
                            <option value={"Web Development"}>Web Development</option>
                            <option value={'Mobile Development'}>Mobile Development</option>
                            <option value={'Data Science'}>Data Science</option>
                            <option value={'DevOps'}>DevOps</option>
                        </select>

                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
                            <option value={''}>All Experience Level</option>
                            <option value={'1-3 years'}>1-3 years</option>
                            <option value={'4-7 years'}>4-7 years</option>
                            <option value={'8+ years'}>8+ years</option>
                        </select>

                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
                            <option value={''}>All Price Ranges</option>
                            <option value={'0-50'}>$0 - $50</option>
                            <option value={'50-100'}>$50 - $100</option>
                            <option value={'100+'}>$100+</option>
                        </select>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
                            <option value={''}>All Languages</option>
                            <option value={'English'}>English</option>
                            <option value={'Spanish'}>Spanish</option>
                            <option value={'French'}>French</option>
                            <option value={'German'}>German</option>
                        </select>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className={'mt-10'}>
                        <LoadingStats/>
                        <p className={'text-center text-gray-400 mt-4'}>
                            Loading mentors...
                        </p>
                    </div>
                )}

                {/*Error states*/}
                {!loading && error && <ErrorMessage message={error} onRetry={refresh}/>}

                {/* Mentors*/}
                {!loading && !error && (
                    <>
                        {mentors.length === 0 ? (
                            <p className={'text-center text-gray-400 mt-6'}>
                                No mentors found. Try a different filter.
                            </p>
                        ) : (
                            <div className={'space-y-4'}>
                                {mentors.map((mentor) => (
                                    <MentorCard
                                        key={mentor._id}
                                        mentor={{
                                            id: mentor._id,
                                            initial: mentor.firstName?.[0] || "M",
                                            name: `${mentor.firstName} ${mentor.lastName}`,
                                            rating: mentor.averageRating || 0,
                                            reviewCount: mentor.totalSessions || 0,
                                            bio: mentor.bio,
                                            tags: mentor.specialities || [],
                                            price: mentor.averageHourlyRate || 0,
                                            location: mentor.country || "N/A",
                                            language: (mentor.languages && mentor.languages.join(", ")) || "N/A",
                                            experience: mentor.experienceLevel || "N/A",
                                            sessionsCompleted: mentor.completedSessions || 0,
                                            about: mentor.bio,
                                            sessionRate: mentor.averageHourlyRate || 0,
                                        }}
                                        onSeeProfile={handleSeeProfile}
                                        onBookNow={handleBookNow}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Dialogs */}
                {selectedMentorData && (
                    <MentorProfileDialog
                        open={isProfileOpen}
                        onOpenChange={setIsProfileOpen}
                        mentor={selectedMentorData}
                        onBookSession={handleBookSession}
                    />
                )}


                {selectedMentorData && (
                    <BookSessionDialog
                        open={isBookingOpen}
                        onOpenChange={setIsBookingOpen}
                        mentorName={selectedMentorData.name}
                        onConfirm={handleConfirmBooking}
                    />
                )}


                {selectedMentorData && (
                    <ConfirmSessionDialog
                        open={isConfirmOpen}
                        onOpenChange={setIsConfirmOpen}
                        sessionDetails={{
                            mentor: selectedMentorData.name,
                            date: bookingDetails?.date || "Friday",
                            time: bookingDetails?.time.time || "1:00 PM - 1:30 PM",
                            topic: bookingDetails?.topic || "sdfdsf",
                        }}
                        paymentDetails={{
                            sessionFee: selectedMentorData.sessionRate,
                            serviceFee: selectedMentorData.sessionRate * 0.05,
                            totalAmount: selectedMentorData.sessionRate * 1.05,
                        }}
                        onConfirm={handleConfirmRequest}
                    />
                )}
            </div>
        </MainLayout>
    )
}