import { useState } from 'react'
import { Star, Download, X, BadgeCheck } from 'lucide-react'
import { Button } from '@innovator/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@innovator/components/ui/dialog"
import { Textarea } from "@innovator/components/ui/textarea"
import { Avatar, AvatarImage } from '@innovator/components/ui/avatar'
import { Badge } from '@innovator/components/ui/badge'
import { FullProfileDialog } from './ViewPSFullProfile'

export function SubmissionDetailsDialog({ submission, isOpen, onClose, onApprove, onReject }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileData = {
    name: "Vovant Space",
    image: submission?.image,
    country: "United States",
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
    portfolio: [
      {
        title: "AI Healthcare Platform",
        url: "https://example.com/healthcare-ai",
        description: "Developed ML system for patient diagnosis"
      }
    ]
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext max-w-2xl max-h-[90vh] overflow-y-auto border-[#2a3142]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            Submission Details

          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={submission?.image} />
            </Avatar>

            <div className="space-y-1 flex-grow">
              <div className='flex items-center gap-2'>
                <h2 className="text-xl font-semibold flex items-center gap-2 dashtext">
                  {submission?.name}

                </h2>

                <div
                  className="flex items-center text-sm underline gap-2 py-0.5 px-2  cursor-pointer "
                >
                  <span className=" font-semibold " onClick={() => { setProfileOpen(true) }}>View Profile</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <p className="dark:text-gray-300 text-black text-sm">{submission?.title}</p>
                <div className="h-1 w-1 bg-[#4a5568] rounded-full" />
                <p className="dark:text-gray-300 text-black text-sm">{submission?.country}</p>
              </div>
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <span className="dark:text-gray-300 text-black text-sm">{submission?.rate}$</span>
                <div className="h-1 w-1 bg-[#4a5568] rounded-full" />
                <span className="dark:text-gray-300 text-black text-sm">{submission?.earned} earned</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium dashtext">Solution Summary</h3>
              <p className="dark:text-gray-300 text-black text-sm leading-relaxed">
                Proposed solution using advanced ML algorithms to optimize crop yield prediction...
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium dashtext">Attachments</h3>
              <div className="space-y-2">
                {[
                  { name: "solution-architecture.pdf", size: "2.4 MB" },
                  { name: "prototype-demo.mp4", size: "8.7 MB" },
                ].map((file) => (
                  <div key={file.name} className="flex items-center justify-between secondbg p-3 rounded-lg border border-[#2a3142]">
                    <span className="text-sm dark:text-gray-300 text-black">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#4a5568]">{file.size}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 dashbutton">
                        <Download className="h-4 w-4 text-gray-300 " />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium dashtext">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button key={rating} variant="ghost" size="icon" className="h-8 w-8 text-gray-300  dashbutton">
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium dashtext">Feedback</h3>
              <Textarea
                placeholder="Provide detailed feedback..."
                className="h-24 secondbg border-[#2a3142] dark:text-gray-300 text-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
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
            </Button>
          </div>
        </div>
      </DialogContent>
      <FullProfileDialog
        profile={profileData}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </Dialog>
  )
}