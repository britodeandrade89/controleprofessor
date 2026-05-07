import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Car, 
  CreditCard, 
  Wrench, 
  Coffee, 
  AlertCircle,
  ArrowRight,
  Home,
  School,
  CalendarDays,
  PlusCircle,
  Wallet,
  Calculator,
  TrendingDown,
  Coins,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Estados de Rota
  const [diaSelecionado, setDiaSelecionado] = useState('sexta'); 
  const [decisaoJanela, setDecisaoJanela] = useState('mae_academia'); 
  const [decisaoJanelaSegunda, setDecisaoJanelaSegunda] = useState('mae_academia'); 
  const [horaSaidaFinal, setHoraSaidaFinal] = useState('22:15'); 

  // Estados de Configuração de Veículo
  const [precoCombustivel, setPrecoCombustivel] = useState(5.90);
  const [consumoVeiculo, setConsumoVeiculo] = useState(10);

  // Estados Financeiros (Raio-X do Salário)
  const [salarioBase, setSalarioBase] = useState(3650.83);
  const [auxilioAlimentacao, setAuxilioAlimentacao] = useState(449.10);
  const [horasSemanaisContrato, setHorasSemanaisContrato] = useState(20);

  // Estados do Controle de Execução (Mês Atual)
  const [qntSegundas, setQntSegundas] = useState(4);
  const [qntSextas, setQntSextas] = useState(4);
  const [segundasTrabalhadas, setSegundasTrabalhadas] = useState<number[]>([]);
  const [sextasTrabalhadas, setSextasTrabalhadas] = useState<number[]>([]);

  const toggleDiaTrabalhado = (dia: 'segunda' | 'sexta', index: number) => {
    if (dia === 'segunda') {
      setSegundasTrabalhadas(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    } else {
      setSextasTrabalhadas(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    }
  };

  // Função para calcular a hora de chegada em Maricá (soma 1h e 23min)
  const calcularChegadaMarica = (horaSaida: string) => {
    if (!horaSaida) return '--:--';
    const [h, m] = horaSaida.split(':').map(Number);
    let min = m + 23;
    let hr = h + 1;
    if (min >= 60) {
      min -= 60;
      hr += 1;
    }
    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  // --- DADOS SEXTA-FEIRA ---
  const rotaBaseSexta = {
    ida: { custo: 54.00, km: 88.8 },
    escola1_2: { custo: 3.00, km: 4.5 },
    escola2_3: { custo: 3.00, km: 4.3 },
    volta: { custo: 63.00, km: 91.1 } 
  };

  const rotaJanelaSexta = {
    escola3_mae: { custo: 2.00, km: 1.2 }, 
    mae_academia_ida_volta: { custo: 6.00, km: 4.8 },
    mae_escola4: { custo: 3.00, km: 3.4 }
  };

  const custoBaseDiarioSexta = rotaBaseSexta.ida.custo + rotaBaseSexta.escola1_2.custo + rotaBaseSexta.escola2_3.custo + rotaBaseSexta.volta.custo;
  const kmBaseDiarioSexta = rotaBaseSexta.ida.km + rotaBaseSexta.escola1_2.km + rotaBaseSexta.escola2_3.km + rotaBaseSexta.volta.km;

  const custoJanela = rotaJanelaSexta.escola3_mae.custo + rotaJanelaSexta.mae_academia_ida_volta.custo + rotaJanelaSexta.mae_escola4.custo;
  const kmJanela = rotaJanelaSexta.escola3_mae.km + rotaJanelaSexta.mae_academia_ida_volta.km + rotaJanelaSexta.mae_escola4.km;

  const kmSexta = decisaoJanela === 'mae_academia' ? kmBaseDiarioSexta + kmJanela : kmBaseDiarioSexta;
  const custoSexta = ((kmSexta / consumoVeiculo) * precoCombustivel) + 6.60;

  // --- DADOS SEGUNDA-FEIRA ---
  const rotaBaseSegunda = {
    ida: { custo: 50.00, km: 81.6 },
    escola1_2: { custo: 8.00, km: 10.3 }, 
    escola2_3_direto: { custo: 5.00, km: 6.7 },
    escola2_mae: { custo: 16.00, km: 25.3 },
    mae_academia: { custo: 6.00, km: 4.8 },
    mae_escola3: { custo: 10.00, km: 16.5 },
    volta: { custo: 52.00, km: 74.6 } 
  };

  let custoTrechoExtraSegunda = 0;
  let kmTrechoExtraSegunda = 0;

  if (decisaoJanelaSegunda === 'direto') {
    custoTrechoExtraSegunda = rotaBaseSegunda.escola2_3_direto.custo;
    kmTrechoExtraSegunda = rotaBaseSegunda.escola2_3_direto.km;
  } else if (decisaoJanelaSegunda === 'mae_academia') {
    custoTrechoExtraSegunda = rotaBaseSegunda.escola2_mae.custo + rotaBaseSegunda.mae_academia.custo + rotaBaseSegunda.mae_escola3.custo;
    kmTrechoExtraSegunda = rotaBaseSegunda.escola2_mae.km + rotaBaseSegunda.mae_academia.km + rotaBaseSegunda.mae_escola3.km;
  }

  const kmSegunda = rotaBaseSegunda.ida.km + rotaBaseSegunda.escola1_2.km + kmTrechoExtraSegunda + rotaBaseSegunda.volta.km;
  const custoSegunda = ((kmSegunda / consumoVeiculo) * precoCombustivel) + 6.60;

  // --- CÁLCULOS DO DIA SELECIONADO ---
  const custoDiaVisualizado = diaSelecionado === 'sexta' ? custoSexta : custoSegunda;
  const kmDiaVisualizado = diaSelecionado === 'sexta' ? kmSexta : kmSegunda;
  const acordarDia = '04:00 AM';
  const sairDia = diaSelecionado === 'sexta' ? '04:40 AM' : '04:30 AM';
  const corTemaBase = diaSelecionado === 'sexta' ? 'indigo' : 'blue';

  const custoCombustivelDiaVisualizado = (kmDiaVisualizado / consumoVeiculo) * precoCombustivel;
  const custoPedagioDiaVisualizado = 6.60;

  // --- CÁLCULOS TOTAIS (FINANÇAS DE ROTA) ---
  const custoSemanal = custoSegunda + custoSexta; 
  const custoMensal = custoSemanal * 4; 
  const reservaRecomendada = Math.ceil(custoMensal * 1.15); 
  const kmMensal = (kmSegunda + kmSexta) * 4;
  const mesesParaTrocaOleo = 10000 / (kmMensal > 0 ? kmMensal : 1);

  const custoCombustivelMensal = (kmMensal / consumoVeiculo) * precoCombustivel;
  const custoPedagioMensal = 6.60 * 2 * 4; // 2 pedágios por semana, 4 semanas por mês

  // --- CÁLCULOS DE EXECUÇÃO (MÊS ATUAL) ---
  const custoRealizadoSegundas = segundasTrabalhadas.length * custoSegunda;
  const custoRealizadoSextas = sextasTrabalhadas.length * custoSexta;
  const totalGastoRealizado = custoRealizadoSegundas + custoRealizadoSextas;
  const projetadoFinalMes = (qntSegundas * custoSegunda) + (qntSextas * custoSexta);

  // --- CÁLCULOS DE SALÁRIO (RAIO-X) ---
  const rendaTotalMensal = salarioBase + auxilioAlimentacao;
  const saldoLivreReal = rendaTotalMensal - custoMensal; 
  const saldoLivreComGordura = rendaTotalMensal - reservaRecomendada; 
  
  const horasMensaisTrabalho = horasSemanaisContrato * 4; 
  const valorHoraBruto = rendaTotalMensal / (horasMensaisTrabalho > 0 ? horasMensaisTrabalho : 1);
  const valorHoraLiquido = saldoLivreReal / (horasMensaisTrabalho > 0 ? horasMensaisTrabalho : 1);

  const TimelineItem = ({ icon: Icon, title, isMain, children, dotColor = `bg-${corTemaBase}-500`, ringColor = `ring-${corTemaBase}-50` }: any) => (
    <div className="flex relative pb-8 group">
      <div className="absolute top-8 bottom-0 left-[19px] w-[2px] bg-slate-100 group-last:bg-transparent"></div>
      <div className="relative mr-6 mt-1 flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${ringColor} bg-white shadow-sm z-10 relative`}>
          <Icon className={`w-5 h-5 ${dotColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className={`flex-1 bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow ${isMain ? `border-l-4 border-l-${corTemaBase}-500` : ''}`}>
        <h3 className="font-bold text-lg text-slate-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-12 overflow-x-hidden`}>
      
      {/* HEADER SUPER PREMIUM */}
      <nav className="bg-[#111827] border-b border-[#0a0f18] sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        
        {/* Texture Background (Subtle Marble/Topographic Look) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        
        {/* Graph Line Background */}
        <div className="absolute bottom-0 right-0 w-3/4 max-w-3xl h-[120%] overflow-hidden opacity-10 pointer-events-none mix-blend-screen translate-y-6">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-[#c2a278]">
                <path d="M0,200 L0,170 L50,180 L100,150 L150,160 L200,130 L250,155 L300,120 L350,145 L400,110 L450,135 L500,125 L550,160 L600,140 L650,175 L700,150 L750,180 L800,100 L850,70 L900,40 L950,50 L1000,10 L1000,200 Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M0,170 L50,180 L100,150 L150,160 L200,130 L250,155 L300,120 L350,145 L400,110 L450,135 L500,125 L550,160 L600,140 L650,175 L700,150 L750,180 L800,100 L850,70 L900,40 L950,50 L1000,10" stroke="currentColor" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(194,162,120,1)]" />
            </svg>
        </div>

        {/* Depth Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0f18] to-transparent pointer-events-none opacity-80 mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1e293b]/30 to-transparent pointer-events-none mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-center py-6 gap-6">
            
            {/* LOGO & TITLE AREA */}
            <div className="flex flex-col md:flex-row items-center w-full xl:w-auto">
              
              {/* Premium Icon Container */}
              <div className="relative w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-[24px] bg-[#0c121d] shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-center mb-5 md:mb-0 md:mr-7 shrink-0 border border-slate-800 z-10 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-[#334155] before:to-transparent before:rounded-[24px] before:-m-[1px]">
                  
                  {/* Inner Box with Gold Rim */}
                  <div className="absolute inset-[6px] rounded-[18px] border border-[#a28662]/70 shadow-[inset_0_5px_15px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center bg-gradient-to-b from-[#131b29] via-[#1a2436] to-[#111827] overflow-hidden">
                      {/* Inner gold highlight */}
                      <div className="absolute inset-0 rounded-[18px] border-[1.5px] border-[#e5d0b4]/20 shadow-[inner_0_0_12px_rgba(229,208,180,0.15)]"></div>
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 blur-xl rounded-full"></div>
                      
                      <MapPin className="w-10 h-10 md:w-11 md:h-11 text-[#cca97f] drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]" strokeWidth={1.5} />
                  </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center md:text-left flex flex-col justify-center">
                  <h1 
                    className="text-3xl sm:text-[2.4rem] md:text-[3rem] leading-[1.1] mb-1 text-transparent bg-clip-text bg-gradient-to-b from-[#fdf9f1] via-[#d5bba0] to-[#80613b]" 
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.9))' }}
                  >
                    PAINEL LOGÍSTICO
                  </h1>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#8e9bb0] drop-shadow-lg pl-1">
                    Prof. André Brito
                  </p>
              </div>
            </div>

            {/* SELETOR DE DIAS */}
            <div className="bg-[#1a2333]/90 p-1.5 rounded-[14px] flex w-full xl:w-auto border border-[#2a364a] relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[10px] bg-gradient-to-b from-[#2d3a54] to-[#1e293b] border border-[#3b4b6b] shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-0"
                initial={false}
                animate={{ left: diaSelecionado === 'segunda' ? '6px' : 'calc(50% + 0px)' }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setDiaSelecionado('segunda')}
                className={`flex-1 xl:w-44 py-2.5 px-4 rounded-[10px] font-bold text-[13px] uppercase tracking-wider flex items-center justify-center transition-colors duration-300 relative z-10 ${diaSelecionado === 'segunda' ? 'text-white drop-shadow-md' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
              >
                Segunda-feira
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setDiaSelecionado('sexta')}
                className={`flex-1 xl:w-44 py-2.5 px-4 rounded-[10px] font-bold text-[13px] uppercase tracking-wider flex items-center justify-center transition-colors duration-300 relative z-10 ${diaSelecionado === 'sexta' ? 'text-white drop-shadow-md' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
              >
                Sexta-feira
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* RESUMO RÁPIDO (METRIC CARDS) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-5 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-50 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-rose-500 mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-rose-50 rounded-lg mr-2">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-rose-600 truncate">Despertar</span>
            </div>
            <motion.p key={acordarDia} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">{acordarDia}</motion.p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-50 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-orange-500 mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-orange-50 rounded-lg mr-2">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-orange-600 truncate">Saída Exata</span>
            </div>
            <motion.p key={sairDia} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">{sairDia}</motion.p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-emerald-500 mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-emerald-50 rounded-lg mr-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-600 truncate">Total (Dia)</span>
            </div>
            <motion.p key={custoDiaVisualizado} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">R$ {custoDiaVisualizado.toFixed(2).replace('.', ',')}</motion.p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-[#10b981]/50 transition-colors">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10b981]/10 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-[#10b981] mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-[#10b981]/10 rounded-lg mr-2">
                <Coins className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#10b981] truncate">Combustível (Dia)</span>
            </div>
            <motion.p key={`comb-${custoCombustivelDiaVisualizado}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">R$ {custoCombustivelDiaVisualizado.toFixed(2).replace('.', ',')}</motion.p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-[#8b5cf6]/50 transition-colors">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#8b5cf6]/10 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-[#8b5cf6] mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-[#8b5cf6]/10 rounded-lg mr-2">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8b5cf6] truncate">Pedágio (Dia)</span>
            </div>
            <motion.p key={`ped-${custoPedagioDiaVisualizado}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">R$ {custoPedagioDiaVisualizado.toFixed(2).replace('.', ',')}</motion.p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center text-blue-500 mb-2 sm:mb-3 relative z-10">
              <div className="p-1 sm:p-1.5 bg-blue-50 rounded-lg mr-2">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-blue-600 truncate">Distância</span>
            </div>
            <motion.p key={kmDiaVisualizado} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 relative z-10">{kmDiaVisualizado.toFixed(1).replace('.', ',')} <span className="text-sm sm:text-base font-semibold text-slate-400">km</span></motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: ITINERÁRIO */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PAINEL DE DECISÃO DA JANELA */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center">
                  Estratégia de Intervalo
                </h2>
                <p className="text-sm text-slate-500">Ajuste o itinerário com base na sua decisão para a janela de ociosidade.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {diaSelecionado === 'sexta' ? (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDecisaoJanela('escola')}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${decisaoJanela === 'escola' ? 'border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-100/50 pt-5' : 'border-slate-100 hover:border-indigo-200 bg-white'}`}
                    >
                      <AnimatePresence>
                        {decisaoJanela === 'escola' && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg mr-3 ${decisaoJanela === 'escola' ? 'bg-indigo-100/80' : 'bg-slate-50'}`}>
                          <School className={`w-5 h-5 ${decisaoJanela === 'escola' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold ${decisaoJanela === 'escola' ? 'text-indigo-900' : 'text-slate-700'}`}>Ficar na Escola</span>
                      </div>
                      <p className="text-sm text-slate-500 ml-[44px]">Descanso in loco. Nenhuma alteração no custo.</p>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDecisaoJanela('mae_academia')}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${decisaoJanela === 'mae_academia' ? 'border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-200 bg-white'}`}
                    >
                      <AnimatePresence>
                        {decisaoJanela === 'mae_academia' && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg mr-3 ${decisaoJanela === 'mae_academia' ? 'bg-indigo-100/80' : 'bg-slate-50'}`}>
                          <Home className={`w-5 h-5 ${decisaoJanela === 'mae_academia' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold ${decisaoJanela === 'mae_academia' ? 'text-indigo-900' : 'text-slate-700'}`}>Mãe + Academia</span>
                      </div>
                      <p className="text-sm text-slate-500 ml-[44px]">Foco no bem-estar físico e mental.</p>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDecisaoJanelaSegunda('direto')}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${decisaoJanelaSegunda === 'direto' ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-100/50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      <AnimatePresence>
                        {decisaoJanelaSegunda === 'direto' && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg mr-3 ${decisaoJanelaSegunda === 'direto' ? 'bg-blue-100/80' : 'bg-slate-50'}`}>
                          <School className={`w-5 h-5 ${decisaoJanelaSegunda === 'direto' ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold ${decisaoJanelaSegunda === 'direto' ? 'text-blue-900' : 'text-slate-700'}`}>Ir Direto (Fazer Hora)</span>
                      </div>
                      <p className="text-sm text-slate-500 ml-[44px]">Mais barato, porém com ociosidade até 20:45.</p>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDecisaoJanelaSegunda('mae_academia')}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${decisaoJanelaSegunda === 'mae_academia' ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-100/50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      <AnimatePresence>
                        {decisaoJanelaSegunda === 'mae_academia' && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg mr-3 ${decisaoJanelaSegunda === 'mae_academia' ? 'bg-blue-100/80' : 'bg-slate-50'}`}>
                          <Home className={`w-5 h-5 ${decisaoJanelaSegunda === 'mae_academia' ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold ${decisaoJanelaSegunda === 'mae_academia' ? 'text-blue-900' : 'text-slate-700'}`}>Mãe + Academia</span>
                      </div>
                      <p className="text-sm text-slate-500 ml-[44px]">Conforto e segurança em Santa Cruz da Serra.</p>
                    </motion.button>
                  </>
                )}
              </div>
            </section>

            {/* ROTA EXIBIDA */}
            <div className="pt-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center px-1">
                Visualização do Trajeto
              </h2>

              <AnimatePresence mode="wait">
                <motion.div
                  key={diaSelecionado + '_' + (diaSelecionado === 'sexta' ? decisaoJanela : decisaoJanelaSegunda)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >

              {diaSelecionado === 'sexta' && (
                <div className="ml-2">
                  <TimelineItem icon={Home} title="Casa (Maricá) para CIEP 320" isMain={true}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex justify-between border-b border-slate-100 pb-1"><span>Saída:</span> <span className="font-semibold text-slate-900">04:40 AM</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-1"><span>Chegada:</span> <span className="font-semibold text-slate-900">06:30 AM</span></p>
                        <p className="flex justify-between"><span>Início da Aula:</span> <span className="font-semibold text-slate-900">07:00 AM</span></p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 flex flex-col justify-center border border-slate-200/60">
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Custos do Trecho</p>
                        <p className="text-slate-700 font-medium text-sm mb-0.5">Distância: {rotaBaseSexta.ida.km.toFixed(1).replace('.', ',')} km</p>
                        <p className="text-slate-900 font-semibold">R$ {rotaBaseSexta.ida.custo.toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  </TimelineItem>

                  <TimelineItem icon={School} title="CIEP 320 para CIEP 476" dotColor="bg-slate-400" ringColor="ring-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm space-y-1 text-slate-600">
                        <p><span>Sair às:</span> <strong className="text-indigo-700 font-bold">08:30 AM</strong></p>
                        <p><span>Chegar às:</span> <strong className="text-slate-900 font-bold">08:40 AM</strong></p>
                      </div>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">{rotaBaseSexta.escola1_2.km.toFixed(1).replace('.', ',')} km</span>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">R$ {rotaBaseSexta.escola1_2.custo.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </TimelineItem>

                  <TimelineItem icon={School} title="CIEP 476 para CASA (Caxias)" dotColor="bg-slate-400" ringColor="ring-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm space-y-1 text-slate-600">
                        <p><span>Sair às:</span> <strong className="text-indigo-700 font-bold">12:15 PM</strong></p>
                        <p><span>Chegar às:</span> <strong className="text-slate-900 font-bold">12:25 PM</strong></p>
                      </div>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">{rotaBaseSexta.escola2_3.km.toFixed(1).replace('.', ',')} km</span>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">R$ {rotaBaseSexta.escola2_3.custo.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  </TimelineItem>

                  {decisaoJanela === 'mae_academia' && (
                    <TimelineItem icon={Coffee} title="Janela: Mãe + Academia" dotColor="bg-amber-500" ringColor="ring-amber-50">
                      <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/60">
                        <ul className="text-sm text-amber-800 space-y-2">
                          <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-amber-500"/> Escola 3 para Mãe (R$ {rotaJanelaSexta.escola3_mae.custo.toFixed(2).replace('.', ',')})</li>
                          <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-amber-500"/> Mãe ↔ Academia (R$ {rotaJanelaSexta.mae_academia_ida_volta.custo.toFixed(2).replace('.', ',')})</li>
                          <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-amber-500"/> Mãe para Escola 4 (R$ {rotaJanelaSexta.mae_escola4.custo.toFixed(2).replace('.', ',')})</li>
                        </ul>
                      </div>
                    </TimelineItem>
                  )}

                  <TimelineItem icon={Car} title="Retorno para Maricá" isMain={true}>
                    <div className="bg-indigo-50 border border-indigo-200/60 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1.5">Horário de Saída (Escola 4)</label>
                        <input 
                          type="time" 
                          value={horaSaidaFinal}
                          onChange={(e) => setHoraSaidaFinal(e.target.value)}
                          className="w-full bg-white border border-indigo-200 text-indigo-900 font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        />
                      </div>
                      <ArrowRight className="w-6 h-6 text-indigo-300 hidden md:block" />
                      <div className="flex-1 bg-white border border-indigo-100 rounded-lg p-3 w-full shadow-sm text-center md:text-left">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Chegada Prevista</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{calcularChegadaMarica(horaSaidaFinal)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold mt-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">{rotaBaseSexta.volta.km.toFixed(1).replace('.', ',')} km</span>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">R$ {rotaBaseSexta.volta.custo.toFixed(2).replace('.', ',')} (C/ Pedágio)</span>
                    </div>
                  </TimelineItem>
                </div>
              )}

              {diaSelecionado === 'segunda' && (
                <div className="ml-2">
                  <TimelineItem icon={Home} title="Casa (Maricá) para Escola 1" isMain={true}>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex justify-between border-b border-slate-100 pb-1"><span>Saída:</span> <span className="font-semibold text-slate-900">04:30 AM</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-1"><span>Chegada:</span> <span className="font-semibold text-slate-900">06:30 AM</span></p>
                        <p className="flex justify-between"><span>Início da Aula:</span> <span className="font-semibold text-slate-900">07:00 AM</span></p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 flex flex-col justify-center border border-slate-200/60">
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Via Amaral Peixoto</p>
                        <p className="text-slate-700 font-medium text-sm mb-0.5">Distância: 81,6 km</p>
                        <p className="text-slate-900 font-semibold">R$ 50,00</p>
                      </div>
                    </div>
                  </TimelineItem>

                  <TimelineItem icon={School} title="Escola 1 para CIEP 198">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm space-y-1 text-slate-600">
                        <p><span>Sair às:</span> <strong className="text-slate-900 font-semibold">12:15 PM</strong></p>
                        <p><span>Chegar às:</span> <strong className="text-slate-900 font-semibold">~13:00 PM</strong></p>
                        <p className="text-xs text-slate-400 mt-1">*Inclui tempo extra de engarrafamento.</p>
                      </div>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className="bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/80">10,3 km</span>
                        <span className="bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80">R$ 8,00</span>
                      </div>
                    </div>
                  </TimelineItem>

                  {decisaoJanelaSegunda === 'direto' && (
                    <>
                      <TimelineItem icon={School} title="CIEP 198 para Colégio Euclides">
                         <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500">Viagem de 30 min por dentro do bairro.</span>
                           <span className="font-semibold text-slate-900 bg-white border border-slate-200/80 px-2 py-1 rounded">R$ 5,00</span>
                         </div>
                      </TimelineItem>
                      <TimelineItem icon={AlertCircle} title="Janela de Ociosidade">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                          <p className="text-sm text-slate-700 mb-3">Sua aula inicia apenas às <strong>20:45</strong>.</p>
                          <div className="bg-white p-3 rounded-lg text-sm text-slate-700 border border-slate-200 flex items-start shadow-sm">
                            <AlertCircle className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Por precaução de segurança, estacione e aguarde o horário <strong>dentro do pátio/sala dos professores</strong> da escola.</span>
                          </div>
                        </div>
                      </TimelineItem>
                    </>
                  )}

                  {decisaoJanelaSegunda === 'mae_academia' && (
                    <TimelineItem icon={Coffee} title="Janela: Mãe + Academia">
                       <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                        <ul className="text-sm text-slate-700 space-y-3">
                          <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span><ChevronRight className="inline w-4 h-4 text-slate-400"/> CIEP 198 para Mãe</span>
                            <span className="font-semibold">R$ 16,00</span>
                          </li>
                          <li className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span><ChevronRight className="inline w-4 h-4 text-slate-400"/> Mãe ↔ Academia</span>
                            <span className="font-semibold">R$ 6,00</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span><ChevronRight className="inline w-4 h-4 text-slate-400"/> Mãe para Col. Euclides <span className="text-xs text-slate-500 ml-1">(Saída 20:00)</span></span>
                            <span className="font-semibold">R$ 10,00</span>
                          </li>
                        </ul>
                      </div>
                    </TimelineItem>
                  )}

                  <TimelineItem icon={Car} title="Retorno para Maricá" isMain={true}>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1.5">Horário de Saída</label>
                        <input 
                          type="time" 
                          value={horaSaidaFinal}
                          onChange={(e) => setHoraSaidaFinal(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 font-semibold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">*Aula termina teoricamente 22:25</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
                      <div className="flex-1 bg-white border border-slate-200/60 rounded-lg p-3 w-full shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Chegada Prevista</p>
                        <p className="text-2xl font-light text-slate-900 tracking-tight">{calcularChegadaMarica(horaSaidaFinal)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold mt-4">
                      <span className="bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/80">74,6 km</span>
                      <span className="bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80">R$ 52,00 (C/ Pedágio)</span>
                    </div>
                  </TimelineItem>
                </div>
              )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* COLUNA DIREITA: FINANÇAS E SALÁRIO */}
          <div className="space-y-6">
            
            {/* RAIO-X DO SALÁRIO */}
            <section className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-900/30 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="text-xl font-bold mb-6 flex items-center text-white relative z-10">
                <Wallet className="w-5 h-5 mr-3 text-indigo-400" />
                Raio-X do Salário
              </h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-slate-400">Salário Base</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      value={salarioBase}
                      onChange={(e) => setSalarioBase(Number(e.target.value))}
                      className="w-32 bg-slate-800 border border-slate-700 text-white rounded-lg pl-8 pr-3 py-1.5 text-right outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-slate-400">Auxílio Alim.</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      value={auxilioAlimentacao}
                      onChange={(e) => setAuxilioAlimentacao(Number(e.target.value))}
                      className="w-32 bg-slate-800 border border-slate-700 text-white rounded-lg pl-8 pr-3 py-1.5 text-right outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                  <span className="text-sm font-medium text-slate-400">Carga Semanal</span>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      value={horasSemanaisContrato}
                      onChange={(e) => setHorasSemanaisContrato(Number(e.target.value))}
                      className="w-20 bg-slate-800 border border-slate-700 text-indigo-300 rounded-lg pr-8 pl-3 py-1.5 text-right outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold"
                    />
                    <span className="absolute right-3 text-slate-500 text-sm font-bold">h</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-sm font-medium">Renda Total Bruta</span>
                  <span className="font-semibold text-white">R$ {rendaTotalMensal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center text-rose-400">
                  <span className="text-sm font-medium flex items-center"><Car className="w-4 h-4 mr-2"/> Gastos de Rota</span>
                  <span className="font-semibold">- R$ {custoMensal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="pt-4 border-t border-slate-700/80">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Livre Real</p>
                  <motion.p key={saldoLivreReal} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight">R$ {saldoLivreReal.toFixed(2).replace('.', ',')}</motion.p>
                </div>

                {/* GRÁFICO DE DISTRIBUIÇÃO */}
                <div className="pt-5 mt-5 border-t border-slate-700/80">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Distribuição % (Base Renda)</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Salário Base</span>
                        <span className="font-bold">{(rendaTotalMensal > 0 ? (salarioBase / rendaTotalMensal) * 100 : 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((salarioBase / rendaTotalMensal) * 100, 100)}%` }} transition={{ duration: 1, delay: 0.1 }} className="bg-indigo-400 h-1.5 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Auxílio Alim.</span>
                        <span className="font-bold">{(rendaTotalMensal > 0 ? (auxilioAlimentacao / rendaTotalMensal) * 100 : 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((auxilioAlimentacao / rendaTotalMensal) * 100, 100)}%` }} transition={{ duration: 1, delay: 0.2 }} className="bg-emerald-400 h-1.5 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Gastos de Rota</span>
                        <span className="font-bold text-rose-400">{(rendaTotalMensal > 0 ? (custoMensal / rendaTotalMensal) * 100 : 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((custoMensal / rendaTotalMensal) * 100, 100)}%` }} transition={{ duration: 1, delay: 0.3 }} className="bg-rose-500 h-1.5 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análise da Hora/Aula */}
              <div className="mt-6 relative z-10">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Análise do Valor da Hora/Aula
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">No Papel</p>
                    <p className="text-lg font-bold text-slate-200">R$ {valorHoraBruto.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex-1 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/30 text-center">
                    <p className="text-[11px] text-indigo-300 font-bold mb-0.5">Líquido Real</p>
                    <p className="text-xl font-black text-indigo-400">R$ {valorHoraLiquido.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTROLE DE EXECUÇÃO DO MÊS */}
            <section className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-900/30 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
              
              <h2 className="text-xl font-bold mb-6 flex items-center text-white border-b border-slate-800 pb-4 relative z-10">
                <CalendarDays className="w-5 h-5 mr-3 text-emerald-400" />
                Controle do Mês
              </h2>

              <div className="space-y-8 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-200 text-sm uppercase tracking-wider">Segundas-feiras</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total do mês:</span>
                      <input type="number" min="0" max="5" value={qntSegundas} onChange={(e) => { setQntSegundas(Number(e.target.value)); setSegundasTrabalhadas([]); }} className="w-12 bg-slate-800 border border-slate-700 rounded-xl text-center py-1 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {Array.from({ length: qntSegundas }).map((_, i) => (
                      <button 
                        key={`seg-${i}`}
                        onClick={() => toggleDiaTrabalhado('segunda', i)}
                        className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-300 ${segundasTrabalhadas.includes(i) ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/40 border-transparent scale-105' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-400/50 hover:bg-slate-800/80 hover:text-blue-300'}`}
                      >
                        {segundasTrabalhadas.includes(i) ? <CheckCircle2 className="w-6 h-6 mb-1 drop-shadow-sm" /> : <span className="text-xl mb-0.5">{i + 1}</span>}
                        <span className="text-[9px] uppercase tracking-wider opacity-90">{segundasTrabalhadas.includes(i) ? 'Concluído' : 'Pendente'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-200 text-sm uppercase tracking-wider">Sextas-feiras</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total do mês:</span>
                      <input type="number" min="0" max="5" value={qntSextas} onChange={(e) => { setQntSextas(Number(e.target.value)); setSextasTrabalhadas([]); }} className="w-12 bg-slate-800 border border-slate-700 rounded-xl text-center py-1 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {Array.from({ length: qntSextas }).map((_, i) => (
                      <button 
                        key={`sex-${i}`}
                        onClick={() => toggleDiaTrabalhado('sexta', i)}
                        className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-300 ${sextasTrabalhadas.includes(i) ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 border-transparent scale-105' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-indigo-400/50 hover:bg-slate-800/80 hover:text-indigo-300'}`}
                      >
                        {sextasTrabalhadas.includes(i) ? <CheckCircle2 className="w-6 h-6 mb-1 drop-shadow-sm" /> : <span className="text-xl mb-0.5">{i + 1}</span>}
                        <span className="text-[9px] uppercase tracking-wider opacity-90">{sextasTrabalhadas.includes(i) ? 'Concluído' : 'Pendente'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 shadow-inner mt-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-1.5" /> 
                      Débito Realizado
                    </span>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">- R$ {totalGastoRealizado.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/80">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Projeção do Mês
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      {projetadoFinalMes > 0 ? `R$ ${projetadoFinalMes.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* PREVISÃO FINANCEIRA DE ROTA */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
              
              <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center relative z-10">
                <Coins className="w-4 h-4 mr-2 text-slate-400" />
                Custos de Deslocamento
              </h2>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Gasto Semanal (Seg+Sex)</span>
                  <span className="font-semibold text-slate-900">R$ {custoSemanal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Custo Base Mensal</span>
                  <span className="font-bold text-slate-900">R$ {custoMensal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500 flex items-center"><Coins className="w-3 h-3 mr-1.5 text-[#10b981]" /> Combustível Mensal</span>
                  <span className="font-bold text-[#10b981]">R$ {custoCombustivelMensal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-500 flex items-center"><Wallet className="w-3 h-3 mr-1.5 text-[#8b5cf6]" /> Pedágio Mensal</span>
                  <span className="font-bold text-[#8b5cf6]">R$ {custoPedagioMensal.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Preço Gasolina</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={precoCombustivel} 
                        onChange={(e) => setPrecoCombustivel(Number(e.target.value))} 
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Consumo (km/l)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={consumoVeiculo} 
                      onChange={(e) => setConsumoVeiculo(Number(e.target.value))} 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 text-center outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="mt-5 p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                  <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider mb-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 text-amber-500" />
                    Travar na Conta (Reserva)
                  </p>
                  <p className="text-3xl font-light tracking-tight text-slate-900 mb-2">R$ {reservaRecomendada.toFixed(2).replace('.', ',')}</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Inclui o custo base do mês + 15% de margem para variação de preços e desvios nas rotas.
                  </p>
                </div>
              </div>
            </section>

            {/* MANUTENÇÃO */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-5 flex items-center">
                <Wrench className="w-4 h-4 mr-2 text-slate-400" />
                Manutenção do Veículo
              </h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Uso Estimado Mensal</p>
                  <p className="text-xl font-semibold text-slate-900">~{kmMensal.toFixed(0)} <span className="text-sm font-normal text-slate-400">km</span></p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Troca de Óleo</p>
                  <p className="text-[11px] text-slate-500 mt-1">Estimada a cada <strong className="text-slate-700">{mesesParaTrocaOleo.toFixed(1)} meses</strong> na sua rotina de 10.000km.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
