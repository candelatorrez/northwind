import ErrorState from "../components/ErrorState";
import KPICard from "../components/KPICard";
import LoadingState from "../components/LoadingState";
import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
    const {
        metrics,
        loading,
        error
    } = useDashboard();


    if (loading) {
        return (
            <LoadingState />
        )
    }

    if (error) {
        return (
            <ErrorState message={error} />
        )
    }

    if (!metrics) {
        return (
            <ErrorState message="No metrics found" />
        )
    }
    console.log(metrics)
    return (
        <div>
            <h1>
                Northwind
            </h1>

            <div>
                <KPICard
                    title="Monthly portfolio"
                    value={`$${metrics.monthlyPortfolio.toLocaleString()}`}
                />
                <KPICard
                    title="Deliquency Rate"
                    value={`${metrics.delinquencyRate.toFixed(1)}`}
                />
                <KPICard
                    title="High Risk Clients"
                    value={metrics.highRiskClients}
                />
            </div>
        </div>
    )
}