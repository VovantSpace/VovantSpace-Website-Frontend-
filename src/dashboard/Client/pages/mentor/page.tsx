import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { MentorCard } from "@/dashboard/Client/components/mentor-card"
import { MentorProfileDialog } from "@/dashboard/Client/components/mentor-profile-dialog"
import { BookSessionDialog } from "@/dashboard/Client/components/book-session-dialog"
import { ConfirmSessionDialog } from "@/dashboard/Client/components/confirm-session-dialog"
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout"

export default function Mentors() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<{
    date: string
    time: { id: string; time: string }
    topic: string
  } | null>(null)

  const mentors = [
    {
      id: "1",
      name: "John Smith",
      initial: "J",
      rating: 4.5,
      reviewCount: 124,
      bio: "Full-stack developer with expertise in React and Node.js",
      tags: ["Web Development", "DevOps"],
      price: 75,
      location: "New York, USA",
      language: "English",
      experience: "8 years of experience",
      sessionsCompleted: 450,
      about: "Full-stack developer with expertise in React and Node.js",
      specializations: ["Frontend Development", "Backend Architecture", "Cloud Solutions", "Performance Optimization"],
      sessionRate: 75,
      education: [
        {
          institution: "Massachusetts Institute of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science & AI",
          startDate: "Jan 2015",
          endDate: "Jan 2019"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "Jan 2022"
        }
      ],
      workExperience:[
        {
          company: "Tech Innovators Inc.",
          role: "Senior Software Engineer",
          startDate: "January 2020",
          endDate: "Present",
        },
      ]
  

    },
    // Add more mentors as needed
  ]

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
    setBookingDetails({ date, time: timeSlot, topic })
    setIsBookingOpen(false)
    setIsConfirmOpen(true)
  }

  const handleConfirmRequest = () => {
    setIsConfirmOpen(false)
    // Handle session request confirmation
  }

  const selectedMentorData = mentors.find((m) => m.id === selectedMentor) || mentors[0]

  return (
    <MainLayout>
      <div className="min-h-screen dashbg p-4 ">
        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 secondbg dark:text-white"
              placeholder="Search Advisor/mentor by name, expertise, or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
              <option>All Expertise</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>Data Science</option>
              <option>DevOps</option>
            </select>

            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
              <option>All Specialties</option>
              <option>1-3 years</option>
              <option>4-7 years</option>
              <option>8+ years</option>
            </select>

            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
              <option>All Price Ranges</option>
              <option>$0 - $50</option>
              <option>$50 - $100</option>
              <option>$100+</option>
            </select>

            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm secondbg dark:text-white">
              <option>All Languages</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>

        {/* Mentor list */}
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onSeeProfile={handleSeeProfile} onBookNow={handleBookNow} />
          ))}
        </div>

        {/* Dialogs */}
        <MentorProfileDialog
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          mentor={selectedMentorData}
          onBookSession={handleBookSession}
        />

        <BookSessionDialog
          open={isBookingOpen}
          onOpenChange={setIsBookingOpen}
          mentorName={selectedMentorData.name}
          onConfirm={handleConfirmBooking}
        />

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
      </div>
    </MainLayout>
  )
}

