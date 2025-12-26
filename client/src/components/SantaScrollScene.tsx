import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Image } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Suspense } from "react";

const Santa = () => {
    const scroll = useScroll();
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;

        const offset = scroll.offset;

        group.current.position.z = -offset * 30;
        group.current.position.x = Math.sin(offset * Math.PI * 2) * 2;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5 + Math.cos(offset * Math.PI * 4) * 1;

        group.current.rotation.z = Math.cos(offset * Math.PI * 2) * -0.2;
        group.current.rotation.x = 0.1; 
    });

    return (
        <group ref={group} dispose={null}>
            <Image
                url="/images/santa.png"
                scale={[4, 4]}
                transparent
                position={[0, 0, 0]}
            />
        </group>
    );
};



const SceneContent = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#FF0000" />

            <Santa />
        </>
    );
};

const SantaScrollScene = () => {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <style>{`
                ::-webkit-scrollbar {
                    display: none;
                }
                * {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <ScrollControls pages={3} damping={0.2}>
                        {/* 
                           ScrollControls creates a HTML scroll container in front of the canvas.
                           The content inside <Scroll> will move with the scroll bar.
                           The 'pages' prop defines how "tall" the scrollable area is relative to the viewport height.
                           pages={3} means the scroll container is 300vh tall.
                        */}
                        <SceneContent />

                        {/* 
                          We can overlay HTML content that scrolls WITH the 3D animation 
                        */}

                        <Scroll html style={{ width: '100%' }}>
                            <div className="w-full h-screen flex items-center justify-center p-10 pointer-events-none">
                                <h1 className="text-4xl md:text-6xl font-black text-white text-center drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                                    SANTA'S JOURNEY
                                </h1>
                            </div>

                            <div className="w-full h-screen flex items-center justify-end p-20 pointer-events-none">
                                <div className="max-w-md text-right">
                                    <h2 className="text-3xl font-bold text-cyber-neon mb-4">Global Logistics</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Monitoring 92% wish saturation in North America.
                                        Routes calculated. Sleigh systems nominal.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-screen flex items-center justify-start p-20 pointer-events-none">
                                <div className="max-w-md text-left">
                                    <h2 className="text-3xl font-bold text-green-400 mb-4">Secure Delivery</h2>
                                    <p className="text-lg text-gray-200 bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10">
                                        Quantum-encrypted leylines active.
                                        Only Level 5 Elves authorize payload release.
                                    </p>
                                </div>
                            </div>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default SantaScrollScene;
