import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Download, Eye, Edit, CheckCircle, Clock, XCircle, Filter, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

interface Assignment {
  id: number;
  title: string;
  course: string;
  deadline: string;
  totalStudents: number;
  submitted: number;
  graded: number;
  pending: number;
  status: 'active' | 'closed';
}

export function AssessmentCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    description: '',
    deadline: '',
    points: '',
  });

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Cardiac Cycle Assessment',
      course: 'Advanced Cardiology',
      deadline: '2025-11-15',
      totalStudents: 145,
      submitted: 132,
      graded: 98,
      pending: 34,
      status: 'active',
    },
    {
      id: 2,
      title: 'Emergency Protocols Quiz',
      course: 'Emergency Medicine',
      deadline: '2025-11-20',
      totalStudents: 203,
      submitted: 187,
      graded: 187,
      pending: 0,
      status: 'active',
    },
    {
      id: 3,
      title: 'Surgical Techniques Practical',
      course: 'Surgery Masterclass',
      deadline: '2025-11-10',
      totalStudents: 89,
      submitted: 89,
      graded: 89,
      pending: 0,
      status: 'closed',
    },
    {
      id: 4,
      title: 'Neurological Examination',
      course: 'Neurology Fundamentals',
      deadline: '2025-11-25',
      totalStudents: 156,
      submitted: 78,
      graded: 45,
      pending: 33,
      status: 'active',
    },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAssignment = () => {
    // In production, this would send data to backend
    console.log('Creating assignment:', newAssignment);
    setShowCreateModal(false);
    setNewAssignment({ title: '', course: '', description: '', deadline: '', points: '' });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-500' : 'text-gray-500';
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
              <h1 className="mb-2">Assessment Center</h1>
              <p className="text-muted-foreground">
                Manage assignments and track student submissions
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 text-white rounded-xl shadow-lg shadow-[#FFD166]/30 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span>Create Assignment</span>
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
              placeholder="Search assignments..."
              className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all"
            />
          </div>

          <div className="flex gap-3">
            {['all', 'active', 'closed'].map((status) => (
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

        {/* Assignments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm">Assignment Title</th>
                  <th className="text-left py-4 px-6 text-sm">Course</th>
                  <th className="text-left py-4 px-6 text-sm">Deadline</th>
                  <th className="text-center py-4 px-6 text-sm">Submitted</th>
                  <th className="text-center py-4 px-6 text-sm">Graded</th>
                  <th className="text-center py-4 px-6 text-sm">Pending</th>
                  <th className="text-center py-4 px-6 text-sm">Status</th>
                  <th className="text-center py-4 px-6 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAssignments.map((assignment, index) => (
                    <motion.tr
                      key={assignment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255, 209, 102, 0.05)' }}
                      className="border-b border-border transition-all"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="text-sm mb-1">{assignment.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {assignment.totalStudents} students enrolled
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">{assignment.course}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          <span>{new Date(assignment.deadline).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm mb-1">
                            {assignment.submitted}/{assignment.totalStudents}
                          </span>
                          <div className="w-full max-w-[100px] bg-muted rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              className="bg-[#00A896] h-1.5 rounded-full"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm mb-1">
                            {assignment.graded}/{assignment.submitted}
                          </span>
                          <div className="w-full max-w-[100px] bg-muted rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: assignment.submitted > 0 ? `${(assignment.graded / assignment.submitted) * 100}%` : '0%' }}
                              transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                              className="bg-[#FFD166] h-1.5 rounded-full"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                            assignment.pending > 0
                              ? 'bg-[#EF476F]/10 text-[#EF476F]'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {assignment.pending > 0 ? (
                            <>
                              <Clock size={12} />
                              {assignment.pending}
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} />
                              Done
                            </>
                          )}
                        </motion.span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                            assignment.status === 'active'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {assignment.status === 'active' ? '● Active' : '● Closed'}
                        </motion.span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-[#00A896]/10 text-[#00A896] hover:bg-[#00A896]/20 transition-all"
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-[#FFD166]/10 text-[#FFD166] hover:bg-[#FFD166]/20 transition-all"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-muted hover:bg-accent transition-all"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Assignment Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <label className="text-sm mb-2 block">Assignment Title</label>
                    <Input
                      placeholder="e.g., Cardiac Cycle Assessment"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Course</label>
                    <Input
                      placeholder="Select course"
                      value={newAssignment.course}
                      onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Description</label>
                    <Textarea
                      placeholder="Assignment description and requirements..."
                      rows={4}
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm mb-2 block">Deadline</label>
                      <Input
                        type="date"
                        value={newAssignment.deadline}
                        onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">Points</label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newAssignment.points}
                        onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateAssignment}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Create Assignment
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-3 border-2 border-border rounded-xl hover:border-[#FFD166] transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
