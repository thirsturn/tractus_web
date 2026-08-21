import { useState, useEffect, useMemo } from 'react';
import { Search, Flame, Users, Hash, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import spaceService from '../../services/space.service';
import threadService from '../../services/thread.service';
import userService from '../../services/user.service';
import voteService from '../../services/vote.service';
import type { ThreadResponse } from '../../types/thread.types';
import type { User } from '../../types/auth.types';
import type { SpaceResponse } from '../../types/space.types';
import { getImageUrl } from '../../utils/imageUrl';
import './ExplorePage.css';

type SearchCategory = 'threads' | 'users' | 'topics';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchCategory>('threads');
  
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<SpaceResponse[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExploreData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedSpaces, fetchedUsers] = await Promise.all([
          spaceService.getAllSpaces(),
          userService.getAllUsers().catch(() => [] as User[])
        ]);
        setSpaces(fetchedSpaces);
        setUsers(fetchedUsers);

        const threadsBySpace = await Promise.all(
          fetchedSpaces.map(space => threadService.getThreadsBySpace(space.id))
        );
        const allThreads = threadsBySpace.flat();

        const netVotes = await Promise.all(
          allThreads.map(async thread => {
            const votes = await voteService.getThreadVotes(thread.id).catch(() => []);
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
        console.error('Failed to load explore data', err);
        setError('Failed to load explore data from the server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExploreData();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  // Filtered Results
  const filteredThreads = useMemo(() => {
    if (!query) return threads;
    return threads.filter(thread =>
      thread.title.toLowerCase().includes(query) ||
      (thread.content || '').toLowerCase().includes(query)
    );
  }, [threads, query]);

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter(u =>
      u.username.toLowerCase().includes(query) ||
      (u.bio || '').toLowerCase().includes(query) ||
      (u.firstName || '').toLowerCase().includes(query) ||
      (u.lastName || '').toLowerCase().includes(query)
    );
  }, [users, query]);

  const filteredTopics = useMemo(() => {
    if (!query) return spaces;
    return spaces.filter(space =>
      space.name.toLowerCase().includes(query) ||
      (space.description || '').toLowerCase().includes(query)
    );
  }, [spaces, query]);

  // Topic thread counts map
  const topicThreadCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    threads.forEach(t => {
      if (t.spaceId) {
        map[t.spaceId] = (map[t.spaceId] || 0) + 1;
      }
    });
    return map;
  }, [threads]);

  return (
    <div className="explore-container">
      <div className="explore-main">
        {/* Search Hub */}
        <section className="search-hub">
          <div className="search-hub-header">
            <h1>Explore Tractus</h1>
            <p>Search for discussions, user accounts, or topics.</p>
          </div>

          <div className="search-hub-input-container">
            <Search className="search-hub-icon" size={20} />
            <input
              type="text"
              className="search-hub-input"
              placeholder="Search threads, users, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Explore / Filter Tabs */}
        <section className="trending-section">
          <div className="explore-tabs">
            <button
              className={`explore-tab-btn ${activeTab === 'threads' ? 'active' : ''}`}
              onClick={() => setActiveTab('threads')}
            >
              {query ? <MessageSquare size={16} /> : <Flame size={16} />}
              <span>{query ? 'Discussions' : 'Trending Threads'}</span>
              <span className="explore-tab-badge">{filteredThreads.length}</span>
            </button>

            <button
              className={`explore-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={16} />
              <span>Accounts</span>
              <span className="explore-tab-badge">{filteredUsers.length}</span>
            </button>

            <button
              className={`explore-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
              onClick={() => setActiveTab('topics')}
            >
              <Hash size={16} />
              <span>Topics</span>
              <span className="explore-tab-badge">{filteredTopics.length}</span>
            </button>
          </div>

          {isLoading && <div className="explore-status">Loading explore items...</div>}
          {error && <div className="explore-status error">{error}</div>}

          {/* TAB 1: THREADS */}
          {!isLoading && !error && activeTab === 'threads' && (
            <div className="trending-feed">
              {filteredThreads.length === 0 ? (
                <div className="explore-status">No discussions found matching "{searchQuery}".</div>
              ) : (
                filteredThreads.map(thread => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))
              )}
            </div>
          )}

          {/* TAB 2: USER ACCOUNTS */}
          {!isLoading && !error && activeTab === 'users' && (
            <div className="user-results-grid">
              {filteredUsers.length === 0 ? (
                <div className="explore-status" style={{ gridColumn: '1 / -1' }}>
                  No user accounts found matching "{searchQuery}".
                </div>
              ) : (
                filteredUsers.map(u => (
                  <Link key={u.id} to={`/profile/${u.username}`} className="user-card">
                    <div className="user-card-avatar">
                      {u.profileImageUrl ? (
                        <img src={getImageUrl(u.profileImageUrl)} alt={u.username} />
                      ) : (
                        u.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="user-card-info">
                      <h4 className="user-card-name">@{u.username}</h4>
                      <p className="user-card-bio">{u.bio || 'No bio available'}</p>
                    </div>
                    <span className="user-card-btn">View</span>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* TAB 3: TOPICS (SPACES) */}
          {!isLoading && !error && activeTab === 'topics' && (
            <div className="topic-results-list">
              {filteredTopics.length === 0 ? (
                <div className="explore-status">No topics found matching "{searchQuery}".</div>
              ) : (
                filteredTopics.map(topic => (
                  <div 
                    key={topic.id} 
                    className="topic-card"
                    onClick={() => {
                      setSearchQuery(topic.name);
                      setActiveTab('threads');
                    }}
                  >
                    <div className="topic-card-left">
                      <div className="topic-card-icon">#</div>
                      <div>
                        <h3 className="topic-card-name">{topic.name}</h3>
                        <p className="topic-card-desc">{topic.description || 'General discussion space'}</p>
                      </div>
                    </div>
                    <span className="topic-card-count">
                      {topicThreadCountMap[topic.id] || 0} discussions
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
