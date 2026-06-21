import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

// Initialize socket OUTSIDE the provider
const socket = io('http://localhost:5000', {
  autoConnect: false,
  transports: ['websocket', 'polling']
});

export const QueueProvider = ({ children }) => {
  const [queueState, setQueueState] = useState({
    currentToken: 0,
    waitingCount: 0,
    activeQueue: [],
    averageConsultationTime: 600,
    currentlyCalledToken: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchCurrentState = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queue/current');
        setQueueState(response.data);
      } catch (error) {
        console.error('Failed to fetch initial queue state', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentState();

    // Connect and listen to updates
    socket.connect();
    
    // We use a named function or simply remove all listeners on cleanup
    const handleUpdate = (newState) => {
      setQueueState(newState);
    };
    
    socket.on('QUEUE_UPDATED', handleUpdate);

    return () => {
      socket.off('QUEUE_UPDATED', handleUpdate);
      socket.disconnect();
    };
  }, []);

  const joinQueue = async (patientName, phone) => {
    const response = await axios.post('http://localhost:5000/api/queue/join', { patientName, phone });
    return response.data;
  };

  const callNext = async () => {
    const response = await axios.post('http://localhost:5000/api/queue/call-next');
    return response.data;
  };

  const completeToken = async (tokenId) => {
    const response = await axios.put(`http://localhost:5000/api/queue/${tokenId}/complete`);
    return response.data;
  };

  const skipToken = async (tokenId) => {
    const response = await axios.put(`http://localhost:5000/api/queue/${tokenId}/skip`);
    return response.data;
  };

  const resetQueue = async () => {
    const response = await axios.post('http://localhost:5000/api/queue/reset');
    return response.data;
  };

  const value = {
    ...queueState,
    loading,
    joinQueue,
    callNext,
    completeToken,
    skipToken,
    resetQueue,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};
