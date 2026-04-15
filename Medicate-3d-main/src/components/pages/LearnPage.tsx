import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Globe,
  Shield,
  Star,
  ArrowLeft,
  Megaphone,
  UserCheck,
  Info,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ProctorExam } from './ProctorExam';

export function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>('week-1');
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  // Proctored exam state
  const [examOpen, setExamOpen] = useState<{ weekId: string; weekTitle: string } | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<Record<string, number>>({}); // weekId → score

  const courses = [
    {
      id: 'course-1',
      title: 'Emergency Medicine Fundamentals',
      batch: 'Batch-01_Emergency_Medicine',
      image: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZW1lcmdlbmN5JTIwdHJhaW5pbmd8ZW58MXx8fHwxNzYxOTQ2MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 65,
    },
    {
      id: 'course-2',
      title: 'Advanced Cardiac Life Support',
      batch: 'Batch-02_ACLS_Training',
      image: 'https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW9sb2d5JTIwaGVhcnQlMjBhbmF0b215fGVufDF8fHx8MTc2MTk0NjA5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 40,
    },
    {
      id: 'course-3',
      title: 'Surgical Procedures',
      batch: 'Batch-03_Surgical_Skills',
      image: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJnaWNhbCUyMHByb2NlZHVyZSUyMHRyYWluaW5nfGVufDF8fHx8MTc2MTk0NjA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 20,
    },
    {
      id: 'course-4',
      title: 'Pediatric Emergency Care',
      batch: 'Batch-04_Pediatric_Medicine',
      image: 'https://images.unsplash.com/photo-1759872138841-c342bd6410ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZW1lcmdlbmN5JTIwdHJhaW5pbmd8ZW58MXx8fHwxNzYxOTQ2MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      progress: 10,
    },
  ];

  const courseContent: Record<string, any> = {
    'course-1': {
      title: 'Emergency Medicine Fundamentals',
      sections: [
        {
          id: 'general',
          title: 'General',
          items: [
            { id: 'announcements', title: 'Announcements', type: 'info' },
            { id: 'attendance', title: 'Attendance', type: 'info' },
          ],
        },
        {
          id: 'evaluation',
          title: 'Evaluation Matrix',
          items: [
            { id: 'eval-form', title: 'Evaluation Matrix-Foundations', type: 'document' },
          ],
        },
      ],
      weeks: [
        {
          id: 'week-1',
          title: 'Week-1',
          locked: false,
          items: [
            { 
              id: 'live-1', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-1', title: 'Live Lecture: ER Foundations (Zoom)', type: 'video', duration: '90 min', completed: false },
                { id: 'recording-1', title: 'Recording: Previous Batch Session', type: 'video', duration: '85 min', completed: true },
                { id: 'slides-1', title: 'Lecture Slides (PDF)', type: 'document', duration: '15 min', completed: true }
              ]
            },
            { id: 'foundations-1', title: 'Foundations of Emergency Medicine', type: 'video', duration: '45 min', completed: true },
            { id: 'assessment-1', title: 'Week 1 Assessment', type: 'quiz', duration: '30 min', completed: true },
          ],
        },
        {
          id: 'week-2',
          title: 'Week-2',
          locked: false,
          items: [
            { 
              id: 'live-2', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-2', title: 'Workshop: Cardiac Emergencies', type: 'video', duration: '120 min', completed: false },
                { id: 'resource-2', title: 'ACLS Algorithm Cheatsheet (PDF)', type: 'document', duration: '10 min', completed: false }
              ]
            },
            { id: 'cardiac-2', title: 'Cardiac Emergency Protocols', type: 'video', duration: '50 min', completed: true },
            { id: 'cpr-2', title: 'CPR Practical Simulation', type: 'simulation', duration: '60 min', completed: false },
            { id: 'assessment-2', title: 'Week 2 Assessment', type: 'quiz', duration: '30 min', completed: false },
          ],
        },
        {
          id: 'week-3',
          title: 'Week-3',
          locked: false,
          items: [
            { 
              id: 'live-3', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-3', title: 'Live Trauma Scenario Review', type: 'video', duration: '60 min', completed: false },
                { id: 'recording-3', title: 'Guest Lecture: Advanced Trauma', type: 'video', duration: '55 min', completed: false }
              ]
            },
            { id: 'trauma-3', title: 'Trauma Assessment Techniques', type: 'video', duration: '55 min', completed: false },
            { id: 'assessment-3', title: 'Week 3 Assessment', type: 'quiz', duration: '30 min', completed: false },
          ],
        },
        {
          id: 'week-4',
          title: 'Week-4',
          locked: false,
          items: [
            { 
              id: 'live-4', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-4', title: 'Pediatric Case Studies Q&A', type: 'video', duration: '90 min', completed: false },
                { id: 'resource-4', title: 'Pediatric Dosage Reference Guide', type: 'document', duration: '20 min', completed: false }
              ]
            },
            { id: 'pediatric-4', title: 'Pediatric Emergency Care', type: 'video', duration: '48 min', completed: false },
          ],
        },
        {
          id: 'week-5',
          title: 'Week-5',
          locked: true,
          items: [],
        },
        {
          id: 'week-6',
          title: 'Week-6',
          locked: true,
          items: [],
        },
      ],
    },
    'course-2': {
      title: 'Advanced Cardiac Life Support',
      sections: [
        {
          id: 'general',
          title: 'General',
          items: [
            { id: 'announcements', title: 'Announcements', type: 'info' },
            { id: 'attendance', title: 'Attendance', type: 'info' },
          ],
        },
        {
          id: 'evaluation',
          title: 'Evaluation Matrix',
          items: [
            { id: 'eval-form', title: 'Evaluation Matrix-ACLS', type: 'document' },
          ],
        },
      ],
      weeks: [
        {
          id: 'week-1',
          title: 'Week-1',
          locked: false,
          items: [
            { 
              id: 'live-5', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-5', title: 'Introduction to ACLS Protocols', type: 'video', duration: '60 min', completed: true },
                { id: 'slides-5', title: 'BLS/ACLS Guidelines 2025', type: 'document', duration: '30 min', completed: true }
              ]
            },
            { id: 'acls-1', title: 'Introduction to ACLS', type: 'video', duration: '40 min', completed: true },
          ],
        },
        {
          id: 'week-2',
          title: 'Week-2',
          locked: false,
          items: [
            { 
              id: 'live-6', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-6', title: 'ECG Rhythm Interpretation Masterclass', type: 'video', duration: '90 min', completed: false },
                { id: 'resource-6', title: 'Rhythm Strip Practice Workbook', type: 'document', duration: '45 min', completed: false }
              ]
            },
            { id: 'rhythms-2', title: 'Cardiac Rhythms Recognition', type: 'video', duration: '45 min', completed: false },
          ],
        },
      ],
    },
    'course-3': {
      title: 'Surgical Procedures',
      sections: [
        {
          id: 'general',
          title: 'General',
          items: [
            { id: 'announcements', title: 'Announcements', type: 'info' },
            { id: 'attendance', title: 'Attendance', type: 'info' },
          ],
        },
      ],
      weeks: [
        {
          id: 'week-1',
          title: 'Week-1',
          locked: false,
          items: [
            { 
              id: 'live-7', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-7', title: 'Scrubbing & Gowning Live Demo', type: 'video', duration: '45 min', completed: true },
                { id: 'resource-7', title: 'Surgical Instruments Glossary', type: 'document', duration: '15 min', completed: true }
              ]
            },
            { id: 'surgical-1', title: 'Surgical Safety and Sterile Technique', type: 'video', duration: '50 min', completed: true },
          ],
        },
      ],
    },
    'course-4': {
      title: 'Pediatric Emergency Care',
      sections: [
        {
          id: 'general',
          title: 'General',
          items: [
            { id: 'announcements', title: 'Announcements', type: 'info' },
          ],
        },
      ],
      weeks: [
        {
          id: 'week-1',
          title: 'Week-1',
          locked: false,
          items: [
            { 
              id: 'live-8', 
              title: 'LIVE SESSIONS, RECORDINGS AND RESOURCES', 
              type: 'folder',
              items: [
                { id: 'live-zoom-8', title: 'Pediatric Airway Management', type: 'video', duration: '60 min', completed: false },
                { id: 'recording-8', title: 'PALS Updates & Resources', type: 'video', duration: '40 min', completed: false }
              ]
            },
            { id: 'peds-1', title: 'Pediatric Assessment Triangle', type: 'video', duration: '35 min', completed: false },
          ],
        },
      ],
    },
  };

  const selectedCourseData = selectedCourse ? courses.find((c) => c.id === selectedCourse) : null;
  const selectedCourseContent = selectedCourse ? courseContent[selectedCourse] : null;

  const getItemIcon = (type: string, title?: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-[#00A896]" />;
      case 'quiz':
        return <FileText size={16} className="text-[#FFD166]" />;
      case 'simulation':
        return <Play size={16} className="text-[#EF476F]" />;
      case 'folder':
        return <BookOpen size={16} className="text-muted-foreground" />;
      case 'document':
        return <FileText size={16} className="text-muted-foreground" />;
      case 'info':
        if (title?.toLowerCase().includes('announcement')) return <Megaphone size={16} className="text-[#EF476F]" />;
        if (title?.toLowerCase().includes('attendance')) return <UserCheck size={16} className="text-[#00A896]" />;
        return <Info size={16} className="text-[#00A896]" />;
      case 'ai':
        return <Globe size={16} className="text-[#00A896]" />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleResumeCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setExpandedWeek('week-1');
    setExpandedSection('general');
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setExpandedWeek(null);
    setExpandedSection(null);
  };

  const handleItemClick = (item: any, week: any) => {
    if (item.type === 'quiz') {
      setExamOpen({ weekId: week.id, weekTitle: week.title });
    } else if (item.type === 'folder') {
      setExpandedFolder(expandedFolder === item.id ? null : item.id);
    }
  };

  const handleExamComplete = (weekId: string, score: number) => {
    setCompletedAssessments(prev => ({ ...prev, [weekId]: score }));
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Proctored Exam Overlay - Isolate rendering to mask background */}
      {examOpen && selectedCourse ? (
        <ProctorExam
          weekId={examOpen.weekId}
          weekTitle={examOpen.weekTitle}
          courseTitle={selectedCourseContent?.title ?? 'Course'}
          onClose={() => setExamOpen(null)}
          onComplete={handleExamComplete}
        />
      ) : (
        <AnimatePresence mode="wait">
          {selectedCourse ? (
            // Course Detail View with Sidebar
            <>
              {/* Left Sidebar */}
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-72 bg-card border-r border-border fixed lg:static inset-y-0 left-0 top-16 z-40 flex flex-col overflow-y-auto"
              >
                {/* Course Header - Animated from Course Card */}
                {selectedCourseData && (
                  <div className="p-4 border-b border-border">
                    <button
                      onClick={handleBackToCourses}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                      <ArrowLeft size={14} />
                      Back to Courses
                    </button>
                    <ImageWithFallback
                      src={selectedCourseData.image}
                      alt={selectedCourseData.title}
                      className="w-full h-24 object-cover rounded-xl mb-3"
                    />
                    <h3 className="font-semibold text-sm leading-tight mb-1">{selectedCourseData.title}</h3>
                    <h4 className="text-xs text-muted-foreground mb-3 font-medium bg-muted w-fit px-2 py-0.5 rounded-md">{selectedCourseData.batch}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="bg-[#00A896] h-1.5 rounded-full transition-all"
                          style={{ width: `${selectedCourseData.progress}%` }}
                        />
                      </div>
                      <span className="font-medium">{selectedCourseData.progress}%</span>
                    </div>
                  </div>
                )}

                {/* Navigation Sections */}
                <div className="flex-1 p-4 space-y-2">
                  {selectedCourseContent?.sections.map((section: any) => (
                    <div key={section.id}>
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#00A896] text-white hover:bg-[#008f7f] transition-colors"
                      >
                        <span className="text-sm">{section.title}</span>
                        {expandedSection === section.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      <AnimatePresence>
                        {expandedSection === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-3 mt-2 space-y-1"
                          >
                            {section.items.map((item: any) => (
                              <button
                                key={item.id}
                                className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                              >
                                {getItemIcon(item.type, item.title)}
                                <span className="text-xs">{item.title}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* MediVerse Learning Assistance */}
                  <div>
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'assistance' ? null : 'assistance')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#00A896] text-white hover:bg-[#008f7f] transition-colors"
                    >
                      <span className="text-sm">MediVerse Learning Assistance</span>
                      {expandedSection === 'assistance' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <AnimatePresence>
                      {expandedSection === 'assistance' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-3 mt-2 space-y-1"
                        >
                          <button className="w-full text-left p-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                            MediVerse Learning Assistance
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Week Sections */}
                  {selectedCourseContent?.weeks.map((week: any) => (
                    <div key={week.id}>
                      <button
                        onClick={() => !week.locked && setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                        disabled={week.locked}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${week.locked
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {week.locked && <Lock size={14} />}
                          <span className="text-sm">{week.title}</span>
                        </div>
                        {!week.locked && (
                          expandedWeek === week.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedWeek === week.id && !week.locked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-3 mt-2 space-y-1"
                          >
                            {week.items.map((item: any) => {
                              const renderItem = (curItem: any, isSubItem = false) => {
                                const isCurAssessmentDone = curItem.type === 'quiz' && completedAssessments[week.id] !== undefined;
                                const curAssessmentScore = completedAssessments[week.id];
                                return (
                                  <button
                                    key={curItem.id}
                                    onClick={() => handleItemClick(curItem, week)}
                                    className={`w-full text-left ${isSubItem ? 'p-2 pl-6' : 'p-2'} text-sm text-foreground rounded-lg transition-colors flex items-center justify-between group ${curItem.type === 'quiz' ? 'hover:bg-[#EF476F]/10' : 'hover:bg-background'}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {curItem.type === 'quiz'
                                        ? <Shield size={14} className="text-[#EF476F]" />
                                        : getItemIcon(curItem.type, curItem.title)}
                                      <span className="text-xs">{curItem.title}</span>
                                      {curItem.type === 'quiz' && !isCurAssessmentDone && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-[#EF476F]/20 text-[#EF476F] rounded font-bold tracking-wider">PROCTORED</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isCurAssessmentDone ? (
                                        <div className="flex items-center gap-1">
                                          <Star size={12} className="text-[#FFD166]" />
                                          <span className="text-[10px] text-[#FFD166] font-bold">{curAssessmentScore}%</span>
                                        </div>
                                      ) : curItem.completed ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                      ) : null}
                                      {curItem.type === 'folder' && (
                                        expandedFolder === curItem.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                      )}
                                    </div>
                                  </button>
                                );
                              };

                              return (
                                <div key={item.id} className="space-y-1">
                                  {renderItem(item)}
                                  {item.type === 'folder' && item.items && (
                                    <AnimatePresence>
                                      {expandedFolder === item.id && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="space-y-1 overflow-hidden"
                                        >
                                          <div className="py-1">
                                            {item.items.map((subItem: any) => renderItem(subItem, true))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  )}
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Main Content Area */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="max-w-5xl mx-auto p-6 lg:p-8">
                  {/* MediVerse Learning Assistance Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-gradient-to-br from-[#00A896]/10 to-[#028090]/10 border border-[#00A896]/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ChevronDown className="text-[#00A896]" size={24} />
                      <h3>MediVerse Learning Assistance</h3>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-[#00A896] flex items-center justify-center">
                        <Globe className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm mb-1">MediVerse Learning Assistance</h4>
                        <p className="text-xs text-muted-foreground">
                          Get AI-powered help with medical concepts and procedures
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Week Sections */}
                  <div className="space-y-4">
                    {selectedCourseContent?.weeks.map((week: any, index: number) => (
                      <motion.div
                        key={week.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => !week.locked && setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                          disabled={week.locked}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${week.locked
                            ? 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                            : 'bg-card border-border hover:border-[#00A896] text-foreground'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronRight
                              size={24}
                              className={`transition-transform ${expandedWeek === week.id ? 'rotate-90' : ''}`}
                            />
                            <h3>{week.title}</h3>
                            {week.locked && <Lock size={18} />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedWeek === week.id && !week.locked && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 ml-8 space-y-3"
                            >
                              {week.items.map((item: any) => {
                                const renderMainItem = (curItem: any, isSubItem = false) => {
                                  const isAssessmentDone = curItem.type === 'quiz' && completedAssessments[week.id] !== undefined;
                                  const assessmentScore = completedAssessments[week.id];
                                  const isQuiz = curItem.type === 'quiz';
                                  const isFolder = curItem.type === 'folder';

                                  return (
                                    <motion.div
                                      key={curItem.id}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() => handleItemClick(curItem, week)}
                                      className={`flex items-center justify-between p-4 ${isSubItem ? 'ml-8 bg-card/60' : 'bg-card'} border rounded-xl cursor-pointer group transition-all ${isQuiz
                                        ? 'border-[#EF476F]/30 hover:border-[#EF476F] hover:bg-[#EF476F]/5'
                                        : isFolder && expandedFolder === curItem.id
                                        ? 'border-[#00A896]'
                                        : 'border-border hover:border-[#00A896]'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {isQuiz
                                          ? <div className="w-8 h-8 rounded-lg bg-[#EF476F]/15 border border-[#EF476F]/30 flex items-center justify-center flex-shrink-0">
                                            <Shield size={15} className="text-[#EF476F]" />
                                          </div>
                                          : <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isFolder ? 'bg-muted' : 'bg-transparent'}`}>{getItemIcon(curItem.type, curItem.title)}</div>}
                                        <div>
                                          <p className="text-sm font-medium">{curItem.title}</p>
                                          {isQuiz ? (
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-[10px] px-1.5 py-0.5 bg-[#EF476F]/20 text-[#EF476F] rounded font-black tracking-wider">PROCTORED</span>
                                              <span className="text-xs text-muted-foreground">{curItem.duration}</span>
                                            </div>
                                          ) : curItem.duration ? (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                              <Clock size={12} />
                                              {curItem.duration}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {isAssessmentDone ? (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFD166]/10 border border-[#FFD166]/30 rounded-lg">
                                            <Star size={13} className="text-[#FFD166]" />
                                            <span className="text-sm font-bold text-[#FFD166]">{assessmentScore}%</span>
                                          </div>
                                        ) : curItem.completed ? (
                                          <CheckCircle2 className="text-green-500" size={20} />
                                        ) : isQuiz ? (
                                          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EF476F]/15 border border-[#EF476F]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Shield size={13} className="text-[#EF476F]" />
                                            <span className="text-xs font-bold text-[#EF476F]">Start Exam</span>
                                          </div>
                                        ) : isFolder ? (
                                          <div className={`p-1 rounded-full transition-colors ${expandedFolder === curItem.id ? 'bg-[#00A896]/10 text-[#00A896]' : 'text-muted-foreground'}`}>
                                            <ChevronDown size={20} className={`transition-transform duration-200 ${expandedFolder === curItem.id ? 'rotate-180' : ''}`} />
                                          </div>
                                        ) : (
                                          <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#00A896] text-white rounded-lg text-xs transition-all">
                                            Start
                                          </button>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                };

                                return (
                                  <div key={item.id} className="space-y-3">
                                    {renderMainItem(item)}
                                    {item.type === 'folder' && item.items && (
                                      <AnimatePresence>
                                        {expandedFolder === item.id && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-3 overflow-hidden"
                                          >
                                            <div className="py-2 space-y-3">
                                              {item.items.map((subItem: any) => renderMainItem(subItem, true))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            // Course Overview Grid
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Page Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="mb-2">My Courses</h1>
                  <p className="text-muted-foreground">
                    Continue your medical education journey with structured learning paths
                  </p>
                </motion.div>

                {/* Course Overview Section */}
                <div className="mb-8">
                  <h2 className="mb-6">Course Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        layoutId={`course-${course.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <ImageWithFallback
                          src={course.image}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h4 className="mb-3">{course.batch}</h4>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-[#00A896] h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{course.progress}%</span>
                          </div>
                          <button
                            onClick={() => handleResumeCourse(course.id)}
                            className="w-full py-3 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all"
                          >
                            {course.progress > 0 ? 'Resume' : 'Start Course'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
