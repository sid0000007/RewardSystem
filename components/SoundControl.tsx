'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, TestTube, Settings } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { useSounds } from '@/lib/sounds';

interface SoundControlProps {
  className?: string;
}

export default function SoundControl({ className = '' }: SoundControlProps) {
  const { userProfile, updateUserProfile } = useRewards();
  const { setEnabled, setVolume, testAllSounds } = useSounds();
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(1.0);

  const soundsEnabled = userProfile.preferences?.sounds !== false;

  useEffect(() => {
    setEnabled(soundsEnabled);
  }, [soundsEnabled, setEnabled]);

  const toggleSounds = () => {
    const newSoundsEnabled = !soundsEnabled;
    updateUserProfile({
      preferences: {
        ...userProfile.preferences,
        sounds: newSoundsEnabled
      }
    });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolumeLevel(newVolume);
    setVolume(newVolume);
  };

  const handleTestAllSounds = async () => {
    if (isTestingAll || !soundsEnabled) return;
    
    setIsTestingAll(true);
    try {
      await testAllSounds();
    } catch (error) {
      console.warn('Failed to test sounds:', error);
    } finally {
      setIsTestingAll(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sound Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSounds}
        className={`p-2 rounded-lg transition-colors ${
          soundsEnabled
            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800'
        }`}
        title={soundsEnabled ? 'Disable sounds' : 'Enable sounds'}
      >
        {soundsEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </motion.button>

      {/* Volume Control */}
      {soundsEnabled && (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Volume control"
          >
            <Settings className="w-4 h-4" />
          </motion.button>

          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 p-4  dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Volume
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(volumeLevel * 100)}%
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volumeLevel}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex items-center gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTestAllSounds}
                    disabled={isTestingAll}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      isTestingAll
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
                    }`}
                  >
                    <TestTube className="w-3 h-3" />
                    {isTestingAll ? 'Testing...' : 'Test All'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVolumeSlider(false)}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Test Sound Button (Development) */}
      {process.env.NODE_ENV === 'development' && soundsEnabled && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTestAllSounds}
          disabled={isTestingAll}
          className={`p-2 rounded-lg transition-colors ${
            isTestingAll
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800'
          }`}
          title={isTestingAll ? 'Testing sounds...' : 'Test all sounds (Dev only)'}
        >
          <TestTube className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
}

// Hook for easy sound control integration
export const useSoundControl = () => {
  const { userProfile, updateUserProfile } = useRewards();
  const { setEnabled, setVolume } = useSounds();
  
  const soundsEnabled = userProfile.preferences?.sounds !== false;
  
  const toggleSounds = () => {
    const newSoundsEnabled = !soundsEnabled;
    updateUserProfile({
      preferences: {
        ...userProfile.preferences,
        sounds: newSoundsEnabled
      }
    });
    setEnabled(newSoundsEnabled);
  };
  
  const setSoundVolume = (volume: number) => {
    setVolume(Math.max(0, Math.min(1, volume)));
  };
  
  return {
    soundsEnabled,
    toggleSounds,
    setSoundVolume
  };
};