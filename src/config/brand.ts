// ============================================================
// BRAND CONFIGURATION — Local Tow
// ============================================================

export type IntensityMode = "subtle" | "immersive";
export type HeroVariant = "centered" | "split" | "fullscreen" | "parallax";

export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; description: string }[];
}

export interface SectionConfig {
  id: string;
  type: "hero" | "features" | "cta" | "testimonials" | "stats" | "gallery" | "contact" | "custom";
  enabled: boolean;
}

export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contactEmail: string;
  contactPhone: string;
  launchMarket: string;
  founded: number;
  intensity: IntensityMode;
  heroVariant: HeroVariant;
  darkMode: "dark-only" | "light-only" | "toggle";
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    surface: string;
    muted: string;
    mutedForeground: string;
  };
  nav: NavLink[];
  sections: SectionConfig[];
  seo: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  kmp: boolean;
}

export const brand: BrandConfig = {
  name: "Local Tow",
  tagline: "Community Towing. Fair Prices.",
  description:
    "Hyper-local towing marketplace connecting vehicle owners with nearby tow operators. You set the price. Your neighbors respond. Stop getting gouged.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "support@localtow.com",
  contactPhone: "(312) 555-8TOW",
  launchMarket: "Chicago, IL",
  founded: 2024,

  intensity: "immersive",
  heroVariant: "fullscreen",
  darkMode: "toggle",

  colors: {
    primary: "#FF6700",
    primaryForeground: "#FFFFFF",
    accent: "#003366",
    accentForeground: "#FFFFFF",
    background: "#FFFFFF",
    foreground: "#111827",
    surface: "#F9FAFB",
    muted: "#F3F4F6",
    mutedForeground: "#6B7280",
  },

  nav: [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/customer/request/new", label: "Get a Tow" },
  ],

  sections: [
    { id: "hero", type: "hero", enabled: true },
    { id: "how-it-works", type: "features", enabled: true },
    { id: "live-requests", type: "custom", enabled: true },
    { id: "why-local-tow", type: "features", enabled: true },
    { id: "operators-cta", type: "cta", enabled: true },
    { id: "service-area", type: "custom", enabled: true },
  ],

  seo: {
    title: "Local Tow | Community Towing at Fair Prices",
    titleTemplate: "%s | Local Tow",
    description:
      "Stop paying $200+ for a simple tow. Connect with local operators who'll move your car for $40-60. Launching in Chicago's 77 community areas.",
    keywords: [
      "towing service",
      "local tow",
      "cheap towing",
      "Chicago towing",
      "community towing",
      "fair price towing",
      "tow truck near me",
      "affordable towing",
    ],
  },

  social: {},
  kmp: false,
};

// ============================================================
// FEE STRUCTURE (all in cents)
// ============================================================

export const fees = {
  platformFeePercent: 10,
  platformFeeCap: 500, // $5.00 in cents
  minPrice: 2000, // $20 minimum
  maxPrice: 50000, // $500 maximum
  currency: "USD",
};

// ============================================================
// PRICE GUIDANCE BY DISTANCE TIER
// ============================================================

export const priceGuidance = {
  short: { label: "Under 2 miles", min: 3000, suggested: 4000, max: 5000 },
  medium: { label: "2-5 miles", min: 4000, suggested: 5500, max: 7500 },
  long: { label: "5-10 miles", min: 5000, suggested: 7000, max: 10000 },
  extended: { label: "Over 10 miles", min: 7500, suggested: 10000, max: 20000 },
} as const;

// ============================================================
// URGENCY TIERS
// ============================================================

export const urgencyTiers = {
  asap: { label: "ASAP", description: "Need help right now", multiplier: 1.25, color: "#ef4444", icon: "zap" },
  today: { label: "Today", description: "Within the next few hours", multiplier: 1.0, color: "#f59e0b", icon: "clock" },
  scheduled: { label: "Scheduled", description: "Pick a specific date and time", multiplier: 0.9, color: "#3b82f6", icon: "calendar" },
} as const;

// ============================================================
// JOB STATUS STEPS
// ============================================================

export const jobStatusSteps = [
  { id: "pending", label: "Awaiting Offers", description: "Providers are reviewing your request", icon: "clock", color: "#f59e0b" },
  { id: "accepted", label: "Offer Accepted", description: "A provider has accepted your job", icon: "check", color: "#22c55e" },
  { id: "en_route", label: "En Route", description: "Provider is on the way", icon: "truck", color: "#3b82f6" },
  { id: "at_pickup", label: "At Pickup", description: "Provider has arrived at your vehicle", icon: "map-pin", color: "#8b5cf6" },
  { id: "loading", label: "Loading Vehicle", description: "Your vehicle is being loaded", icon: "loader", color: "#06b6d4" },
  { id: "transporting", label: "In Transit", description: "Your vehicle is being transported", icon: "navigation", color: "#3b82f6" },
  { id: "at_dropoff", label: "At Dropoff", description: "Provider has arrived at the destination", icon: "flag", color: "#8b5cf6" },
  { id: "completed", label: "Completed", description: "Your vehicle has been delivered", icon: "check-circle", color: "#22c55e" },
] as const;

// ============================================================
// VEHICLE CONDITIONS
// ============================================================

export const vehicleConditions = [
  { value: "runs", label: "Runs & Drives" },
  { value: "runs_no_drive", label: "Runs, Doesn't Drive" },
  { value: "no_run", label: "Doesn't Run" },
  { value: "damaged", label: "Accident/Damaged" },
] as const;

// ============================================================
// EQUIPMENT TYPES
// ============================================================

export const equipmentTypes = [
  { value: "flatbed", label: "Flatbed" },
  { value: "wheel_lift", label: "Wheel-Lift" },
  { value: "dolly", label: "Dolly/Tow Dolly" },
  { value: "integrated", label: "Integrated (Heavy Duty)" },
] as const;

// ============================================================
// COMPANY STATS
// ============================================================

export const stats = [
  { label: "Community Areas", value: 77, suffix: "" },
  { label: "Avg Savings", value: 60, suffix: "%" },
  { label: "Avg Response", value: 8, suffix: " min" },
  { label: "Max Platform Fee", value: 5, prefix: "$", suffix: "" },
];

// ============================================================
// CHICAGO COMMUNITY AREAS (77 total)
// ============================================================

export const chicagoCommunityAreas = [
  { number: 1, name: "Rogers Park", zipCodes: ["60626", "60645"] },
  { number: 2, name: "West Ridge", zipCodes: ["60645", "60659"] },
  { number: 3, name: "Uptown", zipCodes: ["60640"] },
  { number: 4, name: "Lincoln Square", zipCodes: ["60625"] },
  { number: 5, name: "North Center", zipCodes: ["60613", "60618"] },
  { number: 6, name: "Lake View", zipCodes: ["60613", "60614", "60657"] },
  { number: 7, name: "Lincoln Park", zipCodes: ["60614"] },
  { number: 8, name: "Near North Side", zipCodes: ["60610", "60611", "60654"] },
  { number: 9, name: "Edison Park", zipCodes: ["60631"] },
  { number: 10, name: "Norwood Park", zipCodes: ["60631", "60656", "60706"] },
  { number: 11, name: "Jefferson Park", zipCodes: ["60630", "60646"] },
  { number: 12, name: "Forest Glen", zipCodes: ["60630", "60646"] },
  { number: 13, name: "North Park", zipCodes: ["60625", "60659"] },
  { number: 14, name: "Albany Park", zipCodes: ["60625", "60618"] },
  { number: 15, name: "Portage Park", zipCodes: ["60634", "60641"] },
  { number: 16, name: "Irving Park", zipCodes: ["60618", "60641"] },
  { number: 17, name: "Dunning", zipCodes: ["60634", "60706"] },
  { number: 18, name: "Montclare", zipCodes: ["60634", "60707"] },
  { number: 19, name: "Belmont Cragin", zipCodes: ["60639", "60641"] },
  { number: 20, name: "Hermosa", zipCodes: ["60639", "60647"] },
  { number: 21, name: "Avondale", zipCodes: ["60618", "60647"] },
  { number: 22, name: "Logan Square", zipCodes: ["60622", "60647"] },
  { number: 23, name: "Humboldt Park", zipCodes: ["60622", "60624", "60651"] },
  { number: 24, name: "West Town", zipCodes: ["60612", "60622", "60642"] },
  { number: 25, name: "Austin", zipCodes: ["60644", "60651"] },
  { number: 26, name: "West Garfield Park", zipCodes: ["60624"] },
  { number: 27, name: "East Garfield Park", zipCodes: ["60612", "60624"] },
  { number: 28, name: "Near West Side", zipCodes: ["60607", "60612", "60661"] },
  { number: 29, name: "North Lawndale", zipCodes: ["60623", "60624"] },
  { number: 30, name: "South Lawndale", zipCodes: ["60623"] },
  { number: 31, name: "Lower West Side", zipCodes: ["60608", "60616"] },
  { number: 32, name: "Loop", zipCodes: ["60601", "60602", "60603", "60604", "60605", "60606", "60607"] },
  { number: 33, name: "Near South Side", zipCodes: ["60605", "60616"] },
  { number: 34, name: "Armour Square", zipCodes: ["60616"] },
  { number: 35, name: "Douglas", zipCodes: ["60616"] },
  { number: 36, name: "Oakland", zipCodes: ["60615", "60616"] },
  { number: 37, name: "Fuller Park", zipCodes: ["60609", "60621"] },
  { number: 38, name: "Grand Boulevard", zipCodes: ["60615", "60653"] },
  { number: 39, name: "Kenwood", zipCodes: ["60615", "60637"] },
  { number: 40, name: "Washington Park", zipCodes: ["60615", "60637", "60653"] },
  { number: 41, name: "Hyde Park", zipCodes: ["60615", "60637"] },
  { number: 42, name: "Woodlawn", zipCodes: ["60615", "60637"] },
  { number: 43, name: "South Shore", zipCodes: ["60617", "60649"] },
  { number: 44, name: "Chatham", zipCodes: ["60619", "60637"] },
  { number: 45, name: "Avalon Park", zipCodes: ["60619"] },
  { number: 46, name: "South Chicago", zipCodes: ["60617"] },
  { number: 47, name: "Burnside", zipCodes: ["60619", "60649"] },
  { number: 48, name: "Calumet Heights", zipCodes: ["60617", "60619"] },
  { number: 49, name: "Roseland", zipCodes: ["60628"] },
  { number: 50, name: "Pullman", zipCodes: ["60628"] },
  { number: 51, name: "South Deering", zipCodes: ["60617", "60633"] },
  { number: 52, name: "East Side", zipCodes: ["60617"] },
  { number: 53, name: "West Pullman", zipCodes: ["60628", "60643"] },
  { number: 54, name: "Riverdale", zipCodes: ["60627", "60628"] },
  { number: 55, name: "Hegewisch", zipCodes: ["60633"] },
  { number: 56, name: "Garfield Ridge", zipCodes: ["60629", "60638"] },
  { number: 57, name: "Archer Heights", zipCodes: ["60632", "60638"] },
  { number: 58, name: "Brighton Park", zipCodes: ["60609", "60632"] },
  { number: 59, name: "McKinley Park", zipCodes: ["60608", "60609"] },
  { number: 60, name: "Bridgeport", zipCodes: ["60608", "60609", "60616"] },
  { number: 61, name: "New City", zipCodes: ["60609", "60621", "60636"] },
  { number: 62, name: "West Elsdon", zipCodes: ["60629", "60632"] },
  { number: 63, name: "Gage Park", zipCodes: ["60629", "60632"] },
  { number: 64, name: "Clearing", zipCodes: ["60638"] },
  { number: 65, name: "West Lawn", zipCodes: ["60629", "60652"] },
  { number: 66, name: "Chicago Lawn", zipCodes: ["60629", "60636", "60652"] },
  { number: 67, name: "West Englewood", zipCodes: ["60621", "60636"] },
  { number: 68, name: "Englewood", zipCodes: ["60621", "60636"] },
  { number: 69, name: "Greater Grand Crossing", zipCodes: ["60619", "60621", "60637"] },
  { number: 70, name: "Ashburn", zipCodes: ["60620", "60652"] },
  { number: 71, name: "Auburn Gresham", zipCodes: ["60620", "60643"] },
  { number: 72, name: "Beverly", zipCodes: ["60643"] },
  { number: 73, name: "Washington Heights", zipCodes: ["60620", "60643"] },
  { number: 74, name: "Mount Greenwood", zipCodes: ["60655"] },
  { number: 75, name: "Morgan Park", zipCodes: ["60643", "60655"] },
  { number: 76, name: "O'Hare", zipCodes: ["60666", "60706"] },
  { number: 77, name: "Edgewater", zipCodes: ["60640", "60660"] },
];
