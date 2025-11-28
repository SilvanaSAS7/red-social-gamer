import React, { createContext, useState, useContext } from 'react';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(false);
  const [playbackId, setPlaybackId] = useState(null);

  const startStream = (id) => {
    setPlaybackId(id);
    setIsLive(true);
  };

  const stopStream = () => {
    setPlaybackId(null);
    setIsLive(false);
  };

  const value = {
    isLive,
    playbackId,
    startStream,
    stopStream
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};
