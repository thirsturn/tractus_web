import { MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { ThreadResponse } from '../../types/thread.types';
import { formatPostDate } from '../../utils/date';
import './ThreadCard.css';

interface ThreadCardProps {
  thread: ThreadResponse;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const commentsCount = thread.commentCount || 0;
  const navigate = useNavigate();

  return (
    <article className="thread-card">
      {/* Main Content Area */}
      <div className="thread-content" onClick={() => navigate(`/thread/${thread.id}`)}>
        <div className="thread-header">
          <div className="thread-author-avatar">
            {thread.author.username.charAt(0).toUpperCase()}
          </div>
          <Link
            to={`/profile/${thread.author.username}`}
            className="thread-author-name"
            onClick={(e) => e.stopPropagation()}
          >
            {thread.author.username}
          </Link>
          <span className="thread-meta">• {formatPostDate(thread.createdAt)}</span>
        </div>

        <h2 className="thread-title">{thread.title}</h2>

        {thread.content && (
          <p className="thread-preview-text">
            {thread.content.length > 150 ? `${thread.content.substring(0, 150)}...` : thread.content}
          </p>
        )}

        {thread.imageUrl && (
          <div className="thread-image-container" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <img src={thread.imageUrl} alt="Thread attachment" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        )}

        <div className="thread-actions">
          <button className="action-btn" onClick={(e) => e.preventDefault()}>
            <MessageSquare size={16} />
            <span>{commentsCount} Comments</span>
          </button>
        </div>
      </div>
    </article>
  );
}
