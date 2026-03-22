import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Plus, Compass, FolderClosed, Gamepad2, Monitor, Search, Bell, Cpu, Menu } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navLinks = [
    { name: 'Feed', icon: Home, path: '/' },
    { name: 'Create Build', icon: Plus, path: '/build' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'My Builds', icon: FolderClosed, path: '/my-builds' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 sm:px-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 w-52 sm:w-64 cursor-pointer">
            <div className="bg-[#6532C2] p-1.5 rounded-xl shadow-[0_4px_10px_rgba(101,50,194,0.3)] ring-2 ring-purple-100">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 hidden sm:block">BuildMyPC</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4 hidden sm:block">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#6532C2]" />
            <input 
              type="text" 
              placeholder="Pesquisar Setups..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent focus:bg-white focus:border-[#6532C2]/40 focus:ring-4 focus:ring-[#6532C2]/10 rounded-xl text-sm transition-all text-slate-700 placeholder:text-slate-400 font-medium outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2 cursor-pointer group px-1 flex-shrink-0">
            <img src="https://ui-avatars.com/api/?name=User&background=6532C2&color=fff&bold=true" alt="User" className="w-9 h-9 rounded-full ring-2 ring-transparent group-hover:ring-purple-200 transition-all shadow-sm" />
            <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex pt-[72px] flex-1 h-[calc(100vh)] overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed md:relative z-40 w-64 bg-[#F8FAFC] md:bg-transparent h-full overflow-y-auto border-r border-slate-200 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 bg-white shadow-2xl' : '-translate-x-full'}`}>
          <div className="px-4 py-6">
            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-purple-100/60 text-[#6532C2] shadow-sm' 
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#6532C2]' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10">
              <h4 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Filters</h4>
              <nav className="space-y-1.5">
                <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-all hover:shadow-sm">
                  <Gamepad2 className="w-[22px] h-[22px] text-slate-400" />
                  Gaming
                </button>
                <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition-all hover:shadow-sm">
                  <Monitor className="w-[22px] h-[22px] text-slate-400" />
                  Workstation
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
