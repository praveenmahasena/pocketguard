import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

// Register Chart.js components
Chart.register(...registerables);

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function Dashboard ()  {
  const [balance, setBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [expenseTrends, setExpenseTrends] = useState<{month: string, total: number}[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{category: string, total: number}[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:4242/api/v1/users/dashboard',{withCredentials:true});
        setBalance(data.balance);
        setMonthlyExpenses(data.monthlyExpenses);
        setMonthlyIncome(data.monthlyIncome);
        setExpenseTrends(data.expenseTrends);
        setCategoryBreakdown(data.categoryBreakdown);
        setRecentTransactions(data.recentTransactions);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchData();
    }, []);

  // Chart data configurations
  const trendsChartData = {
    labels: expenseTrends.map(item => item.month),
    datasets: [{
      label: 'Monthly Expenses',
      data: expenseTrends.map(item => item.total),
      backgroundColor: '#22c55e',
    }]
  };

  const categoriesChartData = {
    labels: categoryBreakdown.map(item => item.category),
    datasets: [{
      data: categoryBreakdown.map(item => item.total),
      backgroundColor: [
        '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
        '#a855f7', '#10b981', '#f97316'
      ],
    }]
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Summary Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Current Balance</h3>
          <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Monthly Income</h3>
          <p className="text-2xl font-bold text-green-500">${monthlyIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-500">${monthlyExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Expense Trends</h3>
          <div className={isMobile ? 'h-64' : 'h-80'}>
            <Bar
              data={trendsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: isMobile ? 'bottom' : 'top',
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Spending by Category</h3>
          <div className={isMobile ? 'h-64' : 'h-80'}>
            <Pie
              data={categoriesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: isMobile ? 'bottom' : 'right',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b">
                  <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="p-2">{txn.description}</td>
                  <td className={`p-2 ${
                    txn.amount >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ${Math.abs(txn.amount).toFixed(2)}
                  </td>
                  <td className="p-2">{txn.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
