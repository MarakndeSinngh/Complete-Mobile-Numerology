/**
 * LEOFAMILY KUA / DIRECTIONAL HARMONY ENGINE
 * Calculates Kua Number and Directional Alignments
 * Never called "Angel Number" — strictly identified as Kua Number.
 */

export interface KuaProfile {
  kuaNumber: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  group: 'EAST_GROUP' | 'WEST_GROUP';
  element: string;
  trigram: string;
  favourableDirections: {
    shengChi: string; // Wealth & Success
    tianYi: string;   // Health & Vitality
    yanNian: string;  // Love & Relationships
    fuWei: string;    // Personal Growth & Stability
  };
  unfavourableDirections: {
    huoHai: string;   // Obstacles
    wuGui: string;    // Five Ghosts / Disagreements
    liuSha: string;   // Six Killings / Legal / Scandals
    jueMing: string;  // Total Loss / Extreme Caution
  };
  summary: string;
}

export function calculateKuaNumber(birthYear: number, gender: 'MALE' | 'FEMALE' | 'OTHER'): KuaProfile {
  // Sum digits of birth year to single digit
  const yearSum = String(birthYear)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  let reducedYear = yearSum;
  while (reducedYear > 9) {
    reducedYear = String(reducedYear)
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }

  let kua = 0;
  const isPost2000 = birthYear >= 2000;

  if (gender === 'FEMALE') {
    kua = isPost2000 ? reducedYear + 6 : reducedYear + 5;
  } else {
    // MALE or OTHER default
    kua = isPost2000 ? 9 - reducedYear : 10 - reducedYear;
  }

  while (kua > 9) {
    kua = String(kua)
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  if (kua <= 0) kua = 9;

  // If Kua is 5, adjust based on gender: Male becomes 2, Female becomes 8
  if (kua === 5) {
    kua = gender === 'FEMALE' ? 8 : 2;
  }

  const isEastGroup = [1, 3, 4, 9].includes(kua);
  const group: KuaProfile['group'] = isEastGroup ? 'EAST_GROUP' : 'WEST_GROUP';

  const KUA_CONFIGS: Record<number, { element: string; trigram: string; fav: KuaProfile['favourableDirections']; unfav: KuaProfile['unfavourableDirections'] }> = {
    1: {
      element: 'Water',
      trigram: 'Kan',
      fav: { shengChi: 'South-East', tianYi: 'East', yanNian: 'South', fuWei: 'North' },
      unfav: { huoHai: 'West', wuGui: 'North-East', liuSha: 'North-West', jueMing: 'South-West' }
    },
    2: {
      element: 'Earth',
      trigram: 'Kun',
      fav: { shengChi: 'North-East', tianYi: 'West', yanNian: 'North-West', fuWei: 'South-West' },
      unfav: { huoHai: 'East', wuGui: 'South-East', liuSha: 'South', jueMing: 'North' }
    },
    3: {
      element: 'Wood',
      trigram: 'Zhen',
      fav: { shengChi: 'South', tianYi: 'North', yanNian: 'South-East', fuWei: 'East' },
      unfav: { huoHai: 'South-West', wuGui: 'North-West', liuSha: 'North-East', jueMing: 'West' }
    },
    4: {
      element: 'Wood',
      trigram: 'Xun',
      fav: { shengChi: 'North', tianYi: 'South', yanNian: 'East', fuWei: 'South-East' },
      unfav: { huoHai: 'North-West', wuGui: 'South-West', liuSha: 'West', jueMing: 'North-East' }
    },
    6: {
      element: 'Metal',
      trigram: 'Qian',
      fav: { shengChi: 'West', tianYi: 'North-East', yanNian: 'South-West', fuWei: 'North-West' },
      unfav: { huoHai: 'South-East', wuGui: 'East', liuSha: 'North', jueMing: 'South' }
    },
    7: {
      element: 'Metal',
      trigram: 'Dui',
      fav: { shengChi: 'North-West', tianYi: 'South-West', yanNian: 'North-East', fuWei: 'West' },
      unfav: { huoHai: 'North', wuGui: 'South', liuSha: 'South-East', jueMing: 'East' }
    },
    8: {
      element: 'Earth',
      trigram: 'Gen',
      fav: { shengChi: 'South-West', tianYi: 'North-West', yanNian: 'West', fuWei: 'North-East' },
      unfav: { huoHai: 'South', wuGui: 'North', liuSha: 'East', jueMing: 'South-East' }
    },
    9: {
      element: 'Fire',
      trigram: 'Li',
      fav: { shengChi: 'East', tianYi: 'South-East', yanNian: 'North', fuWei: 'South' },
      unfav: { huoHai: 'North-East', wuGui: 'West', liuSha: 'South-West', jueMing: 'North-West' }
    }
  };

  const config = KUA_CONFIGS[kua] || KUA_CONFIGS[1];

  return {
    kuaNumber: kua,
    gender,
    group,
    element: config.element,
    trigram: config.trigram,
    favourableDirections: config.fav,
    unfavourableDirections: config.unfav,
    summary: `Kua Number ${kua} belongs to the ${group === 'EAST_GROUP' ? 'East Group (Water, Wood, Fire)' : 'West Group (Earth, Metal)'}. Primary wealth & success orientation aligns toward ${config.fav.shengChi}.`
  };
}
