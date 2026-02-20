import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, BookOpen, Award, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState('month');
  const [courseFilter, setCourseFilter] = useState('all');

  const progressData = [
    { month: 'Jan', students: 320, completion: 78 },
    { month: 'Feb', students: 398, completion: 82 },
    { month: 'Mar', students: 445, completion: 85 },
    { month: 'Apr', students: 512, completion: 88 },
    { month: 'May', students: 623, completion: 87 },
    { month: 'Jun', students: 847, completion: 89 },
  ];

  const completionData = [
    { name: 'Completed', value: 689, color: '#00A896' },
    { name: 'In Progress', value: 158, color: '#FFD166' },
    { name: 'Not Started', value: 45, color: '#EF476F' },
  ];

  const topPerformers = [
    { name: 'Sarah Chen', course: 'Cardiac Surgery', score: 98, engagement: 95 },
    { name: 'Michael Brown', course: 'Emergency Medicine', score: 96, engagement: 92 },
    { name: 'Emma Wilson', course: 'Pediatrics', score: 94, engagement: 90 },
    { name: 'James Lee', course: 'Neurology', score: 93, engagement: 88 },
    { name: 'Sophia Garcia', course: 'Surgery', score: 91, engagement: 87 },
  ];

  const insights = [
    { label: 'Average Score', value: '87%', change: '+5%', trend: 'up', icon: Award, color: '#00A896' },
    { label: 'Engagement Rate', value: '92%', change: '+3%', trend: 'up', icon: Users, color: '#FFD166' },
    { label: 'Course Completion', value: '78%', change: '+8%', trend: 'up', icon: BookOpen, color: '#EF476F' },
    { label: 'Active Students', value: '847', change: '+124', trend: 'up', icon: TrendingUp, color: '#00A896' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Analytics & Insights</h1>
              <p className="text-muted-foreground">
                Track student performance and course engagement
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-xl hover:border-[#FFD166] transition-all"
            >
              <Download size={20} />
              <span>Export Report</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-4"
        >
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((period) => (
              <motion.button
                key={period}
                onClick={() => setTimeFilter(period)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl border-2 transition-all capitalize ${
                  timeFilter === period
                    ? 'border-[#FFD166] bg-[#FFD166]/10 text-[#FFD166]'
                    : 'border-border hover:border-[#FFD166]/50'
                }`}
              >
                {period}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#FFD166] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <insight.icon size={24} style={{ color: insight.color }} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                  className={`text-xs px-2 py-1 rounded ${
                    insight.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {insight.change}
                </motion.div>
              </div>
              <div className="mb-1">{insight.value}</div>
              <div className="text-sm text-muted-foreground">{insight.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:border-[#FFD166] transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="mb-1">Student Progress Over Time</h2>
                <p className="text-sm text-muted-foreground">Monthly enrollment and completion trends</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#00A896" 
                  strokeWidth={3}
                  dot={{ fill: '#00A896', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#FFD166" 
                  strokeWidth={3}
                  dot={{ fill: '#FFD166', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Course Completion Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:border-[#FFD166] transition-all"
          >
            <h2 className="mb-4">Completion Rate</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {completionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:border-[#FFD166] transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Top Performers</h2>
              <p className="text-sm text-muted-foreground">Students with highest scores and engagement</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-xl hover:border-[#FFD166] transition-all text-sm"
            >
              <Filter size={16} />
              Filter by Course
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Student Name</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Course</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((student, index) => (
                  <motion.tr
                    key={student.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255, 209, 102, 0.05)', x: 5 }}
                    className="border-b border-border transition-all"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFD166]/10 text-[#FFD166]">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center text-white text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{student.course}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.score}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            className="bg-gradient-to-r from-[#00A896] to-[#028090] h-2 rounded-full"
                          />
                        </div>
                        <span className="text-sm">{student.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.engagement}%` }}
                            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                            className="bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-sm">{student.engagement}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
