import { ShieldCheck, Info } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Switch } from '@/components';

export default function MandatoryChecks() {
  const { mandatoryChecks, toggleMandatoryCheck } = useAppStore();

  const enabledCount = mandatoryChecks.filter((c) => c.enabled).length;

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-severity-info" />
          <CardTitle className="text-dark-100">必须通过检查项</CardTitle>
        </div>
        <p className="text-sm text-dark-400 mt-1">
          已启用 {enabledCount} / {mandatoryChecks.length} 项检查
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mandatoryChecks.map((check, index) => (
            <div
              key={check.id}
              className={cn(
                'flex items-start justify-between p-4 rounded-lg border transition-all animate-fade-in',
                check.enabled
                  ? 'border-severity-info/30 bg-severity-info/10'
                  : 'border-dark-700/50 bg-dark-800/30 hover:bg-dark-800/60'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-dark-100">{check.name}</span>
                  {check.enabled && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-severity-info/20 text-severity-info border border-severity-info/30">
                      已启用
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-400">{check.description}</p>
              </div>
              <Switch checked={check.enabled} onCheckedChange={() => toggleMandatoryCheck(check.id)} />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary-400">关于必须通过检查</p>
              <p className="text-sm text-dark-300 mt-1">
                启用的检查项必须全部通过，否则评审将无法通过。请谨慎配置，确保检查项的合理性和可执行性。
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
