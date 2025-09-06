

import { Trophy } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card } from "../../components/ui/card"

export function ViewResultsDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const winners = [
    {
      rank: 1,
      name: "Sarah Johnson",
      solution: "AI-Powered Energy Grid Optimization",
      reward: "$5,000",
    },
    {
      rank: 2,
      name: "Michael Chen",
      solution: "Smart Grid Load Balancing System",
      reward: "$3,000",
    },
    {
      rank: 3,
      name: "Emily Williams",
      solution: "Renewable Energy Integration Platform",
      reward: "$2,000",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] secondbg dashtext max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#f5d142]" />
            Challenge Results
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Final results for the Renewable Energy Challenge
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {winners.map((winner) => (
            <Card key={winner.rank} className="secondbg p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full secondbg">
                  <span className="text-xl font-bold">#{winner.rank}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{winner.name}</h3>
                  <p className="text-sm text-gray-400">{winner.solution}</p>
                </div>
                <div className="text-lg font-bold text-[#00bf8f]">{winner.reward}</div>
              </div>
            </Card>
          ))}

          <div className="rounded-lg secondbg p-4">
            <h3 className="mb-2 font-medium">Challenge Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#00bf8f]">24</div>
                <div className="text-sm text-gray-400">Total Submissions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00bf8f]">18</div>
                <div className="text-sm text-gray-400">Qualified Solutions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00bf8f]">$10K</div>
                <div className="text-sm text-gray-400">Total Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

