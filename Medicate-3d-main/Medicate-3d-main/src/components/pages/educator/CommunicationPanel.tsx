import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, Paperclip, Users, User, Clock, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  sender: 'educator' | 'student';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  type: 'individual' | 'group';
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export function CommunicationPanel() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const chats: Chat[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      type: 'individual',
      avatar: '👩‍⚕️',
      lastMessage: 'Thank you for the feedback on my assignment!',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Emergency Medicine - Batch A',
      type: 'group',
      avatar: '🏥',
      lastMessage: 'When is the next simulation scheduled?',
      timestamp: '15 min ago',
      unread: 5,
      online: false,
    },
    {
      id: 3,
      name: 'Michael Brown',
      type: 'individual',
      avatar: '👨‍⚕️',
      lastMessage: 'Could you explain the cardiac cycle again?',
      timestamp: '1 hour ago',
      unread: 0,
      online: true,
    },
    {
      id: 4,
      name: 'Cardiac Surgery - Advanced',
      type: 'group',
      avatar: '❤️',
      lastMessage: 'Assignment submitted successfully',
      timestamp: '2 hours ago',
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: 'Emma Wilson',
      type: 'individual',
      avatar: '👩‍⚕️',
      lastMessage: 'Thanks for the study materials!',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
    },
  ];

  const messages: { [key: number]: Message[] } = {
    1: [
      {
        id: 1,
        sender: 'student',
        content: 'Hello Dr. Smith, I have a question about the cardiac cycle assignment.',
        timestamp: '10:30 AM',
        read: true,
      },
      {
        id: 2,
        sender: 'educator',
        content: 'Of course! What would you like to know?',
        timestamp: '10:32 AM',
        read: true,
      },
      {
        id: 3,
        sender: 'student',
        content: 'Could you clarify the difference between systole and diastole phases?',
        timestamp: '10:35 AM',
        read: true,
      },
      {
        id: 4,
        sender: 'educator',
        content: 'Great question! Systole is when the heart contracts and pumps blood out, while diastole is when it relaxes and fills with blood. Think of it like squeezing a water balloon (systole) and then releasing it to fill back up (diastole).',
        timestamp: '10:38 AM',
        read: true,
      },
      {
        id: 5,
        sender: 'student',
        content: 'Thank you for the feedback on my assignment!',
        timestamp: '11:45 AM',
        read: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: 'student',
        content: 'When is the next simulation scheduled?',
        timestamp: '9:15 AM',
        read: true,
      },
    ],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
    // In production, this would send the message to the backend
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-160px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with students and classes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">
          {/* Chats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg flex flex-col"
          >
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all text-sm"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255, 209, 102, 0.05)' }}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-border cursor-pointer transition-all ${
                    selectedChat === chat.id ? 'bg-[#FFD166]/10 border-l-4 border-l-[#FFD166]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center text-2xl">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm truncate">{chat.name}</h4>
                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 w-5 h-5 rounded-full bg-[#FFD166] flex items-center justify-center text-xs text-white flex-shrink-0"
                          >
                            {chat.unread}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-card border-2 border-border rounded-2xl overflow-hidden shadow-lg flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-[#FFD166]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center text-xl">
                    {chats.find(c => c.id === selectedChat)?.avatar}
                  </div>
                  {chats.find(c => c.id === selectedChat)?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm">{chats.find(c => c.id === selectedChat)?.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {(messages[selectedChat] || []).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.sender === 'educator' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.sender === 'educator' ? 'order-2' : 'order-1'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-2xl ${
                          message.sender === 'educator'
                            ? 'bg-gradient-to-br from-[#FFD166] to-[#FFD166]/80 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </motion.div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                        message.sender === 'educator' ? 'justify-end' : 'justify-start'
                      }`}>
                        <Clock size={12} />
                        <span>{message.timestamp}</span>
                        {message.sender === 'educator' && message.read && (
                          <CheckCheck size={12} className="text-[#00A896]" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-gradient-to-r from-muted/30 to-background">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-muted hover:bg-accent transition-all"
                >
                  <Paperclip size={20} />
                </motion.button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-[#FFD166] transition-all"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!messageInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FFD166]/80 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-[#FFD166]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} />
                  <span className="hidden sm:inline">Send</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
