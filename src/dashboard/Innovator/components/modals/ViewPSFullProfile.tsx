import {
  Star,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  Globe,
  Calendar,
  FileText,
  X
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@innovator/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from '@innovator/components/ui/avatar'
import { Badge } from '@innovator/components/ui/badge'
import { Button } from '@innovator/components/ui/button'
import tick from '@/assets/tick.png'

export function FullProfileDialog({ profile, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a3142] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            Problem Solver Profile
          </DialogTitle>
        </DialogHeader>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-20 w-20 border-4 border-emerald-500/30">
            <AvatarImage src={profile?.image} />
            <AvatarFallback className=" bg-emerald-500/20">
              {profile?.name?.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold">{profile?.name}</h1>
              <img src={tick} className='w-5' alt="" />
            </div>

            <div className="flex flex-wrap gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{profile?.country}</span>
              </div>
              <div className="flex items-center text-sm md:text-base gap-1 text-gray-700 dark:text-gray-300">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9 (127 reviews)</span>
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2">
              AI Engineer
            </p>
          </div>
        </div>

        {/* Education Section */}
        <section className="pt-1 space-y-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center">
              About:
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              Senior AI Engineer with 8+ years experience building healthcare solutions
            </p>
          </div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {/* <GraduationCap className="h-5 w-5 text-emerald-400" /> */}
            About Problem Solver:
          </h2>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            Education
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {profile.education.map((edu, index) => (
              <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-base font-semibold">{edu.institution}</h3>
                  <div className="text-xs text-emerald-400 relative md:left-6 bottom-4 w-48">{edu.degree}</div>
                </div>
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>{edu.field}</span>
                  </div>
                  <div className="flex items-center text-sm gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="pt-3 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Certifications
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">{cert.name}</h3>
                  <Badge variant="outline" className="text-emerald-400 text-xs text-center">
                    {cert.date}
                  </Badge>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="pt-3 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Portfolio
          </h2>

          <div className="space-y-4">
            {profile.portfolio.map((project, index) => (
              <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold">{project.title}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 text-sm hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Project
                  </a>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Innovator Reviews (127)
          </h2>

          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="secondbg p-4 rounded-xl border border-[#2a3142]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-base">John Carter</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">Healthcare Startup CEO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-sm">4.8</span>
                  </div>
                </div>
                <div className=''>
                <img src="https://codewithrafay.netlify.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.8438b86a.png&w=1080&q=75" className='w-96' alt="" />
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                  "Absolutely phenomenal work! Delivered beyond expectations and provided
                  valuable insights we hadn't even considered. Will definitely work with again."
                </p>
                </div>
                <div className="text-xs text-gray-500 mt-2">March 15, 2023</div>
              </div>
            ))}
          </div>
        </section>

        {/* <div className="pt-6 flex justify-center">
            <Button className="dashbutton bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-6 py-3 text-base">
              Contact Innovator
            </Button>
          </div> */}
      </DialogContent>
    </Dialog>
  )
}
