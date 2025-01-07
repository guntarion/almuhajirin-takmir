// src/app/admin/achievement/page.tsx
import {
  // FaMedal,
  // FaTrophy,
  FaAward,
  // FaStar,
  FaCrown,
  FaRibbon,
  // FaShieldAlt,
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
  FaMedal,
  FaStar,
  FaShieldAlt,
  FaTrophy,
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
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Achievement Icons</h1>
      <p className='mt-4'>Here are all the icons you can use for gamification in your habit-tracking app:</p>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {icons.map(({ icon: Icon, name, purpose }, index) => (
          <div key={index} className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
            <Icon className='w-12 h-12 mb-2 text-blue-500' />
            <h3 className='font-semibold text-lg'>{name}</h3>
            <p className='text-sm text-center text-gray-600'>{purpose}</p>
          </div>
        ))}
      </div>

      <h1 className='text-2xl font-bold'>Medal Icons</h1>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6'>
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {/* Bronze Medal */}
          <div className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
            <div className='w-16 h-16 rounded-full bg-bronze-100 flex items-center justify-center mb-2'>
              <FaMedal className='w-12 h-12 text-bronze' />
            </div>
            <h3 className='font-semibold text-lg'>Bronze Medal</h3>
            <p className='text-sm text-center text-gray-600'>Achievement: Beginner Level</p>
          </div>

          {/* Silver Medal */}
          <div className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
            <div className='w-16 h-16 rounded-full bg-silver-100 flex items-center justify-center mb-2'>
              <FaMedal className='w-12 h-12 text-silver' />
            </div>
            <h3 className='font-semibold text-lg'>Silver Medal</h3>
            <p className='text-sm text-center text-gray-600'>Achievement: Intermediate Level</p>
          </div>

          {/* Gold Medal */}
          <div className='flex flex-col items-center p-4 border rounded-lg shadow-sm'>
            <div className='w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-2'>
              <FaMedal className='w-12 h-12 text-gold' />
            </div>
            <h3 className='font-semibold text-lg'>Gold Medal</h3>
            <p className='text-sm text-center text-gray-600'>Achievement: Advanced Level</p>
          </div>
        </div>
      </div>
    </div>
  );
}
