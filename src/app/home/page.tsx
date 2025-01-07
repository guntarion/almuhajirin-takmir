'use client';
import { useState } from 'react'; // Remove useEffect
import { motion } from 'framer-motion';
import { FaFire, FaTrophy, FaMedal, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Image from 'next/image';
import GradientProgressBar from '@/components/ui/gradient-progress-bar';

interface Deed {
  label: string;
  points: number;
  maxFrequency: number;
}

interface DeedCounter {
  count: number;
  totalPoints: number;
}

const HomePage = () => {
  const [totalScore, setTotalScore] = useState(340);
  const nextLevelScore = 375;
  const [level, setLevel] = useState(3);
  const [streak, setStreak] = useState(7);
  const userName = 'Muhajirin Kids';

  // Change existing good deeds related states
  const [mainGoodDeedsToday, setMainGoodDeedsToday] = useState(0);
  const [mainGoodDeedsScore, setMainGoodDeedsScore] = useState(0);
  const [mainGoodDeedCounters, setMainGoodDeedCounters] = useState<{ [key: string]: DeedCounter }>({});
  const [badDeedsToday, setBadDeedsToday] = useState(0);
  const [badDeedsScore, setBadDeedsScore] = useState(0);
  const [badDeedCounters, setBadDeedCounters] = useState<{ [key: string]: DeedCounter }>({});

  // Add new states for additional good deeds
  const [additionalGoodDeedsNow, setAdditionalGoodDeedsNow] = useState(0);
  const [additionalGoodDeedsScore, setAdditionalGoodDeedsScore] = useState(0);
  const [additionalGoodDeedCounters, setAdditionalGoodDeedCounters] = useState<{ [key: string]: DeedCounter }>({});

  const mainGoodDeedsList: Deed[] = [
    { label: 'Help Someone', points: 10, maxFrequency: 4 },
    { label: 'Complete Homework', points: 15, maxFrequency: 3 },
    { label: 'Clean Room', points: 12, maxFrequency: 2 },
    { label: 'Share with Others', points: 8, maxFrequency: 5 },
    { label: 'Exercise', points: 10, maxFrequency: 3 },
  ];

  const additionalGoodDeedsList: Deed[] = [
    { label: 'Read Books', points: 8, maxFrequency: 3 },
    { label: 'Practice Music', points: 10, maxFrequency: 2 },
    { label: 'Help Parents', points: 12, maxFrequency: 4 },
    { label: 'Learn New Skill', points: 15, maxFrequency: 2 },
    { label: 'Organize Space', points: 8, maxFrequency: 3 },
  ];

  const badDeedsList: Deed[] = [
    { label: 'Fighting', points: 20, maxFrequency: 3 },
    { label: 'Lying', points: 15, maxFrequency: 3 },
    { label: 'Breaking Rules', points: 12, maxFrequency: 4 },
    { label: 'Being Mean', points: 10, maxFrequency: 4 },
  ];

  const maxPossibleMainGoodPoints = mainGoodDeedsList.reduce((total: number, deed) => total + deed.points * deed.maxFrequency, 0);
  const maxPossibleAdditionalGoodPoints = additionalGoodDeedsList.reduce((total: number, deed) => total + deed.points * deed.maxFrequency, 0);

  // Calculate progress percentage
  const progressPercentage = ((totalScore - level * 100) / ((level + 1) * 100 - level * 100)) * 100;

  const getBackgroundGradient = (score: number) => {
    const hue = Math.min(120, Math.max(0, score));
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 40}, 70%, 60%))`;
  };

  const handleGoodDeed = (deed: Deed) => {
    setMainGoodDeedCounters((prev: { [key: string]: DeedCounter }) => {
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;

      if (newCount > deed.maxFrequency) {
        // Reset counters
        setMainGoodDeedsToday(() => 0);
        setMainGoodDeedsScore(() => 0);
        return {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };
      }

      // Normal increment
      setMainGoodDeedsToday(() => newCount);
      setMainGoodDeedsScore(() => newCount * deed.points);

      return {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: newCount * deed.points,
        },
      };
    });

    // Handle total score and leveling up
    setTotalScore((prev: number) => {
      const newScore = prev + deed.points;
      if (newScore >= nextLevelScore) {
        setLevel((prevLevel: number) => prevLevel + 1);
        return 0;
      }
      return newScore;
    });
  };

  const handleAdditionalGoodDeed = (deed: Deed) => {
    setAdditionalGoodDeedCounters((prev) => {
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;
      if (newCount > deed.maxFrequency) {
        setAdditionalGoodDeedsNow((prevTotal) => prevTotal - current.count);
        setAdditionalGoodDeedsScore((prevScore) => prevScore - current.totalPoints);
        setTotalScore((prevScore) => Math.max(0, prevScore - current.totalPoints));
        return {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };
      }

      setTotalScore((prev) => {
        const newScore = prev + deed.points;
        if (newScore >= nextLevelScore) {
          setLevel((prevLevel) => prevLevel + 1);
          return 0;
        }
        return newScore;
      });
      return {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: current.totalPoints + deed.points,
        },
      };
    });
    setAdditionalGoodDeedsNow((prev) => prev + 1);
    setAdditionalGoodDeedsScore((prev) => prev + deed.points);
    setTotalScore((prevScore) => Math.max(0, prevScore - deed.points));
  };
  const handleBadDeed = (deed: Deed) => {
    setBadDeedCounters((prev) => {
      const current = prev[deed.label] || { count: 0, totalPoints: 0 };
      const newCount = current.count + 1;
      if (newCount > deed.maxFrequency) {
        setBadDeedsToday((prevTotal) => prevTotal - current.count);
        setBadDeedsScore((prevScore) => prevScore - current.totalPoints);
        setTotalScore((prevScore) => Math.min(nextLevelScore - 1, prevScore + current.totalPoints));
        return {
          ...prev,
          [deed.label]: {
            count: 0,
            totalPoints: 0,
          },
        };
      }

      return {
        ...prev,
        [deed.label]: {
          count: newCount,
          totalPoints: current.totalPoints + deed.points,
        },
      };
    });
    setBadDeedsToday((prev) => prev + 1);
    setBadDeedsScore((prev) => prev + deed.points);
    setTotalScore((prev) => Math.max(0, prev - deed.points));
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
          <motion.div className='text-6xl font-bold text-white mb-2' animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
            {totalScore}
          </motion.div>

          {/* Level Progress Bar */}
          <div className='max-w-xs mx-auto mb-4'>
            <div className='flex justify-between text-white/90 text-sm mb-1'>
              <span>Level {level}</span>
              <span>
                {totalScore} / {nextLevelScore}
              </span>
            </div>
            <div className='w-full bg-white/30 rounded-full h-2'>
              <div className='bg-white h-2 rounded-full transition-all duration-300' style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <div className='text-xl text-white/90 font-semibold mb-4'>Kindness Warrior Level {level}</div>
          <div className='flex items-center justify-center'>
            <FaFire className='text-orange-500 mr-2' />
            <span className='text-white'>{streak} Day Streak!</span>
          </div>
        </div>
      </div>

      {/* Deed Counters */}
      <div className='container mx-auto px-4 pt-20'>
        <div className='grid grid-cols-3 gap-4 mb-6'>
          {/* Main Good Deeds Counter */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsUp className='text-green-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Main Good Deeds</span>
            </div>
            <div className='text-3xl font-bold text-green-500'>{mainGoodDeedsToday}</div>
            <div className='text-m text-gray-600'>Total Score: +{mainGoodDeedsScore}</div>
          </div>

          {/* Additional Good Deeds Counter */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsUp className='text-blue-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Additional Good Deeds</span>
            </div>
            <div className='text-3xl font-bold text-blue-500'>{additionalGoodDeedsNow}</div>
            <div className='text-m text-gray-600'>Total Score: +{additionalGoodDeedsScore}</div>
          </div>

          {/* Bad Deeds Counter */}
          <div className='bg-white rounded-xl p-4 shadow-md text-center'>
            <div className='flex items-center justify-center mb-2'>
              <FaThumbsDown className='text-red-500 text-xl mr-2' />
              <span className='text-gray-800 font-semibold'>Bad Deeds</span>
            </div>
            <div className='text-3xl font-bold text-red-500'>{badDeedsToday}</div>
            <div className='text-m text-gray-600'>Total Score: -{badDeedsScore}</div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className='bg-white rounded-xl p-4 shadow-md mb-6'>
          <h2 className='text-gray-800 font-semibold mb-3'>Daily Achievements</h2>
          <div className='flex gap-2 overflow-x-auto'>
            {[1, 2, 3].map((badge) => (
              <div key={badge} className='bg-yellow-50 rounded-full p-2 w-12 h-12 flex items-center justify-center'>
                <FaMedal className='text-yellow-500' />
              </div>
            ))}
          </div>
        </div>

        {/* Actions Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Main Good Deeds */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-gray-800 font-semibold'>Main Good Deeds</h3>
              <span className='text-sm text-gray-600'>
                {mainGoodDeedsScore} / {maxPossibleMainGoodPoints} points
              </span>
            </div>

            <GradientProgressBar value={mainGoodDeedsScore} maxValue={maxPossibleMainGoodPoints} className='mb-4' />

            <div className='space-y-2'>
              {mainGoodDeedsList.map((deed) => {
                const counter = mainGoodDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleGoodDeed(deed)}
                      className='flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 text-sm transition-colors'
                    >
                      {deed.label} | {deed.points}
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

          {/* Additional Good Deeds */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-gray-800 font-semibold'>Additional Good Deeds</h3>
              <span className='text-sm text-gray-600'>
                {additionalGoodDeedsScore} / {maxPossibleAdditionalGoodPoints} points
              </span>
            </div>

            <GradientProgressBar value={additionalGoodDeedsScore} maxValue={maxPossibleAdditionalGoodPoints} className='mb-4' />

            <div className='space-y-2'>
              {additionalGoodDeedsList.map((deed) => {
                const counter = additionalGoodDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleAdditionalGoodDeed(deed)}
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 text-sm transition-colors'
                    >
                      {deed.label} | {deed.points}
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

        {/* Additional Features */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Bad Deeds */}
          <div className='bg-white rounded-xl p-4 shadow-md'>
            <h3 className='text-gray-800 font-semibold mb-3'>Bad Deeds</h3>
            <div className='space-y-2'>
              {badDeedsList.map((deed) => {
                const counter = badDeedCounters[deed.label] || { count: 0, totalPoints: 0 };
                return (
                  <div key={deed.label} className='flex items-center gap-2'>
                    <button
                      onClick={() => handleBadDeed(deed)}
                      className='flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 text-sm transition-colors'
                    >
                      {deed.label} | {deed.points}
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
          {/* Daily Quote */}
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
