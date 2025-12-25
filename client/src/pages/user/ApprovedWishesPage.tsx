import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getApprovedWishes } from "../../services/scanService";
import { motion } from "framer-motion";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "../../components/Snowfall";

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

const ApprovedWishesPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishes = async () => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    const response = await getApprovedWishes(token);
                    if (response.success) {
                        setWishes(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching approved wishes:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWishes();
    }, [currentUser]);

    return (
        <div className='min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans p-4 md:p-8'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-40 pointer-events-none' />
            <Snowfall />

            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/")}
                className='absolute top-6 left-6 z-20 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase mb-8'>
                <ArrowLeft size={16} /> Home
            </motion.button>

            <div className='max-w-6xl mx-auto pt-24 relative z-10'>
                <h1 className='text-3xl md:text-5xl font-bold mb-8 tracking-tight text-center'>
                    Manifest
                </h1>

                {loading ? (
                    <div className='text-center text-cyber-neon animate-pulse font-mono'>
                        LOADING DATA...
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {wishes.map((wish) => (
                            <motion.div
                                key={wish._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/wishes/${wish._id}`)}
                                className='bg-black/40 border border-white/10 rounded-xl p-6 hover:border-cyber-neon/30 transition-all group cursor-pointer'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div
                                        className={`px-2 py-1 rounded text-[10px] font-mono tracking-widest uppercase ${wish.status === "pending"
                                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                                            : wish.status === "denied"
                                                ? "bg-red-500/10 text-red-500 border border-red-500/30"
                                                : "bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30"
                                            }`}>
                                        {wish.status}
                                    </div>
                                    <span className='text-gray-500 text-xs font-mono'>
                                        {new Date(
                                            wish.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className='text-xl font-bold mb-1'>
                                    {wish.username}
                                </h3>
                                <p className='text-gray-400 text-sm mb-4'>
                                    "{wish.wish}"
                                </p>

                                <div className='aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/5 relative'>
                                    {wish.imageUrl ? (
                                        <img
                                            src={wish.imageUrl}
                                            alt={wish.wish}
                                            className='w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity'
                                        />
                                    ) : (
                                        <div className='flex items-center justify-center h-full text-white/20'>
                                            <Gift className='w-8 h-8' />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovedWishesPage;
