import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Repeat, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import threadService from '../../services/thread.service';
import commentService from '../../services/comment.service';
import voteService from '../../services/vote.service';
import type { ThreadResponse } from '../../types/thread.types';
import type { CommentResponse } from '../../types/comment.types';
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
  parentCommentId?: number;
}

export default function ThreadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [thread, setThread] = useState<ThreadResponse | null>(null);
  
  // Local state for optimistic UI updates on thread votes
  const [threadVotes, setThreadVotes] = useState(0);
  const [hasUpvotedThread, setHasUpvotedThread] = useState(false);
  const [hasDownvotedThread, setHasDownvotedThread] = useState(false);
  const [isVotingThread, setIsVotingThread] = useState(false);
  const [votingCommentIds, setVotingCommentIds] = useState<Set<number>>(new Set());

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [replyingTo, setReplyingTo] = useState<number | undefined>(undefined);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const threadId = parseInt(id, 10);
      
      // Fetch thread details
      threadService.getThreadById(threadId)
        .then(data => {
          setThread(data);
        })
        .catch(err => console.error('Failed to fetch thread', err));

      // Fetch comments
      commentService.getCommentsByThread(threadId)
        .then(async data => {
          const formattedComments: ThreadComment[] = data.map((c: CommentResponse) => ({
            id: c.id,
            author: c.author.username,
            initial: c.author.username.charAt(0).toUpperCase(),
            time: 'Just now', // Ideally, backend should return a timestamp
            content: c.content,
            upvotes: 0,
            hasUpvoted: false,
            profileImageUrl: c.author.profileImageUrl,
            parentCommentId: c.parentCommentId
          }));
          setComments(formattedComments);

          const votesByComment = await Promise.all(
            formattedComments.map(c => voteService.getCommentVotes(c.id))
          );
          setComments(formattedComments.map((c, idx) => {
            const votes = votesByComment[idx];
            return {
              ...c,
              upvotes: votes.filter(v => v.voteType === 'UP').length,
              hasUpvoted: !!(user && votes.some(v => v.userId === user.id && v.voteType === 'UP'))
            };
          }));
        })
        .catch(err => console.error('Failed to fetch comments', err));

      // Fetch Thread Votes
      voteService.getThreadVotes(threadId)
        .then(votes => {
          let up = 0;
          let down = 0;
          let userUpvoted = false;
          let userDownvoted = false;

          votes.forEach(v => {
            if (v.voteType === 'UP') up++;
            if (v.voteType === 'DOWN') down++;
            if (user && v.userId === user.id) {
              if (v.voteType === 'UP') userUpvoted = true;
              if (v.voteType === 'DOWN') userDownvoted = true;
            }
          });

          setThreadVotes(up - down);
          setHasUpvotedThread(userUpvoted);
          setHasDownvotedThread(userDownvoted);
        })
        .catch(err => console.error('Failed to fetch thread votes', err));
    }
  }, [id, user]);

  const handleAddComment = () => {
    if (!commentText.trim() || !thread || !user) return;
    
    const threadId = parseInt(id as string, 10);
    
    commentService.createComment({
      content: commentText.trim(),
      userId: user.id,
      threadId: threadId,
      parentCommentId: replyingTo
    }).then(newC => {
      const formatted: ThreadComment = {
        id: newC.id,
        author: newC.author.username,
        initial: newC.author.username.charAt(0).toUpperCase(),
        time: 'Just now',
        content: newC.content,
        upvotes: 0,
        hasUpvoted: false,
        profileImageUrl: newC.author.profileImageUrl,
        parentCommentId: newC.parentCommentId
      };
      setComments([...comments, formatted]);
      setCommentText('');
      setReplyingTo(undefined);
      inputRef.current?.blur();
    }).catch(err => console.error('Error creating comment', err));
  };

  const handleReply = (author: string, commentId: number) => {
    setReplyingTo(commentId);
    setCommentText(`@${author} `);
    inputRef.current?.focus();
  };

  const handleUpvote = (commentId: number) => {
    if (!user || votingCommentIds.has(commentId)) return;

    setVotingCommentIds(prev => new Set(prev).add(commentId));
    voteService.castCommentVote({
      userId: user.id,
      targetId: commentId,
      voteType: 'UP'
    }).then(async () => {
      const votes = await voteService.getCommentVotes(commentId);
      const upvotes = votes.filter(v => v.voteType === 'UP').length;
      const hasUpvoted = votes.some(v => v.userId === user.id && v.voteType === 'UP');
      setComments(comments.map(c => c.id === commentId ? { ...c, upvotes, hasUpvoted } : c));
    }).catch(err => console.error('Error voting on comment', err))
      .finally(() => setVotingCommentIds(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      }));
  };

  const handlePostUpvote = () => {
    if (!user || !thread || isVotingThread) return;

    setIsVotingThread(true);
    voteService.castThreadVote({
      userId: user.id,
      targetId: thread.id,
      voteType: 'UP'
    }).then(() => {
      if (hasUpvotedThread) {
        setHasUpvotedThread(false);
        setThreadVotes(prev => prev - 1);
      } else {
        setHasUpvotedThread(true);
        setThreadVotes(prev => prev + 1 + (hasDownvotedThread ? 1 : 0));
        setHasDownvotedThread(false);
      }
    }).catch(err => console.error('Error upvoting thread', err))
      .finally(() => setIsVotingThread(false));
  };

  const handlePostDownvote = () => {
    if (!user || !thread || isVotingThread) return;

    setIsVotingThread(true);
    voteService.castThreadVote({
      userId: user.id,
      targetId: thread.id,
      voteType: 'DOWN'
    }).then(() => {
      if (hasDownvotedThread) {
        setHasDownvotedThread(false);
        setThreadVotes(prev => prev + 1);
      } else {
        setHasDownvotedThread(true);
        setThreadVotes(prev => prev - 1 - (hasUpvotedThread ? 1 : 0));
        setHasUpvotedThread(false);
      }
    }).catch(err => console.error('Error downvoting thread', err))
      .finally(() => setIsVotingThread(false));
  };

  const handleShare = async () => {
    if (!thread) return;
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
        setShareStatus('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      if ((err as Error).name !== 'AbortError') {
        setShareStatus('Unable to share this thread.');
      }
    } finally {
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  if (!thread) {
    return <div className="thread-details-container"><div className="loading-state">Loading...</div></div>;
  }

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
          <div className="author-avatar" style={{ overflow: 'hidden' }}>
            {thread.author.profileImageUrl ? (
              <img src={thread.author.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              thread.author.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="post-meta">
            <Link to={`/profile/${thread.author.username}`} className="author-name">{thread.author.username}</Link>
            <span className="time-posted">Just now</span>
          </div>
          <button className="more-btn"><MoreHorizontal size={20} /></button>
        </div>

        <h1 className="post-title">{thread.title}</h1>
        <div className="post-body">
          {thread.content?.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          {thread.imageUrl && (
            <img src={thread.imageUrl} alt="Thread Attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '1rem' }} />
          )}
        </div>

        {/* Statistics Bar */}
        <div className="post-stats-bar">
          <div className="stat-group">
            <button
              className={`stat-btn upvote ${hasUpvotedThread ? 'active' : ''}`}
              onClick={handlePostUpvote}
              disabled={isVotingThread}
            >
              <ArrowUp size={18} />
            </button>
            <span className="stat-count">{threadVotes}</span>
            <button
              className={`stat-btn downvote ${hasDownvotedThread ? 'active' : ''}`}
              onClick={handlePostDownvote}
              disabled={isVotingThread}
            >
              <ArrowDown size={18} />
            </button>
          </div>
          
          <button className="stat-btn action">
            <MessageSquare size={18} />
            <span>{comments.length} Comments</span>
          </button>
          
          <button className="stat-btn action share" onClick={handleShare}>
            <Share2 size={18} />
            <span>Share</span>
          </button>
          {shareStatus && <span className="share-status">{shareStatus}</span>}
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
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (e.target.value === '') setReplyingTo(undefined);
              }}
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
                  <Link to={`/profile/${comment.author}`} className="comment-author">{comment.author}</Link>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
                <div className="comment-actions">
                  <button
                    className={`comment-action-btn ${comment.hasUpvoted ? 'active' : ''}`}
                    onClick={() => handleUpvote(comment.id)}
                    disabled={votingCommentIds.has(comment.id)}
                  >
                    <ArrowUp size={14} /> {comment.upvotes} Upvotes
                  </button>
                  <button 
                    className="comment-action-btn"
                    onClick={() => handleReply(comment.author, comment.id)}
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
