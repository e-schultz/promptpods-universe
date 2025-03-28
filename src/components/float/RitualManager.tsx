
import React, { useState } from 'react';
import { useFloat } from '@/context/FloatContext';
import { Ritual } from '@/types/FloatTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Edit, Trash2, Plus, X, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const RitualManager: React.FC = () => {
  const { activePod, addRitualToActivePod, updateRitual, deleteRitual } = useFloat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');
  const [isActive, setIsActive] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSteps([]);
    setNewStep('');
    setIsActive(false);
    setSelectedRitual(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRitual: Omit<Ritual, 'id'> = {
      name,
      description,
      steps,
      isActive
    };
    
    addRitualToActivePod(newRitual);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRitual && activePod) {
      const updatedRitual: Ritual = {
        ...selectedRitual,
        name,
        description,
        steps,
        isActive
      };
      
      updateRitual(activePod.id, updatedRitual);
      resetForm();
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setName(ritual.name);
    setDescription(ritual.description);
    setSteps(ritual.steps);
    setIsActive(ritual.isActive);
    setIsEditModalOpen(true);
  };

  const handleDeleteRitual = (ritualId: string) => {
    if (activePod) {
      deleteRitual(activePod.id, ritualId);
    }
  };

  const handleAddStep = () => {
    if (newStep.trim() !== '') {
      setSteps([...steps, newStep.trim()]);
      setNewStep('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Ritual Manager</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-float-indigo text-white hover:bg-float-indigo/80"
          disabled={!activePod}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          New Ritual
        </Button>
      </div>
      
      {!activePod ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-8 text-center">
          <p className="text-gray-400">Select a PromptPod to manage rituals</p>
        </div>
      ) : activePod.rituals.length === 0 ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">No Rituals Yet</h3>
          <p className="text-gray-400 mb-4">Create your first ritual to facilitate creative exploration and structured thought processes.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-float-indigo text-white hover:bg-float-indigo/80"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create First Ritual
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePod.rituals.map((ritual) => (
              <Card key={ritual.id} className={`bg-float-lightBg ${ritual.isActive ? 'border-float-accent/50' : 'border-float-indigo/20'} hover:border-float-indigo/50 transition-all duration-300`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white font-semibold flex items-center gap-2">
                      <Sparkles className={`h-5 w-5 ${ritual.isActive ? 'text-float-accent animate-pulse-slow' : 'text-float-indigo'}`} />
                      {ritual.name}
                      {ritual.isActive && (
                        <Badge className="ml-2 bg-float-accent/20 text-float-accent border-float-accent/30">
                          Active
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => openEditModal(ritual)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteRitual(ritual.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {ritual.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium text-white mb-2">Steps:</h4>
                  <ol className="pl-5 list-decimal text-gray-300 space-y-1">
                    {ritual.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    className="w-full bg-float-indigo text-white hover:bg-float-indigo/80"
                    onClick={() => openEditModal(ritual)}
                  >
                    Edit Ritual
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Create Ritual Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && setIsCreateModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-indigo/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Ritual</DialogTitle>
            <DialogDescription className="text-gray-400">
              Rituals provide structured steps for creative exploration and thought processes.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Ritual Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Morning Creativity Boost"
                className="bg-float-background border-float-indigo/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A ritual to enhance creative thinking in the morning..."
                className="bg-float-background border-float-indigo/30 text-white"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Steps</Label>
              <div className="rounded-md border border-float-indigo/30 bg-float-background p-2 min-h-32 overflow-y-auto">
                {steps.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No steps added yet</p>
                ) : (
                  <ol className="pl-6 list-decimal space-y-2">
                    {steps.map((step, index) => (
                      <li key={index} className="text-gray-300 flex items-start group">
                        <span className="flex-1">{step}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveStep(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              
              <div className="flex mt-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Add a step"
                  className="bg-float-background border-float-indigo/30 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStep();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddStep}
                  className="ml-2 bg-float-indigo"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-active" 
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active" className="text-white">Activate this ritual</Label>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-purple to-float-indigo text-white hover:opacity-90 w-full"
              >
                Create Ritual
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Ritual Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-indigo/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Ritual</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update ritual details and steps.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">Ritual Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-float-background border-float-indigo/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-white">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-float-background border-float-indigo/30 text-white"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Steps</Label>
              <div className="rounded-md border border-float-indigo/30 bg-float-background p-2 min-h-32 overflow-y-auto">
                {steps.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No steps added yet</p>
                ) : (
                  <ol className="pl-6 list-decimal space-y-2">
                    {steps.map((step, index) => (
                      <li key={index} className="text-gray-300 flex items-start group">
                        <span className="flex-1">{step}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveStep(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              
              <div className="flex mt-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Add a step"
                  className="bg-float-background border-float-indigo/30 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStep();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddStep}
                  className="ml-2 bg-float-indigo"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-is-active" 
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="edit-is-active" className="text-white">Activate this ritual</Label>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-purple to-float-indigo text-white hover:opacity-90 w-full"
              >
                Update Ritual
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RitualManager;
