import { RemedyDetails } from './types';

export function calculateRemedies(
  missingNumbers: number[],
  weakPlanes: string[],
  driver: number,
  bhagyank: number
): RemedyDetails {
  const colors: string[] = [];
  const gemstones: string[] = [];
  const yantras: string[] = [];
  const mantras: string[] = [];
  const luckyDates: number[] = [];
  const luckyDays: string[] = [];
  let remedyText = '';

  // Calculate Lucky Days based on Driver planet
  if (driver === 1) {
    luckyDays.push('Sunday', 'Monday');
    luckyDates.push(1, 10, 19, 28);
    colors.push('Golden', 'Orange', 'Yellow');
    gemstones.push('Ruby (माणिक्य)');
    mantras.push('OM ADITYAYA NAMAH (ॐ आदित्याये नमः)');
    yantras.push('Surya Yantra');
  } else if (driver === 2) {
    luckyDays.push('Monday', 'Sunday', 'Friday');
    luckyDates.push(2, 11, 20, 29);
    colors.push('White', 'Cream', 'Silver');
    gemstones.push('Pearl (मोती)');
    mantras.push('OM SOM SOMA_YAE NAMAH (ॐ सोमाय नमः)');
    yantras.push('Chandra Yantra');
  } else if (driver === 3) {
    luckyDays.push('Thursday', 'Tuesday');
    luckyDates.push(3, 12, 21, 30);
    colors.push('Yellow', 'Saffron');
    gemstones.push('Yellow Sapphire (पुखराज)');
    mantras.push('OM GURAVE NAMAH (ॐ गुरवे नमः)');
    yantras.push('Guru Yantra');
  } else if (driver === 4) {
    luckyDays.push('Sunday', 'Monday', 'Saturday');
    luckyDates.push(4, 13, 22, 31);
    colors.push('Blue', 'Grey');
    gemstones.push('Hessonite (गोमेद)');
    mantras.push('OM RAHAVE NAMAH (ॐ राहवे नमः)');
    yantras.push('Rahu Yantra');
  } else if (driver === 5) {
    luckyDays.push('Wednesday', 'Friday');
    luckyDates.push(5, 14, 23);
    colors.push('Green', 'Light Blue');
    gemstones.push('Emerald (पन्ना)');
    mantras.push('OM BUDHAYA NAMAH (ॐ बुधाय नमः)');
    yantras.push('Budh Yantra');
  } else if (driver === 6) {
    luckyDays.push('Friday', 'Wednesday');
    luckyDates.push(6, 15, 24);
    colors.push('White', 'Pink', 'Light Blue');
    gemstones.push('Diamond (हीरा)', 'Opal');
    mantras.push('OM SHUKRAYA NAMAH (ॐ शुक्राय नमः)');
    yantras.push('Shukra Yantra');
  } else if (driver === 7) {
    luckyDays.push('Monday', 'Thursday');
    luckyDates.push(7, 16, 25);
    colors.push('Light Green', 'White');
    gemstones.push('Cat\'s Eye (लहसुनिया)');
    mantras.push('OM KEM KETAVE NAMAH (ॐ केतवे नमः)');
    yantras.push('Ketu Yantra');
  } else if (driver === 8) {
    luckyDays.push('Saturday', 'Friday');
    luckyDates.push(8, 17, 26);
    colors.push('Black', 'Dark Blue');
    gemstones.push('Blue Sapphire (नीलम)', 'Amethyst');
    mantras.push('OM SHANISHCHARAYA NAMAH (ॐ शनैश्चराय नमः)');
    yantras.push('Shani Yantra');
  } else if (driver === 9) {
    luckyDays.push('Tuesday', 'Thursday', 'Sunday');
    luckyDates.push(9, 18, 27);
    colors.push('Red', 'Pink');
    gemstones.push('Red Coral (मूंगा)');
    mantras.push('OM ANGARAKAYA NAMAH (ॐ अंगारकाय नमः)');
    yantras.push('Mangal Yantra');
  }

  // Remedies for missing numbers
  if (missingNumbers.includes(5)) {
    remedyText += 'Central element 5 is missing. Hang a brass windchime or keep yellow salt lamps in the center. ';
    mantras.push('OM BUDHAYA NAMAH (ॐ बुधाय नमः) - 108 times');
  }
  if (missingNumbers.includes(6)) {
    remedyText += 'Venus element 6 is missing. Wear opal or diamond, and use silver utensils. ';
    colors.push('White');
  }
  if (missingNumbers.includes(8)) {
    remedyText += 'Earth element 8 is missing. Walk barefoot on clean soil or grass daily. ';
    gemstones.push('Amethyst');
  }
  if (missingNumbers.includes(2)) {
    remedyText += 'Water/Emotional element 2 is missing. Carry a silver coin in your wallet and drink water from silver cups. ';
  }

  // Handle weak planes
  weakPlanes.forEach(planeName => {
    if (planeName.includes('Mental')) {
      remedyText += 'Strengthen Mental Plane by meditating with clear quartz crystals. ';
    } else if (planeName.includes('Emotional')) {
      remedyText += 'Emotional balancing recommended: wear a natural pearl. ';
    } else if (planeName.includes('Practical')) {
      remedyText += 'Support Practical Execution: begin a daily budget logger. ';
    }
  });

  if (!remedyText) {
    remedyText = 'All core elemental planes are active and balanced. Chant planet mantras 27 times to maintain high-vibration synergy.';
  }

  return {
    colors,
    gemstones,
    luckyDates,
    luckyDays,
    remedyText,
    yantras,
    mantras: Array.from(new Set(mantras))
  };
}
