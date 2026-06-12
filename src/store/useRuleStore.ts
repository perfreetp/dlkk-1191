import { create } from 'zustand';
import type { RuleTemplate } from '../types';
import { mockRules, mandatoryRuleIds } from '../data/rules';

interface RuleState {
  rules: RuleTemplate[];
  mandatoryChecks: string[];
  loading: boolean;
  fetchRules: () => Promise<void>;
  toggleRule: (ruleId: string) => void;
  updateRulePriority: (ruleId: string, priority: number) => void;
  addRule: (rule: Omit<RuleTemplate, 'id'>) => void;
  updateMandatoryChecks: (ruleIds: string[]) => void;
  getEnabledRules: () => RuleTemplate[];
  getMandatoryRules: () => RuleTemplate[];
  getRulesByCategory: (category: string) => RuleTemplate[];
}

export const useRuleStore = create<RuleState>((set, get) => ({
  rules: [],
  mandatoryChecks: mandatoryRuleIds,
  loading: false,
  fetchRules: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ rules: mockRules, loading: false });
  },
  toggleRule: (ruleId: string) => {
    set(state => ({
      rules: state.rules.map(rule =>
        rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
      ),
    }));
  },
  updateRulePriority: (ruleId: string, priority: number) => {
    set(state => ({
      rules: state.rules.map(rule =>
        rule.id === ruleId ? { ...rule, priority } : rule
      ),
    }));
  },
  addRule: (rule: Omit<RuleTemplate, 'id'>) => {
    const newRule: RuleTemplate = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    set(state => ({
      rules: [...state.rules, newRule],
    }));
  },
  updateMandatoryChecks: (ruleIds: string[]) => {
    set({ mandatoryChecks: ruleIds });
  },
  getEnabledRules: () => {
    return get().rules.filter(r => r.isEnabled);
  },
  getMandatoryRules: () => {
    const { rules, mandatoryChecks } = get();
    return rules.filter(r => mandatoryChecks.includes(r.id));
  },
  getRulesByCategory: (category: string) => {
    return get().rules.filter(r => r.category === category);
  },
}));
