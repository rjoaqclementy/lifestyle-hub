import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import MatchDetailsStep from './steps/MatchDetailsStep';
import ScheduleStep from './steps/ScheduleStep';
import VenueStep from './steps/VenueStep';
import ConfirmStep from './steps/ConfirmStep';

const STEPS = ['Match Details', 'Schedule', 'Venue', 'Confirm'];

const CreateMatchForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: 'casual',
    players_per_team: 5,
    gender_preference: 'mixed',
    skill_level: 'all',
    date: '',
    time: '',
    duration: 60,
    venue_id: '',
    description: '',
    status: 'open' // Set default status to 'open'
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: hubProfile } = await supabase
        .from('hub_profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('hub_id', '088aea9b-719f-40f5-b0e4-375e62be623a')
        .single();

      if (!hubProfile) {
        console.error('No hub profile found');
        return;
      }

      const { data: match, error } = await supabase
        .from('matches')
        .insert({
          ...formData,
          creator_id: hubProfile.id,
          hub_id: '088aea9b-719f-40f5-b0e4-375e62be623a'
        })
        .select()
        .single();

      if (error) throw error;

      onClose();
      navigate(`/soccer/match/${match.id}`);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <MatchDetailsStep
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 1:
        return (
          <ScheduleStep
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 2:
        return (
          <VenueStep
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 3:
        return (
          <ConfirmStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} steps={STEPS} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>

      {currentStep < STEPS.length - 1 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#573cff] hover:bg-[#573cff]/80 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateMatchForm;