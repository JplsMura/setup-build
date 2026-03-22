import React from 'react';
import { Cpu } from 'lucide-react';

export default function Login() {
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations sutis (circuit motif) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[15%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-100 blur-[100px]"></div>
        <div className="absolute bottom-[5%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[100px]"></div>
        
        {/* Pattern de circuito leve */}
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="circuit" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M54.627 0l.83.83v15.828L60 21.205v15.01L54.627 41.67v15.828l.83.83V60h-2.51l-.83-.83V42.086L46 36.66V23.34l6.113-5.426V1.66l-.83-.83H54.627zm-10.42 0l.83.83v12.51l-6.114 5.426v15.01l6.114 5.426v12.51l.83.83V60h-2.51l-.83-.83V43.744L36 38.318V21.682l6.113-5.426V1.66l-.83-.83h2.51c.08-.184.184-.36.313-.518z" fill="#000000" fillOpacity="0.02" fillRule="evenodd"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="bg-white w-full max-w-md rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10 relative z-10 border border-slate-100 flex flex-col">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-purple-600 p-3 rounded-2xl mb-4 shadow-[0_8px_16px_rgba(147,51,234,0.25)] ring-4 ring-purple-50">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">BuildMyPC</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="user@email.com" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 bg-slate-50/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-700 bg-slate-50/50"
            />
          </div>

          <button className="w-full bg-[#6532C2] hover:bg-[#52299E] text-white font-medium py-3 rounded-xl transition-all shadow-[0_6px_20px_rgba(101,50,194,0.3)] mt-4 active:scale-[0.98]">
            Sign In
          </button>

          <div className="text-center mt-6">
            <button className="text-sm font-medium text-sm text-slate-500 hover:text-[#6532C2] transition-colors">Forgot Password?</button>
          </div>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-medium">or sign in with</span>
            </div>
          </div>

          <button 
            onClick={loginWithGoogle}
            className="w-full group bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
}
