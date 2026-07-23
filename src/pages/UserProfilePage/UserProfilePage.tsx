import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Mail, Calendar, MapPin, LinkIcon, Edit3, Save, X, MessageSquare } from 'lucide-react';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import type { ThreadResponse } from '../../types/thread.types';
import './UserProfilePage.css';

// Mock profile data (will be fetched from backend later)
const MOCK_PROFILES: Record<string, { bio: string; location: string; website: string; joinedDate: string; postsCount: number; followersCount: number; followingCount: number }> = {
  default: {
    bio: 'Passionate developer and community contributor. Love discussing tech, open source, and building cool things.',
    location: 'San Francisco, CA',
    website: 'https://tractus.dev',
    joinedDate: 'July 2026',
    postsCount: 24,
    followersCount: 142,
    followingCount: 89,
  }
};

// Mock user posts
const MOCK_USER_POSTS: ThreadResponse[] = [
  { id: 301, title: 'My experience building a full-stack app with Spring Boot and React', spaceId: 1, author: { id: 1, username: 'user', email: 'user@test.com' } },
  { id: 302, title: 'Best VS Code extensions for Java developers in 2026', spaceId: 2, author: { id: 1, username: 'user', email: 'user@test.com' } },
  { id: 303, title: 'How I improved my API response times by 300%', spaceId: 1, author: { id: 1, username: 'user', email: 'user@test.com' } },
];

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const isOwnProfile = user?.username === username;

  const profileData = MOCK_PROFILES['default'];

  // Editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profileData.bio);
  const [location, setLocation] = useState(profileData.location);
  const [website, setWebsite] = useState(profileData.website);

  // Temporary edit values
  const [editBio, setEditBio] = useState(bio);
  const [editLocation, setEditLocation] = useState(location);
  const [editWebsite, setEditWebsite] = useState(website);

  const startEditing = () => {
    setEditBio(bio);
    setEditLocation(location);
    setEditWebsite(website);
    setIsEditing(true);
  };

  const saveProfile = () => {
    setBio(editBio);
    setLocation(editLocation);
    setWebsite(editWebsite);
    setIsEditing(false);
    // TODO: Call backend API to persist changes
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  // Update mock posts to use the viewed username
  const userPosts = MOCK_USER_POSTS.map(post => ({
    ...post,
    author: { ...post.author, username: username || 'user' }
  }));

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-banner"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {(username || 'U').charAt(0).toUpperCase()}
          </div>
          
          <div className="profile-header-info">
            <div className="profile-name-row">
              <h1>{username}</h1>
              {isOwnProfile && !isEditing && (
                <button className="edit-profile-btn" onClick={startEditing}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
              {isOwnProfile && isEditing && (
                <div className="edit-actions">
                  <button className="save-btn" onClick={saveProfile}>
                    <Save size={16} /> Save
                  </button>
                  <button className="cancel-btn" onClick={cancelEditing}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                className="edit-bio-input"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write a bio..."
                rows={3}
              />
            ) : (
              <p className="profile-bio">{bio}</p>
            )}

            <div className="profile-meta-row">
              <span className="meta-item">
                <Mail size={14} /> {user?.email || `${username}@tractus.dev`}
              </span>
              {isEditing ? (
                <span className="meta-item editable">
                  <MapPin size={14} />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Location"
                  />
                </span>
              ) : (
                <span className="meta-item">
                  <MapPin size={14} /> {location}
                </span>
              )}
              {isEditing ? (
                <span className="meta-item editable">
                  <LinkIcon size={14} />
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="Website URL"
                  />
                </span>
              ) : (
                <span className="meta-item link">
                  <LinkIcon size={14} /> 
                  <a href={website} target="_blank" rel="noreferrer">{website}</a>
                </span>
              )}
              <span className="meta-item">
                <Calendar size={14} /> Joined {profileData.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-row">
          <div className="stat-block">
            <span className="stat-number">{profileData.postsCount}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">{profileData.followersCount}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">{profileData.followingCount}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <section className="profile-posts-section">
        <h2><MessageSquare size={20} /> Recent Posts</h2>
        <div className="profile-posts-list">
          {userPosts.map(post => (
            <ThreadCard key={post.id} thread={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
