
import { BarChart, Upload, FileText, Bot, Settings, Bell } from 'lucide-react';
import React from 'react';

// Sub-komponentlar (UI elementlari)

const StatCard = ({ title, value, detail, icon, color }) => (
  <div className={`bg-gray-800/50 backdrop-blur-md border border-gray-700/60 p-5 rounded-2xl shadow-lg hover:border-${color}-400/70 transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div className={`text-2xl p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <span className="text-3xl font-bold text-white">{value}</span>
      <p className="text-gray-400 text-sm font-medium mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-2">{detail}</p>
    </div>
  </div>
);

const AgentStatusCard = ({ name, description, status, icon }) => (
    <div className="flex items-start p-4 bg-gray-800/60 rounded-lg border border-gray-700/40 mb-3 hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
        <div className="text-xl p-3 rounded-lg bg-gray-700/80 text-cyan-300 mr-4">{icon}</div>
        <div>
            <div className="flex items-center mb-1">
                 <p className="font-semibold text-white mr-2">{name}</p>
                 <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            </div>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    </div>
)

const DocumentDropzone = () => (
    <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center bg-gray-800/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer">
        <Upload className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-white">Hujjatlarni bu yerga tashlang</h3>
        <p className="text-gray-400 mt-2">yoki fayl tanlash uchun bosing (PDF, DOCX, JPG, PNG)</p>
    </div>
);


// Asosiy Dashboard Komponenti

const FunctionalDashboardPage = () => {

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 lg:p-8 font-sans">
      {/* Nano-texnologik fon (effekt uchun) */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse bottom-0 -right-20"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">SmartAccounting AI</h1>
                <p className="text-gray-400 mt-1">Kichik biznes uchun aqlli buxgalteriya</p>
            </div>
            <div className="flex items-center space-x-4">
                <button className="bg-gray-800/50 p-3 rounded-full hover:bg-gray-700/70 transition-colors border border-transparent hover:border-cyan-400/50">
                    <Bell className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-lg border-2 border-purple-400/50">
                    B
                </div>
            </div>
        </header>

        <main className="grid grid-cols-12 gap-6">

            {/* Asosiy Funksional Bloklar */}
            <div className="col-span-12 lg:col-span-8">
                <section id="main-stats">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <StatCard 
                            title="Kutilayotgan Soliqlar" 
                            value="2.1 mln UZS" 
                            detail="YIV va QQS 15-aprelgacha"
                            icon={<FileText />} 
                            color="yellow" 
                        />
                        <StatCard 
                            title="Qayta Ishlanmagan Hujjatlar" 
                            value="12 ta" 
                            detail="Hisob-fakturalar, cheklar"
                            icon={<Upload />} 
                            color="cyan" 
                        />
                        <StatCard 
                            title="Aniqlangan Xatoliklar" 
                            value="2 ta" 
                            detail="Debitorlik qarzi nomuvofiq"
                            icon={<Bot />} 
                            color="red" 
                        />
                    </div>
                </section>
                
                <section id="document-analysis" className="mt-6">
                     <h2 className="text-lg font-semibold mb-4 text-gray-300 tracking-wide">Avtomatlashtirilgan Hujjat Tahlili</h2>
                     <DocumentDropzone />
                </section>
            </div>

            {/* AI Agentlar Paneli */}
            <div className="col-span-12 lg:col-span-4">
                 <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-5 rounded-2xl shadow-lg h-full">
                    <h2 className="text-lg font-semibold mb-4 text-gray-300 tracking-wide">AI Tizimining Holati</h2>
                    <div>
                        <AgentStatusCard 
                            name="Hujjat Tahlilchisi"
                            description="Hujjatlarni o'qiydi va ma'lumotlarni tizimga kiritadi."
                            status="active"
                            icon={<FileText size={20}/>}
                        />
                         <AgentStatusCard 
                            name="Moliyaviy Bashoratchi"
                            description="Pul oqimlari va xarajatlarni prognoz qiladi."
                            status="active"
                            icon={<BarChart size={20}/>}
                        />
                         <AgentStatusCard 
                            name="Auditor Nazorati"
                            description="Operatsiyalarni tekshirib, xatoliklarni topadi."
                            status="active"
                            icon={<Bot size={20}/>}
                        />
                         <AgentStatusCard 
                            name="Soliq Maslahatchisi"
                            description="my.soliq.uz uchun hisobotlarni optimallashtiradi."
                            status="standby"
                            icon={<Settings size={20}/>}
                        />
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-cyan-900/40 text-center hover:bg-cyan-800/60 transition-colors">
                        <p className="text-cyan-200 text-sm">AI-Assistent bilan suhbatlashing</p>
                        <input 
                            type="text"
                            placeholder='Masalan: "O'tgan oydagi eng katta xarajat qani?"'
                            className="mt-2 w-full bg-gray-800/70 border border-gray-600 rounded-md py-2 px-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        />
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default FunctionalDashboardPage;
