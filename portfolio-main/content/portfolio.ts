export const assetUrls = {
  avatar: "/images/profile/avatar.png",
  projectCard: "/images/projects/credit-card-cover.png",
  depositExperience: "/images/projects/okx-deposit-experience.png",
  delphiAiSearch: "/images/projects/delphi-ai-search.png",
  filterWidget: "/images/projects/filter-widget.png"
} as const;

export const cryptoProjectAssets = {
  hero: "/images/projects/crypto-com/hero.png",
  researchData: "/images/projects/crypto-com/research-data.png",
  originalCardHome: "/images/projects/crypto-com/original-card-home.png",
  invisibleCashback: "/images/projects/crypto-com/invisible-cashback.png",
  preferenceResearch: "/images/projects/crypto-com/preference-research.png",
  designProcess: "/images/projects/crypto-com/design-process.png",
  unifiedHome: "/images/projects/crypto-com/unified-home.png",
  creditScreens: "/images/projects/crypto-com/credit-screens.png",
  rewardsHub: "/images/projects/crypto-com/rewards-hub.png",
  takeaway: "/images/projects/crypto-com/takeaway.png"
} as const;

export const okxProjectAssets = {
  hero: "/images/projects/okx/hero.png",
  depositGrowth: "/images/projects/okx/deposit-growth.png",
  webVsApp: "/images/projects/okx/web-vs-app.png",
  networkQuestions: "/images/projects/okx/network-questions.png",
  pageStructureIterations: "/images/projects/okx/page-structure-iterations.png",
  networkSelection: "/images/projects/okx/network-selection.png",
  finalDesignRecording: "/images/projects/okx/final-design-recording.mp4"
} as const;

export const bowtieProjectAssets = {
  projectCard: "/images/projects/bowtie/project-card.png",
  hero: "/images/projects/bowtie/hero.jpg",
  background: "/images/projects/bowtie/background.png",
  filterAnalysis: "/images/projects/bowtie/filter-analysis.png",
  portalAnalysis: "/images/projects/bowtie/portal-analysis.png",
  earlyDrafts: "/images/projects/bowtie/early-drafts.png",
  flowchart: "/images/projects/bowtie/flowchart.png",
  userTesting: "/images/projects/bowtie/user-testing.png",
  filterStatusMap: "/images/projects/bowtie/filter-status-map.png",
  finalDesignPrototype: "/images/projects/bowtie/final-design-prototype.mov"
} as const;

export const writingArticleAssets = {
  figmaWorkflowHero: "/images/writings/figma-workflow/hero.png",
  figmaWorkflowProcess: "/images/writings/figma-workflow/process.png",
  figmaWorkflowProblem: "/images/writings/figma-workflow/problem.png",
  figmaWorkflowProposal: "/images/writings/figma-workflow/proposal.png",
  livingWithComplexityHero: "/images/writings/living-with-complexity/hero.png",
  livingWithComplexityGoresDesk: "/images/writings/living-with-complexity/gores-desk.png",
  ethnographicResearchHero: "/images/writings/ethnographic-research/hero.png",
  ethnographicResearchMap: "/images/writings/ethnographic-research/map.png",
  ethnographicResearchObservationDiagram:
    "/images/writings/ethnographic-research/observation-diagram.png",
  ethnographicResearchObservationPhotos:
    "/images/writings/ethnographic-research/observation-photos.png",
  ethnographicResearchBoard: "/images/writings/ethnographic-research/research-board.png",
  socialDilemmaHero: "/images/writings/the-social-dilemma/hero.png",
  socialDilemmaSystemOutOfControl:
    "/images/writings/the-social-dilemma/system-out-of-control.png"
} as const;

export const profile = {
  name: "Justin Fang",
  sectionIndex: "01",
  introPrefix: "Product designer ",
  introHighlight: "in the field of financial technology",
  introMiddle:
    ". Currently designing web3.0 trading & asset management experience at ",
  introCompany: {
    href: "https://crypto.com",
    label: "Crypto.com",
    logoAlt: "Crypto.com logo",
    logoSrc: "/about/logo-crypto.png"
  },
  introPreviousPrefix: "Prev. design (at) ",
  introPreviousCompanies: [
    {
      href: "https://www.okx.com/",
      label: "OKX",
      logoAlt: "OKX logo",
      logoSrc: "/about/logo-okx.png"
    },
    {
      href: "https://www.bowtie.com.hk/en?srsltid=AfmBOorLNss2RM4YUt0s_BRDbfNqXQhNsybJnFXTGldIuzR3nxJBBU5y",
      label: "Bowtie",
      logoAlt: "Bowtie logo",
      logoSrc: "/about/logo-bowtie.png"
    }
  ],
  updatedAt: "🪚 Updated Mar 25, 2026",
  ctas: [
    { label: "Email me", href: "mailto:jenhung.work@gmail.com", openInNewTab: false },
    { label: "CV →", href: "/Resume_2026.pdf", openInNewTab: true }
  ],
  footer: {
    copyright: "© 2026 All rights reserved @justinfang",
    location: "Hong Kong",
    timezone: "GMT+8"
  }
} as const;

export const projects = [
  {
    title: "Delphi AI search",
    description:
      "An AI-powered search engine that converts high-volume market data into real-time sentiment analysis, enabling users to transition from discovery to execution with higher precision and speed.",
    tags: ["0 → 1", "AI feature"],
    image: assetUrls.delphiAiSearch,
    alt: "Delphi AI search mobile interface showing an AI-powered crypto search query.",
    imageClassName: "projectImageBrowser",
    detailHref: null,
    status: "locked"
  },
  {
    title: "Launching Crypto.com Credit Card",
    description:
      "Building the 0 → 1 of a crypto-based credit card for the U.S market. Centralizing rewards within the experience, driving 3M+ card spend within the first 6 months.",
    tags: ["0 → 1", "Payment"],
    image: assetUrls.projectCard,
    alt: "Crypto.com credit card mobile experience shown on a phone.",
    imageClassName: "projectImagePhone",
    detailHref: "/projects/crypto-com",
    status: "active"
  },
  {
    title: "Optimizing OKX's deposit experience",
    description: "Design enhancement that led to a 18.3% increase in conversion",
    tags: ["Feature improvement", "Payment"],
    image: assetUrls.depositExperience,
    alt: "OKX deposit experience interface displayed in a browser.",
    imageClassName: "projectImageBrowser",
    detailHref: "/projects/okx",
    status: "active"
  },
  {
    title: "Re-usable filter widget for insurance underwriters",
    description:
      "Optimized Bowtie's internal portal efficiency by replacing manual browser-bookmark workarounds with a searchable, re-usable filter.",
    tags: ["New feature", "Internal tools"],
    image: bowtieProjectAssets.projectCard,
    alt: "Bowtie filter badge and card open instructions design board.",
    imageClassName: "projectImageFilter",
    detailHref: "/projects/bowtie",
    status: "active"
  }
] as const;

export const cryptoProjectDetail = {
  href: "/projects/crypto-com",
  newsHref: "https://crypto.com/sg/company-news/creditcardus",
  hero: {
    image: cryptoProjectAssets.hero,
    alt: "Crypto.com credit card mobile interface on a dark phone screen."
  },
  navItems: [
    { id: "intro", label: "Intro" },
    { id: "background", label: "Background" },
    { id: "problem", label: "Problem" },
    { id: "design-outcome", label: "Design outcome" },
    { id: "takeaway", label: "Takeaway" }
  ],
  intro: {
    year: "2025",
    title: "Launching Crypto.com Credit Card",
    summary:
      "0 to 1 U.S. credit card launch. Centralizing rewards within a scalable global architecture.",
    details: [
      { label: "Client", value: "Crypto.com" },
      { label: "Role", value: "Lead product designer" },
      { label: "Collaboration", value: "2*PM  |  1*Product designer  |  1*Content designer" }
    ]
  },
  metrics: [
    { value: "83.3%", label: "UT pass rate" },
    { value: "7+", label: "Regions aligned" },
    { value: "3M +", label: "Card spend (Nov. 2025)" }
  ],
  sections: [
    {
      id: "background",
      heading: "Background",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              { text: "In 2025, Crypto.com spearhead a high-stakes mission: launching the " },
              { text: "first crypto-based credit", highlight: true },
              { text: " card in the U.S. market." }
            ],
            [
              {
                text: "While Crypto.com had a successful debit card history, the U.S. payment market was shifting; research showed credit cards were surpassing debit as the preferred payment method by 16% due to better "
              },
              { text: "rewards and flexible repayment", highlight: true },
              { text: "." }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.researchData,
              alt: "U.S payment research data reference chart.",
              caption: "U.S payment research data reference"
            }
          ]
        }
      ]
    },
    {
      id: "problem",
      heading: "The unscalable infrastructure of Crypto.com card UI",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              { text: "A legacy of regional " },
              { text: "inconsistencies", highlight: true },
              {
                text: " and a disjointed debit experience created a weak architectural base to scale new big features like credit card."
              }
            ]
          ]
        },
        {
          kind: "prose",
          heading: "Obscured focus on rewards",
          paragraphs: [
            [
              {
                text: "Essential rewards and cashback were relegated to the background, hidden from the core user journey. This lack of visibility failed to leverage the primary incentive driving credit adoption."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.originalCardHome,
              alt: "Original card home screen.",
              caption: "Original card home"
            },
            {
              src: cryptoProjectAssets.invisibleCashback,
              alt: "Invisible cash back screen.",
              caption: "Invisible cash back"
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.preferenceResearch,
              alt: "VPO research indicating under-served user preference.",
              caption: "VPO research that indicates under-served user preference"
            }
          ]
        }
      ]
    },
    {
      id: "design-outcome",
      heading: "Rebuild the foundation: Region unification across flows",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: 'The first phase was a card home revamp. We rebuilt the foundations across all regions to minimize experience gaps. This hub brought scattered benefits into a single, easy-to-access entry point, ensuring rewards were central to the in-app experience. We also streamlined the journey for non-card users with a "Level Up" page for horizontal card comparison and pre-qualification.'
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.designProcess,
              alt: "Crypto.com credit card design process boards.",
              caption: "Design process"
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.unifiedHome,
              alt: "New card home across multiple regions.",
              caption: "New card home: 1 design for 7+ regions"
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.creditScreens,
              alt: "Additional credit card screens.",
              caption: "More credit card screens"
            }
          ]
        },
        {
          kind: "prose",
          heading: "Centralizing reward & delightedness at the hart of experience",
          paragraphs: [
            [
              {
                text: "To resolve the obscured visibility of program incentives under card, we integrated real-time cashback data attached to the primary balance view."
              }
            ],
            [
              {
                text: "This also served as a high-intent gateway to the new \"Reward Hub\" - a unified ecosystem designed to aggregate scattered benefits into a single, cohesive destination. To further lower the barrier to entry, our team introduced the Level Up experience, which streamlined the journey for non-card users by providing a horizontal comparison framework for confident decision-making, and further more, faciliate benefit awareness."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.rewardsHub,
              alt: "Level-up main page and Rewards hub screens.",
              caption: "Level-up main page & Rewards hub"
            }
          ]
        }
      ]
    },
    {
      id: "takeaway",
      heading: "Takeaways",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "The card occupies a unique strategic position, acting as a vital bridge between Trad-Fi and Web3 space. Navigating this compliance-intensive project challenged myself to architect a refreshing experience distinctly differentiated from legacy banking institutions."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: cryptoProjectAssets.takeaway,
              alt: "Stacked Crypto.com card visual."
            }
          ]
        }
      ]
    }
  ],
  actions: {
    back: { label: "← Back", href: "/#projects" },
    next: { label: "Next project →", href: "/projects/bowtie" }
  }
} as const;

export const okxProjectDetail = {
  href: "/projects/okx",
  newsHref: "https://www.okx.com/help/how-do-i-make-a-deposit-web",
  hero: {
    image: okxProjectAssets.hero,
    alt: "OKX deposit experience product screens on a light background."
  },
  navItems: [
    { id: "intro", label: "Intro" },
    { id: "background", label: "Background" },
    { id: "data-insights", label: "Data insights" },
    { id: "design-outcome", label: "Design outcome" }
  ],
  intro: {
    year: "2024",
    title: "Optimizing OKX's deposit experience",
    summary:
      "Incorporate data insights to drive IA reorganization that led to significant conversion rate improvements.",
    details: [
      { label: "Client", value: "OKX" },
      { label: "Role", value: "Product designer" },
      { label: "Stakeholder", value: "2*PM  |  1*Web dev  |  1*Customer service" }
    ]
  },
  metrics: [
    { value: "+20.3%", label: "Total conversion" },
    { value: "-31.2%", label: "CS inquiries" },
    { value: "8sec", label: "Reduction in convert time" }
  ],
  sections: [
    {
      id: "background",
      heading: "Deposit facilitates platform growth",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Deposit serves as a core function within the app, also the very first touch point before users get access to multiple trading instruments and earning activities. Creating a seamless deposit experience is considered as the first priority to drive platform growth."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: okxProjectAssets.depositGrowth,
              alt: "A diagram showing deposit as the first touch point before trading and earning activities.",
              caption: "Credit card data reference"
            }
          ]
        }
      ]
    },
    {
      id: "data-insights",
      heading: "Friction in a high-anxiety decision process",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Data from Amplitude revealed a significant conversion gap: our web platform had a conversion rate of only 36.0%, with users taking an average of 25 seconds to complete a deposit. Which is significantly higher than the app platform."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: okxProjectAssets.webVsApp,
              alt: "A comparison of OKX web and app deposit conversion experiences.",
              caption: "Web v.s App"
            }
          ]
        },
        {
          kind: "prose",
          heading: "Getting lost during network selection",
          paragraphs: [
            [
              {
                text: "We lost around 10% of users during the network selection, and checking the CS portal, there's a significant number of inquiries that reveals the fact that users are not familiar with the differences in between different networks."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: okxProjectAssets.networkQuestions,
              alt: "Research notes and diagrams describing network-related support questions.",
              caption: "Network related question"
            }
          ]
        }
      ]
    },
    {
      id: "design-outcome",
      heading: "Re-work on the deposit content structure",
      blocks: [
        {
          kind: "list",
          items: [
            {
              label: "User flow",
              text: "Worked hand in hand with content designer to reduce information complexity (reminders and pop ups), simplifying the process for users to reach their own address."
            },
            {
              label: "Deposit detail page",
              text: "Rearrange Information architecture based on its CTR, guide users to put more attention on actionable items."
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: okxProjectAssets.pageStructureIterations,
              alt: "Different OKX deposit page structure iterations.",
              caption: "Iteration on different page structure"
            }
          ]
        },
        {
          kind: "list",
          heading: "Design outcome",
          items: [
            {
              label: "Minimizing noise",
              text: "Removed 3 redundant reminders and 1 unnecessary extra click."
            },
            {
              label: "Emphasis on copy address action",
              text: "Reorganized the layout to lead visual focus to deposit address which has a 70% CTR."
            },
            {
              label: "Network dropdown optimization",
              text: "Optimized the network UI to display min. deposit and deposit time, leading to a 30% drop in CS inquiries by providing users with key info upfront."
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: okxProjectAssets.networkSelection,
              alt: "Optimized OKX network selection UI.",
              caption: "Network selection improvement"
            }
          ]
        },
        {
          kind: "video",
          src: okxProjectAssets.finalDesignRecording,
          label: "Final OKX deposit design recording",
          caption: "Final design recording"
        }
      ]
    }
  ],
  actions: {
    back: { label: "← Back", href: "/#projects" },
    next: { label: "Next project →", href: "/projects/crypto-com" }
  }
} as const;

export const bowtieProjectDetail = {
  href: "/projects/bowtie",
  hero: {
    image: bowtieProjectAssets.hero,
    alt: "Bowtie internal portal application list with filter controls."
  },
  navItems: [
    { id: "intro", label: "Intro" },
    { id: "background", label: "Background" },
    { id: "problem-analysis", label: "Problem analysis" },
    { id: "idea-generation", label: "Idea generation" },
    { id: "design-solution", label: "Design solution" },
    { id: "takeaway", label: "Takeaway" }
  ],
  intro: {
    year: "2022",
    title: "Re-usable filter widget for insurance underwriters",
    summary:
      "Optimized Bowtie's internal portal efficiency by replacing manual browser-bookmark workarounds with a searchable, re-usable filter.",
    details: [
      { label: "Client", value: "Bowtie Life Insurance Company" },
      { label: "Role", value: "Product designer intern" },
      { label: "Stakeholder", value: "1*UX strategist  |  1*Engineering lead  |  1*PM" }
    ]
  },
  metrics: [
    { value: "3 UT", label: "Sessions conducted" },
    { value: "50% ↓", label: "Task completion time" }
  ],
  sections: [
    {
      id: "background",
      heading: "Background",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Bowtie, a licensed virtual insurance company, relies on an internal portal where staff manage and review customer insurance applications."
              }
            ],
            [
              { text: "The project goal was simple: " },
              { text: "help underwriters find the right items faster", highlight: true },
              {
                text: " so they could process more cases within their daily workflows."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.background,
              alt: "Bowtie background slide showing the company and internal portal context.",
              frameVariant: "standard"
            }
          ]
        }
      ]
    },
    {
      id: "problem-analysis",
      heading: "Pain-point → Hidden friction of finding applications",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Underwriters and claims specialists were spending the majority of their day navigating long lists of applications. We discovered that the existing filter function was so unintuitive and cumbersome that users had developed their own workarounds:"
              }
            ]
          ]
        },
        {
          kind: "list",
          items: [
            {
              label: "The manual grind:",
              text: "Users had to click multiple times and scroll through endless lists just to adjust a single parameter."
            },
            {
              label: "The bookmark hack:",
              text: "To save time, staff were saving specific filtered search results as browser bookmarks in Google Chrome."
            },
            {
              label: "Maintenance debt:",
              text: "Every time a new product was launched, every underwriter had to manually update every single one of their bookmarks."
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.filterAnalysis,
              alt: "Annotated analysis showing friction in the existing Bowtie filter experience.",
              frameVariant: "filterAnalysis"
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.portalAnalysis,
              alt: "Detailed analysis of the production internal portal filter workflow.",
              caption: "Analysis on the PROD internal portal",
              frameVariant: "portalAnalysis"
            }
          ]
        }
      ]
    },
    {
      id: "idea-generation",
      heading: "Early ideas → A re-usable filter group",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Since each underwriter is responsible for a specific category of applications, filters should be reusable and shareable across accounts. With this in mind, I developed early concepts for what this could look like."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.earlyDrafts,
              alt: "Early sketches exploring reusable filter group concepts.",
              caption: "Early drafts for discussion with UX strategist",
              frameVariant: "earlyDrafts"
            }
          ]
        },
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "Over two weeks of iteration, I also developed a new flowchart to align the scrum team and clarify the navigation through five core filter functions."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.flowchart,
              alt: "Flowchart mapping the navigation through five core filter functions.",
              frameVariant: "flowchart"
            }
          ]
        }
      ]
    },
    {
      id: "design-solution",
      heading: "Evaluate ideas through user testing",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: "To verify my idea, I conducted scenario-based user interviews with 3 underwriters to understand their exact thought processes while searching for cases. I mapped out their tasks, like finding all VHIS applications created on a specific day, to see if my designs were sustainable."
              }
            ]
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.userTesting,
              alt: "User testing recording with internal underwriters.",
              caption: "User testing recording with internal underwriters",
              frameVariant: "userTesting"
            }
          ]
        },
        {
          kind: "prose",
          heading: "Introducing Re-usable Filter Groups",
          paragraphs: [
            [
              {
                text: "The redesign focused on two major functional improvements that eliminated the need for browser workarounds:"
              }
            ]
          ]
        },
        {
          kind: "list",
          items: [
            {
              label: "Smart product ID search:",
              text: "I replaced the long, manual checklist with a searchable interface that groups product types, reducing errors and saving time."
            },
            {
              label: "Saved filter groups:",
              text: 'I introduced an in-built "Master" filter function that allows users to name and save their favorite filter combinations directly in the portal.'
            },
            {
              label: "Visual hierarchy:",
              text: "We implemented a system of badges and clear visual hints to help users immediately identify which filters are active."
            }
          ]
        },
        {
          kind: "image",
          images: [
            {
              src: bowtieProjectAssets.filterStatusMap,
              alt: "Different filter statuses and layers mapped for the feature.",
              caption: "Different status & layer of filters mapped for this feature",
              frameVariant: "filterStatusMap"
            }
          ]
        },
        {
          kind: "video",
          src: bowtieProjectAssets.finalDesignPrototype,
          label: "Final Bowtie reusable filter prototype in the internal portal",
          caption: "Final design prototype"
        }
      ]
    },
    {
      id: "takeaway",
      heading: "Takeaways: The leverage points",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            [
              {
                text: 'Though filters are often seen as minor components, this project proved they are a significant "leveraging point" for internal processing efficiency. By bringing the "bookmarking" behavior directly into the UI, we removed the manual burden of updating external links.'
              }
            ],
            [
              {
                text: "This solution, while built for underwriters, laid the groundwork for a "
              },
              { text: "scalable filtering system", highlight: true },
              {
                text: " that can be rolled out to all internal user types across the platform."
              }
            ]
          ]
        }
      ]
    }
  ],
  actions: {
    back: { label: "← Back", href: "/#projects" },
    next: { label: "Next project →", href: "/projects/okx" }
  }
} as const;

export const writings = [
  {
    title: "Workflow optimization within Figma at OKX",
    date: "Posted on 08.09.2024",
    category: "Design practice",
    href: "/writings/workflow-optimization-within-figma"
  },
  {
    title: 'Reading "Living with complexity" by Don Norman',
    date: "Posted on 07.09.2024",
    category: "Reading",
    href: "/writings/living-with-complexity-by-don-norman"
  },
  {
    title: "Ethnographic research at a local park in Hong Kong",
    date: "Posted on 02.09.2024",
    category: "Research",
    href: "/writings/ethnographic-research-at-a-local-park-in-hong-kong"
  },
  {
    title: "The social Dilemma — Quotes and thoughts",
    date: "Posted on 02.04.2023",
    category: "Reading",
    href: "/writings/the-social-dilemma-quotes-and-thoughts"
  }
] as const;

export const writingsPage = {
  index: "01",
  title: "Notes around design ↔ art ↔ technology",
  description:
    "I document my reflections on design, technology, and art as I come across them. I do not update this regularly.",
  note: "→ I think a lot so more coming soon...... 🛠️",
  entries: [
    {
      title: "Workflow optimization within Figma at OKX",
      date: "Posted on 08.09.2024",
      category: "Design practice",
      href: "/writings/workflow-optimization-within-figma"
    },
    {
      title: 'Reading "Living with complexity" by Don Norman',
      date: "Posted on 07.09.2024",
      category: "Reading",
      href: "/writings/living-with-complexity-by-don-norman"
    },
    {
      title: "Ethnographic research at a local park in Hong Kong",
      date: "Posted on 02.09.2024",
      category: "Research",
      href: "/writings/ethnographic-research-at-a-local-park-in-hong-kong"
    },
    {
      title: "The social Dilemma — Quotes and thoughts",
      date: "Posted on 02.04.2023",
      category: "Reading",
      href: "/writings/the-social-dilemma-quotes-and-thoughts"
    }
  ]
} as const;

export const writingArticles = [
  {
    slug: "workflow-optimization-within-figma",
    href: "/writings/workflow-optimization-within-figma",
    metadata: {
      title: "Workflow optimization within Figma - Justin Fang",
      description:
        "A design practice article about improving Figma file structure and team communication at OKX."
    },
    date: "08.09.2024",
    title: "Workflow optimization within Figma",
    category: "Design practice",
    hero: {
      src: writingArticleAssets.figmaWorkflowHero,
      alt: "Two Figma files connected by an arrow, representing a workflow optimization.",
      caption: "Image referenced from Edward Chechique's medium article"
    },
    intro:
      "Working as a product designer in a big team like OKX can get pretty crazy at times, especially when you've got project stakeholders ranging from engineers to a whole bunch of product managers and reviewers. So, I wanted to share a little story with you about how I, as a designer, shook things up in our Figma routine that reduce communication cost.",
    sections: [
      {
        id: "file-as-center",
        image: {
          src: writingArticleAssets.figmaWorkflowProcess,
          alt: "Figma design process diagram showing project collaboration flow."
        },
        heading: "File as the center for discussions",
        paragraphs: [
          "In our dynamic design process, product designers work with PMs, developers, and content designers to orchestrate end-to-end processes. Here, the Figma file stands as the center, facilitating clear communication including:",
          "Apart from grooming sessions and major meeting updates, we heavily rely on Figma files to self-explain the process. Therefore, ensuring the file structure and communication are clear and effective is crucial."
        ],
        list: {
          kind: "unordered",
          items: [
            "Project version control: For designers & PM's to track version updates, comments & records",
            "Project scope: Compare new design with production version",
            "Project status: Whether it is ready for development or not"
          ]
        }
      },
      {
        id: "existing-practices",
        heading: "Problem of our existing practices",
        paragraphs: [
          "After observing our day-to-day processes, I noticed several FAQs in every group chat, inquiring about the latest design versions and content keys. Additionally, I identified several human errors as outlined below:"
        ],
        image: {
          src: writingArticleAssets.figmaWorkflowProblem,
          alt: "A Figma file-structure problem slide with comments and folder examples."
        }
      },
      {
        id: "new-structure",
        heading: "A file structure that get everyone onboarded",
        paragraphs: [
          "Therefore, I started by studying file management practices at various tech companies and discovered that a well-organized structure that onboards every stakeholder should adhere to the following principles:"
        ],
        list: {
          kind: "ordered",
          items: [
            "Consistency: Minimizing redundant information delivery at the inception of each new project.",
            "Scalability: A structure that can adapt seamlessly from large to medium to small projects.",
            "Collaborative: Enabling not just designers to craft designs but also involving content creators, project managers, and developers in the co-creation process."
          ]
        },
        note: {
          text: "*I distinctly recall an article by Deliveroo that treated internal practices as a product worthy of research and study. Kudos to the designers at Deliveroo for their insightful work",
          link: {
            label:
              "https://medium.com/deliveroo-design/wheres-that-file-how-we-use-figma-covers-to-communicate-efficiently-across-teams-at-deliveroo-fe16c7c165",
            href: "https://medium.com/deliveroo-design/wheres-that-file-how-we-use-figma-covers-to-communicate-efficiently-across-teams-at-deliveroo-fe16c7c165"
          }
        }
      },
      {
        id: "proposal",
        heading: "My Proposal of new practices",
        paragraphs: [
          "In the end, I presented a proposal to my manager at OKX, outlining several significant updates and offering implementation tips. Moreover, I conducted mini briefing sessions with my team to ensure the proper implementation of these practices."
        ],
        image: {
          src: writingArticleAssets.figmaWorkflowProposal,
          alt: "A proposed Figma file structure slide."
        }
      },
      {
        id: "results",
        heading: "Implementation results",
        paragraphs: [
          "After a few weeks of trial implementation, we received positive feedback from the team, which fostered a more collaborative and efficient process."
        ]
      },
      {
        id: "next-steps",
        heading: "Next steps",
        paragraphs: [
          "However, our journey doesn't end here. Given the dynamic nature of our team, I believe that moving forward, designers should remain vigilant about overall team practices to ensure that our file management system remains robust and doesn't hinder efficiency."
        ]
      }
    ],
    actions: {
      back: { label: "← Back", href: "/writings" },
      next: { label: "Next →", href: "/writings" }
    }
  },
  {
    slug: "living-with-complexity-by-don-norman",
    href: "/writings/living-with-complexity-by-don-norman",
    layout: "narrow",
    metadata: {
      title: 'Reading "Living with complexity" by Don Norman - Justin Fang',
      description:
        "Reflections on Don Norman's Living with Complexity and the difference between complexity and confusion in design."
    },
    date: "07.09.2024",
    title: 'Reading "Living with complexity" by Don Norman',
    category: "Reading",
    hero: {
      src: writingArticleAssets.livingWithComplexityHero,
      alt: "A dense group of overhead cables tangled around utility poles.",
      caption: "Life is just as complex as a bunch of entangled cable"
    },
    intro:
      "The book, authored by Don Norman in 2010, presents grounded theories on human-object interactions and design psychology.",
    sections: [
      {
        id: "why-i-start-reading",
        heading: "Why I start reading?",
        paragraphs: [
          "During my time at PolyU School of Design, I encountered a diverse array of design theories, ranging from highly conceptual to more practical ones, spanning design history to design fiction. I hold the view that as a designer engaged in the commercial realm (or now as a product designer), it is crucial upon us to thoughtfully consider the products we create. Reading has equipped me with the necessary perspective to contemplate the interaction between technology and humanity."
        ]
      },
      {
        id: "life-is-complex",
        heading: "Life is complex. Good design ≠ simple design",
        paragraphs: [
          'Nowadays, user experience has emerged as a buzzword across businesses. Designers are frequently tasked with simplifying processes, product outlook, and of course, user flows. Yet, it is often overlooked that humans are inherently complex beings. In today\'s intricate society, where both our lifestyles and the products we engage with are increasingly sophisticated, fixating solely on "simplification" as the guiding principle can lead us astray. It is unrealistic to expect designers to distill every concept to a level understandable by a 10-year-old. Simple design, while valuable in many cases, does not universally align with the diverse needs of users.'
        ]
      },
      {
        id: "complexity-or-confusion",
        heading: "Complexity or Confusion?",
        paragraphs: [
          "In the book, it is particularly enlightening that, Don Norman argues complexity as a term that should be viewed neutrally, a perspective that contrasts with the common contemporary aversion to complexity among many designers. According to Norman, the crux of good design lies in whether a product is confusing or not. Designers bear the responsibility of empathizing with users, stepping into their shoes, and crafting mental models that alleviate confusion."
        ]
      },
      {
        id: "gores-desk",
        heading: "Gore's Desk",
        paragraphs: [
          "Norman presents a vivid example early in his book to illustrate this point. At first glance, an observer might perceive a cluttered desk and instinctively feel the need to tidy it up. However, the reality is quite different - Gore (the person in the picture) intentionally maintains the disorder on their desk, as he is able to locate all necessary items. Norman interprets Gore's desk as the chaotic yet organized reflection of a structured mind. He emphasizes that complexity does not necessarily equate to confusion."
        ],
        image: {
          src: writingArticleAssets.livingWithComplexityGoresDesk,
          alt: "A black-and-white photo of a person working at a heavily cluttered desk."
        }
      },
      {
        id: "what-should-we-focus-on",
        heading: "What should we focus on?",
        paragraphs: [
          "As designers, our objective should be to guide users toward constructing mental models that facilitate problem-solving, rather than imposing simplistic solutions that fail to address their underlying needs. It is about assisting users in navigating complexity effectively rather than oversimplifying the design process and delivering solutions that fall short of meeting user requirements."
        ]
      }
    ],
    actions: {
      back: { label: "← Back", href: "/writings" },
      next: { label: "Next →", href: "/writings/workflow-optimization-within-figma" }
    }
  },
  {
    slug: "ethnographic-research-at-a-local-park-in-hong-kong",
    href: "/writings/ethnographic-research-at-a-local-park-in-hong-kong",
    layout: "narrow",
    metadata: {
      title: "Ethnographic research at a local park in Hong Kong - Justin Fang",
      description:
        "An observational research side project exploring Tai Wan Shan Park as a third place in Hong Kong."
    },
    date: "02.09.2024",
    title: "Ethnographic research at a local park in Hong Kong",
    category: "Research",
    hero: {
      src: writingArticleAssets.ethnographicResearchHero,
      alt: "A black-and-white night view of Tai Wan Shan Park with residential towers behind it.",
      caption: "Tai Wan Shan Park (Where the research is conducted)"
    },
    intro:
      "This is one of my side projects completed in 2021 while residing in the Hung Hom neighborhood of Hong Kong. At that time, I was captivated by the diversity of Tai Wan Shan Park (a local park in my vicinity) and the innovative ways in which individuals had repurposed the space. Thus, I begin with this side project to delve deeper into exploring the dynamics.",
    sections: [
      {
        id: "park-as-a-third-place",
        heading: "Park as a third-place",
        paragraphs: [
          "\"Park,\" as defined by sociologist Ray Oldenburg, embodies the concept of a \"third place,\" facilitating a spectrum of potential social interactions. These spaces serve as an intermediary zone between the home (the 'first' place) and the workplace (the 'second' place). Parks are characterized as versatile and intricate environments where the exchange of ideas, social engagement, and the nurturing of relationships occur."
        ],
        images: [
          {
            src: writingArticleAssets.ethnographicResearchMap,
            alt: "A map showing Tai Wan Shan Park in Hong Kong."
          }
        ]
      },
      {
        id: "how-to-approach-the-complexity",
        heading: "How to approach the complexity?",
        paragraphs: [
          "To analyze the park, I spent time immersing myself in the activities and interactions of park visitors, documenting my findings through field notes. This helped me understand how people used the space and what stakeholders are connected through the space. Here's how I did it:"
        ],
        list: {
          kind: "unordered",
          items: [
            "When: 8:00 PM to 11:00 PM",
            "How Long: 1 hour each time",
            "How Often: 5 times in a month"
          ]
        },
        images: [
          {
            src: writingArticleAssets.ethnographicResearchObservationDiagram,
            alt: "A field observation diagram mapping people and activity locations in the park.",
            variant: "bordered"
          },
          {
            src: writingArticleAssets.ethnographicResearchObservationPhotos,
            alt: "Night observation photos from Tai Wan Shan Park.",
            variant: "widePanorama"
          }
        ]
      },
      {
        id: "unexpectedness-patterns-and-outcomes",
        heading: "1 Month, 5 observations - Unexpectedness patterns & outcomes",
        paragraphs: [
          "During the research phase, it was fascinating to notice that each observation session presented a unique aspect of the park. It was intriguing to witness the diverse dimensions of Tai Wan Shan brought to life by the creative flair of local visitors. To streamline my findings, I organized all my notes into a table, detailing the types of activities, their frequency, and the specific locations within the park."
        ],
        images: [
          {
            src: writingArticleAssets.ethnographicResearchBoard,
            alt: "A research board summarizing activity patterns and special behaviors observed in the park.",
            variant: "bordered"
          }
        ]
      },
      {
        id: "conclusion",
        heading: "Conclusion",
        paragraphs: [
          "This is a particularly refreshing experience for me, rather than doing research in the usual way (interviewing, online research, lab study), there's still, significant unexpectedness in the park that you can find from pure observation. A trash can has the potential to become an object in a baseball game under the hand of a group of kids, isn't that inspiring at all?"
        ]
      }
    ],
    actions: {
      back: { label: "← Back", href: "/writings" },
      next: { label: "Next →", href: "/writings/workflow-optimization-within-figma" }
    }
  },
  {
    slug: "the-social-dilemma-quotes-and-thoughts",
    href: "/writings/the-social-dilemma-quotes-and-thoughts",
    layout: "narrow",
    metadata: {
      title: "The social Dilemma — Quotes and thoughts - Justin Fang",
      description:
        "Thoughts on technology ethics after watching The Social Dilemma, and why product teams need to re-center humanity."
    },
    date: "02.04.2023",
    title: "The social Dilemma — Quotes and thoughts",
    category: "Reading",
    hero: {
      src: writingArticleAssets.socialDilemmaHero,
      alt: "The Social Dilemma cover artwork featuring a neon heart icon over a digital head silhouette.",
      caption: "Movie cover of The Social Dilemma on Netflix"
    },
    intro:
      'After watching "The Social Dilemma", and "人類學的無正府主義" over the weekend, which discussed the topic of technological ethics, a striking underlying message pops out, implying the inherent flaws within our existing social system and the deeply rooted values we hold.',
    sections: [
      {
        id: "system-out-of-control",
        heading: "A system that is out of control",
        paragraphs: [
          "Question from the movie: is it us controlling the system or the system controlling us?"
        ],
        image: {
          src: writingArticleAssets.socialDilemmaSystemOutOfControl,
          alt: "A dark control room scene representing surveillance and platform control."
        }
      },
      {
        id: "technology-ethics-dilemma",
        heading: "Profit-driven systems and collective humanity",
        paragraphs: [
          "A conspicuous dilemma arises between a profit-driven slash efficiency-oriented model and the pressing necessity to safeguard our collective humanity, both physically and mentally. Entrepreneurs, engineers, and of course, designers, as curators of innovative products, are often driven by a genuine intention to contribute to society and effect positive change. However, numerous studies reveal a certain naivety among individuals regarding the potential consequences stemming from their creations.",
          "What exacerbates the situation is that as the system grows and becomes more rooted in our daily lives, few individuals, including those who run the system, possess a clear understanding of how these products are designed and the consequential effects they have."
        ]
      },
      {
        id: "reconsider-humanity",
        heading: "Re-consider the relationship between technology and humanity",
        paragraphs: [
          'Inevitably, it is time to reconsider and reimagine the relationship between us and technology from an ethical standpoint. Lastly, quoted from "The Social Dilemma" — "It is imperative to shift the perspective of viewing humans as mere users to recognizing them as fellow human beings."'
        ]
      }
    ],
    actions: {
      back: { label: "← Back", href: "/writings" },
      next: { label: "Next →", href: "/writings/workflow-optimization-within-figma" }
    }
  }
] as const;
