import {
  Inbox, Activity, Phone, PhoneIncoming, Send, Map as MapIcon,
  Layers, Search, Bell, ChevronRight, ChevronLeft, Plus, Filter,
  Download, MoreHorizontal, Mic, Pause, PhoneOff, PhoneCall,
  Mail, MessageSquare, DollarSign, Home, Flame, Hammer, Heart,
  Gavel, AlertTriangle, FileText, BookOpen, Eye, ArrowRight,
  TrendingUp, TrendingDown, Minus, MapPin, ShieldCheck, Lock,
  Settings, Users, Clock, Check, X, Sparkles, ChevronUp,
} from 'lucide-react';

export type SituationDef = {
  label: string;
  icon: any;
  priority: boolean;          // legacy alias — true iff tier === 'moat'
  tier: 'moat' | 'standard';
  reason: string;
  source?: string;            // operator-facing data provenance
};

export const SITUATION: Record<string, SituationDef> = {
  // — Proprietary moat: pre-event signals nobody else surfaces at scale —
  'inherited-recent':  { label: 'Pre-probate match',         icon: BookOpen,     tier: 'moat',     priority: true,  reason: 'Obituary matched to deeded property before probate filing.', source: 'Obituary scraping + ownership cross-ref' },
  'separating':        { label: 'Pre-divorce signals',       icon: Heart,        tier: 'moat',     priority: true,  reason: 'Joint-ownership home with disturbance/early-filing patterns.', source: 'Public records + civil filings' },
  'owner-in-jail':     { label: 'Incarceration risk',        icon: Lock,         tier: 'moat',     priority: true,  reason: 'Felony filing against the sole title-holder.',                  source: 'County felony filings' },
  'old-roof':          { label: 'Old-roof permit cross-ref', icon: Home,         tier: 'moat',     priority: true,  reason: 'No roof permit on file in 15+ years.',                          source: 'Municipal permit data' },
  'vacant-damaged':    { label: 'Drive-by computer vision',  icon: Eye,          tier: 'moat',     priority: true,  reason: 'Vision model flagged damage, vacancy, or neglect.',             source: 'Street-level imagery + VLM' },
  'estate-sale':       { label: 'Estate sale activity',      icon: Hammer,       tier: 'moat',     priority: true,  reason: 'Family is actively liquidating possessions at the property.',  source: 'EstateSales.net + Marketplace scrape' },

  // — Standard coverage: table-stakes the platform must carry —
  'in-probate':        { label: 'Probate filed',             icon: Gavel,        tier: 'standard', priority: false, reason: 'Estate is going through the court.',                source: 'County clerk filings' },
  'divorce':           { label: 'Divorce filed',             icon: Heart,        tier: 'standard', priority: false, reason: 'Joint-ownership home, petition on record.',          source: 'County clerk filings' },
  'behind-on-payments':{ label: 'Pre-foreclosure',           icon: AlertTriangle,tier: 'standard', priority: false, reason: 'Notice of Default filed; payments behind.',         source: 'County recorder' },
  'code-issues':       { label: 'Code violations',           icon: FileText,     tier: 'standard', priority: false, reason: 'Open city citations — fines compound.',              source: 'Municipal code enforcement' },
  'fire-flood':        { label: 'Fire or flood damage',      icon: Flame,        tier: 'standard', priority: false, reason: 'Insurance claim or disaster-zone overlap.',          source: 'FEMA + insurance signals' },
  'long-on-market':    { label: 'MLS overstay',              icon: Clock,        tier: 'standard', priority: false, reason: 'Listed 180+ days with multiple price drops.',        source: 'MLS feeds' },
  'older-owner':       { label: 'Senior, high equity',       icon: Users,        tier: 'standard', priority: false, reason: 'Long-tenured owner over 70 with significant equity.',source: 'Demographic + tax roll' },
  'vacant':            { label: 'Vacant',                    icon: Home,         tier: 'standard', priority: false, reason: 'Utility shut-off, mail-forwarding, no occupancy.',   source: 'Utility + USPS signals' },
  'paid-off':          { label: 'Free and clear',            icon: ShieldCheck,  tier: 'standard', priority: false, reason: 'No mortgage of record — flexible on terms.',         source: 'County deed records' },
  'tax-trouble':       { label: 'Tax delinquent',            icon: DollarSign,   tier: 'standard', priority: false, reason: 'Property taxes behind, lien risk.',                  source: 'County tax collector' },
};

export const SITUATION_KEYS_MOAT: string[] =
  Object.entries(SITUATION).filter(([, v]) => v.tier === 'moat').map(([k]) => k);
export const SITUATION_KEYS_STANDARD: string[] =
  Object.entries(SITUATION).filter(([, v]) => v.tier === 'standard').map(([k]) => k);

export type Contact = {
  name: string;
  rel: string;
  age: number;
  loc: string;
  phone: string;
  q: 'Best' | 'Good';
};

export type TimelineEvent = { date: string; text: string };
export type Reason = { weight: number; label: string };

export type Lead = {
  id: string;
  owner: string;
  status: string;
  address: string;
  city: string;
  beds: number; baths: number; sqft: number; year: number;
  lastSale: string;
  avm: number; mortgage: number; equity: number;
  score: number;
  situations: string[];
  primary: string;
  whyShort: string;
  reasons: Reason[];
  contacts: Contact[];
  timeline: TimelineEvent[];
  coord: { x: number; y: number };
  days: number;
  contacted: boolean;
  sensitive?: boolean;
};

export const LEADS: Lead[] = [
  {
    id: 'L-2847',
    owner: 'Margaret L. Holloway',
    status: 'Passed away March 14',
    address: '2847 Oleander Way',
    city: 'Venice, FL 34293',
    beds: 3, baths: 2, sqft: 1847, year: 1972,
    lastSale: 'April 1998 — $87,400',
    avm: 412000, mortgage: 0, equity: 412000,
    score: 94,
    situations: ['inherited-recent','paid-off','vacant'],
    primary: 'inherited-recent',
    whyShort: 'Family just lost their mother. House is paid off. Nobody living there.',
    reasons: [
      { weight: 38, label: 'Owner passed away three weeks ago' },
      { weight: 24, label: 'House is paid off — no mortgage' },
      { weight: 18, label: 'Utilities turned off (likely vacant)' },
      { weight: 14, label: 'Owner was elderly, owned the home alone' },
    ],
    contacts: [
      { name: 'Daniel R. Holloway',     rel: 'Son',           age: 52, loc: 'Tampa, FL',     phone: '(813) 555-0142', q: 'Best' },
      { name: 'Sarah Holloway-Chen',    rel: 'Daughter',      age: 49, loc: 'Asheville, NC', phone: '(828) 555-0317', q: 'Best' },
      { name: 'Margaret K. Holloway',   rel: 'Granddaughter', age: 28, loc: 'Venice, FL',    phone: '(941) 555-0289', q: 'Good' },
    ],
    timeline: [
      { date: 'March 14', text: 'Obituary published — Venice Gulf Coast Memorial' },
      { date: 'March 22', text: 'Electric and water turned off' },
      { date: 'April 8',  text: 'No probate filing yet — Sarasota County' },
      { date: 'April 24', text: 'Drive-by showed mail piling up' },
    ],
    coord: { x: 38, y: 42 }, days: 12, contacted: false,
  },
  {
    id: 'L-1142',
    owner: 'Estate of Robert M. Vega',
    status: 'Probate filed April 22',
    address: '1142 Pinebrook Rd',
    city: 'Venice, FL 34292',
    beds: 4, baths: 2, sqft: 2134, year: 1985,
    lastSale: 'July 2007 — $234,000',
    avm: 387000, mortgage: 42000, equity: 345000,
    score: 91,
    situations: ['in-probate','code-issues','vacant'],
    primary: 'in-probate',
    whyShort: 'Estate is in probate. House has three open code violations and looks empty.',
    reasons: [
      { weight: 32, label: 'Probate case opened — no contest' },
      { weight: 26, label: 'Three open city code violations' },
      { weight: 22, label: 'Drive-by photos show vacant property' },
      { weight: 11, label: 'Significant equity — only $42k owed' },
    ],
    contacts: [
      { name: 'Anthony Vega',       rel: 'Son',      age: 47, loc: 'Charlotte, NC', phone: '(704) 555-0193', q: 'Best' },
      { name: 'Linda Vega-Brennan', rel: 'Daughter', age: 44, loc: 'Naples, FL',    phone: '(239) 555-0456', q: 'Best' },
    ],
    timeline: [
      { date: 'April 22',   text: 'Probate filed (Case 2026-CP-001847)' },
      { date: 'March 11',   text: 'Code violation — overgrown lot' },
      { date: 'February 2', text: 'Code violation — debris on property' },
      { date: 'January 14', text: 'Code violation — pool not maintained' },
    ],
    coord: { x: 56, y: 28 }, days: 6, contacted: true,
  },
  {
    id: 'L-5612',
    owner: 'Patricia & Donald Reeves',
    status: 'Lived there 37 years, ages 79 and 81',
    address: '5612 Sandcastle Dr',
    city: 'Venice, FL 34293',
    beds: 2, baths: 2, sqft: 1420, year: 1978,
    lastSale: 'June 1989 — $74,500',
    avm: 295000, mortgage: 0, equity: 295000,
    score: 87,
    situations: ['older-owner','old-roof','paid-off'],
    primary: 'older-owner',
    whyShort: 'Couple in their late 70s. Paid off long ago. Roof is 23 years old.',
    reasons: [
      { weight: 28, label: 'Both owners over 70, lived there 37 years' },
      { weight: 25, label: 'Roof last replaced in 2003 (23 years ago)' },
      { weight: 22, label: 'Paid off, no second mortgage' },
      { weight: 12, label: 'Single property, primary residence' },
    ],
    contacts: [
      { name: 'Jennifer Reeves-Park', rel: 'Daughter', age: 54, loc: 'Atlanta, GA', phone: '(404) 555-0721', q: 'Best' },
      { name: 'Michael Reeves',       rel: 'Son',      age: 51, loc: 'Denver, CO',  phone: '(303) 555-0488', q: 'Good' },
    ],
    timeline: [
      { date: 'March 3',  text: 'Last roof permit on record: July 2003' },
      { date: 'February 18', text: 'Drive-by photos show curling shingles' },
    ],
    coord: { x: 22, y: 64 }, days: 21, contacted: false,
  },
  {
    id: 'L-3719',
    owner: 'Marcus T. & Lila Bennett',
    status: 'Foreclosure notice filed, divorcing',
    address: '3719 Bayview Cir',
    city: 'Venice, FL 34285',
    beds: 4, baths: 3, sqft: 2540, year: 2003,
    lastSale: 'September 2021 — $618,000',
    avm: 689000, mortgage: 524000, equity: 165000,
    score: 85,
    situations: ['behind-on-payments','divorce'],
    primary: 'behind-on-payments',
    whyShort: 'Notice of Default filed in February. Couple is also divorcing. Four missed payments.',
    reasons: [
      { weight: 34, label: 'Notice of Default filed February 8' },
      { weight: 28, label: 'Divorce filed March 1' },
      { weight: 16, label: 'Four mortgage payments behind' },
      { weight: 7,  label: 'Joint title — both signatures needed' },
    ],
    contacts: [],
    timeline: [
      { date: 'February 8', text: 'Notice of Default filed' },
      { date: 'March 1',    text: 'Divorce petition filed' },
      { date: 'March 28',   text: 'One spouse moved out (mail forwarding filed)' },
    ],
    coord: { x: 71, y: 50 }, days: 17, contacted: true,
  },
  {
    id: 'L-0891',
    owner: 'William J. Pratt',
    status: 'Owner lives in Ohio',
    address: '891 Cedar Glen Ln',
    city: 'Englewood, FL 34223',
    beds: 3, baths: 2, sqft: 1680, year: 1969,
    lastSale: 'October 2004 — $142,000',
    avm: 268000, mortgage: 0, equity: 268000,
    score: 78,
    situations: ['vacant-damaged','vacant','paid-off'],
    primary: 'vacant-damaged',
    whyShort: 'Out-of-state owner. Roof has a tarp on it. Lawn is overgrown. Nobody home for months.',
    reasons: [
      { weight: 30, label: 'Drive-by photos show tarp on roof, missing siding' },
      { weight: 22, label: 'No vehicle in 8 consecutive photos, grass over a foot' },
      { weight: 18, label: 'Owner lives in Ohio, 22+ years' },
      { weight: 8,  label: 'Paid off' },
    ],
    contacts: [
      { name: 'Carol Pratt', rel: 'Wife', age: 73, loc: 'Akron, OH', phone: '(330) 555-0617', q: 'Best' },
    ],
    timeline: [
      { date: 'April 30',  text: 'Latest drive-by photos confirm damage' },
      { date: 'March 15',  text: 'No water or electric usage for 9 months' },
    ],
    coord: { x: 14, y: 24 }, days: 4, contacted: false,
  },
  {
    id: 'L-4256',
    owner: 'Estate of Helen S. Murphy',
    status: 'Estate sale this weekend',
    address: '4256 Tarpon Dr',
    city: 'Sarasota, FL 34232',
    beds: 3, baths: 2, sqft: 1934, year: 1981,
    lastSale: 'March 1995 — $112,400',
    avm: 354000, mortgage: 0, equity: 354000,
    score: 76,
    situations: ['estate-sale','in-probate','paid-off'],
    primary: 'estate-sale',
    whyShort: 'Family is having an estate sale this weekend. Probate already filed. Paid off.',
    reasons: [
      { weight: 28, label: 'Estate sale advertised for April 25–27' },
      { weight: 22, label: 'Probate filed February 11' },
      { weight: 18, label: 'Paid off, no surviving spouse' },
      { weight: 8,  label: 'Large amount of contents being liquidated' },
    ],
    contacts: [
      { name: 'Carolyn Murphy-Esposito', rel: 'Daughter', age: 56, loc: 'Buffalo, NY', phone: '(716) 555-0392', q: 'Best' },
    ],
    timeline: [
      { date: 'April 21',    text: 'Estate sale posted on EstateSales.net' },
      { date: 'February 11', text: 'Probate filed' },
    ],
    coord: { x: 82, y: 75 }, days: 23, contacted: false,
  },
  {
    id: 'L-1408',
    owner: 'Trevor M. Madsen',
    status: 'Owner facing serious charges, trial in August',
    address: '1408 Magnolia Ave',
    city: 'North Port, FL 34286',
    beds: 3, baths: 2, sqft: 1612, year: 1992,
    lastSale: 'May 2018 — $189,000',
    avm: 312000, mortgage: 142000, equity: 170000,
    score: 72,
    situations: ['owner-in-jail'],
    primary: 'owner-in-jail',
    whyShort: 'Owner is in jail facing a long sentence. Family is likely going to need to handle the house.',
    reasons: [
      { weight: 38, label: 'Charged with serious felony, bond denied' },
      { weight: 18, label: 'Trial in August — minimum 7-year sentence possible' },
      { weight: 12, label: 'Only person on the deed' },
      { weight: 4,  label: 'Mortgage current — short runway before issues start' },
    ],
    contacts: [
      { name: 'Karen Madsen',  rel: 'Mother',  age: 67, loc: 'North Port, FL',    phone: '(941) 555-0728', q: 'Best' },
      { name: 'David Madsen',  rel: 'Brother', age: 41, loc: 'Port Charlotte, FL',phone: '(941) 555-0144', q: 'Good' },
    ],
    timeline: [
      { date: 'January 28', text: 'Indictment filed' },
      { date: 'February 3', text: 'Bond denied — held until trial' },
    ],
    coord: { x: 50, y: 84 }, days: 9, contacted: false,
    sensitive: true,
  },
  {
    id: 'L-7124',
    owner: 'Daniel S. Crenshaw',
    status: 'Listed 247 days, dropped price three times',
    address: '7124 Coral Lakes Blvd',
    city: 'Venice, FL 34293',
    beds: 4, baths: 3, sqft: 2380, year: 2008,
    lastSale: 'August 2019 — $412,500',
    avm: 528000, mortgage: 318000, equity: 210000,
    score: 68,
    situations: ['long-on-market'],
    primary: 'long-on-market',
    whyShort: 'Been on the market eight months. Three price cuts. Agent has gone quiet.',
    reasons: [
      { weight: 24, label: '247 days on market (typical: 52)' },
      { weight: 22, label: 'Three price drops: $599k → $549k → $519k' },
      { weight: 12, label: 'Still has workable equity' },
      { weight: 10, label: 'Last open house was over two months ago' },
    ],
    contacts: [],
    timeline: [
      { date: 'September 8',  text: 'Listed at $599,000' },
      { date: 'December 2',   text: 'Price reduced to $549,000' },
      { date: 'March 4',      text: 'Price reduced to $519,000' },
    ],
    coord: { x: 64, y: 38 }, days: 31, contacted: false,
  },
];

export const NAV_COUNTS: Record<string, number | null> = {
  '/today':      8,
  '/situations': null,
  '/outreach':   5,
  '/calling':    3,
  '/front-desk': 4,
  '/pipeline':   16,
  '/market':     null,
};

export const PIPELINE_STAGES = [
  { id: 'new',        label: 'New' },
  { id: 'contacted',  label: 'Contacted' },
  { id: 'engaged',    label: 'Talking' },
  { id: 'consult',    label: 'Walkthrough' },
  { id: 'contract',   label: 'Under Contract' },
  { id: 'closed',     label: 'Closed' },
];

export const PIPELINE_CARDS: Array<{
  stage: string; name: string; addr: string; situation: string;
  score: number; value: number; age: string; leadId?: string;
}> = [
  { stage:'new', name:'Margaret L. Holloway', addr:'2847 Oleander Way', situation:'Pre-probate match', score:94, value:412000, age:'12 days ago', leadId:'L-2847' },
  { stage:'new', name:'William J. Pratt',     addr:'891 Cedar Glen Ln', situation:'Drive-by vision',   score:78, value:268000, age:'4 days ago',  leadId:'L-0891' },
  { stage:'new', name:'Patricia & D. Reeves', addr:'5612 Sandcastle Dr',situation:'Senior, high equity', score:87, value:295000, age:'21 days ago', leadId:'L-5612' },
  { stage:'new', name:'Trevor M. Madsen',     addr:'1408 Magnolia Ave', situation:'Incarceration risk',score:72, value:170000, age:'9 days ago',  leadId:'L-1408' },

  { stage:'contacted', name:'Estate of R. Vega',     addr:'1142 Pinebrook Rd', situation:'Probate filed',        score:91, value:345000, age:'6 days ago',  leadId:'L-1142' },
  { stage:'contacted', name:'Marcus & L. Bennett',   addr:'3719 Bayview Cir',  situation:'Pre-foreclosure',      score:85, value:165000, age:'17 days ago', leadId:'L-3719' },
  { stage:'contacted', name:'Estate of H. Murphy',   addr:'4256 Tarpon Dr',    situation:'Estate-sale activity', score:76, value:354000, age:'23 days ago', leadId:'L-4256' },

  { stage:'engaged', name:'Linda Vega-Brennan',  addr:'1142 Pinebrook Rd', situation:'Probate filed',         score:91, value:345000, age:'3 days ago',  leadId:'L-1142' },
  { stage:'engaged', name:'Robert Eastwood',     addr:'608 Palm Aire Dr',  situation:'Pre-divorce signals',   score:79, value:228000, age:'14 days ago' },

  { stage:'consult', name:'Anthony Vega',        addr:'1142 Pinebrook Rd', situation:'Probate filed',         score:91, value:345000, age:'tomorrow',   leadId:'L-1142' },
  { stage:'consult', name:'Janelle Ortiz',       addr:'82 Sea Grape Ln',   situation:'Senior, high equity',   score:88, value:401000, age:'Friday' },

  { stage:'contract', name:'Estate of A. Yi',    addr:'7204 Catalina Ct',  situation:'Probate filed',         score:93, value:476000, age:'signs Monday' },

  { stage:'closed',   name:'Estate of T. Worth', addr:'2218 Conway Blvd',  situation:'Pre-probate match',     score:96, value:288000, age:'closed May 6 · $46,000 fee' },
];
