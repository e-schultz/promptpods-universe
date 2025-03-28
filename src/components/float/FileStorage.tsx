
import React, { useState } from 'react';
import { useFloat } from '@/context/FloatContext';
import { FileResource } from '@/types/FloatTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePlus, Edit, Trash2, FileText, File } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FileStorage: React.FC = () => {
  const { activePod, addFileToActivePod, updateFile, deleteFile } = useFloat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileResource | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');

  const resetForm = () => {
    setName('');
    setType('text');
    setContent('');
    setSelectedFile(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFile: Omit<FileResource, 'id' | 'createdAt' | 'lastModified'> = {
      name,
      type,
      content
    };
    
    addFileToActivePod(newFile);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile && activePod) {
      const updatedFile: FileResource = {
        ...selectedFile,
        name,
        type,
        content
      };
      
      updateFile(activePod.id, updatedFile);
      resetForm();
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (file: FileResource) => {
    setSelectedFile(file);
    setName(file.name);
    setType(file.type);
    setContent(file.content);
    setIsEditModalOpen(true);
  };

  const handleDeleteFile = (fileId: string) => {
    if (activePod) {
      deleteFile(activePod.id, fileId);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'text':
        return <FileText className="h-5 w-5 text-float-accent" />;
      case 'prompt':
        return <File className="h-5 w-5 text-float-purple" />;
      case 'reference':
        return <File className="h-5 w-5 text-float-blue" />;
      default:
        return <File className="h-5 w-5 text-float-accent" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">File Storage</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-float-teal text-white hover:bg-float-teal/80"
          disabled={!activePod}
        >
          <FilePlus className="h-4 w-4 mr-2" />
          New File
        </Button>
      </div>
      
      {!activePod ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-8 text-center">
          <p className="text-gray-400">Select a PromptPod to manage files</p>
        </div>
      ) : activePod.files.length === 0 ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">No Files Yet</h3>
          <p className="text-gray-400 mb-4">Create your first file to store prompts, references, or notes in this PromptPod.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-float-teal text-white hover:bg-float-teal/80"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Create First File
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePod.files.map((file) => (
              <Card key={file.id} className="bg-float-lightBg border-float-teal/20 hover:border-float-teal/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white font-semibold flex items-center gap-2">
                      {getFileIcon(file.type)}
                      {file.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => openEditModal(file)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Type: {file.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-float-background rounded p-2 text-gray-300 text-sm max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono">{file.content.slice(0, 150)}{file.content.length > 150 ? '...' : ''}</pre>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    className="w-full bg-float-teal text-white hover:bg-float-teal/80"
                    onClick={() => openEditModal(file)}
                  >
                    View & Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Create File Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && setIsCreateModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-teal/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New File</DialogTitle>
            <DialogDescription className="text-gray-400">
              Store prompts, references, and other text in your PromptPod.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">File Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Prompt Template"
                className="bg-float-background border-float-teal/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">File Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-float-background border-float-teal/30 text-white">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent className="bg-float-lightBg border-float-teal/30">
                  <SelectItem value="text">General Text</SelectItem>
                  <SelectItem value="prompt">Prompt Template</SelectItem>
                  <SelectItem value="reference">Reference Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text content here..."
                className="bg-float-background border-float-teal/30 text-white min-h-32"
                rows={8}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-teal to-float-blue text-white hover:opacity-90 w-full"
              >
                Create File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit File Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="bg-float-lightBg text-white border-float-teal/30 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit File</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update file details and content.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">File Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-float-background border-float-teal/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-white">File Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-float-background border-float-teal/30 text-white">
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent className="bg-float-lightBg border-float-teal/30">
                  <SelectItem value="text">General Text</SelectItem>
                  <SelectItem value="prompt">Prompt Template</SelectItem>
                  <SelectItem value="reference">Reference Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-white">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-float-background border-float-teal/30 text-white min-h-48"
                rows={12}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-float-teal to-float-blue text-white hover:opacity-90 w-full"
              >
                Update File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileStorage;
