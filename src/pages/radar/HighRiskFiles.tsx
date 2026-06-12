import { FileWarning, ArrowUpRight, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store';
import { getFileIcon, formatDate, cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components';

export default function HighRiskFiles() {
  const { highRiskFiles } = useAppStore();

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-severity-blocker';
    if (score >= 60) return 'text-severity-critical';
    return 'text-severity-warning';
  };

  const getRiskBarColor = (score: number) => {
    if (score >= 80) return 'bg-severity-blocker';
    if (score >= 60) return 'bg-severity-critical';
    return 'bg-severity-warning';
  };

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-severity-critical" />
            <CardTitle className="text-dark-100">高风险文件</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'border-dark-700/50 bg-dark-800/50 text-dark-300',
              'hover:bg-dark-700/50 hover:text-dark-100 hover:border-primary-500/30'
            )}
          >
            查看全部
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {highRiskFiles.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-dark-800/30 hover:bg-dark-800/60 border border-transparent hover:border-primary-500/30 transition-all cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-dark-700/50 rounded-lg text-lg">
                {getFileIcon(file.path)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-dark-100 truncate">
                    {file.path.split('/').pop()}
                  </span>
                  {index < 3 && (
                    <Badge className="bg-severity-blocker/20 text-severity-blocker border border-severity-blocker/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      高危
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-dark-400">
                  <span className="truncate font-mono text-[11px]">{file.path}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(file.lastModified)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-dark-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getRiskBarColor(file.riskScore)} transition-all`}
                      style={{ width: `${file.riskScore}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold min-w-[3rem] text-right ${getRiskColor(file.riskScore)}`}>
                    {file.riskScore}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-100">{file.issueCount}</p>
                  <p className="text-xs text-dark-400">个问题</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
