import { useState } from 'react';
import { BoardColumn } from '@/hooks/use-board-settings';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BoardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: BoardColumn[];
  onSave: (columns: BoardColumn[]) => void;
  isSaving: boolean;
}

// Common emojis for task boards
const EMOJI_OPTIONS = ['📋', '📝', '🔄', '👀', '✅', '🎯', '⏳', '🚀', '💡', '⚡', '🔥', '📌', '🏷️', '📦', '🎨', '🔧', '📊', '🗂️'];

interface SortableColumnItemProps {
  column: BoardColumn;
  onUpdate: (id: string, updates: Partial<BoardColumn>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function SortableColumnItem({ column, onUpdate, onDelete, canDelete }: SortableColumnItemProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-2 p-2 bg-white dark:bg-[#252526] border border-[#E9E9E7] dark:border-[#3F3F3F] rounded-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F] rounded-sm"
      >
        <GripVertical className="h-4 w-4 text-[#9B9A97]" />
      </button>

      {/* Emoji selector */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F] rounded-sm"
        >
          {column.emoji}
        </button>
        {showEmojiPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#252526] border border-[#E9E9E7] dark:border-[#3F3F3F] rounded-sm shadow-lg z-50 grid grid-cols-6 gap-1">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onUpdate(column.id, { emoji });
                  setShowEmojiPicker(false);
                }}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F] rounded-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        value={column.title}
        onChange={(e) => onUpdate(column.id, { title: e.target.value })}
        className="flex-1 h-8 text-sm bg-transparent border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF]"
        placeholder="Nome da coluna"
      />

      <button
        onClick={() => onDelete(column.id)}
        disabled={!canDelete}
        className={`p-1.5 rounded-sm transition-colors ${
          canDelete 
            ? 'hover:bg-[#FFE2DD] text-[#9B9A97] hover:text-[#E03E3E]' 
            : 'text-[#D3D3D3] cursor-not-allowed'
        }`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function BoardSettingsDialog({ open, onOpenChange, columns, onSave, isSaving }: BoardSettingsDialogProps) {
  const [localColumns, setLocalColumns] = useState<BoardColumn[]>(columns);

  // Reset local columns when dialog opens
  useState(() => {
    if (open) {
      setLocalColumns(columns);
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalColumns((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const handleUpdate = (id: string, updates: Partial<BoardColumn>) => {
    setLocalColumns(cols => cols.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDelete = (id: string) => {
    if (localColumns.length <= 2) return;
    setLocalColumns(cols => cols.filter(c => c.id !== id).map((c, i) => ({ ...c, order: i })));
  };

  const handleAdd = () => {
    const newId = `custom_${Date.now()}`;
    setLocalColumns(cols => [...cols, {
      id: newId,
      title: 'Nova Coluna',
      emoji: '📌',
      order: cols.length,
    }]);
  };

  const handleSave = () => {
    if (localColumns.some(c => !c.title.trim())) {
      return;
    }
    onSave(localColumns);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-[#191919] border-[#E9E9E7] dark:border-[#2F2F2F] shadow-xl p-0">
        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle className="text-base font-semibold text-[#37352F] dark:text-[#FFFFFFCF]">
            Personalizar Colunas
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2">
          <p className="text-xs text-[#9B9A97] mb-4">
            Arraste para reordenar, clique no emoji para alterar, ou adicione novas colunas.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localColumns.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {localColumns.map(column => (
                  <SortableColumnItem
                    key={column.id}
                    column={column}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    canDelete={localColumns.length > 2}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 mt-3 py-2 text-sm text-[#9B9A97] hover:bg-[#F7F7F5] dark:hover:bg-[#252525] rounded-sm border border-dashed border-[#E9E9E7] dark:border-[#3F3F3F] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Coluna
          </button>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-[#E9E9E7] dark:border-[#2F2F2F] bg-[#FBFBFA] dark:bg-[#1E1E1E]">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-[#37352F] dark:text-[#FFFFFFCF] hover:bg-[#E9E9E7] dark:hover:bg-[#3F3F3F] shadow-none"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || localColumns.some(c => !c.title.trim())}
            className="bg-[#2383E2] hover:bg-[#1B6EC2] text-white shadow-none"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}