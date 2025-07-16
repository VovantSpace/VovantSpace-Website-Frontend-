import React, { useState } from "react";
import { X, Plus, DollarSign, UploadCloud } from "lucide-react";
import { Button } from "@innovator/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@innovator/components/ui/dialog";
import { Input } from "@innovator/components/ui/input";
import { Label } from "@innovator/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovator/components/ui/select";
import RichTextEditor from "./RichTextEditor";

interface Skill {
  name: string;
  budget: string;
}

export function CreateChallengeDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [totalBudget, setTotalBudget] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, { name: skillInput.trim(), budget: "" }]);
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

  const totalAllocated = skills.reduce(
    (sum, skill) => sum + Number(skill.budget || 0),
    0
  );
  const remainingBudget = Number(totalBudget) - totalAllocated;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="secondbg dashtext sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Challenge Title */}
          <div className="space-y-2">
            <Label>Challenge Title</Label>
            <Input
              placeholder="Enter challenge title"
              className="secondbg border dashborder"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor />
          </div>

          {/* Industry Select */}
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select>
              <SelectTrigger className="secondbg border dashborder">
                <SelectValue placeholder="Select an industry" />
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
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="dashbutton text-white border dashborder"
                onClick={handleAddSkill}
              >
                <Plus className="h-4 w-4" />
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
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Solvers Needed */}
          <div className="space-y-2">
            <Label>Problem Solvers Needed</Label>
            <Input type="number" min="1" defaultValue="1" className="secondbg border dashborder" />
          </div>

          {/* Budget USD */}
          <div className="space-y-2">
            <Label>Budget (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Enter budget"
                      className="secondbg pl-10 border dashborder"
                      value={skill.budget}
                      onChange={(e) =>
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
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer secondbg">
              <div className="flex flex-col items-center text-gray-400">
                <UploadCloud className="h-8 w-8 mb-2" />
                <p>Drag & drop files or click to upload</p>
                <p className="text-sm mt-1">Images, videos, PDFs up to 10MB each</p>
              </div>
              <Input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="dark:text-black">
            Cancel
          </Button>
          <Button className="dashbutton" disabled={Number(totalBudget) < 5}>

            Create Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChallengeDialog;
