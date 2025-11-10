export interface NormalizeSkillBudget {
    name: string;
    budget: number;
}

/**
 * Normalizes skill budget data coming from backend or editor
 * Ensures consistent shape for UI display and submission
 */

export function normalizeSkillBudgets(rawSkills: any[]): NormalizeSkillBudget[] {
    if (!Array.isArray(rawSkills)) return []

    return rawSkills.map((s: any) => {
        if (typeof s === 'string') {
            return {name: s, budget: 0}
        }

        return {
            name: s.name || s.skill || "Unnamed Skill",
            budget: Number(s.budget) || 0,
        }
    })
}