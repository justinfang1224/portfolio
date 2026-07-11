export const aboutCollageImages = [
  {
    alt: "Justin sitting for a black and white portrait.",
    back: {
      body:
        "Outside my day job as a product designer, I’m really into film photography. I even worked as a photography assistant in Taiwan during COVID.",
      title: "Photography"
    },
    className: "portrait",
    src: "/about/collage-portrait.png"
  },
  {
    alt: "Justin running outdoors with another runner.",
    back: {
      body:
        "Running is part of my routine. So far, I’ve completed one full marathon and three half marathons, with more challenges ahead.",
      title: "Runner"
    },
    className: "running",
    src: "/about/collage-running.png"
  },
  {
    alt: "A cat sitting on a sofa.",
    back: {
      body:
        "I’ve had my British Shorthair, Momo, since 2024. He spends most of the day lounging around, and his favorite foods are chicken and blueberries.",
      title: "Cat Owner"
    },
    className: "cat",
    src: "/about/collage-cat.png"
  },
  {
    alt: "High-rise buildings in Hong Kong.",
    back: {
      body:
        "Hong Kong is where I studied design at 18 and started my career. I love the city’s energy.",
      title: "Hong Kong"
    },
    className: "city",
    src: "/about/collage-city.png"
  },
  {
    alt: "Justin sitting by a cafe window.",
    back: {
      body:
        "I love reading, especially sociology, design culture, and literature. This photo was taken at one of my favorite bookstores, Mount Zero Books.",
      title: "Reading"
    },
    className: "cafe",
    src: "/about/collage-cafe.png"
  }
] as const;

export const aboutIntro = {
  index: "01",
  title: "More about me",
  company: {
    href: "https://crypto.com",
    label: "Crypto.com"
  },
  city: {
    href: "https://www.google.com/maps/search/?api=1&query=Taipei%2C%20Taiwan",
    label: "Taipei"
  },
  discipline: {
    href: "https://www.polyu.edu.hk/sd/study/ug-programmes/ba-hons-scheme-in-design/communication-design/",
    label: "Communication Design"
  },
  school: {
    href: "https://www.polyu.edu.hk/sd/",
    label: "PolyU"
  },
  paragraphs: [
    "During my time in college, a product design internship introduces me to the fast-evolving tech industry. And I became fascinated by the beauty of designing things that bridge human behavior and computers, which is when I decided to dedicate myself to this path. Over the past 3+ years, I’ve been in the Fintech and Web3 space, aimed at shaping the future of personal finance.",
    "Beyond tech & design, I lean into a broad appreciation spending my time with books, movies, nature (see my favorites here), and everything between culture & humanities."
  ],
  socialLabel: "Find me",
  socialLinks: [
    {
      href: "https://www.linkedin.com/in/justinfang-1224",
      label: "Linkedin"
    },
    {
      href: "/Resume_2026.pdf",
      label: "Resume"
    },
    {
      href: "https://www.instagram.com/justinfang1224",
      label: "Instagram"
    },
    {
      href: "mailto:jenhung.work@gmail.com",
      label: "Email"
    }
  ]
} as const;

export const aboutExperience = {
  index: "02",
  title: "Career",
  entries: [
    {
      company: "Crypto.com",
      companyHref: "https://crypto.com",
      date: "2024.10 - Today",
      details: [
        "Owned the design for payment features (Credit card, Debit card), built the 0 to 1 launch of a flagship cryptocurrency credit card, driving $30.5M in spend, and a 2x increase in app downloads within the first week.",
        "Currently leading the end-to-end design for LLM-powered conversational search feature in the crypto.com app that serves 1M+ users."
      ],
      logoAlt: "Crypto.com logo",
      logoSrc: "/about/logo-crypto.png",
      role: "Senior Product designer",
      team: "Card & AI"
    },
    {
      company: "OKX",
      companyHref: "https://www.okx.com",
      date: "2023.09 - 2024.09",
      details: [
        "Led the design of core asset management experience (deposit & transfer) for both mobile and web. Led a redesign of the web deposit driven by user research, resulting in a 20% conversion lift and a 32% reduction in completion time."
      ],
      logoAlt: "OKX logo",
      logoSrc: "/about/logo-okx.png",
      role: "Product designer",
      team: "Asset"
    },
    {
      company: "Bowtie",
      companyHref:
        "https://www.bowtie.com.hk/en?srsltid=AfmBOorLNss2RM4YUt0s_BRDbfNqXQhNsybJnFXTGldIuzR3nxJBBU5y",
      date: "2022.07 - 2022.08",
      details: [
        "Worked under the service operation team to optimized internal underwriting infrastructure by identifying critical workflow bottlenecks. Designed and deployed a systemic filtering solution that reduced insurance application search time."
      ],
      logoAlt: "Bowtie logo",
      logoSrc: "/about/logo-bowtie.png",
      role: "Product designer intern",
      team: "Service ops"
    }
  ]
} as const;

export const aboutEducation = {
  index: "03",
  title: "Education",
  entries: [
    {
      company: "The Hong Kong Polytechnic University",
      date: "2019-2023",
      logoAlt: "The Hong Kong Polytechnic University logo",
      logoClassName: "logoPadded",
      logoSrc: "/about/logo-polyu.png",
      role: "(B.A) in Communication design"
    },
    {
      company: "University of the Arts London",
      date: "2021",
      logoAlt: "University of the Arts London logo",
      logoSrc: "/images/about/logo-ual.jpg",
      role: "Creative coding",
      team: "Summer course"
    }
  ]
} as const;

export const aboutFavorites = {
  index: "04",
  title: "Favorites  ‧  2026",
  reading: {
    href: "https://www.setmargins.press/books/who-can-afford-to-be-critical/",
    imageAlt: "Book cover for Who Can Afford to Be Critical?",
    imageSrc: "/about/favorite-reading.png",
    label: "Reading"
  },
  movies: {
    href: "https://www.imdb.com/user/ur200531989/ratings?ref_=ext_shr_lnk",
    label: "Movie",
    entries: [
      {
        href: "https://www.imdb.com/title/tt5726616/",
        meta: "2017 · Romance · 2h 10m",
        title: "Call me by your name"
      },
      {
        href: "https://www.imdb.com/title/tt0133093/",
        meta: "1999 · Sci-fi · 2h 16m",
        title: "Matrix"
      },
      {
        href: "https://www.imdb.com/title/tt1605783/",
        meta: "2011 ‧ Romance ‧ 1h 34m",
        title: "Midnight in Paris"
      }
    ]
  },
  travel: {
    href: "https://www.google.com/maps/place/Bali,+Indonesia",
    imageAlt: "A beach scene in Bali, Indonesia",
    imageSrc: "/about/favorite-travel-bali.png",
    label: "Travel",
    location: "Indonesia",
    title: "Bali"
  },
  music: {
    artist: "Yorushika",
    href: "https://open.spotify.com/track/5j7ixaLeGTGSv4DzKs0pCM?si=a25e78a9a43e4b06",
    label: "Music",
    title: "ただ君に晴れ"
  },
  apps: {
    label: "App",
    items: [
      {
        alt: "Readwise app icon",
        href: "https://cursor.com/",
        src: "/about/favorite-app-1.png"
      },
      {
        alt: "Arc app icon",
        href: "https://arc.net/",
        src: "/about/favorite-app-2.png"
      },
      {
        alt: "Flighty app icon",
        href: "https://flighty.com/",
        src: "/about/favorite-app-3.png"
      },
      {
        alt: "Notion app icon",
        href: "https://www.notion.so/",
        src: "/about/favorite-app-4.png"
      },
      {
        alt: "Cursor app icon",
        href: "https://luma.com/",
        src: "/about/favorite-app-5.png"
      },
      {
        alt: "Spotify app icon",
        href: "https://open.spotify.com/",
        src: "/about/favorite-app-6.png"
      }
    ]
  }
} as const;
