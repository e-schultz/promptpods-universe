
import React, { useState } from 'react';
import { useFloat } from '@/context/FloatContext';
import PodCard from './PodCard';
import CreatePodModal from './CreatePodModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, LayoutGrid, LayoutList, Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardView: React.FC = () => {
  const { pods } = useFloat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'paused' | 'archived'>('all');
  
  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pod.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || pod.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-float-navy/30 border-float-purple/20 text-white w-full sm:w-80"
            placeholder="Search pods by name, description or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(value) => setStatusFilter(value as any)}>
            <TabsList className="bg-float-navy/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-float-purple/60">All</TabsTrigger>
              <TabsTrigger value="running" className="data-[state=active]:bg-green-500/60">Running</TabsTrigger>
              <TabsTrigger value="paused" className="data-[state=active]:bg-yellow-500/60">Paused</TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-gray-500/60">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center border border-float-purple/20 rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${viewMode === 'grid' ? 'bg-float-purple/30' : 'bg-transparent'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${viewMode === 'list' ? 'bg-float-purple/30' : 'bg-transparent'}`}
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-float-purple to-float-blue hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Pod
          </Button>
        </div>
      </div>
      
      {pods.length === 0 ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-12 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-float-purple/10 mb-4">
            <Package className="h-8 w-8 text-float-accent animate-pulse-slow" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No PromptPods Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Create your first PromptPod to start organizing your thoughts, prompts, and contexts in isolated containers.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-float-purple to-float-blue hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Pod
          </Button>
        </div>
      ) : filteredPods.length === 0 ? (
        <div className="rounded-lg border border-float-purple/20 bg-float-navy/20 p-8 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
          <p className="text-gray-400">No pods match your current search criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredPods.map((pod) => (
              <PodCard key={pod.id} pod={pod} />
            ))}
          </div>
        </ScrollArea>
      )}
      
      <CreatePodModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardView;
