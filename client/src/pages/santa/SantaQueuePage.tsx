import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Check,
    X,
    ArrowLeft,
    Clock,
    Gift,
    AlertCircle,
    User
} from "lucide-react";
import { getSantaWishes, updateWishStatus } from "../../services/scanService";
import Snowfall from "../../components/Snowfall";

interface Wish {
    _id: string;
    username: string;
    wish: string;
    sentiment: string;
    status: 'pending' | 'approved' | 'denied';
    imageUrl?: string;
    createdAt: string;
}

const SantaQueuePage = () => {
    const navigate = useNavigate();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchWishes();
    }, []);

    const fetchWishes = async () => {
        try {
            const response = await getSantaWishes();
            if (response.success) {
                setWishes(response.data.filter((w: Wish) => w.status === 'pending'));
            }
        } catch (error) {
            console.error("Failed to fetch queue", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, newStatus: 'approved' | 'denied') => {
        setProcessingId(id);
        try {
            const response = await updateWishStatus(id, newStatus);
            if (response.success) {
                setWishes(prev => prev.filter(w => w._id !== id));
            }
        } catch (error) {
            alert("Failed to process wish. System offline?");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-dark text-white font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-60 pointer-events-none" />
            <Snowfall />

            <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-md top-0">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/santa/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
                            <Clock className="text-yellow-500" />
                            PENDING QUEUE
                        </h1>
                    </div>
                    <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500 text-xs font-mono">
                        WAITING: {wishes.length}
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-10">
                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">
                        SCANNING GLOBAL NETWORK...
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {wishes.map((wish) => (
                                <motion.div
                                    key={wish._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                                    className="bg-black/60 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all shadow-lg backdrop-blur-md"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="md:w-48 h-48 md:h-auto bg-gray-900 relative overflow-hidden group">
                                            {wish.imageUrl ? (
                                                <img
                                                    src={wish.imageUrl}
                                                    alt="Letter scan"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <AlertCircle size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2 text-lg font-bold text-cyber-neon">
                                                        <User size={18} />
                                                        {wish.username}
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {new Date(wish.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 mb-4">
                                                    <p className="text-gray-300 italic">"{wish.wish}"</p>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs font-mono">
                                                    <span className="text-gray-500">SENTIMENT ANALYSIS:</span>
                                                    <span className={`px-2 py-0.5 rounded ${wish.sentiment.toLowerCase().includes('positive') || wish.sentiment.toLowerCase().includes('good')
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {wish.sentiment.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-4 mt-6">
                                                <button
                                                    onClick={() => handleAction(wish._id, 'denied')}
                                                    disabled={processingId === wish._id}
                                                    className="flex-1 py-3 items-center justify-center gap-2 flex bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-500/30 rounded font-bold tracking-wider transition-all disabled:opacity-50"
                                                >
                                                    <X size={18} /> DENY
                                                </button>
                                                <button
                                                    onClick={() => handleAction(wish._id, 'approved')}
                                                    disabled={processingId === wish._id}
                                                    className="flex-1 py-3 items-center justify-center gap-2 flex bg-green-900/20 hover:bg-green-900/40 text-green-500 border border-green-500/30 rounded font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] disabled:opacity-50"
                                                >
                                                    {processingId === wish._id ? (
                                                        <span className="animate-pulse">PROCESSING...</span>
                                                    ) : (
                                                        <>
                                                            <Check size={18} /> APPROVE
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {wishes.length === 0 && !loading && (
                            <div className="text-center py-20 opacity-50">
                                <Gift size={48} className="mx-auto mb-4 text-gray-700" />
                                <h3 className="text-xl font-bold">ALL CAUGHT UP!</h3>
                                <p className="text-sm">No pending wishes in the global queue.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SantaQueuePage;
