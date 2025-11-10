// ChallengeDetailsDialogue.tsx
import {Dialog, DialogContent} from "@/dashboard/Innovator/components/ui/dialog"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {Badge} from "@/dashboard/Innovator/components/ui/badge"
import {ScrollArea} from "@/dashboard/Innovator/components/ui/scroll-area"
import {ArrowLeft, CheckCircle2, MapPin, Clock, Star, ChevronRight} from "lucide-react"
import {useState} from "react"
import {SubmitPitchDialog} from "./SubmitYourPitchDialog"
import {normalizeSkillBudgets} from "@/utils/normalizeSkillBudget";

// ✅ Slim, dialog-only type
export interface ChallengeSummary {
    id: string
    title: string
    description?: string
    industry?: string
    totalBudget?: number
    dueDate?: string
    requiredSkills?: string[]
    skillBudgets?: { skill: string; budget: number }[]
    problemSolversNeeded?: number
    location?: { country?: string; city?: string }
    createdAt?: string
    paymentVerified?: boolean
    submissions?: any[]
}

interface Review {
    id: string
    title: string
    rating: number
    review: string
    date: string
    budget: string
    reviewer: {
        name: string
        rating: number
        review: string
    }
}

export interface ChallengeDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    challenge: ChallengeSummary
    innovator?: {
        paymentVerified?: boolean
        rating?: number
        totalReviews?: number
        location?: string
        timeZone?: string
        challengesPosted?: number
        hireRate?: number
        openChallenges?: number
        totalSpent?: number
        totalHires?: number
        activeHires?: number
        avgBudget?: number
        totalHours?: number
        education?: string
        companySize?: string
        memberSince?: string
        challengeLink?: string
    }
    reviews?: Review[]
}

export function ChallengeDetailsDialog({
                                           isOpen,
                                           onClose,
                                           challenge,
                                           innovator,
                                           reviews,
                                       }: ChallengeDetailsDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    console.log('Challenge data received:', challenge)
    console.log("challenge.skillBudgets:", challenge?.skillBudgets)

    const normalizedSkills = normalizeSkillBudgets(challenge?.skillBudgets || []);

    const innovatorData = innovator ?? {
        paymentVerified: true,
        rating: 4.5,
        totalReviews: 25,
        location: "United States",
        timeZone: "EST",
        challengesPosted: 10,
        hireRate: 80,
        totalSpent: 20000,
        avgBudget: 1500,
        memberSince: "2018",
    }

    const reviewsData: Review[] =
        reviews?.length
            ? reviews
            : [
                {
                    id: "1",
                    title: "Great Challenge",
                    rating: 4,
                    review: "I really liked this challenge and found it quite rewarding. Would recommend!",
                    date: "2025-02-20",
                    budget: "$500",
                    reviewer: {name: "John Doe", rating: 4, review: "Excellent!"},
                },
            ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col dark:bg-[#1a281f]">
                {/* Header */}
                <div className="p-4 sm:p-6 sm:py-3 border-b">
                    <button onClick={onClose} className="flex items-center text-sm dark:text-white mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">{challenge?.title || "Untitled Challenge"}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm dark:text-white">HealthTech Inc.</span>
                                <Badge variant="secondary">{challenge?.industry || "General"}</Badge>
                            </div>
                        </div>
                        <div className="text-right mt-4 sm:mt-0">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ${challenge?.totalBudget?.toLocaleString()}
                            </div>
                            {challenge?.dueDate && (
                                <div className="flex items-center gap-1 text-sm dark:text-white mt-1">
                                    <Clock className="h-4 w-4"/>
                                    Deadline: {new Date(challenge.dueDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-4 p-4 border-b">
                    <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium text-gray-500">Solutions Submitted</h4>
                        <p className="text-lg font-semibold">{challenge.submissions?.length ?? 0}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium text-gray-500">Problem Solvers Needed</h4>
                        <p className="text-lg font-semibold">{challenge.problemSolversNeeded ?? 1}</p>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 sm:p-6 !pt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">Description</h3>
                                <div
                                    className="text-sm dark:text-white prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{__html: challenge.description ?? ""}}
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">Requirements</h3>
                                <ul className="list-disc text-sm list-inside space-y-1 dark:text-white">
                                    {challenge.requiredSkills?.length ? (
                                        challenge.requiredSkills.map((req, i) => <li key={i}>{req}</li>)
                                    ) : (
                                        <li>No specific requirements</li>
                                    )}
                                </ul>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">Skills/Expertise needed</h3>
                                <div className="flex flex-wrap gap-2">
                                    {normalizedSkills.length > 0 ? (
                                        normalizedSkills.map((s) => (
                                            <Badge
                                                key={s.name}
                                                variant={'secondary'}
                                                className={'flex items-center gap-2 py-1.5 px-3'}
                                            >
                                                {s.name}
                                                <span className={'text-xs font-normal opacity-75'}>${s.budget}</span>
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className={'text-sm text-gray-500'}>No skills specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Reviews */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">Innovator&apos;s Reviews</h3>
                                {reviewsData.map((review) => (
                                    <div key={review.id} className="rounded border p-4 mb-3 dark:text-white">
                                        <h4 className="font-medium">{review.title}</h4>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {Array.from({length: review.rating}).map((_, i) => (
                                                <Star key={i} className="h-4 w-4"/>
                                            ))}
                                        </div>
                                        <p className="text-sm mt-1">{review.review}</p>
                                        <p className="text-xs text-gray-500 mt-2">— {review.reviewer.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-2 md:fixed right-0 md:w-1/3">
                            <div className="rounded-lg border p-4">
                                <h3 className="text-lg font-semibold mb-2 dark:text-white">About the Innovator</h3>

                                {innovatorData.paymentVerified && (
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4"/>
                                        <span className="text-xs">Payment method verified</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs dark:text-white">
                                    <MapPin className="h-4 w-4"/>
                                    {innovatorData.location}
                                </div>

                                <div className="mt-2 text-sm dark:text-white">
                                    ⭐ {innovatorData.rating} of {innovatorData.totalReviews} reviews
                                </div>
                                <div className="text-sm dark:text-white">
                                    Challenges posted: {innovatorData.challengesPosted} ({innovatorData.hireRate}% hire
                                    rate)
                                </div>
                                <div className="text-sm dark:text-white">
                                    Total spent: ${innovatorData.totalSpent?.toLocaleString()}
                                </div>
                                <div className="text-sm dark:text-white">
                                    Avg. budget: ${innovatorData.avgBudget?.toLocaleString()}
                                </div>
                                <div className="text-sm dark:text-white">Member since {innovatorData.memberSince}</div>
                            </div>

                            <Button
                                className="w-full dashbutton text-white"
                                size="lg"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                Submit Your Pitch
                                <ChevronRight className="h-4 w-4 ml-2"/>
                            </Button>
                        </div>
                    </div>
                </ScrollArea>

                <SubmitPitchDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    // SubmitPitchDialog expects { id, title, skills }, so pass a compact object
                    challenge={{
                        id: challenge.id,
                        title: challenge.title,
                        skills: (challenge.skillBudgets ?? []).map((s) => ({
                            name: s.skill,
                            budget: s.budget,
                        })),
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
