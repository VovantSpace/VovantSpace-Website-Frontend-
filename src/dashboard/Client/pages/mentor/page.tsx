import {JSX, useState, useMemo} from "react";
import {AlertCircle, Search} from "lucide-react";
import {Input} from "@/dashboard/Innovator/components/ui/input";
import {MentorCard} from "@/dashboard/Client/components/mentor-card";
import {MentorProfileDialog} from "@/dashboard/Client/components/mentor-profile-dialog";
import {BookSessionDialog} from "@/dashboard/Client/components/book-session-dialog";
import {ConfirmSessionDialog} from "@/dashboard/Client/components/confirm-session-dialog";
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {useMentorSearch} from "@/hooks/useMentorSearch";
import {useMentorDetails} from "@/hooks/useMentor";
import {toast} from 'react-hot-toast'
import {io} from "socket.io-client";

/* ---------------------------------------
   ✅ Mentor Type (matches backend shape)
--------------------------------------- */
interface Mentor {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    expertise?: string;
    specialties?: string[];
    languages?: string[];
    experienceLevel?: string;
    averageRating?: number;
    totalSessions?: number;
    completedSessions?: number;
    averageHourlyRate?: number;
    country?: string;
    stats?: {
        averageRating: number;
        totalRatings: number;
        completedSessions: number;
    };
    sessionRate?: number;
    hasPendingRequests?: boolean;
}

/* ---------------------------------------
   ✅ Loading Skeleton
--------------------------------------- */
const LoadingStats = (): JSX.Element => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        ))}
    </div>
);

/* ---------------------------------------
   ✅ Error Message Block
--------------------------------------- */
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

// Helper function to format mentor session prices
const roundAmount = (amount: number): number => {
    return Math.round(Number(amount) || 0)
}

/* ---------------------------------------
   ✅ Main Mentors Component
--------------------------------------- */
export default function Mentors() {
    /* ---- Filter + Search States ---- */
    const [searchQuery, setSearchQuery] = useState("");
    const [expertise, setExpertise] = useState("");
    const [experience, setExperience] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [language, setLanguage] = useState("");

    /* ---- Dialog + Selection States ---- */
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const socket = io(import.meta.env.VITE_API_URL, {
        transports: ['websocket'],
        withCredentials: true,
    })

    const [bookingDetails, setBookingDetails] = useState<{
        date: string;
        time: { id: string; startTime: string; endTime: string };
        topic: string;
    } | null>(null);

    /* ---- Fetch Mentors ---- */
    const filters = useMemo(
        () => ({
            search: searchQuery,
            expertise,
            experience,
            priceRange,
            language,
            sortBy: "rating" as const,
            page: 1,
            limit: 12,
        }),
        [searchQuery, expertise, experience, priceRange, language]
    );

    const {mentors, loading, error, refresh} = useMentorSearch(filters);

    /* ---- Fetch Mentor Details for Profile ---- */
    const {mentor: mentorDetails, loading: mentorLoading} = useMentorDetails(
        selectedMentor?._id || null,
        isProfileOpen
    );

    /* ---- Handlers ---- */
    const handleSeeProfile = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsProfileOpen(true);
    };

    const handleBookNow = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsBookingOpen(true);
    };

    const handleConfirmBooking = (
        date: string,
        timeSlot: { id: string; startTime: string; endTime: string },
        topic: string
    ) => {
        setBookingDetails({date, time: timeSlot, topic});
        setIsBookingOpen(false);
        setIsConfirmOpen(true);
    };

    const handleConfirmRequest = async () => {
        if (!selectedMentor || !bookingDetails) {
            toast.error("Missing booking details. Please try again.")
            return;
        }

        const {date, time, topic} = bookingDetails

        const sessionAmount = roundAmount(selectedMentor.averageHourlyRate || 0)

        try {
            toast.loading("Booking session...")

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/session/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    mentorId: selectedMentor._id,
                    requestedDate: date,
                    requestedEndTime: time.endTime,
                    topic,
                    duration: 60,
                    amount: sessionAmount,
                })
            })

            toast.dismiss()

            if (!response.ok) {
                const data = await response.json(); // Parse the response first
                throw new Error(data.message || "failed to book session");
            }

            const data = await response.json();

            toast.success(`Session request sent to ${selectedMentor?.firstName}`)
            setIsConfirmOpen(false)
            setBookingDetails(null)
            setSelectedMentor(null)
        } catch (err: any) {
            toast.dismiss();
            toast.error(err.message || "Something went wrong while booking the session.")
        }
    };

    /* ---- UI ---- */
    return (
        <MainLayout>
            <div className="min-h-screen dashbg p-4">
                {/* Search + Filters */}
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            className="pl-10 secondbg dark:text-white"
                            placeholder="Search Advisor/Mentor by name, expertise, or keywords"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                        <select
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white"
                        >
                            <option value="">All Expertise</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="DevOps">DevOps</option>
                        </select>

                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white"
                        >
                            <option value="">All Experience Level</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="4-7 years">4-7 years</option>
                            <option value="8+ years">8+ years</option>
                        </select>

                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white"
                        >
                            <option value="">All Price Ranges</option>
                            <option value="0-50">$0 - $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100+">$100+</option>
                        </select>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white"
                        >
                            <option value="">All Languages</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                </div>

                {/* Loading + Error */}
                {loading && (
                    <div className="mt-10">
                        <LoadingStats/>
                        <p className="text-center text-gray-400 mt-4">
                            Loading mentors...
                        </p>
                    </div>
                )}

                {!loading && error && <ErrorMessage message={error} onRetry={refresh}/>}

                {/* Mentors List */}
                {!loading && !error && (
                    <>
                        {mentors.length === 0 ? (
                            <p className="text-center text-gray-400 mt-6">
                                No mentors found. Try a different filter.
                            </p>
                        ) : (
                            <div className="space-y-4">
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
                                            tags: mentor.specialties || [],
                                            price: roundAmount(mentor.averageHourlyRate || 0),
                                            location: mentor.country || "N/A",
                                            language:
                                                (mentor.languages && mentor.languages.join(", ")) ||
                                                "N/A",
                                            experience: mentor.experienceLevel || "N/A",
                                            sessionsCompleted: mentor.completedSessions || 0,
                                            about: mentor.bio,
                                            sessionRate: roundAmount(mentor.averageHourlyRate || 0),
                                        }}
                                        onSeeProfile={() => handleSeeProfile(mentor)} // ✅ pass full object
                                        onBookNow={() => handleBookNow(mentor)} // ✅ pass full object
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Profile Dialog */}
                {selectedMentor && (
                    <MentorProfileDialog
                        open={isProfileOpen}
                        onOpenChange={setIsProfileOpen}
                        mentor={{
                            initial:
                                mentorDetails?.firstName?.[0]?.toUpperCase() ||
                                selectedMentor.firstName?.[0] ||
                                "M",
                            name: `${mentorDetails?.firstName || selectedMentor.firstName} ${
                                mentorDetails?.lastName || selectedMentor.lastName
                            }`,
                            rating:
                                mentorDetails?.stats?.averageRating ||
                                selectedMentor.averageRating ||
                                0,
                            reviewCount:
                                mentorDetails?.stats?.totalRatings ||
                                selectedMentor.totalSessions ||
                                0,
                            language:
                                (mentorDetails?.languages ||
                                    selectedMentor.languages ||
                                    ["N/A"]
                                ).join(", "),
                            experience:
                                mentorDetails?.experienceLevel ||
                                selectedMentor.experienceLevel ||
                                "N/A",
                            sessionsCompleted:
                                mentorDetails?.stats?.completedSessions ||
                                selectedMentor.completedSessions ||
                                0,
                            about:
                                mentorDetails?.bio ||
                                selectedMentor.bio ||
                                "No bio provided.",
                            specializations:
                                mentorDetails?.specialties || selectedMentor.specialties || [],
                            sessionRate:
                                mentorDetails?.averageHourlyRate ||
                                selectedMentor.averageHourlyRate ||
                                0,
                            certifications: mentorDetails?.certifications || [],
                            workExperience: mentorDetails?.workExperience || [],
                            location: mentorDetails?.country || selectedMentor.country || "N/A",
                        }}
                        onBookSession={() => handleBookNow(selectedMentor)}
                    />
                )}

                {/* Booking Dialog */}
                {selectedMentor && (
                    <BookSessionDialog
                        open={isBookingOpen}
                        onOpenChange={setIsBookingOpen}
                        mentorId={selectedMentor._id}
                        mentorName={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                        mentorHourlyRate={roundAmount(selectedMentor?.sessionRate ?? selectedMentor?.averageHourlyRate ?? 0)}
                        //menteeId="currentUserIdHere" // TODO: replace with logged-in user ID
                        onConfirm={handleConfirmBooking}
                    />
                )}

                {/* Confirmation Dialog */}
                {selectedMentor && bookingDetails && (
                    <ConfirmSessionDialog
                        open={isConfirmOpen}
                        onOpenChange={setIsConfirmOpen}
                        sessionDetails={{
                            mentor: `${selectedMentor.firstName} ${selectedMentor.lastName}`,
                            date: bookingDetails.date,
                            time: `${bookingDetails.time.startTime} - ${bookingDetails.time.endTime}`,
                            topic: bookingDetails.topic,
                        }}
                        paymentDetails={{
                            sessionFee: roundAmount(selectedMentor.averageHourlyRate || 0),
                            serviceFee: roundAmount((selectedMentor.averageHourlyRate || 0) * 0.05),
                            totalAmount: roundAmount((selectedMentor.averageHourlyRate || 0) * 1.05),
                        }}
                        onConfirm={handleConfirmRequest}
                    />
                )}
            </div>
        </MainLayout>
    );
}
