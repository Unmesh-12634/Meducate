import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Zap, Star, Trophy, Medal, Crown, Flame, Brain, Heart, Activity, Calendar, BarChart3, TrendingDown, Lock } from 'lucide-react';
import { Progress } from '../ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell } from 'recharts';

export function ProgressPage() {
  const streams = [
    {
      name: 'Clinical Skills',
      icon: Activity,
      color: '#00A896',
      level: 8,
      xp: 6500,
      nextLevelXp: 8000,
      badges: 12,
    },
    {
      name: 'Anatomy & Physiology',
      icon: Brain,
      color: '#FFD166',
      level: 6,
      xp: 4200,
      nextLevelXp: 5000,
      badges: 8,
    },
    {
      name: 'Pharmacology',
      icon: Heart,
      color: '#EF476F',
      level: 5,
      xp: 3800,
      nextLevelXp: 5000,
      badges: 6,
    },
    {
      name: 'Diagnostics',
      icon: Target,
      color: '#028090',
      level: 7,
      xp: 5100,
      nextLevelXp: 6000,
      badges: 10,
    },
  ];

  // Streak badges - some locked, some unlocked
  const streakBadges = [
    { days: 3, name: '3-Day Streak', unlocked: true, icon: Flame, color: '#FFD166' },
    { days: 7, name: '1-Week Warrior', unlocked: true, icon: Flame, color: '#00A896' },
    { days: 14, name: '2-Week Champion', unlocked: true, icon: Flame, color: '#EF476F' },
    { days: 30, name: '1-Month Master', unlocked: false, icon: Flame, color: '#FFD166' },
    { days: 60, name: '2-Month Legend', unlocked: false, icon: Crown, color: '#00A896' },
    { days: 100, name: '100-Day Hero', unlocked: false, icon: Crown, color: '#EF476F' },
  ];

  const streamBadges = [
    { name: 'Cardiology Expert', stream: 'Clinical Skills', rarity: 'legendary', unlocked: true, color: '#FFD166' },
    { name: 'First Steps', stream: 'Clinical Skills', rarity: 'common', unlocked: true, color: '#00A896' },
    { name: 'Anatomy Master', stream: 'Anatomy & Physiology', rarity: 'epic', unlocked: true, color: '#EF476F' },
    { name: 'Drug Expert', stream: 'Pharmacology', rarity: 'rare', unlocked: true, color: '#FFD166' },
    { name: 'Perfect Diagnosis', stream: 'Diagnostics', rarity: 'legendary', unlocked: false, color: '#00A896' },
    { name: 'Quick Learner', stream: 'Anatomy & Physiology', rarity: 'common', unlocked: true, color: '#028090' },
  ];

  // Weekly progress data for charts
  const weeklyProgress = [
    { day: 'Mon', hours: 3.5, scenarios: 4, xp: 450 },
    { day: 'Tue', hours: 4.2, scenarios: 5, xp: 580 },
    { day: 'Wed', hours: 2.8, scenarios: 3, xp: 320 },
    { day: 'Thu', hours: 5.1, scenarios: 6, xp: 720 },
    { day: 'Fri', hours: 3.9, scenarios: 4, xp: 480 },
    { day: 'Sat', hours: 6.2, scenarios: 8, xp: 890 },
    { day: 'Sun', hours: 4.5, scenarios: 5, xp: 560 },
  ];

  // Monthly progress data for line chart
  const monthlyProgress = [
    { month: 'Jan', totalXP: 2400, accuracy: 88 },
    { month: 'Feb', totalXP: 3200, accuracy: 90 },
    { month: 'Mar', totalXP: 4100, accuracy: 91 },
    { month: 'Apr', totalXP: 5300, accuracy: 92 },
    { month: 'May', totalXP: 6800, accuracy: 93 },
    { month: 'Jun', totalXP: 8500, accuracy: 94 },
  ];

  const achievements = [
    {
      title: '7-Day Streak',
      description: 'Practice for 7 consecutive days',
      progress: 7,
      total: 7,
      unlocked: true,
      icon: Flame,
      color: '#EF476F',
    },
    {
      title: '100 Scenarios',
      description: 'Complete 100 medical scenarios',
      progress: 87,
      total: 100,
      unlocked: false,
      icon: Target,
      color: '#00A896',
    },
    {
      title: 'Top 10 Leaderboard',
      description: 'Reach top 10 in any leaderboard',
      progress: 1,
      total: 1,
      unlocked: true,
      icon: Trophy,
      color: '#FFD166',
    },
    {
      title: '50 Hours Study',
      description: 'Spend 50 hours learning',
      progress: 34,
      total: 50,
      unlocked: false,
      icon: Calendar,
      color: '#028090',
    },
    {
      title: 'Perfect Score x5',
      description: 'Get 100% on 5 quizzes',
      progress: 3,
      total: 5,
      unlocked: false,
      icon: Star,
      color: '#FFD166',
    },
    {
      title: 'Team Leader',
      description: 'Lead 10 multiplayer sessions',
      progress: 5,
      total: 10,
      unlocked: false,
      icon: Crown,
      color: '#00A896',
    },
  ];

  const overallStats = {
    totalXP: 19600,
    rank: '#4',
    totalHours: 34.2,
    accuracy: 94,
    streak: 14,
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border-2 border-border rounded-xl p-3 shadow-lg">
          <p className="text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 3, ease: 'linear' },
                scale: { repeat: Infinity, duration: 2 }
              }}
            >
              <TrendingUp className="text-[#00A896]" size={32} />
            </motion.div>
            <h1>Your Progress</h1>
          </div>
          <p className="text-muted-foreground">
            Track your learning journey and unlock achievements
          </p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total XP', value: overallStats.totalXP.toLocaleString(), icon: Zap, color: '#FFD166' },
            { label: 'Global Rank', value: overallStats.rank, icon: Trophy, color: '#EF476F' },
            { label: 'Study Hours', value: `${overallStats.totalHours}h`, icon: Calendar, color: '#00A896' },
            { label: 'Accuracy', value: `${overallStats.accuracy}%`, icon: Target, color: '#028090' },
            { label: 'Streak', value: `${overallStats.streak} days`, icon: Flame, color: '#EF476F' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card border-2 border-border rounded-2xl p-4 text-center hover:border-[#00A896] transition-all cursor-pointer"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }}
                className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </motion.div>
              <p className="text-2xl mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Streak Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Flame className="text-[#EF476F]" size={28} />
              </motion.div>
              <div>
                <h2>Streak Badges</h2>
                <p className="text-sm text-muted-foreground">
                  Current streak: {overallStats.streak} days 🔥
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-[#EF476F]/20 text-[#EF476F] rounded-xl text-sm">
              {streakBadges.filter(b => b.unlocked).length}/{streakBadges.length} Unlocked
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {streakBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  damping: 15
                }}
                whileHover={{ scale: badge.unlocked ? 1.1 : 1.05, y: -10 }}
                className={`relative p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                  badge.unlocked
                    ? 'bg-card border-border hover:border-[#00A896]'
                    : 'bg-muted/50 border-dashed border-muted-foreground/30 grayscale'
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl">
                    <Lock size={32} className="text-muted-foreground" />
                  </div>
                )}
                {badge.unlocked && (
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 3, ease: 'linear' },
                      scale: { repeat: Infinity, duration: 2 }
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Star size={20} className="text-[#FFD166] fill-[#FFD166]" />
                  </motion.div>
                )}
                <motion.div
                  animate={badge.unlocked ? { 
                    boxShadow: [
                      `0 0 20px ${badge.color}30`,
                      `0 0 30px ${badge.color}50`,
                      `0 0 20px ${badge.color}30`,
                    ]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <badge.icon size={32} style={{ color: badge.unlocked ? badge.color : '#888' }} />
                </motion.div>
                <p className="text-xs mb-1">{badge.name}</p>
                <p className="text-xs" style={{ color: badge.color }}>{badge.days} Days</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XP Progress Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border-2 border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-[#00A896]" size={24} />
                <div>
                  <h3>Monthly XP Progress</h3>
                  <p className="text-xs text-muted-foreground">Your growth over time</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyProgress}>
                <defs>
                  <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A896" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00A896" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD166" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFD166" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="totalXP" 
                  stroke="#00A896" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorXP)"
                  animationDuration={2000}
                  animationBegin={0}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#FFD166" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAccuracy)"
                  animationDuration={2000}
                  animationBegin={200}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00A896]" />
                <span className="text-xs text-muted-foreground">Total XP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFD166]" />
                <span className="text-xs text-muted-foreground">Accuracy %</span>
              </div>
            </div>
          </motion.div>

          {/* Weekly Activity Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border-2 border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#FFD166]" size={24} />
                <div>
                  <h3>Weekly Activity</h3>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hours" 
                  fill="#00A896" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationBegin={0}
                >
                  {weeklyProgress.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`rgba(0, 168, 150, ${0.5 + (entry.hours / 10)})`}
                    />
                  ))}
                </Bar>
                <Bar 
                  dataKey="scenarios" 
                  fill="#FFD166" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationBegin={200}
                >
                  {weeklyProgress.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`rgba(255, 209, 102, ${0.5 + (entry.scenarios / 10)})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00A896]" />
                <span className="text-xs text-muted-foreground">Study Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFD166]" />
                <span className="text-xs text-muted-foreground">Scenarios</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stream System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2>Learning Streams</h2>
            <div className="px-4 py-2 bg-[#00A896]/20 text-[#00A896] rounded-xl text-sm">
              {streams.length} Active Streams
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-card border-2 border-border rounded-2xl p-6 hover:border-[#00A896] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stream.color}20` }}
                    >
                      <stream.icon size={28} style={{ color: stream.color }} />
                    </motion.div>
                    <div>
                      <h3 className="mb-1">{stream.name}</h3>
                      <p className="text-sm text-muted-foreground">Level {stream.level}</p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: `${stream.color}20`, color: stream.color }}
                  >
                    {stream.badges} badges
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Level {stream.level + 1}</span>
                    <span style={{ color: stream.color }}>{stream.xp} / {stream.nextLevelXp} XP</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(stream.xp / stream.nextLevelXp) * 100} 
                      className="h-3"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stream.xp / stream.nextLevelXp) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="absolute top-0 left-0 h-3 rounded-full"
                      style={{ 
                        backgroundColor: stream.color,
                        boxShadow: `0 0 10px ${stream.color}50`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="mb-6">Achievements & Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  achievement.unlocked
                    ? 'bg-card border-border hover:border-[#00A896]'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={achievement.unlocked ? { 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <achievement.icon 
                      size={32} 
                      style={{ color: achievement.unlocked ? achievement.color : '#888' }} 
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1 text-sm">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', damping: 10 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Star size={16} className="text-white fill-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span style={{ color: achievement.color }}>
                          {achievement.progress} / {achievement.total}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={(achievement.progress / achievement.total) * 100} 
                          className="h-2"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          transition={{ duration: 1, delay: 1 + index * 0.1 }}
                          className="absolute top-0 left-0 h-2 rounded-full"
                          style={{ 
                            backgroundColor: achievement.color,
                            boxShadow: `0 0 10px ${achievement.color}50`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stream Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="mb-6">Stream Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {streamBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className={`relative p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                  badge.unlocked
                    ? 'bg-card border-border hover:border-[#00A896]'
                    : 'bg-muted/50 border-dashed border-muted-foreground/30 opacity-50'
                }`}
              >
                {badge.unlocked && badge.rarity === 'legendary' && (
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 3, ease: 'linear' },
                      scale: { repeat: Infinity, duration: 2 }
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Crown size={20} className="text-[#FFD166]" />
                  </motion.div>
                )}
                <motion.div
                  animate={badge.unlocked ? { 
                    boxShadow: [
                      `0 0 20px ${badge.color}30`,
                      `0 0 30px ${badge.color}50`,
                      `0 0 20px ${badge.color}30`,
                    ]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  {badge.rarity === 'legendary' ? <Crown size={32} style={{ color: badge.color }} /> :
                   badge.rarity === 'epic' ? <Medal size={32} style={{ color: badge.color }} /> :
                   badge.rarity === 'rare' ? <Star size={32} style={{ color: badge.color }} /> :
                   <Award size={32} style={{ color: badge.color }} />}
                </motion.div>
                <p className="text-xs mb-1">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.stream}</p>
                <div className={`mt-2 px-2 py-0.5 rounded text-xs inline-block ${
                  badge.rarity === 'legendary' ? 'bg-[#FFD166]/20 text-[#FFD166]' :
                  badge.rarity === 'epic' ? 'bg-[#EF476F]/20 text-[#EF476F]' :
                  badge.rarity === 'rare' ? 'bg-[#00A896]/20 text-[#00A896]' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {badge.rarity}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
