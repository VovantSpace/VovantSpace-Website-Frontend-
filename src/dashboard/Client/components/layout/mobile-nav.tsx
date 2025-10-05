

import { Home, MessageSquare, FileText, BarChart2, Wallet, User, X } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import logo from '@/assets/logo.png'
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Sheet, SheetContent } from "@/dashboard/Innovator/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react";

const mobileLinks = [
  { icon: Home, label: "Home", href: "/dashboard/client" },
  { icon: FileText, label: "Find a Advisor/Mentor", href: "/dashboard/client/find-a-mentor" },
  { icon: BarChart2, label: "My Sessions", href: "/dashboard/client/my-sessions" },
  { icon: MessageSquare, label: "Session Chats", href: "/dashboard/client/chats" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/client/wallet" },
  { icon: Bell, label: "Alerts", href: "/dashboard/client/alerts" },
]

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { pathname } = useLocation()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] secondbg p-0">
        <div className="flex h-16 items-center  px-4">
          <Link to="/" className="text-xl font-bold text-[#00bf8f]">
            <img
              src={logo}
              alt="VovantSpace logo"
              className="w-28 md:w-32 lg:w-40 p-2 transition-transform duration-300 hover:scale-105 bg-black"

            />
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden dark:text-white" onClick={onClose}>
            <X className="h-8 w-8" />
          </Button>
        </div>
        <nav className="p-4 pr-0 h-[71vh]">
          {mobileLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
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
        <div className="flex items-center h-14 uppercase px-7 ">
          <div className="border border-gray-700 dark:border-gray-300 rounded-full p-1">
            <Link to={'/dashboard/client/profile'} className="dashtext  text-sm font-medium hover:underline">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-around h-14 uppercase border-t px-14 dark:border-gray-700">
          <Link to={'/help'} className="dashtext text-sm font-medium hover:underline">
            Help
          </Link>
          <Link to={'/faq'} className="dashtext text-sm font-medium hover:underline">
            Faq
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}