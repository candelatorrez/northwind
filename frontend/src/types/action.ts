export type ActionType = 'call' | 'email' | 'note';

export interface CollectionAction {
    id: string;
    clientId: string;
    type: ActionType;
    notes: string;
    performedBy: string;
    createdAt: string;
}

