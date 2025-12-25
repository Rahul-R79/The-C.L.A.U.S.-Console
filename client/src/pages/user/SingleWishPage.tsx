import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getWishById } from "../../services/scanService";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import Snowfall from "../../components/Snowfall";
import '@google/model-viewer';

interface Wish {
    _id: string;
    username: string;
    wish: string;
    sentiment: string;
    status: string;
    imageUrl: string;
    modelUrl?: string;
    createdAt: string;
}

const SingleWishPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [wish, setWish] = useState<Wish | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAR, setShowAR] = useState(false);

    useEffect(() => {
        const fetchWish = async () => {
            if (currentUser && id) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await getWishById(id, token);
                    if (response.success) {
                        setWish(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch wish", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWish();
    }, [currentUser, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center font-mono">
                <div className="animate-pulse text-cyber-neon">LOADING SPECIFICATIONS...</div>
            </div>
        );
    }

    if (!wish) {
        return (
            <div className="min-h-screen bg-cyber-dark text-white flex flex-col items-center justify-center font-mono p-4">
                <div className="text-red-500 mb-4 text-xl">MANIFEST NOT FOUND</div>
                <button
                    onClick={() => navigate('/wishes')}
                    className="flex items-center gap-2 text-cyber-neon hover:text-white transition-colors uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Return to Manifest
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans p-4 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-60 pointer-events-none" />
            <Snowfall />

            <div className="max-w-5xl mx-auto pt-10 relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/wishes")}
                    className="mb-8 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase"
                >
                    <ArrowLeft size={16} /> Back to Manifest
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
                >
                    {/* Left Column: Image Visuals */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-black/50 rounded-2xl overflow-hidden border border-white/10 relative group shadow-2xl shadow-purple-900/20 flex flex-col items-center justify-center">

                            {showAR && wish.modelUrl ? (
                                // @ts-ignore
                                <model-viewer
                                    src={`/api/v1/scan/model-proxy/${wish._id}`}
                                    ios-src=""
                                    poster={wish.imageUrl}
                                    alt="A 3D model of the gift"
                                    shadow-intensity="1"
                                    camera-controls
                                    auto-rotate
                                    ar
                                    ar-modes="webxr scene-viewer quick-look"
                                    style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}
                                >
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/20 pointer-events-none">
                                        Use gestures to rotate
                                    </div>
                                    <button slot="ar-button" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform z-50">
                                        👋 View in your Space
                                    </button>
                                    {/* @ts-ignore */}
                                </model-viewer>

                            ) : wish.imageUrl ? (
                                <img
                                    src={wish.imageUrl}
                                    alt={wish.wish}
                                    className="w-full h-full object-cover relative z-10 hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white/20">
                                    <Gift className="w-24 h-24" />
                                </div>
                            )}

                            {!showAR && (
                                <>
                                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60 z-20 pointer-events-none" />
                                    <div className="absolute bottom-6 left-6 z-30">
                                        <span className={`px-3 py-1 rounded text-xs font-mono tracking-widest uppercase border ${wish.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/40"
                                            : wish.status === "denied"
                                                ? "bg-red-500/20 text-red-500 border-red-500/40"
                                                : "bg-cyber-neon/20 text-cyber-neon border-cyber-neon/40"
                                            }`}>
                                            STATUS: {wish.status}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Model Viewer meta data*/}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-4">
                                <span className="flex items-center gap-2"><Calendar size={14} /> DATE LOGGED</span>
                                <span>{new Date(wish.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                                <span className="flex items-center gap-2"><Clock size={14} /> TIME LOGGED</span>
                                <span>{new Date(wish.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 text-cyber-neon font-mono text-sm tracking-widest uppercase">Subject Identity</div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">{wish.username}</h1>

                        <div className="bg-black/40 border-l-4 border-cyber-neon p-6 mb-8 backdrop-blur-md">
                            <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase mb-2">Wish Request</h3>
                            <p className="text-xl md:text-2xl italic text-white/90 leading-relaxed">"{wish.wish}"</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase">System Analysis</h3>

                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className={`p-3 rounded-full ${wish.sentiment.toLowerCase().includes('positive') || wish.sentiment.toLowerCase().includes('good')
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {wish.sentiment.toLowerCase().includes('positive') || wish.sentiment.toLowerCase().includes('good')
                                        ? <CheckCircle size={24} />
                                        : <XCircle size={24} />
                                    }
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white mb-0.5">Sentiment Profile</div>
                                    <div className="text-xs text-gray-400 font-mono uppercase">{wish.sentiment}</div>
                                </div>
                            </div>

                            {wish.status === 'approved' && wish.modelUrl && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="pt-6"
                                >
                                    <button
                                        onClick={() => setShowAR(true)}
                                        className="w-full py-4 bg-linear-to-r from-cyber-neon to-blue-500 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <Gift className="animate-bounce" /> RECEIVE GIFT
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-2 font-mono">
                                        *Requires AR-compatible device for holographic projection
                                    </p>
                                </motion.div>
                            )}

                            {!wish.modelUrl && wish.status === 'approved' && (
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 mt-4">
                                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 animate-pulse">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-0.5">Fabrication in Progress</div>
                                        <div className="text-xs text-gray-400 font-mono">Elves are working on your 3D model.</div>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SingleWishPage;
