
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFloat } from '@/context/FloatContext';
import { ArrowLeft, Settings, Cube, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatHeaderProps {
  setCurrentView: (view: 'dashboard' | 'identity' | 'files' | 'rituals') => void;
  currentView: 'dashboard' | 'identity' | 'files' | 'rituals';
}

const FloatHeader: React.FC<FloatHeaderProps> = ({ setCurrentView, currentView }) => {
  const { activePod, setActivePod } = useFloat();
  
  return (
    <header className="bg-float-background border-b border-float-purple/20 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {activePod && currentView !== 'dashboard' ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-gray-400 hover:text-white"
              onClick={() => setCurrentView('dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center">
              <Cube className="h-6 w-6 text-float-accent mr-2 animate-float" />
            </div>
          )}
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-float-accent to-float-purple bg-clip-text text-transparent">
            FLOAT.K8s
          </h1>
          
          {activePod && (
            <div className="ml-4 px-3 py-1 bg-float-navy/30 rounded-full flex items-center">
              <Cube className="h-4 w-4 text-float-accent mr-2" />
              <span className="text-gray-200 font-medium">{activePod.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-5 w-5 text-gray-400 hover:text-white"
                onClick={() => setActivePod(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activePod && (
            <>
              <Button
                className={`px-3 ${currentView === 'identity' ? 'bg-float-purple' : 'bg-float-purple/20 hover:bg-float-purple/40'}`}
                onClick={() => setCurrentView('identity')}
              >
                Identities
              </Button>
              <Button
                className={`px-3 ${currentView === 'files' ? 'bg-float-teal' : 'bg-float-teal/20 hover:bg-float-teal/40'}`}
                onClick={() => setCurrentView('files')}
              >
                Files
              </Button>
              <Button
                className={`px-3 ${currentView === 'rituals' ? 'bg-float-indigo' : 'bg-float-indigo/20 hover:bg-float-indigo/40'}`}
                onClick={() => setCurrentView('rituals')}
              >
                Rituals
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-float-lightBg border-float-purple/30">
              <DropdownMenuLabel className="text-white">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-float-purple/20" />
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-float-navy/50 focus:bg-float-navy/50 cursor-pointer">
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-float-navy/50 focus:bg-float-navy/50 cursor-pointer">
                Import Data
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-float-navy/50 focus:bg-float-navy/50 cursor-pointer">
                Help & Documentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default FloatHeader;
