import React, { useState, useEffect } from 'react';
import { Plus, Save, Search } from 'lucide-react';
import { useYemek } from '../baglam/YemekBaglami';
import { bugunTarih } from '../yardimcilar';
import { Yemek, YemekVeritabani } from '../tipler';

interface YemekEklemeFormuProps {
  varsayilanDegerler?: Partial<Yemek>;
  kapatModal?: () => void;
  duzenlemeModu?: boolean;
  yemekId?: string;
}

const YemekEklemeFormu: React.FC<YemekEklemeFormuProps> = ({
  varsayilanDegerler,
  kapatModal,
  duzenlemeModu = false,
  yemekId
}) => {
  const { yemekEkle, yemekGuncelle, hazirYemekler, yemekAra } = useYemek();
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenmisYemekler, setFiltrelenmisYemekler] = useState<YemekVeritabani[]>([]);
  
  const [yemekVerisi, setYemekVerisi] = useState<Partial<Yemek>>({
    ad: '',
    kalori: 0,
    porsiyon: 1,
    birim: 'porsiyon',
    tarih: bugunTarih(),
    ogun: 'Kahvaltı',
    ...varsayilanDegerler
  });
  
  const [hata, setHata] = useState('');
  
  useEffect(() => {
    if (aramaMetni.length >= 2) {
      const sonuclar = yemekAra(aramaMetni);
      setFiltrelenmisYemekler(sonuclar);
    } else {
      setFiltrelenmisYemekler([]);
    }
  }, [aramaMetni]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['kalori', 'porsiyon'].includes(name)) {
      setYemekVerisi({
        ...yemekVerisi,
        [name]: parseFloat(value) || 0
      });
    } else {
      setYemekVerisi({
        ...yemekVerisi,
        [name]: value
      });
    }
  };
  
  const handleYemekSec = (yemek: YemekVeritabani) => {
    setYemekVerisi({
      ...yemekVerisi,
      ad: yemek.ad,
      kalori: yemek.kalori,
      protein: yemek.protein,
      karbonhidrat: yemek.karbonhidrat,
      yag: yemek.yag,
      birim: yemek.birim
    });
    setAramaMetni('');
    setFiltrelenmisYemekler([]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yemekVerisi.ad) {
      setHata('Lütfen yemek adını girin.');
      return;
    }
    
    if (yemekVerisi.kalori === 0) {
      setHata('Lütfen kalori değerini girin.');
      return;
    }
    
    if (duzenlemeModu && yemekId) {
      yemekGuncelle(yemekId, yemekVerisi);
    } else {
      yemekEkle(yemekVerisi as Omit<Yemek, 'id'>);
    }
    
    if (kapatModal) {
      kapatModal();
    } else {
      setYemekVerisi({
        ad: '',
        kalori: 0,
        porsiyon: 1,
        birim: 'porsiyon',
        tarih: bugunTarih(),
        ogun: 'Kahvaltı'
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="yemekAra" className="block text-sm font-medium text-gray-700">Yemek Ara</label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="yemekAra"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              placeholder="Yemek adı yazın..."
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {filtrelenmisYemekler.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {filtrelenmisYemekler.map((yemek) => (
                <button
                  key={yemek.id}
                  type="button"
                  onClick={() => handleYemekSec(yemek)}
                  className="w-full text-left px-4 py-2 hover:bg-green-50 focus:outline-none"
                >
                  <div className="font-medium">{yemek.ad}</div>
                  <div className="text-sm text-gray-500">
                    {yemek.kalori} kcal
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="ad" className="block text-sm font-medium text-gray-700">Yemek Adı</label>
          <input
            type="text"
            id="ad"
            name="ad"
            value={yemekVerisi.ad}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            placeholder="Örn: Omlet, Tavuk Göğsü, vb."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="kalori" className="block text-sm font-medium text-gray-700">Kalori (kcal)</label>
            <input
              type="number"
              id="kalori"
              name="kalori"
              value={yemekVerisi.kalori}
              onChange={handleInputChange}
              min="0"
              step="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="porsiyon" className="block text-sm font-medium text-gray-700">Miktar</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                id="porsiyon"
                name="porsiyon"
                value={yemekVerisi.porsiyon}
                onChange={handleInputChange}
                min="0.1"
                step="0.1"
                className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 bg-white border p-2 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
              <select
                id="birim"
                name="birim"
                value={yemekVerisi.birim}
                onChange={handleInputChange}
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
              >
                <option value="porsiyon">porsiyon</option>
                <option value="gram">gram</option>
                <option value="adet">adet</option>
                <option value="su bardağı">su bardağı</option>
                <option value="çay bardağı">çay bardağı</option>
                <option value="yemek kaşığı">yemek kaşığı</option>
                <option value="tatlı kaşığı">tatlı kaşığı</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {hata && (
        <div className="text-red-500 text-sm">{hata}</div>
      )}

      <div className="flex justify-end">
        {kapatModal && (
          <button
            type="button"
            onClick={kapatModal}
            className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            İptal
          </button>
        )}
        
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          {duzenlemeModu ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Ekle
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default YemekEklemeFormu;