import React, { useState, useEffect } from 'react';
import { Cpu, Box, HardDrive, Gamepad2, Database, Zap, Sparkles, Fan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, csrf } from '../services/api';

type ComponentModel = {
  id: string;
  type: string;
  name: string;
  brand: string;
  specs: any;
};

const CATEGORIES = [
  { id: 'cpu', name: 'Processador (CPU)', icon: Cpu },
  { id: 'cooler', name: 'Cooler / Watercooler', icon: Fan },
  { id: 'motherboard', name: 'Placa Mãe', icon: Box },
  { id: 'ram', name: 'Memória RAM', icon: Database },
  { id: 'gpu', name: 'Placa de Vídeo (GPU)', icon: Gamepad2 },
  { id: 'storage', name: 'Armazenamento', icon: HardDrive },
  { id: 'psu', name: 'Fonte (PSU)', icon: Zap },
];

export default function SetupBuilder() {
  const navigate = useNavigate();
  const [dbComponents, setDbComponents] = useState<ComponentModel[]>([]);
  const [selections, setSelections] = useState<Record<string, ComponentModel>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [setupTitle, setSetupTitle] = useState('');

  useEffect(() => {
    // Busca os componentes reais do Laravel Postgres
    api.get<ComponentModel[]>('/components').then(res => {
      setDbComponents(res.data);
    }).catch(err => console.error("Falha ao carregar componentes DB", err));
  }, []);

  const handleSelect = (categoryId: string, compId: string) => {
    const comp = dbComponents.find(c => c.id === compId);
    if (comp) {
      setSelections(prev => ({ ...prev, [categoryId]: comp }));
    }
  };

  const isFormComplete = CATEGORIES.every(cat => selections[cat.id]) && setupTitle.trim().length > 3;

  const handleSubmit = async () => {
    if (!isFormComplete) return;
    setIsEvaluating(true);

    try {
      await csrf(); // Puxa o cookie CSRF de autenticação
      const componentIds = Object.values(selections).map(c => c.id);

      const payload = {
        title: setupTitle,
        description: "Montagem Inteligente através do Setup Builder",
        components: componentIds
      };

      const { data } = await api.post('/setups', payload);
      // O Laravel vai despachar a IA por baixo dos panos na fila
      // e nós redirecionamos pra tela de "Detalhes" pra ela fazer o Polling!
      navigate(`/setup/${data.setup.id}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('Erro: Você precisa estar logado para salvar e testar a Build com a IA!');
      } else {
        alert('Erro desconhecido ao validar hardware.');
      }
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:px-10 max-w-[1300px] mx-auto min-h-full">
      <div className="mb-8 md:mb-12">
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight leading-tight flex items-center gap-3">
          Build Your Dream PC
          <Sparkles className="w-8 h-8 text-[#6532C2]" />
        </h1>
        <p className="text-slate-500 mt-2 text-[15px] sm:text-[17px] font-medium max-w-2xl">
          Selecione os componentes do seu setup. Nosso motor alimentado pelo Google Gemini vai analisar Gargalos (Bottlenecks) e compatibilidade termal automaticamente.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
        {/* Formulário de Componentes (Esquerda) */}
        <div className="flex-1 space-y-5">

          {/* Título do Setup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-[16px] mb-3">Nome da Build</h3>
            <input
              type="text"
              placeholder="Exemplo: Máquina de Guerra 4K Ultra"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-[#6532C2]/10 focus:border-[#6532C2] transition-all placeholder:font-medium placeholder:text-slate-400"
              value={setupTitle}
              onChange={(e) => setSetupTitle(e.target.value)}
            />
          </div>

          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const hasSelection = !!selections[category.id];

            // Filtra o catálogo do banco de dados pelo tipo da categoria
            const options = dbComponents.filter(c => c.type === category.id);

            return (
              <div
                key={category.id}
                className={`bg-white p-5 rounded-2xl border transition-all duration-300 ${hasSelection ? 'border-[#6532C2]/40 shadow-sm shadow-purple-900/5' : 'border-slate-200'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl border transition-colors ${hasSelection ? 'bg-purple-100/50 border-purple-200' : 'bg-slate-50 border-slate-100'}`}>
                    <Icon className={`w-6 h-6 ${hasSelection ? 'text-[#6532C2]' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[16px]">{category.name}</h3>
                    <p className={`text-[13px] font-semibold tracking-wide uppercase ${hasSelection ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {hasSelection ? 'Componente Selecionado' : 'Aguardando Escolha'}
                    </p>
                  </div>
                </div>

                <select
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-4 focus:ring-[#6532C2]/10 focus:border-[#6532C2] transition-all cursor-pointer appearance-none hover:bg-slate-100"
                  value={selections[category.id]?.id || ''}
                  onChange={(e) => handleSelect(category.id, e.target.value)}
                >
                  <option value="" disabled>Selecione um item da lista...</option>
                  {options.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.brand} - {opt.name}</option>
                  ))}
                  {options.length === 0 && <option value="" disabled>Carregando inventário...</option>}
                </select>
              </div>
            );
          })}
        </div>

        {/* Resumo e Botão de Ação (Direita/Sticky Dark Mode Card) */}
        <div className="w-full xl:w-[420px]">
          <div className="bg-[#0F172A] rounded-[24px] p-6 lg:p-8 sticky top-[100px] shadow-2xl shadow-indigo-900/20 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">Build Summary</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start border-b border-slate-800/80 pb-3">
                <span className="text-sm text-slate-400 font-medium">Nome</span>
                <span className={`text-[13px] font-bold text-right max-w-[200px] line-clamp-1 ${setupTitle ? 'text-purple-400' : 'text-slate-600'}`}>
                  {setupTitle || '...'}
                </span>
              </div>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="flex justify-between items-start border-b border-slate-800/80 pb-3">
                  <span className="text-sm text-slate-400 font-medium">{cat.name}</span>
                  <span className={`text-[13px] font-semibold text-right max-w-[200px] line-clamp-2 ${selections[cat.id] ? 'text-slate-100' : 'text-slate-600'}`}>
                    {selections[cat.id]?.name || '-- Vazio --'}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={!isFormComplete || isEvaluating}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-[15px] transition-all duration-300
                ${!isFormComplete
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-[#6532C2] text-white hover:bg-[#5b2cb0] shadow-[0_0_20px_rgba(101,50,194,0.3)] hover:shadow-[0_0_30px_rgba(101,50,194,0.5)] border border-purple-500/50'
                }
              `}
            >
              {isEvaluating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Inteligência Artificial Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  Validar Setup Real com AI
                </>
              )}
            </button>
            {!isFormComplete && (
              <p className="text-center text-[13px] text-slate-500 mt-5 font-semibold">
                * Preencha Título e Peças para liberar a AI.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
