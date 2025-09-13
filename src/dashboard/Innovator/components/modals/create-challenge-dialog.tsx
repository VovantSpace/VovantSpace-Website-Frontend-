import React, {useState} from "react";
import {X, Plus, DollarSign, UploadCloud} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import RichTextEditor from "./RichTextEditor";
import { challengeApi, CreateChallengeData} from "@/services/challengeService";
import {toast} from "react-hot-toast";

interface Skill {
    name: string;
    budget: string;
}

interface CreateChallengeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onChallengeCreated?: () => void;
}

export function CreateChallengeDialog({
                                          isOpen,
                                          onClose,
                                          onChallengeCreated,
                                      }: CreateChallengeDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        industry: "",
        problemSolversNeeded: 1,
    });
    const [skills, setSkills] = useState<Skill[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [totalBudget, setTotalBudget] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setSkills([...skills, {name: skillInput.trim(), budget: ""}]);
            setSkillInput("");
        }
    };

    const handleSkillBudgetChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index].budget = value;
        setSkills(newSkills);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Validation
            if (!formData.title || !formData.description || !formData.industry || !totalBudget) {
                toast.error("Please fill in all required fields");
                return;
            }

            if (Number(totalBudget) < 5) {
                toast.error("Budget must be at least $5");
                return;
            }

            // Prepare challenge data
            const challengeData: CreateChallengeData = {
                title: formData.title,
                description: formData.description,
                industry: formData.industry,
                requiredSkills: skills.map(skill => skill.name),
                skillBudgets: skills.filter(skill => skill.budget).map(skill => ({
                    skill: skill.name,
                    budget: Number(skill.budget)
                })),
                problemSolversNeeded: formData.problemSolversNeeded,
                totalBudget: Number(totalBudget),
            };

            const response = await challengeApi.createChallenge(challengeData);

            if (response.success) {
                toast.success("Challenge created successfully!");
                onChallengeCreated?.();
                handleClose();
            } else {
                toast.error(response.message || "Failed to create challenge");
            }
        } catch (error: any) {
            console.error("Create challenge error:", error);
            toast.error(error?.response?.data?.message || "Failed to create challenge");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            title: "",
            description: "",
            industry: "",
            problemSolversNeeded: 1,
        });
        setSkills([]);
        setSkillInput("");
        setFiles([]);
        setTotalBudget("");
        onClose();
    };

    const totalAllocated = skills.reduce(
        (sum, skill) => sum + Number(skill.budget || 0),
        0
    );
    const remainingBudget = Number(totalBudget) - totalAllocated;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="secondbg dashtext sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Challenge</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Challenge Title */}
                    <div className="space-y-2">
                        <Label>Challenge Title *</Label>
                        <Input
                            placeholder="Enter challenge title"
                            className="secondbg border dashborder"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value: any) => setFormData({...formData, description: value})}
                        />
                    </div>

                    {/* Industry Select */}
                    <div className="space-y-2">
                        <Label>Industry *</Label>
                        <Select
                            value={formData.industry}
                            onValueChange={(value) => setFormData({...formData, industry: value})}
                        >
                            <SelectTrigger className="secondbg border dashborder">
                                <SelectValue placeholder="Select an industry"/>
                            </SelectTrigger>
                            <SelectContent className="secondbg border dashborder dark:text-white">
                                {[
                                    "Agriculture",
                                    "Artificial Intelligence",
                                    "Blockchain",
                                    "Clean Energy",
                                    "Education",
                                    "Healthcare",
                                    "IoT",
                                    "Manufacturing",
                                    "Smart Cities",
                                    "Transportation",
                                ].map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-2">
                        <Label>Required Skills</Label>
                        <div className="flex gap-2">
                            <Input
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                                className="secondbg border dashborder"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent form submission if inside a form
                                        handleAddSkill();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="dashbutton text-white border dashborder"
                                onClick={handleAddSkill}
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"
                                >
                                    <span>{skill.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4"
                                        onClick={() =>
                                            setSkills(skills.filter((_, i) => i !== index))
                                        }
                                    >
                                        <X className="h-3 w-3"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Problem Solvers Needed */}
                    <div className="space-y-2">
                        <Label>Problem Solvers Needed *</Label>
                        <Input
                            type="number"
                            min="1"
                            value={formData.problemSolversNeeded}
                            onChange={(e) => setFormData({...formData, problemSolversNeeded: Number(e.target.value)})}
                            className="secondbg border dashborder"
                        />
                    </div>

                    {/* Budget USD */}
                    <div className="space-y-2">
                        <Label>Budget (USD) *</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            <Input
                                type="number"
                                placeholder="Enter total budget"
                                className="secondbg pl-10 border dashborder"
                                value={totalBudget}
                                min="5"
                                onChange={(e) => setTotalBudget(e.target.value)}
                            />
                        </div>
                        <div className="mt-2">
                            {totalBudget && Number(totalBudget) < 5 && (
                                <span className="text-sm font-medium text-red-500 ">
                  Enter a value equal to or greater than 5
                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Remaining to allocate: $
                            {isNaN(remainingBudget) ? 0 : remainingBudget.toFixed(2)}
                        </div>
                        {totalBudget &&
                            skills.map((skill, index) => (
                                <div key={index} className="space-y-2">
                                    <Label>{skill.name} Budget</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                                        <Input
                                            type="number"
                                            placeholder="Enter budget"
                                            className="secondbg pl-10 border dashborder"
                                            value={skill.budget}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleSkillBudgetChange(index, e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Additional Resources */}
                    <div className="space-y-2">
                        <Label>Additional Resources</Label>
                        <label
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer secondbg">
                            <div className="flex flex-col items-center text-gray-400">
                                <UploadCloud className="h-8 w-8 mb-2"/>
                                <p>Drag & drop files or click to upload</p>
                                <p className="text-sm mt-1">Images, videos, PDFs up to 10MB each</p>
                            </div>
                            <Input type="file" multiple className="hidden" onChange={handleFileChange}/>
                        </label>
                        {files.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {files.map((file, index) => (
                                    <div key={index}
                                         className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} className="dark:text-black">
                        Cancel
                    </Button>
                    <Button
                        className="dashbutton"
                        onClick={handleSubmit}
                        disabled={Number(totalBudget) < 5 || isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Challenge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateChallengeDialog;