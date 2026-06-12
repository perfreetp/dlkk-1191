import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Dialog, DialogHeader, DialogContent, DialogFooter, Button, Select } from '@/components';

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  currentAssignee?: string;
  disabled?: boolean;
}

const assignees = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
  { id: '5', name: '钱七' },
];

export default function AssignDialog({ open, onClose, issueId, currentAssignee, disabled = false }: AssignDialogProps) {
  const { assignIssue } = useAppStore();
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || '');

  const handleAssign = () => {
    if (disabled || !selectedAssignee) return;
    assignIssue(issueId, selectedAssignee);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title="指派整改人" onClose={onClose} />
      <DialogContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              选择整改人
            </label>
            <Select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              disabled={disabled}
              className="bg-dark-800/50 border-dark-700/50 text-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">请选择</option>
              {assignees.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <UserPlus className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-400">提示</p>
                <p className="text-sm text-dark-300 mt-1">
                  指派后，整改人将收到通知并负责修复此问题。
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-dark-700/50 text-dark-300 hover:bg-dark-800/50"
        >
          取消
        </Button>
        <Button
          onClick={handleAssign}
          disabled={disabled || !selectedAssignee}
          className={cn(
            'bg-primary-500 hover:bg-primary-600 text-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          确认指派
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
