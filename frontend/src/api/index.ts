import axios from "axios";
import type { DashboardClient, DashboardMetrics } from "../types/dashboard";
import type { Client, ClientStatus } from "../types/clients";
import type { Invoice } from "../types/invoice";
import type { RiskSnapshot } from "../types/riskSnapshot";
import type { ActionType, CollectionAction } from "../types/action";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Dashboard endpoints
export const dashboardApi = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        const response = await api.get('/dashboard/metrics');

        return response.data
    },

    getClients: async (): Promise<DashboardClient[]> => {
        const response = await api.get('/dashboard/clients');
        
        return response.data || [];
    }

};

// Client endpoints
export const clientApi = {
    getAll: async (): Promise<Client[]> => {
        const response = await api.get('/clients');
        return response.data || [];
    },
    
    getById: async (id: string): Promise<Client> => {
        const response = await api.get(`/clients/${id}`)
        return response.data
    },

    updateStatus: async (id: string, status: ClientStatus): Promise<Client> => {
        const response = await api.patch(`/clients/${id}/status`, {status})
        return response.data;
    }
};


// Invoice endpoints
export const invoiceApi = {
    getByClientId: async (clientId: string): Promise<Invoice[]> => {
        const response = await api.get(`/clients/${clientId}/invoices`);
        return response.data || [];
    },

    markAsPaid: async (invoiceId: string): Promise<Invoice> => {
        const response = await api.post(`/invoices/${invoiceId}/pay`, {});
        return response.data;
    },
};

// Risk endpoints
export const riskApi = {
    getByClientId: async (clientId: string): Promise<RiskSnapshot> => {
        const response = await api.get(`/clients/${clientId}/risk`);
        return response.data;
    },

    calculateSnapshot: async (clientId: string): Promise<RiskSnapshot> => {
        const response = await api.post(`/clients/${clientId}/risk-snapshots`, {});
        return response.data;
    }
 };

// Collection action endpoints
export const actionApi = {
    getByClientId: async (clientId: string): Promise<CollectionAction[]> => {
        const response = await api.get(`/clients/${clientId}/actions`);
        return response.data || [];
    },
    
    create: async (
        clientId: string,
        data: {
            type: ActionType;
            notes: string;
            performedBy: string;
        }
    ) : Promise<CollectionAction> => {
        const response = await api.post(`/clients/${clientId}/actions`, data);
        return response.data;
    }
};

//Health check
export const healthApi = {
    check: async(): Promise<boolean> => {
        try {
            const response = await api.get('/health');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
