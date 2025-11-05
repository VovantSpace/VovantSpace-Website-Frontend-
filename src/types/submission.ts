export interface Attachment {
    name: string;
    url: string;
    size?: string;
    type?: string;
}

export interface ProblemSolverProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    image?: string;
    country?: string;
    rate?: number;
    earned?: number;
    successRate?: string;
    skills: string[];
    profilePicture: string;
    experience: string;
    title?: string;
}

export interface Submission {
    _id: string;
    challengeId: string;
    problemSolver: ProblemSolverProfile;
    solutionSummary: string;
    skillsTag: string[];
    attachments: Attachment[];
    rate?: number;
    earned?: number;
    successRate?: string;
    title?: string;
    country?: string;
    image?: string;
    name?: string;
    feedback?: string;
    rating?: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}