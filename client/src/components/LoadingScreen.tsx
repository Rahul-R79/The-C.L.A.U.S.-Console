import { motion } from "framer-motion";

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen = ({ message = "INITIALIZING SYSTEM..." }: LoadingScreenProps) => {
    return (
        <div className="fixed inset-0 z-50 bg-cyber-dark/90 backdrop-blur-md flex flex-col items-center justify-center">
            {/* Spinning Core */}
            <div className="relative w-24 h-24 mb-8">
                <motion.div
                    className="absolute inset-0 border-4 border-cyber-neon/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 border-t-4 border-cyber-neon rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-8 bg-cyber-neon rounded-full blur-md"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </div>

            {/* Text Output */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-cyber-neon tracking-[0.2em] text-center"
            >
                <div>{message}</div>
                <div className="text-xs mt-2 text-white/50 animate-pulse">
                    [ ACCESSING SECURE DATANET ]
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
