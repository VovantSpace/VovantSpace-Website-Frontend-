import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@innovator/components/ui/dialog"
import { Button } from "@innovator/components/ui/button"
import { Input } from "@innovator/components/ui/input"
import { Label } from "@innovator/components/ui/label"
import { Calendar } from "@innovator/components/ui/calendar"

import { Monitor, Mic, Video, VideoOff, MicOff, PhoneOff, Users, Phone } from "lucide-react"
import type { CallData } from "./types"

interface VideoCallDialogProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (data: CallData) => void
  mode: "schedule" | "ongoing"
  type?: "video" | "audio"
  initialData?: CallData
}

export function VideoCallDialog({ isOpen, onClose, mode, type = 'video' }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (mode === 'ongoing' && type === 'video') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream)
          const videoElement = document.getElementById('local-video') as HTMLVideoElement
          if (videoElement) videoElement.srcObject = stream
        })
        .catch(console.error)
    }
    return () => {
      localStream?.getTracks().forEach(track => track.stop())
    }
  }, [mode])

  const toggleMedia = async (type: 'video' | 'audio') => {
    if (type === 'video') {
      setIsVideoEnabled(!isVideoEnabled)
      localStream?.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled)
    } else {
      setIsAudioEnabled(!isAudioEnabled)
      localStream?.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled)
    }
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const videoElement = document.getElementById('local-video') as HTMLVideoElement
        videoElement.srcObject = screenStream
        setIsScreenSharing(true)
      } catch (error) {
        console.error('Screen sharing failed:', error)
      }
    } else {
      localStream?.getVideoTracks().forEach(track => track.stop())
      setIsScreenSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid grid-cols-3 h-[600px]">
          {/* Main Video Area */}
          <div className="col-span-2 bg-black relative">
            <video
              id="local-video"
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button
                variant={isVideoEnabled ? 'default' : 'secondary'}
                size="icon"
                onClick={() => toggleMedia('video')}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={isAudioEnabled ? 'default' : 'secondary'}
                size="icon"
                onClick={() => toggleMedia('audio')}
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="icon"
                onClick={toggleScreenShare}
              >
                <Monitor className="h-5 w-5" />
              </Button>
              <Button variant="destructive" size="icon" onClick={onClose}>
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="bg-background p-4 border-l">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants (4)
            </h3>
            <div className="space-y-4">
              {['User 1', 'User 2', 'User 3', 'You'].map((user, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent rounded">
                  <div className="relative">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <VideoOff className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <p className="font-medium">{user}</p>
                    <p className="text-sm text-muted-foreground">{user === 'You' ? 'Host' : 'Participant'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

