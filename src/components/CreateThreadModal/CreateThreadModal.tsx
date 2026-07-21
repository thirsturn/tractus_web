import { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import './CreateThreadModal.css';
import threadService from '../../services/thread.service';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultSpaceId?: number;
}

export default function CreateThreadModal({ isOpen, onClose, onSuccess, defaultSpaceId = 1 }: CreateThreadModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [spaceId] = useState(defaultSpaceId);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // NOTE: We don't save the actual file into state yet since the API doesn't support it,
      // we just create the preview URL for the UI!
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      // NOTE: We are currently only sending JSON to the backend. 
      // The imageFile is ignored in this API call until the backend is updated to support MultipartFormData!
      await threadService.createThread({ 
        title, 
        spaceId,
        content 
      });
      
      // Reset form
      setTitle('');
      setContent('');
      removeImage();
      
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
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="image-upload-section">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
              disabled={isSubmitting}
            />
            
            {!imagePreview ? (
              <button 
                type="button" 
                className="btn-add-image" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImageIcon size={18} />
                Attach an Image
              </button>
            ) : (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button 
                  type="button" 
                  className="btn-remove-image" 
                  onClick={removeImage}
                  disabled={isSubmitting}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
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
