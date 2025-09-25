import { LogOut, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/dashboard/Innovator/components/ui/dropdown-menu"
import { Button } from "@/dashboard/Innovator/components/ui/button"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full !bg-transparent">
          <div className="flex h-8 w-8 -ml-3 items-center justify-center rounded-full uppercase dashbggreen text-white text-sm ">
            vs
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-10" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Vovant</p>
            <p className="text-xs leading-none text-muted-foreground">vovant@example.com</p>
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
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}