'use client';
// src/app/admin/achievement/page.tsx
import { useState } from 'react';
import { rankData, levelData } from '@/lib/constants/achievement';
import {
  FaMedal,
  FaTrophy,
  FaAward,
  FaStar,
  FaCrown,
  FaRibbon,
  FaShieldAlt,
  FaGem,
  FaCertificate,
  FaFlagCheckered,
  FaFire,
  FaHeart,
  FaLeaf,
  FaRocket,
  FaLightbulb,
  FaGraduationCap,
  FaBook,
  FaSmile,
  FaCalendarCheck,
  FaChartLine,
  FaLevelUpAlt,
  FaArrowUp,
  FaBatteryFull,
  FaTasks,
  FaCheckCircle,
  FaClipboardCheck,
  FaFlag,
  FaMountain,
  FaRoad,
  FaCoins,
  FaGift,
  FaMoneyBillAlt,
  FaPiggyBank,
  FaShoppingCart,
  FaUsers,
  FaUserFriends,
  FaHandsHelping,
  FaComments,
  FaThumbsUp,
  FaHeartbeat,
  FaSmileBeam,
  FaStethoscope,
  FaBookOpen,
  FaClock,
  FaHourglass,
  FaCalendarAlt,
  FaBell,
  FaMagic,
} from 'react-icons/fa';

const icons = [
  { icon: FaMedal, name: 'FaMedal', purpose: 'General achievement badge' },
  { icon: FaTrophy, name: 'FaTrophy', purpose: 'Top-tier achievements or milestones' },
  { icon: FaAward, name: 'FaAward', purpose: 'Special accomplishments' },
  { icon: FaStar, name: 'FaStar', purpose: 'Daily streaks or consistent performance' },
  { icon: FaCrown, name: 'FaCrown', purpose: 'Being the best or reaching the highest level' },
  { icon: FaRibbon, name: 'FaRibbon', purpose: 'Participation or completion badges' },
  { icon: FaShieldAlt, name: 'FaShieldAlt', purpose: 'Defender or consistency-based achievements' },
  { icon: FaGem, name: 'FaGem', purpose: 'Rare or premium achievements' },
  { icon: FaCertificate, name: 'FaCertificate', purpose: 'Official milestones or certifications' },
  { icon: FaFlagCheckered, name: 'FaFlagCheckered', purpose: 'Completing a challenge or race' },
  { icon: FaFire, name: 'FaFire', purpose: 'Streaks or high-intensity habits' },
  { icon: FaHeart, name: 'FaHeart', purpose: 'Self-care or health-related habits' },
  { icon: FaLeaf, name: 'FaLeaf', purpose: 'Eco-friendly or sustainability habits' },
  { icon: FaRocket, name: 'FaRocket', purpose: 'Rapid progress or explosive growth' },
  { icon: FaLightbulb, name: 'FaLightbulb', purpose: 'Creative or learning-based habits' },
  { icon: FaGraduationCap, name: 'FaGraduationCap', purpose: 'Educational milestones' },
  { icon: FaBook, name: 'FaBook', purpose: 'Reading or knowledge-based habits' },
  { icon: FaSmile, name: 'FaSmile', purpose: 'Mood-tracking or positivity streaks' },
  { icon: FaCalendarCheck, name: 'FaCalendarCheck', purpose: 'Consistency or daily check-ins' },
  { icon: FaChartLine, name: 'FaChartLine', purpose: 'Progress tracking or leveling up' },
  { icon: FaLevelUpAlt, name: 'FaLevelUpAlt', purpose: 'Leveling up in the app' },
  { icon: FaArrowUp, name: 'FaArrowUp', purpose: 'Progress or improvement' },
  { icon: FaBatteryFull, name: 'FaBatteryFull', purpose: 'Energy or motivation levels' },
  { icon: FaTasks, name: 'FaTasks', purpose: 'Completing tasks or to-do lists' },
  { icon: FaCheckCircle, name: 'FaCheckCircle', purpose: 'Completed habits or tasks' },
  { icon: FaClipboardCheck, name: 'FaClipboardCheck', purpose: 'Habit completion' },
  { icon: FaFlag, name: 'FaFlag', purpose: 'Setting goals or milestones' },
  { icon: FaMountain, name: 'FaMountain', purpose: 'Climbing challenges or big goals' },
  { icon: FaRoad, name: 'FaRoad', purpose: 'Long-term progress or journeys' },
  { icon: FaCoins, name: 'FaCoins', purpose: 'In-app currency or points' },
  { icon: FaGift, name: 'FaGift', purpose: 'Surprise rewards or gifts' },
  { icon: FaMoneyBillAlt, name: 'FaMoneyBillAlt', purpose: 'Financial habits or savings goals' },
  { icon: FaPiggyBank, name: 'FaPiggyBank', purpose: 'Saving-related habits' },
  { icon: FaShoppingCart, name: 'FaShoppingCart', purpose: 'Shopping or spending habits' },
  { icon: FaUsers, name: 'FaUsers', purpose: 'Group challenges or community goals' },
  { icon: FaUserFriends, name: 'FaUserFriends', purpose: 'Friend-based challenges' },
  { icon: FaHandsHelping, name: 'FaHandsHelping', purpose: 'Collaborative habits or helping others' },
  { icon: FaComments, name: 'FaComments', purpose: 'Social engagement or communication habits' },
  { icon: FaThumbsUp, name: 'FaThumbsUp', purpose: 'Likes or positive feedback' },
  { icon: FaHeartbeat, name: 'FaHeartbeat', purpose: 'Health or fitness streaks' },
  { icon: FaSmileBeam, name: 'FaSmileBeam', purpose: 'Mood or happiness tracking' },
  { icon: FaStethoscope, name: 'FaStethoscope', purpose: 'Health-related habits' },
  { icon: FaBookOpen, name: 'FaBookOpen', purpose: 'Reading or learning habits' },
  { icon: FaClock, name: 'FaClock', purpose: 'Time-based habits or streaks' },
  { icon: FaHourglass, name: 'FaHourglass', purpose: 'Time-limited challenges' },
  { icon: FaCalendarAlt, name: 'FaCalendarAlt', purpose: 'Daily or weekly habits' },
  { icon: FaBell, name: 'FaBell', purpose: 'Reminders or notifications' },
  { icon: FaMagic, name: 'FaMagic', purpose: 'Magical or fun achievements' },
];

export default function AchievementPage() {
  const [activeTab, setActiveTab] = useState<'Level' | 'Rank' | 'Icons'>('Level');

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Achievement Dashboard</h1>
      <div className='flex space-x-4 mt-4 border-b'>
        <button
          onClick={() => setActiveTab('Level')}
          className={`py-2 px-4 ${activeTab === 'Level' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Level
        </button>
        <button
          onClick={() => setActiveTab('Rank')}
          className={`py-2 px-4 ${activeTab === 'Rank' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Rank
        </button>
        <button
          onClick={() => setActiveTab('Icons')}
          className={`py-2 px-4 ${activeTab === 'Icons' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Icons
        </button>
      </div>

      {activeTab === 'Level' && (
        <div className='mt-6'>
          <h2 className='text-xl font-bold'>Level</h2>
          <div className='mt-4'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Level</th>
                  <th className='p-2 border'>Start Range</th>
                  <th className='p-2 border'>End Range</th>
                </tr>
              </thead>
              <tbody>
                {levelData.map(({ level, startRange, endRange }, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='p-2 border text-center'>{level}</td>
                    <td className='p-2 border text-center'>{startRange}</td>
                    <td className='p-2 border text-center'>{endRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Rank' && (
        <div className='mt-6'>
          <h2 className='text-xl font-bold'>Rank</h2>
          <div className='mt-4'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Rank</th>
                  <th className='p-2 border'>Start Range</th>
                  <th className='p-2 border'>End Range</th>
                </tr>
              </thead>
              <tbody>
                {rankData.map(({ rank, startRange, endRange }, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='p-2 border text-center'>{rank}</td>
                    <td className='p-2 border text-center'>{startRange}</td>
                    <td className='p-2 border text-center'>{endRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Icons' && (
        <div className='mt-6'>
          <h2 className='text-xl font-bold'>Icons</h2>
          <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {icons.map(({ icon: Icon, name, purpose }, index) => (
              <div key={index} className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
                <Icon className='w-12 h-12 mb-2 text-blue-500' />
                <h3 className='font-semibold text-lg'>{name}</h3>
                <p className='text-sm text-center text-gray-600'>{purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
