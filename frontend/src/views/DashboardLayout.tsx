import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React,{ useEffect } from 'react';
import axios from 'axios'
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Expenses', icon: DollarSign, path: '/expenses' },
  { name: 'Earnings', icon: TrendingUp, path: '/earnings' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export default function DashboardLayout() {

    const location = useLocation();
    const nav=useNavigate()

    const checkAuth=async()=>{
        try{
            const {data}=await axios.get('http://localhost:4242/api/v1/users/layout',{withCredentials:true})
            console.log(data)
        }catch(err){
            nav('/login')
        }
    }

    useEffect(()=>{
        checkAuth()
    },[])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navbar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-600">PocketGuard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={'/layout'+item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
