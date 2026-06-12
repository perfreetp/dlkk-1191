import { useState } from 'react';
import { FileText, Plus, Pencil, Trash2, AlertTriangle, AlertCircle, Minus, Info } from 'lucide-react';
import { useAppStore, getSeverityText } from '@/store';
import { generateId } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Dialog, DialogHeader, DialogContent, DialogFooter, Input, Select } from '@/components';
import type { IssueTemplate, IssueSeverity } from '@/types';

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

export default function TemplateManager() {
  const { issueTemplates, setIssueTemplates } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<IssueTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as IssueSeverity,
    category: '',
  });

  const handleAdd = () => {
    setEditingTemplate(null);
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      category: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (template: IssueTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      description: template.description,
      severity: template.severity,
      category: template.category,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setIssueTemplates(issueTemplates.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingTemplate) {
      setIssueTemplates(
        issueTemplates.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...formData } : t
        )
      );
    } else {
      const newTemplate: IssueTemplate = {
        id: `template-${generateId()}`,
        ...formData,
      };
      setIssueTemplates([...issueTemplates, newTemplate]);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="glass-card glass-card-hover">
        <CardHeader className="border-b border-dark-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" />
              <CardTitle className="text-dark-100">常见问题模板</CardTitle>
            </div>
            <Button onClick={handleAdd} className="bg-primary-500 hover:bg-primary-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              新增模板
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issueTemplates.map((template, index) => {
              const Icon = severityIcons[template.severity];
              return (
                <div
                  key={template.id}
                  className="p-4 rounded-lg border border-dark-700/50 hover:border-primary-500/30 bg-dark-800/30 hover:bg-dark-800/60 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${getSeverityColor(template.severity)}`} />
                      <h4 className="font-medium text-dark-100">{template.title}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(template)}
                        className="text-dark-400 hover:text-dark-100 hover:bg-dark-700/50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-severity-blocker hover:text-severity-blocker hover:bg-severity-blocker/10"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-dark-300 mb-3">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityBadgeColor(template.severity)}>
                      {getSeverityText(template.severity)}
                    </Badge>
                    <Badge className="bg-dark-700/50 text-dark-300 border border-dark-600/50">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader
          title={editingTemplate ? '编辑模板' : '新增模板'}
          onClose={() => setDialogOpen(false)}
        />
        <DialogContent className="bg-dark-900/95">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">标题</label>
              <Input
                placeholder="问题标题"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-dark-800/50 border-dark-700/50 text-dark-100 placeholder:text-dark-500 focus:border-primary-500/50 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">描述</label>
              <textarea
                placeholder="问题描述内容"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 rounded-md border border-dark-700/50 bg-dark-800/50 px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">严重程度</label>
                <Select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value as IssueSeverity })
                  }
                  className="bg-dark-800/50 border-dark-700/50 text-dark-100 focus:border-primary-500/50 focus:ring-primary-500/20"
                >
                  <option value="critical">严重</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">分类</label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-dark-800/50 border-dark-700/50 text-dark-100 focus:border-primary-500/50 focus:ring-primary-500/20"
                >
                  <option value="">请选择</option>
                  <option value="安全">安全</option>
                  <option value="代码质量">代码质量</option>
                  <option value="性能">性能</option>
                  <option value="可维护性">可维护性</option>
                  <option value="测试">测试</option>
                  <option value="代码规范">代码规范</option>
                  <option value="类型安全">类型安全</option>
                </Select>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter className="border-t border-dark-700/50">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            className="border-dark-700/50 bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 hover:text-dark-100"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.description.trim()}
            className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
          >
            {editingTemplate ? '保存修改' : '创建模板'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
