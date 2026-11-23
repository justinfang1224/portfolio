export const catalogCategories = [
  "sports",
  "tech",
  "photography",
  "album",
  "others"
] as const;

export type CatalogCategory = (typeof catalogCategories)[number];

export type CatalogItem = {
  brand: string;
  category: CatalogCategory;
  id: string;
  imageAlt: string;
  imageScale?: number;
  imageSrc: string;
  title: string;
};

export const catalogPage = {
  descriptionBefore: "Objects I keep returning to, the ones that earn their place over time. Inspired by ",
  descriptionLinkHref: "https://unvalley.me/",
  descriptionLinkLabel: "UNV",
  descriptionAfter: ".",
  title: "Objects"
} as const;

export const catalogCategoryLabels: Record<CatalogCategory, string> = {
  album: "Album",
  others: "Others",
  photography: "Photography",
  sports: "Run",
  tech: "Tech"
};

export const catalogItems: CatalogItem[] = [
  // Sports — footwear, then watch
  {
    brand: "ASICS",
    category: "sports",
    id: "metaspeed-edge",
    imageAlt: "ASICS Metaspeed Edge running shoes",
    imageSrc: "/catalog/metaspeed-edge.png",
    title: "Metaspeed Edge"
  },
  {
    brand: "Mizuno",
    category: "sports",
    id: "neo-vista-2",
    imageAlt: "Mizuno Neo Vista 2 running shoes",
    imageSrc: "/catalog/neo-vista-2.png",
    title: "Neo Vista 2"
  },
  {
    brand: "Nike",
    category: "sports",
    id: "vaporfly-3",
    imageAlt: "Nike Vaporfly 3 running shoes",
    imageSrc: "/catalog/vaporfly-3.png",
    title: "Vaporfly 3"
  },
  {
    brand: "Garmin",
    category: "sports",
    id: "forerunner-570",
    imageAlt: "Garmin Forerunner 570 watch",
    imageSrc: "/catalog/forerunner-570.png",
    title: "Forerunner 570"
  },

  // Tech — desk setup, then wearables & audio
  {
    brand: "Apple",
    category: "tech",
    id: "macbook-air-m5",
    imageAlt: "Apple MacBook Air M5",
    imageScale: 1.7,
    imageSrc: "/catalog/macbook-air-m5.png",
    title: "Macbook Air M5"
  },
  {
    brand: "Apple",
    category: "tech",
    id: "magic-keyboard",
    imageAlt: "Apple Magic Keyboard",
    imageSrc: "/catalog/magic-keyboard.png",
    title: "Magic keyboard"
  },
  {
    brand: "Logitech",
    category: "tech",
    id: "mx-master-3",
    imageAlt: "Logitech MX Master 3 mouse",
    imageSrc: "/catalog/mx-master-3.png",
    title: "MX Master 3"
  },
  {
    brand: "Apple",
    category: "tech",
    id: "watch-series-8",
    imageAlt: "Apple Watch Series 8",
    imageSrc: "/catalog/watch-series-8.png",
    title: "Watch series 8"
  },
  {
    brand: "Apple",
    category: "tech",
    id: "airpods-pro-2",
    imageAlt: "Apple AirPods Pro 2",
    imageSrc: "/catalog/airpods-pro-2.png",
    title: "Airpods Pro 2"
  },
  {
    brand: "Sony",
    category: "tech",
    id: "wh-1000xm5",
    imageAlt: "Sony WH-1000XM5 headphones",
    imageSrc: "/catalog/wh-1000xm5.png",
    title: "WH-1000 XM5"
  },
  {
    brand: "Harman Kardon",
    category: "tech",
    id: "aura-studio-3",
    imageAlt: "Harman Kardon Aura Studio 3 speaker",
    imageSrc: "/catalog/aura-studio-3.png",
    title: "Aura studio 3"
  },
  {
    brand: "Nakamichi",
    category: "tech",
    id: "soundspace-5",
    imageAlt: "Nakamichi Soundspace 5 stereo system",
    imageSrc: "/catalog/soundspace-5.png",
    title: "Soundspace 5"
  },

  // Photography — cameras, then film
  {
    brand: "Nikon",
    category: "photography",
    id: "nikon-fm",
    imageAlt: "Nikon FM film camera",
    imageSrc: "/catalog/nikon-fm.png",
    title: "FM"
  },
  {
    brand: "Polaroid",
    category: "photography",
    id: "sx-70",
    imageAlt: "Polaroid SX-70 camera",
    imageSrc: "/catalog/sx-70.png",
    title: "SX-70"
  },
  {
    brand: "Fuji",
    category: "photography",
    id: "instax-mini-90",
    imageAlt: "Fuji Instax Mini 90 camera",
    imageScale: 0.9,
    imageSrc: "/catalog/instax-mini-90.png",
    title: "Instax mini90"
  },
  {
    brand: "Fuji",
    category: "photography",
    id: "instax-mini-film",
    imageAlt: "Fuji Instax Mini instant film twin pack",
    imageScale: 0.85,
    imageSrc: "/catalog/instax-mini-film.png",
    title: "Instax mini film"
  },
  {
    brand: "Nikon",
    category: "photography",
    id: "coolpix-s600",
    imageAlt: "Nikon Coolpix S600 camera",
    imageSrc: "/catalog/coolpix-s600.png",
    title: "Coolpix S600"
  },
  {
    brand: "Kodak",
    category: "photography",
    id: "kodak-gold-200",
    imageAlt: "Kodak Gold 200 film",
    imageSrc: "/catalog/kodak-gold-200.png",
    title: "Gold 200"
  },

  // Album
  {
    brand: "Song dongye",
    category: "album",
    id: "album-an-he-qiao-bei",
    imageAlt: "Album cover for 安和橋北 by Song Dongye",
    imageScale: 0.85,
    imageSrc: "/catalog/album-an-he-qiao-bei.jpg",
    title: "安和橋北"
  },
  {
    brand: "Ryuichi sakamoto",
    category: "album",
    id: "album-12",
    imageAlt: "Album cover for 12 by Ryuichi Sakamoto",
    imageScale: 0.85,
    imageSrc: "/catalog/album-12.jpg",
    title: "12"
  },
  {
    brand: "Ryuichi sakamoto",
    category: "album",
    id: "album-playing-the-piano",
    imageAlt: "Album cover for Playing the piano 12122020 by Ryuichi Sakamoto",
    imageScale: 0.85,
    imageSrc: "/catalog/album-playing-the-piano.jpg",
    title: "Playing the piano 12122020"
  },
  {
    brand: "Yorushika",
    category: "album",
    id: "album-yorushika",
    imageAlt: "Album cover for だから僕は音楽を辞めた by Yorushika",
    imageScale: 0.85,
    imageSrc: "/catalog/album-yorushika.jpg",
    title: "だから僕は音楽を辞めた"
  },
  {
    brand: "No party for cao dong",
    category: "album",
    id: "album-the-servile",
    imageAlt: "Album cover for The Servile by No Party For Cao Dong",
    imageScale: 0.85,
    imageSrc: "/catalog/album-the-servile.jpg",
    title: "The Servile"
  },
  {
    brand: "Deca Joins",
    category: "album",
    id: "album-go-slow",
    imageAlt: "Album cover for Go slow by Deca Joins",
    imageScale: 0.85,
    imageSrc: "/catalog/album-go-slow.jpg",
    title: "Go slow"
  },
  {
    brand: "Chet baker",
    category: "album",
    id: "album-lets-get-lost",
    imageAlt: "Album cover for Let's get lost by Chet Baker",
    imageScale: 0.85,
    imageSrc: "/catalog/album-lets-get-lost.jpg",
    title: "Let's get lost"
  },

  // Others — carry, then desk/home, then scent
  {
    brand: "Birkenstock",
    category: "others",
    id: "boston",
    imageAlt: "Birkenstock Boston clogs",
    imageSrc: "/catalog/boston.png",
    title: "Boston"
  },
  {
    brand: "Indosole",
    category: "others",
    id: "black-flipflop",
    imageAlt: "Indosole black flipflop",
    imageSrc: "/catalog/black-flipflop.png",
    title: "Black flipflop"
  },
  {
    brand: "D&Department",
    category: "others",
    id: "2way-tote-bag",
    imageAlt: "D&Department 2way tote bag",
    imageSrc: "/catalog/2way-tote-bag.png",
    title: "2way tote bag"
  },
  {
    brand: "Patagonia",
    category: "others",
    id: "refugio-day-pack",
    imageAlt: "Patagonia Refugio Day Pack",
    imageSrc: "/catalog/refugio-day-pack.png",
    title: "Refugio Day Pack"
  },
  {
    brand: "Acne studio",
    category: "others",
    id: "card-holder",
    imageAlt: "Acne Studios card holder",
    imageSrc: "/catalog/card-holder.png",
    title: "Card holder"
  },
  {
    brand: "Classico",
    category: "others",
    id: "c50-1",
    imageAlt: "Classico C50-1 wallet",
    imageSrc: "/catalog/c50-1.png",
    title: "C50-1"
  },
  {
    brand: "Jins",
    category: "others",
    id: "ucf-22a",
    imageAlt: "Jins UCF-22A-170AB glasses",
    imageSrc: "/catalog/ucf-22a.png",
    title: "UCF-22A-170AB"
  },
  {
    brand: "Kura Toga",
    category: "others",
    id: "advance-pencil",
    imageAlt: "Kura Toga Advance mechanical pencil",
    imageSrc: "/catalog/advance-pencil.png",
    title: "Advance pencil"
  },
  {
    brand: "Hay",
    category: "others",
    id: "table-clock",
    imageAlt: "Hay table clock",
    imageSrc: "/catalog/table-clock.png",
    title: "Table Clock"
  },
  {
    brand: "AKARI",
    category: "others",
    id: "table-lamp-1a",
    imageAlt: "AKARI 1A table lamp",
    imageSrc: "/catalog/table-lamp-1a.png",
    title: "1A Table lamp"
  },
  {
    brand: "Aesop",
    category: "others",
    id: "tactic",
    imageAlt: "Aesop Tactic fragrance",
    imageSrc: "/catalog/tactic.png",
    title: "Tactic"
  },
  {
    brand: "Hetras",
    category: "others",
    id: "hotel-wood-body-mist",
    imageAlt: "Hetras Hotel wood body mist",
    imageSrc: "/catalog/hotel-wood-body-mist.png",
    title: "Hotel wood body mist"
  },
  {
    brand: "Muji",
    category: "others",
    id: "incense-plate",
    imageAlt: "Muji incense plate",
    imageSrc: "/catalog/incense-plate.png",
    title: "Incense plate"
  },
  {
    brand: "Hibi",
    category: "others",
    id: "j001-hinoki",
    imageAlt: "Hibi J001 Hinoki incense",
    imageSrc: "/catalog/j001-hinoki.png",
    title: "J001 Hinoki"
  }
];
