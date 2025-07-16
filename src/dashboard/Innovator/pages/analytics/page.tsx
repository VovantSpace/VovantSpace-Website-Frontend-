

import { BarChart, LineChart, PieChart } from "@innovator/components/charts"
import { Card } from "@innovator/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@innovator/components/ui/select"
import { MainLayout } from "@innovator/components/layout/main-layout"
import { cn } from "@innovator/lib/utils"

const metrics = [
  {
    label: "Total Submissions",
    value: "156",
    change: "+12% vs last month",
    trend: "up",
  },
  {
    label: "Average Engagement",
    value: "85%",
    change: "+5% vs last month",
    trend: "up",
  },
  {
    label: "Total Rewards",
    value: "$45,250",
    change: "+8% vs last month",
    trend: "up",
  },
  {
    label: "Active Days",
    value: "24",
    change: "+2 days vs last month",
    trend: "up",
  },
]

const industryData = [
  { name: "AI/ML", value: 45 },
  { name: "Healthcare", value: 32 },
  { name: "Clean Energy", value: 28 },
  { name: "Education", value: 22 },
  { name: "Smart Cities", value: 18 },
  { name: "Agriculture", value: 12 },
]

const engagementData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 72 },
  { name: "Mar", value: 68 },
  { name: "Apr", value: 75 },
  { name: "May", value: 82 },
  { name: "Jun", value: 85 },
]

const rewardData = [
  { name: "$0-1K", value: 25 },
  { name: "$1K-5K", value: 45 },
  { name: "$5K-10K", value: 20 },
  { name: "$10K-20K", value: 7 },
  { name: "$20K+", value: 3 },
]

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="container space-y-6  md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 ">
        <div className="flex items-center justify-between dashbg dark:text-white">
          <h1 className="text-2xl font-bold dashtext">Analytics</h1>
          <Select defaultValue="30" className="">
            <SelectTrigger className="w-[180px] secondbg">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="secondbg p-6">
              <div className="text-sm text-gray-400">{metric.label}</div>
              <div className="mt-2 text-2xl font-bold dashtext">{metric.value}</div>
              <div className={cn("mt-2 text-sm", metric.trend === "up" ? "text-[#00bf8f]" : "text-red-500")}>
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
              <LineChart data={engagementData} index="name" categories={["value"]} colors={["#00bf8f"]} />
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
                <p className="text-sm text-gray-400">Most challenges (45%) offer rewards between $1K-$5K</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

