
import React, { useState } from 'react';
import { useFloat } from '@/context/FloatContext';
import { Identity } from '@/types/FloatTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Edit, Trash2, User, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const IdentityManager: React.FC = () => {
  const { identities, createIdentity, updateIdentity, deleteIdentity, activePod, updatePod } = useFloat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState('');
  const [newTrait, setNewTrait] = useState('');
  const [editTraits, setEditTraits] = useState<string[]>([]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setTraits('');
    setNewTrait('');
    setEditTraits([]);
    setSelectedIdentity(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIdentity: Omit<Identity, 'id'> = {
      name,
      description,
      traits: traits.split(',').map(trait => trait.trim()).filter(trait => trait !== '')
    };
    
    createIdentity(newIdentity);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIdentity) {
      const updatedIdentity: Identity = {
        ...selectedIdentity,
        name,
        description,
        traits: editTraits
      };
      
      updateIdentity(updatedIdentity);
      resetForm();
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (identity: Identity) => {
    setSelectedIdentity(identity);
    setName(identity.name);
    setDescription(identity.description);
    setEditTraits(identity.traits);
    setIsEditModalOpen(true);
  };

  const handleAddTrait = () => {
    if (newTrait.trim() !== '') {
      setEditTraits([...editTraits, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const handleRemoveTrait = (index: number) => {
    setEditTraits(editTraits.filter((_, i) => i !== index));
  };

  const isIdentityInActivePod = (identityId: string) => {
    return activePod?.identities.some(i => i.id === identityId) || false;
  };

  const toggleIdentityInPod = (identity: Identity) => {
    if (!activePod) return;
    
    const isInPod = isIdentityInActivePod(identity.id);
    
    if (isInPod) {
      // Remove from pod
      const updatedPod = {
        ...activePod,
        identities: activePod.identities.filter(i => i.id !== identity.id)
      };
      updatePod(updatedPod);
    } else {
      // Add to pod
      const updatedPod = {
        ...activePod,
        identities: [...activePod.identities, identity]
      };
      updatePod(updatedPod);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Identity Management</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-float-purple text-white hover:bg-float-purple/80"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          New Identity
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {identities.map((identity) => (
            <Card key={identity.id} className="bg-float-lightBg border-float-purple/20 hover:border-float-purple/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-float-accent" />
                    {identity.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-white"
                      onClick={() => openEditModal(identity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => deleteIdentity(identity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-gray-400 line-clamp-2">
                  {identity.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 my-2">
                  {identity.traits.map((trait, index) => (
                    <Badge key={index} variant="outline" className="bg-float-navy/30 text-float-accent border-float-accent/30">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {activePod && (
                <CardFooter className="pt-0">
                  <Button 
                    className={`w-full ${
                      isIdentityInActivePod(identity.id)
                        ? "bg-float-purple/50 hover:bg-float-purple/30"
                        : "bg-float-purple hover:bg-float-purple/80"
                    }`}
                    onClick={() => toggleIdentityInPod(identity)}
                  >
                    {isIdentityInActivePod(identity.id) ? "Remove from Pod" : "Add to Pod"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      {/* Create Identity Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && setIsCreateModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-purple/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Identity</DialogTitle>
            <DialogDescription className="text-gray-400">
              Identities represent different perspectives or personas for your prompts.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Identity Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Creative Writer"
                className="bg-float-background border-float-purple/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A persona focused on creative fiction writing..."
                className="bg-float-background border-float-purple/30 text-white"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="traits" className="text-white">Traits</Label>
              <Input
                id="traits"
                value={traits}
                onChange={(e) => setTraits(e.target.value)}
                placeholder="creative, imaginative, detailed"
                className="bg-float-background border-float-purple/30 text-white"
              />
              <p className="text-xs text-gray-400">Separate traits with commas</p>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-purple to-float-blue text-white hover:opacity-90 w-full"
              >
                Create Identity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Identity Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-purple/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Identity</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update identity details and traits.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">Identity Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-float-background border-float-purple/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-white">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-float-background border-float-purple/30 text-white"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Traits</Label>
              <div className="flex flex-wrap gap-1 p-2 bg-float-background border border-float-purple/30 rounded-md min-h-10">
                {editTraits.map((trait, index) => (
                  <Badge key={index} className="bg-float-purple text-white flex items-center gap-1">
                    {trait}
                    <button type="button" onClick={() => handleRemoveTrait(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex mt-2">
                <Input
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  placeholder="Add a trait"
                  className="bg-float-background border-float-purple/30 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTrait();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTrait}
                  className="ml-2 bg-float-purple"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-purple to-float-blue text-white hover:opacity-90 w-full"
              >
                Update Identity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdentityManager;
