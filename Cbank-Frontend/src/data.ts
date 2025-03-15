import IndonesiaMap from "./components/maps/Indonesia";
import SingaporeMap from "./components/maps/Singapore";
import DubaiMap from "./components/maps/Dubai";
import {
  BanknoteIcon,
  CreditCard,
  Building2,
  Calculator,
  Shield,
  Wallet,
  PiggyBank,
  LineChart,
} from "lucide-react";

export type TeamMember = {
  id: string;
  name: string;
  nim: string;
  role: string;
  email: string;
  instagram: string;
  linkedin: string;
  image: string;
  bio: string;
  skills: string[];
};

export type FAQItem = {
  question: string;
  answer: string;
};
export const newsData = [
  {
    id: 1,
    title: "Special 0% Interest Promotion for Car Loans",
    date: "2025-03-07",
    description:
      "Enjoy 0% interest on car loans until the end of this month. Terms & conditions apply.",
    image: "/images/promo-mobil.jpeg",
    category: "Promo",
    details: `
      This 0% interest program applies to specific car purchases with a loan term of up to 3 years.  
      **How to get this promotion:**  
      1. Apply for a car loan through the CBank app or at the nearest branch.  
      2. Choose a car that is included in the promo program.  
      3. Make a down payment according to the terms.  
      4. Enjoy 0% interest for the specified loan term.  
      
      *This promo is valid until the end of the month and is limited to the first customers who apply!*
    `,
  },
  {
    id: 2,
    title: "CBank Wins Best Digital Bank Award",
    date: "2025-03-05",
    description:
      "CBank has been awarded as the Best Digital Bank at the 2025 FinTech Awards.",
    image: "/images/bank-award.jpeg",
    category: "News",
    details: `
      CBank has been named **Best Digital Bank 2025** at the FinTech Awards for its outstanding digital banking innovations.  
      **Key factors behind CBank's victory:**  
      - AI-based banking security system.  
      - Fully-featured branchless banking services.  
      - Real-time transaction speed across all services.  
      
      *CBank continues to innovate to provide the best banking experience in the digital era!*
    `,
  },
  {
    id: 3,
    title: "50% Discount on Credit Card Transactions at Restaurants",
    date: "2025-03-01",
    description:
      "Get up to 50% off when dining at select restaurants with your CBank credit card.",
    image: "/images/diskon-resto.jpg",
    category: "Promo",
    details: `
      This promotion is available for CBank credit card holders dining at partner restaurants throughout March 2025.  
      **How to get the discount:**  
      1. Use your CBank credit card when paying at participating restaurants.  
      2. The 50% discount is automatically applied at checkout.  
      3. The promo is only valid for transactions of at least Rp 200,000.  
      
      *Enjoy great meals at a lower price with CBank!*
    `,
  },
];

export const brandLogos = [
  {
    name: "Amazon",
    image:
      "https://amazon-blogs-brightspot-lower.s3.amazonaws.com/about/00/92/0260aab44ee8a2faeafde18ee1da/amazon-logo-inverse.svg",
  },
  {
    name: "Shopee",
    image:
      "https://www.mendaftarkerja.com/wp-content/uploads/2024/09/IMG_2812.png",
  },
  {
    name: "Tokopedia",
    image: "https://www.julo.co.id/sites/default/files/2024-10/tokopedia.webp",
  },
  { name: "Lazada", image: "https://blog.alconost.com/hubfs/Lazada.svg" },
  {
    name: "Bukalapak",
    image:
      "https://hybrid.co.id/wp-content/uploads/2020/03/6d348add535c3c623309ebf5c1ee0c88_brand-architecture-bukalapak-primary@2x-1.png",
  },
  {
    name: "Blibli",
    image: "https://logowik.com/content/uploads/images/bliblicom1753.jpg",
  },
  {
    name: "Zalora",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt26xkMirIuF1VVGPpU0lCWc7XwpVz3uvixQ&s",
  },
  {
    name: "Traveloka",
    image:
      "https://interworks.com/wp-content/uploads/2023/02/Traveloka_Primary_Logo.webp",
  },
  {
    name: "Gojek",
    image:
      "https://www.pranataprinting.com/wp-content/uploads/2021/05/Sejarah-Singkat-Perusahaan-Gojek-Dan-Perkembangannya.jpg",
  },
  {
    name: "Grab",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsY2Mxbw-W5Fmx-ExXurEX-Z1_m4SjdN7Cgg&s",
  },
  {
    name: "Tiket.com",
    image:
      "https://www.linkaja.id/uploads/images/YW50aWtvZGVfXzE2OTY2NzU4MThfbG9nby10aWtldC1jb20tcG5n.png",
  },
];
export const offices = [
  {
    region: "Asia Pacific",
    city: "Jakarta",
    address: "Sudirman Central Business District, Tower 1",
    services: ["Retail Banking", "Corporate Finance", "Investment"],
    established: "2015",
    coordinates: { x: "400", y: "200" },
    mapComponent: IndonesiaMap,
  },
  {
    region: "Southeast Asia",
    city: "Singapore",
    address: "Marina Bay Financial Centre, Tower 3",
    services: ["Wealth Management", "Private Banking", "Trading"],
    established: "2018",
    coordinates: { x: "400", y: "200" },
    mapComponent: SingaporeMap,
  },
  {
    region: "Middle East",
    city: "Dubai",
    address: "Dubai International Financial Centre, Gate Village 8",
    services: ["Islamic Banking", "International Finance", "Treasury"],
    established: "2021",
    coordinates: { x: "480", y: "160" },
    mapComponent: DubaiMap,
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Asep Jamaludin",
    nim: "101012330125",
    role: "Frontend Developer",
    email: "asepjamaludinn24@gmail.com",
    instagram: "_jmldnnn",
    linkedin: "asep-jamaludin-061565294/",
    image: "/images/users/user1.JPG",
    bio: "Frontend developer with expertise in React and modern JavaScript frameworks. Loves creating responsive and accessible web applications.",
    skills: ["React", "JavaScript", "Tailwind CSS", "TypeScript"],
  },
  {
    id: "2",
    name: "Rheno Febrian",
    nim: "1301220188",
    role: "Backend Developer",
    email: "rfebrianc@gmail.com",
    instagram: "rhenofbrn",
    linkedin: "@rhenofbrn",
    image: "/images/users/user2.jpg",
    bio: "Backend developer specializing in Node.js and database design. Passionate about building scalable and secure APIs.",
    skills: ["Node.js", "Express", "MongoDB", "SQL"],
  },
  {
    id: "3",
    name: "Septia Retno",
    nim: "101012330230",
    role: "UI/UX Designer",
    email: "septiaretno01@gmail.com",
    instagram: "septiaartn",
    linkedin: "@septiaartn",
    image: "https://source.unsplash.com/random/200x200?face=3",
    bio: "UI/UX designer passionate about crafting user-friendly and visually appealing digital experiences.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
  },
  {
    id: "4",
    name: "Hilmy Baihaqi",
    nim: "101012340233",
    role: "Project Manager",
    email: "hilmybaihaqi08@gmail.com",
    instagram: "hilmybaihaqii_",
    linkedin: "@hilmybaihaqii_",
    image: "https://source.unsplash.com/random/200x200?face=4",
    bio: "Experienced project manager with a track record of delivering successful tech projects. Skilled in agile methodologies and team leadership.",
    skills: ["Agile", "Scrum", "JIRA", "Team Leadership"],
  },
];

export const faqData: FAQItem[] = [
  {
    question: "What is Cbank and how does it work?",
    answer:
      "Cbank is a modern digital banking platform that combines traditional banking services with cutting-edge technology. We provide secure, easy-to-use financial services including instant transfers, savings accounts, investment options, and comprehensive money management tools. Our platform is designed to make banking accessible and efficient for everyone.",
  },
  {
    question: "What are the main features of Cbank?",
    answer:
      "Cbank offers a wide range of features including real-time money transfers, bill payments, budgeting tools, savings goals, investment opportunities, and detailed transaction analytics. We also provide virtual cards, mobile payments, and integration with major payment platforms. All these features are accessible through our user-friendly mobile app and web platform.",
  },
  {
    question: "How secure is Cbank?",
    answer:
      "Security is our top priority at Cbank. We implement bank-grade encryption, multi-factor authentication, and continuous security monitoring. Our platform is compliant with all relevant banking regulations and we regularly undergo security audits. We also provide instant notifications for all transactions and allow users to freeze their cards instantly if needed.",
  },
  {
    question: "What are the fees associated with Cbank?",
    answer:
      "Cbank believes in transparent pricing. Our basic account is free and includes essential banking features. Premium accounts have a small monthly fee and provide additional benefits such as travel insurance, premium support, and higher transaction limits. All fees are clearly displayed in our app, and we never charge hidden fees.",
  },
  {
    question: "How can I contact Cbank support?",
    answer:
      "Our support team is available 24/7 through multiple channels. You can reach us via in-app chat, email, or phone. Premium users get priority support with dedicated account managers. We also have an extensive help center with guides and FAQs to help you find quick answers to common questions.",
  },
];

export type ExpertiseCard = {
  title: string;
  description: string;
  delay: number;
  type: string;
  image: string;
};

export type ServiceCard = {
  title: string;
  description: string;
  icon: any;
  tags: string[];
  image: string;
  details?: {
    longDescription: string;
    features: string[];
    benefits: string[];
    cta: string;
  };
};

export const expertiseCards = [
  {
    title: "20+",
    description: "Team of talented banking experts",
    delay: 0,
    type: "team",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "5+ Years",
    description: "Experience in transforming banking",
    delay: 0.2,
    type: "experience",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "60+",
    description: "Successfully completed projects",
    delay: 0.4,
    type: "projects",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
  },
  {
    title: "24/7",
    description: "Customer support availability",
    delay: 0.6,
    type: "support",
    image:
      "https://images.unsplash.com/photo-1556742212-5b321f3c261b?q=80&w=1470&auto=format&fit=crop",
  },
];

export const serviceCards: ServiceCard[] = [
  {
    title: "Personal Loans",
    description:
      "Flexible personal loans with competitive rates for all your needs, from home renovations to education expenses.",
    icon: BanknoteIcon,
    tags: ["Quick Approval", "Flexible Terms"],
    image:
      "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our personal loans are designed to provide you with the financial flexibility you need for life's important moments. Whether you're renovating your home, consolidating debt, or covering unexpected expenses, our competitive rates and flexible repayment terms make borrowing simple and affordable.",
      features: [
        "Loan amounts from $1,000 to $50,000",
        "Fixed interest rates starting at 5.99% APR",
        "Repayment terms from 12 to 60 months",
        "No prepayment penalties",
        "Same-day approval and fast funding",
      ],
      benefits: [
        "Consolidate high-interest debt into one affordable payment",
        "Fund home improvements to increase your property value",
        "Cover emergency expenses without depleting your savings",
        "Finance education or professional development opportunities",
      ],
      cta: "Apply for a Personal Loan",
    },
  },
  {
    title: "Business Credit",
    description:
      "Empower your business growth with our comprehensive credit solutions designed for businesses of all sizes.",
    icon: CreditCard,
    tags: ["Business", "Credit"],
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our business credit solutions are tailored to help your company thrive. From startup funding to expansion capital, we provide the financial tools you need to manage cash flow, make large purchases, and invest in growth opportunities with confidence.",
      features: [
        "Business credit lines up to $250,000",
        "Business credit cards with rewards programs",
        "Equipment financing with competitive terms",
        "Invoice factoring for improved cash flow",
        "SBA loan options with government backing",
      ],
      benefits: [
        "Separate business and personal expenses",
        "Build business credit history",
        "Manage seasonal cash flow fluctuations",
        "Take advantage of growth opportunities quickly",
        "Tax benefits on business interest payments",
      ],
      cta: "Explore Business Credit Options",
    },
  },
  {
    title: "Mortgage",
    description:
      "Make your dream home a reality with our competitive mortgage options and personalized guidance.",
    icon: Building2,
    tags: ["Real Estate", "Financing"],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1473&auto=format&fit=crop",
    details: {
      longDescription:
        "Our mortgage solutions help turn your homeownership dreams into reality. With competitive rates, flexible terms, and personalized guidance throughout the entire process, we make financing your home simple and straightforward.",
      features: [
        "Fixed and adjustable-rate mortgage options",
        "Conventional, FHA, VA, and USDA loans",
        "First-time homebuyer programs",
        "Refinancing options to lower your rate or access equity",
        "Digital application with streamlined documentation",
      ],
      benefits: [
        "Build equity and wealth through homeownership",
        "Potential tax benefits on mortgage interest",
        "Stabilize your housing costs with fixed-rate options",
        "Access to competitive interest rates",
        "Personalized guidance from application to closing",
      ],
      cta: "Start Your Mortgage Application",
    },
  },
  {
    title: "Investment",
    description:
      "Grow your wealth with our diverse investment products managed by experienced financial advisors.",
    icon: Calculator,
    tags: ["Wealth", "Planning"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
    details: {
      longDescription:
        "Our investment services are designed to help you build and preserve wealth over time. With personalized strategies based on your goals, risk tolerance, and timeline, our experienced advisors will help you navigate market fluctuations and work toward financial security.",
      features: [
        "Diversified portfolio management",
        "Retirement planning (401(k), IRA, Roth IRA)",
        "Education savings plans (529 plans)",
        "Tax-efficient investment strategies",
        "Regular portfolio reviews and rebalancing",
      ],
      benefits: [
        "Professional management of your investments",
        "Diversification to help manage risk",
        "Potential for long-term growth and income",
        "Tax-advantaged investment options",
        "Strategies aligned with your personal goals",
      ],
      cta: "Schedule a Consultation",
    },
  },
  {
    title: "Savings Accounts",
    description:
      "Build your financial foundation with our high-yield savings accounts that help your money grow faster.",
    icon: PiggyBank,
    tags: ["Savings", "High-Yield"],
    image:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our savings accounts are designed to help you reach your financial goals faster. With competitive interest rates, no monthly fees, and convenient digital access, saving money has never been easier or more rewarding.",
      features: [
        "High-yield interest rates up to 4.25% APY",
        "No minimum balance requirements",
        "No monthly maintenance fees",
        "FDIC insurance up to $250,000",
        "24/7 online and mobile access",
      ],
      benefits: [
        "Earn more interest than traditional savings accounts",
        "Separate funds for specific goals (emergency fund, vacation, etc.)",
        "Automatic savings options to build habits",
        "Quick access to funds when needed",
        "Peace of mind with FDIC insurance",
      ],
      cta: "Open a Savings Account",
    },
  },
  {
    title: "Retirement Planning",
    description:
      "Secure your future with our comprehensive retirement planning services tailored to your goals.",
    icon: LineChart,
    tags: ["Retirement", "Planning"],
    image:
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our retirement planning services help you prepare for a financially secure future. We'll work with you to create a personalized strategy that considers your current situation, future goals, and the lifestyle you envision for your retirement years.",
      features: [
        "Traditional and Roth IRA options",
        "401(k) rollover assistance",
        "Pension planning and optimization",
        "Social Security claiming strategies",
        "Required Minimum Distribution planning",
      ],
      benefits: [
        "Tax-advantaged growth potential",
        "Personalized retirement income strategies",
        "Protection against inflation and market volatility",
        "Legacy and estate planning integration",
        "Regular reviews to keep your plan on track",
      ],
      cta: "Start Planning Your Retirement",
    },
  },
  {
    title: "Insurance Solutions",
    description:
      "Protect what matters most with our comprehensive insurance products for life, health, and property.",
    icon: Shield,
    tags: ["Protection", "Security"],
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our insurance solutions provide protection and peace of mind for you, your loved ones, and your assets. With customizable coverage options and competitive rates, we help ensure you're prepared for life's unexpected moments.",
      features: [
        "Life insurance (term, whole, and universal)",
        "Health insurance plans for individuals and families",
        "Property and casualty insurance",
        "Long-term care insurance",
        "Disability income protection",
      ],
      benefits: [
        "Financial protection for your loved ones",
        "Coverage for medical expenses and emergencies",
        "Protection for your home and valuable assets",
        "Income replacement if you're unable to work",
        "Peace of mind knowing you're prepared for the unexpected",
      ],
      cta: "Get Insurance Coverage",
    },
  },
  {
    title: "Digital Banking",
    description:
      "Experience the convenience of banking anytime, anywhere with our secure and user-friendly digital platform.",
    icon: Wallet,
    tags: ["Mobile", "Convenient"],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1470&auto=format&fit=crop",
    details: {
      longDescription:
        "Our digital banking platform puts financial management at your fingertips. With intuitive tools, robust security features, and 24/7 access, managing your money has never been more convenient or secure.",
      features: [
        "Mobile and online banking platforms",
        "Mobile check deposit",
        "Bill pay and person-to-person transfers",
        "Real-time account alerts and notifications",
        "Budgeting and financial tracking tools",
      ],
      benefits: [
        "Bank anytime, anywhere from your device",
        "Save time with digital transactions",
        "Better visibility into your financial picture",
        "Enhanced security with biometric authentication",
        "Paperless statements and documents",
      ],
      cta: "Enroll in Digital Banking",
    },
  },
];
