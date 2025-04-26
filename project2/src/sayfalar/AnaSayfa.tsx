import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, Coffee, Utensils } from 'lucide-react';
import { useYemek } from '../baglam/YemekBaglami';
import { useKullanici } from '../baglam/KullaniciBaglami';
import KaloriOzeti from '../bilesenler/KaloriOzeti';
import YemekListesi from '../bilesenler/YemekListesi';
import Modal from '../bilesenler/Modal';
import YemekEklemeFormu from '../bilesenler/YemekEklemeFormu';
import SikKullanilanlarListesi from '../bilesenler/SikKullanilanlarListesi';
import { ogunSiralama } from '../yardimcilar';

const AnaSayfa: React.FC = () => {
  const [yemekEkleModalAcik, setYemekEkleModalAcik] = useState(false);
  const { ogunlereGoreYemekler, bugunYemekler } = useYemek();
  const { kullanici } = useKullanici();
  
  const ogunYemekleri = ogunlereGoreYemekler();
  const bugunTumYemekler = bugunYemekler();
  
  const ogunlerSirali = Object.entries(ogunYemekleri)
    .sort(([a], [b]) => (ogunSiralama[a] || 0) - (ogunSiralama[b] || 0))
    .filter(([_, yemekler]) => yemekler.length > 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Merhaba, {kullanici.ad || 'Misafir'}!
        </h1>
        
        <button
          onClick={() => setYemekEkleModalAcik(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Yemek Ekle
        </button>
      </div>
      
      <KaloriOzeti />
      
      <SikKullanilanlarListesi />
      
      {ogunlerSirali.length > 0 ? (
        ogunlerSirali.map(([ogun, yemekler]) => (
          <YemekListesi
            key={ogun}
            baslik={ogun}
            yemekler={yemekler}
            ogun={ogun}
          />
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <Coffee className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Bugün Henüz Yemek Eklenmemiş
            </h2>
            <p className="text-gray-600 mb-6">
              Bugün tükettiğiniz yemekleri ekleyerek kalori takibinizi yapabilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setYemekEkleModalAcik(true)}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Yemek Ekle
            </button>
            
            <Link
              to="/istatistikler"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <Clock className="h-5 w-5 mr-2" />
              Geçmiş Kayıtlarım
            </Link>
          </div>
        </div>
      )}
      
      {bugunTumYemekler.length > 0 && (
        <div className="text-center mt-4">
          <Link
            to="/yemek-girisi"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 focus:outline-none focus:underline transition-colors duration-200"
          >
            <Utensils className="h-4 w-4 mr-1" />
            Tüm yemekleri görüntüle
          </Link>
        </div>
      )}
      
      <Modal 
        acik={yemekEkleModalAcik} 
        kapat={() => setYemekEkleModalAcik(false)} 
        baslik="Yemek Ekle"
      >
        <YemekEklemeFormu kapatModal={() => setYemekEkleModalAcik(false)} />
      </Modal>
    </div>
  );
};

export default AnaSayfa;