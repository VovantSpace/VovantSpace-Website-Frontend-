import { useState } from 'react'
import { ChevronRight, BadgeCheck, X } from 'lucide-react'
import { Button } from '@innovator/components/ui/button'
import { Avatar, AvatarImage } from '@innovator/components/ui/avatar'
import { Badge } from '@innovator/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@innovator/components/ui/dialog"
import { SubmissionDetailsDialog } from './SubmissionDetailsDialog'

export function AllSubmissionsDialog({ submissions, isOpen, onClose, onApprove, onReject }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext md:max-w-2xl max-h-[90vh] overflow-y-auto border-[#2a3142]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            All Submissions

          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="secondbg p-4 rounded-xl flex items-center hover:bg-[#1a2230] transition-colors border border-[#2a3142]">
              <div className='md:flex items-center justify-between w-full'>
                <div>
                  <Avatar className="h-14 w-14 mr-4 border dashborder ">
                    <AvatarImage src={submission.image} />

                  </Avatar>

                  <div className="flex-grow">
                    <div className="flex items-center ">
                      <h2 className="text-lg font-semibold flex mt-2 items-center gap-2 dashtext">
                        {submission.name}

                      </h2>
                    </div>
                    <p className="text-[#6b7280] text-sm">{submission.title}</p>
                    <div className="flex items-center mt-2 gap-2 text-sm">
                      <span className="text-[#6b7280]">{submission.rate}$</span>
                      <div className="h-1 w-1 bg-[#4a5568] rounded-full" />
                      <span className="text-[#6b7280]">{submission.successRate} Job Success</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:mt-0 mt-6">
                  {/* <Button
                    onClick={onReject}
                    className=" bg-red-700 text-white  border hover:bg-red-800 border-red-500/30"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={onApprove}
                    className=" bg-green-700 text-white border hover:bg-green-800 border-[#00bf8f]/30"
                  >
                    Approve
                  </Button> */}

                  <div className="flex flex-col items-center justify-center gap-2 ">
                    <Button
                      variant="outline"
                      className=" dashbutton text-white border "
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SubmissionDetailsDialog
          submission={selectedSubmission}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      </DialogContent>
    </Dialog>
  )
}