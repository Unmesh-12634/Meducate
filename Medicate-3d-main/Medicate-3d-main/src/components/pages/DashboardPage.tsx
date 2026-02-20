import { motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  Trophy, 
  BookOpen, 
  Brain, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Award,
  MessageSquare,
  Flame,
  Star,
  ChevronRight,
  Calendar,
  Lightbulb,
  BarChart3,
  Crown,
  TrendingDown
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export function DashboardPage({ onNavigate, userName }: DashboardPageProps) {
  const quickStats = [
    { title: 'Study Streak', value: '12 days', icon: Zap, color: '#FFD166', bgColor: 'bg-[#FFD166]/20', change: '+2' },
    { title: 'Quiz Score', value: '94%', icon: Target, color: '#00A896', bgColor: 'bg-[#00A896]/20', change: '+5%' },
    { title: 'Rank', value: '#24', icon: Trophy, color: '#EF476F', bgColor: 'bg-[#EF476F]/20', change: '↑3' },
    { title: 'Hours This Week', value: '14.5h', icon: Clock, color: '#028090', bgColor: 'bg-[#028090]/20', change: '+3h' },
  ];

  const recentActivity = [
    { title: 'Completed Emergency Cardiac Arrest', type: 'Multiplayer', time: '2 hours ago', icon: Users, color: '#00A896' },
    { title: 'Achieved 100% on Cardiology Quiz', type: 'Quiz', time: '5 hours ago', icon: Brain, color: '#FFD166' },
    { title: 'Unlocked "Cardiac Champion" Badge', type: 'Achievement', time: '1 day ago', icon: Award, color: '#EF476F' },
    { title: 'Viewed Heart 3D Model', type: '3D Lab', time: '2 days ago', icon: Activity, color: '#028090' },
  ];

  const upcomingChallenges = [
    { title: 'Weekly Tournament Finals', participants: 234, startTime: 'Today, 6:00 PM', prize: '500 XP' },
    { title: 'Anatomy Master Challenge', participants: 89, startTime: 'Tomorrow, 2:00 PM', prize: 'Exclusive Badge' },
    { title: 'Team Emergency Response', participants: 156, startTime: 'Sat, 10:00 AM', prize: '1000 XP' },
  ];

  const recommendedForYou = [
    { 
      title: 'Respiratory System Deep Dive', 
      type: '3D Lab', 
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1656428964836-78d54bf76231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMG1lZGljYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTk5Mzc0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('simulator')
    },
    { 
      title: 'Pediatric Emergency Scenarios', 
      type: 'Learn', 
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1758574437870-f83c160efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3JzJTIwY29sbGFib3JhdGlvbiUyMHRlYW18ZW58MXx8fHwxNzYxOTkzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('learn')
    },
    { 
      title: 'Speed Run Championships', 
      type: 'Competition', 
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1759684546919-5124743bc31f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwc3R1ZGVudHxlbnwxfHx8fDE3NjE5OTM3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('play')
    },
  ];

  const learningPaths = [
    { title: 'Cardiology Basics', progress: 75, total: 12, completed: 9, color: '#00A896' },
    { title: 'Emergency Medicine', progress: 40, total: 20, completed: 8, color: '#EF476F' },
    { title: 'Anatomy & Physiology', progress: 90, total: 15, completed: 14, color: '#FFD166' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 12450, avatar: '👩‍⚕️' },
    { rank: 2, name: 'Mike Rodriguez', points: 11890, avatar: '👨‍⚕️' },
    { rank: 3, name: 'You', points: 10230, avatar: '🎯', isYou: true },
    { rank: 4, name: 'Emma Watson', points: 9870, avatar: '👩‍⚕️' },
  ];

  const dailyTips = [
    "💡 Visualize anatomical structures in 3D to improve retention by 40%",
    "🎯 Practice spaced repetition for better long-term memory",
    "🤝 Collaborate with peers to learn different problem-solving approaches",
    "📊 Review your weak areas using the Progress analytics",
  ];

  const todayTip = dailyTips[new Date().getDate() % dailyTips.length];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section with Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#00A896] to-[#028090] rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1700832082200-af7deeb63d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGV0aG9zY29wZSUyMG1lZGljYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYxOTc4NTE1fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Medical"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-8 flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-3xl md:text-4xl mb-2 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {userName}! 👋
              </motion.h1>
              <motion.p 
                className="text-white/80 text-lg flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Flame className="text-[#FFD166]" size={20} />
                You're on a 12-day study streak. Keep it up!
              </motion.p>
            </div>
            <motion.button
              onClick={() => onNavigate('progress')}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={20} />
              View Progress
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-card border border-border rounded-2xl p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <motion.div 
                  className="flex items-center gap-1 text-xs text-green-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl" style={{ color: stat.color }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Daily Tip Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#FFD166]/20 to-[#FFD166]/5 border border-[#FFD166]/30 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFD166] flex items-center justify-center flex-shrink-0">
            <Lightbulb size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="text-[#FFD166] mr-2">Tip of the Day:</span>
              <span>{todayTip}</span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended for You */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>Recommended for You</h2>
                <button className="text-sm text-[#00A896] hover:underline flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedForYou.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={item.action}
                    className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {item.image && (
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg backdrop-blur-sm">
                        {item.difficulty}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#00A896] mb-1">{item.type}</p>
                      <p className="text-sm">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learning Paths Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2>Your Learning Paths</h2>
                <button 
                  onClick={() => onNavigate('learn')}
                  className="text-sm text-[#00A896] hover:underline flex items-center gap-1"
                >
                  Browse Courses <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={path.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-2xl p-5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${path.color}20` }}
                        >
                          <BookOpen size={20} style={{ color: path.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm mb-1">{path.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {path.completed} of {path.total} completed
                          </p>
                        </div>
                      </div>
                      <span className="text-sm" style={{ color: path.color }}>
                        {path.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: path.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-4">Recent Activity</h2>
              <div className="bg-card border border-border rounded-2xl divide-y divide-border">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(0, 168, 150, 0.05)' }}
                    className="p-4 flex items-center gap-4 transition-colors cursor-pointer"
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${activity.color}20` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <activity.icon size={20} style={{ color: activity.color }} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm mb-1">{activity.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.type}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Mini Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2">
                  <Crown size={18} className="text-[#FFD166]" />
                  Top Learners
                </h3>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="text-xs text-[#00A896] hover:underline"
                >
                  Full Leaderboard
                </button>
              </div>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      user.isYou ? 'bg-[#00A896]/10 border border-[#00A896]/30' : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                      user.rank === 1 ? 'bg-[#FFD166] text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-[#CD7F32] text-white' :
                      'bg-muted'
                    }`}>
                      {user.rank}
                    </div>
                    <span className="text-xl">{user.avatar}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${user.isYou ? 'text-[#00A896]' : ''}`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="mb-4">Upcoming Challenges</h3>
              <div className="space-y-3">
                {upcomingChallenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-2xl p-4 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm">{challenge.title}</h4>
                      <Trophy size={16} className="text-[#FFD166] flex-shrink-0" />
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{challenge.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={12} />
                        <span className="text-[#00A896]">{challenge.prize}</span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-3 py-2 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all text-sm"
                    >
                      Register Now
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('simulator')}
                  className="w-full py-3 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} />
                  Enter 3D Lab
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('learn')}
                  className="w-full py-3 border border-border rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  Join Multiplayer
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('play')}
                  className="w-full py-3 border border-border rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={18} />
                  Competitions
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('ask')}
                  className="w-full py-3 border border-border rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Ask MediBot
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
