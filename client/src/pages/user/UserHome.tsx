import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Scan,
    Zap,
    Box,
    Gift,
    Cpu,
    Volume2,
    VolumeX,
    LogOut,
    LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Snowfall from "../../components/Snowfall";
import FeatureCard from "../../components/FeatureCard";
import HolographicToyBuilder from "../../components/HolographicToyBuilder";
import { useAuth } from "../../contexts/AuthContext";

import LoadingScreen from "../../components/LoadingScreen";
import SantaScrollScene from "../../components/SantaScrollScene";
import CommLinkWidget from "../../components/CommLinkWidget";

const UserHome = () => {
    const navigate = useNavigate();
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(() => {
        return (
            typeof window !== "undefined" &&
            sessionStorage.getItem("claus_visited") === "true"
        );
    });
    const audioRef = useRef<HTMLAudioElement>(null);

    // audio effect
    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.volume = 0.5;

        const playAudio = async () => {
            try {
                if (!isMuted) {
                    await audioRef.current?.play();
                } else {
                    audioRef.current?.pause();
                }
            } catch (err) { }
        };

        playAudio();
    }, [isMuted]);

    useEffect(() => {
        if (!hasInteracted) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [hasInteracted]);

    const handleInteraction = () => {
        if (audioRef.current && audioRef.current.paused && !isMuted) {
            audioRef.current.play().catch(() => { });
        }
    };

    const startExperience = async () => {
        setHasInteracted(true);
        sessionStorage.setItem("claus_visited", "true");
        if (audioRef.current) {
            try {
                await audioRef.current.play();
            } catch (e) {
                console.error("Audio play failed:", e);
            }
        }
    };

    const handleAction = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (currentUser) {
            navigate("/scanner");
        } else {
            setIsLoading(true);
            try {
                await loginWithGoogle();
            } catch (error: any) {
                console.error("Login failed", error);
                alert(
                    `Login Failed: ${error.message || "Unknown error"
                    }. Check console for details.`
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className='min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans'
            onClick={handleInteraction}>
            {isLoading && (
                <LoadingScreen message='UPDATING ACCESS PROTOCOLS...' />
            )}
            <AnimatePresence>
                {!hasInteracted && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        className='fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer'
                        onClick={startExperience}>
                        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyber-neon/10 via-black to-black opacity-50' />
                        <Snowfall />
                        <div className='text-center relative z-10 px-6'>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1 }}
                                className='mb-8'>
                                <div className='w-4 h-4 bg-cyber-neon rounded-full mx-auto mb-6 animate-pulse shadow-[0_0_20px_#0ff]' />
                                <h1 className='text-4xl md:text-6xl font-black tracking-[0.2em] text-white/90 mb-2'>
                                    C.L.A.U.S.
                                </h1>
                                <p className='text-cyber-neon font-mono text-sm tracking-widest'>
                                    CONSOLE V4.0
                                </p>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-8 py-3 bg-white/5 border border-white/20 text-white font-mono text-xs tracking-widest hover:bg-cyber-neon hover:text-black hover:border-cyber-neon transition-all duration-300 rounded-sm'>
                                [ CLICK TO INITIALIZE ]
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Snowfall />

            {/* Ambient Background Glow */}
            <div className='absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-neon/10 blur-[120px] rounded-full pointer-events-none' />
            <div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none' />

            <div className='container mx-auto px-6 py-8 relative z-10'>
                {/* Header */}
                <header className='flex justify-between items-center mb-16 md:mb-24'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-cyber-neon rounded-full animate-pulse' />
                        <span className='font-mono text-lg tracking-widest text-cyber-neon'>
                            C.L.A.U.S.
                        </span>
                    </div>
                    <div className='flex gap-3 md:gap-8 text-xs md:text-sm font-mono text-gray-400 items-center'>
                        <span className='hidden sm:inline'>
                            STATUS: {currentUser ? "ONLINE" : "OFFLINE"}
                        </span>
                        {currentUser && (
                            <span className='text-cyber-neon'>
                                <span className='hidden sm:inline'>
                                    AGENT:{" "}
                                </span>
                                {
                                    currentUser.displayName
                                        ?.toUpperCase()
                                        .split(" ")[0]
                                }
                            </span>
                        )}

                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className='flex items-center gap-2 hover:text-red-500 transition-colors'>
                                <LogOut size={16} />{" "}
                                <span className='hidden sm:inline'>LOGOUT</span>
                            </button>
                        ) : (
                            <button
                                onClick={loginWithGoogle}
                                className='flex items-center gap-2 hover:text-cyber-neon transition-colors'>
                                <LogIn size={16} />{" "}
                                <span className='hidden sm:inline'>LOGIN</span>
                            </button>
                        )}
                    </div>

                    {/* Music Control */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className='p-2 rounded-full bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/20 transition-colors'
                        title={
                            isMuted
                                ? "Unmute Christmas Spirit"
                                : "Mute Christmas Spirit"
                        }>
                        {isMuted ? (
                            <VolumeX size={20} />
                        ) : (
                            <Volume2 size={20} />
                        )}
                    </button>

                    {/* Background Audio */}
                    <audio ref={audioRef} src='/music/jingle-bells.mp3' loop />
                </header>

                {/* Hero Section */}
                <main className='grid lg:grid-cols-2 gap-12 items-center mb-24 min-h-[60vh]'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}>
                        <div className='inline-block px-3 py-1 mb-6 border border-cyber-neon/30 rounded-full bg-cyber-neon/5 text-cyber-neon text-xs font-mono tracking-wider'>
                            V4.0 // WISH DIGITIZATION PROTOCOL
                        </div>
                        <h1 className='text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight'>
                            Next Gen <br />
                            <span className='text-transparent bg-clip-text bg-linear-to-r from-red-500 to-cyber-neon'>
                                Toy Logistics
                            </span>
                        </h1>
                        <p className='text-gray-400 text-lg md:text-xl max-w-lg mb-8 font-light leading-relaxed'>
                            Translate handwritten wishes into manufacturing
                            blueprints instantly. The North Pole's most advanced
                            processing unit.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <button
                                onClick={handleAction}
                                className='px-8 py-4 bg-cyber-neon text-black font-bold tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 group rounded-sm shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]'>
                                <Scan className='w-5 h-5' />
                                {currentUser
                                    ? "INITIATE SCAN"
                                    : "LOGIN TO SCAN"}
                                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Side Futuristic Graphic - Holographic Toy Builder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='relative w-full h-full flex justify-center items-center'>
                        <HolographicToyBuilder />
                        <div className='absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-cyber-neon/30 -z-10' />
                        <div className='absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-red-500/30 -z-10' />
                    </motion.div>
                </main>

                {/* Features Grid - Quick Overview */}
                <div className='grid md:grid-cols-3 gap-6 mb-32'>
                    <FeatureCard
                        icon={<Scan className='w-6 h-6 text-cyber-neon' />}
                        title='Neural Scan'
                        desc='Advanced OCR for handwriting letters.'
                    />
                    <FeatureCard
                        icon={<Zap className='w-6 h-6 text-yellow-400' />}
                        title='Fast-Track Synth'
                        desc='Immediate 3D model generation from user inputs.'
                    />
                    <FeatureCard
                        icon={<Box className='w-6 h-6 text-blue-400' />}
                        title='AR Experience'
                        desc='Visualize your approved wishes in your real-world space.'
                    />
                </div>

                {/* Section 2: How The Wish Engine Works */}
                <section className='mb-32 relative'>
                    <div className='text-center mb-16'>
                        <span className='text-cyber-neon font-mono text-sm tracking-widest uppercase'>
                            Process Architecture
                        </span>
                        <h2 className='text-3xl md:text-5xl font-bold mt-2'>
                            From Ink to Inventory
                        </h2>
                    </div>

                    <div className='grid md:grid-cols-4 gap-8 relative'>
                        {/* Connecting Line */}
                        <div className='hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-white/10 -z-10' />

                        {[
                            {
                                step: "01",
                                title: "Capture",
                                desc: "High-res scanning of wish lists.",
                                icon: Scan,
                            },
                            {
                                step: "02",
                                title: "Decode",
                                desc: "AI analyzes handwriting semantics.",
                                icon: Cpu,
                            },
                            {
                                step: "03",
                                title: "Fabricate",
                                desc: "Blueprints sent to Elf workshops.",
                                icon: Zap,
                            },
                            {
                                step: "04",
                                title: "Dispatch",
                                desc: "Routed to Sleigh Launch Pad.",
                                icon: Gift,
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className='bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-xl relative hover:border-cyber-neon/50 transition-colors group'>
                                <div className='w-14 h-14 bg-cyber-dark border border-white/20 rounded-full flex items-center justify-center mb-4 text-cyber-neon mx-auto md:mx-0 relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]'>
                                    <item.icon className='w-6 h-6' />
                                </div>
                                <div className='absolute top-6 right-6 font-mono text-4xl font-bold text-white/5'>
                                    {item.step}
                                </div>
                                <h3 className='text-xl font-bold mb-2'>
                                    {item.title}
                                </h3>
                                <p className='text-gray-400 text-sm'>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* section 3: Interactive 3D Scene */}
                <section className='relative z-10 mb-24'>
                    <SantaScrollScene />
                </section>

                <footer className='border-t border-white/10 pt-12 pb-6 text-center text-gray-500 text-sm'>
                    <div className='flex justify-center gap-8 mb-8 font-mono'>
                        <a
                            href='#'
                            className='hover:text-cyber-neon transition-colors'>
                            POLAR POLICY
                        </a>
                        <a
                            href='#'
                            className='hover:text-cyber-neon transition-colors'>
                            ELF LOGIN
                        </a>
                        <a
                            href='#'
                            className='hover:text-cyber-neon transition-colors'>
                            CONTACT SANTA
                        </a>
                    </div>
                    <p>
                        © 2025 The C.L.A.U.S. Console. All rights reserved.
                        Powered by Christmas Spirit. <br></br>
                        Developed by <a href="https://www.linkedin.com/in/rahulqwe/" className="text-cyber-neon">Rahul</a>
                    </p>
                </footer>
            </div>

            <CommLinkWidget />
        </div>
    );
};

export default UserHome;
