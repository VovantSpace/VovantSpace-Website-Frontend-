import { Button } from "@/dashboard/Innovator/components/ui/button"
import  StarRating  from "@/dashboard/Client/components/star-rating"
import { AvatarInitial } from "@/dashboard/Client/components/avatar-initial"

interface MentorCardProps {
  mentor: {
    id: string
    name: string
    initial: string
    rating: number
    reviewCount: number
    bio: string
    tags: string[]
    price: number
  }
  onBookNow: (mentorId: string) => void
  onSeeProfile: (mentorId: string) => void
}

export function MentorCard({ mentor, onBookNow, onSeeProfile }: MentorCardProps) {
  return (
    <div className="rounded-lg bg-card p-4 shadow-sm secondbg dark:!text-white">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <AvatarInitial initial={mentor.initial} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{mentor.name}</h3>
              <button onClick={() => onSeeProfile(mentor.id)} className="text-sm text-primary underline dark:!text-white">
                See Profile
              </button>
            </div>
            <div className="mt-1">
              <StarRating rating={mentor.rating} showCount count={mentor.reviewCount} />
            </div>
            <p className="mt-2 text-sm">{mentor.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {mentor.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-xs !text-white dashbutton">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl font-bold text-primary dark:!text-white">${mentor.price}</div>
          <div className="text-sm text-muted-foreground dark:!text-white">per session</div>
          <Button className="mt-4 dashbutton" onClick={() => onBookNow(mentor.id)}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )
}

