// src/app/home/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaFire,
  FaMedal,
  FaThumbsUp,
  FaThumbsDown,
  FaLeaf,
  FaStar,
  FaGem,
  FaAward,
  FaCloudSun,
  FaTint,
  FaAlignJustify,
  FaPrayingHands,
  FaPray,
  FaClock,
  FaMicrophone,
  FaBookReader,
  FaHandHoldingHeart,
  FaRunning,
  FaTshirt,
  FaTrash,
  FaUserLock,
} from 'react-icons/fa';
import Image from 'next/image';
import GradientProgressBar from '@/components/ui/gradient-progress-bar';

interface Deed {
  label: string;
  points: number;
  maxFrequency: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

interface DeedCounter {
  count: number;
  totalPoints: number;
}

const HomePage = () => {
  // Level and streak states
  const [level, setLevel] = useState(3);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streak, setStreak] = useState(7);
  const nextLevelScore = 375;
  const userName = 'Muhajirin Kids';

  // Main Good Deeds states
  const [mainGoodDeedsActivity, setMainGoodDeedsActivity] = useState(0);
  const [mainGoodDeedsScore, setMainGoodDeedsScore] = useState(0);
  const [mainGoodDeedCounters, setMainGoodDeedCounters] = useState<{ [key: string]: DeedCounter }>({});

  // Additional Good Deeds states
  const [additionalGoodDeedsActivity, setAdditionalGoodDeedsActivity] = useState(0);
  const [additionalGoodDeedsScore, setAdditionalGoodDeedsScore] = useState(0);
  const [additionalGoodDeedCounters, setAdditionalGoodDeedCounters] = useState<{ [key: string]: DeedCounter }>({});

  // Bad Deeds states
  const [badDeedsActivity, setBadDeedsActivity] = useState(0);
  const [badDeedsScore, setBadDeedsScore] = useState(0);
  const [badDeedCounters, setBadDeedCounters] = useState<{ [key: string]: DeedCounter }>({});

  // Deed lists
  const mainGoodDeedsList: Deed[] = [
    {
      label: 'Maghrib Berjamaah',
      points: 25,
      maxFrequency: 1,
      icon: FaCloudSun,
      description: 'Sholat Maghrib berjamaah di masjid.',
    },
    {
      label: 'Isya Berjamaah',
      points: 25,
      maxFrequency: 1,
      icon: FaStar,
      description: 'Sholat Isya berjamaah di masjid.',
    },
    {
      label: 'Jaga Wudhu',
      points: 5,
      maxFrequency: 3,
      icon: FaTint,
      description: 'Selalu siap dengan wudhu.',
    },
    {
      label: 'Rapikan Shaf',
      points: 5,
      maxFrequency: 3,
      icon: FaAlignJustify,
      description: 'Merapikan barisan sholat.',
    },
    {
      label: 'Dzikir/Doa',
      points: 10,
      maxFrequency: 3,
      icon: FaPrayingHands,
      description: 'Berdoa atau berdzikir setelah sholat.',
    },
  ];

  const additionalGoodDeedsList: Deed[] = [
    {
      label: 'Shubuh Berjamaah',
      points: 25,
      maxFrequency: 1,
      icon: FaPray,
      description: 'Sholat Shubuh berjamaah di masjid.',
    },
    {
      label: 'Rawatib',
      points: 15,
      maxFrequency: 3,
      icon: FaClock,
      description: 'Sholat sunnah sebelum/sesudah sholat wajib.',
    },
    {
      label: 'Adzan/Iqomah',
      points: 10,
      maxFrequency: 3,
      icon: FaMicrophone,
      description: 'Mengumandangkan adzan atau iqomah.',
    },
    {
      label: 'Belajar di Masjid',
      points: 10,
      maxFrequency: 1,
      icon: FaBookReader,
      description: 'Belajar atau mengaji di masjid.',
    },
    {
      label: 'Bersedekah',
      points: 10,
      maxFrequency: 1,
      icon: FaHandHoldingHeart,
      description: 'Memberi sedekah untuk masjid.',
    },
  ];

  const badDeedsList: Deed[] = [
    {
      label: 'Terlambat Sholat',
      points: -5,
      maxFrequency: 3,
      icon: FaClock,
      description: 'Datang terlambat untuk sholat berjamaah.',
    },
    {
      label: 'Lari di Masjid',
      points: -5,
      maxFrequency: 3,
      icon: FaRunning,
      description: 'Membuat keributan di dalam masjid.',
    },
    {
      label: 'Aurat Terbuka',
      points: -10,
      maxFrequency: 3,
      icon: FaTshirt,
      description: 'Memakai pakaian yang tidak sesuai dengan syariat.',
    },
    {
      label: 'Kotori Masjid',
      points: -5,
      maxFrequency: 3,
      icon: FaTrash,
      description: 'Membuat area masjid menjadi kotor.',
    },
    {
      label: 'Tidak Hormati Petugas',
      points: -10,
      maxFrequency: 3,
      icon: FaUserLock,
      description: 'Bersikap tidak sopan kepada petugas masjid.',
    },
  ];

  // Calculate maximum possible points
  const maxPossibleMainGoodPoints = mainGoodDeedsList.reduce((total: number, deed) => total + deed.points * deed.maxFrequency, 0);
  const maxPossibleAdditionalGoodPoints = additionalGoodDeedsList.reduce((total: number, deed) => total + deed.points * deed.maxFrequency, 0);

  // Calculate total score and progress
  const totalScore = mainGoodDeedsScore + additionalGoodDeedsScore - badDeedsScore;
  const progressPercentage = ((totalScore - level * 100) / ((level + 1) * 100 - level * 100)) * 100;

  // Background gradient calculation
  const getBackgroundGradient = (score: number) => {
    const hue = Math.min(120, Math.max(0, score));
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 40}, 70%, 60%))`;
  };

  /**
   * Handles the main good deed actions
   * @param deed The deed being performed
   */
  const handleGoodDeed = (deed: Deed) => {
    setMainGoodDeedCounters((prev: { [key: string]: DeedCounter }) => {
      // Get current counter for this specific deed
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;

      // Check if we've reached the maximum frequency for this deed
      if (newCount > deed.maxFrequency) {
        // Create new counters object with this deed reset to zero
        const updatedCounters = {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };

        // Calculate new totals from all deeds after reset
        // This ensures we maintain proper counts from other deeds
        const newTotals = Object.values(updatedCounters).reduce(
          (acc, deed) => ({
            activity: acc.activity + deed.count,
            score: acc.score + deed.totalPoints,
          }),
          { activity: 0, score: 0 }
        );

        // Update the main good deeds activity and score counters
        setMainGoodDeedsActivity(newTotals.activity);
        setMainGoodDeedsScore(newTotals.score);

        // Check for level up based on new calculated total
        const newTotalScore = newTotals.score + additionalGoodDeedsScore - badDeedsScore;
        if (newTotalScore >= nextLevelScore) {
          setLevel((prevLevel) => prevLevel + 1);
        }

        return updatedCounters;
      }

      // If we haven't reached max frequency, update the counters
      const updatedCounters = {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: current.totalPoints + deed.points,
        },
      };

      // Calculate new totals after increment
      const newTotals = Object.values(updatedCounters).reduce(
        (acc, deed) => ({
          activity: acc.activity + deed.count,
          score: acc.score + deed.totalPoints,
        }),
        { activity: 0, score: 0 }
      );

      // Update the main good deeds activity and score counters
      setMainGoodDeedsActivity(newTotals.activity);
      setMainGoodDeedsScore(newTotals.score);

      // Check for level up based on new calculated total
      const newTotalScore = newTotals.score + additionalGoodDeedsScore - badDeedsScore;
      if (newTotalScore >= nextLevelScore) {
        setLevel((prevLevel) => prevLevel + 1);
      }

      return updatedCounters;
    });
  };

  // Additional Good Deeds handler - follows same pattern as handleGoodDeed
  const handleAdditionalGoodDeed = (deed: Deed) => {
    setAdditionalGoodDeedCounters((prev: { [key: string]: DeedCounter }) => {
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;

      if (newCount > deed.maxFrequency) {
        const updatedCounters = {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };

        const newTotals = Object.values(updatedCounters).reduce(
          (acc, deed) => ({
            activity: acc.activity + deed.count,
            score: acc.score + deed.totalPoints,
          }),
          { activity: 0, score: 0 }
        );

        setAdditionalGoodDeedsActivity(newTotals.activity);
        setAdditionalGoodDeedsScore(newTotals.score);

        const newTotalScore = mainGoodDeedsScore + newTotals.score - badDeedsScore;
        if (newTotalScore >= nextLevelScore) {
          setLevel((prevLevel) => prevLevel + 1);
        }

        return updatedCounters;
      }

      const updatedCounters = {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: current.totalPoints + deed.points,
        },
      };

      const newTotals = Object.values(updatedCounters).reduce(
        (acc, deed) => ({
          activity: acc.activity + deed.count,
          score: acc.score + deed.totalPoints,
        }),
        { activity: 0, score: 0 }
      );

      setAdditionalGoodDeedsActivity(newTotals.activity);
      setAdditionalGoodDeedsScore(newTotals.score);

      const newTotalScore = mainGoodDeedsScore + newTotals.score - badDeedsScore;
      if (newTotalScore >= nextLevelScore) {
        setLevel((prevLevel) => prevLevel + 1);
      }

      return updatedCounters;
    });
  };

  // Bad Deeds handler - follows same pattern but subtracts from total score
  const handleBadDeed = (deed: Deed) => {
    setBadDeedCounters((prev: { [key: string]: DeedCounter }) => {
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;

      if (newCount > deed.maxFrequency) {
        const updatedCounters = {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };

        const newTotals = Object.values(updatedCounters).reduce(
          (acc, deed) => ({
            activity: acc.activity + deed.count,
            score: acc.score + deed.totalPoints,
          }),
          { activity: 0, score: 0 }
        );

        setBadDeedsActivity(newTotals.activity);
        setBadDeedsScore(newTotals.score);

        return updatedCounters;
      }

      const updatedCounters = {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: current.totalPoints + deed.points,
        },
      };

      const newTotals = Object.values(updatedCounters).reduce(
        (acc, deed) => ({
          activity: acc.activity + deed.count,
          score: acc.score + deed.totalPoints,
        }),
        { activity: 0, score: 0 }
      );

      setBadDeedsActivity(newTotals.activity);
      setBadDeedsScore(newTotals.score);

      return updatedCounters;
    });
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Top Section with Dynamic Background */}
      <div className='relative p-6 pb-24' style={{ background: getBackgroundGradient(totalScore) }}>
        {/* Avatar and Name */}
        <div className='absolute left-1/2 -bottom-12 transform -translate-x-1/2 text-center'>
          <div className='relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg mb-2'>
            <Image src='/avatars/avatar-02.jpg' alt='User Avatar' fill className='object-cover' priority />
          </div>
          <h2 className='text-gray-800 font-semibold mt-2'>{userName}</h2>
        </div>

        <div className='text-center'>
          {/* Animated score display using Framer Motion */}
          <motion.div
            className='text-6xl font-bold text-white mb-2'
            animate={{ scale: [1, 1.1, 1] }} // Creates a pulsing animation
            transition={{ duration: 0.5 }} // Animation duration
          >
            {totalScore}
          </motion.div>

          {/* Level Progress Bar */}
          <div className='max-w-xs mx-auto mb-4'>
            {/* Level and Score Display */}
            <div className='flex justify-between text-white/90 text-sm mb-1'>
              <span>Level {level}</span>
              <span>
                {totalScore} / {nextLevelScore}
              </span>
            </div>
            {/* Progress Bar Background */}
            <div className='w-full bg-white/30 rounded-full h-2'>
              {/* Progress Bar Fill */}
              <div className='bg-white h-2 rounded-full transition-all duration-300' style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          {/* Level Title */}
          <div className='text-xl text-white/90 font-semibold mb-4'>Kopral Level {level}</div>

          {/* Streak Counter */}
          <div className='flex items-center justify-center'>
            <FaFire className='text-white-500 mr-2' />
            <span className='text-white'>{streak} Day Streak!</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='container mx-auto px-4 pt-20'>
        {/* Deed Counters Grid */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          {/* Main Good Deeds Counter Card */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsUp className='text-green-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Al-Wajibat</span>
            </div>
            <div className='text-3xl font-bold text-green-500'>{mainGoodDeedsActivity}</div>
            <div className='text-m text-gray-600'>Σ Hasanat: +{mainGoodDeedsScore}</div>
          </div>

          {/* Additional Good Deeds Counter Card */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsUp className='text-blue-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Al-Mandubat</span>
            </div>
            <div className='text-3xl font-bold text-blue-500'>{additionalGoodDeedsActivity}</div>
            <div className='text-m text-gray-600'>Σ Hasanat: +{additionalGoodDeedsScore}</div>
          </div>

          {/* Bad Deeds Counter Card */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsDown className='text-red-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Al-Mahzurat</span>
            </div>
            <div className='text-3xl font-bold text-red-500'>{badDeedsActivity}</div>
            <div className='text-m text-gray-600'>Σ Sayyiat: -{badDeedsScore}</div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className='bg-white rounded-xl p-4 shadow-md mb-6 text-center'>
          <h2 className='text-gray-800 font-semibold mb-3'>Daily Achievements</h2>
          <div className='flex justify-between items-center px-4'>
            {/* Left section - Main Good Deeds */}
            <div className='flex gap-2 justify-center flex-1'>
              {(() => {
                const percentage = (mainGoodDeedsScore / maxPossibleMainGoodPoints) * 100;

                // 1-30%: FaLeaf icons
                if (percentage >= 1 && percentage <= 30) {
                  const count = percentage <= 10 ? 1 : percentage <= 20 ? 2 : 3;
                  return Array.from({ length: count }).map((_, i) => <FaLeaf key={i} className='w-10 h-10 text-green-500' />);
                }

                // 31-60%: Bronze medals
                if (percentage >= 31 && percentage <= 60) {
                  const count = percentage <= 40 ? 1 : percentage <= 50 ? 2 : 3;
                  return Array.from({ length: count }).map((_, i) => <FaMedal key={i} className='w-10 h-10 text-bronze' />);
                }

                // 61-90%: Silver medals
                if (percentage >= 61 && percentage <= 90) {
                  const count = percentage <= 70 ? 1 : percentage <= 80 ? 2 : 3;
                  return Array.from({ length: count }).map((_, i) => <FaMedal key={i} className='w-10 h-10 text-silver' />);
                }

                // 91-100%: Gold medals
                if (percentage >= 91) {
                  const count = percentage <= 95 ? 1 : percentage <= 99 ? 2 : 3;
                  return Array.from({ length: count }).map((_, i) => <FaMedal key={i} className='w-10 h-10 text-gold' />);
                }

                return <div className='w-10 h-10' />; // Empty placeholder to maintain spacing
              })()}
            </div>

            {/* Middle section - Additional Good Deeds Stars */}
            <div className='flex items-center gap-2 justify-center flex-1'>
              {additionalGoodDeedsActivity > 0 && (
                <>
                  <FaStar className='w-8 h-8 text-yellow-400' />
                  <span className='text-lg font-medium'>{additionalGoodDeedsActivity}x</span>
                </>
              )}
            </div>

            {/* Right section - Gems and Awards */}
            <div className='flex gap-2 justify-center flex-1'>
              {badDeedsActivity === 0 &&
                additionalGoodDeedsActivity > 0 &&
                (() => {
                  const additionalPercentage = (additionalGoodDeedsScore / maxPossibleAdditionalGoodPoints) * 100;

                  if (additionalPercentage >= 100) {
                    return <FaAward className='w-10 h-10 text-blue-500' />;
                  }

                  if (additionalPercentage >= 20) {
                    const count = additionalPercentage <= 50 ? 1 : additionalPercentage <= 80 ? 2 : 3;
                    return Array.from({ length: count }).map((_, i) => <FaGem key={i} className='w-10 h-10 text-blue-400' />);
                  }

                  return null;
                })()}
            </div>
          </div>
        </div>

        {/* Actions Grid - Main and Additional Good Deeds */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Main Good Deeds Section */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            {/* Header with Progress */}
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-gray-800 font-semibold'>Al-Wajibat</h3>
              <span className='text-sm text-gray-600'>
                {mainGoodDeedsScore} / {maxPossibleMainGoodPoints} poin
              </span>
            </div>

            {/* Progress Bar for Main Good Deeds */}
            <GradientProgressBar value={mainGoodDeedsScore} maxValue={maxPossibleMainGoodPoints} className='mb-4' />

            {/* Main Good Deeds Buttons */}
            <div className='space-y-2'>
              {mainGoodDeedsList.map((deed) => {
                const counter = mainGoodDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleGoodDeed(deed)}
                      className='flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 text-sm transition-colors flex items-center justify-end gap-2 pr-3'
                    >
                      <span>
                        {deed.label} | {deed.points}
                      </span>
                      {deed.icon && <deed.icon className='text-white' />}
                    </button>
                    <div className='w-16 text-center text-sm font-medium text-green-600 border border-green-200 rounded-lg p-2 shadow-sm'>
                      {counter.count} / {deed.maxFrequency}
                    </div>
                    <div className='w-16 text-center text-sm font-medium text-green-600 border border-green-200 rounded-lg p-2 shadow-sm'>
                      +{counter.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Good Deeds Section */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            {/* Header with Progress */}
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-gray-800 font-semibold'>Al-Mandubat</h3>
              <span className='text-sm text-gray-600'>
                {additionalGoodDeedsScore} / {maxPossibleAdditionalGoodPoints} poin
              </span>
            </div>

            {/* Progress Bar for Additional Good Deeds */}
            <GradientProgressBar value={additionalGoodDeedsScore} maxValue={maxPossibleAdditionalGoodPoints} className='mb-4' />

            {/* Additional Good Deeds Buttons */}
            <div className='space-y-2'>
              {additionalGoodDeedsList.map((deed) => {
                const counter = additionalGoodDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleAdditionalGoodDeed(deed)}
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 text-sm transition-colors flex items-center justify-end gap-2 pr-3'
                    >
                      <span>
                        {deed.label} | {deed.points}
                      </span>
                      {deed.icon && <deed.icon className='text-white' />}
                    </button>
                    <div className='w-16 text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-lg p-2 shadow-sm'>
                      {counter.count} / {deed.maxFrequency}
                    </div>
                    <div className='w-16 text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-lg p-2 shadow-sm'>
                      +{counter.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section - Bad Deeds and Daily Quote */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Bad Deeds Section */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <h3 className='text-gray-800 font-semibold mb-3'>Al-Mahzurat</h3>
            <div className='space-y-2'>
              {badDeedsList.map((deed) => {
                const counter = badDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleBadDeed(deed)}
                      className='flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 text-sm transition-colors flex items-center justify-end gap-2 pr-3'
                    >
                      <span>
                        {deed.label} | {deed.points}
                      </span>
                      {deed.icon && <deed.icon className='text-white' />}
                    </button>
                    <div className='w-16 text-center text-sm font-medium text-red-600 border border-red-200 rounded-lg p-2 shadow-sm'>
                      {counter.count} / {deed.maxFrequency}
                    </div>
                    <div className='w-16 text-center text-sm font-medium text-red-600 border border-red-200 rounded-lg p-2 shadow-sm'>
                      -{counter.totalPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Quote Section */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <h3 className='text-gray-800 font-semibold mb-2'>Daily Wisdom</h3>
            <p className='text-gray-600 text-sm italic'>Kindness is a language which the deaf can hear and the blind can see.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
