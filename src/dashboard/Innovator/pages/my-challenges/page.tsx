import { useState } from "react";
import { Eye, FileText, Pencil, CheckCircle, Users } from "lucide-react";
import { Button } from "@innovator/components/ui/button";
import { MainLayout } from "@innovator/components/layout/main-layout";
import { Badge } from "@innovator/components/ui/badge";
import { WinnerSelectorDialog } from "@innovator/components/modals/WinnerSelectorDialog";
import { AllSubmissionsDialog } from "../../components/modals/All-Submission-Dialogue";
import { ApproveChallenge } from "../../components/modals/ApproveChallenge";

const challenges = [
  {
    id: "1",
    name: "AI-Powered Smart Farming",
    problemSolvers: "3/3", // Format: approved/needed
    submissions: 8,
    approved: 3,
    rejected: 1,
    status: "active",
    reward: 5000,
    daysLeft: 3,
    views: 245,
  },
  // Add more challenges here as needed
];

const fakeSubmissions = [
  {
    id: "1",
    name: "John Doe",
    title: "Full Stack Developer",
    rate: "50",
    location: "New York, USA",
    skills: ["React", "Node.js", "GraphQL"],
    earned: "$10,000",
    successRate: "95%",
    image: "https://i.pravatar.cc/150?img=1",
    description: "Experienced developer with a focus on building robust systems.",
    country: "USA",
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "UI/UX Designer",
    rate: "40",
    location: "London, UK",
    skills: ["Figma", "Sketch", "Adobe XD"],
    earned: "$8,000",
    successRate: "90%",
    image: "https://i.pravatar.cc/150?img=1",
    description: "Creative designer focused on user-centered design solutions.",
    country: "USA",
  },
  // Add more fake submissions as needed
];

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeToApprove, setChallengeToApprove] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReviewSubmit = (approved: boolean) => {
    // Handle the review submission
    setIsReviewOpen(false);
  };

  const canApprove = (challenge) => {
    const parts = challenge.problemSolvers.split("/");
    if (parts.length === 2) {
      const approved = parseInt(parts[0], 10);
      const needed = parseInt(parts[1], 10);
      return approved === needed;
    }
    return false;
  };

  return (
    <MainLayout>
      <div className=" px-3 py-3 md:p-6 dashbg secondbg rounded-xl">
        <h1 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold dashtext">
          My Challenges
        </h1>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px] rounded-lg secondbg border dashborder shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 md:grid-cols-10 gap-2 md:gap-4 md:px-4 border-b dashborder justify-items-center p-2 items-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200 whitespace-nowrap">
              <div className="col-span-2">CHALLENGE TITLE</div>
              <div className="px-3 md:px-0">SOLVERS</div>
              <div className="px-3 md:px-0 ">SUBMISSIONS</div>
              <div className="px-3 md:px-0 relative left-2 right-2">APPROVED</div>
              <div className="px-3 md:px-0 relative left-2 right-2">REJECTED</div>
              <div className="px-3 md:px-0">STATUS</div>
              <div className="px-3 md:px-0 md:col-span-3 col-span-4">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="grid grid-cols-12 md:grid-cols-10 md:px-4 justify-items-center gap-2 md:gap-4 p-2 items-center text-xs md:text-sm whitespace-nowrap"
              >
                <div className="col-span-2 font-medium dashtext text-wrap">
                  {challenge.name}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-200">
                  <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {challenge.problemSolvers}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-200">
                  <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {challenge.submissions}
                </div>
                <div className="text-[#00bf8f] px-3 md:px-0">
                  {challenge.approved}
                </div>
                <div className="text-red-500 px-3 md:px-0">
                  {challenge.rejected}
                </div>
                <div>
                  <Badge
                    variant={
                      challenge.status === "active" ? "success" : "secondary"
                    }
                    className="text-xs bg-green-600 text-white dashborder"
                  >
                    {challenge.status}
                  </Badge>
                </div>
                <div className="flex flex-row space-x-2 uppercase md:col-span-3 col-span-5">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                    onClick={() => setIsReviewOpen(true)}
                  >
                    Submissions
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                    onClick={() => setChallengeToApprove(challenge)}
                    disabled={!canApprove(challenge)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedChallenge && (
        <WinnerSelectorDialog
          challenge={selectedChallenge}
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}

      {challengeToApprove && (
        <ApproveChallenge
          open={!!challengeToApprove}
          onClose={() => setChallengeToApprove(null)}
          approvedCount={parseInt(challengeToApprove.problemSolvers.split("/")[0], 10)}
          problemSolversNeeded={parseInt(challengeToApprove.problemSolvers.split("/")[1], 10)}
          innovator="Innovator Name"
          approvedProblemSolvers={[
            "Problem Solver 1",
            "Problem Solver 2",
            "Problem Solver 3",
          ]}
          onChatCreated={(chat) => console.log("Chat created:", chat)}
        />
      )}

      <AllSubmissionsDialog
        submissions={fakeSubmissions}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onApprove={() => handleReviewSubmit(true)}
        onReject={() => handleReviewSubmit(false)}
      />
    </MainLayout>
  );
}
