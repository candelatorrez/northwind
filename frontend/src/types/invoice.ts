export type InvoiceStatus = 'pending' | 'paid' | 'overdue';


export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  createdAt?: string;
  paidAt?: string;
}