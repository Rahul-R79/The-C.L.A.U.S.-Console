import { type ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
    <div className='group p-6 bg-white/5 border border-white/10 hover:border-cyber-neon/50 transition-all rounded-xl cursor-default hover:bg-white/[0.07]'>
        <div className='w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform group-hover:border-cyber-neon/30'>
            {icon}
        </div>
        <h3 className='text-lg font-bold mb-2 text-white group-hover:text-cyber-neon transition-colors'>
            {title}
        </h3>
        <p className='text-gray-400 text-sm leading-relaxed'>{desc}</p>
    </div>
);

export default FeatureCard;
