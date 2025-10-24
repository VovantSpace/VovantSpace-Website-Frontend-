import {Bell, Trash, CheckCheck, Loader2, Wifi, WifiOff} from "lucide-react"
import {format, formatDistanceToNow} from "date-fns"
import React, {useState, useEffect} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/dashboard/Innovator/components/ui/dropdown-menu"
import {Button} from "@/dashboard/ProblemSolver/components/ui/button"
import {ScrollArea} from "@/dashboard/Innovator/components/ui/scroll-area"
import {Badge} from '@/dashboard/Innovator/components/ui/badge'
import {useNotifications} from '@/hooks/userService'
import {useNotificationHandler} from "@/utils/handleNotificationClick";


const getNotificationTypeColor = (type: string) => {
    const colors = {
        submission: 'bg-blue-100 text-blue-800 border-blue-200',
        review: 'bg-orange-100 text-orange-800 border-orange-200',
        deadline: 'bg-red-100 text-red-800 border-red-200',
        message: 'bg-green-100 text-green-800 border-green-200',
        challenge: 'bg-purple-100 text-purple-800 border-purple-200',
        system: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[type as keyof typeof colors] || colors.system
}

const getNotificationIcon = (type: string) => {
    const icons = {
        submission: "📝",
        review: "👀",
        deadline: "⏰",
        message: "💬",
        challenge: "🎯",
        system: "🔔",
        session: "📅",
        mentor: "👨‍🏫",
    }
    return icons[type as keyof typeof icons] || icons.system
}

export function NotificationsDropdown() {
    const {
        notifications,
        unreadCount,
        loading,
        error,
        connected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications
    } = useNotifications("mentor")

    const {handleNotificationClick} = useNotificationHandler()



    const handleNotificationSelect = async (notification: any) => {
        try {
            if (!notification.isRead) {
                await markAsRead(notification._id)
            }

            // Navigate to the notification's link
            handleNotificationClick(notification)
        } catch (err) {
            console.error('Failed to handle notification selection:', err)
        }
    }

    const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        try {
            await deleteNotification(notificationId)
        } catch (err) {
            console.error('Failed to delete notification:', err)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead()
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err)
        }
    }

    const handleRefresh = () => {
        fetchNotifications()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-400 dashtext !bg-transparent">
                    <Bell className="h-5 w-5"/>
                    {unreadCount > 0 && (
                        <Badge
                            className={'absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white flex items-center justify-center border-2 border-background'}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[400px]  dashtext">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                        <div className={'flex items-center gap-2'}>
                            <h4 className="text-lg font-semibold dark:text-black">Notifications</h4>
                            {loading && <Loader2 className={'h-4 w-4 animate-spin'}/>}
                            {connected ? (
                                <Wifi className={'h-4 w-4 text-green-500'} />
                            ) : (
                                <WifiOff className={'h-4 w-4 text-red-500'}/>
                            )}
                        </div>
                        <div className={'flex gap-1'}>
                            <Button
                                variant={'ghost'}
                                size={'sm'}
                                onClick={handleRefresh}
                                disabled={loading}
                                className={'text-sm text-[#00bf8f] hover:text-[#00bf8f]/80'}
                            >
                                Refresh
                            </Button>
                            {unreadCount > 0 && (
                                <Button
                                    variant={'ghost'}
                                    size={'sm'}
                                    onClick={handleMarkAllAsRead}
                                    disabled={loading}
                                    className={'text-sm text-[#00bf8f] hover:text-[#00bf8f]/80'}
                                >
                                    <CheckCheck className={'h-4 w-4 mr-1'}/>
                                    Mark all read
                                </Button>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                {error && (
                    <div className={'p-4 text-center'}>
                        <p className={'text-sm text-red-500 mb-2'}>{error}</p>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            onClick={handleRefresh}
                            className={'text-xs'}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {!error && notifications.length === 0 && !loading && (
                    <div className={'p-8 text-center'}>
                        <Bell className={'h-12 w-12 text-gray-300 mx-auto mb-3'}/>
                        <p className={'text-sm text-gray-500 dark:text-gray-400'}>
                            No notifications yet
                        </p>
                    </div>
                )}

                {!error && notifications.length > 0 && (
                    <ScrollArea className="h-[400px]">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification._id}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    console.log("Clicked notification:", notification._id)
                                    handleNotificationSelect(notification)
                                }}
                                className={`flex cursor-pointer flex-col border-b gap-2 focus:secondbg relative group ${
                                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                }`}
                                onClick={() => handleNotificationSelect(notification)}
                            >
                                {/*Unread indicator*/}
                                {!notification.isRead && (
                                    <div className={'absolute left-2 top-6 h-2 w-2 rounded-full bg-blue-500'}/>
                                )}

                                <div className={'flex items-start justify-between w-full gap-3'}>
                                    <div className={'flex items-start gap-3 flex-1 min-w-0'}>
                                        {/*  Notification icon */}
                                        <div className={'text-lg mt-0.5 flex-shrink-0'}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className={'flex-1 min-w-0'}>
                                            <div className={'flex items-center gap-2 mb-1'}>
                                                <div className={`font-medium text-left truncate ${
                                                    !notification.isRead ? 'dark:text-black font-semibold' : 'dark:text-gray-700'
                                                }`}>
                                                    {notification.title}
                                                </div>
                                                <Badge
                                                    variant={'outline'}
                                                    className={`text-xs px-2 py-0.5 ${getNotificationTypeColor(notification.type)}`}
                                                >
                                                    {notification.type}
                                                </Badge>
                                            </div>

                                            <p className={'text-sm text-gray-600 darl:text-gray-400 line-clamp-2 mb-2'}>
                                                {notification.description}
                                            </p>

                                            <div className={'flex items-center justify-between text-xs text-gray-400'}>
                                                 <span>
                                                     {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                                 </span>
                                                <span>
                                                    {format(new Date(notification.createdAt), "MM dd, h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/*  Delete button */}
                                    <Button
                                        variant={'ghost'}
                                        size={'sm'}
                                        onClick={(e) => handleDeleteNotification(notification._id, e)}
                                        className={'opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto text-gray-400 hover:text-red-500'}
                                    >
                                        <Trash className={'h-4 w-4'}/>
                                    </Button>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                )}

                {!error && notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator/>
                        <div className={'p-3 text-center'}>
                            <Button
                                variant={'ghost'}
                                size={'sm'}
                                className={'text-sm text-[#00bf8f] hover:text-[#00bf8f]/80'}
                            >
                                View All Notifications
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}