
import { useState } from "react"
import { Clock, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { MainLayout } from "../components/layout/main-layout"
// import { ReviewSubmissionDialog } from "../components/modals/All-Submission-Dialogue"
import { ScheduleReviewDialog } from "../components/modals/schedule-review-dialog"
import { ViewResultsDialog } from "../components/modals/view-results-dialog"
import { CreateChallengeDialog } from "../components/modals/create-challenge-dialog"

export default function HomePage() {
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false)

  return (
    <MainLayout>
      <div className="dashbg md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 ">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold dashtext">Overview</h1>
          <Button className="dashbutton" onClick={() => setIsCreateChallengeOpen(true)}>Create New Challenge</Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="secondbg p-6 dashtext">
            <div className="mb-2 text-sm text-gray-400">Total Challenges</div>
            <div className="text-3xl font-bold">12</div>
            <div className="mt-2 text-sm text-[#00bf8f]">+3 this month</div>
          </Card>
          <Card className="secondbg p-6 dashtext">
            <div className="mb-2 text-sm text-gray-400">Active Challenges</div>
            <div className="text-3xl font-bold">5</div>
            ⏳
          </Card>
          <Card className="secondbg p-6 dashtext">
            <div className="mb-2 text-sm text-gray-400">Total Rewards</div>
            <div className="text-3xl font-bold">$25,000</div>
            <div className="mt-2 text-sm text-[#00bf8f]">+$8,000 this month</div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold dashtext">Active Challenges</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="secondbg p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold dashtext">AI-Powered Smart Farming</h3>
                  <span className="inline-block rounded-full bg-[#00bf8f]/20 px-2 py-0.5 text-xs text-[#00bf8f]">
                    Active
                  </span>
                </div>
                <div className="text-xl font-bold text-[#00bf8f]">$5,000</div>
              </div>
              <div className="mb-4 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  12 Submissions
                </div>
             
              </div>
              <Link to={'/dashboard/innovator/my-challenges'} >
                <Button className="w-full dashbutton ">View Details</Button></Link>
            </Card>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold dashtext">Completed Challenges</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="secondbg p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold dashtext">AI-Powered Smart Farming</h3>
                  <span className="inline-block rounded-full bg-[#00bf8f]/20 px-2 py-0.5 text-xs text-[#00bf8f]">
                    Active
                  </span>
                </div>
                <div className="text-xl font-bold text-[#00bf8f]">$5,000</div>
              </div>
              <div className="mb-4 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  12 Submissions
                </div>
             
              </div>
              <Link to={'/dashboard/innovator/my-challenges'} >
                <Button className="w-full dashbutton ">View Details</Button></Link>
            </Card>
          </div>
        </div>
        <CreateChallengeDialog isOpen={isCreateChallengeOpen} onClose={() => setIsCreateChallengeOpen(false)} />
      </div>
    </MainLayout>
  )
}

