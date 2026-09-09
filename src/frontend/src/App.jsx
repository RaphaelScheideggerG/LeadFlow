import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CompanyResults from './pages/CompanyResults';
import LeadResults from './pages/LeadResults';
import SearchResults from './pages/SearchResults'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/resultados/buscas' element={<SearchResults/>} />
      <Route path="/resultados/empresas" element={<CompanyResults />} />
      <Route path='/resultados/leads' element={<LeadResults/>} />
    </Routes>
  );
}