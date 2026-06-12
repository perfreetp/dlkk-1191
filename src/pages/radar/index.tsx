import { useState } from 'react';
import { Radar } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components';
import RiskOverview from './RiskOverview';
import HighRiskFiles from './HighRiskFiles';
import ComplexityTrend from './ComplexityTrend';

export default function RadarPage() {
  const { riskData } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  const chartData = riskData.map((item) => ({
    ...item,
    fullMark: item.maxScore,
  }));

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-severity-blocker';
    if (score >= 40) return 'text-severity-critical';
    return 'text-severity-info';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-severity-blocker';
    if (score >= 40) return 'bg-severity-critical';
    return 'bg-severity-info';
  };

  return (
    <div className="min-h-screen bg-dark-950 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Radar className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-dark-100">风险雷达</h1>
          </div>
          <p className="text-dark-400">全面监控代码库风险状况，识别潜在问题</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <RiskOverview />
        </div>

        <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-dark-800/50 text-dark-300">
              <TabsTrigger
                value="overview"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                总览
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                高风险文件
              </TabsTrigger>
              <TabsTrigger
                value="complexity"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                复杂度趋势
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="glass-card glass-card-hover">
                  <CardHeader className="border-b border-dark-700/50">
                    <CardTitle className="text-dark-100">风险雷达图</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={chartData}>
                          <PolarGrid stroke="#334e68" />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#829ab1', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#627d98', fontSize: 10 }} />
                          <RechartsRadar
                            name="风险值"
                            dataKey="score"
                            stroke="#3975e2"
                            fill="#3975e2"
                            fillOpacity={0.3}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1e3a5f',
                              border: '1px solid #334e68',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                              color: '#d9e2ec',
                            }}
                          />
                          <Legend wrapperStyle={{ color: '#9fb3c8' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card glass-card-hover">
                  <CardHeader className="border-b border-dark-700/50">
                    <CardTitle className="text-dark-100">风险评分详情</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {riskData.map((item, index) => {
                        const percentage = (item.score / item.maxScore) * 100;
                        return (
                          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-dark-300">{item.category}</span>
                              <span className={`text-sm font-bold ${getRiskColor(item.score)}`}>
                                {item.score} / {item.maxScore}
                              </span>
                            </div>
                            <div className="w-full h-3 bg-dark-800/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getRiskBgColor(item.score)} rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="files">
              <div className="mt-6">
                <HighRiskFiles />
              </div>
            </TabsContent>

            <TabsContent value="complexity">
              <div className="mt-6">
                <ComplexityTrend />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
