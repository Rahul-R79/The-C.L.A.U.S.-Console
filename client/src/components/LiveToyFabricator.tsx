import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface FabricatorProps {
    itemName: string;
    onComplete: () => void;
}

const LiveToyFabricator = ({ itemName, onComplete }: FabricatorProps) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    // Video Ref
    const videoRef = useRef<HTMLVideoElement>(null);

    // Game State
    const [isTired, setIsTired] = useState(false);
    const hasTiredEventOccurred = useRef(false);

    // Mini Game State (Precision Click)
    const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "WON">(
        "IDLE"
    );
    const [hits, setHits] = useState(0);
    const requiredHits = 3;
    const [markerPos, setMarkerPos] = useState(0);
    const directionRef = useRef(1);
    const gameLoopRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
        null
    );

    // Initial Logs
    useEffect(() => {
        setLogs([
            `[SYSTEM] Initializing build sequence for: ${itemName}`,
            `[SYSTEM] Loading schematic data...`,
        ]);
    }, [itemName]);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration || 1;
        const currentProgress = (currentTime / duration) * 100;

        setProgress(currentProgress);

        if (currentTime >= 4 && !hasTiredEventOccurred.current) {
            hasTiredEventOccurred.current = true;
            setIsTired(true);
            setGameState("PLAYING");
            videoRef.current.pause();
            setLogs((l) => [`[ALERT] ELF WORKER NEEDS A BREAK!`, ...l]);
        }

        if (Math.random() > 0.95 && !isTired) {
            const possibleLogs = [
                "Optimizing polygon mesh...",
                "Tightening bolts...",
                "Applying festive paint...",
                "Checking durability...",
                "Infusing holiday spirit...",
            ];
            const randomLog =
                possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
            setLogs((l) => [`[LOG] ${randomLog}`, ...l].slice(0, 4));
        }
    };

    const handleVideoEnded = () => {
        setProgress(100);
        onComplete();
    };

    // Mini Game Loop (Oscillating Marker)
    useEffect(() => {
        if (gameState === "PLAYING") {
            const loop = () => {
                setMarkerPos((prev) => {
                    let next = prev + 2.5 * directionRef.current;
                    if (next >= 100 || next <= 0) {
                        directionRef.current *= -1;
                    }
                    return next;
                });
                gameLoopRef.current = requestAnimationFrame(loop);
            };
            gameLoopRef.current = requestAnimationFrame(loop);
        } else {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState]);

    const handleHit = () => {
        if (markerPos >= 40 && markerPos <= 60) {
            const newHits = hits + 1;
            setHits(newHits);
            setLogs((l) => [
                `[GAME] NICE HIT! (${newHits}/${requiredHits})`,
                ...l,
            ]);

            if (newHits >= requiredHits) {
                setGameState("WON");
                setTimeout(() => {
                    setIsTired(false);
                    setLogs((l) => [
                        `[SYSTEM] ENERGY RESTORED! RESUMING...`,
                        ...l,
                    ]);
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                }, 1000);
            }
        } else {
            setLogs((l) => [`[GAME] MISS! TIMING ERROR!`, ...l]);
        }
    };

    return (
        <div className='relative w-full aspect-square bg-black/80 backdrop-blur-xl border border-cyber-neon/30 rounded-3xl overflow-hidden flex flex-col font-mono shadow-[0_0_50px_rgba(0,255,255,0.05)] select-none'>
            {/* Header */}
            <div className='p-3 md:p-4 border-b border-white/10 flex items-center justify-between bg-black/40 relative z-20'>
                <div className='flex items-center gap-2 text-cyber-neon'>
                    <Activity className='w-4 h-4 animate-pulse' />
                    <span className='text-[10px] md:text-xs font-bold tracking-widest'>
                        LIVE FEED
                    </span>
                </div>
                <div className='text-[10px] md:text-[10px] text-gray-500 tracking-wider'>
                    CAM_04
                </div>
            </div>

            <div className='flex-1 relative z-10 flex flex-col min-h-0 bg-black'>
                {/* Main Visual Area - VIDEO */}
                <div className='flex-1 relative overflow-hidden group'>
                    <video
                        ref={videoRef}
                        className='w-full h-full object-cover opacity-80'
                        autoPlay
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnded}>
                        <source src='/vedio/Elf_Builds.mp4' type='video/mp4' />

                        {/* Fallback Simulation if video fails to load*/}
                        <div className='flex items-center justify-center h-full text-red-500'>
                            VIDEO SIGNAL LOST
                        </div>
                    </video>

                    {/* Scanlines Overlay */}
                    <div className='absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-size-[100%_2px,3px_100%] pointer-events-none' />

                    {/* MINI GAME OVERLAY */}
                    <AnimatePresence>
                        {isTired && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 text-center'>
                                {gameState === "WON" ? (
                                    <div className='text-green-400 font-bold text-lg md:text-xl animate-bounce'>
                                        ENERGY RESTORED!
                                    </div>
                                ) : (
                                    <>
                                        <div className='flex flex-col items-center mb-3 md:mb-6 animate-pulse'>
                                            <div className='text-red-500 font-bold text-base md:text-xl tracking-widest mb-1 flex items-center gap-2'>
                                                <Activity
                                                    size={18}
                                                    className='md:w-5 md:h-5'
                                                />{" "}
                                                SYSTEM ALERT
                                            </div>
                                            <div className='text-white font-medium text-xs md:text-base text-center'>
                                                Worker Energy Depleted!
                                            </div>
                                        </div>

                                        <p className='text-gray-300 text-[10px] md:text-sm mb-4 max-w-[90%] md:max-w-[80%] text-center leading-relaxed'>
                                            Tap{" "}
                                            <span className='text-red-500 font-bold'>
                                                HIT
                                            </span>{" "}
                                            when the marker is in the{" "}
                                            <span className='text-green-500 font-bold'>
                                                GREEN
                                            </span>{" "}
                                            zone.
                                        </p>

                                        <div className='w-full max-w-50 md:max-w-60 h-6 md:h-8 bg-gray-800 rounded-full relative overflow-hidden mb-4 md:mb-6 border-2 border-white/20'>
                                            <div className='absolute left-[40%] width-[20%] w-[20%] h-full bg-green-500/50 border-x border-green-500' />
                                            <div
                                                className='absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_#fff]'
                                                style={{
                                                    left: `${markerPos}%`,
                                                }}
                                            />
                                        </div>

                                        <button
                                            onMouseDown={handleHit}
                                            onTouchStart={(e) => {
                                                e.preventDefault();
                                                handleHit();
                                            }}
                                            className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 border-4 border-red-400 shadow-[0_0_30px_#f00] active:scale-95 transition-transform flex items-center justify-center font-bold text-white text-xs md:text-xs'>
                                            HIT!
                                        </button>

                                        <div className='mt-3 md:mt-4 flex gap-1'>
                                            {[...Array(requiredHits)].map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                                                            i < hits
                                                                ? "bg-green-500 shadow-[0_0_10px_#0f0]"
                                                                : "bg-gray-700"
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress Bar & Status*/}
                <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/80 to-transparent z-20'>
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center text-[10px] text-gray-400 font-mono'>
                            <span>
                                STATUS:{" "}
                                {isTired
                                    ? "PAUSED // WORKER IDLE"
                                    : "ACTIVE // FABRICATING"}
                            </span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className='h-1 bg-white/10 rounded-full overflow-hidden'>
                            <motion.div
                                className='h-full bg-cyber-neon shadow-[0_0_10px_#0ff]'
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {/* Mini Logs */}
                        <div className='h-6 overflow-hidden font-mono text-[10px] text-cyber-neon/80 truncate'>
                            {logs[0] && `> ${logs[0]}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveToyFabricator;
