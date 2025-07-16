import { useState } from "react";
import { Clock, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@innovator/components/ui/button";
import { StatsCard } from "../components/modals/StatsCard";
import { DaySelector } from "../components/modals/DaySelector";
import { SessionCard } from "../components/modals/SessionCard";
import { MainLayout } from "../components/layout/main-layout";
import { Link } from "react-router-dom";
import { RescheduleSession } from "../components/modals/RescheduleSession";

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState(3);
  const [sessionType, setSessionType] = useState("upcoming");


  // Simulated upcoming sessions data keyed by day
  const upcomingSessionsByDay = {
    1: [
      {
        initial: "A",
        title: "Strategy Meeting",
        time: "10:00 AM",
        duration: "30 minutes",
        details: {
          type: "One-Time",
          duration: "30 minutes",
          discussion: "Discuss quarterly goals",
        },
      },
      {
        initial: "B",
        title: "Client/Mentee Call",
        time: "11:00 AM",
        duration: "45 minutes",
        details: {
          type: "Recurring",
          duration: "45 minutes",
          discussion: "Discuss project updates",
        },
      },
    ],
    2: [
      {
        initial: "C",
        title: "Team Standup",
        time: "09:00 AM",
        duration: "15 minutes",
        details: {
          type: "Daily",
          duration: "15 minutes",
          discussion: "Daily update",
        },
      },
    ],
    3: [
      {
        initial: "D",
        title: "Career Development",
        time: "3:00 PM",
        duration: "30 minutes",
        details: {
          type: "One-Time",
          duration: "30 minutes",
          discussion: "Discuss transition to management role",
        },
      },
      {
        initial: "E",
        title: "Technical Mentoring",
        time: "11:00 AM",
        duration: "30 minutes",
        details: {
          type: "Weekly",
          duration: "30 minutes",
          discussion: "Code review and architecture discussion",
        },
      },
    ],
    4: [
      {
        initial: "F",
        title: "Product Review",
        time: "2:00 PM",
        duration: "40 minutes",
        details: {
          type: "One-Time",
          duration: "40 minutes",
          discussion: "Review product roadmap",
        },
      },
    ],
    5: [
      {
        initial: "G",
        title: "Marketing Sync",
        time: "10:00 AM",
        duration: "30 minutes",
        details: {
          type: "Recurring",
          duration: "30 minutes",
          discussion: "Weekly marketing update",
        },
      },
    ],
    6: [],
    7: []
  };


  // Determine sessions to show based on sessionType and day selection
  const sessionsToShow =
    sessionType === "upcoming" ? (upcomingSessionsByDay[selectedDay] || []) : [];

  const days = [
    { name: "Sun", date: 1, isToday: false, isSelected: selectedDay === 1 },
    { name: "Mon", date: 2, isToday: false, isSelected: selectedDay === 2 },
    { name: "Tue", date: 3, isToday: true, isSelected: selectedDay === 3 },
    { name: "Wed", date: 4, isToday: false, isSelected: selectedDay === 4 },
    { name: "Thu", date: 5, isToday: false, isSelected: selectedDay === 5 },
    { name: "Fri", date: 6, isToday: false, isSelected: selectedDay === 6 },
    { name: "Sat", date: 7, isToday: false, isSelected: selectedDay === 7 },
  ];

  return (
    <MainLayout>
      <div className="p-4  dark:text-white">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <StatsCard
            title="Total Sessions This Month"
            value="125"
            icon={Clock}
            change={{ value: "13.6% vs last month", positive: true }}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatsCard
            title="Active Client/Mentee"
            value="15"
            icon={Users}
            change={{ value: "25% vs last month", positive: true }}
            iconBgColor="bg-gray-200 dark:bg-gray-700"
          />
          {/* <StatsCard
            title="Earnings This Month"
            value="$2500"
            icon={DollarSign}
            subtitle="Total: $18750"
            change={{ value: "13.6% vs last month", positive: true }}
            iconBgColor="bg-gray-200 dark:bg-gray-700"
          /> */}
          <StatsCard
            title="Average Rating"
            value="4.9"
            icon={Star}
            subtitle="120 Reviews"
            iconBgColor="bg-gray-200 dark:bg-gray-700"
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              Upcoming Sessions
            </h2>

          </div>
          <DaySelector days={days} onSelectDay={setSelectedDay} />
          <div className="mt-4">
            {sessionsToShow?.map((session, index) => (
              <SessionCard key={index} {...session} />
            ))}
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <Link to="requests">
          <Button className="dashbutton rounded-full p-4 text-white shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            View Requests
          </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
