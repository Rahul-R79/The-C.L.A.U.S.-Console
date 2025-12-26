import { useState, useEffect, useRef } from "react";
import { Send, User, ChevronLeft, Globe } from "lucide-react";
import Snowfall from "../../components/Snowfall";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { chatService } from "../../services/chatService";

type Message = {
    text: string;
    sender: "user" | "santa" | "system";
    time: string;
    timestamp?: string;
};

type Contact = {
    userId: string;
    socketId?: string;
    lastActive: string;
    hasUnread: boolean;
    lastMessage?: string;
};

const SantaCommsPage = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedUser, setSelectedUser] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
    const [inputText, setInputText] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const users = await chatService.getActiveUsers();
                const mapped: Contact[] = users.map((u: any) => ({
                    userId: u.userId,
                    lastActive: new Date(u.lastActive).toLocaleTimeString(),
                    hasUnread: u.hasUnread,
                    lastMessage: u.lastMessage,
                }));
                setContacts(mapped);
            } catch (error) {
                console.error("Failed to load contacts", error);
            }
        };
        loadContacts();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("user_active", (data) => {
            if (data.userId === "santa" || data.userId === "Santa Claus")
                return;

            setContacts((prev) => {
                const existing = prev.find((u) => u.userId === data.userId);
                if (existing) {
                    return prev.map((u) =>
                        u.userId === data.userId
                            ? { ...u, socketId: data.socketId }
                            : u
                    );
                }
                return [
                    {
                        userId: data.userId,
                        socketId: data.socketId,
                        lastActive: new Date().toLocaleTimeString(),
                        hasUnread: true,
                    },
                    ...prev,
                ];
            });
        });

        socket.on("admin_receive_message", (data) => {
            if (data.senderId === "santa") return;

            setContacts((prev) => {
                const existing = prev.find((u) => u.userId === data.senderId);
                const isSelected = selectedUser?.userId === data.senderId;

                if (existing) {
                    return prev.map((u) =>
                        u.userId === data.senderId
                            ? {
                                ...u,
                                hasUnread: !isSelected,
                                lastActive: new Date().toLocaleTimeString(),
                                lastMessage: data.message,
                            }
                            : u
                    );
                }
                return [
                    {
                        userId: data.senderId,
                        socketId: socket.id || "",
                        lastActive: new Date().toLocaleTimeString(),
                        hasUnread: true,
                        lastMessage: data.message,
                    },
                    ...prev,
                ];
            });

            const newMessage: Message = {
                text: data.message,
                sender: "user",
                time: new Date().toLocaleTimeString(),
            };

            setMessages((prev) => ({
                ...prev,
                [data.senderId]: [...(prev[data.senderId] || []), newMessage],
            }));
        });

        return () => {
            socket.off("user_active");
            socket.off("admin_receive_message");
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchHistory = async () => {
            if (
                messages[selectedUser.userId] &&
                messages[selectedUser.userId].length > 0
            )
                return;

            try {
                const history = await chatService.getChatHistory(
                    selectedUser.userId
                );
                const mappedMessages: Message[] = history.map((m: any) => ({
                    text: m.text,
                    sender: m.sender === "santa" ? "santa" : "user",
                    time: new Date(m.timestamp).toLocaleTimeString(),
                    timestamp: m.timestamp,
                }));

                setMessages((prev) => ({
                    ...prev,
                    [selectedUser.userId]: mappedMessages,
                }));

                if (selectedUser.hasUnread) {
                    await chatService.markRead(selectedUser.userId);
                    setContacts((prev) =>
                        prev.map((u) =>
                            u.userId === selectedUser.userId
                                ? { ...u, hasUnread: false }
                                : u
                        )
                    );
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();

        setTimeout(
            () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
        );
    }, [selectedUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUser]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedUser || !socket) return;

        const msgData = {
            room: selectedUser.userId,
            message: inputText,
            senderId: "santa",
            senderName: "Santa Claus",
        };

        socket.emit("send_message", msgData);

        const newMessage: Message = {
            text: inputText,
            sender: "santa",
            time: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => ({
            ...prev,
            [selectedUser.userId]: [
                ...(prev[selectedUser.userId] || []),
                newMessage,
            ],
        }));

        setInputText("");
    };

    const selectUser = (user: Contact) => {
        setSelectedUser(user);
        setContacts((prev) =>
            prev.map((u) =>
                u.userId === user.userId ? { ...u, hasUnread: false } : u
            )
        );
    };

    return (
        <div className='min-h-screen bg-black text-white font-mono relative overflow-hidden flex flex-col'>
            <Snowfall />

            {/* Header */}
            <header className='border-b border-white/10 bg-black/50 backdrop-blur-md z-10 p-4 flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => navigate("/santa/dashboard")}
                        className='p-2 hover:bg-white/10 rounded'>
                        <ChevronLeft />
                    </button>
                    <div>
                        <h1 className='text-sm md:text-xl font-bold tracking-widest text-cyber-neon'>
                            COMMS DECK // GLOBAL
                        </h1>
                        <div className='flex items-center gap-2 text-[10px] md:text-xs text-gray-500'>
                            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                            <span>ENCRYPTED. SECURE.</span>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <div className='bg-red-900/20 border border-red-500/30 px-2 py-1 md:px-3 md:py-1 rounded text-red-400 text-[10px] md:text-xs animate-pulse'>
                        LIVE
                    </div>
                </div>
            </header>

            <div className='flex-1 flex overflow-hidden relative'>
                {/* Sidebar - User List */}
                <div
                    className={`w-full md:w-80 border-r border-white/10 bg-black/40 flex flex-col absolute md:relative inset-0 z-20 md:z-auto md:bg-transparent transition-transform duration-300 ${selectedUser
                        ? "-translate-x-full md:translate-x-0"
                        : "translate-x-0"
                        }`}>
                    <div className='p-4 border-b border-white/10 text-xs text-gray-400 uppercase tracking-widest'>
                        Active Uplinks ({contacts.length})
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        {contacts.length === 0 && (
                            <div className='p-8 text-center text-gray-600 text-sm'>
                                No history found.
                                <br />
                                Waiting for signals...
                            </div>
                        )}
                        {contacts.map((user) => (
                            <button
                                key={user.userId}
                                onClick={() => selectUser(user)}
                                className={`w-full p-4 flex items-center gap-3 border-b border-white/5 transition-colors text-left relative ${selectedUser?.userId === user.userId
                                    ? "bg-cyber-neon/10 border-l-2 border-l-cyber-neon"
                                    : "hover:bg-white/5 border-l-2 border-l-transparent"
                                    }`}>
                                <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center'>
                                    <User size={20} className='text-gray-400' />
                                </div>
                                <div>
                                    <div className='font-bold text-sm text-gray-200'>
                                        Agent {user.userId.slice(0, 8)}...
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                        {user.lastMessage
                                            ? user.lastMessage.slice(0, 20) +
                                            "..."
                                            : user.lastActive}
                                    </div>
                                </div>
                                {user.hasUnread && (
                                    <div className='absolute right-4 w-3 h-3 bg-red-500 rounded-full animate-bounce' />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div
                    className={`flex-1 flex flex-col bg-black/20 relative w-full ${!selectedUser ? "hidden md:flex" : "flex"
                        }`}>
                    {!selectedUser ? (
                        <div className='flex-1 flex-col items-center justify-center text-gray-600 opacity-50 hidden md:flex'>
                            <Globe size={64} className='mb-4 text-cyber-neon' />
                            <p className='tracking-widest'>
                                SELECT A SIGNAL TO INTERCEPT
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className='p-4 border-b border-white/10 bg-black/40 flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className='md:hidden p-2 -ml-2 hover:bg-white/10 rounded text-cyber-neon'>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <h2 className='font-bold text-sm md:text-base'>
                                            Uplink:{" "}
                                            {selectedUser.userId.slice(0, 10)}
                                            ...
                                        </h2>
                                        <span className='text-green-500 text-[10px] md:text-xs'>
                                            Signal Strength: 100%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4'>
                                {(messages[selectedUser.userId] || []).map(
                                    (msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-col ${msg.sender === "santa"
                                                ? "items-end"
                                                : "items-start"
                                                }`}>
                                            <div
                                                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-lg text-sm ${msg.sender === "santa"
                                                    ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 rounded-tr-none"
                                                    : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                                                    }`}>
                                                {msg.text}
                                            </div>
                                            <span className='text-[10px] text-gray-600 mt-1'>
                                                {msg.time}
                                            </span>
                                        </div>
                                    )
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className='p-4 border-t border-white/10 bg-black/60 backdrop-blur pb-6 md:pb-8'>
                                <div className='flex gap-2 md:gap-4 max-w-4xl mx-auto'>
                                    <input
                                        type='text'
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleSendMessage()
                                        }
                                        placeholder='Type command...'
                                        className='flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-neon/50 focus:outline-none transition-colors font-mono text-sm'
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className='px-4 md:px-6 py-2 bg-cyber-neon text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2 text-sm'>
                                        <Send size={18} />{" "}
                                        <span className='hidden md:inline'>
                                            SEND
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SantaCommsPage;
