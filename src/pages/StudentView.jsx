import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getPraktikumsstellen } from '../services/db';
import { Search, MapPin, Clock, Building2 } from 'lucide-react';

const StudentView = () => {
  const { t } = useLanguage();
  const [stellen, setStellen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStellen = async () => {
      setLoading(true);
      // Fallback mock data if Firebase is not yet configured
      try {
        const data = await getPraktikumsstellen();
        if (data.length === 0) throw new Error("No data or not configured");
        setStellen(data);
      } catch (e) {
        setStellen([
          {
            id: '1',
            company: 'Volkswagen Financial Services',
            location: 'Braunschweig',
            duration: '2-3 Wochen',
            description: 'Einblicke in die IT-Abteilung und Softwareentwicklung.',
            contact: 'karriere@vwfs.com',
            website: 'https://vwfs.com'
          },
          {
            id: '2',
            company: 'New Yorker',
            location: 'Braunschweig',
            duration: '2 Wochen',
            description: 'Praktikum im Bereich E-Commerce und Marketing.',
            contact: 'jobs@newyorker.de',
            website: 'https://newyorker.de'
          }
        ]);
      }
      setLoading(false);
    };
    fetchStellen();
  }, []);

  const filteredStellen = stellen.filter(stelle => 
    stelle.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stelle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stelle.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Lade...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStellen.map(stelle => (
            <div key={stelle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  {stelle.website ? (
                    <img 
                      src={`https://logo.clearbit.com/${stelle.website.replace(/^https?:\/\//, '').split('/')[0]}`} 
                      alt={`${stelle.company} logo`}
                      className="w-12 h-12 rounded object-contain bg-gray-50"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                      <Building2 size={24} />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{stelle.company}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                  {stelle.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" />
                    <span>{stelle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-600" />
                    <span>{stelle.duration}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href={`mailto:${stelle.contact}`} className="text-green-700 hover:text-green-800 text-sm font-medium">
                  {t('contact')}
                </a>
              </div>
            </div>
          ))}
          {filteredStellen.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              {t('noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentView;
