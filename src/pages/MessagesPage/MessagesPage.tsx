import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import messageService from '../../services/message.service';
import userService from '../../services/user.service';
import type { MessageResponse } from '../../types/message.types';
import type { User } from '../../types/auth.types';
import { getImageUrl } from '../../utils/imageUrl';
import { formatPostDate } from '../../utils/date';
import './MessagesPage.css';

export default function MessagesPage() {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();

  const [conversations, setConversations] = useState<MessageResponse[]>([]);
  const [activePartner, setActivePartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Directory search for new chats
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations list & directory users
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await messageService.getUserConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };

    const loadUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        setAllUsers(users.filter(u => u.username !== authUser?.username));
      } catch (err) {
        console.error('Failed to load user directory', err);
      }
    };

    loadConversations();
    loadUsers();

    // Auto-poll conversations every 4 seconds
    const interval = setInterval(loadConversations, 4000);
    return () => clearInterval(interval);
  }, [authUser]);

  // Load target partner from URL or selection
  useEffect(() => {
    if (paramUsername) {
      userService.getUserByUsername(paramUsername)
        .then(userData => setActivePartner(userData))
        .catch(err => console.error('Failed to load user for chat', err));
    }
  }, [paramUsername]);

  // Load active conversation messages and auto-poll every 2 seconds
  useEffect(() => {
    if (!activePartner) return;

    const loadMessages = async () => {
      try {
        const chat = await messageService.getConversation(activePartner.username);
        setMessages(chat);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2500);
    return () => clearInterval(interval);
  }, [activePartner]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim() || !activePartner || isSending) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    setIsSending(true);

    try {
      const sentMsg = await messageService.sendMessage(activePartner.username, textToSend);
      setMessages(prev => [...prev, sentMsg]);
      
      // Refresh conversations list
      const updatedConvs = await messageService.getUserConversations();
      setConversations(updatedConvs);
    } catch (err) {
      console.error('Failed to send message', err);
      setNewMessageText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const filteredUserSearch = allUsers.filter(u =>
    u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.bio || '').toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="messages-container">
      {/* Sidebar Conversations & User Search */}
      <div className="messages-sidebar">
        <div className="messages-sidebar-header">
          <h2>Messages</h2>
          <div className="user-search-box">
            <Search size={16} />
            <input
              type="text"
              className="user-search-input"
              placeholder="Search or start new chat..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="conversations-list">
          {userSearchQuery.trim() ? (
            /* Show directory search results */
            filteredUserSearch.length === 0 ? (
              <div style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No users found.
              </div>
            ) : (
              filteredUserSearch.map(u => (
                <div
                  key={u.id}
                  className={`conversation-item ${activePartner?.username === u.username ? 'active' : ''}`}
                  onClick={() => {
                    setActivePartner(u);
                    setUserSearchQuery('');
                  }}
                >
                  <div className="conversation-avatar">
                    {u.profileImageUrl ? (
                      <img src={getImageUrl(u.profileImageUrl)} alt={u.username} />
                    ) : (
                      u.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="conversation-info">
                    <p className="conversation-name">@{u.username}</p>
                    <p className="conversation-snippet">{u.bio || 'Start chatting...'}</p>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Show existing active conversations */
            conversations.length === 0 ? (
              <div style={{ padding: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                No conversations yet. Use the search bar above to start chatting!
              </div>
            ) : (
              conversations.map(conv => {
                const partner = conv.sender.username === authUser?.username ? conv.recipient : conv.sender;
                const isActive = activePartner?.username === partner.username;

                return (
                  <div
                    key={conv.id}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActivePartner(partner)}
                  >
                    <div className="conversation-avatar">
                      {partner.profileImageUrl ? (
                        <img src={getImageUrl(partner.profileImageUrl)} alt={partner.username} />
                      ) : (
                        partner.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="conversation-info">
                      <p className="conversation-name">@{partner.username}</p>
                      <p className="conversation-snippet">
                        {conv.sender.username === authUser?.username ? 'You: ' : ''}
                        {conv.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="chat-main">
        {activePartner ? (
          <>
            <div className="chat-header">
              <div className="conversation-avatar">
                {activePartner.profileImageUrl ? (
                  <img src={getImageUrl(activePartner.profileImageUrl)} alt={activePartner.username} />
                ) : (
                  activePartner.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="chat-header-info">
                <h3 className="chat-header-name">@{activePartner.username}</h3>
                <Link to={`/profile/${activePartner.username}`} className="chat-header-link">
                  View Profile
                </Link>
              </div>
            </div>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-chat-placeholder">
                  <MessageSquare size={36} />
                  <p>Send a message to start the conversation with @{activePartner.username}!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isOutgoing = msg.sender.username === authUser?.username;
                  return (
                    <div
                      key={msg.id}
                      className={`message-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="message-bubble">{msg.content}</div>
                      <span className="message-time">
                        {msg.createdAt ? formatPostDate(msg.createdAt) : ''}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder={`Message @${activePartner.username}...`}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!newMessageText.trim() || isSending}
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-chat-placeholder">
            <MessageSquare size={48} />
            <h2>Direct Messaging</h2>
            <p>Select a conversation or search for a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
