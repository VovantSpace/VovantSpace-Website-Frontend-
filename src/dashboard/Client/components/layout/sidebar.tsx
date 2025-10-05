

import { Home, FileText, MessageSquare, BarChart2, Wallet, User } from "lucide-react"
import logo from '@/assets/logo.png'
import { useLocation, Link } from "react-router-dom"
import { Bell } from "lucide-react"
import { cn } from "@/dashboard/Innovator/lib/utils"

const sidebarLinks = [
  { icon: Home, label: "Home", href: "/dashboard/client" },
  { icon: FileText, label: "Find a Advisor/Mentor", href: "/dashboard/client/find-a-mentor" },
  { icon: BarChart2, label: "My Sessions", href: "/dashboard/client/my-sessions" },
  { icon: MessageSquare, label: "Session Chats", href: "/dashboard/client/chats" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/client/wallet" },
  { icon: Bell, label: "Alerts", href: "/dashboard/client/alerts" },
]

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <div className="fixed left-0 top-0 hidden h-screen bottom-0 dashbg w-[240px] lg:block">
      <div className="h-[80vh]">
        <div className="flex h-14 items-center border-b dark:border-gray-700 px-4">
          <Link to="/" className="text-xl font-bold text-[#00bf8f]">
            <img
              src={logo}
              alt="VovantSpace logo"
              className="w-28 md:w-32 h-full p-2 transition-transform duration-300 hover:scale-105 bg-black"

            />
          </Link>
        </div>
        <nav className="p-4 ">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive ? "dashbggreen text-white" : "dashtext",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div>
        </div>
      </div>
      <div className="flex items-center h-14 uppercase px-7 ">
        <div className="border border-gray-700 dark:border-gray-300  rounded-full p-1">
          <Link 
            to="/dashboard/client/profile" 
            className="dashtext text-sm font-medium hover:underline flex items-center justify-center"
            onClick={(e) => {
              // Prevent default link behavior
              e.preventDefault();
              // Force a full page navigation to ensure proper routing
              window.location.href = '/dashboard/client/profile';
            }}
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-around uppercase h-14 px-14 border-t dark:border-gray-700">
        <Link to={'/help'} className="dashtext text-sm font-medium hover:underline">
          Help
        </Link>
        <Link to={'/faq'} className="dashtext text-sm font-medium hover:underline">
          Faq
        </Link>
      </div>
    </div>
  )
}