import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { io } from 'socket.io-client';
import { Send, Search, ArrowLeft, MoreVertical, MessageSquare } from 'lucide-react';

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userIdQuery = searchParams.get('userId');

  const [authStatus, setAuthStatus] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole') || 'mahasiswa',
    userId: parseInt(localStorage.getItem('userId'))
  }));

  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatDetails, setActiveChatDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authStatus.isLoggedIn) {
      navigate('/login');
    }
  }, [authStatus.isLoggedIn, navigate]);

  // Init Socket
  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.userId) {
      const newSocket = io('http://localhost:5000');
      newSocket.on('connect', () => {
        newSocket.emit('join', authStatus.userId);
      });
      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [authStatus.isLoggedIn, authStatus.userId]);

  // Fetch Contacts
  const fetchContacts = async () => {
    if (!authStatus.userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/contacts/${authStatus.userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [authStatus.userId]);

  // Set active chat from query param
  useEffect(() => {
    if (userIdQuery) {
      const targetId = parseInt(userIdQuery);
      if (!Number.isNaN(targetId)) {
        setActiveChat(targetId);
        // We might need to fetch the user details if not in contacts
      }
    }
  }, [userIdQuery]);

  // Fetch Active Chat History and Details
  useEffect(() => {
    if (authStatus.userId && activeChat) {
      // Find details from contacts first
      const contact = contacts.find(c => c.id === activeChat);
      if (contact) {
        setActiveChatDetails(contact);
      } else {
        // Fallback: If not in contacts, fetch the user details
        fetch(`http://localhost:5000/api/users/${activeChat}`)
          .then(res => res.json())
          .then(u => {
            if (u && !u.error) {
              setActiveChatDetails({
                id: u.id,
                name: u.name,
                role: u.role,
                avatar: u.role === 'umkm' 
                  ? "/freelance6.jpg"
                  : "/freelance1.png"
              });
              // Add to contacts temporarily
              setContacts(prev => [{
                id: u.id,
                name: u.name,
                role: u.role,
                avatar: u.role === 'umkm' 
                  ? "/freelance6.jpg"
                  : "/freelance1.png",
                lastMessage: null
              }, ...prev]);
            }
          })
          .catch(console.error);
      }

      // Fetch history
      fetch(`http://localhost:5000/api/messages/history/${authStatus.userId}/${activeChat}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMessages(data);
          } else {
            setMessages([]);
          }
        })
        .catch(err => {
          console.error(err);
          setMessages([]);
        });
    }
  }, [activeChat, authStatus.userId]); // Note: Excluded contacts to prevent infinite loop

  // Listen to incoming messages
  useEffect(() => {
    if (socket) {
      const handleReceive = (msg) => {
        if (activeChat === msg.senderId || activeChat === msg.receiverId) {
          setMessages(prev => [...prev, {
            text: msg.text,
            time: msg.createdAt,
            sender: msg.senderId === authStatus.userId ? 'me' : 'other'
          }]);
        }
        fetchContacts();
      };
      
      socket.on('receiveMessage', handleReceive);
      return () => socket.off('receiveMessage', handleReceive);
    }
  }, [socket, activeChat, authStatus.userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !socket) return;
    
    socket.emit('sendMessage', {
      senderId: authStatus.userId,
      receiverId: activeChat,
      text: inputText
    });
    
    setMessages(prev => [...prev, { sender: 'me', text: inputText, time: new Date().toISOString() }]);
    setInputText("");
    
    // Refresh contacts to update "lastMessage" preview
    setTimeout(fetchContacts, 500); 
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch {
      return timeString;
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-500 selection:text-white overflow-hidden">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-0 sm:px-6 lg:px-12 py-0 sm:py-6 flex overflow-hidden">
        <div className="w-full h-full bg-white sm:rounded-3xl shadow-xl border border-slate-200/60 flex overflow-hidden">
          
          {/* SIDEBAR (Contacts) */}
          <div className={`w-full sm:w-80 md:w-96 border-r border-slate-100 flex flex-col bg-white flex-shrink-0 ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-4">
              <h2 className="text-xl font-extrabold text-slate-900">Pesan</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari percakapan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition placeholder:font-medium font-semibold"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-10 flex flex-col items-center text-center opacity-60">
                  <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-sm font-semibold text-slate-500">Belum ada percakapan</p>
                </div>
              ) : (
                filteredContacts.map(contact => {
                  const isActive = contact.id === activeChat;
                  const lastMsg = contact.lastMessage || { text: 'Belum ada pesan', time: '' };
                  return (
                    <div 
                      key={contact.id} 
                      onClick={() => setActiveChat(contact.id)}
                      className={`p-4 sm:p-5 border-b border-slate-50 transition cursor-pointer flex gap-4 items-center ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                    >
                      <div className="relative shrink-0">
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200/50" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className={`font-bold truncate text-sm ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{contact.name}</h3>
                          <span className={`text-[10px] whitespace-nowrap ml-2 ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                            {formatTime(lastMsg.time)}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${isActive ? 'text-indigo-700 font-medium' : 'text-slate-500'}`}>
                          {lastMsg.sender === 'me' ? 'Anda: ' : ''}{lastMsg.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* MAIN CHAT AREA */}
          {activeChat ? (
            <div className={`flex-1 flex flex-col bg-slate-50/30 ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
              
              {/* Chat Header */}
              <div className="h-16 sm:h-20 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {activeChatDetails && (
                    <div className="flex items-center gap-3">
                      <img src={activeChatDetails.avatar} alt={activeChatDetails.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{activeChatDetails.name}</h3>
                        <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span> Online
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Mulai percakapan dengan {activeChatDetails?.name}</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-[15px] leading-relaxed ${
                        msg.sender === 'me' 
                          ? 'bg-indigo-600 text-white rounded-tr-sm sm:rounded-tr-md' 
                          : 'bg-white border border-slate-200/60 text-slate-800 rounded-tl-sm sm:rounded-tl-md'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1.5 px-2 font-medium">
                        {formatTime(msg.time)}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Tulis pesan..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition text-sm font-medium placeholder:font-medium placeholder:text-slate-400"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 sm:px-6 py-3.5 rounded-2xl font-extrabold transition flex items-center justify-center shadow-lg shadow-indigo-600/20"
                  >
                    <Send className="w-5 h-5 sm:hidden" />
                    <span className="hidden sm:inline-flex items-center gap-2">Kirim <Send className="w-4 h-4" /></span>
                  </button>
                </form>
              </div>
              
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 bg-slate-50/50 flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Cari Cuan Pesan</h2>
              <p className="text-slate-500 font-medium max-w-sm">Pilih percakapan dari menu di sebelah kiri untuk mulai mengobrol atau melangsungkan wawancara.</p>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
