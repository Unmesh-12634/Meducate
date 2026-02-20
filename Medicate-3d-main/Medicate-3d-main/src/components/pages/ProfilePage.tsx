import { motion } from 'motion/react';
import { Trophy, Award, Target, TrendingUp, Clock, Zap, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { StatCard } from '../ui/StatCard';
import { BadgeCard } from '../ui/BadgeCard';
import { Progress } from '../ui/progress';
import { ShareProfileModal } from '../ui/ShareProfileModal';
import { useState } from 'react';

export function ProfilePage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const user = {
    name: 'Dr. Sarah Chen',
    institution: 'Medical University',
    level: 12,
    xp: 8450,
    nextLevelXp: 10000,
    avatar: '',
  };

  const stats = [
    { title: 'Quiz Accuracy', value: '94%', icon: Target, color: '#00A896', trend: '+5% this week' },
    { title: 'Procedures Done', value: '127', icon: Award, color: '#FFD166', trend: '+12 this week' },
    { title: 'Win Rate', value: '87%', icon: Trophy, color: '#EF476F', trend: '+3% this month' },
    { title: 'Study Time', value: '48h', icon: Clock, color: '#028090', trend: 'This month' },
  ];

  const badges = [
    { title: 'Cardiac Champion', description: 'Complete 10 cardiology scenarios', unlocked: true },
    { title: 'First Save', description: 'Successfully stabilize your first patient', unlocked: true },
    { title: 'Team Player', description: 'Complete 5 multiplayer scenarios', unlocked: true },
    { title: 'Speed Demon', description: 'Complete a scenario in under 5 minutes', unlocked: true },
    { title: 'Perfect Score', description: 'Get 100% on an adaptive quiz', unlocked: false },
    { title: 'Anatomy Master', description: 'Identify all organs correctly', unlocked: false },
  ];

  const quizLeaderboard = [
    { rank: 1, name: 'Alex Thompson', score: 9850, avatar: '' },
    { rank: 2, name: 'Maria Garcia', score: 9720, avatar: '' },
    { rank: 3, name: 'James Wilson', score: 9580, avatar: '' },
    { rank: 4, name: 'Sarah Chen', score: 8450, avatar: '', isCurrentUser: true },
    { rank: 5, name: 'David Kim', score: 8320, avatar: '' },
  ];

  const multiplayerLeaderboard = [
    { rank: 1, name: 'Emergency Squad A', wins: 142, avatar: '' },
    { rank: 2, name: 'Code Blue Team', wins: 138, avatar: '' },
    { rank: 3, name: 'Rapid Response', wins: 129, avatar: '' },
    { rank: 4, name: 'Medical Mavericks', wins: 115, avatar: '' },
    { rank: 5, name: 'Healing Heroes', wins: 108, avatar: '' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#00A896] to-[#028090] rounded-3xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/30">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-white text-[#00A896] text-2xl">SC</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl mb-1">{user.name}</h1>
              <p className="text-white/80 mb-4">{user.institution}</p>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={20} />
                  <span>Level {user.level}</span>
                </div>
                <div className="text-white/80">
                  {user.xp} / {user.nextLevelXp} XP
                </div>
              </div>

              <div className="max-w-md">
                <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-3" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="px-6 py-2 bg-white text-[#00A896] rounded-xl hover:bg-white/90 transition-all">
                Edit Profile
              </button>
              <motion.button
                onClick={() => setShareModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all"
              >
                Share Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Achievements</h2>
              <p className="text-muted-foreground">
                {badges.filter(b => b.unlocked).length} of {badges.length} unlocked
              </p>
            </div>
            <div className="px-4 py-2 bg-[#FFD166]/20 text-[#FFD166] rounded-xl">
              <Award className="inline mr-2" size={18} />
              <span>{badges.filter(b => b.unlocked).length} Badges</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <BadgeCard key={badge.title} {...badge} />
            ))}
          </div>
        </motion.div>

        {/* Leaderboards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-6">Leaderboards</h2>
          
          <Tabs defaultValue="quiz" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="quiz">Quiz Rankings</TabsTrigger>
              <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
            </TabsList>

            <TabsContent value="quiz">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <p className="text-sm text-muted-foreground">Rank</p>
                    </div>
                    <div className="col-span-7">
                      <p className="text-sm text-muted-foreground">Student</p>
                    </div>
                    <div className="col-span-4 text-right">
                      <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {quizLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${entry.isCurrentUser ? 'bg-[#00A896]/10' : 'hover:bg-muted/50'} transition-colors`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.rank === 1 ? 'bg-[#FFD166] text-white' :
                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                            entry.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-muted'
                          }`}>
                            {entry.rank <= 3 ? <Trophy size={16} /> : entry.rank}
                          </div>
                        </div>
                        <div className="col-span-7 flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-[#00A896] to-[#028090] text-white">
                              {entry.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={entry.isCurrentUser ? 'text-[#00A896]' : ''}>
                              {entry.name}
                              {entry.isCurrentUser && ' (You)'}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-4 text-right">
                          <p className="text-lg">{entry.score.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="multiplayer">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1">
                      <p className="text-sm text-muted-foreground">Rank</p>
                    </div>
                    <div className="col-span-7">
                      <p className="text-sm text-muted-foreground">Team</p>
                    </div>
                    <div className="col-span-4 text-right">
                      <p className="text-sm text-muted-foreground">Wins</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {multiplayerLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.rank === 1 ? 'bg-[#FFD166] text-white' :
                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                            entry.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-muted'
                          }`}>
                            {entry.rank <= 3 ? <Trophy size={16} /> : entry.rank}
                          </div>
                        </div>
                        <div className="col-span-7 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF476F] to-[#FFD166] flex items-center justify-center text-white">
                            <Users size={18} />
                          </div>
                          <p>{entry.name}</p>
                        </div>
                        <div className="col-span-4 text-right">
                          <p className="text-lg">{entry.wins}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        userName={user.name}
        userLevel={user.level}
        userAvatar={user.avatar}
      />
    </div>
  );
}
