import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onLoaded }: { url: string; onLoaded?: () => void }) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    useEffect(() => {
        if (scene && onLoaded) {
            onLoaded();
        }
    }, [scene, onLoaded]);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.5;
        }
    });

    return <primitive object={scene} ref={ref} />;
}

interface HologramViewerProps {
    modelUrl: string | null;
    onLoaded?: () => void;
}

const HologramViewer = ({ modelUrl, onLoaded }: HologramViewerProps) => {
    return (
        <div className="w-full h-full min-h-100 relative rounded-2xl overflow-hidden border border-cyber-neon/30 bg-black/40">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-neon z-20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-neon z-20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-neon z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-neon z-20" />

            {modelUrl ? (
                <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 2, 4], fov: 45 }}>
                    <color attach="background" args={['#050510']} />

                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
                    <directionalLight position={[-5, 5, -5]} intensity={1} />

                    <Suspense fallback={null}>
                        <Stage intensity={0.5} environment="city">
                            <Model url={modelUrl} onLoaded={onLoaded} />
                        </Stage>
                    </Suspense>

                    <OrbitControls makeDefault autoRotate autoRotateSpeed={2} minPolarAngle={0} maxPolarAngle={Math.PI} />
                </Canvas>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-cyber-neon/50 font-mono tracking-widest z-0">
                    WAITING FOR INPUT STREAM...
                </div>
            )}
        </div>
    );
};

export default HologramViewer;
