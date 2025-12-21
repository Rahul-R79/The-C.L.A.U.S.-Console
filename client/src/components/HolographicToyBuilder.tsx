import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const HolographicToyBuilder = () => {
    return (
        <div className='relative w-full max-w-sm aspect-square bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex items-center justify-center overflow-hidden'>
            {/* Grid floor */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] transform-[perspective(500px)_rotateX(60deg)_translateY(100px)_scale(2)] opacity-50' />

            <div className='relative z-10 flex flex-col items-center'>
                {/* Floating Cube / Wireframe */}
                <div className='mb-8 relative'>
                    <motion.div
                        animate={{ rotateY: 360, rotateX: 15 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className='w-32 h-32 relative preserve-3d'
                        style={{ transformStyle: "preserve-3d" }}>
                        {/* Wireframe box simulation using borders */}
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{ transform: "translateZ(64px)" }}
                        />
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{
                                transform:
                                    "rotateY(180deg) translateZ(64px)",
                            }}
                        />
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{
                                transform:
                                    "rotateY(90deg) translateZ(64px)",
                            }}
                        />
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{
                                transform:
                                    "rotateY(-90deg) translateZ(64px)",
                            }}
                        />
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{
                                transform:
                                    "rotateX(90deg) translateZ(64px)",
                            }}
                        />
                        <div
                            className='absolute inset-0 border-2 border-cyber-neon/50 bg-cyber-neon/5'
                            style={{
                                transform:
                                    "rotateX(-90deg) translateZ(64px)",
                            }}
                        />

                        {/* Inner Gift representing the "Toy" */}
                        <div
                            className='absolute inset-0 flex items-center justify-center'
                            style={{ transform: "rotateY(-360deg)" }}>
                            {" "}
                            {/* Counter rotation to keep icon facing forward */}
                            <Gift className='w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' />
                        </div>
                    </motion.div>

                    {/* Scanning Laser */}
                    <motion.div
                        className='absolute left-[-20%] right-[-20%] h-1 bg-red-500 shadow-[0_0_10px_#ff0000] z-20'
                        animate={{
                            top: ["0%", "100%", "0%"],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className='text-center font-mono text-xs text-cyber-neon tracking-widest bg-black/50 px-3 py-1 rounded border border-cyber-neon/30'>
                    <span className='mr-2'>BUILDING:</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                        }}>
                        █
                    </motion.span>
                </div>
            </div>
        </div>
    );
};

export default HolographicToyBuilder;
