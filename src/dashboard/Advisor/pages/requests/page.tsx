import {useState, useEffect} from "react";
import {useLocation} from 'react-router-dom';
import {Calendar, Clock, User, DollarSign, MessageSquare, AlertCircle, Loader2} from "lucide-react";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/dashboard/Innovator/components/ui/dialog";
import {MainLayout} from "../../../component/main-layout";
import {Input} from "@/dashboard/Innovator/components/ui/input";
import {Label} from "@/dashboard/Innovator/components/ui/label";
import {Badge} from "@/dashboard/Innovator/components/ui/badge";
import {useSessionRequests, SessionRequest, useMentorSessions} from "@/hooks/useMentor";
import {Textarea} from "@/dashboard/Innovator/components/ui/textarea";
import {toast} from 'react-hot-toast'


interface CounterProposalData {
    proposedDate: string;
    proposedTime: string;
    message?: string;
}

// Loading skeleton component
const RequestSkeleton = () => (
    <div className={'rounded-lg bg-card secondbg p-6 py-4 shadow-sm animatee-pulse'}>
        <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between'}>
            <div className={'flex items-center space-x-4 mb-4 sm:mb-0'}>
                <div className={'h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full'}></div>
                <div className={'h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded'}></div>
            </div>
            <div className={'flex space-x-2'}>
                <div className={'h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded'}></div>
                <div className={'h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded'}></div>
            </div>
        </div>
        <div className={'mt-3 space-y-3'}>
            <div className={'h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded'}></div>
            <div className={'h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded'}></div>
            <div className={'h-4 w-56 bg-gray-300 dark:bg-gray-700 rounded'}></div>
        </div>
    </div>
)

// Component for individual request card
const RequestCard = ({request}: { request: SessionRequest }) => {
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showCounterDialog, setShowCounterDialog] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [counterProposal, setCounterProposal] = useState<CounterProposalData>({
        proposedDate: "",
        proposedTime: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const {respondToRequest} = useSessionRequests()
    const {addSession} = useMentorSessions("scheduled", 1, 10)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            declined: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            counter_proposed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        }

        return (
            <Badge className={variants[status as keyof typeof variants] || variants.pending}>
                {status.replace('_', " ").toUpperCase()}
            </Badge>
        )
    }

    const handleAccept = async () => {
        try {
            setLoading(true);
            const response = await respondToRequest(request._id, 'accept');

            if (!response) {
                toast.error('No response from server. Please try again')
            }

            const updatedRequest = response.sessionRequest;
            const newSession = response.newSession;

            toast.success(
                newSession
                ? `Session accepted! Scheduled for ${new Date(newSession.scheduledDate).toLocaleString()}`
                    : "Session accepted successfully!"
            )
            setShowAcceptDialog(false);

            if (newSession) {
                addSession(newSession);
            }
        } catch (error: any) {
            console.error('Error accepting request', error);
            toast.error(error.message || "Failed to accept session request");
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        try {
            setLoading(true);
            await respondToRequest(request._id, 'decline', {
                declineReason: declineReason
            });
            setShowDeclineDialog(false);
            setDeclineReason("");
        } catch (error: any) {
            console.error('Error decline request:', error)
            // reminder: add toast notification here
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCounterPropose = async () => {
        try {
            setLoading(true);
            await respondToRequest(request._id, 'counter_propose', {
                counterProposal: {
                    proposedDate: counterProposal.proposedDate,
                    proposedEndTime: counterProposal.proposedTime,
                    message: counterProposal.message,
                }
            })
            setShowCounterDialog(false);
            setCounterProposal({proposedDate: "", proposedTime: "", message: ""})
        } catch (error: any) {
            console.error('Error sending counter proposal request:', error);
            // reminder: add toast notification here
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    return (
        <div
            id={`session-request-${request._id}`}
            className={'rounded-lg bg-card secondbg p-6 py-4 shadow-sm text-sm transition-all duration-300'}>
            <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between'}>
                <div className={'flex items-center space-x-4 mb-4 sm:mb-0'}>
                    {request.mentee.profilePicture ? (
                        <img src={request.mentee.profilePicture}
                             alt={`${request.mentee.firstName} ${request.mentee.lastName}`}
                             className={'h-12 w-12 rounded-full object-cover'}/>
                    ) : (
                        <div
                            className={'flex h-12 w-12 items-center justify-center rounded-full bg-green-800 text-white'}>
                            {getInitials(request.mentee.firstName, request.mentee.lastName)}
                        </div>
                    )}
                    <div>
                        <h2 className={'text-xl font-bold text-black dark:text-white'}>
                            {request.mentee.firstName} {request.mentee.lastName}
                        </h2>
                        <p className={'text-sm text-muted-foreground'}>{request.mentee.email}</p>
                    </div>
                </div>

                <div className={'flex items-center space-x-2'}>
                    {getStatusBadge(request.status)}
                    {request.status === 'pending' && (
                        <div className={'flex space-x-2'}>
                            {/*  Accept Dialog  */}
                            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                                <DialogTrigger asChild>
                                    <Button className={'dashbutton bg-emerald-600 text-white hover:bg-emerald-700'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Accept
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={'max-w-md p-6 rounded-lg bg-white dark:bg-gray-900'}>
                                    <DialogHeader>
                                        <DialogTitle className={'text-lg font-semibold text-black dark:text-white'}>
                                            Accept Session Request
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className={'space-y-4'}>
                                        <p className={'text-black dark:text-white'}>
                                            Are you sure you want to accept this session request
                                            from {request.mentee.firstName} {request.mentee.lastName}?
                                        </p>
                                        <Button
                                            onClick={handleAccept}
                                            disabled={loading}
                                            className={'dashbutton w-full bg-emerald-600 text-white hover:bg-emerald-700'}
                                        >
                                            {loading && <Loader2 className={'mr-2 h-4 w-4 animate-spin'}/>}
                                            Confirm Accept
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            onClick={() => setShowAcceptDialog(false)}
                                            disabled={loading}
                                            className={'w-full'}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/*  Counter Propose Button  */}
                            <Dialog open={showCounterDialog} onOpenChange={setShowCounterDialog}>
                                <DialogTrigger asChild>
                                    <Button variant={'outline'}
                                            className={'text-blue-600 border-blue-600 hover:bg-blue-50'}>
                                        <MessageSquare className={'mr-1 h-4 w-4'}/>
                                        Counter
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={'max-w-md p-6 rounded-lg bg-white dark:bg-gray-900'}>
                                    <DialogHeader>
                                        <DialogTitle className={'text-lg font-semibold text-black dark:text-white'}>
                                            Counter Propose
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className={'space-y-4'}>
                                        <div>
                                            <Label htmlFor={'proposedDate'}>Proposed Date</Label>
                                            <Input
                                                type="datetime-local"
                                                id={'proposedDate'}
                                                value={counterProposal.proposedDate}
                                                onChange={(e) => setCounterProposal(prev => ({
                                                    ...prev,
                                                    proposedDate: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={'proposedTime'}>End Time</Label>
                                            <Input
                                                id={'proposedTime'}
                                                type={'datetime-local'}
                                                value={counterProposal.proposedTime}
                                                onChange={(e) => setCounterProposal(prev => ({
                                                    ...prev,
                                                    proposedTime: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={'message'}>Message (Optional)</Label>
                                            <Textarea
                                                id={'message'}
                                                placeholder={'Add a message for the mentee..'}
                                                value={counterProposal.message}
                                                onChange={(e) => setCounterProposal(prev => ({
                                                    ...prev,
                                                    message: e.target.value
                                                }))}
                                            />
                                        </div>
                                        <div className={'space-y-2'}>
                                            <Button
                                                onClick={handleCounterPropose}
                                                disabled={loading || !counterProposal.proposedDate || !counterProposal.proposedTime}
                                                className={'dashbutton w-full bg-blue-600 text-white hover:bg-blue-700'}
                                            >
                                                {loading && <Loader2 className={'mr-2 h-4 w-4 animate-spin'}/>}
                                                Send Counter Proposal
                                            </Button>
                                            <Button
                                                variant={'outline'}
                                                onClick={() => setShowCounterDialog(false)}
                                                disabled={loading}
                                                className={'w-full'}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/*  Decline Dialog  */}
                            <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                                <DialogTrigger asChild>
                                    <Button variant={'destructive'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Decline
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className={'max-w-md p-6 rounded-lg bg-white dark:bg-gray-900'}>
                                    <DialogHeader>
                                        <DialogTitle className={'text-lg font-semibold text-black dark:text-white'}>
                                            Decline Session Request
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className={'space-y-4'}>
                                        <p className={'text-black dark:text-white'}>
                                            Please provide a reason for declining this session request:
                                        </p>
                                        <div>
                                            <label htmlFor="declineReason">Reason for declining</label>
                                            <Textarea
                                                id={'declineReason'}
                                                placeholder={'Reason for declining this session request'}
                                                value={declineReason}
                                                onChange={(e) => setDeclineReason(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className={'space-y-2'}>
                                            <Button
                                                onClick={handleDecline}
                                                disabled={loading || !declineReason.trim()}
                                                variant={'destructive'}
                                                className={'dashbutton w-full'}
                                            >
                                                {loading && <Loader2 className={'mr-2 h-4 w-4 animate-spin'}/>}
                                                Confirm Decline
                                            </Button>
                                            <Button
                                                variant={'outline'}
                                                onClick={() => {
                                                    setShowDeclineDialog(false)
                                                    setDeclineReason("")
                                                }}
                                                disabled={loading}
                                                className={'w-full'}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>

            {/*  Session Details  */}
            <div className={'mt-3 space-y-3'}>
                <div className={'flex items-center space-x-2'}>
                    <Calendar className={'h-5 w-5 text-muted-foreground'}/>
                    <span className={'text-black dark:text-white'}>
                        {formatDate(request.requestedDate)}
                    </span>
                </div>

                <div className={'flex items-center space-x-2'}>
                    <Clock className={'h-5 w-5 text-muted-foreground'}/>
                    <span className={'text-black dark:text-white'}>
                        Session Duration: {request.duration} minutes
                    </span>
                </div>

                <div className={'flex items-center space-x-2'}>
                    <DollarSign className={'h-5 w-5 text-muted-foreground'}/>
                    <span className={'text-black dark:text-white'}>
                        Amount: ${request.amount}
                    </span>
                </div>

                {request.status === 'declined' && request.declineReason && (
                    <div className={'flex items-start space-x-2'}>
                        <AlertCircle className={'h-5 w-5 text-red-500 mt-0.5'}/>
                        <div>
                            <span className={'text-red-400 dark:text-red-400 font-medium'}>
                                Decline Reason:
                            </span>
                            <p className={'text-black dark:text-white'}>{request.declineReason}</p>
                        </div>
                    </div>
                )}

                {request.status === 'counter_proposed' && request.counterProposal && (
                    <div className={'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md'}>
                        <h4 className={'font-medium text-blue-800 dark:text-blue-300 mb-2'}>Counter Proposal</h4>
                        <div className={'space-y-1 text-sm'}>
                            <p className={'text-black dark:text-white'}>
                                <strong>Proposed Date:</strong> {formatDate(request.counterProposal.proposedDate)}
                            </p>
                            <p className={'text-black dark:text-white'}>
                                <strong>End Time:</strong> {request.counterProposal.proposedEndTime}
                            </p>
                            {request.counterProposal.message && (
                                <p className={'text-black dark:text-white'}>
                                    <strong>Message:</strong> {request.counterProposal.message}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function RequestsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const requestIdFromState = location.state?.requestId;
    const [statusFilter, setStatusFilter] = useState<string>('');
    const limit = 10;

    const {requests, pagination, loading, error, refetch} = useSessionRequests(
        statusFilter || undefined,
        currentPage,
        limit
    )

    useEffect(() => {
        if (!requestIdFromState || !requests.length) return;

        // Find the specific card element for that request
        const el = document.getElementById(`session-request-${requestIdFromState}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: "center" });
            el.classList.add("ring-2", "ring-emerald-500", "animate-pulse-once")

            setTimeout(() => el.classList.remove("ring-2", "ring-emerald-500", "animate-pulse-once"), 2500);
        }
    }, [requestIdFromState, requests]);


    if (error) {
        return (
            <MainLayout>
                <div className={'p-4'}>
                    <div className={'rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center'}>
                        <AlertCircle className={'h-12 w-12 text-red-500 mx-auto mb-4'}/>
                        <h2 className={'text-xl font-semibold text-red-700 dark:text-red-300 mb-2'}>
                            Error Loading Requests
                        </h2>
                        <p className={'text-red-600 dark:text-red-400 mb-4'}>{error}</p>
                        <Button onClick={refetch} className={'bg-red-600 text-white hover:bg-red-700'}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="p-4">
                <div className={'mb-6'}>
                    <h1 className={'text-2xl font-bold text-black dark:text-white mb-4'}>Session Requests</h1>

                    {/*  Filter controls  */}
                    <div className={'flex flex-wrap gap-4 mb-4'}>
                        <div>
                            <Label htmlFor={'statusFilter'} className={'dark:text-white'}>Filter by Status:</Label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setCurrentPage(1) // Resets to the first page when filtering
                                }}
                                className={'ml-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white'}
                            >
                                <option value="">All Requests</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                                <option value="counter_proposed">Counter Proposed</option>
                            </select>
                        </div>
                        <Button onClick={refetch} variant={'outline'} disabled={loading}>
                            {loading && <Loader2 className={'mr-2 h-4 w-4 animate-spin'}/>}
                            Refresh
                        </Button>
                    </div>
                </div>

                {/*  Loading states  */}
                {loading && requests.length === 0 ? (
                    <div className={'space-y-4'}>
                        {[...Array(3)].map((_, index) => (
                            <RequestSkeleton key={index}/>
                        ))}
                    </div>
                ) : (
                    <>
                        {/*  Request list  */}
                        {requests.length === 0 ? (
                            <div className={'text-center py-12'}>
                                <User className={'h-12 w-12 text-gray-400 mx-auto mb-4'}/>
                                <h3 className={'text-lg font-medium text-black dark:text-white mb-2'}>
                                    No session requests found
                                </h3>
                                <p className={'text-gray-500 dark:text-gray-400'}>
                                    {statusFilter
                                        ? `No ${statusFilter} requests at the moment,`
                                        : "You don't have any session requests yet"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className={'space-y-4'}>
                                {requests.map((request) => (
                                    <RequestCard key={request._id} request={request}/>
                                ))}
                            </div>
                        )}

                        {/*  Pagination  */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className={'flex justify-center items-center space-x-4 mt-6'}>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1 || loading}
                                    variant={'outline'}
                                >
                                    Previous
                                </Button>
                                <span className={'text-black dark:text-white'}>
                                    Page {currentPage} of {pagination.totalPages}
                                </span>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={currentPage === pagination.totalPages || loading}
                                    variant={'outline'}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}