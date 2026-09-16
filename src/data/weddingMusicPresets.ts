export interface WeddingMusicTrack {
  id: string;
  name: string;
  category: 'milli' | 'vals' | 'romantic' | 'acoustic' | 'custom';
  description: string;
  url: string;
  defaultTitle: string;
}

export const WEDDING_MUSIC_PRESETS: WeddingMusicTrack[] = [
  {
    id: 'vagzali-traditional',
    name: 'Toy Valsı (Pachelbel - Canon in D)',
    category: 'vals',
    description: 'Bütün dünyada bəy və gəlinin ən sevimli klassik orkestr toy valsı',
    url: '/wedding-music.mp3',
    defaultTitle: 'Pachelbel - Toy Valsı (Orkestr)',
  },
  {
    id: 'mendelssohn-waltz',
    name: 'Mendelssohn & Pachelbel - Toy Valsı (Klassik)',
    category: 'vals',
    description: 'Zərif və təntənəli klassik orkestr valsı',
    url: '/wedding-music.mp3',
    defaultTitle: 'Klassik Toy Valsı',
  },
  {
    id: 'romantic-piano-strings',
    name: 'Romantik Melodiya & Skripka',
    category: 'romantic',
    description: 'Sakit, emosional və romantik toy fon musiqisi',
    url: '/wedding-music.mp3',
    defaultTitle: 'Romantik Sevgi Melodiyası',
  },
  {
    id: 'piano-reflections',
    name: 'Zərif Royal Melodiyası',
    category: 'romantic',
    description: 'Xəyalpərvər və sakitləşdirici toy fon musiqisi',
    url: '/wedding-music.mp3',
    defaultTitle: 'Zərif Royal Melodiyası',
  },
  {
    id: 'delicate-acoustic',
    name: 'Akustik Sevgi Melodiyası',
    category: 'acoustic',
    description: 'Müasir gənclər və minimalist toylar üçün zərif musiqi',
    url: '/wedding-music.mp3',
    defaultTitle: 'Akustik Sevgi Melodiyası',
  },
];
