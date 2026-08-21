import { useState, useEffect, useMemo } from 'react';
import { Search, Flame } from 'lucide-react';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import spaceService from '../../services/space.service';
import threadService from '../../services/thread.service';
import voteService from '../../services/vote.service';
import type { ThreadResponse } from '../../types/thread.types';
import './ExplorePage.css';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const spaces = await spaceService.getAllSpaces();
        const threadsBySpace = await Promise.all(
          spaces.map(space => threadService.getThreadsBySpace(space.id))
        );
        const allThreads = threadsBySpace.flat();

        const netVotes = await Promise.all(
          allThreads.map(async thread => {
            const votes = await voteService.getThreadVotes(thread.id);
            const up = votes.filter(v => v.voteType === 'UP').length;
            const down = votes.filter(v => v.voteType === 'DOWN').length;
            return up - down;
          })
        );

        const sorted = allThreads
          .map((thread, idx) => ({ thread, votes: netVotes[idx] }))
          .sort((a, b) => b.votes - a.votes)
          .map(entry => entry.thread);

        setThreads(sorted);
      } catch (err) {
        console.error('Failed to load trending threads', err);
        setError('Failed to load trending threads from the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const displayThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;
    return threads.filter(thread =>
      thread.title.toLowerCase().includes(query) ||
      (thread.content || '').toLowerCase().includes(query)
    );
  }, [threads, searchQuery]);

  return (
    <div className="explore-container">
      <div className="explore-main">
        {/* Search Hub */}
        <section className="search-hub">
          <div className="search-hub-header">
            <h1>Explore Tractus</h1>
            <p>Search for discussions by title or content.</p>
          </div>

          <div className="search-hub-input-container">
            <Search className="search-hub-icon" size={20} />
            <input
              type="text"
              className="search-hub-input"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Trending Threads */}
        <section className="trending-section">
          <div className="trending-tabs">
            <span className="trending-tab active">
              <Flame size={18} /> Trending Threads
            </span>
          </div>

          {isLoading && <div className="explore-status">Loading trending threads...</div>}
          {error && <div className="explore-status error">{error}</div>}

          {!isLoading && !error && displayThreads.length === 0 && (
            <div className="explore-status">No threads found.</div>
          )}

          <div className="trending-feed">
            {!isLoading && !error && displayThreads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
