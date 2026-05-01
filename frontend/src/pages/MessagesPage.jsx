import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { MessageSquare, Search } from 'lucide-react';
import { useState } from 'react';

const KOLKATA_TIME_ZONE = 'Asia/Kolkata';

const getKolkataDateKey = (timestamp) => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: KOLKATA_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(timestamp));
};

export default function MessagesPage() {
    const { userId } = useParams();
    const { currentUser, getUserThreads, getPlayerById } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const threads = getUserThreads();

    if (!currentUser) return null;

    const getOtherUserId = (thread) => {
        return String(thread.senderId) === String(currentUser.id) ? thread.receiverId : thread.senderId;
    };

    const filteredThreads = threads.filter(thread => {
        const otherUser = getPlayerById(getOtherUserId(thread));
        if (!otherUser) return false;
        if (searchTerm) {
            return otherUser.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const getLastMessage = (thread) => {
        const msgs = thread.messages;
        return msgs[msgs.length - 1];
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();

        const todayKey = getKolkataDateKey(now);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = getKolkataDateKey(yesterday);
        const messageKey = getKolkataDateKey(date);

        if (messageKey === todayKey) {
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: KOLKATA_TIME_ZONE,
            });
        }
        if (messageKey === yesterdayKey) {
            return 'Yesterday';
        }
        const diff = now - date;
        if (diff < 604800000) {
            return date.toLocaleDateString('en-IN', {
                weekday: 'short',
                timeZone: KOLKATA_TIME_ZONE,
            });
        }
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            timeZone: KOLKATA_TIME_ZONE,
        });
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-8">
                <div className="flex h-[calc(100vh-5rem)] glass rounded-none sm:rounded-2xl overflow-hidden">
                    {/* Threads List */}
                    <div className={`w-full sm:w-80 lg:w-96 border-r border-white/10 flex flex-col ${userId ? 'hidden sm:flex' : 'flex'
                        }`}>
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/10">
                            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-brand-400" />
                                Messages
                            </h2>
                            {/* Search */}
                            <div className="relative mt-3">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-500
                             focus:outline-none focus:border-brand-500/30"
                                />
                            </div>
                        </div>

                        {/* Thread List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredThreads.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <MessageSquare size={32} className="text-dark-700 mx-auto mb-3" />
                                    <p className="text-sm text-dark-500">No conversations yet</p>
                                    <Link to="/discover" className="text-sm text-brand-400 hover:text-brand-300 mt-2 inline-block">
                                        Find players to chat with
                                    </Link>
                                </div>
                            ) : (
                                filteredThreads.map(thread => {
                                    const otherUserId = getOtherUserId(thread);
                                    const otherUser = getPlayerById(otherUserId);
                                    const lastMsg = getLastMessage(thread);
                                    const isActive = String(userId) === String(otherUserId);

                                    if (!otherUser) return null;

                                    return (
                                        <Link
                                            key={thread.id}
                                            to={`/messages/${otherUserId}`}
                                            className={`flex items-center gap-3 px-5 py-4 border-b border-white/5 transition-all hover:bg-white/5 ${isActive ? 'bg-white/5 border-l-2 border-l-brand-500' : ''
                                                }`}
                                        >
                                            <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full ring-2 ring-white/10 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-white truncate">{otherUser.name}</span>
                                                    <span className="text-[10px] text-dark-500 flex-shrink-0">{formatTime(lastMsg.timestamp)}</span>
                                                </div>
                                                <p className="text-xs text-dark-400 truncate mt-0.5">
                                                    {String(lastMsg.from) === String(currentUser.id) ? 'You: ' : ''}{lastMsg.text}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Panel */}
                    <div className={`flex-1 flex flex-col ${!userId ? 'hidden sm:flex' : 'flex'}`}>
                        {userId ? (
                            <ChatWindow otherUserId={userId} />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-center px-6">
                                <div>
                                    <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={32} className="text-brand-400" />
                                    </div>
                                    <h3 className="font-display text-xl font-semibold text-white mb-2">Select a conversation</h3>
                                    <p className="text-dark-400 text-sm">Choose a player from the list to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
