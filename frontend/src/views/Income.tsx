import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IncomeEntry {
  income_id: number;
  user_id: number;
  amount: string;
  source: string;
  category: string;
  date: string;
  notes?: string;
}

// I should have done a
// CREATE TYPE catagory AS ENUM ('Salary', 'Freelance', 'Investment', 'Gift') IN PGSQL???
const categories = ['Salary', 'Freelance', 'Investment', 'Gift'];

export default function Earnings() {
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    category: categories[0],
    notes: '',
  });
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const fetchIncome = async () => {
    try {
      const res = await axios.get('http://localhost:4242/api/v1/users/income/month', {
                withCredentials:true
      });
      setIncome(res.data);
    } catch (err) {
      setError('Failed to fetch income');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:4242/api/v1/users/income',
        { ...formData, date: today },
        {
                    withCredentials:true,
        }
      );
      setFormData({ amount: '', source: '', category: categories[0], notes: '' });
      setShowForm(false);
      fetchIncome();
    } catch (err) {
      setError('Failed to add income');
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const chartData = {
    labels: income.map((entry) => entry.source),
    datasets: [
      {
        label: 'Income',
        data: income.map((entry) => parseFloat(entry.amount.replace(/[^0-9.-]+/g, ''))),
        backgroundColor: '#22c55e',
      },
    ],
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen text-green-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Earnings - This Month</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Income
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}


      <div className="bg-white rounded shadow p-6">
        <Bar data={chartData} />
      </div>

      {/* List */}
      <div className="bg-white rounded shadow mb-6 p-4">
        <h2 className="text-lg font-semibold mb-2">Income List</h2>
        <ul>
          {income.map((entry) => (
            <li key={entry.income_id} className="border-b py-2">
              <span className="font-medium">{entry.source}</span> - $
              {parseFloat(entry.amount.replace(/[^0-9.-]+/g, '')).toFixed(2)} (
              {entry.category}) on {entry.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Chart */}

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add New Income</h3>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Add Income
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
