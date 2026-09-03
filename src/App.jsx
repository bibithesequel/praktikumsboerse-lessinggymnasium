import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import StudentView from './pages/StudentView';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Globe } from 'lucide-react';

const Header = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center justify-center shrink-0">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Lessinggymnasium Braunschweig Logo" 
              className="w-12 h-12 rounded object-contain" 
              title="credits; Ayse Bilge Keles" 
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-green-700">{t('title')}</h1>
            <p className="text-sm text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors"
          >
            <Globe size={20} />
            <span className="uppercase font-semibold">{lang}</span>
          </button>
          <Link to="/admin" className="text-sm text-green-700 hover:underline">
            {t('adminLogin')}
          </Link>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<StudentView />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
