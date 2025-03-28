
import React from 'react';
import { PromptPod } from '@/types/FloatTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFloat } from '@/context/FloatContext';
import { Package, Users, FileText, Sparkles, Calendar, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PodCardProps {
  pod: PromptPod;
}

const PodCard: React.FC<PodCardProps> = ({ pod }) => {
  const { setActivePod, deletePod } = useFloat();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <Card className="relative overflow-hidden bg-float-lightBg border-float-purple/20 hover:border-float-purple/50 transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(pod.status)}`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-white font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-float-accent" />
            {pod.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActivePod(pod.id)}>
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deletePod(pod.id)} className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-gray-400 line-clamp-2">
          {pod.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          {pod.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-float-navy/30 text-float-accent border-float-accent/30">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-400">
            <Users className="h-3 w-3" />
            <span>{pod.identities.length} identities</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <FileText className="h-3 w-3" />
            <span>{pod.files.length} files</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Sparkles className="h-3 w-3" />
            <span>{pod.rituals.length} rituals</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(pod.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button 
          className="w-full bg-gradient-to-r from-float-purple to-float-blue text-white hover:opacity-90"
          onClick={() => setActivePod(pod.id)}
        >
          Open Pod
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PodCard;
