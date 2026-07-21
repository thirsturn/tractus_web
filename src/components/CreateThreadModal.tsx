import { useState } from 'react';
import { X } from 'lucide-react';
import './CreateThreadModal.css';
import threadService from '../services/thread.service';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultSpaceId?: number;
}

export default function CreateThreadModal({ isOpen, onClose, onSuccess, defaultSpaceId = 1 }: CreateThreadModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [spaceId, setSpaceId] = useState(defaultSpaceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await threadService.createThread({ 
        title, 
        spaceId,
        content 
      });
      
      // Reset form
      setTitle('');
      setContent('');
      
      // Close modal and refresh feed
      onSuccess();
    } catch (err) {
      console.error("Failed to create post", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Post</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {error && <div className="modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="space">Select Space</label>
            <select 
              id="space" 
              value={spaceId} 
              onChange={(e) => setSpaceId(Number(e.target.value))}
              className="form-input"
            >
              <option value={1}>General</option>
              <option value={2}>Technology</option>
              <option value={3}>Announcements</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input 
              type="text" 
              id="title"
              placeholder="Give your post a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content (Optional for now)</label>
            <textarea 
              id="content"
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input textarea"
              rows={5}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
