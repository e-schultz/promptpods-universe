
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFloat } from '@/context/FloatContext';
import { PromptPod } from '@/types/FloatTypes';
import { Label } from '@/components/ui/label';
import { InfoIcon } from 'lucide-react';

interface CreatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePodModal: React.FC<CreatePodModalProps> = ({ isOpen, onClose }) => {
  const { createPod, identities } = useFloat();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPod: Omit<PromptPod, 'id' | 'createdAt' | 'lastModified'> = {
      name,
      description,
      status: 'running',
      identities: [],
      files: [],
      rituals: [],
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    
    createPod(newPod);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTags('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-float-lightBg text-white border-float-purple/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New PromptPod</DialogTitle>
          <DialogDescription className="text-gray-400">
            PromptPods are isolated containers for organizing your thoughts, prompts, and contexts.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Pod Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Creative Pod"
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
              placeholder="A collection of prompts for creative writing..."
              className="bg-float-background border-float-purple/30 text-white"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags" className="text-white">Tags</Label>
              <div className="flex items-center text-xs text-gray-400">
                <InfoIcon className="h-3 w-3 mr-1" />
                <span>Separate with commas</span>
              </div>
            </div>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="creative, writing, fiction"
              className="bg-float-background border-float-purple/30 text-white"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-float-purple to-float-blue text-white hover:opacity-90 w-full"
            >
              Create Pod
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePodModal;
