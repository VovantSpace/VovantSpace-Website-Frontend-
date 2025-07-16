import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent } from "@innovator/components/ui/dialog"
import { Button } from "@innovator/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@innovator/components/ui/radio-group"
import { Label } from "@innovator/components/ui/label"
import { Camera, Upload, Globe, CheckCircle2, ArrowLeft, RefreshCcw } from "lucide-react"
import Webcam from "react-webcam"
import { useDropzone } from "react-dropzone"
import CountrySelector from "@/components/signup/CountrySelector"
import { ScrollArea } from "@/dashboard/Innovator/components/ui/scroll-area"

interface VerificationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  isCompleted: boolean
}

interface IdentityVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function IdentityVerificationDialog({ isOpen, onClose }: IdentityVerificationDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [idImage, setIdImage] = useState<string | null>(null)
  const [countryOption, setCountryOption] = useState("keep")
  const webcamRef = useRef<Webcam | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [newCountry, setNewCountry] = useState("")

  const steps: VerificationStep[] = [
    {
      id: "camera",
      title: "Appear on camera",
      description: "Take a selfie or join a video chat for verification",
      icon: <Camera className="h-5 w-5" />,
      isCompleted: !!selfieImage,
    },
    {
      id: "id",
      title: "Upload government ID",
      description: "We'll match your ID country with your profile",
      icon: <Upload className="h-5 w-5" />,
      isCompleted: !!idImage,
    },
    {
      id: "country",
      title: "Country information",
      description: "Verify or update your country details",
      icon: <Globe className="h-5 w-5" />,
      isCompleted: !!countryOption,
    },
    {
      id: "review",
      title: "Submit for review",
      description: "Final verification and submission",
      icon: <CheckCircle2 className="h-5 w-5" />,
      isCompleted: false,
    },
  ]

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setSelfieImage(imageSrc)
      setIsCameraActive(false)
    }
  }, [])

  const handleRetake = () => {
    setSelfieImage(null)
    setIsCameraActive(true)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setIdImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
  })

  const handleNext = () => currentStep < steps.length - 1 && setCurrentStep(p => p + 1)
  const handleBack = () => currentStep > 0 && setCurrentStep(p => p - 1)

  const handleSubmit = () => {
    console.log({ selfieImage, idImage, countryOption })
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col h-full gap-4">
            <div className="flex-1">
              {!selfieImage && !isCameraActive && (
                <div className="text-center space-y-4 h-full flex flex-col ">
                  <div className="aspect-square mx-auto max-w-[400px] w-full bg-gray-800 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Camera className="h-12 w-12 mx-auto text-gray-400" />
                      <Button onClick={() => setIsCameraActive(true)} size="lg">
                        Enable Camera
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 px-4">
                    Ensure good lighting and face the camera directly
                  </p>
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="relative aspect-square mx-auto max-w-[400px] w-full rounded-2xl overflow-hidden bg-gray-900">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{ facingMode: "user" }}
                    />
                    <div className="absolute inset-0 border-4 border-emerald-400/20 rounded-2xl pointer-events-none" />
                    <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-300">
                      Position your face within the frame
                    </div>
                  </div>
                  <Button onClick={handleCapture} size="lg" className="w-full dashbutton mt-auto">
                    Capture Photo
                  </Button>
                </div>
              )}

              {selfieImage && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="relative aspect-square mx-auto max-w-[400px] w-full rounded-2xl overflow-hidden">
                    <img
                      src={selfieImage}
                      alt="Captured selfie"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl" />
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <Button
                      variant="outline"
                      onClick={handleRetake}
                      className="flex-1 py-3 dashbutton text-white"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button onClick={handleNext} className="flex-1 py-3 dashbutton">
                      Looks Good
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="flex flex-col h-full gap-4">
            <div
              {...getRootProps()}
              className={`group flex-1 rounded-2xl border-2 border-dashed p-4 text-center transition-colors
                ${isDragActive ? "border-emerald-500 bg-emerald-500/10" : "border-gray-700 hover:border-emerald-500"}
                ${idImage ? "border-solid bg-gray-800" : "cursor-pointer"} flex items-center justify-center min-h-[300px]`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4 w-full">
                {idImage ? (
                  <>
                    <img
                      src={idImage}
                      alt="Uploaded ID"
                      className="max-h-64 mx-auto rounded-lg border border-gray-700"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Click or drag to replace file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex p-4 bg-gray-800 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium dark:text-white">Drag ID document here</p>
                      <p className="text-sm text-gray-400">
                        Supported formats: JPEG, PNG (Max 5MB)
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 dashbutton text-white">
                        Select File
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            {idImage && (
              <Button onClick={handleNext} size="lg" className="w-full dashbutton mt-auto">
                Continue
              </Button>
            )}
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col h-full gap-4">
            <div className="space-y-4 flex-1">
              <div className="p-2 rounded-xl bg-gray-800">
                <p className="text-sm text-gray-300">
                  Current profile country:{" "}
                  <span className="font-semibold text-emerald-500">United States</span>
                </p>
              </div>

              <RadioGroup value={countryOption} onValueChange={setCountryOption} className="space-y-2">
                {[
                  { value: "keep", label: "Keep current country", description: "ID matches profile country" },
                  { value: "update", label: "Update country", description: "ID from different country" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-4 p-4 rounded-xl border border-gray-700 hover:border-emerald-500/50 has-[:checked]:border-emerald-500/30 has-[:checked]:bg-emerald-500/10 transition-colors"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="mt-1 h-5 w-5 border-2 border-gray-600 text-emerald-500"
                    />
                    <Label htmlFor={option.value} className="flex flex-col">
                      <span className="font-medium dark:text-white">{option.label}</span>
                      <span className="text-sm text-gray-400 mt-1">{option.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {countryOption === "update" && (
                <div className="mt-2">
                  <Label htmlFor="new-country" className="block text-sm dark:text-white font-medium mb-1">
                    New Country
                  </Label>
                  <CountrySelector/>
                </div>
              )}
            </div>
            <Button onClick={handleNext} size="lg" className="w-full dashbutton mt-auto">
              Confirm Selection
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col h-full gap-4">
            <div className="space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-gray-800 space-y-2 text-white">
                <h3 className="font-semibold text-sm">Verification Summary</h3>
                <div className="space-y-2">
                  {steps.slice(0, -1).map((step) => (
                    <div key={step.id} className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs">{step.title}</p>
                        <p className="text-xs text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            <Button
              onClick={handleSubmit}
              size="md"
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 text-sm dashbutton mt-auto"
            >
              Submit Verification
            </Button>
              <div className="text-center space-y-2 px-4">
                <p className="text-xs text-gray-400">
                  By submitting, you confirm the authenticity of provided information.
                  False submissions may result in account suspension.
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <ScrollArea>
      <DialogContent className="max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-[#1a281f] flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 px-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="rounded-full hover:bg-gray-800 text-white dashbutton"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Identity Verification</h2>
                <p className="text-gray-400 text-sm">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-1">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-1 w-6 rounded-full transition-all ${index <= currentStep ? "bg-emerald-500" : "bg-gray-700"}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 ">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8 h-full">
              {/* Steps */}
              <div className="hidden lg:block space-y-2 border-r border-gray-800 pr-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`group flex items-start gap-4 p-4 py-2 rounded-xl transition-colors dark:text-white ${index === currentStep ? "bg-gray-800 text-white" : ""}`}
                  >
                    <div className={`p-2 rounded-lg ${index === currentStep ? "bg-emerald-500/20 text-emerald-500" : "bg-gray-700 text-gray-400"}`}>
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="pb-4 h-full">{renderStepContent()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
       </ScrollArea>
    </Dialog>
  )
}