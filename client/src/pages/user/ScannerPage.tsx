import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Camera,
    X,
    ScanLine,
    CheckCircle,
    ArrowLeft,
    List
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Snowfall from "../../components/Snowfall";
import { uploadScan } from "../../services/scanService";

const ScannerPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setErrorMsg("Protocol Violation: Only image files are permitted.");
            return;
        }
        setErrorMsg("");
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setScanComplete(false);
        setIsCameraActive(false);
    };

    const clearFile = () => {
        if (isScanning) return;
        setSelectedFile(null);
        setPreviewUrl(null);
        setScanComplete(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    // Scan processing
    const initiateScan = async () => {
        if (!selectedFile || !currentUser) return;
        setIsScanning(true);
        setErrorMsg("");

        try {
            const token = await currentUser.getIdToken();
            const data = await uploadScan(selectedFile, token);

            if (data.success) {
                setScanResult(data.data);
                setScanComplete(true);
            } else {
                setErrorMsg("Scan failed: " + data.error);
            }
        } catch (error) {
            setErrorMsg("Error connecting to scanner server.");
        } finally {
            setIsScanning(false);
        }
    };

    // Camera functions
    const startCamera = async () => {
        setIsCameraActive(true);
        setPreviewUrl(null);
        setSelectedFile(null);
        setErrorMsg("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setErrorMsg("Could not access camera. Please check permissions.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        setIsCameraActive(false);
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera_capture.jpg", {
                            type: "image/jpeg",
                        });
                        handleFile(file);
                        stopCamera();
                    }
                }, "image/jpeg");
            }
        }
    };

    return (
        <div className='min-h-screen bg-cyber-dark text-white relative overflow-hidden font-sans p-4 md:p-8'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-40 pointer-events-none' />
            <Snowfall />

            {/* Back Navigation */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/")}
                className='absolute top-6 left-6 z-20 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase mb-8'>
                <ArrowLeft size={16} /> <span className="hidden md:inline">Return to Console</span><span className="md:hidden">Back</span>
            </motion.button>

            {/* Forward Navigation */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/wishes")}
                className='absolute top-6 right-6 z-20 flex items-center gap-2 text-cyber-neon/70 hover:text-cyber-neon transition-colors font-mono text-xs tracking-widest uppercase mb-8'>
                <span className="hidden md:inline">View Manifest</span><span className="md:hidden">Manifest</span> <List size={16} />
            </motion.button>

            <div className='max-w-4xl mx-auto pt-16 relative z-10'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-block px-3 py-1 mb-4 border border-cyber-neon/30 rounded-full bg-cyber-neon/5 text-cyber-neon text-[10px] md:text-xs font-mono tracking-widest'>
                        PROTOCOL: WISH_DIGITIZER_V4
                    </motion.div>
                    <h1 className='text-3xl md:text-5xl font-bold mb-4 tracking-tight'>
                        Neural Letter Scanner
                    </h1>
                    <p className='text-gray-400 max-w-lg mx-auto text-sm md:text-base'>
                        Upload a photo of the handwritten wish list. Our AI will
                        extract the data and verify "Nice List" eligibility.
                    </p>
                </div>

                <div className='grid lg:grid-cols-5 gap-8'>
                    {/* Scanner Area */}
                    <div className='lg:col-span-3'>
                        <div
                            className={`relative min-h-100 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8
                            ${dragActive
                                    ? "border-cyber-neon bg-cyber-neon/5 scale-[1.02]"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }
                            ${previewUrl
                                    ? "border-solid border-cyber-neon/20 bg-black/40"
                                    : ""
                                }
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}>
                            <AnimatePresence mode='wait'>
                                {!previewUrl && !isCameraActive ? (
                                    <motion.div
                                        key='empty'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className='text-center'>
                                        <div className='w-20 h-20 bg-cyber-dark border border-cyber-neon/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,255,0.1)]'>
                                            <Upload className='w-8 h-8 text-cyber-neon' />
                                        </div>
                                        <h3 className='text-xl font-bold mb-2'>
                                            Upload Wish List
                                        </h3>
                                        <p className='text-gray-400 text-sm mb-6'>
                                            Drag & drop or click to browse
                                        </p>
                                        <div className='flex gap-4 justify-center'>
                                            <button
                                                onClick={() =>
                                                    inputRef.current?.click()
                                                }
                                                className='px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-sm font-mono tracking-wider transition-colors'>
                                                BROWSE FILES
                                            </button>
                                            <button
                                                onClick={startCamera}
                                                className='px-6 py-2 bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon rounded text-sm font-mono tracking-wider transition-colors flex items-center gap-2'>
                                                <Camera size={16} /> CAMERA
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : isCameraActive ? (
                                    <motion.div
                                        key='camera'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className='relative w-full h-full flex flex-col items-center justify-center'>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className='max-h-87.5 rounded-lg border border-cyber-neon/50 shadow-[0_0_20px_rgba(0,255,255,0.2)] mb-4'
                                        />
                                        <canvas
                                            ref={canvasRef}
                                            className='hidden'
                                        />

                                        <div className='flex gap-4'>
                                            <button
                                                onClick={capturePhoto}
                                                className='px-6 py-2 bg-cyber-neon text-black font-bold rounded hover:bg-white transition-colors flex items-center gap-2'>
                                                <Camera size={18} /> CAPTURE
                                            </button>
                                            <button
                                                onClick={stopCamera}
                                                className='px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors'>
                                                CANCEL
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='preview'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='relative w-full h-full flex items-center justify-center'>
                                        {/* Scanning Overlay */}
                                        {isScanning && (
                                            <motion.div
                                                className='absolute inset-0 z-20 bg-cyber-neon/10 border-t-2 border-cyber-neon shadow-[0_0_20px_#0ff]'
                                                initial={{ top: "0%" }}
                                                animate={{ top: "100%" }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                style={{ height: "10%" }}
                                            />
                                        )}

                                        <img
                                            src={previewUrl ?? undefined}
                                            alt='Scan Preview'
                                            className='max-h-87.5 rounded-lg shadow-2xl border border-white/10'
                                        />

                                        {!isScanning && (
                                            <button
                                                onClick={clearFile}
                                                className='absolute -top-2.5 -right-2.5 w-8 h-8 bg-black border border-red-500 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-black transition-colors z-30'>
                                                <X size={16} />
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <input
                                ref={inputRef}
                                type='file'
                                className='hidden'
                                onChange={handleChange}
                                accept='image/*'
                            />
                        </div>
                    </div>

                    {/* Controls and Status Sidebar */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Status Panel */}
                        <div className='bg-black/40 border border-white/10 rounded-xl p-6 min-h-50'>
                            <h3 className='text-cyber-neon font-mono text-sm tracking-widest mb-4 border-b border-white/10 pb-2'>
                                SYSTEM_STATUS
                            </h3>

                            <div className='space-y-4'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-400'>
                                        INPUT SOURCE
                                    </span>
                                    <span
                                        className={
                                            selectedFile
                                                ? "text-green-400"
                                                : "text-gray-600"
                                        }>
                                        {selectedFile
                                            ? "DETECTED"
                                            : "WAITING..."}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-400'>
                                        FILE SIZE
                                    </span>
                                    <span className='font-mono text-white/80'>
                                        {selectedFile
                                            ? `${(
                                                selectedFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)} MB`
                                            : "--"}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-400'>
                                        ANALYSIS EST.
                                    </span>
                                    <span className='font-mono text-white/80'>
                                        {selectedFile ? "~1.2s" : "--"}
                                    </span>
                                </div>
                                {errorMsg && (
                                    <div className='text-red-500 text-xs font-mono animate-pulse mt-2'>
                                        [ERROR]: {errorMsg}
                                    </div>
                                )}
                            </div>

                            {selectedFile && !scanComplete && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={initiateScan}
                                    disabled={isScanning}
                                    className={`w-full mt-8 py-4 font-bold tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all
                                    text-black
                                    ${isScanning
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-cyber-neon shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                                        }
                                    `}>
                                    {isScanning ? (
                                        <>PROCESSING...</>
                                    ) : (
                                        <>
                                            <ScanLine size={18} /> INITIATE
                                            DECODE
                                        </>
                                    )}
                                </motion.button>
                            )}

                            {scanComplete && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded text-center'>
                                    <div className='flex items-center justify-center gap-2 text-green-400 font-bold mb-1'>
                                        <CheckCircle size={18} /> SCAN COMPLETE
                                    </div>
                                    <p className='text-green-400/70 text-xs'>
                                        Data extracted successfully.
                                    </p>
                                    <button
                                        onClick={() =>
                                            navigate("/result", {
                                                state: { result: scanResult },
                                            })
                                        }
                                        className='w-full mt-3 py-2 bg-green-500 text-black font-bold text-xs tracking-widest rounded hover:bg-green-400 transition-colors'>
                                        VIEW EXTRACTED DATA
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;
