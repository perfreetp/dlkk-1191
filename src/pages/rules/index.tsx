import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components';
import RuleList from './RuleList';
import MandatoryChecks from './MandatoryChecks';
import TemplateManager from './TemplateManager';

export default function RulesPage() {
  const { rules, mandatoryChecks, issueTemplates } = useAppStore();
  const [activeTab, setActiveTab] = useState('rules');

  const enabledRules = rules.filter((r) => r.enabled).length;
  const enabledChecks = mandatoryChecks.filter((c) => c.enabled).length;

  const summaryCards = [
    {
      label: '评审规则',
      value: rules.length,
      badge: { text: `${enabledRules} 条已启用`, variant: 'success', color: 'bg-severity-info/20 text-severity-info border border-severity-info/30' },
    },
    {
      label: '必须通过检查',
      value: mandatoryChecks.length,
      badge: { text: `${enabledChecks} 项已启用`, variant: 'info', color: 'bg-primary-500/20 text-primary-400 border border-primary-500/30' },
    },
    {
      label: '问题模板',
      value: issueTemplates.length,
      badge: { text: '快捷创建', variant: 'warning', color: 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' },
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-dark-100">团队规则</h1>
          </div>
          <p className="text-dark-400">配置代码评审规则、检查项和问题模板</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {summaryCards.map((card, index) => (
            <Card key={index} className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-400 mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-dark-100">{card.value}</p>
                  </div>
                  <Badge className={card.badge.color}>{card.badge.text}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-dark-800/50 text-dark-300">
              <TabsTrigger
                value="rules"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                评审规则
              </TabsTrigger>
              <TabsTrigger
                value="checks"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                必须通过检查
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                问题模板
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rules">
              <RuleList />
            </TabsContent>

            <TabsContent value="checks">
              <MandatoryChecks />
            </TabsContent>

            <TabsContent value="templates">
              <TemplateManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
