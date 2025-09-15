import {BarChart, LineChart, PieChart} from "../../components/charts"
import {Card} from "../../components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select"
import {MainLayout} from "../../components/layout/main-layout"
import {cn} from "../../lib/utils"
import {useState} from "react";
import {useAnalytics} from "@/hooks/useChallenges";
import {Loader2} from "lucide-react";


export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d")
    const {analytics, loading, error} = useAnalytics(timeRange)

    if (loading) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <Loader2 className={'h-8 w-8 animate-spin'}/>
                    <span className={'ml-2'}>Loading analytics...</span>
                </div>
            </MainLayout>
        )
    }

    if (error) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <div className={'text-center'}>
                        <p className={'text-red-500 mb-4'}>{error}</p>
                        <button onClick={() => window.location.reload()} className={'text-blue-500 hover:underline'}>
                            Retry
                        </button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    // Transform data into the format expected by the charts
    const metrics = analytics?.metrics || [];
    const industryData = analytics?.industryData || [];
    const engagementData = analytics?.engagementData || 0;
    const rewardData = analytics?.rewardData || [];

    return (
        <MainLayout>
            <div className="container space-y-6  md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 ">
                <div className="flex items-center justify-between dashbg dark:text-white">
                    <h1 className="text-2xl font-bold dashtext">Analytics</h1>
                    <Select defaultValue="30">
                        <SelectTrigger className="w-[180px] secondbg">
                            <SelectValue placeholder="Select period"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric: any) => (
                        <Card key={metric.label} className="secondbg p-6">
                            <div className="text-sm text-gray-400">{metric.label}</div>
                            <div className="mt-2 text-2xl font-bold dashtext">{metric.value}</div>
                            <div
                                className={cn("mt-2 text-sm", metric.trend === "up" ? "text-[#00bf8f]" : "text-red-500")}>
                                {metric.change}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="secondbg p-6">
                        <h2 className="mb-4 text-lg font-semibold dashtext">Submissions by Industry</h2>
                        <div className="h-[300px]">
                            <BarChart
                                data={industryData}
                                index="name"
                                categories={["value"]}
                                colors={["#00bf8f", "#31473A", "#008f6a"]}
                            />
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <h2 className="mb-4 text-lg font-semibold dashtext">Engagement Trends</h2>
                        <div className="h-[300px]">
                            <LineChart data={engagementData} index="name" categories={["value"]} colors={["#00bf8f"]}/>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <h2 className="mb-4 text-lg font-semibold dashtext">Reward Distribution</h2>
                        <div className="h-[300px]">
                            <PieChart
                                data={rewardData}
                                index="name"
                                categories={["value"]}
                                colors={["#00bf8f", "#31473A", "#008f6a", "#007758", "#005f46"]}
                            />
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <h2 className="mb-4 text-lg font-semibold dashtext">Key Insights</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-[#00bf8f]">Top Performing Industry</h3>
                                <p className="text-sm text-gray-400">
                                    AI/ML leads with 45 submissions, showing a 25% increase from last month
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[#4287f5]">Engagement Growth</h3>
                                <p className="text-sm text-gray-400">
                                    Problem solver engagement has increased by 15% in the last 6 months
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[#f5d142]">Reward Trends</h3>
                                <p className="text-sm text-gray-400">Most challenges (45%) offer rewards between
                                    $1K-$5K</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}