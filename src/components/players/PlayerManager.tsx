import { useState } from 'react';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerManagerProps {
  players: Player[];
  onAdd: (name: string) => Promise<unknown>;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function PlayerManager({ players, onAdd, onUpdate, onDelete }: PlayerManagerProps) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error('Enter a player name');
      return;
    }
    setLoading(true);
    try {
      await onAdd(newName);
      setNewName('');
      setDialogOpen(false);
      toast.success('Player added!');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Enter a player name');
      return;
    }
    setLoading(true);
    try {
      await onUpdate(id, editName);
      setEditingId(null);
      toast.success('Player updated!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete player "${name}"?`)) {
      setLoading(true);
      try {
        await onDelete(id);
        toast.success('Player deleted!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Player Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="gold">
            <Plus className="h-4 w-4" />
            Add Player
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Player name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="bg-background border-border"
            />
            <Button variant="gold" className="w-full" onClick={handleAdd} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Player
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Players List */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map(player => (
          <div
            key={player.id}
            className="card-gradient rounded-xl border border-border p-4 transition-all hover:border-primary/30"
          >
            {editingId === player.id ? (
              <div className="space-y-3 animate-fade-in">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(player.id)}
                  className="bg-background border-border"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="gold"
                    onClick={() => handleUpdate(player.id)}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{player.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditingId(player.id);
                      setEditName(player.name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(player.id, player.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
