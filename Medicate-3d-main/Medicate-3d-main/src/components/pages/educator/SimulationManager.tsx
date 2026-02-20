import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Eye, Edit, Send, Search, Filter, Play, Pause, FileText } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function SimulationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSimulation, setSelectedSimulation] = useState<number | null>(null);

  const simulations = [
    {
      id: 1,
      title: 'Cardiac Arrest Management',
      subject: 'Emergency Medicine',
      difficulty: 'Advanced',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400',
      duration: '45 min',
      assignedCourses: 3,
      completions: 124,
    },
    {
      id: 2,
      title: 'Pediatric Examination',
      subject: 'Pediatrics',
      difficulty: 'Intermediate',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?w=400',
      duration: '30 min',
      assignedCourses: 5,
      completions: 198,
    },
    {
      id: 3,
      title: 'Surgical Suturing Techniques',
      subject: 'Surgery',
      difficulty: 'Advanced',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?w=400',
      duration: '60 min',
      assignedCourses: 0,
      completions: 0,
    },
    {
      id: 4,
      title: 'Basic Life Support',
      subject: 'Emergency Medicine',
      difficulty: 'Beginner',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400',
      duration: '20 min',
      assignedCourses: 8,
      completions: 456,
    },
    {
      id: 5,
      title: 'Neurological Assessment',
      subject: 'Neurology',
      difficulty: 'Intermediate',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?w=400',
      duration: '40 min',
      assignedCourses: 4,
      completions: 234,
    },
    {
      id: 6,
      title: 'Respiratory Emergencies',
      subject: 'Pulmonology',
      difficulty: 'Advanced',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?w=400',
      duration: '35 min',
      assignedCourses: 0,
      completions: 0,
    },
  ];

  const filteredSimulations = simulations.filter((sim) => {
    const matchesSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sim.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sim.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#00A896';
      case 'Intermediate': return '#FFD166';
      case 'Advanced': return '#EF476F';
      default: return '#00A896';
    }
  };

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
              <h1 className="mb-2">Simulation Manager</h1>
              <p className="text-muted-foreground">
                Upload and manage simulation scenarios for your students
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 text-white rounded-xl shadow-lg shadow-[#FFD166]/30 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span>Create Simulation</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search simulations..."
              className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all"
            />
          </div>

          <div className="flex gap-3">
            {['all', 'active', 'draft'].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl border-2 transition-all capitalize ${
                  filterStatus === status
                    ? 'border-[#FFD166] bg-[#FFD166]/10 text-[#FFD166]'
                    : 'border-border hover:border-[#FFD166]/50'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Simulations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSimulations.map((sim, index) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#FFD166] transition-all cursor-pointer"
                onClick={() => setSelectedSimulation(sim.id)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={sim.thumbnail}
                    alt={sim.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1 rounded-full text-xs ${
                        sim.status === 'active'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {sim.status === 'active' ? '● Active' : '● Draft'}
                    </motion.span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div
                      className="px-3 py-1 rounded-full text-xs text-white backdrop-blur-md"
                      style={{ backgroundColor: `${getDifficultyColor(sim.difficulty)}CC` }}
                    >
                      {sim.difficulty}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-sm mb-2 line-clamp-1">{sim.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{sim.subject}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-muted-foreground">
                    <div>
                      <span className="block">Duration</span>
                      <span className="text-foreground">{sim.duration}</span>
                    </div>
                    <div>
                      <span className="block">Completions</span>
                      <span className="text-foreground">{sim.completions}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#00A896] text-white rounded-lg text-xs hover:bg-[#008f7f] transition-all"
                    >
                      <Eye size={14} />
                      Preview
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FFD166] text-white rounded-lg text-xs hover:bg-[#FFD166]/90 transition-all"
                    >
                      <Edit size={14} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-3 py-2 bg-[#EF476F]/10 text-[#EF476F] rounded-lg hover:bg-[#EF476F]/20 transition-all"
                    >
                      <Send size={14} />
                    </motion.button>
                  </div>

                  {sim.assignedCourses > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground"
                    >
                      Assigned to {sim.assignedCourses} course{sim.assignedCourses > 1 ? 's' : ''}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSimulations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-sm mb-2">No simulations found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
