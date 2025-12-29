import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getWishById } from "../../services/scanService";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Gift,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Hammer,
    AlertTriangle,
} from "lucide-react";
import Snowfall from "../../components/Snowfall";
import LiveToyFabricator from "../../components/LiveToyFabricator";
import "@google/model-viewer";

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

    // Fabrication State
    const [fabricationComplete, setFabricationComplete] = useState(false);
    const [showFabricator, setShowFabricator] = useState(false);

    useEffect(() => {
        const fetchWish = async () => {
            if (currentUser && id) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await getWishById(id, token);
                    if (response.success) {
                        setWish(response.data);

                        if (response.data.status === "approved") {
                            const savedProgress = localStorage.getItem(
                                `fabrication_${id}`
                            );
                            if (savedProgress === "100") {
                                setFabricationComplete(true);
                                setShowFabricator(false);
                            } else {
                                setShowFabricator(true);
                                setFabricationComplete(false);
                            }
                        }
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
            <div className='min-h-screen bg-cyber-dark text-white flex items-center justify-center font-mono'>
                <div className='animate-pulse text-cyber-neon'>
                    LOADING SPECIFICATIONS...
                </div>
            </div>
        );
    }

    if (!wish) {
        return (
            <div className='min-h-screen bg-cyber-dark text-white flex flex-col items-center justify-center font-mono p-4'>
                <div className='text-red-500 mb-4 text-xl'>
                    MANIFEST NOT FOUND
                </div>
                <button
                    onClick={() => navigate("/wishes")}
                    className='flex items-center gap-2 text-cyber-neon hover:text-white transition-colors uppercase tracking-widest text-sm'>
                    <ArrowLeft size={16} /> Return to Manifest
                </button>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans p-4 md:p-8'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-60 pointer-events-none' />
            <Snowfall />

            <div className='max-w-6xl mx-auto pt-10 relative z-10'>
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/wishes")}
                    className='mb-8 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase'>
                    <ArrowLeft size={16} /> Back to Manifest
                </motion.button>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
                    {/* Left Column: Visuals (Image OR Fabricator OR AR) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='lg:col-span-7 space-y-6'>
                        {/* Dynamic Content Switcher */}
                        <div className='aspect-square bg-black/50 rounded-3xl overflow-hidden border border-white/10 relative group shadow-2xl shadow-purple-900/20 flex flex-col items-center justify-center'>
                            {/* CASE 1: AR View (Final Stage) */}
                            {showAR && wish.modelUrl ? (
                                // @ts-ignore
                                <model-viewer
                                    src={`${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/scan/model-proxy/${wish._id}`}
                                    ios-src=''
                                    poster={wish.imageUrl}
                                    onLoad={() => { }}
                                    alt='A 3D model of the gift'
                                    shadow-intensity='1'
                                    camera-controls
                                    auto-rotate
                                    ar
                                    ar-modes='webxr scene-viewer quick-look'
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                    }}>

                                    <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/20 pointer-events-none text-white'>
                                        Use gestures to rotate
                                    </div>
                                    <button
                                        slot='ar-button'
                                        className='absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform z-50'>
                                        👋 View in your Space
                                    </button>
                                    {/* @ts-ignore */}
                                </model-viewer>
                            ) : // CASE 2: Fabrication In Progress (Active Build)
                                showFabricator && !fabricationComplete ? (
                                    <div className='w-full h-full p-4'>
                                        <LiveToyFabricator
                                            itemName={wish.wish}
                                            onComplete={() => {
                                                setFabricationComplete(true);
                                                localStorage.setItem(
                                                    `fabrication_${id}`,
                                                    "100"
                                                );
                                                setShowFabricator(false);
                                            }}
                                        />
                                    </div>
                                ) : // CASE 3: Static Image (Default or Completed Preview)
                                    wish.imageUrl ? (
                                        <div className='relative w-full h-full'>
                                            <img
                                                src={wish.imageUrl}
                                                alt={wish.wish}
                                                className='w-full h-full object-cover relative z-10'
                                            />
                                            {/* Overlay for "Fabrication Complete" */}
                                            {fabricationComplete && !showAR && (
                                                <div className='absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20'>
                                                    <motion.div
                                                        initial={{
                                                            scale: 0.8,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1,
                                                        }}
                                                        className='text-center'>
                                                        <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_#22c55e]'>
                                                            <CheckCircle className='w-10 h-10 text-white' />
                                                        </div>
                                                        <h3 className='text-2xl font-bold text-white mb-2'>
                                                            READY FOR DELIVERY
                                                        </h3>
                                                        <p className='text-gray-300'>
                                                            Toy fabrication successful.
                                                        </p>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center h-full text-white/20'>
                                            <Gift className='w-24 h-24' />
                                        </div>
                                    )}

                            {/* Status Overlay (Only show if NOT in AR mode and NOT building) */}
                            {!showAR && !showFabricator && (
                                <>
                                    <div className='absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60 z-20 pointer-events-none' />
                                    <div className='absolute bottom-6 left-6 z-30'>
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-mono tracking-widest uppercase border ${wish.status === "pending"
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
                    </motion.div>

                    {/* Right Column: Details & Controls */}
                    <div className='lg:col-span-5 flex flex-col justify-center lg:pl-8'>
                        <div className='mb-2 text-cyber-neon font-mono text-sm tracking-widest uppercase'>
                            Subject Identity
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight'>
                            {wish.username}
                        </h1>

                        <div className='bg-black/40 border-l-4 border-cyber-neon p-6 mb-8 backdrop-blur-md rounded-r-xl'>
                            <h3 className='text-gray-400 font-mono text-xs tracking-widest uppercase mb-2'>
                                Wish Request
                            </h3>
                            <p className='text-xl md:text-2xl italic text-white/90 leading-relaxed'>
                                "{wish.wish}"
                            </p>
                        </div>

                        <div className='space-y-6'>
                            {wish.status === "approved" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className='relative group overflow-hidden rounded-xl bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 border-l-4 border-l-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)] backdrop-blur-sm'>
                                    <div className='flex flex-col xs:flex-row items-start gap-3 sm:gap-4'>
                                        <div className='relative shrink-0'>
                                            <div className='absolute inset-0 bg-orange-500 blur-md opacity-20 animate-pulse' />
                                            <div className='relative p-2 bg-orange-500/10 rounded-lg'>
                                                <AlertTriangle
                                                    size={20}
                                                    className='text-orange-500 animate-bounce'
                                                />
                                            </div>
                                        </div>
                                        <div className='flex-1 w-full'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <h4 className='text-orange-500 font-mono text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2'>
                                                    <span className='w-2 h-2 bg-orange-500 rounded-full animate-ping' />
                                                    AR Availability Alert
                                                </h4>
                                            </div>
                                            <div className='space-y-3'>
                                                <p className='text-white/90 text-sm leading-relaxed font-semibold'>
                                                    Visualize the AR experience
                                                    through your mobile phone. It
                                                    will{" "}
                                                    <span className='text-orange-400 font-bold underline decoration-orange-500/30 underline-offset-4'>
                                                        expire shortly
                                                    </span>{" "}
                                                    due to the Christmas rush.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual "Drain" Effect */}
                                    <div className='absolute bottom-0 left-0 w-full h-1 bg-white/5'>
                                        <motion.div
                                            initial={{ width: "100%" }}
                                            animate={{ width: "5%" }}
                                            transition={{
                                                duration: 120,
                                                ease: "linear",
                                            }}
                                            className='h-full bg-orange-500 shadow-[0_0_10px_#f97316]'
                                        />
                                    </div>
                                </motion.div>
                            )}
                            {/* Sentiment Analysis Card */}
                            <div className='flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors'>
                                <div
                                    className={`p-3 rounded-full ${wish.sentiment
                                        .toLowerCase()
                                        .includes("positive") ||
                                        wish.sentiment
                                            .toLowerCase()
                                            .includes("good")
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}>
                                    {wish.sentiment
                                        .toLowerCase()
                                        .includes("positive") ||
                                        wish.sentiment
                                            .toLowerCase()
                                            .includes("good") ? (
                                        <CheckCircle size={24} />
                                    ) : (
                                        <XCircle size={24} />
                                    )}
                                </div>
                                <div>
                                    <div className='text-sm font-bold text-white mb-0.5'>
                                        Sentiment Profile
                                    </div>
                                    <div className='text-xs text-gray-400 font-mono uppercase'>
                                        {wish.sentiment}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                                    <div className='text-gray-500 text-[10px] font-mono mb-1'>
                                        LOG DATE
                                    </div>
                                    <div className='text-white text-sm flex items-center gap-2'>
                                        <Calendar
                                            size={14}
                                            className='text-cyber-neon'
                                        />
                                        {new Date(
                                            wish.createdAt
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                                    <div className='text-gray-500 text-[10px] font-mono mb-1'>
                                        LOG TIME
                                    </div>
                                    <div className='text-white text-sm flex items-center gap-2'>
                                        <Clock
                                            size={14}
                                            className='text-cyber-neon'
                                        />
                                        {new Date(
                                            wish.createdAt
                                        ).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>

                            {/* THE BIG BUTTON ACTION AREA */}
                            <div className='pt-4'>
                                {wish.status === "approved" ? (
                                    <>
                                        {/* State: Building */}
                                        {!fabricationComplete && (
                                            <div className='w-full py-3 md:py-4 bg-black/40 border border-cyber-neon/30 text-cyber-neon rounded-xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-2'>
                                                <Hammer
                                                    className='animate-bounce shrink-0'
                                                    size={20}
                                                />
                                                <span className='font-mono font-bold tracking-widest animate-pulse text-xs md:text-sm text-center wrap-break-word'>
                                                    FABRICATION IN PROGRESS...
                                                </span>
                                            </div>
                                        )}

                                        {/* State: Complete */}
                                        {fabricationComplete && !showAR && (
                                            <motion.button
                                                initial={{
                                                    scale: 0.9,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowAR(true)}
                                                className='w-full py-5 bg-cyber-neon text-black font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] transition-all flex items-center justify-center gap-3'>
                                                <Gift className='w-6 h-6' />{" "}
                                                RECEIVE GIFT
                                            </motion.button>
                                        )}

                                        {/* State: AR Active */}
                                        {showAR && (
                                            <button
                                                onClick={() => setShowAR(false)}
                                                className='w-full py-4 border border-white/20 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-mono'>
                                                CLOSE HOLOGRAPHIC VIEW
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className='w-full py-4 bg-white/5 border border-white/10 text-gray-500 rounded-xl flex items-center justify-center gap-2 font-mono text-xs'>
                                        <Clock size={14} /> PENDING SANTA'S
                                        APPROVAL
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleWishPage;
