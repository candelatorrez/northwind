export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    paidAt: string;
}