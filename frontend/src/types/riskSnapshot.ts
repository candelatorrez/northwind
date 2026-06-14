import type { RiskLevel } from "./clients";

export interface RiskSnapshot {
    id: string;
    clientId: string;
    score: number;
    level: RiskLevel;
    reason: string;
    createdAt?: string;
}