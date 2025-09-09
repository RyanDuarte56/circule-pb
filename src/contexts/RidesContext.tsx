import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Ride {
  id: string;
  user: {
    name: string;
    photo: string;
    rating: number;
    occupation: 'aluno' | 'professor' | 'funcionario';
  };
  time: string;
  departure: string;
  destination: string;
  price?: number;
  availableSeats?: number;
  requestedSeats?: number;
  shareFuel: boolean;
  vehicle?: string;
  allowDetour?: boolean;
  description?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface RidesContextType {
  rides: Ride[];
  requests: Ride[];
  rideHistory: Ride[];
  addRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'status'>) => void;
  addRequest: (request: Omit<Ride, 'id' | 'createdAt' | 'status'>) => void;
  updateRideStatus: (id: string, status: Ride['status']) => void;
  cancelRequest: (id: string) => void;
  cancelRide: (id: string) => void;
}

const RidesContext = createContext<RidesContextType | undefined>(undefined);

export const RidesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [requests, setRequests] = useState<Ride[]>([]);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (currentUserId) {
      // Carregar corridas oferecidas pelo usuário atual
      const savedRides = localStorage.getItem(`rides_${currentUserId}`);
      if (savedRides) {
        const parsedRides = JSON.parse(savedRides).map((ride: any) => ({
          ...ride,
          createdAt: new Date(ride.createdAt)
        }));
        setRides(parsedRides);
      }
      
      // Carregar solicitações de corrida do usuário atual
      const savedRequests = localStorage.getItem(`requests_${currentUserId}`);
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests).map((request: any) => ({
          ...request,
          createdAt: new Date(request.createdAt)
        }));
        setRequests(parsedRequests);
      }
      
      // Carregar histórico de corridas do usuário atual
      const savedHistory = localStorage.getItem(`rideHistory_${currentUserId}`);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory).map((history: any) => ({
          ...history,
          createdAt: new Date(history.createdAt)
        }));
        setRideHistory(parsedHistory);
      }
    }
  }, []);

  const addRide = (rideData: Omit<Ride, 'id' | 'createdAt' | 'status'>) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const newRide: Ride = {
      ...rideData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date()
    };
    const updatedRides = [newRide, ...rides];
    setRides(updatedRides);
    localStorage.setItem(`rides_${currentUserId}`, JSON.stringify(updatedRides));
  };

  const addRequest = (requestData: Omit<Ride, 'id' | 'createdAt' | 'status'>) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const newRequest: Ride = {
      ...requestData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date()
    };
    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem(`requests_${currentUserId}`, JSON.stringify(updatedRequests));
  };

  const updateRideStatus = (id: string, status: Ride['status']) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    const updatedRides = rides.map(ride => 
      ride.id === id ? { ...ride, status } : ride
    );
    const updatedRequests = requests.map(request => 
      request.id === id ? { ...request, status } : request
    );
    
    setRides(updatedRides);
    setRequests(updatedRequests);
    localStorage.setItem(`rides_${currentUserId}`, JSON.stringify(updatedRides));
    localStorage.setItem(`requests_${currentUserId}`, JSON.stringify(updatedRequests));
    
    if (status === 'completed') {
      const completedRide = [...rides, ...requests].find(item => item.id === id);
      if (completedRide) {
        const updatedHistory = [{ ...completedRide, status }, ...rideHistory];
        setRideHistory(updatedHistory);
        localStorage.setItem(`rideHistory_${currentUserId}`, JSON.stringify(updatedHistory));
      }
    }
  };

  const cancelRequest = (id: string) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    // Filtrar o pedido a ser cancelado
    const updatedRequests = requests.filter(request => request.id !== id);
    
    setRequests(updatedRequests);
    localStorage.setItem(`requests_${currentUserId}`, JSON.stringify(updatedRequests));
  };
  
  const cancelRide = (id: string) => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return;
    
    // Filtrar a corrida a ser cancelada
    const updatedRides = rides.filter(ride => ride.id !== id);
    
    setRides(updatedRides);
    localStorage.setItem(`rides_${currentUserId}`, JSON.stringify(updatedRides));
  };

  return (
    <RidesContext.Provider value={{ 
      rides, 
      requests, 
      rideHistory, 
      addRide, 
      addRequest, 
      updateRideStatus,
      cancelRequest,
      cancelRide 
    }}>
      {children}
    </RidesContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RidesContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RidesProvider');
  }
  return context;
};