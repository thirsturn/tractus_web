import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import threadService from '../services/thread.service';
import type { ThreadResponse } from '../types/thread.types';
import ThreadCard from '../components/ThreadCard';
import { Plus } from 'lucide-react';
import './SpaceFeedPage.css';

export default function SpaceFeedPage() {
  const { id } = useParams<{ id: string }>();
  // Default to Space 1 (General) if no space is provided in the URL (e.g. Home page)
  const activeSpaceId = id ? parseInt(id, 10) : 1;
  
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await threadService.getThreadsBySpace(activeSpaceId);
        setThreads(data);
      } catch (err: any) {
        setError("Failed to load threads for this space.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [activeSpaceId]);

  return (
    <div className="space-feed-container">
      <div className="feed-header">
        <div>
          <h1 className="feed-title">
            {activeSpaceId === 1 ? 'General' : 
             activeSpaceId === 2 ? 'Technology' : 
             activeSpaceId === 3 ? 'Announcements' : 'Space Feed'}
          </h1>
          <p className="feed-subtitle">Join the discussion</p>
        </div>
        
        <button className="create-thread-btn">
          <Plus size={18} />
          Create Post
        </button>
      </div>

      <div className="feed-content">
        {isLoading && <div className="loading-state">Loading discussions...</div>}
        
        {error && <div className="error-state">{error}</div>}
        
        {!isLoading && !error && threads.length === 0 && (
          <div className="empty-state">
            <p>No threads in this space yet.</p>
            <button className="create-thread-btn secondary">Be the first to post!</button>
          </div>
        )}
        
        {!isLoading && !error && threads.map(thread => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}
