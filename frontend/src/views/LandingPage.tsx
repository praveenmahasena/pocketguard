// src/pages/LandingPage.tsx
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function LandingPage() {
  // Demo Data
  const expensesData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping'],
    datasets: [{
      data: [450, 210, 180, 320, 275],
      backgroundColor: [
        '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#16a34a'
      ],
      borderWidth: 0
    }]
  };

   const recentTransactions = [
     { id: 1, category: 'Food', amount: 45.00, date: '2023-06-15' },
     { id: 2, category: 'Transport', amount: 12.50, date: '2023-06-14' },
     { id: 3, category: 'Entertainment', amount: 28.00, date: '2023-06-13' },
     { id: 4, category: 'Bills', amount: 120.00, date: '2023-06-10' }
   ];

   const budgetStatus = {
     totalBudget: 2000,
     spent: 1435,
     remaining: 565,
     categories: [
       { name: 'Food', budget: 500, spent: 450 },
       { name: 'Transport', budget: 300, spent: 210 },
       { name: 'Entertainment', budget: 200, spent: 180 }
     ]
   };

    // thank god there were some dumb data in google I really cannot do the svg stuff it's hard
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
          </svg>
          CoinKeeper
        </div>
        <div className="space-x-6">
          <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">Login</Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
          Smart Spending Starts Here
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Visualize your finances with powerful tools that make budgeting effortless.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
          >
            Try Demo Dashboard
          </Link>
          <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors text-lg font-medium">
            How It Works
          </button>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="container mx-auto px-6 pb-20 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Mock Browser Tabs */}
          <div className="bg-gray-100 h-12 flex items-center px-4 space-x-2 border-b">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="bg-white rounded-lg px-3 py-1 ml-4 text-sm shadow-inner flex-1 max-w-md">
              <span className="text-gray-400">https://</span>app.coinkeeper/dashboard
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {/* Expense Chart */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Spending Breakdown</h3>
              <div className="h-64">
                <Doughnut
                  data={expensesData}
                  options={{
                    plugins: { legend: { position: 'bottom' } },
                    cutout: '65%'
                  }}
                />
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <p className="font-bold text-green-600">${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
                <button className="w-full py-2 text-green-600 font-medium hover:bg-green-50 rounded-lg transition-colors">
                  View All →
                </button>
              </div>
            </div>

            {/* Budget Status */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Budget Status</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Remaining</span>
                  <span className="font-medium">${budgetStatus.remaining}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(budgetStatus.spent / budgetStatus.totalBudget) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>${budgetStatus.spent} spent</span>
                  <span>${budgetStatus.totalBudget} total</span>
                </div>
              </div>

              <div className="space-y-3">
                {budgetStatus.categories.map(category => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span>${category.spent} / ${category.budget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-400 h-1.5 rounded-full"
                        style={{ width: `${(category.spent / category.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Powerful Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                ),
                title: 'Expense Tracking',
                desc: 'Log transactions in seconds with our mobile-friendly interface'
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                ),
                title: 'Visual Reports',
                desc: 'Beautiful charts help you understand spending patterns'
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                title: 'Real-time Alerts',
                desc: 'Get notifications when approaching budget limits'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 hover:bg-green-50 rounded-xl transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who are saving more and spending smarter.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors text-lg font-bold"
          >
            Get Started - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-green-100 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">CoinKeeper</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-sm">
            © {new Date().getFullYear()} CoinKeeper. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
