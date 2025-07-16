import { useState } from "react";
import { Heart, ArrowUpRight, MapPin, Star, Clock, DollarSign } from "lucide-react"
import {
  BarChart as ChartBar,
  Trophy,
} from "lucide-react";
import { Card } from "@innovator/components/ui/card";
import { Badge } from "@innovator/components/ui/badge";
import { Button } from "@innovator/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovator/components/ui/select";
import { MainLayout } from "@problemsolver/components/layout/main-layout";
import { CreateChallengeDialog } from "@innovator/components/modals/create-challenge-dialog";
import { ApplyChallengeDialog } from "@problemsolver/components/modals/ApplyChallengeDialog";

export default function HomePage() {
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [industryFilter, setIndustryFilter] = useState("all");
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([])

  // Matching the metrics from the screenshot
  const challengesParticipated = 8;
  const rewardsEarned = "$12,500";
  const currentRank = "Gold";

  // Sample challenges data matching screenshot text
  const challenges = [
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
      solutionsubmitted: "10 to 15",
      industry: "Healthcare",
      postedAt: "1 hour ago",
      reward: 7500,
    },
    {
      id: "2",
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
      solutionsubmitted: "10 to 15",
      industry: "Healthcare",
      postedAt: "1 hour ago",
      reward: 7500,
    },
  ];

  const filteredChallenges =
    industryFilter === "all"
      ? challenges
      : challenges.filter((ch) =>
        ch.industry.toLowerCase().includes(industryFilter)
      );

  const handleApplyNow = (challenge) => {
    setSelectedChallenge(challenge);
    setIsApplyDialogOpen(true);
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }


  return (
    <MainLayout>
      <div className="dashbg md:p-6 px-3 pt-2 md:mr-14">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold dashtext">Overview</h1>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Challenges Participated */}
          <Card className="p-6 secondbg !dark:text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Challenges Participated
                </p>
                <h2 className="text-3xl font-bold dark:text-white">
                  {challengesParticipated}
                </h2>
                <p className="flex items-center text-sm text-emerald-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center">
                <ChartBar className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          {/* Card 2: Rewards Earned */}
          <Card className="p-6 secondbg !dark:text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Rewards Earned
                </p>
                <h2 className="text-3xl font-bold dark:text-white">
                  {rewardsEarned}
                </h2>
                <p className="flex items-center text-sm text-emerald-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +$3,000 this month
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          {/* Card 3: Current Rank */}
          <Card className="p-6 secondbg !dark:text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Current Rank
                </p>
                <h2 className="text-3xl font-bold dark:text-white">
                  {currentRank}
                </h2>
                <p className="flex items-center text-sm text-emerald-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Top 10%
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Challenges Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dashtext flex">
            Recommended Challenges
          </h2>
          <div className="secondbg">
            <Select
              value={industryFilter}
              onValueChange={(val) => setIndustryFilter(val)}
              className="secondbg text-center text-sm"
            >
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="energy">Energy & Sustainability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {/* <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => toggleSaved(challenge.id)}
                 className="dark:hover:bg-gray-700"
               >
                 <Heart
                   className="h-5 w-5 dark:text-white "
                   fill={savedChallenges.includes(challenge.id) ? "currentColor" : "none"}
                 />
               </Button> */}
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
              <span className="text-sm dark:text-white">Skills Needed:</span>
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

                  <Button className="dashbutton text-white shadow-md hover:shadow-lg transition-all font-semibold rounded-lg">
                    Pitch Now
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateChallengeDialog
        isOpen={isCreateChallengeOpen}
        onClose={() => setIsCreateChallengeOpen(false)}
      />
      {isApplyDialogOpen && (
        <ApplyChallengeDialog
          isOpen={isApplyDialogOpen}
          onClose={() => {
            setIsApplyDialogOpen(false);
            setSelectedChallenge(null);
          }}
          challenge={selectedChallenge}
        />
      )}
    </MainLayout>
  );
}
