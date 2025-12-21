import { motion } from "framer-motion";

const Snowfall = () => {
    const flakeCount = 200;
    const flakes = Array.from({ length: flakeCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
    }));

    return (
        <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
            {flakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className='absolute -top-5 bg-white rounded-full blur-[1px]'
                    style={{
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                    }}
                    animate={{
                        y: ["-20px", "110vh"],
                        x: ["-10px", "10px", "-10px"],
                    }}
                    transition={{
                        y: {
                            duration: flake.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: flake.delay,
                        },
                        x: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatType: "mirror",
                        },
                    }}
                />
            ))}
        </div>
    );
};

export default Snowfall;
