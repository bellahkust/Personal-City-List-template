// Personalize this file when you copy the template. Keep place rows in the city CSV files.
export const siteConfig = Object.freeze({
  site: {
    title: "Bella's List",
    home: {
      kicker: 'A personal Map of my favorite places',
      lines: ['Record My Favorite Cities', 'Leave Some Wonderful Memories', 'Life is Short'],
      signoff: 'Love Yourself More and Just Enjoy.',
      photo: 'assets/home-personal.jpg',
      photoAlt: 'Bella at a castle in Japan',
    },
    about: {
      name: 'Bella Tan',
      introduction: 'Public Policy Student At HKUST',
      slogan: ['Life is about Experience.', 'Just Enjoy it ☺'],
      educationHeading: 'Study Path',
      photo: 'assets/about-personal.jpg',
      photoAlt: 'Bella beside a decorated Christmas tree',
    },
    education: [
      {
        period: '2021 — 2025', institution: 'South China Agricultural University', location: 'Guangzhou',
        program: 'Bachelor of Management in Public Management', photo: 'assets/education-hkust.jpg',
        photoAlt: 'Bella in traditional dress during her studies at South China Agricultural University',
      },
      {
        period: '2025 — 2027', institution: 'The Hong Kong University of Science and Technology', location: 'Hong Kong',
        program: 'Master of Management in Public Policy', photo: 'assets/education-scu.jpg',
        photoAlt: 'Bella at a castle during her studies at The Hong Kong University of Science and Technology',
      },
    ],
  },
  categories: [
    { key: 'food', label: 'Eat Well', sheetValue: '食餐好嘢', icon: 'assets/icons/eat-well.jpeg' },
    { key: 'drinks', label: 'Drink Well', sheetValue: '飲杯先講', icon: 'assets/icons/drink-well.jpeg' },
    { key: 'alone', label: 'Stay Alone', sheetValue: '發下吽豆', icon: 'assets/icons/stay-alone.jpeg' },
  ],
  cities: {
    'hong-kong': {
      key: 'hong-kong', name: 'Hong Kong', page: 'hong-kong.html', illustration: 'assets/hong-kong-gemini.svg',
      sheetCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlscf1IcOBuBtz9qI-64MYSvXY_3SIP5XhwcPDd0yEyVKPQ4cEm_rxMteLtE5RF_1SmFTpkzBE-L5B/pub?output=csv',
      fallbackCsv: 'data/places.csv', titleOverrides: {
        十二味: 'Twelve Flavors (Tsim Sha Tsui)', 妹記大牌檔: 'Mui Kee Cookfood Stall', 愛民生: 'Oi Man Sang',
        小菜王: 'Siu Choi Wong', 牧羊少年咖啡館: 'The Alchemist Cafe (Mong Kok)', 殿大喜屋: 'Tono Daikiya (Mongkok)',
        灣仔海濱長廊: 'Wan Chai Promenade', 深水埗公園: 'Sham Shui Po Park', 長沙灣海濱長廊: 'Cheung Sha Wan Promenade',
        西九藝術公園: 'West Kowloon Art Park', 堅尼地城海濱長廊: 'Praya, Kennedy Town Waterfront Park', 觀塘海濱花園: 'Kwun Tong Promenade',
      }, areaOverrides: {
        '九龍 · 尖沙咀': 'Kowloon · Tsim Sha Tsui', '九龍 · 深水埗': 'Kowloon · Sham Shui Po',
        '九龍 · 旺角': 'Kowloon · Mong Kok', '九龍 · 長沙灣': 'Kowloon · Cheung Sha Wan',
        '九龍 · 西九文化區': 'Kowloon · West Kowloon Cultural District', '九龍 · 觀塘': 'Kowloon · Kwun Tong',
        '香港島 · 中環': 'Hong Kong Island · Central', '香港島 · 灣仔': 'Hong Kong Island · Wan Chai',
        '香港島 · 堅尼地城': 'Hong Kong Island · Kennedy Town',
      },
    },
    shenzhen: {
      key: 'shenzhen', name: 'Shenzhen', page: 'shenzhen.html', illustration: 'assets/shenzhen-gemini.svg',
      sheetCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlscf1IcOBuBtz9qI-64MYSvXY_3SIP5XhwcPDd0yEyVKPQ4cEm_rxMteLtE5RF_1SmFTpkzBE-L5B/pub?gid=384963703&single=true&output=csv',
      fallbackCsv: 'data/shenzhen.csv',
    },
    guangzhou: {
      key: 'guangzhou', name: 'Guangzhou', page: 'guangzhou.html', illustration: 'assets/guangzhou-gemini.svg',
      sheetCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlscf1IcOBuBtz9qI-64MYSvXY_3SIP5XhwcPDd0yEyVKPQ4cEm_rxMteLtE5RF_1SmFTpkzBE-L5B/pub?gid=953328560&single=true&output=csv',
      fallbackCsv: 'data/guangzhou.csv',
    },
  },
});
