"use client";
import React, { useState, useEffect } from 'react';
import { 
  Wrench, Star, ShieldCheck, MessageSquare, X, Send, PlusCircle, 
  LayoutDashboard, LogOut, ChevronRight, Mail, Lock, User, 
  Briefcase, Sun, Moon, Search, MapPin, Hammer, Bell, Wallet, 
  Clock, Phone, Filter, CheckCircle2, DollarSign, FileText,
  Calendar, Tag, ChevronDown, Camera, Save, ArrowUpRight, History,
  Paperclip, AlertCircle, Info, Layers, ThumbsUp
} from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userRole, setUserRole] = useState('client');
  const [darkMode, setDarkMode] = useState(false);
  
  const [activeView, setActiveView] = useState('main');
  const [profileTab, setProfileTab] = useState('info');

  // Job Detail State
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // State for Bid Submission (Pro View)
  const [selectedLead, setSelectedLead] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  // State for Job Posting (Client View)
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  // State for Reviewing Bids (Client View)
  const [selectedBid, setSelectedBid] = useState(null);

  // NEW: State for Leaving a Review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingJob, setReviewingJob] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);

  // Incoming Bids with Expiry logic
  const [incomingBids, setIncomingBids] = useState([
    { id: 501, proName: "David Miller", proImg: "https://i.pravatar.cc/150?u=11", amount: "$140", message: "I can be there in 20 minutes. I have all the tools needed for a quick pipe fix.", rating: 4.9, jobTitle: "Kitchen Pipe Leak", createdAt: Date.now() },
    { id: 502, proName: "Sarah Jenkins", proImg: "https://i.pravatar.cc/150?u=12", amount: "$380", message: "I specialize in residential rewiring. Can start tomorrow morning.", rating: 4.8, jobTitle: "Rewire Living Room", createdAt: Date.now() - (47 * 60 * 60 * 1000) }, 
  ]);

  // Messaging States
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  // Profile Management State
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
    bio: "Looking for high-quality professionals for home renovation projects.",
    location: "New York, NY"
  });

  // LOGIC: 48-Hour Auto Decline (Runs every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const fortyEightHours = 48 * 60 * 60 * 1000;
      setIncomingBids(prev => prev.filter(bid => (now - bid.createdAt) < fortyEightHours));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // LOGIC: Pro Submitting a Bid
  const handlePlaceBid = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBid = {
      id: Math.random(),
      proName: profileData.name,
      proImg: "https://i.pravatar.cc/150?u=pro",
      amount: `$${formData.get('amount')}`,
      message: formData.get('message'),
      rating: 5.0,
      jobTitle: selectedLead.title,
      createdAt: Date.now()
    };
    setIncomingBids([newBid, ...incomingBids]);
    setIsBidModalOpen(false);
    alert("Bid submitted successfully!");
  };

  // LOGIC: Client Posting a Job
  const handlePostJob = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    alert(`Job "${formData.get('title')}" has been posted to the network!`);
    setIsPostJobOpen(false);
  };

  // NEW LOGIC: Submitting Feedback
  const handleSubmitReview = (e) => {
    e.preventDefault();
    alert(`Thank you! You rated ${reviewingJob.pro} ${ratingScore} stars.`);
    setIsReviewModalOpen(false);
    setReviewingJob(null);
    setRatingScore(0);
  };

  // LOGIC: Decline Bid
  const handleDeclineBid = (bidId) => {
    setIncomingBids(prev => prev.filter(b => b.id !== bidId));
    setSelectedBid(null);
  };

  // LOGIC: Accept Bid and Open Chat
  const handleHirePro = (bid) => {
    const newChat = {
      id: bid.id,
      name: bid.proName,
      img: bid.proImg,
      job: bid.jobTitle,
      messages: [
        { id: 1, sender: 'system', text: `You hired ${bid.proName} for ${bid.jobTitle}.` },
        { id: 2, sender: 'pro', text: bid.message }
      ]
    };
    
    if (!chats.find(c => c.id === bid.id)) {
      setChats([newChat, ...chats]);
    }
    
    setIncomingBids(prev => prev.filter(b => b.id !== bid.id));
    setActiveChat(newChat);
    setSelectedBid(null);
    setActiveView('messages');
  };

  // LOGIC: Real-time Message Send
  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    const newMessage = { id: Date.now(), sender: 'client', text: msgInput };
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    });
    setChats(updatedChats);
    setActiveChat({ ...activeChat, messages: [...activeChat.messages, newMessage] });
    setMsgInput("");
  };

  const transactions = [
    { id: 1, type: 'payment', amount: '-$150.00', date: 'Oct 12, 2025', status: 'Completed', label: 'Kitchen Pipe Fix' },
    { id: 2, type: 'payment', amount: '-$400.00', date: 'Oct 05, 2025', status: 'Completed', label: 'Electrical Wiring' },
    { id: 3, type: 'refund', amount: '+$50.00', date: 'Sep 28, 2025', status: 'Completed', label: 'Service Credit' },
  ];

  const pastJobs = [
    { id: 1, title: "Bathroom Tiling", date: "Sep 15, 2025", pro: "Sarah Jenkins", cost: "$1,200", status: "Closed" },
    { id: 2, title: "Garden Fence Repair", date: "Aug 22, 2025", pro: "Mike Ross", cost: "$450", status: "Closed" },
  ];

  const pros = [
    { id: 1, name: "David Miller", skill: "Plumber", rate: "$85/hr", rating: 4.9, reviews: 124, img: "https://i.pravatar.cc/150?u=11" },
    { id: 2, name: "Sarah Jenkins", skill: "Electrician", rate: "$90/hr", rating: 4.8, reviews: 89, img: "https://i.pravatar.cc/150?u=12" },
    { id: 3, name: "Mike Ross", skill: "Carpenter", rate: "$75/hr", rating: 4.7, reviews: 56, img: "https://i.pravatar.cc/150?u=13" },
  ];

  const leads = [
    { id: 101, title: "Kitchen Pipe Leak", area: "Downtown", budget: "$150", time: "10m ago", urgency: "High", desc: "Pipe under kitchen sink burst. Need emergency repair ASAP. The water is currently turned off at the main, but we need someone who can replace the damaged section and check for secondary leaks." },
    { id: 102, title: "Rewire Living Room", area: "North Side", budget: "$400", time: "1h ago", urgency: "Normal", desc: "Upgrading old outlets and installing a dimmer switch. Requires certification and knowledge of older residential wiring systems." },
    { id: 103, title: "Custom Shelf Install", area: "West End", budget: "$200", time: "3h ago", urgency: "Normal", desc: "Wall mounting 3 heavy oak shelves in the study. Stud-finding and heavy-duty brackets are provided." },
  ];

  const themeBg = darkMode ? "bg-[#0f172a] text-white" : "bg-white text-slate-900";
  const cardBg = darkMode ? "bg-[#1e293b] border-gray-700" : "bg-white border-slate-200 shadow-sm";
  const inputBg = darkMode ? "bg-[#334155] text-white" : "bg-slate-50 text-slate-900";
  const secondaryText = darkMode ? "text-gray-400" : "text-slate-600";

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${themeBg}`}>
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg"><Wrench className="text-white w-5 h-5" /></div>
            <h1 className="text-xl font-extrabold tracking-tight">HandyConnect</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl">{darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}</button>
            <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className={`font-bold transition ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-600'}`}>Login</button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">The professional way to <br/> <span className="text-orange-500">fix your home.</span></h1>
          <p className={`text-xl max-w-2xl mb-10 font-medium ${secondaryText}`}>Connect with verified plumbers, electricians, and carpenters in seconds.</p>
          <button onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }} className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-2 shadow-2xl hover:scale-105 transition-all">Get Started Now <ChevronRight /></button>
        </main>

        {isAuthOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto py-10">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAuthOpen(false)}></div>
            <div className={`${cardBg} border w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 p-8 md:p-12 animate-in fade-in zoom-in duration-300`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                  </h2>
                  <p className={`mt-2 font-medium ${secondaryText}`}>
                    {authMode === 'signup' ? 'Join thousands of homeowners and pros.' : 
                     authMode === 'login' ? 'Select your role to login to your account.' : 
                     'Enter your email to receive a password reset link.'}
                  </p>
                </div>
                <button onClick={() => setIsAuthOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"><X /></button>
              </div>

              {authMode !== 'forgot' && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button onClick={() => setUserRole('client')} className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${userRole === 'client' ? 'border-orange-500 bg-orange-500/5' : `border-transparent ${darkMode ? 'bg-slate-800 opacity-60' : 'bg-slate-100 opacity-80'}`}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userRole === 'client' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}><User size={20}/></div>
                    <span className={`font-bold ${userRole === 'client' ? 'text-orange-500' : secondaryText}`}>I'm a Client</span>
                    </button>
                    <button onClick={() => setUserRole('pro')} className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${userRole === 'pro' ? 'border-orange-500 bg-orange-500/5' : `border-transparent ${darkMode ? 'bg-slate-800 opacity-60' : 'bg-slate-100 opacity-80'}`}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userRole === 'pro' ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}><Briefcase size={20}/></div>
                    <span className={`font-bold ${userRole === 'pro' ? 'text-orange-500' : secondaryText}`}>I'm a Professional</span>
                    </button>
                </div>
              )}

              <form className="space-y-4" onSubmit={(e) => { 
                e.preventDefault(); 
                if(authMode === 'forgot') {
                    alert("Password reset link sent to your email!");
                    setAuthMode('login');
                } else {
                    setIsLoggedIn(true);
                }
              }}>
                {authMode === 'signup' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required name="fullName" type="text" placeholder="Full Name" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} /></div>
                    <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required name="phone" type="tel" placeholder="Phone Number" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} /></div>
                  </div>
                )}
                
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required name="email" type="email" placeholder="Email" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} /></div>
                
                {authMode !== 'forgot' && (
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input required name="password" type="password" placeholder="Password" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
                    </div>
                )}

                {authMode === 'login' && (
                  <div className="text-right px-2">
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-bold text-orange-500 hover:underline">Forgotten Password?</button>
                  </div>
                )}

                <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all mt-4">
                  {authMode === 'login' ? `Sign In as ${userRole === 'client' ? 'Client' : 'Pro'}` : 
                   authMode === 'signup' ? 'Create My Account' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                {authMode === 'forgot' ? (
                  <button onClick={() => setAuthMode('login')} className={`font-bold hover:text-orange-500 transition ${secondaryText}`}>Back to Login</button>
                ) : (
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className={`font-bold hover:text-orange-500 transition ${secondaryText}`}>
                    {authMode === 'login' ? 'New here? Register here' : 'Already have an account? Login here'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeBg}`}>
      <nav className={`p-4 border-b flex justify-between items-center sticky top-0 z-50 ${darkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('main')}>
          <div className="bg-orange-500 p-1 rounded-lg"><Wrench className="text-white w-4 h-4" /></div>
          <span className="font-black text-lg">HandyConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveView('messages')} className={`relative p-2 rounded-xl transition ${activeView === 'messages' ? 'text-orange-500 bg-orange-500/10' : secondaryText}`}>
            <MessageSquare size={20} />
            {chats.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl">{darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}</button>
          <div 
            onClick={() => setActiveView('profile')}
            className={`w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:ring-2 ring-orange-500 ring-offset-2 transition-all ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'}`}
          >
            JD
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-6">
        {activeView === 'messages' ? (
          <div className={`flex h-[75vh] border-2 rounded-[40px] overflow-hidden animate-in fade-in zoom-in duration-300 ${cardBg}`}>
            <div className="w-1/3 border-r-2 flex flex-col">
              <div className="p-6 border-b-2"><h3 className="font-black text-xl">Messages</h3></div>
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-10 text-center opacity-40 font-bold">No active conversations. Accept a bid to start chatting.</div>
                ) : (
                  chats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setActiveChat(chat)}
                      className={`p-5 flex gap-4 cursor-pointer transition-all border-b ${activeChat?.id === chat.id ? 'bg-orange-500/5 border-r-4 border-orange-500' : 'hover:bg-slate-50'}`}
                    >
                      <img src={chat.img} className="w-12 h-12 rounded-2xl" alt="" />
                      <div className="overflow-hidden">
                        <p className="font-black truncate">{chat.name}</p>
                        <p className="text-[10px] uppercase font-bold text-orange-500">{chat.job}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col relative">
              {activeChat ? (
                <>
                  <div className="p-6 border-b-2 flex items-center gap-4">
                     <img src={activeChat.img} className="w-10 h-10 rounded-xl" alt="" />
                     <div>
                       <p className="font-black leading-none">{activeChat.name}</p>
                       <span className="text-[10px] font-bold opacity-50 uppercase">Online</span>
                     </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                    {activeChat.messages.map((m, i) => (
                      <div key={i} className={`flex ${m.sender === 'system' ? 'justify-center' : m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl font-bold text-sm ${
                          m.sender === 'system' ? 'bg-slate-200/50 text-[10px] uppercase tracking-wider' :
                          m.sender === 'client' ? 'bg-orange-500 text-white rounded-tr-none shadow-lg' : 
                          `${inputBg} rounded-tl-none`
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className={`flex items-center gap-2 p-2 rounded-2xl border-2 transition-all focus-within:border-orange-500 ${inputBg}`}>
                      <button className="p-2 opacity-40 hover:opacity-100 transition"><Paperclip size={20}/></button>
                      <input 
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..." 
                        className="flex-1 bg-transparent p-2 outline-none font-bold" 
                      />
                      <button onClick={handleSendMessage} className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 shadow-lg transition"><Send size={18}/></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 select-none">
                  <MessageSquare size={80} className="mb-4" />
                  <p className="text-3xl font-black">Select a conversation</p>
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'profile' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <button onClick={() => setActiveView('main')} className={`mb-6 flex items-center gap-2 font-bold ${secondaryText} hover:text-orange-500 transition`}>
              <ChevronRight size={18} className="rotate-180" /> Back to Dashboard
            </button>
            <div className={`${cardBg} border-2 rounded-[40px] p-8 md:p-12 mb-6`}>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[40px] bg-orange-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl">JD</div>
                  <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl hover:bg-orange-500 transition-colors border-4 border-white dark:border-slate-800">
                    <Camera size={20} />
                  </button>
                </div>
                <div className="text-center md:text-left pt-2">
                   <h2 className="text-3xl font-black">{profileData.name}</h2>
                   <p className={`font-bold ${secondaryText}`}>{userRole === 'client' ? 'Homeowner' : 'Service Professional'}</p>
                   <div className="flex gap-2 mt-4">
                      <button onClick={() => setProfileTab('info')} className={`px-5 py-2 rounded-xl font-bold transition-all ${profileTab === 'info' ? 'bg-orange-500 text-white' : `${inputBg} ${secondaryText}`}`}>Profile Info</button>
                      <button onClick={() => setProfileTab('history')} className={`px-5 py-2 rounded-xl font-bold transition-all ${profileTab === 'history' ? 'bg-orange-500 text-white' : `${inputBg} ${secondaryText}`}`}>History & Jobs</button>
                   </div>
                </div>
              </div>

              {profileTab === 'info' ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Bio</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                      <textarea 
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Profile Updated!")}
                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> Update Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                      <Briefcase className="text-orange-500" size={20} /> Past Job Requests
                    </h3>
                    <div className="space-y-3">
                      {pastJobs.map(job => (
                        <div key={job.id} className={`${inputBg} p-5 rounded-3xl flex justify-between items-center`}>
                          <div>
                            <p className="font-black">{job.title}</p>
                            <p className="text-xs font-bold opacity-60 uppercase">{job.date} • with {job.pro}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                                <p className="font-black text-orange-500">{job.cost}</p>
                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase">Completed</span>
                            </div>
                            <button 
                              onClick={() => { setReviewingJob(job); setIsReviewModalOpen(true); }}
                              className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm hover:text-orange-500 transition-colors border border-slate-200 dark:border-slate-700"
                            >
                                <Star size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                      <History className="text-orange-500" size={20} /> Transaction History
                    </h3>
                    <div className={`${inputBg} rounded-3xl overflow-hidden`}>
                      {transactions.map((tx, idx) => (
                        <div key={tx.id} className={`p-5 flex justify-between items-center ${idx !== transactions.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'payment' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {tx.type === 'payment' ? <ArrowUpRight size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            <div>
                              <p className="font-black text-sm">{tx.label}</p>
                              <p className="text-[10px] font-bold opacity-50 uppercase">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-black ${tx.type === 'payment' ? '' : 'text-green-500'}`}>{tx.amount}</p>
                            <p className="text-[10px] font-bold opacity-50 uppercase">{tx.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : userRole === 'client' ? (
          <div className="animate-in fade-in duration-500">
            {activeView === 'main' ? (
              <>
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h2 className="text-4xl font-black mb-2">Hire a Pro</h2>
                    <p className={`font-medium ${secondaryText}`}>Verified experts in your area ready to help.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => setActiveView('review-bids')} className={`${cardBg} flex-1 md:flex-none px-6 py-3 rounded-2xl border-2 flex items-center gap-3 hover:border-orange-500 transition`}>
                        <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500"><Bell size={18}/></div>
                        <div className="text-left"><p className="text-[10px] font-bold uppercase opacity-60 leading-none">New Bids</p><p className="font-black text-lg">{incomingBids.length}</p></div>
                    </button>
                    <button onClick={() => setIsPostJobOpen(true)} className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-orange-600 transition">
                      <PlusCircle size={20} /> Post Job
                    </button>
                  </div>
                </header>

                <div className={`p-2 rounded-3xl border-2 mb-10 flex items-center transition-all ${cardBg} focus-within:border-orange-500`}>
                  <Search className="ml-4 text-slate-400" />
                  <input placeholder="Search plumbers, electricians..." className="bg-transparent w-full p-4 outline-none font-bold placeholder:text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pros.map(pro => (
                    <div key={pro.id} className={`${cardBg} border-2 rounded-[35px] p-6 hover:shadow-xl hover:border-orange-500/30 transition-all group`}>
                      <div className="flex gap-4 mb-6">
                        <img src={pro.img} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                        <div>
                          <h4 className="font-black text-lg">{pro.name}</h4>
                          <p className="text-orange-500 font-bold text-sm">{pro.skill}</p>
                        </div>
                      </div>
                      <div className={`flex justify-between items-center mb-6 p-3 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-1 text-yellow-500 font-black"><Star size={16} fill="currentColor" /> {pro.rating}</div>
                        <div className="font-black">{pro.rate}</div>
                      </div>
                      <button className={`w-full py-3 rounded-2xl font-black transition-all ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'} group-hover:bg-orange-500 group-hover:text-white`}>View Profile</button>
                    </div>
                  ))}
                </div>
              </>
            ) : activeView === 'review-bids' && (
              <div className="animate-in slide-in-from-right duration-300">
                <button onClick={() => setActiveView('main')} className={`mb-6 flex items-center gap-2 font-bold ${secondaryText} hover:text-orange-500 transition`}>
                  <ChevronRight size={18} className="rotate-180" /> Back to Search
                </button>
                <h2 className="text-4xl font-black mb-2">Review Bids</h2>
                <p className={`font-medium mb-10 ${secondaryText}`}>Compare offers and hire the best pro for your job.</p>

                <div className="space-y-4">
                  {incomingBids.map(bid => (
                    <div key={bid.id} className={`${cardBg} border-2 p-6 rounded-[35px] flex flex-col md:flex-row justify-between items-start md:items-center hover:border-orange-500 transition-all shadow-sm`}>
                      <div className="flex gap-4 items-center">
                        <img src={bid.proImg} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                        <div>
                          <p className="text-xs font-bold text-orange-500 uppercase">{bid.jobTitle}</p>
                          <h4 className="font-black text-xl">{bid.proName}</h4>
                          <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm"><Star size={14} fill="currentColor" /> {bid.rating}</div>
                             <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] uppercase">
                               <Clock size={12} /> {Math.max(0, Math.floor((48 * 60 * 60 * 1000 - (Date.now() - bid.createdAt)) / (1000 * 60 * 60)))}h left
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-6 w-full md:w-auto">
                        <div className="text-2xl font-black text-green-500">{bid.amount}</div>
                        <button onClick={() => setSelectedBid(bid)} className="flex-1 md:flex-none bg-orange-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-orange-600 transition">View Offer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10">
              <h2 className="text-4xl font-black mb-2">Job Feed</h2>
              <p className={`font-medium ${secondaryText}`}>New work requests near your location.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className={`${cardBg} border-2 p-6 rounded-3xl`}>
                <Wallet className="text-orange-500 mb-2" />
                <h3 className="text-2xl font-black">$2,450</h3>
                <p className={`text-sm font-bold uppercase opacity-80 ${secondaryText}`}>Total Earnings</p>
              </div>
              <div className={`${cardBg} border-2 p-6 rounded-3xl`}>
                <Star className="text-orange-500 mb-2" />
                <h3 className="text-2xl font-black">4.9</h3>
                <p className={`text-sm font-bold uppercase opacity-80 ${secondaryText}`}>Rating</p>
              </div>
              <div className={`${cardBg} border-2 p-6 rounded-3xl`}>
                <Briefcase className="text-orange-500 mb-2" />
                <h3 className="text-2xl font-black">12</h3>
                <p className={`text-sm font-bold uppercase opacity-80 ${secondaryText}`}>Active Bids</p>
              </div>
            </div>

            <div className="space-y-6">
              {leads.map(lead => (
                <div key={lead.id} className={`${cardBg} border-2 p-8 rounded-[40px] flex flex-col md:flex-row justify-between gap-8 hover:border-orange-500 transition-all`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${lead.urgency === 'High' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>{lead.urgency} Urgency</span>
                      <span className="flex items-center gap-1 text-xs font-bold opacity-50"><Clock size={14}/> {lead.time}</span>
                    </div>
                    <h3 onClick={() => setSelectedJobDetail(lead)} className="text-2xl font-black mb-2 cursor-pointer hover:text-orange-500 transition-colors underline decoration-orange-500/30 underline-offset-4">{lead.title}</h3>
                    <p className={`font-medium mb-6 line-clamp-2 ${secondaryText}`}>{lead.desc}</p>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 font-bold text-sm"><MapPin size={16} className="text-orange-500" /> {lead.area}</div>
                      <div className="flex items-center gap-2 font-bold text-sm"><DollarSign size={16} className="text-green-500" /> Budget: {lead.budget}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setSelectedLead(lead); setIsBidModalOpen(true); }}
                      className="w-full md:w-auto bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                    >
                      Bid for Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Leave a Review Modal */}
      {isReviewModalOpen && reviewingJob && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className={`${cardBg} border w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 p-10 animate-in zoom-in duration-300`}>
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp size={40} />
                </div>
                <h2 className="text-3xl font-black">Rate Your Pro</h2>
                <p className={`font-bold mt-2 ${secondaryText}`}>How was your experience with {reviewingJob.pro} for the {reviewingJob.title}?</p>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star} 
                            type="button" 
                            onClick={() => setRatingScore(star)}
                            className={`p-2 transition-transform hover:scale-125 ${ratingScore >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                        >
                            <Star size={40} fill={ratingScore >= star ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>

                <div>
                    <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Tell us more</label>
                    <textarea required rows={3} placeholder="Write a short review..." className={`w-full p-6 rounded-3xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => setIsReviewModalOpen(false)} className={`flex-1 py-4 rounded-2xl font-black ${inputBg}`}>Cancel</button>
                    <button type="submit" disabled={ratingScore === 0} className="flex-[2] bg-orange-500 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-orange-600 disabled:opacity-50 transition-all">Submit Review</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal for Clients */}
      {isPostJobOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPostJobOpen(false)}></div>
          <div className={`${cardBg} border w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 p-8 md:p-12 animate-in zoom-in duration-300`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black">Post a Job</h2>
              <button onClick={() => setIsPostJobOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"><X /></button>
            </div>
            <form onSubmit={handlePostJob} className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Job Title</label>
                <input name="title" required placeholder="e.g. Fix Leaking Sink" className={`w-full px-6 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Category</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 appearance-none transition-all ${inputBg}`}>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>Carpentry</option>
                      <option>Painting</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="budget" type="number" required placeholder="e.g. 200" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input name="location" required placeholder="Downtown, NY" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider opacity-50 mb-2 block">Description</label>
                <textarea name="desc" rows={4} required placeholder="Describe what needs to be fixed..." className={`w-full p-6 rounded-3xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-orange-600 transition-all">
                Publish Job Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail Modal Overlay */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedJobDetail(null)}></div>
          <div className={`${cardBg} border-2 w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 p-10 animate-in zoom-in duration-300`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${selectedJobDetail.urgency === 'High' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                     {selectedJobDetail.urgency} Urgency Lead
                   </span>
                   <h2 className="text-4xl font-black mt-4">{selectedJobDetail.title}</h2>
                </div>
                <button onClick={() => setSelectedJobDetail(null)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-orange-500 hover:text-white transition"><X /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`${inputBg} p-4 rounded-3xl flex items-center gap-3`}>
                    <MapPin className="text-orange-500" size={20} />
                    <div><p className="text-[10px] font-black opacity-50 uppercase">Location</p><p className="font-bold">{selectedJobDetail.area}</p></div>
                </div>
                <div className={`${inputBg} p-4 rounded-3xl flex items-center gap-3`}>
                    <DollarSign className="text-green-500" size={20} />
                    <div><p className="text-[10px] font-black opacity-50 uppercase">Budget Range</p><p className="font-bold">{selectedJobDetail.budget}</p></div>
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-xs font-black uppercase opacity-50 mb-3 flex items-center gap-2"><Info size={14}/> Full Job Description</h4>
                <div className={`p-6 rounded-[30px] border-2 border-dashed ${darkMode ? 'border-slate-700' : 'border-slate-200'} leading-relaxed font-medium`}>
                    {selectedJobDetail.desc}
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedJobDetail(null)}
                  className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                >
                  Close Detail
                </button>
                <button 
                  onClick={() => { setSelectedLead(selectedJobDetail); setIsBidModalOpen(true); setSelectedJobDetail(null); }}
                  className="flex-[2] bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <ChevronRight size={20}/>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal for Pros */}
      {isBidModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBidModalOpen(false)}></div>
          <div className={`${cardBg} border w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 p-8 animate-in zoom-in duration-300`}>
            <h2 className="text-3xl font-black mb-2">Place Your Bid</h2>
            <p className={`font-bold mb-6 ${secondaryText}`}>Applying for: {selectedLead?.title}</p>
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="amount" required type="number" placeholder="Your Quote (e.g. 150)" className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
              </div>
              <textarea name="message" required rows={4} placeholder="Tell the client why you're the best fit..." className={`w-full p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-orange-500 transition-all ${inputBg}`} />
              <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all">Submit Bid</button>
            </form>
          </div>
        </div>
      )}

      {/* Bid Detail Modal for Clients */}
      {selectedBid && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBid(null)}></div>
          <div className={`${cardBg} border w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 p-10 animate-in zoom-in duration-300`}>
            <div className="flex justify-between items-start mb-8">
               <div className="flex gap-6 items-center">
                 <img src={selectedBid.proImg} className="w-20 h-20 rounded-3xl object-cover" alt="" />
                 <div>
                    <h3 className="text-3xl font-black">{selectedBid.proName}</h3>
                    <div className="flex items-center gap-2 text-yellow-500 font-black">
                      <Star size={18} fill="currentColor" /> {selectedBid.rating} <span className="text-slate-400 text-sm font-bold ml-2">(124 Reviews)</span>
                    </div>
                 </div>
               </div>
               <button onClick={() => setSelectedBid(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X /></button>
            </div>
            
            <div className={`p-6 rounded-3xl mb-8 ${inputBg}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">Proposal Message</p>
              <p className="font-bold text-lg leading-relaxed italic">"{selectedBid.message}"</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 bg-green-500/10 p-6 rounded-3xl text-center">
                 <p className="text-[10px] font-black uppercase text-green-600 mb-1">Proposed Quote</p>
                 <p className="text-4xl font-black text-green-600">{selectedBid.amount}</p>
               </div>
               <div className="flex-[2] flex gap-3">
                 <button onClick={() => handleDeclineBid(selectedBid.id)} className="flex-1 bg-red-500/10 text-red-500 font-black rounded-3xl hover:bg-red-500 hover:text-white transition-all">Decline</button>
                 <button onClick={() => handleHirePro(selectedBid)} className="flex-[2] bg-orange-500 text-white font-black rounded-3xl text-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                   <CheckCircle2 /> Accept & Hire
                 </button>
               </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-500 font-bold text-sm">
               <AlertCircle size={16} /> This bid expires in {Math.floor((48 * 60 * 60 * 1000 - (Date.now() - selectedBid.createdAt)) / (1000 * 60 * 60))} hours
            </div>
          </div>
        </div>
      )}
    </div>
  );
}