import React, { useEffect, useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/dashboard/Client/components/ui/button";
import { Sidebar } from "@/dashboard/Client/components/layout/sidebar";
import { UserNav } from "@/dashboard/Client/components/layout/user-nav";
import { MobileNav } from "@/dashboard/Client/components/layout/mobile-nav";
import { NotificationsDropdown } from "@/dashboard/Client/components/notifications-dropdown";
import { getSocket } from "@/lib/socket";
import { toast } from "react-toastify";
import { useSocket } from "@/hooks/useSocket";

export function MainLayout({ children }: { children: React.ReactNode }) {
    useSocket();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const socket = getSocket();

        // Basic session and notification events
        socket.on("new_notification", (notif) => {
            toast.info(notif.title || "New notification");
        });

        socket.on("session_request:new", (payload) => {
            toast.info(payload.message || "New session request received!");
        });

        socket.on("session_request:confirmation", (payload) => {
            toast.success(payload.message || "Session request confirmed!");
        });

        return () => {
            socket.off("new_notification");
            socket.off("session_request:new");
            socket.off("session_request:confirmation");
        };
    }, []);

    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

            <div className="lg:pl-[240px] dashbg h-screen">
                <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b dark:border-gray-700 dashbg px-4 lg:w-[calc(100%-240px)]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-4 lg:hidden dark:text-white !bg-transparent"
                        onClick={() => setIsMobileNavOpen(true)}
                    >
                        <Menu className="h-8 w-8" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>

                    <div className="flex flex-1 items-center justify-between">
                        <div></div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 !bg-transparent"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                            >
                                {isDarkMode ? (
                                    <Moon className="h-5 w-5 dashtext" />
                                ) : (
                                    <Sun className="h-5 w-5 dashtext" />
                                )}
                            </Button>

                            {/* ✅ This handles notifications properly */}
                            <NotificationsDropdown />

                            <UserNav />
                        </div>
                    </div>
                </header>

                <main className="md:pt-16 pt-14 dashbg">{children}</main>
            </div>
        </div>
    );
}
