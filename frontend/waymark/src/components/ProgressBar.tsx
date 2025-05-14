import { motion } from 'framer-motion';

const steps = [
    'start',
    'name',
    'dates',
    'location',
    'activities',
    'budget',
    'collab',
    'review'
];

interface ProgressBarProps {
    currentStep: string;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
    const currentIndex = steps.findIndex(step => step === currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 px-8">
            <div className="relative">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#4ba46c]/20 -translate-y-1/2" />
                
                {/* Progress line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-0 h-[2px] bg-[#f3a034] -translate-y-1/2"
                />

                {/* Dots */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-3 h-3 rounded-full ${
                                index <= currentIndex 
                                    ? 'bg-[#f3a034]' 
                                    : 'bg-[#4ba46c]/20'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 