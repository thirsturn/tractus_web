import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Repeat, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ThreadDetailsPage.css';

// Highly Realistic Mock Data
const MOCK_THREAD_DETAIL = {
  id: 1,
  title: 'What is the most underrated programming language in 2026?',
  content: 'I have been looking into languages outside of the usual JS/Python ecosystem and I keep hearing about Nim and Zig. What are your thoughts? Are there any languages that are currently flying under the radar but offer massive productivity boosts for web backend development?\n\nI feel like everyone just defaults to Go or Rust these days if they need performance, but maybe there is a better middle ground.',
  author: {
    username: 'TechGuru',
    initial: 'T'
  },
  time: '2 hours ago',
  stats: {
    upvotes: 245,
    comments: 42,
    reposts: 12
  }
};

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

const INITIAL_MOCK_COMMENTS: ThreadComment[] = [
  { id: 101, author: 'CodeNinja', initial: 'C', time: '1 hr ago', content: 'Honestly, I think Elixir is still criminally underrated. The BEAM ecosystem makes building fault-tolerant real-time systems so trivial compared to Node or Go.', upvotes: 24, hasUpvoted: false },
  { id: 102, author: 'DataWizard', initial: 'D', time: '45 mins ago', content: 'Zig is fantastic if you are doing systems programming, but for web backends? It might be overkill. Stick to Go unless you really need that manual memory management.', upvotes: 18, hasUpvoted: false },
  { id: 103, author: 'DesignPro', initial: 'D', time: '20 mins ago', content: 'What about Kotlin? It is huge in mobile but I feel like backend devs sleep on it. Ktor is incredibly nice to use.', upvotes: 5, hasUpvoted: false }
];

export default function ThreadDetailsPage() {
  useParams<{ id: string }>(); // Will be used later for fetching
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ThreadComment[]>(INITIAL_MOCK_COMMENTS);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // In a real app, we would fetch the thread by ID here using threadService
  const [thread, setThread] = useState({
    ...MOCK_THREAD_DETAIL,
    hasUpvoted: false,
    hasDownvoted: false,
    hasReposted: false,
  });

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
    setThread(prev => ({
      ...prev,
      hasUpvoted: !prev.hasUpvoted,
      hasDownvoted: false,
      stats: {
        ...prev.stats,
        upvotes: prev.hasUpvoted ? prev.stats.upvotes - 1 : prev.stats.upvotes + 1 + (prev.hasDownvoted ? 1 : 0)
      }
    }));
  };

  const handlePostDownvote = () => {
    setThread(prev => ({
      ...prev,
      hasDownvoted: !prev.hasDownvoted,
      hasUpvoted: false,
      stats: {
        ...prev.stats,
        upvotes: prev.hasDownvoted ? prev.stats.upvotes + 1 : prev.stats.upvotes - 1 - (prev.hasUpvoted ? 1 : 0)
      }
    }));
  };

  const handleRepost = () => {
    setThread(prev => ({
      ...prev,
      hasReposted: !prev.hasReposted,
      stats: {
        ...prev.stats,
        reposts: prev.hasReposted ? prev.stats.reposts - 1 : prev.stats.reposts + 1
      }
    }));
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
          <div className="author-avatar">{thread.author.initial}</div>
          <div className="post-meta">
            <span className="author-name">{thread.author.username}</span>
            <span className="time-posted">{thread.time}</span>
          </div>
          <button className="more-btn"><MoreHorizontal size={20} /></button>
        </div>

        <h1 className="post-title">{thread.title}</h1>
        <div className="post-body">
          {thread.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
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
            <span>{thread.stats.comments + (comments.length - INITIAL_MOCK_COMMENTS.length)} Comments</span>
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
