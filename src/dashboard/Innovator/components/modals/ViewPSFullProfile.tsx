import {
    Star,
    GraduationCap,
    Briefcase,
    Globe,
    Calendar,
    FileText,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/dashboard/Innovator/components/ui/dialog";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/dashboard/Innovator/components/ui/avatar";
import { Badge } from "@/dashboard/Innovator/components/ui/badge";
import { Skeleton } from "@/dashboard/Innovator/components/ui/skeleton"; // 🧠 ensure you have a skeleton component
import tick from "@/assets/tick.png";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

/**
 * Props for the profile dialog
 */
interface FullProfileDialogProps {
    profile?: any;
    isOpen: boolean;
    onClose: () => void;
    loading?: boolean;
}

export function FullProfileDialog({
                                      profile,
                                      isOpen,
                                      onClose,
                                      loading = false,
                                  }: FullProfileDialogProps) {
    // ✅ Ensure arrays to prevent crashes
    const education = Array.isArray(profile?.education) ? profile.education : [];
    const certifications = Array.isArray(profile?.certifications)
        ? profile.certifications
        : [];
    const portfolio = Array.isArray(profile?.portfolio)
        ? profile.portfolio
        : [];

    // ✅ Handle initials for fallback avatar
    const initials = `${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}`.toUpperCase();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="secondbg dashtext max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a3142] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-xl">
                        Problem Solver Profile
                    </DialogTitle>
                </DialogHeader>

                {/* ================= Loading Skeleton ================= */}
                {loading ? (
                    <div className="space-y-8 animate-pulse">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-20 h-20 rounded-full"/>
                            <div className="space-y-3 w-full">
                                <Skeleton className="h-5 w-1/3"/>
                                <Skeleton className="h-4 w-1/2"/>
                                <Skeleton className="h-4 w-1/4"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-28 w-full rounded-xl"/>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ================= Profile Header ================= */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <Avatar className="h-20 w-20 border-4 border-emerald-500/30">
                                <AvatarImage
                                    src={profile?.profilePicture || profile?.image}
                                    alt={profile?.firstName || "User"}
                                />
                                <AvatarFallback className="bg-emerald-500/20 text-lg font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-grow space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl md:text-2xl font-bold">
                                        {profile?.name ||
                                            `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
                                            "Unnamed Problem Solver"}
                                    </h1>
                                    <img src={tick} className="w-5" alt="Verified"/>
                                </div>

                                <div
                                    className="flex flex-wrap gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                                    {profile?.country && (
                                        <div className="flex items-center gap-1">
                                            <Globe className="h-4 w-4"/>
                                            <span>{profile.country}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400"/>
                                        <span>4.9 (127 reviews)</span>
                                    </div>
                                </div>

                                {profile?.bio && (
                                    <p className="text-sm md:text-base text-gray-400 mt-2 leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================= Education ================= */}
                        {education.length > 0 && (
                            <section className="pt-4 space-y-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-emerald-400"/>
                                    Education
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {education.map((edu: {
                                        institution: any;
                                        degree: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
                                        field: any;
                                        startDate: any;
                                        endDate: any;
                                    }, index: Key | null | undefined) => (
                                        <div
                                            key={index}
                                            className="secondbg p-4 rounded-xl border border-[#2a3142]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-base font-semibold">
                                                    {edu.institution || "Unnamed Institution"}
                                                </h3>
                                                {edu.degree && (
                                                    <div className="text-xs text-emerald-400">
                                                        {edu.degree}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {edu.field || ""}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                          {edu.startDate || "—"} - {edu.endDate || "—"}
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ================= Certifications ================= */}
                        {certifications.length > 0 && (
                            <section className="pt-4 space-y-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-emerald-400" />
                                    Certifications
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {certifications.map((cert: { name: any; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; issuer: any; }, index: Key | null | undefined) => (
                                        <div
                                            key={index}
                                            className="secondbg p-4 rounded-xl border border-[#2a3142]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-base font-semibold">
                                                    {cert.name || "Untitled Certificate"}
                                                </h3>
                                                {cert.date && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-emerald-400 text-xs text-center"
                                                    >
                                                        {cert.date}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                {cert.issuer || "Unknown Issuer"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ================= Portfolio ================= */}
                        {portfolio.length > 0 && (
                            <section className="pt-4 space-y-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-emerald-400" />
                                    Portfolio
                                </h2>

                                <div className="space-y-4">
                                    {portfolio.map((project: { title: any; url: string | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                                        <div
                                            key={index}
                                            className="secondbg p-4 rounded-xl border border-[#2a3142]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-base font-semibold">
                                                    {project.title || "Untitled Project"}
                                                </h3>
                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-emerald-400 text-sm hover:underline flex items-center gap-1"
                                                    >
                                                        <Globe className="h-4 w-4" />
                                                        Visit Project
                                                    </a>
                                                )}
                                            </div>
                                            {project.description && (
                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ================= Fallback ================= */}
                        {education.length === 0 &&
                            certifications.length === 0 &&
                            portfolio.length === 0 && (
                                <div className="text-center text-gray-400 py-6">
                                    No public details available yet.
                                </div>
                            )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
