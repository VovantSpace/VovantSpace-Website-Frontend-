import { useState } from "react"
import { Search, Moon, Sun, Heart, ArrowUpRight, MapPin, Star, Clock, DollarSign } from "lucide-react"
import { Button } from "@/dashboard/ProblemSolver/components/ui/button"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Card } from "@/dashboard/Innovator/components/ui/card"
import { Badge } from "@/dashboard/Innovator/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/dashboard/Innovator/components/ui/tabs"
import { MainLayout } from "@/dashboard/ProblemSolver/components/layout/main-layout"
import { ChallengeDetailsDialog } from "../../components/modals/ChallengeDetailsDialogue"


const challenges= [
  {
    id: "1",
    title: "AI-Powered Healthcare Solution",
    company: {
      name: "HealthTech Inc.",
      rating: 5,
      spent: "400K+",
    },
    location: "United States",
    description:
      "Develop an AI system to assist in early disease detection using patient data and machine learning algorithms. The project involves implementing advanced algorithms and ensuring HIPAA compliance throughout the development process. You will be working with a team of healthcare professionals to validate the system's accuracy...",
    technologies: ["Machine Learning", "Python", "Healthcare Analytics"],
    paymentVerified: true,
    skills:['Machine Learning', 'Python', 'Healthcare Analytics'],
    solutionsubmitted: "10 to 15",
    industry: "Healthcare",
    postedAt: "1 hour ago",
    reward: 7500,
  },
  {
    id: "2",
    title: "Sustainable Energy Platform",
    company: {
      name: "GreenEnergy Co.",
      rating: 4.8,
      spent: "250K+",
    },
    location: "Remote",
    description:
      "Create a platform to monitor and optimize renewable energy consumption for residential buildings. This project focuses on developing real-time monitoring solutions and implementing AI-driven optimization algorithms...",
    technologies: ["React", "Node.js", "Data Visualization"],
    paymentVerified: true,
    skills:['Machine Learning', 'Python', 'Healthcare Analytics'],
    solutionsubmitted: "8 to 12",
    reward: 7500,
    industry: "Energy & Sustainability",
    postedAt: "3 hours ago",
  },
]

export default function ExploreChallenges() {
  const [searchQuery, setSearchQuery] = useState("")
  const [savedChallenges, setSavedChallenges] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isOpenPitchPopupShow, setIsOpenPitchPopupShow] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleSaved = (id: string) => {
    setSavedChallenges((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <MainLayout>
      <div className={`min-h-screen dashbg ${isDarkMode ? "dark" : ""}`}>

        {/* Main Content */}
        <main className="mx-auto px-4 py-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 secondbg border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="best-matches" className="mb-6">
            <TabsList className="flex space-x-1 border-b dark:border-gray-700 justify-start dark:bg-black">
              <TabsTrigger
                value="best-matches"
                className="relative pb-2 text-gray-600 transition-colors duration-200 hover:text-black data-[state=active]:text-black data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-green-700"
              >
                Best Matches
              </TabsTrigger>
              <TabsTrigger
                value="most-recent"
                className="relative pb-2 text-gray-600 transition-colors duration-200 hover:text-black data-[state=active]:text-black data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-green-700"
              >
                Most Recent
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="relative pb-2 text-gray-600 transition-colors duration-200 hover:text-black data-[state=active]:text-black data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[3px] data-[state=active]:after:bg-green-700"
              >
                Saved Challenges
              </TabsTrigger>
            </TabsList>


            <TabsContent value="best-matches" className="space-y-6">
              {filteredChallenges.map((challenge) => (
                <Card
                key={challenge.id}
                className="md:p-4 p-2 bg-gradient-to-br from-white/50 to-white/80 dark:from-gray-800 dark:to-gray-900 !dark:text-white rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted {challenge.postedAt}</span>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {challenge.title}
                    </h3>
                  </div>
  
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      ${challenge?.reward}
                    </span>
                  </div>
                </div>
  
                <Badge
                  variant="secondary"
                  className="mb-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 text-emerald-700 dark:text-emerald-300 border shadow-inner"
                >
                  {challenge.industry}
                </Badge>
  
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {expandedDescriptions.includes(challenge.id)
                    ? challenge.description
                    : `${challenge.description.slice(0, 150)}...`}
                  <button
                    onClick={() => toggleDescription(challenge.id)}
                    className="ml-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {expandedDescriptions.includes(challenge.id) ? "less" : "more"}
                  </button>
                </p>
  
                <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-sm dark:text-white">Skills/Expertise needed:</span>
                  {challenge.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="dark:text-gray-100 bg-gray-50/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 backdrop-blur-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
  
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs dark:text-white">Payment verified</span>
                    </div>
                    <div className="flex items-center  gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(challenge.company.rating)
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                            }`}
                          fill={i < Math.floor(challenge.company.rating) ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="text-xs ml-3 dark:text-white">${challenge.company.spent} spent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-xs dark:text-white">{challenge.location}</span>
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Solutions Submitted: {challenge.solutionsubmitted}</span>
                  <div className="flex items-center gap-2">
  
                    <Button className="dashbutton text-white shadow-md hover:shadow-lg transition-all font-semibold rounded-lg" onClick={() => {
                        setSelectedChallenge(challenge); setIsOpenPitchPopupShow(true);}}>
                      Pitch Now
                      <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </TabsContent>

            <TabsContent value="most-recent" className="space-y-6">
              {/* Same card layout but sorted by date */}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              {/* Same card layout but filtered by savedChallenges */}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {isOpenPitchPopupShow && (
        <ChallengeDetailsDialog
          isOpen={isOpenPitchPopupShow}
          onClose={() => {
            setIsOpenPitchPopupShow(false);
          }}
          challenge={selectedChallenge}
        />
      )}
    </MainLayout>
  )
}