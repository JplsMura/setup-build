import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, AlertCircle, Cpu, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function SetupDetails() {
  const { id } = useParams();
  const [analyzing, setAnalyzing] = useState(true);
  const [setupData, setSetupData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSetup = async () => {
      try {
        const { data } = await api.get(`/setups/${id}`);
        if (!isMounted) return;

        const setup = data.setup;
        setSetupData(setup);

        // Para o carregamento se a IA terminou (sucesso ou erro)
        if (setup.ai_status !== 'pending') {
          setAnalyzing(false);
        }
      } catch (err) {
        console.error("Erro ao buscar setup", err);
        setAnalyzing(false); // Para o loading mesmo em caso de erro na API
      }
    };

    fetchSetup();

    // Configura o Polling
    const interval = setInterval(() => {
      fetchSetup();
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  if (analyzing) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-6">
        <div className="relative mb-8">
          <div className="w-28 h-28 border-4 border-slate-100 border-t-[#6532C2] rounded-full animate-spin"></div>
          <Cpu className="w-9 h-9 text-[#6532C2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Google Gemini 2.5 está analisando...</h2>
        <p className="text-slate-500 max-w-sm mx-auto font-medium mb-6">
          Nossa rede neural está cruzando especificações para garantir a melhor sinergia do seu hardware.
        </p>
        <span className="bg-purple-100 text-[#6532C2] text-xs font-bold px-4 py-2 rounded-full animate-pulse border border-purple-200">
          Processamento Assíncrono via Redis
        </span>
      </div>
    );
  }

  // Tratamento Dinâmico dos Dados
  const title = setupData?.title || "Setup Sem Título";
  const authorName = setupData?.user?.name || "Usuário Desconhecido";
  const authorAvatar = setupData?.user?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=6532C2&color=fff&bold=true`;

  const isApproved = setupData?.ai_status === 'approved';
  const hasError = setupData?.ai_status === 'error' || !!setupData?.ai_feedback?.error;
  const feedback = setupData?.ai_feedback;

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
                  <Check className="w-3 h-3 inline mr-1" /> Aprovado pela IA
                </span>
              ) : (
                <span className={`font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide uppercase border ${hasError ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                  {hasError ? 'Erro na Validação' : 'Problema Detectado'}
                </span>
              )}
              <div className="flex items-center gap-2">
                <img src={authorAvatar} alt="Owner" className="w-6 h-6 rounded-full" />
                <span className="text-sm font-semibold text-slate-500">por {authorName}</span>
              </div>
            </div>

            {/* Imagem de Capa (Poderia ser dinâmica no futuro) */}
            {/* <div className="relative aspect-video bg-slate-100 rounded-[20px] overflow-hidden mb-10 shadow-sm border border-slate-100">
              <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d6?auto=format&fit=crop&q=80&w=1200" alt="PC Build" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg text-sm font-extrabold text-slate-800 border-2 border-slate-100">
                Setup Dinâmico
              </div>
            </div> */}

            <h3 className="text-[19px] font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3">Peças Selecionadas</h3>

            {/* Renderização Dinâmica do Banco de Dados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {setupData?.components && setupData.components.length > 0 ? (
                setupData.components.map((c: any) => (
                  <div key={c.id} className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-[#6532C2] uppercase tracking-wider">{c.type}</span>
                    <p className="font-semibold text-slate-700 text-base">{c.brand} {c.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 col-span-2">Nenhum componente encontrado para este setup.</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Veredito HUD (Direita) */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-[#0F172A] rounded-[24px] p-6 lg:p-7 sticky top-[100px] shadow-2xl shadow-indigo-900/10 border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className={`w-6 h-6 ${hasError ? 'text-red-400' : 'text-emerald-400'}`} />
              <h2 className="text-xl font-bold text-white">Veredito Interativo</h2>
            </div>

            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 mb-6">
              <p className="text-[15px] font-medium leading-relaxed text-slate-300">
                {/* Fallback inteligente: Exibe o Veredito, ou o Erro, ou mensagem padrão */}
                {feedback?.verdict || feedback?.error || "Nenhum feedback fornecedido pela IA."}
              </p>
              {feedback?.details && (
                <div className="mt-4 p-3 bg-red-900/30 text-red-300 text-[13px] rounded border border-red-500/20 font-mono break-all">
                  <strong className="block mb-1 text-red-400">Log de Exceção:</strong>
                  {typeof feedback.details === 'string' ? feedback.details : JSON.stringify(feedback.details)}
                </div>
              )}
            </div>

            {/* Alertas Dinâmicos baseados no JSON da IA */}
            {feedback?.warnings && feedback.warnings.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider block mb-4">Pontos de Atenção</span>
                <div className="space-y-3">
                  {feedback.warnings.map((warning: string, index: number) => (
                    <div key={index} className="flex gap-3 text-sm text-amber-400/90 font-medium bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risco de Gargalo */}
            {feedback?.bottleneck_risk && (
              <div className="mt-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <span className="text-slate-300 font-semibold">Risco de Gargalo:</span>
                <span className={`font-black uppercase tracking-wider text-sm
                    ${feedback.bottleneck_risk === 'high' ? 'text-red-400' : ''}
                    ${feedback.bottleneck_risk === 'medium' ? 'text-amber-400' : ''}
                    ${feedback.bottleneck_risk === 'low' ? 'text-emerald-400' : ''}
                 `}>
                  {feedback.bottleneck_risk}
                </span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}