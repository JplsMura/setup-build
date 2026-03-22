import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, AlertCircle, Cpu, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function SetupDetails() {
  const { id } = useParams();
  const [analyzing, setAnalyzing] = useState(true);
  const [setupData, setSetupData] = useState<any>(null);

  useEffect(() => {
    if (!id || id === 'demo-result') {
      const timer = setTimeout(() => setAnalyzing(false), 3500); 
      return () => clearTimeout(timer);
    }

    // Polling Estratégico na Rota Show
    let isMounted = true;
    
    const fetchSetup = async () => {
       try {
         const { data } = await api.get(`/setups/${id}`);
         if (!isMounted) return;
         
         const setup = data.setup;
         setSetupData(setup);

         if (setup.ai_status !== 'pending') {
            setAnalyzing(false);
         }
       } catch (err) {
         console.error("Erro ao buscar setup", err);
         setAnalyzing(false);
       }
    };

    fetchSetup();
    const interval = setInterval(() => {
       if (analyzing) fetchSetup();
    }, 4000); // 4 segundos de Polling para não floodar a API

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, analyzing]);

  if (analyzing) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-6">
        <div className="relative mb-8">
          <div className="w-28 h-28 border-4 border-slate-100 border-t-[#6532C2] rounded-full animate-spin"></div>
          <Cpu className="w-9 h-9 text-[#6532C2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Google Gemini está trabalhando...</h2>
        <p className="text-slate-500 max-w-sm mx-auto font-medium mb-6">
          Nossa rede neural está cruzando milhões de benchmarks para descobrir se as conexões de sua Placa-mãe suportam sua GPU.
        </p>
        <span className="bg-purple-100 text-[#6532C2] text-xs font-bold px-4 py-2 rounded-full animate-pulse border border-purple-200">
          Processamento Assíncrono via Redis Fila
        </span>
      </div>
    );
  }

  // Fallback demo caso seja o demo ou a API caia
  const title = setupData?.title || "Intel Core i9 + RTX 4090 Ultimate Rig";
  const authorName = setupData?.user?.name || "João Pedro";
  const authorAvatar = setupData?.user?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=6532C2&color=fff&bold=true`;
  const isApproved = setupData?.ai_status === 'approved' || setupData?.ai_status === 'demo';

  return (
    <div className="p-6 md:p-8 lg:px-10 max-w-[1400px] mx-auto min-h-full">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#6532C2] font-semibold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Comunidade
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content (Esquerda) */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">{title}</h1>
            <div className="flex items-center gap-4 mb-8">
              {isApproved ? (
                 <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide uppercase border border-emerald-200">
                   Setup Aprovado pela IA
                 </span>
              ) : (
                  <span className="bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide uppercase border border-red-200">
                   Gargalo Encontrado
                 </span>
              )}
              <div className="flex items-center gap-2">
                 <img src={authorAvatar} alt="Owner" className="w-6 h-6 rounded-full" />
                 <span className="text-sm font-semibold text-slate-500">por {authorName}</span>
              </div>
            </div>

            <div className="relative aspect-video bg-slate-100 rounded-[20px] overflow-hidden mb-10 shadow-sm border border-slate-100">
               <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d6?auto=format&fit=crop&q=80&w=1200" alt="PC Build" className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg text-sm font-extrabold text-slate-800 border-2 border-slate-100">
                  Setup Dinâmico
               </div>
            </div>

            <h3 className="text-[19px] font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3">Peças Selecionadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {setupData?.components?.map((c: any) => (
                 <div key={c.id} className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">{c.type}</span>
                    <p className="font-semibold text-slate-700 text-base">{c.brand} {c.name}</p>
                 </div>
              ))}
              {!setupData?.components && (
                 <>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">Processador</span>
                    <p className="font-semibold text-slate-700 text-base">Intel Core i9-14900K</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">Placa de Vídeo</span>
                    <p className="font-semibold text-slate-700 text-base">NVIDIA GeForce RTX 4090 24GB</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">Aceleração Ram</span>
                    <p className="font-semibold text-slate-700 text-base">64GB (2x32GB) DDR5 6400MHz</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">Construção</span>
                    <p className="font-semibold text-slate-700 text-base">ASUS ROG Maximus Z790 Hero</p>
                  </div>
                 </>
              )}
            </div>
          </div>

           {/* Área de Comentários Omitida por brevidade */}
        </div>

        {/* AI Veredito HUD (Direita) */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-[#0F172A] rounded-[24px] p-6 lg:p-7 sticky top-[100px] shadow-2xl shadow-indigo-900/10 border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Veredito Interativo</h2>
            </div>
            
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700">
                <p className="text-[15px] font-medium leading-relaxed text-slate-300">
                   {setupData?.ai_feedback || "Este build obteve sinergia perfeita entre CPU e GPU. O socket Z790 é nativo para a 14ª Geração, enquanto a fonte de 1000W garante margem absurda para picos."}
                </p>
            </div>

            <div className="pt-8 mt-5 border-t border-slate-800/80">
               <div className="flex justify-between items-center mb-2.5">
                 <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Placar Gaming IA</span>
                 <span className="text-[#a074ec] font-black text-xl">99/100</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner mb-6">
                 <div className="bg-gradient-to-r from-purple-600 to-[#a074ec] h-3 rounded-full" style={{ width: '99%' }}></div>
               </div>

               <div className="flex justify-between items-center mb-2.5">
                 <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Workflow Rendering</span>
                 <span className="text-emerald-400 font-black text-xl">97/100</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                 <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full" style={{ width: '97%' }}></div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
