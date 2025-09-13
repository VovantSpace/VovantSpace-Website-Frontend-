import {SetStateAction, useState} from "react";
import {Eye, FileText, Users, Loader2, Search, MoreHorizontal, Play, Pause, TrendingUp, Copy,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {MainLayout} from "../../components/layout/main-layout";
import {Badge} from '../../components/ui/badge'
import {Link} from 'react-router-dom'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/select'
import {useChallenges} from "@/hooks/useChallenges";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {Card, CardContent, CardHeader} from "@mui/material";
import {CardTitle} from "@/components/ui/card";

export default function ChallengesPage() {
    const {challenges, loading, error, duplicateChallenge, promoteChallenge, pauseChallenge} = useChallenges();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest');

    const filteredChallenges = challenges.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || challenge.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    })

    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        switch (sortBy) {
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'mostViews':
                return b.views - a.views;
            case 'mostSubmissions':
                return b.submissions.length - a.submissions.length;
            case 'newest':
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    })

    const handleDuplicate = async (challengeId: string) => {
        try {
            await duplicateChallenge(challengeId);
            // Success handled by the hook
        } catch (error: any) {
            alert(`Error duplicating challenge: ${error.message}`);
        }
    }

    const handlePromote = async (challengeId: string, type: string) => {
        try {
            await promoteChallenge(challengeId, type);
            // success handled by the hook
        } catch (error: any) {
            alert(`Error promoting challenge: ${error.message}`);
        }
    }

    const handlePause = async (challengeId: string) => {
        try {
            await pauseChallenge(challengeId);
            // success handled by the hook
        } catch (error: any) {
            alert(`Error pausing challenge: ${error.message}`);
        }
    }

    if (loading) {
        return (
            <div className={'flex items-center justify-center h-64'}>
                <Loader2 className="animate-spin h-8 w-8"/>
                <span className={'ml-2'}>Loading challenges</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className={'flex items-center justify-center h-64'}>
                <div className={'text-center'}>
                    <p className={'text-red-500 mb-4'}>{error}</p>
                    <Button onClick={() => window.location.reload()}>Try again</Button>
                </div>
            </div>
        )
    }

    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
                        <p className="text-muted-foreground">
                            Manage and track all your challenges in one place.
                        </p>
                    </div>
                    <Link to="/dashboard/challenges/create">
                        <Button>Create New Challenge</Button>
                    </Link>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <input
                                        placeholder="Search challenges..."
                                        value={searchTerm}
                                        onChange={(e: {
                                            target: { value: SetStateAction<string>; };
                                        }) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="mostViews">Most Views</SelectItem>
                                    <SelectItem value="mostSubmissions">Most Submissions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Challenges List */}
                <div className="grid gap-4">
                    {sortedChallenges.length > 0 ? (
                        sortedChallenges.map((challenge) => (
                            <Card key={challenge._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/dashboard/challenges/${challenge._id}`}
                                                    className="text-lg font-semibold hover:text-blue-600 transition-colors"
                                                >
                                                    {challenge.title}
                                                </Link>
                                                <div className="flex gap-2">
                                                    <Badge variant={
                                                        challenge.status === 'Active' ? 'default' :
                                                            challenge.status === 'Completed' ? 'secondary' :
                                                                challenge.status === 'Paused' ? 'outline' : 'destructive'
                                                    }>
                                                        {challenge.status}
                                                    </Badge>
                                                    {challenge.isPaused && (
                                                        <Badge variant="outline">Paused</Badge>
                                                    )}
                                                    {challenge.isPromoted && (
                                                        <Badge variant="default" className="bg-orange-500">
                                                            {challenge.promotionType}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {challenge.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4"/>
                                                    <span>{challenge.views} views</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4"/>
                                                    <span>{challenge.submissions.length} submissions</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4"/>
                                                    <span>{challenge.approvedSubmissions.length} approved</span>
                                                </div>
                                                <div className="text-green-600 font-medium">
                                                    ${challenge.totalBudget}
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                Created {new Date(challenge.createdAt).toLocaleDateString()}
                                                {challenge.dueDate && (
                                                    <span className="ml-3">
                          Due {new Date(challenge.dueDate).toLocaleDateString()}
                        </span>
                                                )}
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/dashboard/challenges/${challenge._id}`}>
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/dashboard/challenges/${challenge._id}/edit`}>
                                                        Edit Challenge
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem onClick={() => handlePause(challenge._id)}>
                                                    {challenge.isPaused ? (
                                                        <>
                                                            <Play className="mr-2 h-4 w-4"/>
                                                            Resume
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Pause className="mr-2 h-4 w-4"/>
                                                            Pause
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(challenge._id)}>
                                                    <Copy className="mr-2 h-4 w-4"/>
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    onClick={() => handlePromote(challenge._id, 'featured')}>
                                                    <TrendingUp className="mr-2 h-4 w-4"/>
                                                    Promote as Featured
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handlePromote(challenge._id, 'urgent')}>
                                                    <TrendingUp className="mr-2 h-4 w-4"/>
                                                    Mark as Urgent
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground mb-4">
                                    {challenges.length === 0
                                        ? "You haven't created any challenges yet."
                                        : "No challenges match your current filters."
                                    }
                                </p>
                                {challenges.length === 0 && (
                                    <Link to="/dashboard/challenges/create">
                                        <Button>Create Your First Challenge</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

        </MainLayout>
    );
}
