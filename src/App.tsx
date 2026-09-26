import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "trip" | "checkout" | "refund" | "rebook";

interface Flight {
  id: string; airline: string; code: string; flightNo: string;
  from: string; to: string; dep: string; arr: string;
  duration: string; price: number; stops: string; class: string;
}
interface Hotel {
  id: string; name: string; chain: string; rating: number;
  reviewCount: number; reviewScore: string; location: string;
  price: number; img: string; amenities: string[]; tag: string;
}
interface Destination {
  id: string; name: string; state: string; tagline: string;
  heroImg: string; galleryImgs: string[];
  description: string; culture: string;
  attractions: { icon: string; name: string; desc: string }[];
  bestTime: { period: string; why: string };
  festivals: { name: string; month: string; desc: string }[];
  iataCode: string; color: string; gradient: string;
  travelTime: string;
}

// ─── Destination Data ─────────────────────────────────────────────────────────

const DESTINATIONS: Record<string, Destination> = {
  goa: {
    id: "goa", name: "Goa", state: "Goa", iataCode: "GOI",
    tagline: "Sun, Sand & Spice",
    color: "#0891B2", gradient: "from-cyan-600 to-teal-700",
    travelTime: "2h 10m from Delhi",
    heroImg: "https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1590393275627-0c48482c60e3?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1642516864726-a243f416fc00?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Goa, India's smallest state, is a jewel on the western coast famed for its golden beaches, Portuguese colonial heritage, and vibrant nightlife. Once a 450-year-old Portuguese colony, Goa's unique blend of Indian and Iberian culture is visible in its whitewashed Baroque churches, spice-laden Goan curry, and feni-soaked festivals.",
    culture: "The culture is a rich mosaic of Hindu and Catholic traditions. Local Konkani music, the Dekhnni folk dance, and annual Carnival celebrations draw visitors year-round. Goa's cuisine — Prawn Balchão, Fish Ambot-Tik, and bebinca dessert — reflects its coastal abundance and Portuguese influence.",
    attractions: [
      { icon: "🏖️", name: "Calangute & Baga Beach", desc: "India's most famous stretches of golden sand, bustling with watersports, shacks, and sunset vibes." },
      { icon: "⛪", name: "Basilica of Bom Jesus", desc: "UNESCO World Heritage Site housing the tomb of St. Francis Xavier, a jewel of Baroque architecture built in 1605." },
      { icon: "🏰", name: "Fort Aguada", desc: "A 17th-century Portuguese fort perched on the Arabian Sea, offering panoramic views of North Goa's coastline." },
      { icon: "🌿", name: "Dudhsagar Waterfalls", desc: "One of India's tallest waterfalls at 310m, accessible by jeep through dense forest in Mollem National Park." },
      { icon: "🕌", name: "Old Goa Churches", desc: "A cluster of 16th–17th century churches — all UNESCO listed, including Se Cathedral and Church of St. Francis." },
    ],
    bestTime: { period: "November – February", why: "Post-monsoon winter months bring cool, dry weather (20–30°C), calm seas ideal for swimming, and peak festival season." },
    festivals: [
      { name: "Goa Carnival", month: "February", desc: "A 4-day pre-Lent extravaganza with floats, music, and street revelry echoing 500 years of Portuguese heritage." },
      { name: "Shigmo Festival", month: "March", desc: "A vibrant Hindu spring festival featuring folk dances, decorated floats, and traditional Goan music on city streets." },
      { name: "Sunburn Festival", month: "December", desc: "Asia's biggest electronic dance music festival held on Vagator beach, attracting 60,000+ music lovers annually." },
    ],
  },
  jaipur: {
    id: "jaipur", name: "Jaipur", state: "Rajasthan", iataCode: "JAI",
    tagline: "The Pink City of Royals",
    color: "#BE185D", gradient: "from-pink-700 to-rose-800",
    travelTime: "1h 10m from Delhi",
    heroImg: "https://images.unsplash.com/photo-1662717400986-d11802a9fca7?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1673807095855-7c6e499c2cd5?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1705306431599-324df3fbb8c2?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India's first planned city and the capital of the royal state of Rajasthan. Its terracotta-pink buildings — washed pink in 1876 to welcome Prince Albert — earned it the moniker 'The Pink City'. A UNESCO World Heritage City since 2019.",
    culture: "Rajput valor and Mughal grace fuse in Jaipur's culture. The city is renowned for block-printed textiles, blue pottery, kundan jewelry, and hand-knotted carpets. Classical Kathak dance, puppet shows, and folk music fill its palaces. The famous Jaipur Literature Festival — the world's largest free literary gathering — is held here every January.",
    attractions: [
      { icon: "🏰", name: "Amber Fort", desc: "A majestic 16th-century hilltop fort-palace with ornate mirrored Sheesh Mahal, elephant rides and evening light shows." },
      { icon: "🏯", name: "Hawa Mahal", desc: "The iconic 'Palace of Winds' (1799) — a five-storey honeycomb façade with 953 latticed windows for royal ladies to observe street processions." },
      { icon: "🌆", name: "City Palace", desc: "A sprawling complex of palaces, courtyards and museums at the heart of the walled city, partly occupied by royal descendants." },
      { icon: "🔭", name: "Jantar Mantar", desc: "UNESCO-listed 18th-century astronomical observatory with 19 massive geometric instruments — the largest stone sundial in the world." },
      { icon: "🛍️", name: "Johari Bazaar", desc: "Vibrant markets selling Rajasthani gems, silver jewelry, lac bangles, and colourful textiles in the heart of the old city." },
    ],
    bestTime: { period: "October – March", why: "Cool desert winters (8–25°C) ideal for sightseeing. Elephant Festival in March and Jaipur Literature Festival in January add cultural depth." },
    festivals: [
      { name: "Jaipur Literature Festival", month: "January", desc: "The world's largest free literary gathering, hosting 500+ authors, poets, and thinkers from across the globe at Diggi Palace." },
      { name: "Teej Festival", month: "July–August", desc: "Rajasthani women celebrate monsoon onset with swings, songs, and processions of the goddess Parvati through the Pink City." },
      { name: "Elephant Festival", month: "March", desc: "Holi eve spectacle of decorated elephants, polo matches, and tug-of-war — a breathtaking pageant of Rajput culture." },
    ],
  },
  ladakh: {
    id: "ladakh", name: "Ladakh", state: "Ladakh (UT)", iataCode: "IXL",
    tagline: "Land of High Passes",
    color: "#0369A1", gradient: "from-sky-700 to-blue-900",
    travelTime: "1h 20m from Delhi",
    heroImg: "https://images.unsplash.com/photo-1558187424-f786111643b0?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1643368214091-6af1a029aee0?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1621114410742-f886ab91e6f4?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Ladakh, the 'Land of High Passes', sits at an average altitude of 3,500m in the Himalayas and the Karakoram range. A Union Territory since 2019, it is one of the world's highest inhabited plateaux — a moonscape of barren mountains, emerald lakes, and ancient Buddhist monasteries that seem to float above the clouds.",
    culture: "Deeply Tibetan-Buddhist in culture, Ladakh's monastery festivals fill the valleys with masked cham dances, giant thangka paintings, and the sound of Tibetan horns. The Ladakhi people are known for their warmth, Julley greeting, and traditional Goncha robes. Cuisine centres on tsampa, thukpa noodle soup, and butter tea.",
    attractions: [
      { icon: "🏔️", name: "Pangong Tso Lake", desc: "A stunning 134 km high-altitude lake (4,350m) straddling the India-China border — waters shift from blue to green to red through the day." },
      { icon: "🛕", name: "Hemis Monastery", desc: "Ladakh's largest and wealthiest monastery, home to a dazzling annual festival and India's largest thangka (sacred textile painting)." },
      { icon: "🏍️", name: "Khardung La Pass", desc: "One of the world's highest motorable passes at 5,359m — a bucket-list ride on the Leh–Nubra Valley highway." },
      { icon: "🌊", name: "Nubra Valley", desc: "A surreal cold desert valley with Bactrian double-humped camels, sand dunes, apple orchards, and views of the Siachen glacier." },
      { icon: "🧘", name: "Magnetic Hill", desc: "Optical illusion road where cars appear to roll uphill, paired with a serene Sikh shrine carved from a boulder nearby." },
    ],
    bestTime: { period: "June – September", why: "Summer months (15–30°C in the day) keep mountain passes open. July–August see the iconic Hemis and Ladakh festivals." },
    festivals: [
      { name: "Hemis Festival", month: "June–July", desc: "Ladakh's most celebrated festival — two-day masked cham dances at Hemis Monastery, commemorating the birth of Guru Padmasambhava." },
      { name: "Losar (Ladakhi New Year)", month: "December–January", desc: "Tibetan Buddhist New Year with monastery prayers, mask dances, archery tournaments, and ceremonial butter lamp lighting." },
      { name: "Sindhu Darshan", month: "June", desc: "A 3-day celebration on the banks of the Indus river — folk dance troupes from every state perform at this spectacular gathering." },
    ],
  },
  kerala: {
    id: "kerala", name: "Kerala", state: "Kerala", iataCode: "COK",
    tagline: "God's Own Country",
    color: "#15803D", gradient: "from-green-700 to-emerald-900",
    travelTime: "3h 30m from Delhi",
    heroImg: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1609828913552-f9138ed9e42d?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1661174607003-d9d36388c916?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Kerala, 'God's Own Country', is India's southwesternmost state, draped in dense rainforests, coconut palms, and a labyrinth of backwater canals stretching over 900 km. Home to Ayurveda's birthplace and the classical dance form Kathakali, Kerala blends natural splendour with rich cultural heritage.",
    culture: "Kerala's culture is deeply matrilineal and literary — with India's highest literacy rate (96.2%). Kathakali, Mohiniyattam, and Theyyam are living art forms. The state is the origin of Ayurvedic medicine; Sadya (a 24-dish banana-leaf feast) is a UNESCO Intangible Heritage listed tradition.",
    attractions: [
      { icon: "🛶", name: "Alleppey Backwaters", desc: "A 900 km network of lagoons, canals, and rice paddies navigated by traditional rice-boat houseboats — among India's most iconic experiences." },
      { icon: "🦋", name: "Munnar Tea Gardens", desc: "Misty high-altitude plantations at 1,600m covered in a carpet of green tea, with colonial-era bungalows and waterfalls hidden in folds." },
      { icon: "🐘", name: "Periyar Wildlife Sanctuary", desc: "Tiger Reserve and elephant corridor — boat safaris through the reservoir spot wild elephants, bison, and otters." },
      { icon: "🌴", name: "Varkala Cliff Beach", desc: "A dramatic red laterite cliff rising above the Arabian Sea with natural spring water, yoga retreats, and a sacred Vishnu temple." },
      { icon: "🛕", name: "Padmanabhaswamy Temple", desc: "An 8th-century Vishnu temple in Thiruvananthapuram — vaults opened in 2011 revealed ₹1.2 lakh crore worth of treasures." },
    ],
    bestTime: { period: "October – March", why: "Post-monsoon months bring lush, washed landscapes (25–32°C), calm backwaters, and festival season." },
    festivals: [
      { name: "Onam", month: "August–September", desc: "Kerala's harvest festival — 10 days of pookkalam floral carpets, snake-boat races, and Sadya feasts across the state." },
      { name: "Thrissur Pooram", month: "April–May", desc: "The 'festival of festivals' — 30 decorated elephants, synchronized percussion ensembles, and fireworks at Vadakkumnathan Temple." },
      { name: "Theyyam", month: "November–March", desc: "Ancient ritual art form where performers transform into 400 deities through elaborate costumes and trance — a living myth." },
    ],
  },
  varanasi: {
    id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", iataCode: "VNS",
    tagline: "City of Light & Eternity",
    color: "#B45309", gradient: "from-amber-700 to-orange-900",
    travelTime: "1h 15m from Delhi",
    heroImg: "https://images.unsplash.com/photo-1762513907666-29901bf5899a?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1780287767347-0852d267851b?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1736568763844-2063f7761462?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Varanasi — also called Kashi or Benares — is one of the world's oldest continuously inhabited cities, with over 3,000 years of unbroken history. Sitting on the sacred banks of the River Ganges, it is Hinduism's holiest city: the place where Lord Shiva is said to have stood and where death itself brings liberation (moksha).",
    culture: "Varanasi is the crucible of Indian civilisation — where music, philosophy, silk weaving, and spirituality have co-existed for millennia. The Banaras Gharana of classical music flourished here; Pt. Ravi Shankar and Bismillah Khan were sons of this soil. Banarasi silk sarees, woven in narrow alleys, are prized worldwide for their gold and silver zari work.",
    attractions: [
      { icon: "🌅", name: "Dashashwamedh Ghat", desc: "Varanasi's main and most spectacular ghat — scene of the nightly Ganga Aarti, a choreographed fire ceremony with 200+ priests." },
      { icon: "🛕", name: "Kashi Vishwanath Temple", desc: "One of the 12 sacred Jyotirlingas of Shiva — this golden-spired temple draws over 3 lakh pilgrims daily." },
      { icon: "🚣", name: "Sunrise Boat Ride", desc: "A dawn row along the 84 ghats — passing cremation fires, bathing pilgrims, and ancient temples reflected in the amber Ganges." },
      { icon: "🏫", name: "Sarnath", desc: "10 km from Varanasi, the deer park where the Buddha delivered his first sermon in 528 BC — Dhamek Stupa and Ashoka's Lion Capital are here." },
      { icon: "🎭", name: "Ramnagar Fort", desc: "A 17th-century sandstone fort on the eastern Ganges bank — its museum holds royal palanquins, antique clocks, and vintage cars." },
    ],
    bestTime: { period: "October – March", why: "Cool and clear weather (8–25°C) perfect for ghat walks and boat rides. Dev Deepawali (Nov) and Maha Shivaratri (Feb–Mar) are unmissable." },
    festivals: [
      { name: "Dev Deepawali", month: "November", desc: "Kartik Purnima night — all 84 ghats illuminated by over a million clay lamps along the Ganges. A celestial sight." },
      { name: "Ganga Mahotsav", month: "November", desc: "5-day classical music and dance festival on the ghats showcasing the finest artists of Hindustani classical tradition." },
      { name: "Maha Shivaratri", month: "February–March", desc: "Kashi Vishwanath Temple sees over 5 lakh devotees, processions, and all-night chanting in the narrow lanes of the old city." },
    ],
  },
  mumbai: {
    id: "mumbai", name: "Mumbai", state: "Maharashtra", iataCode: "BOM",
    tagline: "Maximum City, Maximum Life",
    color: "#7C3AED", gradient: "from-violet-700 to-purple-900",
    travelTime: "2h from Delhi",
    heroImg: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&h=500&fit=crop&auto=format",
    galleryImgs: [
      "https://images.unsplash.com/photo-1569758267239-d08deb78bb1a?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1598434192043-71111c1b3f41?w=400&h=260&fit=crop&auto=format",
    ],
    description: "Mumbai — the 'Maximum City' — is India's financial, commercial, and entertainment capital. Built across seven islands merged into a peninsula, this city of 21 million is simultaneously the home of Bollywood, the BSE (Asia's oldest stock exchange), and Dharavi, one of Asia's largest urban villages.",
    culture: "Mumbai's culture is a perpetual festival of contrasts — colonial Gothic and Art Deco architecture beside glass towers, street dabbawalas beside Michelin-starred restaurants, Ganpati processions and Pride parades on the same streets. The city gave India Bollywood, the vada pav, and the spirit of reinvention.",
    attractions: [
      { icon: "🏛️", name: "Gateway of India", desc: "The city's defining monument — a 26m basalt arch built in 1924, now the meeting point of a million stories on the Harbour." },
      { icon: "🎬", name: "Film City (Goregaon)", desc: "Asia's largest film production complex spanning 520 acres, producing 40% of India's films — guided tours available." },
      { icon: "🏝️", name: "Elephanta Caves", desc: "UNESCO World Heritage caves on Elephanta Island (1-hour ferry) — 6th–8th century rock-cut Shiva temples with a majestic Trimurti." },
      { icon: "🌊", name: "Marine Drive", desc: "A 3.6 km arc of art deco apartments hugging the Arabian Sea — 'The Queen's Necklace' glitters with streetlights at night." },
      { icon: "🏘️", name: "Chor Bazaar & Dharavi", desc: "India's most famous antique market, or join a community-led Dharavi tour to see the world's most enterprising neighbourhood." },
    ],
    bestTime: { period: "November – February", why: "Pleasant dry weather (18–32°C) ideal for sightseeing, Elephanta ferry rides, and outdoor dining." },
    festivals: [
      { name: "Ganesh Chaturthi", month: "August–September", desc: "Mumbai's defining festival — 11 days of 1.5 lakh Ganpati idols, culminating in a midnight immersion procession of millions into the sea." },
      { name: "Kala Ghoda Art Festival", month: "February", desc: "Asia's largest multi-arts festival — 9 days of street art, contemporary exhibitions, music, dance, and film screenings." },
      { name: "Mumbai Marathon", month: "January", desc: "Asia's most prestigious marathon — 45,000 runners from 80 countries run through the city's iconic landmarks at sunrise." },
    ],
  },
};

const DEST_LIST = Object.values(DESTINATIONS);

// ─── Airline brand config ─────────────────────────────────────────────────────

const AIRLINE_BRAND: Record<string, { bg: string; text: string; full: string }> = {
  "6E": { bg: "#4B0082", text: "#FFFFFF", full: "IndiGo" },
  AI:   { bg: "#C8102E", text: "#FFFFFF", full: "Air India" },
  UK:   { bg: "#2D1B69", text: "#FFD700", full: "Vistara" },
  SG:   { bg: "#E8150A", text: "#FFFFFF", full: "SpiceJet" },
  G8:   { bg: "#0A3D8C", text: "#FFFFFF", full: "Go First" },
  QP:   { bg: "#006B4E", text: "#FFD700", full: "Akasa Air" },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const BASE_FLIGHTS: Omit<Flight, "from" | "to">[] = [
  { id: "f1", airline: "IndiGo", code: "6E", flightNo: "6E-204", dep: "06:15", arr: "08:25", duration: "2h 10m", price: 5849, stops: "Non-stop", class: "Economy" },
  { id: "f2", airline: "Air India", code: "AI", flightNo: "AI-665", dep: "09:45", arr: "12:05", duration: "2h 20m", price: 7250, stops: "Non-stop", class: "Economy" },
  { id: "f3", airline: "Vistara", code: "UK", flightNo: "UK-995", dep: "14:50", arr: "17:10", duration: "2h 20m", price: 8490, stops: "Non-stop", class: "Economy" },
  { id: "f4", airline: "SpiceJet", code: "SG", flightNo: "SG-8169", dep: "18:30", arr: "20:55", duration: "2h 25m", price: 4999, stops: "Non-stop", class: "Economy" },
];

const ALT_FLIGHTS: Flight[] = [
  { id: "a1", airline: "Air India", code: "AI", flightNo: "AI-677", from: "DEL", to: "BOM", dep: "10:30", arr: "12:55", duration: "2h 25m", price: 7450, stops: "Non-stop", class: "Economy" },
  { id: "a2", airline: "Vistara", code: "UK", flightNo: "UK-991", from: "DEL", to: "BOM", dep: "13:15", arr: "15:35", duration: "2h 20m", price: 8200, stops: "Non-stop", class: "Economy" },
  { id: "a3", airline: "Go First", code: "G8", flightNo: "G8-401", from: "DEL", to: "BOM", dep: "17:00", arr: "19:30", duration: "2h 30m", price: 4650, stops: "Non-stop", class: "Economy" },
];

const HOTELS: Hotel[] = [
  { id: "h1", name: "The Oberoi", chain: "Oberoi Hotels & Resorts", rating: 5, reviewCount: 2841, reviewScore: "Exceptional", location: "Nariman Point, Mumbai", price: 22500, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&h=300&fit=crop&auto=format", amenities: ["Infinity Pool", "Spa", "Sea View", "Butler Service"], tag: "Luxury Pick" },
  { id: "h2", name: "Taj Mahal Palace", chain: "Taj Hotels", rating: 5, reviewCount: 5320, reviewScore: "Outstanding", location: "Apollo Bunder, Mumbai", price: 18900, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=480&h=300&fit=crop&auto=format", amenities: ["Heritage Wing", "Fine Dining", "Harbour View", "Concierge"], tag: "Most Iconic" },
  { id: "h3", name: "ITC Grand Central", chain: "ITC Hotels", rating: 4, reviewCount: 3104, reviewScore: "Excellent", location: "Parel, Mumbai", price: 9800, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=480&h=300&fit=crop&auto=format", amenities: ["Rooftop Pool", "Club Lounge", "Airport Transfer", "Gym"], tag: "Best Value" },
  { id: "h4", name: "JW Marriott Juhu", chain: "Marriott International", rating: 5, reviewCount: 4102, reviewScore: "Exceptional", location: "Juhu Beach, Mumbai", price: 14200, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=480&h=300&fit=crop&auto=format", amenities: ["Beach Access", "Spa", "Rooftop Bar", "Yoga"], tag: "Beach Front" },
];

const TOUR = { name: "Gateway of India & Elephanta Caves", operator: "Mumbai Heritage Walks Pvt. Ltd.", duration: "5 hours", price: 1499, includes: "Guide, Ferry, Entry" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
const makeFlights = (from: string, to: string): Flight[] =>
  BASE_FLIGHTS.map((f) => ({ ...f, from, to }));

// ─── Airline Logo ─────────────────────────────────────────────────────────────

const AirlineLogo = ({ code, size = "md" }: { code: string; size?: "xs" | "sm" | "md" | "lg" }) => {
  const dims: Record<string, string> = { xs: "w-7 h-7", sm: "w-9 h-9", md: "w-12 h-12", lg: "w-16 h-16" };
  const logoContent = () => {
    if (code === "6E") return (
      <svg viewBox="0 0 48 48" className="w-full h-full"><rect width="48" height="48" rx="10" fill="#4B0082"/><rect x="6" y="6" width="36" height="36" rx="8" fill="#3A0066"/>
        <text x="24" y="20" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9" fontWeight="700" letterSpacing="1">6E</text>
        <path d="M10 28 Q24 22 38 28" stroke="#7B2FBE" strokeWidth="2" fill="none"/>
        <path d="M14 32 L34 32" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="34" cy="26" r="2.5" fill="#FFD700"/>
      </svg>
    );
    if (code === "AI") return (
      <svg viewBox="0 0 48 48" className="w-full h-full"><rect width="48" height="48" rx="10" fill="#C8102E"/>
        <circle cx="24" cy="20" r="8" fill="#fff" opacity="0.15"/>
        <text x="24" y="18" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="8" fontWeight="700">AI</text>
        <path d="M12 32 L24 26 L36 32" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="24" cy="26" r="2" fill="#FFD700"/>
        <text x="24" y="40" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="5" fontWeight="500" opacity="0.8">AIR INDIA</text>
      </svg>
    );
    if (code === "UK") return (
      <svg viewBox="0 0 48 48" className="w-full h-full"><defs><linearGradient id="vg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#4A2FA0"/><stop offset="100%" stopColor="#1A0D40"/></linearGradient></defs>
        <rect width="48" height="48" rx="10" fill="url(#vg)"/>
        <text x="24" y="22" textAnchor="middle" fill="#FFD700" fontFamily="monospace" fontSize="9" fontWeight="700" letterSpacing="1">UK</text>
        <path d="M14 30 L24 26 L34 30" stroke="#FFD700" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <text x="24" y="40" textAnchor="middle" fill="#D4A8FF" fontFamily="sans-serif" fontSize="5" fontWeight="500" letterSpacing="1">VISTARA</text>
      </svg>
    );
    if (code === "SG") return (
      <svg viewBox="0 0 48 48" className="w-full h-full"><rect width="48" height="48" rx="10" fill="#E8150A"/>
        <path d="M0 24 L48 0 L48 48 Z" fill="#FF4438" opacity="0.3"/>
        <text x="24" y="21" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9" fontWeight="700" letterSpacing="1">SG</text>
        <path d="M10 30 L38 30" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
        <text x="24" y="40" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="5" fontWeight="500" opacity="0.9">SPICEJET</text>
      </svg>
    );
    if (code === "G8") return (
      <svg viewBox="0 0 48 48" className="w-full h-full"><rect width="48" height="48" rx="10" fill="#0A3D8C"/>
        <circle cx="24" cy="20" r="10" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.3"/>
        <text x="24" y="23" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9" fontWeight="700">G8</text>
        <text x="24" y="40" textAnchor="middle" fill="#60A5FA" fontFamily="sans-serif" fontSize="5" fontWeight="500">GO FIRST</text>
      </svg>
    );
    return (
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <rect width="48" height="48" rx="10" fill={AIRLINE_BRAND[code]?.bg ?? "#334155"}/>
        <text x="24" y="28" textAnchor="middle" fill={AIRLINE_BRAND[code]?.text ?? "#fff"} fontFamily="monospace" fontSize="10" fontWeight="700">{code}</text>
      </svg>
    );
  };
  return <div className={`${dims[size]} flex-shrink-0 rounded-xl overflow-hidden shadow-sm`}>{logoContent()}</div>;
};

const HotelBadge = ({ chain }: { chain: string }) => {
  const c: Record<string, { bg: string; text: string; short: string }> = {
    "Oberoi Hotels & Resorts": { bg: "#1C1C1C", text: "#C9A84C", short: "OBR" },
    "Taj Hotels": { bg: "#7B2D00", text: "#F5D18A", short: "TAJ" },
    "ITC Hotels": { bg: "#1A472A", text: "#A8D5B5", short: "ITC" },
    "Marriott International": { bg: "#B91C1C", text: "#FEE2E2", short: "JW" },
  };
  const col = c[chain] ?? { bg: "#334155", text: "#fff", short: "HTL" };
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ background: col.bg, color: col.text }}>{col.short}</span>;
};

const Stars = ({ n, size = "sm" }: { n: number; size?: "sm" | "md" }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`${size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"} ${i < n ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </span>
);

const FlightRoute = ({ flight, size = "md" }: { flight: Flight; size?: "sm" | "md" }) => (
  <div className="flex items-center gap-3 flex-1">
    <div className="text-center">
      <p className={`font-bold ${size === "md" ? "text-xl" : "text-sm"}`}>{flight.dep}</p>
      <p className="text-xs text-gray-400 font-mono">{flight.from}</p>
    </div>
    <div className="flex-1 flex flex-col items-center gap-0.5">
      <p className="text-xs text-gray-400">{flight.duration}</p>
      <div className="w-full flex items-center gap-1">
        <div className="h-px flex-1 bg-gray-200"/>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
        <div className="h-px flex-1 bg-gray-200"/>
      </div>
      <p className="text-xs text-green-600 font-medium">{flight.stops}</p>
    </div>
    <div className="text-center">
      <p className={`font-bold ${size === "md" ? "text-xl" : "text-sm"}`}>{flight.arr}</p>
      <p className="text-xs text-gray-400 font-mono">{flight.to}</p>
    </div>
  </div>
);

// ─── Destination Panel ────────────────────────────────────────────────────────

const DestinationPanel = ({ dest, onClose }: { dest: Destination; onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.transform = "translateX(0)";
      el.style.opacity = "1";
    });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div
        ref={panelRef}
        className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
        style={{ transform: "translateX(100%)", opacity: 0, transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease" }}
      >
        {/* Hero image */}
        <div className="relative h-64 flex-shrink-0">
          <img src={dest.heroImg} alt={dest.name} className="w-full h-full object-cover bg-gray-200"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#E8541A]/90 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white text-xs font-bold tracking-wide">✦ Incredible India</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs font-mono uppercase tracking-widest mb-1">{dest.state} · {dest.iataCode}</p>
                <h2 className="font-serif text-4xl text-white leading-none">{dest.name}</h2>
                <p className="text-white/80 text-sm mt-1 italic">{dest.tagline}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">{dest.travelTime}</p>
                <p className="text-[#F5A623] text-xs font-semibold mt-0.5">✈ From Delhi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* About */}
          <section>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8541A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              About {dest.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{dest.description}</p>
            <p className="text-sm text-gray-500 leading-relaxed mt-2">{dest.culture}</p>
          </section>

          {/* Gallery */}
          <section>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8541A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Gallery
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dest.galleryImgs.map((img, i) => (
                <img key={i} src={img} alt={`${dest.name} ${i + 1}`} className="w-full h-36 object-cover rounded-xl bg-gray-100"/>
              ))}
            </div>
          </section>

          {/* Top Attractions */}
          <section>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8541A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              Top Attractions
            </h3>
            <div className="space-y-3">
              {dest.attractions.map((a) => (
                <div key={a.name} className="flex gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Best Time */}
          <section>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8541A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Best Time to Visit
            </h3>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
              <span className="text-2xl">🌤️</span>
              <div>
                <p className="text-sm font-bold text-amber-800">{dest.bestTime.period}</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{dest.bestTime.why}</p>
              </div>
            </div>
          </section>

          {/* Festivals */}
          <section>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8541A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6l3 3m0 0l3-3m-3 3V3"/></svg>
              Local Festivals & Events
            </h3>
            <div className="space-y-2.5">
              {dest.festivals.map((f) => (
                <div key={f.name} className="border border-gray-100 rounded-xl p-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-800">{f.name}</span>
                    <span className="text-xs font-mono text-[#E8541A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{f.month}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Read More CTA */}
          <section className="pb-2">
            <div className="bg-[#1A2744] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8541A] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Explore on Incredible India</p>
                <p className="text-blue-300 text-xs mt-0.5">Official tourism portal — travel advisories, heritage info & more.</p>
              </div>
              <a
                href="https://www.incredibleindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#E8541A] hover:bg-[#cf4915] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
              >
                Read More →
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// ─── Destination Chip ─────────────────────────────────────────────────────────

const DestChip = ({ dest, active, onSelect, onKnowMore }: {
  dest: Destination; active: boolean;
  onSelect: () => void; onKnowMore: () => void;
}) => (
  <div className={`flex items-center rounded-full border-2 overflow-hidden transition-all ${active ? "border-[#E8541A] shadow-md shadow-orange-100" : "border-gray-200 hover:border-gray-300"}`}>
    <button
      onClick={onSelect}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-[#E8541A] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${dest.gradient} flex-shrink-0`}/>
      {dest.name}
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onKnowMore(); }}
      className={`flex items-center gap-1 px-3 py-2 text-xs font-bold transition-colors border-l ${active ? "border-white/30 bg-[#cf4915] text-white hover:bg-[#b83d10]" : "border-gray-200 bg-gray-50 text-[#E8541A] hover:bg-orange-50"}`}
      title={`Know more about ${dest.name}`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Know More
    </button>
  </div>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────

type PageMeta = { id: Page; label: string; icon: string };
const NAV_ITEMS: PageMeta[] = [
  { id: "home", label: "Search", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "trip", label: "Trip Summary", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "checkout", label: "Checkout", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { id: "refund", label: "Refund", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { id: "rebook", label: "Rebook", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
];

const Nav = ({ page, onNav }: { page: Page; onNav: (p: Page) => void }) => (
  <nav className="bg-[#1A2744] text-white px-5 flex items-center justify-between h-14 flex-shrink-0 border-b border-white/5">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#E8541A] flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
      <div>
        <span className="font-serif text-lg leading-none">TripLedger</span>
        <span className="block text-[10px] text-blue-400 leading-none tracking-widest uppercase">Transparent Travel</span>
      </div>
    </div>
    <div className="flex items-center gap-0.5">
      {NAV_ITEMS.map((item) => (
        <button key={item.id} onClick={() => onNav(item.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${page === item.id ? "bg-[#E8541A] text-white" : "text-blue-300 hover:text-white hover:bg-white/10"}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  </nav>
);

// ─── Home Page ────────────────────────────────────────────────────────────────

const HomePage = ({ onSelect }: { onSelect: (f: Flight, h: Hotel) => void }) => {
  const [activeDest, setActiveDest] = useState<Destination>(DESTINATIONS.goa);
  const [panelDest, setPanelDest] = useState<Destination | null>(null);
  const [date, setDate] = useState("2026-10-15");
  const [guests, setGuests] = useState("2 Adults · Economy");
  const [searched, setSearched] = useState(false);
  const [selFlight, setSelFlight] = useState<string | null>(null);
  const [selHotel, setSelHotel] = useState<string | null>(null);

  const flights = makeFlights("DEL", activeDest.iataCode);
  const chosenFlight = flights.find((f) => f.id === selFlight);
  const chosenHotel = HOTELS.find((h) => h.id === selHotel);
  const total = (chosenFlight?.price ?? 0) + (chosenHotel?.price ?? 0);
  const canAdd = !!(chosenFlight && chosenHotel);

  const handleDestSelect = (d: Destination) => {
    setActiveDest(d);
    setSearched(false);
    setSelFlight(null);
    setSelHotel(null);
  };

  return (
    <>
      {panelDest && <DestinationPanel dest={panelDest} onClose={() => setPanelDest(null)}/>}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative h-64 overflow-hidden">
          <img src={activeDest.heroImg} alt={activeDest.name} className="w-full h-full object-cover bg-gray-200"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"/>
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <p className="text-xs text-[#F5A623] tracking-[0.2em] uppercase font-mono mb-2">✦ Incredible India · Tourism Discovery</p>
            <h1 className="font-serif text-3xl text-white leading-tight mb-1">
              Discover <span className="italic text-[#F5A623]">{activeDest.name}</span>
              <span className="text-white/60 text-xl font-sans ml-2">— {activeDest.tagline}</span>
            </h1>
            <p className="text-white/70 text-sm">Book flights + hotels with full pricing transparency. No hidden margins.</p>
          </div>
        </div>

        {/* Destination chips */}
        <div className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1 flex-shrink-0">Explore:</span>
            {DEST_LIST.map((d) => (
              <DestChip key={d.id} dest={d} active={activeDest.id === d.id}
                onSelect={() => handleDestSelect(d)} onKnowMore={() => setPanelDest(d)}/>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="max-w-5xl mx-auto px-6 pt-5">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">From</label>
                <div className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 font-medium">New Delhi (DEL)</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">To</label>
                <div className={`border-2 rounded-xl px-3 py-2.5 text-sm font-bold bg-gradient-to-r ${activeDest.gradient} text-white flex items-center gap-2`}>
                  <div className="w-2 h-2 bg-white/60 rounded-full"/>
                  {activeDest.name} ({activeDest.iataCode})
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Departure</label>
                <input type="date" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E8541A] transition-colors" value={date} onChange={(e) => setDate(e.target.value)}/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Guests & Class</label>
                <select className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#E8541A] transition-colors bg-white" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  <option>1 Adult · Economy</option>
                  <option>2 Adults · Economy</option>
                  <option>2 Adults · Business</option>
                  <option>2 Adults, 1 Child · Economy</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => { setSearched(true); setSelFlight(null); setSelHotel(null); }}
              className="mt-4 w-full bg-[#E8541A] hover:bg-[#cf4915] text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Search Flights & Hotels to {activeDest.name}
            </button>
          </div>
        </div>

        {/* Spotlight — pre-search */}
        {!searched && (
          <div className="max-w-5xl mx-auto px-6 pt-6 pb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-[#1A2744]">
                {activeDest.name} — Destination Spotlight
              </h2>
              <button
                onClick={() => setPanelDest(activeDest)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A2744] hover:bg-[#152038] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Know More →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 relative rounded-2xl overflow-hidden h-64 group cursor-pointer" onClick={() => setPanelDest(activeDest)}>
                <img src={activeDest.galleryImgs[0]} alt={activeDest.name} className="w-full h-full object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[#F5A623] text-xs font-mono uppercase tracking-widest mb-1">Top Attraction</p>
                  <p className="text-white font-bold text-lg">{activeDest.attractions[0].icon} {activeDest.attractions[0].name}</p>
                  <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{activeDest.attractions[0].desc}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs font-semibold">
                  Know More →
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">🌤 Best Time</p>
                  <p className="text-sm font-semibold text-amber-900">{activeDest.bestTime.period}</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{activeDest.bestTime.why.slice(0, 80)}…</p>
                </div>
                <div className="bg-[#1A2744] rounded-2xl p-4">
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">🎉 Next Festival</p>
                  <p className="text-sm font-semibold text-white">{activeDest.festivals[0].name}</p>
                  <p className="text-xs text-blue-300 mt-0.5">{activeDest.festivals[0].month}</p>
                  <p className="text-xs text-blue-400 mt-1 leading-relaxed line-clamp-2">{activeDest.festivals[0].desc.slice(0, 70)}…</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              {activeDest.attractions.slice(1, 4).map((a) => (
                <button key={a.name} onClick={() => setPanelDest(activeDest)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#E8541A] hover:text-[#E8541A] text-gray-600 rounded-full px-3.5 py-1.5 text-sm transition-all"
                >
                  <span>{a.icon}</span><span>{a.name}</span>
                </button>
              ))}
              <button onClick={() => setPanelDest(activeDest)} className="flex items-center gap-1 text-[#E8541A] text-sm font-semibold hover:underline underline-offset-2">
                +{activeDest.attractions.length - 1} more →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="max-w-5xl mx-auto px-6 pb-12 mt-6">
            {/* Destination result banner */}
            <div className="rounded-2xl mb-5 overflow-hidden">
              <div className="relative h-24 flex items-center">
                <img src={activeDest.heroImg} alt={activeDest.name} className="absolute inset-0 w-full h-full object-cover"/>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeDest.gradient} opacity-85`}/>
                <div className="relative z-10 flex items-center justify-between w-full px-5">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-mono">Results for</p>
                    <p className="font-serif text-2xl text-white">{activeDest.name}
                      <span className="text-white/60 text-base font-sans ml-2">— {activeDest.tagline}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-white/60 text-xs">{activeDest.travelTime}</p>
                      <p className="text-[#F5A623] text-xs font-medium">Best time: {activeDest.bestTime.period}</p>
                    </div>
                    <button
                      onClick={() => setPanelDest(activeDest)}
                      className="flex items-center gap-2 bg-white text-[#1A2744] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#F5A623] transition-colors whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Know More about {activeDest.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Flights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-xl text-[#1A2744]">Flights to {activeDest.name}</h2>
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2.5 py-1 rounded-full">{flights.length} options</span>
                </div>
                <div className="space-y-2.5">
                  {flights.map((f) => (
                    <div key={f.id} onClick={() => setSelFlight(f.id)}
                      className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selFlight === f.id ? "border-[#E8541A] shadow-lg shadow-orange-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <AirlineLogo code={f.code} size="md"/>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-semibold text-sm">{f.airline}</span>
                              <span className="text-xs text-gray-400 font-mono ml-2">{f.flightNo}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-[#1A2744] text-base">{fmt(f.price)}</span>
                              <span className="block text-xs text-gray-400">{f.class}</span>
                            </div>
                          </div>
                          <FlightRoute flight={f} size="sm"/>
                        </div>
                      </div>
                      {selFlight === f.id && (
                        <div className="mt-2 pt-2 border-t border-orange-100 flex justify-between">
                          <span className="text-xs text-[#E8541A] font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            Selected
                          </span>
                          <span className="text-xs text-gray-400">Paid directly to {f.airline}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-xl text-[#1A2744]">Hotels in {activeDest.name}</h2>
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2.5 py-1 rounded-full">{HOTELS.length} options</span>
                </div>
                <div className="space-y-2.5">
                  {HOTELS.map((h) => (
                    <div key={h.id} onClick={() => setSelHotel(h.id)}
                      className={`bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-md overflow-hidden ${selHotel === h.id ? "border-[#E8541A] shadow-lg shadow-orange-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <div className="flex">
                        <div className="relative w-24 flex-shrink-0">
                          <img src={h.img} alt={h.name} className="w-24 h-full object-cover bg-gray-100"/>
                          <span className="absolute top-1.5 left-1.5 text-xs bg-[#E8541A] text-white px-1.5 py-0.5 rounded font-medium leading-tight">{h.tag}</span>
                        </div>
                        <div className="p-3 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-sm leading-tight">{h.name}</span>
                              <HotelBadge chain={h.chain}/>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-mono font-bold text-[#1A2744] text-sm">{fmt(h.price)}</span>
                              <span className="block text-xs text-gray-400">/ night</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Stars n={h.rating}/>
                            <span className="text-xs text-amber-600 font-medium">{h.reviewScore}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{h.location}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {h.amenities.slice(0, 3).map((a) => (
                              <span key={a} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {selHotel === h.id && (
                        <div className="px-3 py-2 bg-orange-50 border-t border-orange-100 flex justify-between">
                          <span className="text-xs text-[#E8541A] font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            Selected
                          </span>
                          <span className="text-xs text-gray-400">Paid directly to {h.chain}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bundle CTA */}
            <div className={`mt-6 rounded-2xl px-6 py-4 flex items-center justify-between ${canAdd ? "bg-[#1A2744]" : "bg-gray-100 border border-gray-200"}`}>
              <div>
                {canAdd ? (
                  <>
                    <div className="flex items-center gap-2 mb-0.5">
                      <AirlineLogo code={chosenFlight!.code} size="xs"/>
                      <span className="text-white text-sm font-medium">{chosenFlight!.airline} {chosenFlight!.flightNo}</span>
                      <span className="text-blue-400">+</span>
                      <span className="text-white text-sm font-medium">{chosenHotel!.name}</span>
                    </div>
                    <p className="font-mono font-bold text-[#F5A623] text-xl">{fmt(total)}<span className="text-xs font-normal text-blue-300 ml-1.5">bundled — ₹0 platform fee</span></p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Select one flight and one hotel to create your bundle</p>
                )}
              </div>
              <button
                disabled={!canAdd}
                onClick={() => onSelect(chosenFlight!, chosenHotel!)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${canAdd ? "bg-[#E8541A] hover:bg-[#cf4915] text-white shadow-lg" : "bg-white text-gray-300 cursor-not-allowed"}`}
              >
                Add to Trip Plan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Trip Summary ─────────────────────────────────────────────────────────────

const TripSummaryPage = ({ flight, hotel, onCheckout, onTourChange }: {
  flight: Flight; hotel: Hotel; onCheckout: () => void; onTourChange: (v: boolean) => void;
}) => {
  const [addTour, setAddTour] = useState(false);
  const total = flight.price + hotel.price + (addTour ? TOUR.price : 0);
  const ledger = [
    { label: "Flight", sublabel: `${flight.flightNo} · ${flight.from}→${flight.to} · ${flight.dep}`, dest: flight.airline, amount: flight.price, color: "bg-indigo-500", pct: (flight.price / total) * 100 },
    { label: "Hotel", sublabel: `${hotel.name} · 1 night · Oct 15`, dest: hotel.chain, amount: hotel.price, color: "bg-purple-500", pct: (hotel.price / total) * 100 },
    ...(addTour ? [{ label: "Tour", sublabel: TOUR.name, dest: TOUR.operator, amount: TOUR.price, color: "bg-amber-500", pct: (TOUR.price / total) * 100 }] : []),
  ];
  const handleTour = (v: boolean) => { setAddTour(v); onTourChange(v); };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-[#1A2744] rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 80% 0%, rgba(232,84,26,0.2) 0%, transparent 60%)" }}/>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-1">Bundled Trip · Delhi → {flight.to}</p>
                <p className="font-mono font-bold text-5xl text-[#F5A623]">{fmt(total)}</p>
                <p className="text-blue-300 text-xs mt-1">Oct 15, 2026 · 2 Adults · Economy</p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-300 text-xs px-3 py-1.5 rounded-full border border-green-500/30">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Best price found
              </span>
            </div>
            <div className="flex rounded-full overflow-hidden h-2.5 gap-px">
              {ledger.map((l) => <div key={l.label} className={l.color} style={{ width: `${l.pct}%` }}/>)}
            </div>
            <div className="flex gap-5 mt-2.5">
              {ledger.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${l.color}`}/>
                  <span className="text-xs text-blue-300">{l.label} · {Math.round(l.pct)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-indigo-500 rounded-full"/>
                <h3 className="font-semibold text-sm text-gray-700">Flight</h3>
                <span className="ml-auto text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">Paid to {flight.airline}</span>
              </div>
              <div className="flex items-center gap-4">
                <AirlineLogo code={flight.code} size="lg"/>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold">{flight.airline}</span>
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{flight.flightNo}</span>
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded">{flight.stops}</span>
                  </div>
                  <FlightRoute flight={flight} size="md"/>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>✓ Carry-on included</span><span>✓ Meal onboard</span><span>✓ Free cancellation 24h</span>
                </div>
                <span className="font-mono font-bold text-indigo-700">{fmt(flight.price)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full"/>
                <h3 className="font-semibold text-sm text-gray-700">Hotel</h3>
                <span className="ml-auto text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">Paid to {hotel.chain}</span>
              </div>
              <div className="flex gap-4">
                <img src={hotel.img} alt={hotel.name} className="w-32 h-24 rounded-xl object-cover bg-gray-100 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{hotel.name}</span>
                    <HotelBadge chain={hotel.chain}/>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars n={hotel.rating} size="md"/>
                    <span className="text-sm font-medium text-amber-600">{hotel.reviewScore}</span>
                    <span className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{hotel.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.amenities.map((a) => <span key={a} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded">{a}</span>)}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
                <span className="text-xs text-gray-500">✓ Free breakfast · ✓ Free cancellation until Oct 13</span>
                <span className="font-mono font-bold text-purple-700">{fmt(hotel.price)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-amber-500 rounded-full"/>
                <h3 className="font-semibold text-sm text-gray-700">Optional Tour</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🕌</div>
                  <div>
                    <p className="font-semibold text-sm">{TOUR.name}</p>
                    <p className="text-xs text-gray-400">{TOUR.operator} · {TOUR.duration} · {TOUR.includes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#1A2744]">{fmt(TOUR.price)}</span>
                  <button onClick={() => handleTour(!addTour)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${addTour ? "bg-green-100 text-green-700 border border-green-200" : "bg-[#E8541A] text-white hover:bg-[#cf4915]"}`}>
                    {addTour ? "✓ Added" : "+ Add Tour"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Transparent Ledger
              </h3>
              <div className="space-y-4">
                {ledger.map((l) => (
                  <div key={l.label}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className={`w-2 h-2 rounded-full ${l.color} flex-shrink-0`}/>
                          <p className="text-xs font-bold text-gray-700">{l.label}</p>
                        </div>
                        <p className="text-xs text-gray-400 pl-3.5 leading-tight">{l.sublabel}</p>
                        <p className="text-xs pl-3.5 mt-0.5"><span className="text-gray-400">→ </span><span className="text-[#1A2744] font-semibold">{l.dest}</span></p>
                      </div>
                      <span className="font-mono text-sm font-bold text-gray-800 ml-2">{fmt(l.amount)}</span>
                    </div>
                    <div className="h-px bg-gray-50 mt-3"/>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-100 pt-3 mt-2 flex justify-between items-center">
                <span className="text-sm font-bold">Total</span>
                <span className="font-mono font-bold text-lg text-[#E8541A]">{fmt(total)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
                Platform fee: <span className="font-bold text-green-600">₹0</span>
              </div>
            </div>
            <button onClick={onCheckout} className="w-full bg-[#E8541A] hover:bg-[#cf4915] text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Checkout ─────────────────────────────────────────────────────────────────

const CheckoutPage = ({ flight, hotel, hasTour, onPay }: {
  flight: Flight; hotel: Hotel; hasTour: boolean; onPay: () => void;
}) => {
  const [paid, setPaid] = useState(false);
  const [payMethod, setPayMethod] = useState("UPI");
  const total = flight.price + hotel.price + (hasTour ? TOUR.price : 0);
  const splits = [
    { dest: flight.airline, sub: `${flight.flightNo} · Economy`, amount: flight.price, logo: <AirlineLogo code={flight.code} size="sm"/>, color: "bg-indigo-500" },
    { dest: hotel.name, sub: `1 night · Oct 15`, amount: hotel.price, logo: <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-lg">🏨</div>, color: "bg-purple-500" },
    ...(hasTour ? [{ dest: TOUR.operator, sub: TOUR.name, amount: TOUR.price, logo: <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-lg">🗺</div>, color: "bg-amber-500" }] : []),
  ];

  if (paid) return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-green-50 to-white">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-green-100">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 className="font-serif text-3xl text-[#1A2744] mb-2">Payment Successful!</h2>
      <p className="text-gray-500 text-sm mb-1">Booking ref: <span className="font-mono font-bold">TL-2026-84721</span></p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 w-full max-w-sm text-left mt-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment split — sent to:</p>
        {splits.map((s) => (
          <div key={s.dest} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            {s.logo}
            <div className="flex-1"><p className="text-sm font-medium">{s.dest}</p><p className="text-xs text-gray-400">{s.sub}</p></div>
            <span className="font-mono font-bold text-[#1A2744]">{fmt(s.amount)}</span>
          </div>
        ))}
      </div>
      <button onClick={onPay} className="mt-5 text-sm text-[#E8541A] underline underline-offset-2 font-medium">View Refund Dashboard →</button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1A2744] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl text-[#1A2744]">Checkout</h1>
            <p className="text-gray-400 text-xs">One payment · Multiple providers · Zero hidden fees</p>
          </div>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E2DDD7] rounded-2xl p-5 mb-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Bundled Amount</span>
            <span className="font-mono font-bold text-3xl text-[#E8541A]">{fmt(total)}</span>
          </div>
          <div className="flex items-start gap-2 bg-white rounded-xl p-3 border border-[#E2DDD7]">
            <svg className="w-4 h-4 text-[#E8541A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="text-xs text-gray-600 leading-relaxed"><strong>Your payment will be split and sent directly to providers.</strong> {flight.airline}, {hotel.name}{hasTour ? `, and ${TOUR.operator}` : ""} each receive their share instantly.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">Payment split to providers</h3>
          <div className="space-y-3">
            {splits.map((s) => (
              <div key={s.dest} className="flex items-center gap-3">
                {s.logo}
                <div className="flex-1"><p className="text-sm font-medium">{s.dest}</p><p className="text-xs text-gray-400">{s.sub}</p></div>
                <span className="font-mono font-bold text-[#1A2744]">{fmt(s.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex rounded-full overflow-hidden h-2 gap-px">
            {splits.map((s) => <div key={s.dest} className={s.color} style={{ width: `${(s.amount / total) * 100}%` }}/>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">Payment Method</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {["UPI", "Credit Card", "Net Banking"].map((m) => (
              <button key={m} onClick={() => setPayMethod(m)} className={`border-2 rounded-xl py-2.5 text-sm font-medium transition-all ${payMethod === m ? "border-[#E8541A] text-[#E8541A] bg-orange-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{m}</button>
            ))}
          </div>
          {payMethod === "UPI" && <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8541A] font-mono placeholder:text-gray-300" placeholder="yourname@ybl"/>}
          {payMethod === "Credit Card" && (
            <div className="space-y-3">
              <input className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8541A] font-mono placeholder:text-gray-300" placeholder="4111 1111 1111 1111"/>
              <div className="grid grid-cols-2 gap-3">
                <input className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8541A] font-mono placeholder:text-gray-300" placeholder="MM / YY"/>
                <input className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8541A] font-mono placeholder:text-gray-300" placeholder="CVV"/>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => { setPaid(true); onPay(); }} className="w-full bg-[#1A2744] hover:bg-[#152038] text-white font-bold py-4 rounded-2xl transition-colors text-base tracking-wide">
          Pay Bundled Amount — {fmt(total)}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          256-bit SSL · PCI DSS Level 1 · RBI compliant
        </p>
      </div>
    </div>
  );
};

// ─── Refund Dashboard ─────────────────────────────────────────────────────────

const RefundDashboard = ({ flight, hotel, hasTour, onRebook }: {
  flight: Flight; hotel: Hotel; hasTour: boolean; onRebook: () => void;
}) => {
  const [progress, setProgress] = useState(62);
  const refundAmt = flight.price;
  const steps = ["Requested", "Airline Approved", "Bank Processing", "Credited"];
  const stepPcts = [5, 33, 66, 100];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Flight Canceled — {flight.airline} {flight.flightNo}</p>
            <p className="text-xs text-red-500 mt-0.5">{flight.flightNo} ({flight.from}→{flight.to}, {flight.dep}) canceled. Refunding <strong className="font-mono">{fmt(refundAmt)}</strong>. Hotel and tours remain active.</p>
          </div>
          <button onClick={onRebook} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors flex-shrink-0 self-start">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            Rebook
          </button>
        </div>
        <h1 className="font-serif text-3xl text-[#1A2744] mb-1">Refund Dashboard</h1>
        <p className="text-gray-400 text-sm mb-6">Only the airline portion is refunded — hotel and tours remain intact.</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Refund in Progress</p>
              <p className="font-mono font-bold text-4xl text-green-600">{fmt(refundAmt)}</p>
              <div className="flex items-center gap-2 mt-1">
                <AirlineLogo code={flight.code} size="xs"/>
                <p className="text-xs text-gray-500">{flight.airline} → rahul@ybl</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full border border-amber-200 font-medium">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"/>Processing
              </span>
              <p className="text-xs text-gray-400 mt-1.5">Est. 5–7 business days</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Initiated</span>
              <span className="font-mono font-bold text-green-600">{progress}%</span>
              <span>Credited</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)" }}/>
            </div>
          </div>
          <div className="flex justify-between relative">
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-100 z-0"/>
            {steps.map((step, i) => {
              const done = progress >= stepPcts[i];
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-green-500 border-green-500" : "bg-white border-gray-200"}`}>
                    {done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <span className={`text-xs text-center max-w-16 leading-tight ${done ? "text-green-700 font-semibold" : "text-gray-400"}`}>{step}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => setProgress(Math.min(100, progress + 20))} className="mt-4 text-xs text-[#E8541A] font-medium hover:underline underline-offset-2 cursor-pointer">▶ Simulate refund progress</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-red-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Flight</span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Canceled</span>
            </div>
            <AirlineLogo code={flight.code} size="sm"/>
            <p className="font-semibold text-sm mt-2">{flight.airline}</p>
            <p className="text-xs text-gray-400 font-mono">{flight.flightNo}</p>
            <p className="text-xs text-gray-400">{flight.from} → {flight.to}</p>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <span className="font-mono text-sm font-bold text-red-400 line-through">{fmt(flight.price)}</span>
              <p className="text-xs text-green-600 font-medium mt-0.5">↗ Refund: {fmt(refundAmt)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-green-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hotel</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Active</span>
            </div>
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-xl">🏨</div>
            <p className="font-semibold text-sm mt-2">{hotel.name}</p>
            <Stars n={hotel.rating}/>
            <p className="text-xs text-gray-400">{hotel.location}</p>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <span className="font-mono text-sm font-bold text-green-600">{fmt(hotel.price)}</span>
              <p className="text-xs text-gray-400 mt-0.5">No impact</p>
            </div>
          </div>
          {hasTour ? (
            <div className="bg-white rounded-2xl border-2 border-green-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tour</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Active</span>
              </div>
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-xl">🕌</div>
              <p className="font-semibold text-sm mt-2">Gateway Tour</p>
              <p className="text-xs text-gray-400">{TOUR.operator}</p>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="font-mono text-sm font-bold text-green-600">{fmt(TOUR.price)}</span>
                <p className="text-xs text-gray-400 mt-0.5">No impact</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-center">
              <p className="text-2xl mb-2 opacity-40">🗺</p>
              <p className="text-xs text-gray-400">No tour added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Rebook ───────────────────────────────────────────────────────────────────

const RebookPage = ({ origFlight, onSelect, onClose }: {
  origFlight: Flight; onSelect: (f: Flight) => void; onClose: () => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const alts = ALT_FLIGHTS.map((f) => ({ ...f, from: origFlight.from, to: origFlight.to }));

  return (
    <div className="flex-1 flex items-start justify-center py-10 px-4 overflow-y-auto" style={{ background: "linear-gradient(180deg, rgba(26,39,68,0.05) 0%, transparent 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1A2744] px-6 py-6 relative overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(232,84,26,0.25) 0%, transparent 60%)" }}/>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                    <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Flight Canceled</span>
                  </div>
                  <h2 className="font-serif text-2xl text-white">Your flight is canceled.<br/>Here are 3 alternate options.</h2>
                </div>
                <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <AirlineLogo code={origFlight.code} size="sm"/>
                <div>
                  <p className="text-white text-xs font-semibold">{origFlight.airline} {origFlight.flightNo} — CANCELED</p>
                  <p className="text-blue-300 text-xs">{origFlight.from} → {origFlight.to} · {origFlight.dep}–{origFlight.arr}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-white text-xs font-mono font-bold">{fmt(origFlight.price)}</p>
                  <p className="text-red-300 text-xs">Refund initiated</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-blue-300">
                <span>Oct 15, 2026</span><span>·</span><span>DEL → {origFlight.to}</span><span>·</span>
                <span className="text-green-300 font-medium">No extra charge</span>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {alts.map((f, i) => (
              <div key={f.id} onClick={() => setSelected(f.id)}
                className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${selected === f.id ? "border-[#E8541A] bg-orange-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <AirlineLogo code={f.code} size="md"/>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A2744] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{f.airline}</span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{f.flightNo}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1A2744]">{fmt(f.price)}</span>
                        {f.price < origFlight.price && <span className="block text-xs text-green-600 font-medium">{fmt(origFlight.price - f.price)} cheaper</span>}
                        {f.price > origFlight.price && <span className="block text-xs text-red-400 font-medium">{fmt(f.price - origFlight.price)} more</span>}
                      </div>
                    </div>
                    <FlightRoute flight={f} size="sm"/>
                  </div>
                </div>
                {selected === f.id && (
                  <div className="mt-2.5 pt-2.5 border-t border-orange-200 flex items-center gap-1.5 text-xs text-[#E8541A] font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Selected — hotel and tours remain unchanged
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <button disabled={!selected} onClick={() => { const f = alts.find((fl) => fl.id === selected)!; onSelect(f); }}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 ${selected ? "bg-[#E8541A] hover:bg-[#cf4915] text-white shadow-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              Select Replacement Flight
            </button>
            <p className="text-center text-xs text-gray-400 mt-2.5">Hotel and tour bookings are unaffected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RebookSuccess = ({ newFlight, origFlight, onHome }: { newFlight: Flight; origFlight: Flight; onHome: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-green-50 to-white">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-xl shadow-green-100">
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
    </div>
    <h2 className="font-serif text-3xl text-[#1A2744] mb-2">Flight Rebooked!</h2>
    <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 w-full max-w-sm text-left">
      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl mb-3 opacity-60">
        <AirlineLogo code={origFlight.code} size="sm"/>
        <div><p className="text-xs text-red-600 font-medium line-through">{origFlight.airline} {origFlight.flightNo}</p><p className="text-xs text-gray-400">Canceled</p></div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
        <AirlineLogo code={newFlight.code} size="sm"/>
        <div className="flex-1">
          <p className="text-sm font-bold text-green-700">{newFlight.airline} {newFlight.flightNo}</p>
          <p className="text-xs text-gray-500">{newFlight.dep}–{newFlight.arr} · {newFlight.stops}</p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">✓ Confirmed</span>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-4 mb-6">Updated itinerary sent to rahul.sharma@email.com</p>
    <button onClick={onHome} className="px-8 py-3 bg-[#E8541A] text-white rounded-xl font-bold text-sm hover:bg-[#cf4915] transition-colors">Back to Home</button>
  </div>
);

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selFlight, setSelFlight] = useState<Flight | null>(null);
  const [selHotel, setSelHotel] = useState<Hotel | null>(null);
  const [hasTour, setHasTour] = useState(false);
  const [rebookedFlight, setRebookedFlight] = useState<Flight | null>(null);

  const activeFlight = selFlight ?? makeFlights("DEL", "GOI")[0];
  const activeHotel = selHotel ?? HOTELS[1];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Nav page={page} onNav={setPage}/>
      {page === "home" && (
        <HomePage onSelect={(f, h) => { setSelFlight(f); setSelHotel(h); setPage("trip"); }}/>
      )}
      {page === "trip" && (
        <TripSummaryPage flight={activeFlight} hotel={activeHotel} onCheckout={() => setPage("checkout")} onTourChange={setHasTour}/>
      )}
      {page === "checkout" && (
        <CheckoutPage flight={activeFlight} hotel={activeHotel} hasTour={hasTour} onPay={() => setPage("refund")}/>
      )}
      {page === "refund" && (
        <RefundDashboard flight={activeFlight} hotel={activeHotel} hasTour={hasTour} onRebook={() => setPage("rebook")}/>
      )}
      {page === "rebook" && !rebookedFlight && (
        <RebookPage origFlight={activeFlight} onSelect={(f) => { setRebookedFlight(f); setSelFlight(f); }} onClose={() => setPage("refund")}/>
      )}
      {page === "rebook" && rebookedFlight && (
        <RebookSuccess newFlight={rebookedFlight} origFlight={activeFlight} onHome={() => setPage("home")}/>
      )}
    </div>
  );
}
