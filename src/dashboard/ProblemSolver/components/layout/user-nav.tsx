import { LogOut, Settings, ChevronDown } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/dashboard/ProblemSolver/components/ui/dropdown-menu"
import { Button } from "@/dashboard/ProblemSolver/components/ui/button"
import notificationService from "@/hooks/notificationService";


export function UserNav() {
    const  {user, logout} = notificationService()
    const navigate = useNavigate()


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    // Generate user initials from the first and last name
    const getUserInitials = () => {
        if (!user?.firstName || !user?.lastName) return "U"
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }

    // function that handles logout and redirects back to the homepage
    const handleLogOut = () => {
        logout()
        navigate("/")
    }

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full !bg-transparent">
                    <div className="flex h-8 w-8 -ml-3 items-center justify-center rounded-full uppercase dashbggreen text-white text-sm overflow-hidden">
                        {user?.profilePicture ? (
                            <img src={`${API_BASE_URL}${user.profilePicture}`} alt="" className={'h-full w-full object-cover rounded-full'}/>
                        ) : (
                            getUserInitials()
                        )}
                    </div>

                    <ChevronDown className={'h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180'}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mr-10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        {user.role && (
                            <p className={'text-xs leading-none text-muted-foreground'}>
                                {user.role}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <Link to={'/dashboard/ps/profile'}>Settings</Link>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className={'cursor-pointer'}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}