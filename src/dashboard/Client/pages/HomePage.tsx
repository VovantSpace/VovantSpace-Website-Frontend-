import { useState } from "react"
import { Clock, BarChart2, Calendar, UserPlus, MessageSquare, GraduationCapIcon as Graduation } from "lucide-react"
import { Button } from "@innovator/components/ui/button"
import { SessionCard } from "@client/components/session-card"
import { PaymentConfirmationDialog } from "@client/components/payment-confirmation-dialog"
import { MainLayout } from "../components/layout/main-layout"
import { Link } from "react-router-dom"

export default function HomePage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const stats = [
    {
      title: "Sessions Completed",
      value: "12",
      icon: Clock,
      color: "bg-emerald-500",
    },
    {
      title: "Total Sessions",
      value: "24",
      icon: BarChart2,
      color: "bg-blue-500",
    },
    {
      title: "Next Session",
      value: "Mar 20, 3:00 PM",
      icon: Calendar,
      color: "bg-purple-500",
    },
  ]

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
        timeRemaining: "4:56",
      },
    },
  ]

  const notifications = [
    {
      id: "1",
      message: "Your session with John Smith starts in 30 minutes",
      time: "5 minutes ago",
      icon: Calendar,
    },
    {
      id: "2",
      message: "Payment confirmed for upcoming session",
      time: "10 minutes ago",
      icon: Clock,
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
    <div className="min-h-screen dashbg p-4 ">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-start gap-4 rounded-lg bg-card p-4 shadow-sm secondbg">
            <div className={`rounded-lg ${stat.color} p-3 text-white`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium dark:text-white">{stat.title}</h3>
              <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming sessions */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold dark:text-white">Upcoming Sessions</h2>
        <div className="space-y-4">
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
              onCompletePayment={handleCompletePayment}
            />
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          <button className="text-sm text-primary hover:underline dark:text-white">Show All</button>
        </div>
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start secondbg dark:!text-white gap-3 rounded-lg bg-card p-4 shadow-sm">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <notification.icon className="h-5 w-5 dark:!text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="mt-1 text-xs text-muted-foreground dark:!text-gray-300">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


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

