import { useState } from "react"
import { Button } from "@innovator/components/ui/button"
import { Progress } from "@innovator/components/ui/progress"
import type { PollData } from "./types"

interface PollViewProps {
  pollData: PollData
  onVote: (optionIds: number[]) => void
  userVotes?: number[]
  className?: string
}

export function PollView({ pollData, onVote, userVotes = [], className = "" }: PollViewProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(userVotes)
  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0)

  const handleOptionClick = (optionId: number) => {
    if (userVotes.length > 0) return // Already voted

    if (pollData.allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      onVote(selectedOptions)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-medium">{pollData.question}</h3>

      {pollData.audioUrl && <audio controls src={pollData.audioUrl} className="w-full" />}

      <div className="space-y-2">
        {pollData.options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          const isSelected = selectedOptions.includes(option.id)
          const hasVoted = userVotes.length > 0

          return (
            <div
              key={option.id}
              className={`p-2 rounded-lg border transition-colors ${isSelected ? "border-primary" : "border-input"
                } ${hasVoted ? "cursor-default" : "cursor-pointer hover:bg-accent"}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="flex justify-between mb-1">
                <span>{option.text}</span>
                {hasVoted && <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>}
              </div>
              {hasVoted && <Progress value={percentage} className="h-2" />}
            </div>
          )
        })}
      </div>

      {!userVotes.length && selectedOptions.length > 0 && (
        <Button onClick={handleVote} className="w-full">
          Vote
        </Button>
      )}

      {userVotes.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}

