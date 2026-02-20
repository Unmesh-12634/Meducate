import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, BarChart3, Search, Filter, BookOpen, Users, Clock, X, Upload, Save } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';

interface CourseManagementProps {
  onNavigate?: (page: string) => void;
}

interface Course {
  id: number;
  title: string;
  department: string;
  level: string;
  students: number;
  completion: number;
  status: string;
  image: string;
  lastUpdated: string;
  duration: string;
  description?: string;
}

export function CourseManagement({ onNavigate }: CourseManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    department: '',
    level: 'Beginner',
    duration: '',
    description: '',
  });

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Advanced Cardiac Surgery',
      department: 'Cardiology',
      level: 'Advanced',
      students: 145,
      completion: 78,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400',
      lastUpdated: '2 days ago',
      duration: '12 weeks',
      description: 'Comprehensive course on advanced cardiac surgical techniques',
    },
    {
      id: 2,
      title: 'Emergency Medicine Protocols',
      department: 'Emergency',
      level: 'Intermediate',
      students: 203,
      completion: 65,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?w=400',
      lastUpdated: '5 days ago',
      duration: '8 weeks',
      description: 'Essential emergency medicine protocols and procedures',
    },
    {
      id: 3,
      title: 'Surgical Techniques Masterclass',
      department: 'Surgery',
      level: 'Advanced',
      students: 89,
      completion: 92,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?w=400',
      lastUpdated: '1 week ago',
      duration: '10 weeks',
      description: 'Master advanced surgical techniques',
    },
    {
      id: 4,
      title: 'Pediatric Care Fundamentals',
      department: 'Pediatrics',
      level: 'Beginner',
      students: 178,
      completion: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?w=400',
      lastUpdated: '3 days ago',
      duration: '6 weeks',
      description: 'Fundamentals of pediatric patient care',
    },
  ]);

  const departments = ['all', 'Cardiology', 'Emergency', 'Surgery', 'Pediatrics', 'Neurology'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleCreateCourse = () => {
    if (!courseForm.title || !courseForm.department || !courseForm.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCourse: Course = {
      id: courses.length + 1,
      title: courseForm.title,
      department: courseForm.department,
      level: courseForm.level,
      students: 0,
      completion: 0,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400',
      lastUpdated: 'Just now',
      duration: courseForm.duration,
      description: courseForm.description,
    };

    setCourses([...courses, newCourse]);
    setShowCreateModal(false);
    setCourseForm({ title: '', department: '', level: 'Beginner', duration: '', description: '' });
    toast.success(`Course "${newCourse.title}" created successfully!`);
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;

    const updatedCourses = courses.map(course =>
      course.id === selectedCourse.id
        ? { ...course, ...courseForm, lastUpdated: 'Just now' }
        : course
    );

    setCourses(updatedCourses);
    setShowEditModal(false);
    setSelectedCourse(null);
    setCourseForm({ title: '', department: '', level: 'Beginner', duration: '', description: '' });
    toast.success('Course updated successfully!');
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      department: course.department,
      level: course.level,
      duration: course.duration,
      description: course.description || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteCourse = (courseId: number, courseTitle: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast.success(`Course "${courseTitle}" deleted`);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-emerald-500/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Course Management</h1>
              <p className="text-muted-foreground">
                Manage and track all your courses
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span>Create New Course</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="pl-11 pr-8 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500 transition-all appearance-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all group"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-emerald-500/50 to-transparent"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    {course.status === 'active' ? (
                      <span className="text-green-600">● Active</span>
                    ) : (
                      <span className="text-gray-600">● Archived</span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm mb-2 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">
                          {course.department}
                        </span>
                        <span className="text-xs bg-teal-500/10 text-teal-500 px-2 py-1 rounded">
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{course.completion}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span>{course.completion}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.completion}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-xs hover:shadow-lg transition-all"
                    >
                      <Edit size={14} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('educator-analytics');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-500 rounded-lg text-xs hover:bg-teal-500/20 transition-all"
                    >
                      <BarChart3 size={14} />
                      Analytics
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="px-4 py-2 bg-[#EF476F]/10 text-[#EF476F] rounded-lg hover:bg-[#EF476F]/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-sm mb-2">No courses found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Create Course Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <Label>Course Title *</Label>
                    <Input
                      placeholder="e.g., Advanced Cardiac Surgery"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Department *</Label>
                      <select
                        value={courseForm.department}
                        onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Select Department</option>
                        {departments.filter(d => d !== 'all').map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Level</Label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Duration *</Label>
                    <Input
                      placeholder="e.g., 8 weeks"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Course description and objectives..."
                      rows={4}
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateCourse}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Save size={18} />
                      Create Course
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-3 border-2 border-border rounded-xl hover:border-emerald-500 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Edit Course Modal */}
        <AnimatePresence>
          {showEditModal && (
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Course</DialogTitle>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <Label>Course Title *</Label>
                    <Input
                      placeholder="e.g., Advanced Cardiac Surgery"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Department *</Label>
                      <select
                        value={courseForm.department}
                        onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        {departments.filter(d => d !== 'all').map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Level</Label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Duration *</Label>
                    <Input
                      placeholder="e.g., 8 weeks"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Course description and objectives..."
                      rows={4}
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditCourse}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Save size={18} />
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 border-2 border-border rounded-xl hover:border-emerald-500 transition-all"
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
