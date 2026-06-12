import { useState } from 'react';
import { GripVertical, AlertTriangle, AlertCircle, Minus, Star, Pencil, Trash2, Info } from 'lucide-react';
import { useAppStore, getSeverityText } from '@/store';
import { cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Switch, Badge, Button } from '@/components';
import type { IssueSeverity } from '@/types';

const severityIcons: Record<IssueSeverity, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Minus,
  low: Minus,
  info: Info,
};

const getSeverityColor = (severity: IssueSeverity): string => {
  const colors: Record<IssueSeverity, string> = {
    critical: 'text-severity-blocker',
    high: 'text-severity-critical',
    medium: 'text-severity-warning',
    low: 'text-primary-400',
    info: 'text-severity-info',
  };
  return colors[severity];
};

const getSeverityBadgeColor = (severity: IssueSeverity): string => {
  const colors: Record<IssueSeverity, string> = {
    critical: 'bg-severity-blocker/20 text-severity-blocker border border-severity-blocker/30',
    high: 'bg-severity-critical/20 text-severity-critical border border-severity-critical/30',
    medium: 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30',
    low: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    info: 'bg-severity-info/20 text-severity-info border border-severity-info/30',
  };
  return colors[severity];
};

export default function RuleList() {
  const { rules, toggleRule, reorderRules } = useAppStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const sortedRules = [...rules].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    reorderRules(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const enabledCount = rules.filter((r) => r.enabled).length;
  const mandatoryCount = rules.filter((r) => r.isMandatory).length;

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-dark-100">评审规则列表</CardTitle>
            <p className="text-sm text-dark-400 mt-1">
              共 {rules.length} 条规则，已启用 {enabledCount} 条，必须通过 {mandatoryCount} 条
            </p>
          </div>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">
            <Pencil className="w-4 h-4 mr-2" />
            新增规则
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedRules.map((rule, index) => {
            const Icon = severityIcons[rule.severity];
            return (
              <div
                key={rule.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border transition-all animate-fade-in',
                  draggedIndex === index
                    ? 'opacity-50 border-primary-500/50 bg-primary-500/10'
                    : 'border-dark-700/50 hover:border-primary-500/30 bg-dark-800/30 hover:bg-dark-800/60',
                  !rule.enabled ? 'opacity-60' : ''
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing text-dark-500 hover:text-dark-300"
                >
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${getSeverityColor(rule.severity)}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-dark-100">{rule.name}</span>
                    <Badge className={getSeverityBadgeColor(rule.severity)}>
                      {getSeverityText(rule.severity)}
                    </Badge>
                    <Badge className="bg-dark-700/50 text-dark-300 border border-dark-600/50">
                      {rule.category}
                    </Badge>
                    {rule.isMandatory && (
                      <Badge className="bg-severity-warning/20 text-severity-warning border border-severity-warning/30">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        必须通过
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-dark-400">{rule.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'text-dark-400 hover:text-dark-100 hover:bg-dark-700/50'
                    )}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'text-severity-blocker hover:text-severity-blocker',
                      'hover:bg-severity-blocker/10'
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
