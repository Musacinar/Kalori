import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './bilesenler/Navbar';
import AnaSayfa from './sayfalar/AnaSayfa';
import YemekGirisiSayfasi from './sayfalar/YemekGirisiSayfasi';
import ProfilSayfasi from './sayfalar/ProfilSayfasi';
import IstatistiklerSayfasi from './sayfalar/IstatistiklerSayfasi';
import { YemekSaglayici } from './baglam/YemekBaglami';
import { KullaniciSaglayici } from './baglam/KullaniciBaglami';

function App() {
  return (
    <KullaniciSaglayici>
      <YemekSaglayici>
        <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 pb-10 pt-20">
            <Routes>
              <Route path="/" element={<AnaSayfa />} />
              <Route path="/yemek-girisi" element={<YemekGirisiSayfasi />} />
              <Route path="/profil" element={<ProfilSayfasi />} />
              <Route path="/istatistikler" element={<IstatistiklerSayfasi />} />
            </Routes>
          </main>
        </div>
      </YemekSaglayici>
    </KullaniciSaglayici>
  );
}

export default App;