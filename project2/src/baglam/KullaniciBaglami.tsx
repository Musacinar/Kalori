import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kullanici, KullaniciBaglamiDegerleri } from '../tipler';
import { 
  kaydetKullanici, 
  getirKullanici, 
  varsayilanKullanici 
} from '../depolama';
import { 
  hesaplaVKI, 
  hesaplaGunlukKalori, 
  hesaplaKalanKalori 
} from '../yardimcilar';
import { useYemek } from './YemekBaglami';

const KullaniciBaglami = createContext<KullaniciBaglamiDegerleri | undefined>(undefined);

export const KullaniciSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kullanici, setKullanici] = useState<Kullanici>(varsayilanKullanici);
  
  useEffect(() => {
    const kayitliKullanici = getirKullanici();
    if (kayitliKullanici) {
      setKullanici(kayitliKullanici);
    }
  }, []);

  useEffect(() => {
    kaydetKullanici(kullanici);
  }, [kullanici]);

  const kullaniciGuncelle = (yeniKullanici: Partial<Kullanici>) => {
    setKullanici(oncekiKullanici => ({
      ...oncekiKullanici,
      ...yeniKullanici
    }));
  };

  const vucutKitleIndeksi = () => {
    return hesaplaVKI(kullanici.kilo, kullanici.boy);
  };

  const gunlukKaloriIhtiyaci = () => {
    return hesaplaGunlukKalori(kullanici);
  };

  // Bu fonksiyon için YemekBaglami hook'unu kullanamayız çünkü bir döngüsel bağımlılık oluşturur
  // Bu nedenle, bu fonksiyon kullanıldığında aşağıda yemek bağlamını kullanacağız
  const kalanKalori = () => {
    // Bu gerçek değeri bir komponent içinde hesaplayacağız
    return kullanici.hedefKalori;
  };

  const deger: KullaniciBaglamiDegerleri = {
    kullanici,
    kullaniciGuncelle,
    vucutKitleIndeksi,
    gunlukKaloriIhtiyaci,
    kalanKalori
  };

  return (
    <KullaniciBaglami.Provider value={deger}>
      {children}
    </KullaniciBaglami.Provider>
  );
};

export const useKullanici = () => {
  const baglam = useContext(KullaniciBaglami);
  if (baglam === undefined) {
    throw new Error('useKullanici kancası KullaniciSaglayici içinde kullanılmalıdır');
  }
  return baglam;
};