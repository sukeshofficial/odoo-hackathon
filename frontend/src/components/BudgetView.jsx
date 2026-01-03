import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../App.css';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BudgetView = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBudgetData();
    }, [tripId]);

    const fetchBudgetData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}/budget`);
            if (response.ok) {
                const data = await response.json();
                setBudgetData(data);
            } else {
                console.error('Failed to fetch budget');
            }
        } catch (error) {
            console.error('Error fetching budget:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page"><p>Loading budget...</p></div>;
    if (!budgetData) return <div className="page"><p>Budget data not found</p></div>;

    // Prepare pie chart data (category breakdown)
    const pieData = {
        labels: ['Transport', 'Stay', 'Activities', 'Meals', 'Other'],
        datasets: [{
            data: [
                budgetData.breakdown.transport,
                budgetData.breakdown.stay,
                budgetData.breakdown.activities,
                budgetData.breakdown.meals,
                budgetData.breakdown.other
            ],
            backgroundColor: [
                '#3b82f6', // blue
                '#8b5cf6', // purple
                '#f59e0b', // amber
                '#10b981', // green
                '#6b7280'  // gray
            ]
        }]
    };

    // Prepare bar chart data (stop budgets)
    const barData = {
        labels: budgetData.stopBudgets.map(s => s.cityName),
        datasets: [
            {
                label: 'Allocated Budget',
                data: budgetData.stopBudgets.map(s => s.allocatedBudget),
                backgroundColor: '#3b82f6'
            },
            {
                label: 'Actual Cost',
                data: budgetData.stopBudgets.map(s => s.actualCost),
                backgroundColor: '#f59e0b'
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    return (
        <div className="page budget-view-page">
            <div className="budget-header">
                <h2>Budget Breakdown: {budgetData.tripTitle}</h2>
                <button className="btn btn-secondary" onClick={() => navigate(`/trips/${tripId}`)}>
                    Back to Itinerary
                </button>
            </div>

            {/* Alerts */}
            {budgetData.alerts.length > 0 && (
                <div className="budget-alerts">
                    {budgetData.alerts.map((alert, index) => (
                        <div key={index} className={`alert alert-${alert.type}`}>
                            ⚠️ {alert.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Cards */}
            <div className="budget-summary-cards">
                <div className="summary-card">
                    <h4>Total Budget</h4>
                    <p className="amount">{budgetData.currency} {budgetData.summary.totalBudgetAllocated.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h4>Total Cost</h4>
                    <p className="amount">{budgetData.currency} {budgetData.summary.totalCost.toFixed(2)}</p>
                </div>
                <div className={`summary-card ${budgetData.summary.isOverBudget ? 'over-budget' : ''}`}>
                    <h4>Variance</h4>
                    <p className="amount">
                        {budgetData.summary.variance >= 0 ? '+' : ''}
                        {budgetData.currency} {budgetData.summary.variance.toFixed(2)}
                    </p>
                </div>
                <div className="summary-card">
                    <h4>Daily Average</h4>
                    <p className="amount">{budgetData.currency} {budgetData.summary.dailyAverage.toFixed(2)}/day</p>
                    <p className="small">Budget: {budgetData.summary.dailyBudget.toFixed(2)}/day</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="budget-charts">
                <div className="chart-container">
                    <h3>Spending by Category</h3>
                    <div className="chart-wrapper">
                        <Pie data={pieData} />
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Budget vs Actual by Stop</h3>
                    <div className="chart-wrapper">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown Table */}
            <div className="budget-table-section">
                <h3>Detailed Breakdown by Stop</h3>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Stop</th>
                            <th>Allocated Budget</th>
                            <th>Actual Cost</th>
                            <th>Variance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.stopBudgets.map(stop => (
                            <tr key={stop.stopId}>
                                <td>{stop.cityName}</td>
                                <td>{budgetData.currency} {stop.allocatedBudget.toFixed(2)}</td>
                                <td>{budgetData.currency} {stop.actualCost.toFixed(2)}</td>
                                <td className={stop.variance < 0 ? 'negative' : 'positive'}>
                                    {stop.variance >= 0 ? '+' : ''}{budgetData.currency} {stop.variance.toFixed(2)}
                                </td>
                                <td>
                                    {stop.isOverBudget ? (
                                        <span className="badge badge-danger">Over Budget</span>
                                    ) : (
                                        <span className="badge badge-success">Within Budget</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetView;
