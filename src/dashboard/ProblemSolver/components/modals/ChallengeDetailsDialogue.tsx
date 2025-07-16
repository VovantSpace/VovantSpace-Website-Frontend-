import { Dialog, DialogContent } from "@innovator/components/ui/dialog"
import { Button } from "@innovator/components/ui/button"
import { Badge } from "@innovator/components/ui/badge"
import { Separator } from "@innovator/components/ui/separator"
import { ScrollArea } from "@innovator/components/ui/scroll-area"
import { ArrowLeft, CheckCircle2, MapPin, Calendar, Building2, Clock, Star, ChevronRight } from "lucide-react"
import { useState } from "react"
import { SubmitPitchDialog } from "./SubmitYourPitchDialog"

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

interface Skill {
  name: string
  budget: number
}

interface ChallengeDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  challenge: {
    id: string
    title?: string
    company?: {
      name?: string
      rating?: number
      spent?: string
    }
    location?: string
    description?: string
    technologies?: string[]
    paymentVerified?: boolean
    solutionsubmitted?: string
    industry?: string
    postedAt?: string
    reward?: number
    deadline?: string
    requirements?: string[]
  }
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
  const [showFullReview, setShowFullReview] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  

  const toggleReview = (id: string) => {
    setShowFullReview((prev) =>
      prev.includes(id) ? prev.filter((reviewId) => reviewId !== id) : [...prev, id]
    )
  }

  // Build challenge data with fallback values
  const challengeData = {
    title: challenge?.title ?? "No Title",
    company: challenge?.company?.name ?? "Unknown Company",
    companyRating: challenge?.company?.rating ?? 0,
    companySpent: challenge?.company?.spent ?? "N/A",
    industry: challenge?.industry ?? "Unknown Industry",
    budget: challenge?.reward ?? 0,
    deadline: challenge?.deadline ?? null,
    submissions: challenge?.solutionsubmitted ?? "N/A",
    problemSolversNeeded: 1, // default value
    description: challenge?.description ?? "No description provided.",
    requirements: challenge?.requirements ?? ["No requirements specified."],
    // Map technologies to skills with a default budget of 0.
    skills: challenge?.technologies ? challenge.technologies.map((tech: string) => ({ name: tech, budget: 0 })) : [],
    location: challenge?.location ?? "Unknown",
    postedAt: challenge?.postedAt ?? "Unknown",
    paymentVerified: challenge?.paymentVerified ?? false,
  }

  // Fallback innovator data
  const fallbackInnovator = {
    paymentVerified: true,
    rating: 4.5,
    totalReviews: 25,
    location: "New York, USA",
    timeZone: "EST",
    challengesPosted: 10,
    hireRate: 80,
    openChallenges: 3,
    totalSpent: 20000,
    totalHires: 15,
    activeHires: 2,
    avgBudget: 1500,
    totalHours: 500,
    education: "MBA",
    companySize: "51-200",
    memberSince: "2018",
    challengeLink: "https://example.com/challenge",
  }
  const innovatorData = innovator ?? fallbackInnovator

  // Fallback reviews data
  const fallbackReviews: Review[] = [
    {
      id: "1",
      title: "Great Challenge",
      rating: 4,
      review:
        "I really liked this challenge and found it quite rewarding. Would recommend to anyone!",
      date: "2025-02-20",
      budget: "$500",
      reviewer: { name: "John Doe", rating: 4, review: "Excellent!" },
    },
    {
      id: "2",
      title: "Good Experience",
      rating: 5,
      review: "The challenge was engaging and well-organized. I learned a lot.",
      date: "2025-02-22",
      budget: "$750",
      reviewer: { name: "Jane Smith", rating: 5, review: "Superb!" },
    },
  ]
  const reviewsData = reviews && reviews.length ? reviews : fallbackReviews

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col dark:bg-[#1a281f]">
        {/* Header */}
        <div className="p-4 sm:p-6 sm:py-3 border-b ">
          <button onClick={onClose} className="flex items-center text-sm  dark:text-white mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">{challengeData.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm dark:text-white">{challengeData.company}</span>
                <Badge variant="secondary">{challengeData.industry}</Badge>
              </div>
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${challengeData.budget?.toLocaleString()}
              </div>
              {challengeData.deadline && (
                <div className="flex items-center gap-1 text-sm  dark:text-white mt-1">
                  <Clock className="h-4 w-4" />
                  Deadline: {challengeData.deadline}
                </div>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 !pt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Challenge Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border ">
                  <div className="text-sm dark:text-white">Solutions Submitted</div>
                  <div className="text-2xl font-bold  dark:text-white">{challengeData.submissions}</div>
                </div>
                <div className="p-4 rounded-lg border ">
                  <div className="text-sm  dark:text-white">Problem Solvers Needed</div>
                  <div className="text-2xl font-bold  dark:text-white">{challengeData.problemSolversNeeded}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2  dark:text-white">Description</h3>
                <p className="text-sm dark:text-white">{challengeData.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold mb-2  dark:text-white">Requirements</h3>
                <ul className="list-disc text-sm list-inside space-y-1  dark:text-white">
                  {challengeData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold mb-2  dark:text-white">Skills/Expertise needed</h3>
                <div className="flex flex-wrap gap-2">
                  {challengeData.skills.map((skill) => (
                    <Badge key={skill.name} variant="secondary" className="flex items-center gap-2 py-1.5 px-3">
                      {skill.name}
                      <span className="text-xs font-normal opacity-75">${skill.budget}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-4  dark:text-white">Innovator's Reviews</h3>
                <div className="space-y-4">
                  {reviewsData.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border ">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <h4 className="font-medium text-emerald-600 dark:text-emerald-400">{review.title}</h4>
                        <div className="flex items-center gap-1 mt-2 sm:mt-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm  dark:text-white mb-2">
                        {showFullReview.includes(review.id)
                          ? review.review
                          : `${review.review.slice(0, 150)}...`}
                        <button
                          onClick={() => toggleReview(review.id)}
                          className="ml-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {showFullReview.includes(review.id) ? "less" : "more"}
                        </button>
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs  dark:text-white">
                        <div>
                          {review.date} • {review.budget}
                        </div>
                        <div className="flex items-center gap-1 mt-2 sm:mt-0">
                          <span className="font-medium">{review.reviewer.name}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{review.reviewer.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Innovator Details */}
            <div className="space-y-2 md:fixed right-0 md:w-1/3">
              <div className="rounded-lg border p-4 py-2 ">
                <h3 className="text-lg font-semibold mb-2  dark:text-white">About the Innovator</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {challengeData.paymentVerified && (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Payment method verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < innovatorData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs  dark:text-white">
                      {innovatorData.rating} of {innovatorData.totalReviews} reviews
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs  dark:text-white">
                      <MapPin className="h-4 w-4" />
                      {challengeData.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs  dark:text-white">
                      <Clock className="h-4 w-4" />
                      {innovatorData.timeZone}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-xs">
                      <span className=" dark:text-white">Challenges posted</span>
                      <span className="dark:text-white">
                        {innovatorData.challengesPosted} ({innovatorData.hireRate}% hire rate)
                        {/* {innovatorData.openChallenges} open) */}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className=" dark:text-white">Total spent</span>
                      <span className="dark:text-white">
                        ${innovatorData.totalSpent?.toLocaleString()}
                        {/* {innovatorData.activeHires} active) */}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs dark:text-white">
                      <span className=" dark:text-white">Avg. budget</span>
                      <span>${innovatorData.avgBudget?.toLocaleString()}</span>
                    </div>

                  </div>

                  <Separator />

                  <div className="space-y-2">

                    <div className="flex items-center gap-2 text-xs  dark:text-white">
                      <Calendar className="h-4 w-4" />
                      Member since {innovatorData.memberSince}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full dashbutton text-white"
                size="lg"
                onClick={() => setIsDialogOpen(true)}
              >
                Submit Your Pitch
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

        </ScrollArea>
        <SubmitPitchDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} challenge={challenge} />
      </DialogContent>
    </Dialog>
  )
}
