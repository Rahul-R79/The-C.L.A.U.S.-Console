import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Snowflake, KeyRound, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "../../components/Snowfall";

const SantaLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("santa_token");
        if (token) {
            navigate("/santa/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            if (email === import.meta.env.VITE_SANTA_USERNAME  && password === import.meta.env.VITE_SANTA_PASSWORD) {
                localStorage.setItem("santa_token", "valid_session");
                navigate("/santa/dashboard", { replace: true });
            } else {
                setError("ACCESS DENIED: Invalid Command Codes");
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-red-900/20 via-black to-black opacity-60 pointer-events-none" />
            <Snowfall />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500 to-transparent" />

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Lock className="text-red-500 w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-wider mb-2">RESTRICTED ACCESS</h1>
                        <p className="text-gray-400 text-xs font-mono tracking-widest uppercase">
                            Santa Command Interface
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 tracking-widest ml-1">OPERATOR ID</label>
                            <div className="relative group">
                                <Snowflake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all font-mono text-sm placeholder-gray-600"
                                    placeholder="santa@claus.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 tracking-widest ml-1">PASSCODE</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-all font-mono text-sm placeholder-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded border border-red-500/20"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest rounded transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                        >
                            {isLoading ? "AUTHENTICATING..." : "INITIATE SESSION"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-gray-600 font-mono">
                            UNAUTHORIZED ATTEMPTS WILL RESULT IN <br /> PERMANENT NAUGHTY LIST PLACEMENT.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SantaLoginPage;
