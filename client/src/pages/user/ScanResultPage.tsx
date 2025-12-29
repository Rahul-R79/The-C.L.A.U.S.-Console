import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    AlertTriangle,
    Box,
    Hammer,
    Check,
    X,
    Loader2,
} from "lucide-react";
import Snowfall from "../../components/Snowfall";
import { useState, useRef, useEffect } from "react";
import HologramViewer from "../../components/HologramViewer";
import {
    generateToyTask,
    checkTaskStatus,
    approveWish,
} from "../../services/scanService";
import { useAuth } from "../../contexts/AuthContext";

interface ScanResult {
    personName: string;
    wish: string;
    sentiment: string;
    confidence: number;
}

const ScanResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as ScanResult;
    const { currentUser } = useAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [modelThumbnail, setModelThumbnail] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    if (!result) {
        return (
            <div className='min-h-screen bg-cyber-dark text-white flex items-center justify-center'>
                <div className='text-center'>
                    <AlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
                    <h2 className='text-xl font-bold mb-2'>
                        No Scan Data Found
                    </h2>
                    <button
                        onClick={() => navigate("/scanner")}
                        className='text-cyber-neon hover:underline'>
                        Return to Scanner
                    </button>
                </div>
            </div>
        );
    }

    const pollStatus = async (taskId: string, token: string) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            try {
                const statusData = await checkTaskStatus(taskId, token);
                const task = statusData.data.data;

                if (task.status === "success") {
                    if (intervalRef.current) clearInterval(intervalRef.current);

                    const url =
                        task.output?.pbr_model ||
                        task.output?.model ||
                        task.model?.model_url;
                    if (typeof url === "string") {
                        setModelUrl(url);
                        const thumb =
                            task.thumbnail ||
                            task.output?.rendered_image ||
                            task.render?.image_url;
                        if (thumb) setModelThumbnail(thumb);

                        // Keep generating state true until the 3D viewer signals it's ready
                        setStatusMessage("Finalizing Holographic Link...");
                    } else {
                        setStatusMessage("Error: Model URL missing.");
                        setIsGenerating(false);
                    }
                } else if (
                    task.status === "failed" ||
                    task.status === "cancelled"
                ) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsGenerating(false);
                    setStatusMessage(
                        `Generation Failed: ${task.message || "Unknown Error"}`
                    );
                    alert("Generation Failed.");
                } else {
                    setStatusMessage(
                        `Fabricating... ${task.progress || 0}%`
                    );
                }
            } catch (error) {
            }
        }, 2000);
    };

    const handleGenerateToy = async () => {
        if (!currentUser) return;
        setIsGenerating(true);
        setIsModelLoaded(false);
        setStatusMessage("Initiating Quantum Forge...");
        setModelUrl(null);

        try {
            const token = await currentUser.getIdToken();
            const response = await generateToyTask(result.wish, token);

            if (response.success && response.taskId) {
                setStatusMessage("Task Queued. Waking up fabricators...");
                pollStatus(response.taskId, token);
            } else {
                setStatusMessage("Failed to start generation.");
                setIsGenerating(false);
            }
        } catch (error: any) {
            setStatusMessage(
                "Error: " + (error.response?.data?.error || error.message)
            );
            setIsGenerating(false);
        }
    };

    const handleApprove = async () => {
        if (!currentUser || !modelUrl) return;
        setIsApproving(true);
        try {
            const token = await currentUser.getIdToken();
            await approveWish(
                {
                    username: result.personName,
                    wish: result.wish,
                    sentiment: result.sentiment,
                    status: "pending",
                    modelUrl: modelUrl,
                    imageUrl: modelThumbnail || modelUrl,
                },
                token
            );
            navigate("/wishes", { replace: true });
        } catch (error: any) {
            alert(
                "Approval Failed: " +
                (error.response?.data?.error || error.message)
            );
            setIsApproving(false);
        }
    };

    const handleDeny = () => {
        if (
            window.confirm(
                "Are you sure you want to deny this request? Data will be discarded."
            )
        ) {
            navigate("/scanner", { replace: true });
        }
    };

    const getProxyUrl = (originalUrl: string) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        return `${baseUrl}/api/v1/scan/model-proxy-raw?url=${encodeURIComponent(originalUrl)}`;
    };

    return (
        <div className='min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans p-4 md:p-8'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-40 pointer-events-none' />
            <Snowfall />

            {/* Back Navigation */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/scanner")}
                className='absolute top-6 left-6 z-20 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase mb-8'>
                <ArrowLeft size={16} /> New Scan
            </motion.button>

            <div className='max-w-6xl mx-auto pt-24 md:pt-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                {/* Left Column, Data Verification */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='space-y-8'>
                    <div>
                        <div className='inline-block px-3 py-1 mb-4 border border-green-500/30 rounded-full bg-green-500/5 text-green-400 text-[10px] md:text-xs font-mono tracking-widest'>
                            DECODING COMPLETE
                        </div>
                        <h1 className='text-3xl md:text-5xl font-bold mb-2 tracking-tight'>
                            Wish Blueprint
                        </h1>
                        <p className='text-gray-400 text-sm md:text-base'>
                            Please verify the decoded data before initiating the
                            manufacturing protocol.
                        </p>
                    </div>

                    {/* Data Card */}
                    <div className='bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-cyber-neon/30 transition-colors'>
                        <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
                            <Box className='w-24 h-24 text-cyber-neon' />
                        </div>

                        <div className='space-y-6 relative z-10'>
                            <div>
                                <label className='block text-gray-500 text-xs font-mono tracking-widest mb-1'>
                                    APPLICANT NAME
                                </label>
                                <div className='text-2xl font-bold text-white tracking-wide'>
                                    {result.personName}
                                </div>
                            </div>

                            <div>
                                <label className='block text-gray-500 text-xs font-mono tracking-widest mb-1'>
                                    DETECTED WISH
                                </label>
                                <div className='text-3xl font-bold text-cyber-neon tracking-tight leading-none'>
                                    {result.wish}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-gray-500 text-xs font-mono tracking-widest mb-1'>
                                        SENTIMENT
                                    </label>
                                    <div
                                        className={`text-lg font-bold ${result.sentiment
                                            .toLowerCase()
                                            .includes("nice") ||
                                            result.sentiment
                                                .toLowerCase()
                                                .includes("polite") ||
                                            result.sentiment
                                                .toLowerCase()
                                                .includes("sweet")
                                            ? "text-green-400"
                                            : "text-yellow-400"
                                            }`}>
                                        {result.sentiment}
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-gray-500 text-xs font-mono tracking-widest mb-1'>
                                        CONFIDENCE
                                    </label>
                                    <div className='text-lg font-bold text-blue-400'>
                                        {(result.confidence * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Lines */}
                        <div className='absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyber-neon/50 to-transparent opacity-50' />
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-4'>
                        {/* Conditional Action Buttons */}
                        {(!modelUrl || !isModelLoaded) ? (
                            <button
                                onClick={handleGenerateToy}
                                disabled={isGenerating}
                                className={`w-full py-4 font-bold tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all
                                text-black
                                ${isGenerating
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-cyber-neon shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                                    }
                                `}>
                                {isGenerating ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {statusMessage}
                                    </div>
                                ) : (
                                    <>
                                        <Hammer className='w-5 h-5' /> BUILD TOY
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className='grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                                <button
                                    onClick={handleDeny}
                                    disabled={isApproving}
                                    className='py-4 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-bold tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                                    <X className='w-5 h-5' /> DENY
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className={`py-4 bg-green-500 text-black hover:bg-green-400 font-bold tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2 ${isApproving
                                        ? "opacity-75 cursor-wait"
                                        : ""
                                        }`}>
                                    {isApproving ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin' />{" "}
                                            PENDING...
                                        </>
                                    ) : (
                                        <>
                                            <Check className='w-5 h-5' />{" "}
                                            APPROVE
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        {statusMessage && isGenerating && (
                            <div className='text-center font-mono text-xs text-cyber-neon animate-pulse'>
                                {statusMessage}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Column, Hologram Viewer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className='relative w-full aspect-square'>
                    <HologramViewer
                        modelUrl={modelUrl ? getProxyUrl(modelUrl) : null}
                        onLoaded={() => {
                            setIsModelLoaded(true);
                            setIsGenerating(false);
                            setStatusMessage("Neural Uplink Stable.");
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default ScanResultPage;
