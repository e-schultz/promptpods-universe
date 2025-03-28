
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptPod, Identity, FileResource, Ritual } from '@/types/FloatTypes';
import { useToast } from '@/components/ui/use-toast';

interface FloatContextType {
  pods: PromptPod[];
  identities: Identity[];
  activePod: PromptPod | null;
  createPod: (pod: Omit<PromptPod, 'id' | 'createdAt' | 'lastModified'>) => void;
  updatePod: (pod: PromptPod) => void;
  deletePod: (id: string) => void;
  setActivePod: (id: string | null) => void;
  createIdentity: (identity: Omit<Identity, 'id'>) => void;
  updateIdentity: (identity: Identity) => void;
  deleteIdentity: (id: string) => void;
  addFileToActivePod: (file: Omit<FileResource, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateFile: (podId: string, file: FileResource) => void;
  deleteFile: (podId: string, fileId: string) => void;
  addRitualToActivePod: (ritual: Omit<Ritual, 'id'>) => void;
  updateRitual: (podId: string, ritual: Ritual) => void;
  deleteRitual: (podId: string, ritualId: string) => void;
}

const FloatContext = createContext<FloatContextType | undefined>(undefined);

export const useFloat = (): FloatContextType => {
  const context = useContext(FloatContext);
  if (!context) {
    throw new Error('useFloat must be used within a FloatProvider');
  }
  return context;
};

export const FloatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pods, setPods] = useState<PromptPod[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [activePod, setActivePodState] = useState<PromptPod | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedPods = localStorage.getItem('floatPods');
    const savedIdentities = localStorage.getItem('floatIdentities');
    const savedActivePodId = localStorage.getItem('floatActivePod');

    if (savedPods) {
      const parsedPods = JSON.parse(savedPods);
      setPods(parsedPods);
      
      if (savedActivePodId) {
        const activeP = parsedPods.find((p: PromptPod) => p.id === savedActivePodId);
        if (activeP) setActivePodState(activeP);
      }
    }

    if (savedIdentities) {
      setIdentities(JSON.parse(savedIdentities));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('floatPods', JSON.stringify(pods));
  }, [pods]);

  useEffect(() => {
    localStorage.setItem('floatIdentities', JSON.stringify(identities));
  }, [identities]);

  useEffect(() => {
    if (activePod) {
      localStorage.setItem('floatActivePod', activePod.id);
    } else {
      localStorage.removeItem('floatActivePod');
    }
  }, [activePod]);

  const createPod = (podData: Omit<PromptPod, 'id' | 'createdAt' | 'lastModified'>) => {
    const now = new Date().toISOString();
    const newPod: PromptPod = {
      ...podData,
      id: `pod-${Date.now()}`,
      createdAt: now,
      lastModified: now
    };
    setPods(prev => [...prev, newPod]);
    toast({
      title: "PromptPod Created",
      description: `${newPod.name} has been successfully created.`
    });
    return newPod;
  };

  const updatePod = (updatedPod: PromptPod) => {
    setPods(prev => prev.map(pod => 
      pod.id === updatedPod.id 
        ? { ...updatedPod, lastModified: new Date().toISOString() } 
        : pod
    ));
    
    if (activePod && activePod.id === updatedPod.id) {
      setActivePodState({ ...updatedPod, lastModified: new Date().toISOString() });
    }
    
    toast({
      title: "PromptPod Updated",
      description: `${updatedPod.name} has been successfully updated.`
    });
  };

  const deletePod = (id: string) => {
    const podToDelete = pods.find(pod => pod.id === id);
    setPods(prev => prev.filter(pod => pod.id !== id));
    
    if (activePod && activePod.id === id) {
      setActivePodState(null);
    }
    
    toast({
      title: "PromptPod Deleted",
      description: podToDelete ? `${podToDelete.name} has been deleted.` : "Pod has been deleted."
    });
  };

  const setActivePod = (id: string | null) => {
    if (id === null) {
      setActivePodState(null);
      return;
    }
    
    const pod = pods.find(p => p.id === id);
    if (pod) {
      setActivePodState(pod);
    } else {
      toast({
        title: "Error",
        description: "The selected pod could not be found.",
        variant: "destructive"
      });
    }
  };

  const createIdentity = (identityData: Omit<Identity, 'id'>) => {
    const newIdentity: Identity = {
      ...identityData,
      id: `identity-${Date.now()}`
    };
    setIdentities(prev => [...prev, newIdentity]);
    toast({
      title: "Identity Created",
      description: `${newIdentity.name} has been successfully created.`
    });
    return newIdentity;
  };

  const updateIdentity = (updatedIdentity: Identity) => {
    setIdentities(prev => prev.map(identity => 
      identity.id === updatedIdentity.id ? updatedIdentity : identity
    ));

    // Update any pods that have this identity
    setPods(prev => prev.map(pod => {
      const hasIdentity = pod.identities.some(i => i.id === updatedIdentity.id);
      if (hasIdentity) {
        return {
          ...pod,
          identities: pod.identities.map(i => 
            i.id === updatedIdentity.id ? updatedIdentity : i
          ),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.identities.some(i => i.id === updatedIdentity.id)) {
      setActivePodState({
        ...activePod,
        identities: activePod.identities.map(i => 
          i.id === updatedIdentity.id ? updatedIdentity : i
        ),
        lastModified: new Date().toISOString()
      });
    }
    
    toast({
      title: "Identity Updated",
      description: `${updatedIdentity.name} has been successfully updated.`
    });
  };

  const deleteIdentity = (id: string) => {
    const identityToDelete = identities.find(identity => identity.id === id);
    setIdentities(prev => prev.filter(identity => identity.id !== id));

    // Remove this identity from any pods
    setPods(prev => prev.map(pod => {
      const hasIdentity = pod.identities.some(i => i.id === id);
      if (hasIdentity) {
        return {
          ...pod,
          identities: pod.identities.filter(i => i.id !== id),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.identities.some(i => i.id === id)) {
      setActivePodState({
        ...activePod,
        identities: activePod.identities.filter(i => i.id !== id),
        lastModified: new Date().toISOString()
      });
    }
    
    toast({
      title: "Identity Deleted",
      description: identityToDelete ? `${identityToDelete.name} has been deleted.` : "Identity has been deleted."
    });
  };

  const addFileToActivePod = (fileData: Omit<FileResource, 'id' | 'createdAt' | 'lastModified'>) => {
    if (!activePod) {
      toast({
        title: "Error",
        description: "No active pod selected.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const newFile: FileResource = {
      ...fileData,
      id: `file-${Date.now()}`,
      createdAt: now,
      lastModified: now
    };

    const updatedPod = {
      ...activePod,
      files: [...activePod.files, newFile],
      lastModified: now
    };

    updatePod(updatedPod);
    
    toast({
      title: "File Added",
      description: `${newFile.name} has been added to ${activePod.name}.`
    });
  };

  const updateFile = (podId: string, updatedFile: FileResource) => {
    setPods(prev => prev.map(pod => {
      if (pod.id === podId) {
        return {
          ...pod,
          files: pod.files.map(file => 
            file.id === updatedFile.id 
              ? { ...updatedFile, lastModified: new Date().toISOString() } 
              : file
          ),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.id === podId) {
      setActivePodState({
        ...activePod,
        files: activePod.files.map(file => 
          file.id === updatedFile.id 
            ? { ...updatedFile, lastModified: new Date().toISOString() } 
            : file
        ),
        lastModified: new Date().toISOString()
      });
    }
    
    toast({
      title: "File Updated",
      description: `${updatedFile.name} has been updated.`
    });
  };

  const deleteFile = (podId: string, fileId: string) => {
    setPods(prev => prev.map(pod => {
      if (pod.id === podId) {
        const fileToDelete = pod.files.find(file => file.id === fileId);
        return {
          ...pod,
          files: pod.files.filter(file => file.id !== fileId),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.id === podId) {
      const fileToDelete = activePod.files.find(file => file.id === fileId);
      setActivePodState({
        ...activePod,
        files: activePod.files.filter(file => file.id !== fileId),
        lastModified: new Date().toISOString()
      });
      
      if (fileToDelete) {
        toast({
          title: "File Deleted",
          description: `${fileToDelete.name} has been deleted.`
        });
      }
    }
  };

  const addRitualToActivePod = (ritualData: Omit<Ritual, 'id'>) => {
    if (!activePod) {
      toast({
        title: "Error",
        description: "No active pod selected.",
        variant: "destructive"
      });
      return;
    }

    const newRitual: Ritual = {
      ...ritualData,
      id: `ritual-${Date.now()}`
    };

    const updatedPod = {
      ...activePod,
      rituals: [...activePod.rituals, newRitual],
      lastModified: new Date().toISOString()
    };

    updatePod(updatedPod);
    
    toast({
      title: "Ritual Added",
      description: `${newRitual.name} has been added to ${activePod.name}.`
    });
  };

  const updateRitual = (podId: string, updatedRitual: Ritual) => {
    setPods(prev => prev.map(pod => {
      if (pod.id === podId) {
        return {
          ...pod,
          rituals: pod.rituals.map(ritual => 
            ritual.id === updatedRitual.id ? updatedRitual : ritual
          ),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.id === podId) {
      setActivePodState({
        ...activePod,
        rituals: activePod.rituals.map(ritual => 
          ritual.id === updatedRitual.id ? updatedRitual : ritual
        ),
        lastModified: new Date().toISOString()
      });
    }
    
    toast({
      title: "Ritual Updated",
      description: `${updatedRitual.name} has been updated.`
    });
  };

  const deleteRitual = (podId: string, ritualId: string) => {
    setPods(prev => prev.map(pod => {
      if (pod.id === podId) {
        const ritualToDelete = pod.rituals.find(ritual => ritual.id === ritualId);
        return {
          ...pod,
          rituals: pod.rituals.filter(ritual => ritual.id !== ritualId),
          lastModified: new Date().toISOString()
        };
      }
      return pod;
    }));

    // Update active pod if needed
    if (activePod && activePod.id === podId) {
      const ritualToDelete = activePod.rituals.find(ritual => ritual.id === ritualId);
      setActivePodState({
        ...activePod,
        rituals: activePod.rituals.filter(ritual => ritual.id !== ritualId),
        lastModified: new Date().toISOString()
      });
      
      if (ritualToDelete) {
        toast({
          title: "Ritual Deleted",
          description: `${ritualToDelete.name} has been deleted.`
        });
      }
    }
  };

  const value = {
    pods,
    identities,
    activePod,
    createPod,
    updatePod,
    deletePod,
    setActivePod,
    createIdentity,
    updateIdentity,
    deleteIdentity,
    addFileToActivePod,
    updateFile,
    deleteFile,
    addRitualToActivePod,
    updateRitual,
    deleteRitual
  };

  return <FloatContext.Provider value={value}>{children}</FloatContext.Provider>;
};
