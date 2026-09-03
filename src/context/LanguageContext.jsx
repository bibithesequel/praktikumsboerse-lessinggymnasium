import React, { createContext, useState, useContext } from 'react';

const translations = {
  de: {
    title: 'Praktikumsbörse',
    subtitle: 'Lessinggymnasium Braunschweig',
    searchPlaceholder: 'Suchen...',
    adminLogin: 'Admin Login',
    company: 'Unternehmen',
    location: 'Ort',
    duration: 'Dauer',
    description: 'Beschreibung',
    contact: 'Kontakt',
    noResults: 'Keine Praktikumsstellen gefunden.',
    add: 'Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    logout: 'Abmelden',
    adminDashboard: 'Admin Dashboard',
    email: 'E-Mail',
    password: 'Passwort',
    login: 'Anmelden',
    website: 'Webseite',
    jobTitle: 'Titel (Rolle)',
    category: 'Branche',
    requirements: 'Voraussetzungen',
    allCategories: 'Alle Branchen',
    allLocations: 'Alle Orte',
    seedData: 'Testdaten generieren'
  },
  en: {
    title: 'Internship Exchange',
    subtitle: 'Lessinggymnasium Braunschweig',
    searchPlaceholder: 'Search...',
    adminLogin: 'Admin Login',
    company: 'Company',
    location: 'Location',
    duration: 'Duration',
    description: 'Description',
    contact: 'Contact',
    noResults: 'No internships found.',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    adminDashboard: 'Admin Dashboard',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    website: 'Website',
    jobTitle: 'Title (Role)',
    category: 'Industry',
    requirements: 'Requirements',
    allCategories: 'All Industries',
    allLocations: 'All Locations',
    seedData: 'Generate Test Data'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('de');

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
