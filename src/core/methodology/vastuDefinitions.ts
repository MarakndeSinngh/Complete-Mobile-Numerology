import { MethodologyRule, methodologyRegistry } from './methodologyRegistry';
import { SOURCES } from './sourceRegistry';

export interface VastuDirectionZone {
  direction: string;
  hindiName: string;
  rulingPlanet: string;
  element: 'Water' | 'Air' | 'Fire' | 'Earth' | 'Space' | 'Metal' | 'Wood';
  loShuDigit: number;
  lifeDomain: string;
  favorableActivities: string[];
  unfavorableElements: string[];
  remedy: string;
}

export const VASTU_ZONES: Record<string, VastuDirectionZone> = {
  NORTH: {
    direction: 'North',
    hindiName: 'उत्तर (कुबेर स्थान)',
    rulingPlanet: 'Mercury / Sun (Lo Shu 1: Water)',
    element: 'Water',
    loShuDigit: 1,
    lifeDomain: 'Career opportunities, new financial avenues, cash flow',
    favorableActivities: ['Open spaces', 'Water fountains', 'Cash locker facing North', 'Study desk facing North'],
    unfavorableElements: ['Kitchen/Fire', 'Heavy clutter', 'Toilet directly in North'],
    remedy: 'Keep a clean brass bowl of fresh water; use blue or green accents; place money plant in water.'
  },
  NORTH_EAST: {
    direction: 'North-East',
    hindiName: 'ईशान कोण (देव स्थान)',
    rulingPlanet: 'Jupiter (Lo Shu 8: Earth / Wisdom)',
    element: 'Water / Space',
    loShuDigit: 8,
    lifeDomain: 'Clarity of mind, spiritual growth, divine blessings, intuition',
    favorableActivities: ['Prayer room (Puja)', 'Meditation altar', 'Reading / Study sanctuary', 'Underground water tank'],
    unfavorableElements: ['Heavy junk storage', 'Overhead water tank', 'Kitchen stove', 'Toilet'],
    remedy: 'Keep crystal pyramid or fresh Gangajal in copper vessel; ensure maximum natural light.'
  },
  EAST: {
    direction: 'East',
    hindiName: 'पूर्व (इन्द्र स्थान)',
    rulingPlanet: 'Sun / Jupiter (Lo Shu 3: Wood)',
    element: 'Wood',
    loShuDigit: 3,
    lifeDomain: 'Social connections, health vitality, paternal lineage support, reputation',
    favorableActivities: ['Main entrance', 'Living room seating', 'Morning sun exposure', 'Green indoor plants'],
    unfavorableElements: ['Darkness', 'Tall blind walls', 'Garbage bin'],
    remedy: 'Hang a copper Sun yantra on East wall; place healthy green foliage plants.'
  },
  SOUTH_EAST: {
    direction: 'South-East',
    hindiName: 'आग्नेय कोण (अग्नि स्थान)',
    rulingPlanet: 'Venus (Lo Shu 4: Wood/Wealth)',
    element: 'Fire',
    loShuDigit: 4,
    lifeDomain: 'Cash liquidity, female health vitality, physical vigor, kitchen wealth',
    favorableActivities: ['Kitchen / Cooking stove', 'Electrical panels', 'Inverter / Generator', 'Warm lighting'],
    unfavorableElements: ['Water fountain', 'Underground water tank', 'Master bedroom'],
    remedy: 'Light a red/orange bulb or use camphor diffuser in South-East; avoid blue or black decor here.'
  },
  SOUTH: {
    direction: 'South',
    hindiName: 'दक्षिण (यम स्थान)',
    rulingPlanet: 'Mars (Lo Shu 9: Fire)',
    element: 'Fire',
    loShuDigit: 9,
    lifeDomain: 'Fame, societal standing, public recognition, confidence, legal victory',
    favorableActivities: ['Awards and certificate display', 'Heavy furniture storage', 'Bed headboard facing South'],
    unfavorableElements: ['Main water borewell', 'Excessive open glass facades'],
    remedy: 'Display certificates and red coral or crimson artwork; keep South wall solid and elevated.'
  },
  SOUTH_WEST: {
    direction: 'South-West',
    hindiName: 'नैऋत्य कोण (पितृ / स्थिरता स्थान)',
    rulingPlanet: 'Rahu / Saturn (Lo Shu 2: Earth)',
    element: 'Earth',
    loShuDigit: 2,
    lifeDomain: 'Stability, relationship harmony, master bedroom, decision authority, land mastery',
    favorableActivities: ['Master bedroom for family head', 'Heavy stone artifacts', 'Important family safe / locker'],
    unfavorableElements: ['Main entrance', 'Underground water tank', 'Balcony extension / open cuts'],
    remedy: 'Place heavy brass artifacts or yellow jasper stone; keep South-West corner heaviest and highest.'
  },
  WEST: {
    direction: 'West',
    hindiName: 'पश्चिम (वरुण स्थान)',
    rulingPlanet: 'Saturn (Lo Shu 7: Metal)',
    element: 'Metal',
    loShuDigit: 7,
    lifeDomain: 'Children prosperity, creative output, profitability from investments',
    favorableActivities: ['Children bedroom', 'Dining room', 'Overhead water tank', 'Metal wind chimes'],
    unfavorableElements: ['Underground tank', 'Broken electronics'],
    remedy: 'Hang a 6-rod metal wind chime; keep white or grey metallic decor.'
  },
  NORTH_WEST: {
    direction: 'North-West',
    hindiName: 'वायव्य कोण (वायु स्थान)',
    rulingPlanet: 'Moon (Lo Shu 6: Metal / Venus)',
    element: 'Air / Metal',
    loShuDigit: 6,
    lifeDomain: 'Helpful friends, banking support, international travel, finished goods transit',
    favorableActivities: ['Guest room', 'Finished goods warehouse', 'Travel documents locker', 'Garage'],
    unfavorableElements: ['Heavy permanent clutter', 'Dark suffocating colors'],
    remedy: 'Keep light silver or cream colors; ensure continuous fresh air circulation.'
  },
  CENTER: {
    direction: 'Center (Brahmasthan)',
    hindiName: 'ब्रह्मस्थान (नाभि स्थान)',
    rulingPlanet: 'Mercury (Lo Shu 5: Earth)',
    element: 'Space / Ether',
    loShuDigit: 5,
    lifeDomain: 'Core life equilibrium, cosmic breath, central health, whole-family prosperity',
    favorableActivities: ['Open central courtyard', 'Soft central lighting', 'Clear uncluttered walking space'],
    unfavorableElements: ['Heavy pillar', 'Staircase', 'Kitchen or toilet in exact center'],
    remedy: 'Strictly keep the geometric center of home uncluttered, clean, and spiritually revered.'
  }
};

// Register Vastu in methodology registry
methodologyRegistry.registerRule({
  id: 'VASTU_CORE_ZONING',
  category: 'VASTU',
  ruleName: 'LeoFamily Numero-Vastu 8-Directional & Central Matrix',
  system: 'LEOFAMILY',
  source: SOURCES.LEOFAMILY_NUMERO_VASTU_PDF,
  description: 'Integration of Lo Shu matrix numbers with classical Indian Vastu directional zones and elements.',
  interpretation: 'Optimizes residential and commercial spaces without distorting mathematical Lo Shu counts.',
  confidence: 100,
  safetyLevel: 'SAFE',
  details: VASTU_ZONES
});
