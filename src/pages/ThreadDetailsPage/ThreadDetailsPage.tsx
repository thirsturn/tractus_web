import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Repeat, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import threadService from '../../services/thread.service';
import type { ThreadResponse } from '../../types/thread.types';
import './ThreadDetailsPage.css';

interface ThreadComment {
  id: number;
  author: string;
  initial: string;
  time: string;
  content: string;
  upvotes: number;
  hasUpvoted: boolean;
  profileImageUrl?: string;
}

interface ThreadViewModel extends ThreadResponse {
  time: string;
  stats: { upvotes: number; comments: number; reposts: number };
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasReposted: boolean;
}

export default function ThreadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const [thread, setThread] = useState<ThreadViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadThread = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await threadService.getThreadById(parseInt(id, 10));
        setThread({
          ...data,
          time: 'Just now',
          stats: { upvotes: 0, comments: 0, reposts: 0 },
          hasUpvoted: false,
          hasDownvoted: false,
          hasReposted: false,
        });
      } catch (err: any) {
        console.error('Failed to load thread:', err);
        setError('Could not load thread details.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThread();
  }, [id]);

  if (isLoading) {
    return <div className="thread-details-container"><div className="loading-state">Loading...</div></div>;
  }

  if (error || !thread) {
    return (
      <div className="thread-details-container">
        <div className="error-state">
          {error || 'Thread not found'}
          <br /><br />
          <Link to="/" className="back-btn" style={{ justifyContent: 'center' }}>Back to Feed</Link>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: ThreadComment = {
      id: Date.now(),
      author: user?.username || 'Guest',
      initial: user?.username?.charAt(0).toUpperCase() || 'G',
      profileImageUrl: user?.profileImageUrl,
      time: 'Just now',
      content: commentText.trim(),
      upvotes: 0,
      hasUpvoted: false,
    };
    setComments([...comments, newComment]);
    setCommentText('');
    inputRef.current?.blur();
  };

  const handleReply = (author: string) => {
    setCommentText(`@${author} `);
    inputRef.current?.focus();
  };

  const handleUpvote = (id: number) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          hasUpvoted: !c.hasUpvoted,
          upvotes: c.hasUpvoted ? c.upvotes - 1 : c.upvotes + 1
        };
      }
      return c;
    }));
  };

  const handlePostUpvote = () => {
    if (!thread) return;
    setThread(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hasUpvoted: !prev.hasUpvoted,
        hasDownvoted: false,
        stats: {
          ...prev.stats,
          upvotes: prev.hasUpvoted ? prev.stats.upvotes - 1 : prev.stats.upvotes + 1 + (prev.hasDownvoted ? 1 : 0)
        }
      }
    });
  };

  const handlePostDownvote = () => {
    if (!thread) return;
    setThread(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hasDownvoted: !prev.hasDownvoted,
        hasUpvoted: false,
        stats: {
          ...prev.stats,
          upvotes: prev.hasDownvoted ? prev.stats.upvotes + 1 : prev.stats.upvotes - 1 - (prev.hasUpvoted ? 1 : 0)
        }
      }
    });
  };

  const handleRepost = () => {
    if (!thread) return;
    setThread(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hasReposted: !prev.hasReposted,
        stats: {
          ...prev.stats,
          reposts: prev.hasReposted ? prev.stats.reposts - 1 : prev.stats.reposts + 1
        }
      }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Tractus Thread',
      text: `Check out this thread on Tractus: "${thread.title}"`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="thread-details-container">
      {/* Navigation Bar */}
      <div className="details-header-nav">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back to Feed</span>
        </Link>
      </div>

      {/* Main Thread Content */}
      <article className="main-post">
        <div className="post-header">
          <div className="author-avatar">{thread.author.username.charAt(0).toUpperCase()}</div>
          <div className="post-meta">
            <span className="author-name">{thread.author.username}</span>
            <span className="time-posted">{thread.time}</span>
          </div>
          <button className="more-btn"><MoreHorizontal size={20} /></button>
        </div>

        <h1 className="post-title">{thread.title}</h1>
        <div className="post-body">
          {thread.content && thread.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          {thread.imageUrl && (
            <div className="post-image-container">
              <img src={thread.imageUrl} alt="Post Attachment" className="post-attached-image" />
            </div>
          )}
        </div>

        {/* Statistics Bar */}
        <div className="post-stats-bar">
          <div className="stat-group">
            <button 
              className={`stat-btn upvote ${thread.hasUpvoted ? 'active' : ''}`}
              onClick={handlePostUpvote}
            >
              <ArrowUp size={18} />
            </button>
            <span className="stat-count">{thread.stats.upvotes}</span>
            <button 
              className={`stat-btn downvote ${thread.hasDownvoted ? 'active' : ''}`}
              onClick={handlePostDownvote}
            >
              <ArrowDown size={18} />
            </button>
          </div>
          
          <button className="stat-btn action">
            <MessageSquare size={18} />
            <span>{thread.stats.comments + comments.length} Comments</span>
          </button>
          
          <button 
            className={`stat-btn action ${thread.hasReposted ? 'active' : ''}`}
            onClick={handleRepost}
          >
            <Repeat size={18} />
            <span>{thread.stats.reposts} Reposts</span>
          </button>

          <button className="stat-btn action share" onClick={handleShare}>
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <h3>Discussion</h3>
        
        {/* Comment Input */}
        <div className="comment-input-area">
          <div className="author-avatar small" style={{ overflow: 'hidden' }}>
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="input-wrapper">
            <textarea 
              ref={inputRef}
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={1}
            />
            <button className="send-btn" onClick={handleAddComment} disabled={!commentText.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="author-avatar small" style={{ overflow: 'hidden' }}>
                {comment.profileImageUrl ? (
                  <img src={comment.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  comment.initial
                )}
              </div>
              <div className="comment-content-area">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                  <button 
                    className={`comment-action-btn ${comment.hasUpvoted ? 'active' : ''}`}
                    onClick={() => handleUpvote(comment.id)}
                  >
                    <ArrowUp size={14} /> {comment.upvotes} Upvotes
                  </button>
                  <button 
                    className="comment-action-btn"
                    onClick={() => handleReply(comment.author)}
                  >
                    <MessageSquare size={14} /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
