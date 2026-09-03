import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getPraktikumsstellen } from '../services/db';
import { Search, MapPin, Clock, Building2, Briefcase, CheckCircle2 } from 'lucide-react';

const StudentView = () => {
  const { t } = useLanguage();
  const [stellen, setStellen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStellen = async () => {
      setLoading(true);
      try {
        const data = await getPraktikumsstellen();
        setStellen(data);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
      setLoading(false);
    };
    fetchStellen();
  }, []);

  // Extract unique locations and categories for the filters
  const uniqueLocations = [...new Set(stellen.map(s => s.location).filter(Boolean))].sort();
  const uniqueCategories = [...new Set(stellen.map(s => s.category).filter(Boolean))].sort();

  const filteredStellen = stellen.filter(stelle => {
    const matchesSearch = 
      (stelle.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stelle.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stelle.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stelle.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || stelle.category === filterCategory;
    const matchesLocation = filterLocation === '' || stelle.location === filterLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">{t('allCategories')}</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <select 
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">{t('allLocations')}</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Lade...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStellen.map(stelle => (
            <div key={stelle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex items-start gap-4 mb-3">
                  {stelle.website ? (
                    <img 
                      src={`https://logo.clearbit.com/${stelle.website.replace(/^https?:\/\//, '').split('/')[0]}`} 
                      alt={`${stelle.company} logo`}
                      className="w-12 h-12 rounded object-contain bg-white border border-gray-100 shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                      <Building2 size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{stelle.title || stelle.company}</h3>
                    <p className="text-sm font-medium text-green-700">{stelle.company}</p>
                  </div>
                </div>
                
                {stelle.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                    {stelle.category}
                  </span>
                )}

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {stelle.description}
                </p>

                {stelle.requirements && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">{t('requirements')}</h4>
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{stelle.requirements}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{stelle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{stelle.duration}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href={`mailto:${stelle.contact}`} className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center justify-center gap-2">
                  <Briefcase size={16} />
                  {t('contact')}
                </a>
              </div>
            </div>
          ))}
          {filteredStellen.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg">{t('noResults')}</p>
              <p className="text-sm mt-1">Versuche andere Filterkriterien oder eine andere Suche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentView;
