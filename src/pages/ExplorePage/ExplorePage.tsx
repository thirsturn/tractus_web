import { useState } from 'react';
import { Search, TrendingUp, Flame, Hash, User as UserIcon } from 'lucide-react';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import type { ThreadResponse } from '../../types/thread.types';
import './ExplorePage.css';

const TRENDING_THREADS: ThreadResponse[] = [];
const RELATED_THREADS: ThreadResponse[] = [];


const POPULAR_TAGS = ['#technology', '#announcements', '#general', '#react', '#springboot', '@admin'];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'related'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const displayThreads = activeTab === 'trending' ? TRENDING_THREADS : RELATED_THREADS;

  return (
    <div className="explore-container">
      <div className="explore-main">
        {/* Advanced Search Hub */}
        <section className="search-hub">
          <div className="search-hub-header">
            <h1>Explore Tractus</h1>
            <p>Search for discussions, users, and trending topics.</p>
          </div>
          
          <div className="search-hub-input-container">
            <Search className="search-hub-icon" size={20} />
            <input 
              type="text" 
              className="search-hub-input" 
              placeholder="Search by topic, user, or keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="search-hub-tags">
            {POPULAR_TAGS.map(tag => (
              <button 
                key={tag} 
                className={`tag-pill ${tag.startsWith('@') ? 'user-tag' : ''}`}
                onClick={() => setSearchQuery(tag)}
              >
                {tag.startsWith('@') ? <UserIcon size={14} /> : <Hash size={14} />}
                {tag.replace(/[@#]/, '')}
              </button>
            ))}
          </div>
        </section>

        {/* Trending Threads */}
        <section className="trending-section">
          <div className="trending-tabs">
            <button 
              className={`trending-tab ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <Flame size={18} /> Trending Topics
            </button>
            <button 
              className={`trending-tab ${activeTab === 'related' ? 'active' : ''}`}
              onClick={() => setActiveTab('related')}
            >
              <TrendingUp size={18} /> Related to You
            </button>
          </div>
          
          <div className="trending-feed">
            {displayThreads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
