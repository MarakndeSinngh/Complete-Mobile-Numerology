import { SourceCitation, SOURCES, KnowledgeLevel } from './sourceRegistry';

export interface MethodologyRule {
  id: string;
  category:
    | 'NUMBER'
    | 'PLANET'
    | 'LOSHU'
    | 'PLANE'
    | 'ARROW'
    | 'COMBINATION'
    | 'MOBILE'
    | 'VASTU'
    | 'DASHA'
    | 'WELLNESS'
    | 'REMEDY'
    | 'CAREER'
    | 'WEALTH'
    | 'RELATIONSHIP';
  ruleName: string;
  system: 'LEOFAMILY' | 'CHALDEAN' | 'PYTHAGOREAN' | 'VEDIC' | 'KUA';
  source: SourceCitation;
  description: string;
  interpretation: string;
  confidence: number;
  safetyLevel: 'SAFE' | 'TRADITIONAL_CAUTION' | 'MANDATORY_DISCLAIMER';
  details?: Record<string, any>;
}

class MethodologyRegistryStore {
  private rules: Map<string, MethodologyRule> = new Map();

  public registerRule(rule: MethodologyRule): void {
    this.rules.set(rule.id, rule);
  }

  public registerRules(rules: MethodologyRule[]): void {
    rules.forEach((r) => this.registerRule(r));
  }

  public getRule(id: string): MethodologyRule | undefined {
    return this.rules.get(id);
  }

  public getRulesByCategory(category: MethodologyRule['category']): MethodologyRule[] {
    return Array.from(this.rules.values()).filter((r) => r.category === category);
  }

  public getRulesBySystem(system: MethodologyRule['system']): MethodologyRule[] {
    return Array.from(this.rules.values()).filter((r) => r.system === system);
  }

  public getAllRules(): MethodologyRule[] {
    return Array.from(this.rules.values());
  }

  public search(query: {
    category?: MethodologyRule['category'];
    system?: MethodologyRule['system'];
    searchTerm?: string;
  }): MethodologyRule[] {
    let result = Array.from(this.rules.values());
    if (query.category) {
      result = result.filter((r) => r.category === query.category);
    }
    if (query.system) {
      result = result.filter((r) => r.system === query.system);
    }
    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.ruleName.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.interpretation.toLowerCase().includes(term) ||
          r.id.toLowerCase().includes(term)
      );
    }
    return result;
  }
}

export const methodologyRegistry = new MethodologyRegistryStore();
