import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
// AAHH LOVE THIS LIBRARY FR
import { useMediaQuery } from 'react-responsive';

Chart.register(...registerables);

interface Expense {
  expense_id: number;
  amount: number;
  place: string;
  expense_type: string;
  date: string;
  time: string;
}

const expenseCategories = [
  'food',
  'transport',
  'housing',
  'utilities',
  'entertainment',
  'shopping',
  'health',
  'other'
];

export default function Expenses () {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    place: '',
    expense_type: 'food',
    date: new Date().toISOString().split('T')[0]
  });
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
    // this library helPPPED ME FR
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Fetch expenses data
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:4242/api/v1/users/expenses/current-month',{withCredentials:true});
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Prepare chart data
  const categoryTotals = expenses.reduce((acc, expense) => {
    const type = expense.expense_type.toLowerCase();
    acc[type] = (acc[type] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#8AC24A', '#FF6B6B'
      ],
    }]
  };

    // I came throu a article that was having this kinda design pattern is this effective? idk just trying out
    // I would now do this again
    // // nevermind I was dumb this is much clean code instead of having all the field values in different state names
    // // still gotta think of memory useage tho
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setNotification({
        show: true,
        message: 'Please enter a valid positive amount',
        isError: true
      });
      return;
    }

    try {
      const now = new Date();
      const time = now.toTimeString().split(' ')[0];

      await axios.post('http://localhost:4242/api/v1/users/expenses', {
        ...formData,
        time
      },{withCredentials:true});

      // Refresh expenses
      await fetchExpenses();

      setNotification({
        show: true,
        message: 'Expense added successfully!',
        isError: false
      });

      // Reset form
      setFormData({
        amount: '',
        place: '',
        expense_type: 'food',
        date: new Date().toISOString().split('T')[0]
      });

      setShowForm(false);
    } catch (err) {
      console.error('Error adding expense:', err);
      setNotification({
        show: true,
        message: 'Failed to add expense. Please try again.',
        isError: true
      });
    } finally {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading expenses...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add New Expense
        </button>
      </div>

      {/* Expense Categories Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
        <div className={isMobile ? 'h-64' : 'h-96'}>
          <Pie
            data={chartData}
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

      {/* Expenses List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses recorded this month</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.expense_id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {expense.place || 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">
                      {expense.expense_type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-red-500 font-medium">
                      -${Number(expense.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Expense</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="place" className="block text-gray-700 mb-2">
                  Place
                </label>
                <input
                  id="place"
                  name="place"
                  type="text"
                  required
                  value={formData.place}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Where was this expense made?"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="expense_type" className="block text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="expense_type"
                  name="expense_type"
                  value={formData.expense_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="date" className="block text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white animate-fade-in ${
          notification.isError ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};
