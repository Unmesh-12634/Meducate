import { motion } from 'motion/react';
import { BookOpen, Users, Calendar, TrendingUp, Plus, BarChart3, MessageSquare, Video, Sparkles, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface EducatorDashboardProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export function EducatorDashboard({ onNavigate, userName }: EducatorDashboardProps) {
  const stats = [
    { label: 'Courses Managed', value: '12', icon: BookOpen, color: '#10B981', change: '+2 this month', gradient: 'from-emerald-500 to-green-600' },
    { label: 'Students Enrolled', value: '847', icon: Users, color: '#00A896', change: '+124 this week', gradient: 'from-teal-500 to-cyan-600' },
    { label: 'Upcoming Sessions', value: '8', icon: Calendar, color: '#EF476F', change: 'Next: Today 3PM', gradient: 'from-pink-500 to-rose-600' },
    { label: 'Avg. Performance', value: '87%', icon: TrendingUp, color: '#10B981', change: '+5% from last month', gradient: 'from-emerald-500 to-green-600' },
  ];

  const quickActions = [
    { label: 'Create New Course', icon: Plus, color: '#10B981', action: 'educator-courses', gradient: 'from-emerald-500 to-green-600' },
    { label: 'View Analytics', icon: BarChart3, color: '#00A896', action: 'educator-analytics', gradient: 'from-teal-500 to-cyan-600' },
    { label: 'Messages', icon: MessageSquare, color: '#EF476F', action: 'educator-communication', gradient: 'from-pink-500 to-rose-600' },
    { label: 'Live Session', icon: Video, color: '#10B981', action: 'educator-sessions', gradient: 'from-emerald-500 to-green-600' },
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Advanced Cardiac Surgery',
      students: 145,
      completion: 78,
      lastUpdated: '2 days ago',
      image: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400',
    },
    {
      id: 2,
      title: 'Emergency Medicine Protocols',
      students: 203,
      completion: 65,
      lastUpdated: '5 days ago',
      image: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?w=400',
    },
    {
      id: 3,
      title: 'Surgical Techniques Masterclass',
      students: 89,
      completion: 92,
      lastUpdated: '1 week ago',
      image: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?w=400',
    },
  ];

  const upcomingSessions = [
    { title: 'Cardiac Emergency Response', time: 'Today, 3:00 PM', students: 45 },
    { title: 'Advanced Suturing Workshop', time: 'Tomorrow, 10:00 AM', students: 32 },
    { title: 'Trauma Assessment Live Demo', time: 'Friday, 2:00 PM', students: 67 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-emerald-500/5">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          />
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-full mb-4"
            >
              <Sparkles size={16} className="text-emerald-500" />
              <span className="text-emerald-500 text-sm">Educator Dashboard</span>
            </motion.div>
            <h1 className="mb-2">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your courses today
            </p>
          </div>
        </motion.div>

        {/* Stats Grid with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group cursor-pointer"
            >
              {/* Animated Background Gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br"
                    style={{ background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)` }}
                  >
                    <stat.icon size={28} style={{ color: stat.color }} />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <ArrowUpRight size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="mb-1 text-3xl"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-full mb-2"
                />
                <div className="text-xs text-emerald-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions with Spring Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="mb-4 flex items-center gap-2">
            <Sparkles size={24} className="text-emerald-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(action.action)}
                className={`bg-gradient-to-br ${action.gradient} text-white rounded-2xl p-6 hover:shadow-2xl transition-all flex flex-col items-center gap-3 relative overflow-hidden group`}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center relative z-10"
                >
                  <action.icon size={28} />
                </motion.div>
                <span className="text-sm font-medium text-center relative z-10">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2>Recent Courses</h2>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('educator-courses')}
                className="text-sm text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
              >
                View All
                <ArrowUpRight size={16} />
              </motion.button>
            </div>
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 8,
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onNavigate('educator-courses')}
                  className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-emerald-500 transition-all shadow-md hover:shadow-2xl cursor-pointer group"
                >
                  <div className="flex gap-4">
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={course.image}
                        alt={course.title}
                        className="w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-emerald-500/50 to-transparent"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-sm mb-2 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{course.students} students</span>
                        </div>
                        <span>Updated {course.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.completion}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium">{course.completion}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions & Performance */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <div>
              <h2 className="mb-4">Upcoming Sessions</h2>
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => (
                  <motion.div
                    key={session.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.03,
                      x: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-card border-2 border-border rounded-2xl p-4 hover:border-emerald-500 transition-all shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <h4 className="text-sm mb-2 group-hover:text-emerald-500 transition-colors">{session.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar size={14} className="text-emerald-500" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users size={14} className="text-emerald-500" />
                      <span>{session.students} enrolled</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent border-2 border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-emerald-500" />
                <h3 className="text-sm">Performance Overview</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Student Engagement', value: 92, color: 'emerald' },
                  { label: 'Course Completion', value: 78, color: 'teal' },
                  { label: 'Assessment Scores', value: 87, color: 'green' }
                ].map((metric, index) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="font-medium"
                      >
                        {metric.value}%
                      </motion.span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600`}
                        style={{ 
                          background: `linear-gradient(to right, rgb(16, 185, 129), rgb(5, 150, 105))`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
