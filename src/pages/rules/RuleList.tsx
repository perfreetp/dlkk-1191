import { useState } from 'react';
import { GripVertical, AlertTriangle, AlertCircle, Minus, Star, Pencil, Trash2, Info, Plus } from 'lucide-react';
import { useAppStore, getSeverityText } from '@/store';
import { cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Switch, Badge, Button, Dialog, DialogHeader, DialogContent, DialogFooter, Input, Select } from '@/components';
import type { IssueSeverity, Rule } from '@/types';

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

interface RuleFormData {
  name: string;
  description: string;
  category: string;
  severity: IssueSeverity;
  enabled: boolean;
  isMandatory: boolean;
}

const initialFormData: RuleFormData = {
  name: '',
  description: '',
  category: '',
  severity: 'medium',
  enabled: true,
  isMandatory: false,
};

export default function RuleList() {
  const { rules, toggleRule, reorderRules, addRule, updateRule, deleteRule } = useAppStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deletingRule, setDeletingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);

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

  const handleAdd = () => {
    setEditingRule(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      category: rule.category,
      severity: rule.severity,
      enabled: rule.enabled,
      isMandatory: rule.isMandatory,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (rule: Rule) => {
    setDeletingRule(rule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingRule) {
      deleteRule(deletingRule.id);
    }
    setDeleteDialogOpen(false);
    setDeletingRule(null);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editingRule) {
      updateRule(editingRule.id, formData);
    } else {
      addRule(formData);
    }
    setDialogOpen(false);
    setEditingRule(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingRule(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingRule(null);
  };

  return (
    <>
      <Card className="glass-card glass-card-hover">
        <CardHeader className="border-b border-dark-700/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-dark-100">评审规则列表</CardTitle>
              <p className="text-sm text-dark-400 mt-1">
                共 {rules.length} 条规则，已启用 {enabledCount} 条，必须通过 {mandatoryCount} 条
              </p>
            </div>
            <Button onClick={handleAdd} className="bg-primary-500 hover:bg-primary-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
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
                      onClick={() => handleEdit(rule)}
                      className={cn(
                        'text-dark-400 hover:text-dark-100 hover:bg-dark-700/50'
                      )}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(rule)}
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

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogHeader
          title={editingRule ? '编辑规则' : '新增规则'}
          onClose={handleCancel}
        />
        <DialogContent className="bg-dark-900/95">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">规则名称</label>
              <Input
                placeholder="请输入规则名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-dark-800/50 border-dark-700/50 text-dark-100 placeholder:text-dark-500 focus:border-primary-500/50 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">规则描述</label>
              <textarea
                placeholder="请输入规则描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-24 rounded-md border border-dark-700/50 bg-dark-800/50 px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">分类</label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-dark-800/50 border-dark-700/50 text-dark-100 focus:border-primary-500/50 focus:ring-primary-500/20"
                >
                  <option value="">请选择</option>
                  <option value="安全">安全</option>
                  <option value="可靠性">可靠性</option>
                  <option value="代码质量">代码质量</option>
                  <option value="性能">性能</option>
                  <option value="可维护性">可维护性</option>
                  <option value="代码规范">代码规范</option>
                </Select>
              </div>
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
                  <option value="info">提示</option>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
                <span className="text-sm text-dark-300">启用规则</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isMandatory}
                  onCheckedChange={(checked) => setFormData({ ...formData, isMandatory: checked })}
                />
                <span className="text-sm text-dark-300">必须通过</span>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter className="border-t border-dark-700/50">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-dark-700/50 bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 hover:text-dark-100"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.description.trim()}
            className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
          >
            {editingRule ? '保存修改' : '创建规则'}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogHeader title="确认删除" onClose={handleDeleteCancel} />
        <DialogContent className="bg-dark-900/95">
          <p className="text-dark-300">
            确定要删除规则 <span className="font-medium text-dark-100">"{deletingRule?.name}"</span> 吗？此操作不可撤销。
          </p>
        </DialogContent>
        <DialogFooter className="border-t border-dark-700/50">
          <Button
            variant="outline"
            onClick={handleDeleteCancel}
            className="border-dark-700/50 bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 hover:text-dark-100"
          >
            取消
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="bg-severity-blocker hover:bg-severity-blocker/90 text-white"
          >
            确认删除
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
