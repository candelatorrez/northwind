export type ClientSegment =  'enterprise' | 'startup' | 'standard' | 'zombie';
export type ClientStatus = 'active' | 'at_risk' | 'delinquent' | 'suspended';
export type RiskLevel = 'low' | 'medium' | 'high';


export interface Client {
    id: string;
    name: string;
    email: string;
    segment: ClientSegment;
    status: ClientStatus;
    monthlyBilling: number;
    createdAt?: string;
}


export interface ClientFilters {
    search?: string;
    segment?: ClientSegment | 'all';
    status?: ClientStatus | 'all';
    riskLevel?: RiskLevel | 'all';
}