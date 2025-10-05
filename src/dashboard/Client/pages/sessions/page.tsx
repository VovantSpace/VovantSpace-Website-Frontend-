import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/dashboard/Innovator/components/ui/tabs"
import { SessionCard } from "@/dashboard/Client/components/session-card"
import { PaymentConfirmationDialog } from "@/dashboard/Client/components/payment-confirmation-dialog"
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout"

export default function MySessions() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const upcomingSessions = [
    {
      id: "1",
      mentor: {
        name: "James Wilson",
        initial: "J",
      },
      title: "Career Development Strategy",
      date: "Wednesday, March 20",
      time: "3:00 PM",
      duration: "30 minutes",
      status: "confirmed" as const,
      // paymentRequired: {
      //   timeRemaining: "4:56",
      // },
    },
    {
      id: "2",
      mentor: {
        name: "Emma Thompson",
        initial: "E",
      },
      title: "Technical Interview Preparation",
      date: "Thursday, March 21",
      time: "11:00 AM",
      duration: "30 minutes",
      status: "pending_payment" as const,
      paymentRequired: {
        timeRemaining: 300,
      },
    },
  ]

  const completedSessions = [
    {
      id: "3",
      mentor: {
        name: "Michael Brown",
        initial: "M",
      },
      title: "System Design Fundamentals",
      date: "Friday, March 15",
      time: "2:00 PM",
      duration: "30 minutes",
      status: "completed" as const,
      review: {
        text: "Excellent session! Michael explained complex concepts very clearly.",
        rating: 5,
      },
    },
  ]


  const handleCompletePayment = () => {
    setIsPaymentDialogOpen(true)
  }

  const handleConfirmPayment = () => {
    setIsPaymentDialogOpen(false)
    // Handle payment confirmation logic
  }

  return (
    <MainLayout>
    <div className="min-h-screen p-4 ">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">My Sessions</h1>
       
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full justify-start border-b bg-transparent p-0">
          <TabsTrigger
            value="upcoming"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
          >
            Upcoming
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">2</span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.map((session) => (
            <SessionCard
              key={session.id}
              mentor={session.mentor}
              title={session.title}
              date={session.date}
              time={session.time}
              duration={session.duration}
              status={session.status}
              paymentRequired={session.paymentRequired}
              onCancel={() => {}}
              onCompletePayment={handleCompletePayment}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSessions.map((session) => (
            <SessionCard
              key={session.id}
              mentor={session.mentor}
              title={session.title}
              date={session.date}
              time={session.time}
              duration={session.duration}
              status={session.status}
              review={session.review}
            />
          ))}
        </TabsContent>

  
      </Tabs>

      {/* Payment dialog */}
      <PaymentConfirmationDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        sessionDetails={{
          mentor: "Emma Thompson",
          topic: "Technical Interview Preparation",
          date: "Thursday, March 21",
          time: "11:00 AM",
          duration: "30 minutes",
        }}
        paymentDetails={{
          sessionFee: 50.0,
          serviceFee: 2.5,
          totalAmount: 52.5,
        }}
        timeLimit={242} // 4:02 in seconds
        onConfirm={handleConfirmPayment}
      />
    </div>
    </MainLayout>
  )
}

