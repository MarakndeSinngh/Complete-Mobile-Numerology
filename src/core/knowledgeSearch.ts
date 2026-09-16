/**
 * LEOFAMILY INTERNAL KNOWLEDGE RETRIEVAL LAYER
 * Provides direct structured lookup across:
 * - Numbers 1-9 & Planetary Rulers
 * - Mobile Pairs & Compounds
 * - Planes & Arrows
 * - Missing & Repetitive Numbers
 * - 81 Mulank-Bhagyank Combinations
 * - Professions & Remedies
 */

import { NUMBER_DEFINITIONS } from './methodology/numberMeanings';
import { PLANET_DEFINITIONS } from './methodology/planetMappings';
import { MASTER_PLANES } from './methodology/planeDefinitions';
import { MASTER_ARROWS } from './methodology/arrowDefinitions';
import { getCombination81 } from './methodology/combinationDefinitions';
import { MOBILE_COMPOUND_DATABASE, SPECIAL_PURPOSE_COMBINATIONS, MOBILE_POSITIONS } from './methodology/mobileDefinitions';
import { PAIR_MEANINGS } from '../services/pairMeanings';
import { VASTU_ZONES } from './methodology/vastuDefinitions';
import { WELLNESS_DEFINITIONS } from './methodology/wellnessDefinitions';

export interface KnowledgeSearchResult {
  queryType: string;
  key: string;
  found: boolean;
  title: string;
  structuredData: any;
  interpretation: string;
  source: string;
}

export function searchKnowledgeBase(type: 'number' | 'pair' | 'compound' | 'plane' | 'arrow' | 'combination' | 'vastu' | 'wellness' | 'special_purpose', key: string | number): KnowledgeSearchResult {
  const strKey = String(key).trim();

  switch (type) {
    case 'number': {
      const num = parseInt(strKey, 10);
      const def = NUMBER_DEFINITIONS[num];
      if (def) {
        return {
          queryType: 'NUMBER_ARCHETYPE',
          key: strKey,
          found: true,
          title: `Number ${num}: ${def.planet}`,
          structuredData: def,
          interpretation: def.personality,
          source: 'LeoFamily Approved Number Archetypes'
        };
      }
      break;
    }

    case 'pair': {
      const pair = PAIR_MEANINGS[strKey];
      if (pair) {
        return {
          queryType: 'MOBILE_PAIR',
          key: strKey,
          found: true,
          title: `Mobile Pair ${strKey}: ${pair.meaning}`,
          structuredData: pair,
          interpretation: `${pair.positive} (Caution: ${pair.negative})`,
          source: 'LeoFamily Mobile Numerology Course'
        };
      }
      break;
    }

    case 'compound': {
      const cmp = parseInt(strKey, 10);
      const data = MOBILE_COMPOUND_DATABASE[cmp];
      if (data) {
        return {
          queryType: 'COMPOUND_NUMBER',
          key: strKey,
          found: true,
          title: `Compound ${cmp}: ${data.title} [${data.rating}]`,
          structuredData: data,
          interpretation: data.meaning,
          source: 'LeoFamily Compound Classifications'
        };
      }
      break;
    }

    case 'plane': {
      const plane = MASTER_PLANES.find(p => p.id.toLowerCase().includes(strKey.toLowerCase()) || p.name.toLowerCase().includes(strKey.toLowerCase()));
      if (plane) {
        return {
          queryType: 'LOSHU_PLANE',
          key: strKey,
          found: true,
          title: `${plane.name} (${plane.digits.join('-')})`,
          structuredData: plane,
          interpretation: plane.description,
          source: 'LeoFamily Master Plane Registry'
        };
      }
      break;
    }

    case 'arrow': {
      const arrow = MASTER_ARROWS.find(a => a.id.toLowerCase().includes(strKey.toLowerCase()) || a.name.toLowerCase().includes(strKey.toLowerCase()));
      if (arrow) {
        return {
          queryType: 'LOSHU_ARROW',
          key: strKey,
          found: true,
          title: `${arrow.name} [${arrow.digits.join('-')}] (${arrow.type})`,
          structuredData: arrow,
          interpretation: arrow.meaning,
          source: 'LeoFamily Master Arrow Registry'
        };
      }
      break;
    }

    case 'combination': {
      const parts = strKey.split(/[-_]/).map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const comb = getCombination81(parts[0], parts[1]);
        return {
          queryType: '81_COMBINATION',
          key: strKey,
          found: true,
          title: `Mulank ${comb.mulank} - Bhagyank ${comb.bhagyank}: ${comb.title}`,
          structuredData: comb,
          interpretation: comb.positiveMeaning,
          source: comb.source
        };
      }
      break;
    }

    case 'vastu': {
      const zone = Object.values(VASTU_ZONES).find(z => z.direction.toLowerCase() === strKey.toLowerCase() || z.hindiName.includes(strKey));
      if (zone) {
        return {
          queryType: 'VASTU_DIRECTION',
          key: strKey,
          found: true,
          title: `${zone.direction} Zone (${zone.element} - Digit ${zone.loShuDigit})`,
          structuredData: zone,
          interpretation: zone.lifeDomain,
          source: 'LeoFamily Numero-Vastu Integration'
        };
      }
      break;
    }

    case 'wellness': {
      const num = parseInt(strKey, 10);
      const well = WELLNESS_DEFINITIONS[num];
      if (well) {
        return {
          queryType: 'TRADITIONAL_WELLNESS',
          key: strKey,
          found: true,
          title: `Digit ${num} (${well.planetaryRuler}) Ayurvedic Tridosha Resonance`,
          structuredData: well,
          interpretation: `Ayurvedic Dosha: ${well.ayurvedicDosha}. Organ resonance: ${well.organResonance}. Traditional caution only.`,
          source: 'LeoFamily Medical Numerology & Wellness Reference'
        };
      }
      break;
    }

    case 'special_purpose': {
      const comb = SPECIAL_PURPOSE_COMBINATIONS.find(c => c.name.toLowerCase().includes(strKey.toLowerCase()) || c.category.toLowerCase() === strKey.toLowerCase());
      if (comb) {
        return {
          queryType: 'SPECIAL_PURPOSE_COMBINATION',
          key: strKey,
          found: true,
          title: `${comb.name} (${comb.category})`,
          structuredData: comb,
          interpretation: comb.traditionalMeaning,
          source: 'LeoFamily Special Purpose Combinations'
        };
      }
      break;
    }
  }

  return {
    queryType: type.toUpperCase(),
    key: strKey,
    found: false,
    title: 'Not Found in Knowledge Base',
    structuredData: null,
    interpretation: 'No direct entry found matching the query in the authoritative knowledge base.',
    source: 'LeoFamily Knowledge Repository'
  };
}
