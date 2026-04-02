import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send } from 'lucide-react';

export default function ChatWindow({ otherUserId }) {
    const { currentUser, getPlayerById, getThreadForUser, sendMessage } = useApp();
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
    const otherUser = getPlayerById(otherUserId);
    const thread = getThreadForUser(otherUserId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [thread?.messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(otherUserId, text.trim());
        setText('');
    };

    if (!otherUser) return null;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const messages = thread?.messages || [];

    // Group messages by date
    const groupedMessages = messages.reduce((groups, msg) => {
        const date = formatDate(msg.timestamp);
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full ring-2 ring-white/10" />
                <div>
                    <h3 className="font-display font-semibold text-white text-sm">{otherUser.name}</h3>
                    <p className="text-xs text-dark-400">{otherUser.city} · {otherUser.sports.length} sports</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
                            <Send size={24} className="text-brand-400" />
                        </div>
                        <p className="text-dark-400 text-sm">No messages yet</p>
                        <p className="text-dark-500 text-xs mt-1">Say hello to {otherUser.name}!</p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                            <div className="flex items-center justify-center my-4">
                                <span className="text-xs text-dark-500 bg-dark-900/50 px-3 py-1 rounded-full">{date}</span>
                            </div>
                            <div className="space-y-2">
                                {msgs.map(msg => {
                                    const isMine = msg.from === currentUser.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine
                                                    ? 'bg-brand-500 text-white rounded-br-md'
                                                    : 'glass text-dark-200 rounded-bl-md'
                                                }`}>
                                                <p className="leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${isMine ? 'text-brand-200' : 'text-dark-500'}`}>
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="input-field flex-1 !rounded-full !py-2.5"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white
                       hover:bg-brand-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-brand-500/30"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
