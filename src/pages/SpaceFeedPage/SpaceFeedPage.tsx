import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import threadService from '../../services/thread.service';
import type { ThreadResponse } from '../../types/thread.types';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import CreateThreadModal from '../../components/CreateThreadModal/CreateThreadModal';
import { Plus } from 'lucide-react';
import './SpaceFeedPage.css';

const MOCK_HOME_THREADS: ThreadResponse[] = [
  { id: 201, title: 'Welcome to Tractus! Introduce yourself here 👋', spaceId: 1, author: { id: 10, username: 'CommunityManager', email: 'cm@test.com' } },
  { id: 202, title: 'What are you working on this weekend?', spaceId: 1, author: { id: 11, username: 'WeekendWarrior', email: 'ww@test.com' } },
  { id: 203, title: 'Tips for transitioning from frontend to full-stack?', spaceId: 1, author: { id: 12, username: 'ReactDev123', email: 'react@test.com' } },
  { id: 204, title: 'Has anyone tried the new Vite build tools?', spaceId: 1, author: { id: 13, username: 'SpeedCoder', email: 'speed@test.com' } }
];

export default function SpaceFeedPage() {
  const { id } = useParams<{ id: string }>();
  // Default to Space 1 (General) if no space is provided in the URL (e.g. Home page)
  const activeSpaceId = id ? parseInt(id, 10) : 1;
  
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchThreads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await threadService.getThreadsBySpace(activeSpaceId);
      // If the backend is running but empty, show mock data anyway for UI purposes
      if (data && data.length > 0) {
        setThreads(data);
      } else {
        setThreads(MOCK_HOME_THREADS);
      }
    } catch (err: any) {
      // Fallback to mock data if the backend is down
      console.log("Backend not available, falling back to mock data for Home Feed.");
      setThreads(MOCK_HOME_THREADS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [activeSpaceId]);

  return (
    <div className="space-feed-container">
      <div className="feed-header">
        <div>
          <h1 className="feed-title">Home Feed</h1>
          <p className="feed-subtitle">Join the discussion</p>
        </div>
        
        <button className="create-thread-btn" onClick={() => setIsModalOpen(true)}>
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
            <button className="create-thread-btn secondary" onClick={() => setIsModalOpen(true)}>Be the first to post!</button>
          </div>
        )}
        
        {!isLoading && !error && threads.map(thread => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      <CreateThreadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          fetchThreads();
        }}
        defaultSpaceId={activeSpaceId}
      />
    </div>
  );
}
