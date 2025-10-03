import {JSX, useEffect, useState, useMemo} from "react"
import {Search, MapPin, Star, Clock, DollarSign, AlertCircle, Heart} from "lucide-react"
import {Button} from "@/dashboard/ProblemSolver/components/ui/button"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {Card} from "@/dashboard/Innovator/components/ui/card"
import {Badge} from "@/dashboard/Innovator/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/dashboard/Innovator/components/ui/tabs"
import {MainLayout} from "@/dashboard/ProblemSolver/components/layout/main-layout"
import {ChallengeDetailsDialog} from "../../components/modals/ChallengeDetailsDialogue"
import {useExploreChallenges} from "@/hooks/useProblemSolver";
import type {ChallengeSummary} from '../../components/modals/ChallengeDetailsDialogue'

const mapToChallengeSummary = (c: any): ChallengeSummary => ({
    id: c._id || c.id,
    title: c.title ?? "No title",
    description: c.description ?? "",
    industry: c.industry ?? "Unknown",
    totalBudget: c.totalBudget ?? 0,
    dueDate: c.dueDate,
    requiredSkills: c.requiredSkills ?? [],
    skillBudgets: c.skillBudgets ?? [],
    problemSolversNeeded: c.problemSolversNeeded ?? 1,
    location: c.location ?? { city: "Unknown", country: "" },
    createdAt: c.createdAt,
    paymentVerified: c.paymentVerified ?? false,
    submissions: c.submissions ?? [],
})

const LoadingStats = (): JSX.Element => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        ))}
    </div>
);

// Error block
const ErrorMessage = ({
                          message,
                          onRetry,
                      }: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <Button onClick={onRetry} variant="outline" className="dark:text-black">
                Try again
            </Button>
        </div>
    </div>
);

export default function ExploreChallenges() {
    const [searchQuery, setSearchQuery] = useState("")
    const [savedChallenges, setSavedChallenges] = useState<string[]>([])
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([])
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeSummary | null>(null);
    const [isOpenPitchPopupShow, setIsOpenPitchPopupShow] = useState(false)
    const [activeTab, setActiveTab] = useState("best-matches")

    // load saved challenges from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('savedChallenges')
        if (saved) {
            setSavedChallenges(JSON.parse(saved))
        }
    }, [])

    // persist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('savedChallenges', JSON.stringify(savedChallenges))
    }, [savedChallenges])

    // Hooks for each tab
    const {
        challenges: bestMatches,
        loading: loadingBest,
        error: errorBest,
        refetch: refetchBest,
    } = useExploreChallenges({sortBy: "relevance"})

    const {
        challenges: mostRecent,
        loading: loadingRecent,
        error: errorRecent,
        refetch: refetchRecent
    } = useExploreChallenges({sortBy: "newest"})

    // saved challenges are derived on the client-side
    const saved = useMemo(
        () => bestMatches.filter((c) => savedChallenges.includes(c._id)),
        [bestMatches, savedChallenges]
    )

    // Filtering per tab
    const filterChallenges = (list: any[]) =>
        list.filter(
            (challenge) =>
                challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                challenge.requiredSkills?.some((skill: string) =>
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                )
        )

    const filteredBestMatches = useMemo(
        () => filterChallenges(bestMatches),
        [bestMatches, searchQuery]
    )

    const filteredMostRecent = useMemo(
        () => filterChallenges(mostRecent),
        [mostRecent, searchQuery]
    )
    const filteredSaved = useMemo(
        () => filterChallenges(saved),
        [saved, searchQuery]
    )

    const toggleDescription = (id: string) => {
        setExpandedDescriptions((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        )
    }

    const toggleSaved = (id: string) => {
        setSavedChallenges((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        )
    }

    const ChallengeCard = ({challenge}: { challenge: any }) => {
        const id = challenge._id || challenge.id
        const isSaved = savedChallenges.includes(challenge.id)

        return (
            <Card
                key={challenge._id}
                className={'md:p-4 p-2 bg-gradient-to-br from-white/50 to-white/80 ' +
                    'dark:from-gray-800 dark:to-gray-900 !dark:text-white rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow'}
            >
                <div className={'flex justify-between items-start mb-2'}>
                    <div>
                        <div className={'flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400  mb-1'}>
                            <Clock className={'w-4 h-4'}/>
                            <span>
                                Posted {new Date(challenge.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className={'text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'}>
                            {challenge.title}
                        </h3>
                    </div>

                    {/*  Saved button  */}
                    <button
                        onClick={() => toggleSaved(challenge._id)}
                        className={'ml-2'}
                        aria-label={'Save challenge'}
                    >
                        <Heart
                            className={`h-6 w-6 transition-colors ${
                                isSaved
                                    ? 'fill-red-500 text-red-500'
                                    : "text-gray-400 hover:text-red-400"
                            }`}
                        />
                    </button>
                </div>

                <div className={'flex flex-col mb-2'}>
                    <span
                        className={'text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent'}>
                        ${challenge.totalBudget}
                    </span>
                </div>

                <Badge
                    variant={'secondary'}
                    className={'mb-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 text-emerald-700 dark:text-emerald-300 border shadow-inner'}
                >
                    {challenge.industry}
                </Badge>

                <div
                    className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: expandedDescriptions.includes(challenge._id)
                            ? challenge.description
                            : `${challenge.description.slice(0, 150)}...`,
                    }}
                />
                <button
                    onClick={() => toggleDescription(challenge._id)}
                    className="ml-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                    {expandedDescriptions.includes(challenge._id) ? "less" : "more"}
                </button>

                <div className={'flex items-center justify-between mb-4'}>
                    <div className={'flex items-center gap-4'}>
                        <div className={'flex items-center gap-2'}>
                            <DollarSign className={'h-5 w-5 text-emerald-600 dark:text-emerald-400'}/>
                            <span className={'text-xs dark:text-white'}>Payment verified</span>
                        </div>
                        <div className={'flex items-center gap-1'}>
                            {Array.from({length: 5}).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < Math.floor(challenge.company?.rating || 0)
                                            ? "text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    }`}
                                    fill={
                                        i < Math.floor(challenge.company?.rating || 0)
                                            ? "currentColor"
                                            : 'none'
                                    }
                                />
                            ))}
                            <span className={'text-xs ml-3 dark:text-white'}>
                                ${challenge.company?.spent || 0} spent
                            </span>
                        </div>
                    </div>
                    <div className={'flex items-center gap-2'}>
                        <MapPin className={'h-5 w-5 text-gray-400'}/>
                        <span className={'text-xs dark:text-white'}>
                            {challenge.location
                                ? `${challenge.location.city ?? ""}${
                                    challenge.location.city && challenge.location.country
                                        ? ", "
                                        : ""
                                }${challenge.location.country ?? ""}`
                                : "Unknown"}
                        </span>
                    </div>
                </div>

                <div className={'flex items-center justify-between'}>
                    <span className={'text-xs text-gray-500 dark:text-gray-400'}>
                        Solutions Submitted: {challenge.submissions?.length || 0}
                    </span>
                    <Button
                        className={'dashbutton text-white shadow-md hover:shadow-lg transition-all font-semibold rounded-lg'}
                        onClick={() => {
                            setSelectedChallenge(mapToChallengeSummary(challenge))
                            setIsOpenPitchPopupShow(true)
                        }}
                    >
                        Pitch Now
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <MainLayout>
            <div className={'min-h-screen dashbg'}>
                <main className={'mx-auto px-4 py-8'}>
                    {/*  Search bar  */}
                    <div className={'relative mb-6'}>
                        <Search className={'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'}/>
                        <Input
                            placeholder={`Search in ${
                                activeTab === "best-matches"
                                    ? "Best matches"
                                    : activeTab === "most-recent"
                                        ? "Most Recent"
                                        : "Saved Challenges"
                            }...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={'pl-10 secondbg border-gray-200 dark:border-gray-700'}
                        />
                    </div>

                    {/* Tabs */}
                    <Tabs
                        defaultValue={'best-matches'}
                        className={'mb-6'}
                        onValueChange={(val) => setActiveTab(val)}
                    >
                        <TabsList
                            className={'flex space-x-1 border-b dark:border-gray-700 justify-start dark:bg-black'}>
                            <TabsTrigger value={'best-matches'}>Best Matches</TabsTrigger>
                            <TabsTrigger value={'most-recent'}>Most Recent</TabsTrigger>
                            <TabsTrigger value={'saved'}>Saved Challenges</TabsTrigger>
                        </TabsList>

                        {/* Best Matches */}
                        <TabsContent value={'best-matches'} className={'space-y-6'}>
                            {loadingBest ? (
                                <LoadingStats/>
                            ) : errorBest ? (
                                <ErrorMessage message={errorBest} onRetry={refetchBest}/>
                            ) : filteredBestMatches.length === 0 ? (
                                <p className={'text-center text-gray-500 dark:text-gray-400'}>
                                    No challenges found
                                </p>
                            ) : (
                                filteredBestMatches.map((c) => (
                                    <ChallengeCard key={c._id} challenge={c}/>
                                ))
                            )}
                        </TabsContent>

                        {/* Most Recent */}
                        <TabsContent value={'most-recent'} className={'space-y-6'}>
                            {loadingRecent ? (
                                <LoadingStats/>
                            ) : errorRecent ? (
                                <ErrorMessage message={errorRecent} onRetry={refetchRecent}/>
                            ) : filteredMostRecent.length === 0 ? (
                                <p className={'text-center text-gray-500 dark:text-gray-400'}>
                                    No recent challenges found
                                </p>
                            ) : (
                                filteredMostRecent.map((c) => (
                                    <ChallengeCard key={c._id} challenge={c}/>
                                ))
                            )}

                        </TabsContent>

                        {/* Saved Challenges */}
                        <TabsContent value={'saved'} className={'space-y-6'}>
                            {filteredSaved.length === 0 ? (
                                <p className={'text-center text-gray-500 dark:text-gray-400'}>
                                    You haven't saved any challenges yet
                                </p>
                            ) : (
                                filteredSaved.map((c) => (
                                    <ChallengeCard key={c._id} challenge={c}/>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/*  Challenge details Modal  */}
            {isOpenPitchPopupShow && selectedChallenge && (
                <ChallengeDetailsDialog isOpen={isOpenPitchPopupShow} onClose={() => setIsOpenPitchPopupShow(false)}
                                         challenge={selectedChallenge} />
            )}
        </MainLayout>
    )
}