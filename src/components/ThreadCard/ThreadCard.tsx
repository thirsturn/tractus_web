import { MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ThreadResponse } from '../../types/thread.types';
import './ThreadCard.css';

interface ThreadCardProps {
  thread: ThreadResponse;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  // Since the backend doesn't currently return vote/comment counts, we will use placeholders
  // that we can hook up to real data later when the backend expands!
  const upvotes = Math.floor(Math.random() * 50); 
  const commentsCount = Math.floor(Math.random() * 20);

  return (
    <article className="thread-card">
      {/* Left side: Voting Controls */}
      <div className="thread-voting">
        <button className="vote-btn upvote">
          <ArrowUp size={20} />
        </button>
        <span className="vote-count">{upvotes}</span>
        <button className="vote-btn downvote">
          <ArrowDown size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <Link to={`/thread/${thread.id}`} className="thread-content">
        <div className="thread-header">
          <div className="thread-author-avatar">
            {thread.author.username.charAt(0).toUpperCase()}
          </div>
          <span className="thread-author-name">{thread.author.username}</span>
          <span className="thread-meta">• Just now</span>
        </div>
        
        <h2 className="thread-title">{thread.title}</h2>
        
        <div className="thread-actions">
          <button className="action-btn" onClick={(e) => e.preventDefault()}>
            <MessageSquare size={16} />
            <span>{commentsCount} Comments</span>
          </button>
        </div>
      </Link>
    </article>
  );
}
