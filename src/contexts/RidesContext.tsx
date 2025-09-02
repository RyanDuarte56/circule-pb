import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const RidesContext = createContext<RidesContextType | undefined>(undefined);

export const RidesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([
    {
      id: '1',
      user: {
        name: 'João Santos',
        photo: '',
        rating: 4.8,
        occupation: 'aluno'
      },
      time: '18:00',
      departure: 'CI - Centro de Informática',
      destination: 'Manaíra Shopping',
      price: 5,
      availableSeats: 3,
      shareFuel: true,
      vehicle: 'Honda Civic Prata',
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      user: {
        name: 'Maria Silva',
        photo: '',
        rating: 4.9,
        occupation: 'professor'
      },
      time: '19:30',
      departure: 'CI - Centro de Informática',
      destination: 'Cabo Branco',
      price: 8,
      availableSeats: 2,
      shareFuel: true,
      vehicle: 'Toyota Corolla Branco',
      status: 'active',
      createdAt: new Date('2024-01-14')
    }
  ]);

  const [requests, setRequests] = useState<Ride[]>([
    {
      id: '1',
      user: {
        name: 'Ana Costa',
        photo: '',
        rating: 4.7,
        occupation: 'aluno'
      },
      time: '17:00',
      departure: 'CI - Centro de Informática',
      destination: 'Bessa',
      requestedSeats: 1,
      shareFuel: true,
      status: 'active',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '2',
      user: {
        name: 'Pedro Lima',
        photo: '',
        rating: 4.6,
        occupation: 'funcionario'
      },
      time: '19:00',
      departure: 'CI - Centro de Informática',
      destination: 'Tambaú',
      requestedSeats: 2,
      shareFuel: false,
      status: 'active',
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [rideHistory, setRideHistory] = useState<Ride[]>([
    {
      id: 'h1',
      user: {
        name: 'Carlos Mendes',
        photo: '',
        rating: 4.9,
        occupation: 'professor'
      },
      time: '08:00',
      departure: 'CI - Centro de Informática',
      destination: 'Shopping Tambaú',
      price: 6,
      availableSeats: 3,
      shareFuel: true,
      status: 'completed',
      createdAt: new Date('2024-01-10')
    }
  ]);

  const addRide = (rideData: Omit<Ride, 'id' | 'createdAt' | 'status'>) => {
    const newRide: Ride = {
      ...rideData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date()
    };
    setRides(prev => [newRide, ...prev]);
  };

  const addRequest = (requestData: Omit<Ride, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: Ride = {
      ...requestData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date()
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRideStatus = (id: string, status: Ride['status']) => {
    setRides(prev => prev.map(ride => 
      ride.id === id ? { ...ride, status } : ride
    ));
    setRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status } : request
    ));
    
    if (status === 'completed') {
      const completedRide = [...rides, ...requests].find(item => item.id === id);
      if (completedRide) {
        setRideHistory(prev => [{ ...completedRide, status }, ...prev]);
      }
    }
  };

  return (
    <RidesContext.Provider value={{ 
      rides, 
      requests, 
      rideHistory, 
      addRide, 
      addRequest, 
      updateRideStatus 
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