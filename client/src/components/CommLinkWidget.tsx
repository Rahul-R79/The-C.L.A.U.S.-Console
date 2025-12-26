import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, X } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { chatService } from "../services/chatService";

type Message = {
    text: string;
    sender: "user" | "santa" | "system";
    time: string;
};

const CommLinkWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { text: "Secure Uplink Established.", sender: "system", time: new Date().toLocaleTimeString() },
        { text: "Waiting for operator...", sender: "system", time: new Date().toLocaleTimeString() }
    ]);
    const { socket, isConnected } = useSocket();
    const { currentUser } = useAuth();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isOpen]);

    // Load History
    useEffect(() => {
        if (!currentUser) return;

        const loadHistory = async () => {
            try {
                const history = await chatService.getChatHistory(currentUser.uid);
                const mapped: Message[] = history.map((m: any) => ({
                    text: m.text,
                    sender: m.sender === 'santa' ? 'santa' : 'user',
                    time: new Date(m.timestamp).toLocaleTimeString()
                }));

                if (mapped.length > 0) {
                    setChatHistory(mapped);
                }
            } catch (err) {
                console.error("Failed to load chat history", err);
            }
        };
        loadHistory();
    }, [currentUser]);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data: any) => {
            setChatHistory((prev) => [
                ...prev,
                { text: data.message, sender: "santa", time: new Date().toLocaleTimeString() },
            ]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

    const handleSend = () => {
        if (!message.trim() || !socket || !currentUser) return;

        const msgData = {
            room: currentUser.uid,
            message: message,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "Unknown Agent",
        };

        // Emit to server
        socket.emit("send_message", msgData);

        setChatHistory((prev) => [
            ...prev,
            { text: message, sender: "user", time: new Date().toLocaleTimeString() },
        ]);
        setMessage("");
    };

    if (!currentUser) return null; 

    return (
        <div className='fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-mono flex flex-col items-end gap-3'>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className='w-[calc(100vw-2rem)] sm:w-80 md:w-96 h-[60vh] sm:h-96 max-h-125 bg-black/90 border border-cyber-neon/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)] flex flex-col'>

                        {/* Header */}
                        <div className='bg-cyber-neon/10 p-3 border-b border-cyber-neon/20 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className='text-cyber-neon text-xs tracking-widest font-bold'>
                                    DIRECT UPLINK // N.POLE
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='text-cyber-neon/50 hover:text-cyber-neon transition-colors'>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyber-neon/20 scrollbar-track-transparent'>
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.sender === "user"
                                        ? "items-end"
                                        : "items-start"
                                        }`}>
                                    <div
                                        className={`max-w-[85%] px-3 py-2 rounded text-xs leading-relaxed ${msg.sender === "user"
                                            ? "bg-white/10 text-white border border-white/10"
                                            : msg.sender === "system"
                                                ? "text-gray-500 italic text-[10px] w-full text-center my-1"
                                                : "bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30"
                                            }`}>
                                        {msg.text}
                                    </div>
                                    {msg.sender !== "system" && (
                                        <span className='text-[10px] text-gray-600 mt-1'>
                                            {msg.time}
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className='p-3 border-t border-white/10 bg-black flex gap-2'>
                            <input
                                type='text'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder='Type message to Santa...'
                                className='flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-neon/50 transition-colors'
                            />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim()}
                                className='p-2 bg-cyber-neon hover:bg-white text-black rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border relative group transition-all ${isOpen
                    ? 'bg-cyber-neon text-black border-cyber-neon shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                    : 'bg-black text-cyber-neon border-cyber-neon/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                    }`}>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}

                {/* Ping Indicator */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default CommLinkWidget;
