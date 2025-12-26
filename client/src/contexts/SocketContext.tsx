import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_API_BASE_URL);

        newSocket.on('connect', () => {
            setIsConnected(true);

            if (currentUser) {
                newSocket.emit('join_room', currentUser.uid);
            }
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
