export const platforms = ['Blinkit', 'Zepto', 'Swiggy Instamart'];

export const zones = [
  { id: '560037', name: 'Bellandur', pincode: '560037' },
  { id: '560103', name: 'Kadubeesanahalli', pincode: '560103' },
  { id: '560102', name: 'HSR Layout', pincode: '560102' },
  { id: '560066', name: 'Whitefield', pincode: '560066' },
  { id: '560095', name: 'Koramangala', pincode: '560095' },
];

export const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    weeklyPremium: 49,
    payout: 'Up to Rs 1,500',
    description: 'Entry cover for a single missed shift.',
  },
  {
    id: 'standard',
    name: 'Standard',
    weeklyPremium: 79,
    payout: 'Up to Rs 3,000',
    description: 'Balanced weekly cover for high-risk weather days.',
  },
  {
    id: 'premium',
    name: 'Premium',
    weeklyPremium: 119,
    payout: 'Up to Rs 5,000',
    description: 'Best payout support for longer disruption windows.',
  },
];

export const initialWorker = {
  name: 'Aarav Kumar',
  phone: '9876543210',
  platform: 'Blinkit',
  zone: 'Bellandur',
  pincode: '560037',
  coverageStatus: 'Active',
  tier: 'Standard',
  weeklyPremium: 79,
  upiId: 'aarav@oksbi',
  loyaltyStreak: '6 weeks',
};

export const initialWeather = {
  pincode: '560037',
  risk: 'Moderate',
  summary: 'Heavy rain is expected after 6 PM, so downtime risk is elevated.',
};

export const initialPayouts = [
  { id: 1, date: '18 Mar 2026', trigger: 'Rain downtime', amount: 420 },
  { id: 2, date: '11 Mar 2026', trigger: 'Heat alert', amount: 260 },
  { id: 3, date: '03 Mar 2026', trigger: 'Flooded route block', amount: 780 },
];

export const initialClaims = [
  {
    id: 1,
    date: '12 Mar 2026',
    triggerType: 'Rain shutdown',
    amount: 760,
    status: 'Paid',
  },
  {
    id: 2,
    date: '07 Mar 2026',
    triggerType: 'Heatwave slowdown',
    amount: 380,
    status: 'Under Review',
  },
  {
    id: 3,
    date: '26 Feb 2026',
    triggerType: 'Missed shift verification',
    amount: 450,
    status: 'Rejected',
  },
];
