import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Target, Clock, Zap, Edit2, Save, X, Camera, Mail, MapPin, GraduationCap, Calendar, Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { StatCard } from '../ui/StatCard';
import { BadgeCard } from '../ui/BadgeCard';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ShareProfileModal } from '../ui/ShareProfileModal';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';

interface UserProfile {
  name: string;
  email: string;
  institution: string;
  specialty: string;
  graduationYear: string;
  location: string;
  bio: string;
  avatar: string;
}

interface EditableProfilePageProps {
  userName: string;
  onUpdateName: (name: string) => void;
}


export function EditableProfilePage({ userName, onUpdateName }: EditableProfilePageProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Define userStats (previously was user, but we renamed to avoid conflict with auth user)
  const userStats = {
    level: 12,
    xp: 8450,
    nextLevelXp: 10000,
  };

  // Load initial state from local storage or defaults
  const [profileData, setProfileData] = useState<UserProfile>(() => {
    let parsedData: Partial<UserProfile> = {};
    try {
      const savedData = localStorage.getItem('userProfileExtra');
      parsedData = savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.warn("Storage access not allowed or failed:", error);
    }

    return {
      name: user?.displayName || userName || '',
      email: user?.email || '',
      institution: parsedData.institution || '',
      specialty: parsedData.specialty || '',
      graduationYear: parsedData.graduationYear || '',
      location: parsedData.location || '',
      bio: parsedData.bio || '',
      avatar: user?.photoURL || '',
    };
  });

  // Update profile data when auth user changes (e.g. initial load)
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        avatar: user.photoURL || prev.avatar
      }));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      if (user && profileData.name !== user.displayName) {
        await updateProfile(user, { displayName: profileData.name });
      }

      // Save extra fields to local storage
      const extraData = {
        institution: profileData.institution,
        specialty: profileData.specialty,
        graduationYear: profileData.graduationYear,
        location: profileData.location,
        bio: profileData.bio,
      };

      try {
        localStorage.setItem('userProfileExtra', JSON.stringify(extraData));
      } catch (e) {
        console.warn("Could not save to local storage:", e);
      }

      onUpdateName(profileData.name);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert changes could be implemented here if we stored previous state
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
          className="relative overflow-hidden bg-gradient-to-br from-[#00A896] via-[#028090] to-[#00A896] rounded-3xl p-8 text-white"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6 relative z-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white/30">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="bg-white text-[#00A896] text-2xl">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-[#00A896] rounded-full flex items-center justify-center hover:bg-white/90 transition-all">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white mb-2 block">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="institution" className="text-white mb-2 block">Institution</Label>
                        <Input
                          id="institution"
                          value={profileData.institution}
                          onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty" className="text-white mb-2 block">Specialty</Label>
                        <Input
                          id="specialty"
                          value={profileData.specialty}
                          onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="graduationYear" className="text-white mb-2 block">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          value={profileData.graduationYear}
                          onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white mb-2 block">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-h-20"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-white text-[#00A896] rounded-xl hover:bg-white/90 transition-all flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/40 shadow-2xl">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-white text-[#00A896] text-3xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-white text-[#00A896] rounded-full text-sm shadow-lg flex items-center gap-1">
                    <Zap size={14} className="text-[#FFD166]" />
                    Level {userStats.level}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-4xl mb-2">{profileData.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <GraduationCap size={16} />
                        <span className="text-sm">{profileData.institution || "Add Institution"}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Stethoscope size={16} />
                        <span className="text-sm">{profileData.specialty || "Add Specialty"}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Calendar size={14} />
                        <span className="text-sm">Class of {profileData.graduationYear || "Year"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm mb-3">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span>{profileData.location || "Add Location"}</span>
                      </div>
                    </div>

                    <p className="text-white/90 mb-6 max-w-2xl leading-relaxed">{profileData.bio || "Add a bio to tell others about yourself..."}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">Progress to Level {userStats.level + 1}</span>
                      <span className="text-sm text-white/80">{userStats.xp} / {userStats.nextLevelXp} XP</span>
                    </div>
                    <div className="max-w-md bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                      <motion.div
                        className="h-full bg-gradient-to-r from-white to-[#FFD166] rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-white text-[#00A896] rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    onClick={() => setShareModalOpen(true)}
                    className="px-8 py-3 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Share Profile
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, _) => (
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
            {badges.map((badge, _) => (
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
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.rank === 1 ? 'bg-[#FFD166] text-white' :
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
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.rank === 1 ? 'bg-[#FFD166] text-white' :
                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                              entry.rank === 3 ? 'bg-orange-600 text-white' :
                                'bg-muted'
                            }`}>
                            {entry.rank <= 3 ? <Trophy size={16} /> : entry.rank}
                          </div>
                        </div>
                        <div className="col-span-7 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF476F] to-[#FFD166] flex items-center justify-center text-white">
                            <Trophy size={18} />
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
        userName={profileData.name}
        userLevel={userStats.level}
        userAvatar={profileData.avatar}
      />
    </div>
  );
}
