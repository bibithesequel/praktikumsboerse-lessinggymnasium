import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getPraktikumsstellen, addPraktikumsstelle, updatePraktikumsstelle, deletePraktikumsstelle, seedTestData } from '../services/db';
import { Plus, Edit2, Trash2, LogOut, Database } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stellen, setStellen] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    company: '',
    location: '',
    duration: '',
    description: '',
    requirements: '',
    contact: '',
    website: ''
  });

  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPraktikumsstellen();
      setStellen(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    if (auth.app) {
      await signOut(auth);
    }
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updatePraktikumsstelle(editingId, formData);
    } else {
      await addPraktikumsstelle(formData);
    }
    
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', company: '', location: '', duration: '', description: '', requirements: '', contact: '', website: '' });
    setEditingId(null);
  }

  const handleEdit = (stelle) => {
    setFormData(stelle);
    setEditingId(stelle.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      await deletePraktikumsstelle(id);
      loadData();
    }
  };

  const fetchCompanySuggestions = async (query) => {
    setFormData({ ...formData, company: query });
    if (query.length < 2) {
      setCompanySuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
      const data = await res.json();
      setCompanySuggestions(data);
      setShowSuggestions(true);
    } catch (e) {
      console.error(e);
    }
  };

  const selectCompany = (company) => {
    setFormData({
      ...formData,
      company: company.name,
      website: `https://${company.domain}`
    });
    setShowSuggestions(false);
  };

  const handleSeedData = async () => {
    if (window.confirm('Möchten Sie Testdaten generieren? Dies fügt neue Einträge hinzu.')) {
      await seedTestData();
      loadData();
      alert('Testdaten wurden erfolgreich hinzugefügt!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{t('adminDashboard')}</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleSeedData}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Database size={20} />
            <span>{t('seedData')}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{editingId ? t('edit') : t('add')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobTitle')}</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" 
                value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">-- Bitte wählen --</option>
                <option value="IT">IT & Informatik</option>
                <option value="Wirtschaft">Wirtschaft & Verwaltung</option>
                <option value="Handwerk">Handwerk & Technik</option>
                <option value="Soziales">Soziales & Pädagogik</option>
                <option value="Medizin">Medizin & Pflege</option>
                <option value="Naturwissenschaften">Naturwissenschaften</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company')}</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.company} 
                onChange={(e) => fetchCompanySuggestions(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {if(companySuggestions.length > 0) setShowSuggestions(true)}}
                placeholder="Firma suchen..."
              />
              {showSuggestions && companySuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {companySuggestions.map((c, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      onClick={() => selectCompany(c)}
                    >
                      {c.logo ? <img src={c.logo} alt="" className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-gray-200 rounded"></div>}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.domain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('website')}</label>
              <input type="url" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('duration')}</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact')}</label>
              <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <textarea required rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('requirements')}</label>
            <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400" 
              placeholder="Welche Fähigkeiten oder Interessen sollte der Schüler mitbringen?"
              value={formData.requirements || ''} onChange={(e) => setFormData({...formData, requirements: e.target.value})}></textarea>
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button type="button" onClick={resetForm} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                {t('cancel')}
              </button>
            )}
            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center gap-2">
              <Plus size={20} />
              <span>{t('save')}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('company')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('jobTitle')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('location')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stellen.map(stelle => (
              <tr key={stelle.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stelle.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stelle.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stelle.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(stelle)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(stelle.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
