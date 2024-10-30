import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-800" />
        
        {/* Active Progress Bar */}
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#573cff]"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Step Indicators */}
        {steps.map((step, index) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? 'bg-[#573cff]'
                  : 'bg-gray-800'
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className="text-sm text-white">{index + 1}</span>
              )}
            </motion.div>
            <span className="absolute top-10 text-sm text-gray-400 whitespace-nowrap">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;