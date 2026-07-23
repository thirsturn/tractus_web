import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, LinkIcon, Edit3, Save, X, MessageSquare, Camera } from 'lucide-react';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import userService from '../../services/user.service';
import type { User } from '../../types/auth.types';
import type { ThreadResponse } from '../../types/thread.types';
import './UserProfilePage.css';

// Mock user posts (fallback when backend is down)
const MOCK_USER_POSTS: ThreadResponse[] = [
  { id: 301, title: 'My experience building a full-stack app with Spring Boot and React', spaceId: 1, author: { id: 1, username: 'user', email: 'user@test.com' } },
  { id: 302, title: 'Best VS Code extensions for Java developers in 2026', spaceId: 2, author: { id: 1, username: 'user', email: 'user@test.com' } },
  { id: 303, title: 'How I improved my API response times by 300%', spaceId: 1, author: { id: 1, username: 'user', email: 'user@test.com' } },
];

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: authUser } = useAuth();
  const isOwnProfile = authUser?.username === username;

  // Profile state
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  // Temporary edit values
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getUserByUsername(username || '');
        setProfileUser(data);
        setBio(data.bio || '');
        setLocation(data.location || '');
        setWebsite(data.website || '');
      } catch {
        // Fallback to auth context data if backend is down
        console.log('Backend not available, using local auth data for profile.');
        if (authUser) {
          setProfileUser(authUser);
          setBio(authUser.bio || 'Passionate developer and community contributor.');
          setLocation(authUser.location || 'San Francisco, CA');
          setWebsite(authUser.website || 'https://tractus.dev');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username, authUser]);

  const startEditing = () => {
    setEditBio(bio);
    setEditLocation(location);
    setEditWebsite(website);
    setIsEditing(true);
  };

  const saveProfile = async () => {
    if (!profileUser) return;
    try {
      const updatedUser = await userService.updateUser(profileUser.id, {
        bio: editBio,
        location: editLocation,
        website: editWebsite,
      });
      setBio(updatedUser.bio || editBio);
      setLocation(updatedUser.location || editLocation);
      setWebsite(updatedUser.website || editWebsite);
    } catch {
      // If backend is down, just update locally
      console.log('Backend not available, saving profile locally.');
      setBio(editBio);
      setLocation(editLocation);
      setWebsite(editWebsite);
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileUser) return;
    
    setIsUploadingAvatar(true);
    try {
      const updatedUser = await userService.uploadAvatar(profileUser.id, file);
      setProfileUser(updatedUser);
      // Optional: Refresh local auth state if it's the logged-in user
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Update mock posts to use the viewed username
  const userPosts = MOCK_USER_POSTS.map(post => ({
    ...post,
    author: { ...post.author, username: username || 'user' }
  }));

  if (isLoading) {
    return <div className="profile-container"><div className="loading-state">Loading profile...</div></div>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-banner"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {profileUser?.profileImageUrl ? (
                <img src={profileUser.profileImageUrl} alt={`${username}'s avatar`} className="avatar-image" />
              ) : (
                (username || 'U').charAt(0).toUpperCase()
              )}
            </div>
            {isOwnProfile && isEditing && (
              <button 
                className="avatar-upload-btn" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                <Camera size={18} />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*"
              style={{ display: 'none' }} 
            />
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
              <p className="profile-bio">{bio || 'No bio yet.'}</p>
            )}

            <div className="profile-meta-row">
              <span className="meta-item">
                <Mail size={14} /> {profileUser?.email || `${username}@tractus.dev`}
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
                location && <span className="meta-item"><MapPin size={14} /> {location}</span>
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
                website && (
                  <span className="meta-item link">
                    <LinkIcon size={14} /> 
                    <a href={website} target="_blank" rel="noreferrer">{website}</a>
                  </span>
                )
              )}
              <span className="meta-item">
                <Calendar size={14} /> Joined July 2026
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-row">
          <div className="stat-block">
            <span className="stat-number">{userPosts.length}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">{profileUser?.followerCount ?? 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">{profileUser?.followingCount ?? 0}</span>
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
