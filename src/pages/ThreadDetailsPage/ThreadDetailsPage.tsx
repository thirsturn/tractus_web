import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Repeat, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useState } from 'react';
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

const MOCK_COMMENTS = [
  { id: 101, author: 'CodeNinja', initial: 'C', time: '1 hr ago', content: 'Honestly, I think Elixir is still criminally underrated. The BEAM ecosystem makes building fault-tolerant real-time systems so trivial compared to Node or Go.' },
  { id: 102, author: 'DataWizard', initial: 'D', time: '45 mins ago', content: 'Zig is fantastic if you are doing systems programming, but for web backends? It might be overkill. Stick to Go unless you really need that manual memory management.' },
  { id: 103, author: 'DesignPro', initial: 'D', time: '20 mins ago', content: 'What about Kotlin? It is huge in mobile but I feel like backend devs sleep on it. Ktor is incredibly nice to use.' }
];

export default function ThreadDetailsPage() {
  useParams<{ id: string }>(); // Will be used later for fetching
  const [commentText, setCommentText] = useState('');
  
  // In a real app, we would fetch the thread by ID here using threadService
  const thread = MOCK_THREAD_DETAIL;

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
            <button className="stat-btn upvote active"><ArrowUp size={18} /></button>
            <span className="stat-count">{thread.stats.upvotes}</span>
            <button className="stat-btn downvote"><ArrowDown size={18} /></button>
          </div>
          
          <button className="stat-btn action">
            <MessageSquare size={18} />
            <span>{thread.stats.comments} Comments</span>
          </button>
          
          <button className="stat-btn action">
            <Repeat size={18} />
            <span>{thread.stats.reposts} Reposts</span>
          </button>

          <button className="stat-btn action share">
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
          <div className="author-avatar small">U</div>
          <div className="input-wrapper">
            <textarea 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={1}
            />
            <button className="send-btn" disabled={!commentText.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="comments-list">
          {MOCK_COMMENTS.map(comment => (
            <div key={comment.id} className="comment">
              <div className="author-avatar small">{comment.initial}</div>
              <div className="comment-content-area">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                  <button className="comment-action-btn"><ArrowUp size={14} /> Upvote</button>
                  <button className="comment-action-btn"><MessageSquare size={14} /> Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
