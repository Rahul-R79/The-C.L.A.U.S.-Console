import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LogOut,
    LayoutDashboard,
    Gift,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    Map,
    MessageSquare,
} from "lucide-react";
import Snowfall from "../../components/Snowfall";
import { getSantaWishes } from "../../services/scanService";

const SantaDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        denied: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("santa_token");
        if (!token) {
            navigate("/santa/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSantaWishes();
                if (response.success) {
                    const wishes = response.data;
                    setStats({
                        total: wishes.length,
                        pending: wishes.filter(
                            (w: any) => w.status === "pending"
                        ).length,
                        approved: wishes.filter(
                            (w: any) => w.status === "approved"
                        ).length,
                        denied: wishes.filter((w: any) => w.status === "denied")
                            .length,
                    });
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("santa_token");
        navigate("/santa/login");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div className='min-h-screen bg-cyber-dark text-white font-sans relative overflow-hidden'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-60 pointer-events-none' />
            <Snowfall />

            {/* Top Navigation Bar */}
            <header className='relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-md top-0'>
                <div className='max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4'>
                    <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-start'>
                        <div className='flex items-center gap-4'>
                            <div className='w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]'>
                                <Gift className='text-white w-5 h-5 md:w-6 md:h-6' />
                            </div>
                            <div>
                                <h1 className='text-lg md:text-xl font-bold tracking-wider'>
                                    SANTA COMMAND OS
                                </h1>
                                <div className='flex items-center gap-2'>
                                    <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                                    <span className='text-[10px] font-mono text-green-500 tracking-widest uppercase'>
                                        System Online
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='md:hidden p-2 text-red-500 bg-red-500/10 rounded border border-red-500/30'>
                            <LogOut size={16} />
                        </button>
                    </div>

                    <div className='hidden md:flex items-center gap-6'>
                        <div className='flex items-center gap-4 text-xs font-mono text-gray-400'>
                            <div className='flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10'>
                                <Clock size={14} />
                                <span>
                                    UTC {new Date().toLocaleTimeString()}
                                </span>
                            </div>
                            <div className='flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10'>
                                <Map size={14} />
                                <span>NP-SD</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded border border-red-500/30 transition-all hover:shadow-[0_0_10px_rgba(220,38,38,0.2)]'>
                            <LogOut size={16} />
                            <span className='text-xs font-bold tracking-widest'>
                                LOGOUT
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <main className='relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8'>
                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                    className='space-y-6 md:space-y-8'>
                    {/* Welcome Section */}
                    <motion.div
                        variants={itemVariants}
                        className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
                        <div className='space-y-1'>
                            <h2 className='text-2xl md:text-3xl font-bold'>
                                Dashboard Overview
                            </h2>
                            <p className='text-sm md:text-base text-gray-400'>
                                Global wish fabrication status and logistics.
                            </p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
                            <button
                                onClick={() => navigate("/santa/queue")}
                                className='flex-1 md:flex-none px-6 py-2 bg-cyber-neon text-black font-bold text-sm tracking-wider rounded shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all flex items-center justify-center gap-2 whitespace-nowrap'>
                                <LayoutDashboard size={16} /> MANAGE QUEUE
                            </button>
                            <button
                                onClick={() => navigate("/santa/comms")}
                                className='flex-1 md:flex-none px-6 py-2 border border-cyber-neon text-cyber-neon font-bold text-sm tracking-wider rounded transition-all flex items-center justify-center gap-2 hover:bg-cyber-neon hover:text-black whitespace-nowrap'>
                                <MessageSquare size={16} /> OPEN COMMS
                            </button>
                        </div>
                    </motion.div>
                    {/* Stats Grid */}
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors'>
                            <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                                <Activity className='w-16 h-16 md:w-24 md:h-24' />
                            </div>
                            <div className='text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2'>
                                Total Wishes
                            </div>
                            <div className='text-2xl md:text-4xl font-bold text-white mb-2'>
                                {loading ? "..." : stats.total}
                            </div>
                            <div className='text-xs text-blue-400 font-mono flex items-center gap-1'>
                                <div className='w-full bg-blue-500/20 h-1 rounded overflow-hidden'>
                                    <div className='bg-blue-500 h-full w-[70%]' />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-yellow-500/50 transition-colors'>
                            <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                                <Clock className='w-16 h-16 md:w-24 md:h-24 text-yellow-500' />
                            </div>
                            <div className='text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2'>
                                Pending Review
                            </div>
                            <div className='text-2xl md:text-4xl font-bold text-yellow-500 mb-2'>
                                {loading ? "..." : stats.pending}
                            </div>
                            <div className='text-[10px] md:text-xs text-yellow-500/70 font-mono'>
                                Requires immediate attention
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-green-500/50 transition-colors'>
                            <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                                <CheckCircle className='w-16 h-16 md:w-24 md:h-24 text-green-500' />
                            </div>
                            <div className='text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2'>
                                Production Approved
                            </div>
                            <div className='text-2xl md:text-4xl font-bold text-green-500 mb-2'>
                                {loading ? "..." : stats.approved}
                            </div>
                            <div className='text-[10px] md:text-xs text-green-500/70 font-mono'>
                                Sent to Workshop Floor
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-red-500/50 transition-colors'>
                            <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                                <XCircle className='w-16 h-16 md:w-24 md:h-24 text-red-500' />
                            </div>
                            <div className='text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-2'>
                                Naughty List
                            </div>
                            <div className='text-2xl md:text-4xl font-bold text-red-500 mb-2'>
                                {loading ? "..." : stats.denied}
                            </div>
                            <div className='text-[10px] md:text-xs text-red-500/70 font-mono'>
                                Coal reserves allocated
                            </div>
                        </motion.div>
                    </div>
                    {/* Live gif section */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 rounded-2xl overflow-hidden h-75 md:h-125 group relative flex items-center justify-center p-4'>
                            <img
                                src='https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWVxdmEzZWQ3cnI5ZDdkY2wzNWZpMmZieWY4aWF4bzUwc2dqanowNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wZD7RX1fHKsU7FckHH/giphy.gif'
                                alt='santa chill'
                                className='w-full h-full objcet-fill opacity-80 hover:opacity-100 transition-opacity duration-500 scale-110'
                            />
                            <div className='absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-size-[100%_2px,3px_100%] pointer-events-none' />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className='bg-black/40 border border-white/10 rounded-2xl overflow-hidden h-75 md:h-125 group relative flex items-center justify-center p-4'>
                            <img
                                src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjFhenZwcmI4Z3Uyb2txeGluOG91aWR5M3BxZTVzMm9uazVnYWwyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WDx1UQ7wlmucbXJmtl/giphy.gif'
                                alt='santa gift packing'
                                className='w-full h-full object-fill opacity-80 hover:opacity-100 transition-opacity duration-500'
                            />
                            <div className='absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-size-[100%_2px,3px_100%] pointer-events-none' />
                        </motion.div>
                    </div>{" "}
                </motion.div>
            </main>
        </div>
    );
};

export default SantaDashboard;
