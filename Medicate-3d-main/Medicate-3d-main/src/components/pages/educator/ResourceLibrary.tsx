import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Download, Share2, Eye, Trash2, FileText, Video, File, Search, Filter } from 'lucide-react';

interface Resource {
  id: number;
  name: string;
  type: 'pdf' | 'video' | 'doc';
  category: string;
  size: string;
  uploadDate: string;
  downloads: number;
  shared: boolean;
}

export function ResourceLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const resources: Resource[] = [
    {
      id: 1,
      name: 'Cardiac Anatomy Guide',
      type: 'pdf',
      category: 'Cardiology',
      size: '2.4 MB',
      uploadDate: '2025-10-15',
      downloads: 234,
      shared: true,
    },
    {
      id: 2,
      name: 'Emergency Procedures Tutorial',
      type: 'video',
      category: 'Emergency Medicine',
      size: '145 MB',
      uploadDate: '2025-10-20',
      downloads: 456,
      shared: true,
    },
    {
      id: 3,
      name: 'Surgical Techniques Documentation',
      type: 'doc',
      category: 'Surgery',
      size: '1.8 MB',
      uploadDate: '2025-10-25',
      downloads: 189,
      shared: false,
    },
    {
      id: 4,
      name: 'Neurological Assessment Protocol',
      type: 'pdf',
      category: 'Neurology',
      size: '3.1 MB',
      uploadDate: '2025-10-28',
      downloads: 312,
      shared: true,
    },
    {
      id: 5,
      name: 'Pediatric Care Best Practices',
      type: 'video',
      category: 'Pediatrics',
      size: '98 MB',
      uploadDate: '2025-10-30',
      downloads: 267,
      shared: true,
    },
    {
      id: 6,
      name: 'Pharmacology Reference Sheet',
      type: 'pdf',
      category: 'Pharmacology',
      size: '1.2 MB',
      uploadDate: '2025-11-01',
      downloads: 423,
      shared: true,
    },
  ];

  const categories = ['all', 'Cardiology', 'Emergency Medicine', 'Surgery', 'Neurology', 'Pediatrics', 'Pharmacology'];
  const types = ['all', 'pdf', 'video', 'doc'];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'doc':
        return File;
      default:
        return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return '#EF476F';
      case 'video':
        return '#FFD166';
      case 'doc':
        return '#00A896';
      default:
        return '#00A896';
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
              <h1 className="mb-2">Resource Library</h1>
              <p className="text-muted-foreground">
                Upload and manage learning materials for your students
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 text-white rounded-xl shadow-lg shadow-[#FFD166]/30 hover:shadow-xl transition-all"
            >
              <Upload size={20} />
              <span>Upload Resource</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-11 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <div className="flex gap-2">
                {types.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setFilterType(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl border-2 transition-all capitalize text-sm ${
                      filterType === type
                        ? 'border-[#FFD166] bg-[#FFD166]/10 text-[#FFD166]'
                        : 'border-border hover:border-[#FFD166]/50'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map((resource, index) => {
              const FileIcon = getFileIcon(resource.type);
              const fileColor = getFileColor(resource.type);

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-[#FFD166] transition-all"
                >
                  {/* File Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${fileColor}20` }}
                    >
                      <FileIcon size={32} style={{ color: fileColor }} />
                    </motion.div>
                    {resource.shared && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs flex items-center gap-1"
                      >
                        <Share2 size={12} />
                        Shared
                      </motion.div>
                    )}
                  </div>

                  {/* File Info */}
                  <h3 className="text-sm mb-2 line-clamp-2">{resource.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs px-2 py-1 rounded uppercase"
                      style={{ backgroundColor: `${fileColor}20`, color: fileColor }}
                    >
                      {resource.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{resource.category}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-muted-foreground pb-4 border-b border-border">
                    <div>
                      <span className="block mb-1">Size</span>
                      <span className="text-foreground">{resource.size}</span>
                    </div>
                    <div>
                      <span className="block mb-1">Downloads</span>
                      <span className="text-foreground">{resource.downloads}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-[#00A896]/10 text-[#00A896] hover:bg-[#00A896]/20 transition-all flex items-center justify-center"
                      title="View"
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-[#FFD166]/10 text-[#FFD166] hover:bg-[#FFD166]/20 transition-all flex items-center justify-center"
                      title="Download"
                    >
                      <Download size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-muted hover:bg-accent transition-all flex items-center justify-center"
                      title="Share"
                    >
                      <Share2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-[#EF476F]/10 text-[#EF476F] hover:bg-[#EF476F]/20 transition-all flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>

                  {/* Upload Date */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground"
                  >
                    Uploaded on {new Date(resource.uploadDate).toLocaleDateString()}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <File size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-sm mb-2">No resources found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
