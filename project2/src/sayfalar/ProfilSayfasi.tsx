import React from 'react';
import { User, Activity, Scale, LineChart } from 'lucide-react';
import { useKullanici } from '../baglam/KullaniciBaglami';
import ProfilFormu from '../bilesenler/ProfilFormu';

const ProfilSayfasi: React.FC = () => {
  const { kullanici, vucutKitleIndeksi, gunlukKaloriIhtiyaci } = useKullanici();
  const vki = vucutKitleIndeksi();
  
  const vkiDurum = () => {
    if (vki < 18.5) return { durum: 'Zayıf', renk: 'text-blue-600' };
    if (vki < 25) return { durum: 'Normal', renk: 'text-green-600' };
    if (vki < 30) return { durum: 'Fazla Kilolu', renk: 'text-yellow-600' };
    return { durum: 'Obez', renk: 'text-red-600' };
  };
  
  const { durum, renk } = vkiDurum();
  
  const vkiYuzdesi = Math.min(Math.max((vki - 15) / 20 * 100, 0), 100); // 15-35 VKİ aralığı için
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center justify-center">
          <div className="rounded-full bg-green-100 p-3 mb-3">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Kişisel Bilgiler</h2>
          <div className="text-center">
            <p className="text-gray-600">{kullanici.ad || 'İsim belirtilmemiş'}</p>
            <p className="text-gray-600">{kullanici.yas} yaş, {kullanici.cinsiyet}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center justify-center">
          <div className="rounded-full bg-blue-100 p-3 mb-3">
            <Scale className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Vücut Kitle İndeksi</h2>
          <div className="text-center">
            <p className="text-lg font-bold">{vki.toFixed(1)}</p>
            <p className={`${renk} font-medium`}>{durum}</p>
            
            {/* VKİ göstergesi */}
            <div className="w-full mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{
                    width: `${vkiYuzdesi}%`,
                    background: 'linear-gradient(to right, #3b82f6, #22c55e, #eab308, #ef4444)',
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Zayıf</span>
                <span>Normal</span>
                <span>Kilolu</span>
                <span>Obez</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center justify-center">
          <div className="rounded-full bg-green-100 p-3 mb-3">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Kalori İhtiyacı</h2>
          <div className="text-center">
            <p className="text-lg font-bold">{gunlukKaloriIhtiyaci()} kcal</p>
            <p className="text-gray-600">Günlük tahmini ihtiyaç</p>
          </div>
        </div>
      </div>
      
      <ProfilFormu />
    </div>
  );
};

export default ProfilSayfasi;