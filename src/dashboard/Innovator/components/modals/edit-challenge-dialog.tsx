

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Button } from "@innovator/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import type { Challenge } from "../../types"

interface EditChallengeDialogProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
}

export function EditChallengeDialog({ challenge, isOpen, onClose }: EditChallengeDialogProps) {
  // if (!challenge) return null;
  const [title, setTitle] = useState(challenge?.name || '')
  const [status, setStatus] = useState(challenge?.status || '')
  const [reward, setReward] = useState(challenge?.reward || 0)


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] secondbg dashtext max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Challenge
          </DialogTitle>
          <DialogDescription className="text-gray-400">Make changes to the challenge details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Challenge Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="secondbg" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="secondbg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reward">Reward Amount ($)</Label>
            <Input
              id="reward"
              type="number"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              className="secondbg"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Update challenge description..." className="h-32 secondbg" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="secondbg">
            Cancel
          </Button>
          <Button className="bg-[#00bf8f] hover:bg-[#31473A]">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

