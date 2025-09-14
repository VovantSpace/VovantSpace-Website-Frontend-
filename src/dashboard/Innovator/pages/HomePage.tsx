import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/card';
import {Button} from '../components/ui/button';
import {Badge} from '../components/ui/badge';
import {useDashboardStats, useChallenges} from '@/hooks/useChallenges';
import {Loader2, Plus, TrendingUp, Users, Eye, DollarSign} from 'lucide-react';
import {Link} from 'react-router-dom';
import {MainLayout} from '../components/layout/main-layout';
import CreateChallengeDialog from "@/dashboard/Innovator/components/modals/create-challenge-dialog";

export default function HomePage() {
    const {stats, loading: statsLoading, error: statsError} = useDashboardStats();
    const {challenges, loading: challengesLoading, refetch} = useChallenges();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (statsLoading || challengesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin"/>
                <span className="ml-2">Loading dashboard...</span>
            </div>
        );
    }

    if (statsError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{statsError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    const recentChallenges = challenges.slice(0, 5);

    return (
        <MainLayout>
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here's what's happening with your challenges.
                        </p>
                    </div>

                    <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4"/>
                        Create Challenge
                    </Button>

                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalChallenges || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats?.activeChallenges || 0} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats?.approvedSubmissions || 0} approved
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all challenges
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats?.totalBudget || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Allocated across challenges
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Challenges */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Challenges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentChallenges.length > 0 ? (
                                    recentChallenges.map((challenge) => (
                                        <div key={challenge._id} className="flex items-center space-x-4">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {challenge.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {challenge.submissions.length} submissions
                                                </p>
                                            </div>
                                            <Badge variant={challenge.status === 'Active' ? 'default' : 'secondary'}>
                                                {challenge.status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No challenges yet. Create your first challenge!
                                    </p>
                                )}
                            </div>
                            {recentChallenges.length > 0 && (
                                <div className="mt-4">
                                    <Link to="/dashboard/my-challenges">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View All Challenges
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"/>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(activity.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No recent activity
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/*  create a Challenge dialog  */}
                <CreateChallengeDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onChallengeCreated={refetch}/>
            </div>
        </MainLayout>
    );
}