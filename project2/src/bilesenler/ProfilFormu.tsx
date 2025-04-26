import React, { useState } from 'react';
import { useKullanici } from '../baglam/KullaniciBaglami';
import { Kullanici } from '../tipler';
import { aktiviteDuzeyiAciklamalari } from '../yardimcilar';

const ProfilFormu: React.FC = () => {
  const { kullanici, kullaniciGuncelle } = useKullanici();
  
  const [profilVerisi, setProfilVerisi] = useState<Kullanici>({
    ...kullanici
  });
  
  const [hata, setHata] = useState('');
  const [basarili, setBasarili] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['yas', 'kilo', 'boy'].includes(name)) {
      setProfilVerisi({
        ...profilVerisi,
        [name]: parseFloat(value) || 0
      });
    } else {
      setProfilVerisi({
        ...profilVerisi,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profilVerisi.ad) {
      setHata('Lütfen adınızı girin.');
      setBasarili(false);
      return;
    }
    
    if (profilVerisi.yas <= 0) {
      setHata('Lütfen geçerli bir yaş girin.');
      setBasarili(false);
      return;
    }
    
    if (profilVerisi.kilo <= 0) {
      setHata('Lütfen geçerli bir kilo girin.');
      setBasarili(false);
      return;
    }
    
    if (profilVerisi.boy <= 0) {
      setHata('Lütfen geçerli bir boy girin.');
      setBasarili(false);
      return;
    }
    
    kullaniciGuncelle(profilVerisi);
    setHata('');
    setBasarili(true);
    
    setTimeout(() => {
      setBasarili(false);
    }, 3000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ad" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
          <input
            type="text"
            id="ad"
            name="ad"
            value={profilVerisi.ad}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            placeholder="Ad Soyad"
          />
        </div>
        
        <div>
          <label htmlFor="yas" className="block text-sm font-medium text-gray-700">Yaş</label>
          <input
            type="number"
            id="yas"
            name="yas"
            value={profilVerisi.yas}
            onChange={handleInputChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label htmlFor="cinsiyet" className="block text-sm font-medium text-gray-700">Cinsiyet</label>
          <select
            id="cinsiyet"
            name="cinsiyet"
            value={profilVerisi.cinsiyet}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          >
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="kilo" className="block text-sm font-medium text-gray-700">Kilo (kg)</label>
          <input
            type="number"
            id="kilo"
            name="kilo"
            value={profilVerisi.kilo}
            onChange={handleInputChange}
            min="1"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </div>
        
        <div>
          <label htmlFor="boy" className="block text-sm font-medium text-gray-700">Boy (cm)</label>
          <input
            type="number"
            id="boy"
            name="boy"
            value={profilVerisi.boy}
            onChange={handleInputChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Aktivite ve Hedef</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="aktiviteDuzeyi" className="block text-sm font-medium text-gray-700">Aktivite Düzeyi</label>
          <select
            id="aktiviteDuzeyi"
            name="aktiviteDuzeyi"
            value={profilVerisi.aktiviteDuzeyi}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          >
            {Object.entries(aktiviteDuzeyiAciklamalari).map(([duzey, aciklama]) => (
              <option key={duzey} value={duzey}>{duzey} - {aciklama}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="hedef" className="block text-sm font-medium text-gray-700">Hedefiniz</label>
          <select
            id="hedef"
            name="hedef"
            value={profilVerisi.hedef}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          >
            <option value="Kilo Vermek">Kilo Vermek</option>
            <option value="Kilo Almak">Kilo Almak</option>
            <option value="Kiloyu Korumak">Kiloyu Korumak</option>
          </select>
        </div>
      </div>
      
      {hata && (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-100 rounded">
          {hata}
        </div>
      )}
      
      {basarili && (
        <div className="text-green-500 text-sm p-2 bg-green-50 border border-green-100 rounded animate-fadeIn">
          Profiliniz başarıyla güncellendi!
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default ProfilFormu;