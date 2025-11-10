import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/dashboard/Innovator/components/ui/dialog"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Input } from "@/dashboard/Innovator/components/ui/input"
import { Label } from "@/dashboard/Innovator/components/ui/label"
import { Switch } from "@/dashboard/Innovator/components/ui/switch"
import { Mic, X, Plus, Send } from "lucide-react"
import { PollData } from "@/dashboard/Innovator/types"

interface PollCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (pollData: PollData) => void
}

export function PollCreator({ isOpen, onClose, onSubmit }: PollCreatorProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
        setAudioUrl(URL.createObjectURL(blob))
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = () => {
    if (!question || options.filter(Boolean).length < 2) return

    const pollData: PollData = {
      question,
      options: options.filter(Boolean).map((text, id) => ({ id, text, votes: 0 })),
      allowMultiple,
      audioUrl,
    }

    onSubmit(pollData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Create Poll
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {index > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <Button variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="multiple" checked={allowMultiple} onCheckedChange={setAllowMultiple} />
              <Label htmlFor="multiple">Allow Multiple Answers</Label>
            </div>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          {audioUrl && (
            <div className="space-y-2">
              <Label>Audio Preview</Label>
              <audio controls src={audioUrl} className="w-full" />
              <Button variant="ghost" size="sm" onClick={() => setAudioUrl(undefined)}>
                Remove Audio
              </Button>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

