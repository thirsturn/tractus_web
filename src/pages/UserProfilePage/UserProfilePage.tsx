import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, LinkIcon, Edit3, Save, X, MessageSquare, Camera, Lock, UserPlus, UserCheck } from 'lucide-react';
import ThreadCard from '../../components/ThreadCard/ThreadCard';
import userService from '../../services/user.service';
import threadService from '../../services/thread.service';
import type { User } from '../../types/auth.types';
import type { ThreadResponse } from '../../types/thread.types';
import './UserProfilePage.css';



export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: authUser, updateAuthUser } = useAuth();
  const isOwnProfile = authUser?.username === username;

  // Profile state
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [userPosts, setUserPosts] = useState<ThreadResponse[]>([]);

  // Editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  // Temporary edit values
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editCurrentPassword, setEditCurrentPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');

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
        console.error('Failed to load profile from backend.');
        if (authUser) {
          setProfileUser(authUser);
          setBio(authUser.bio || '');
          setLocation(authUser.location || '');
          setWebsite(authUser.website || '');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();

    threadService.getThreadsByUser(username || '')
      .then(posts => {
        const sorted = posts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return (dateB - dateA) || (b.id - a.id);
        });
        setUserPosts(sorted);
      })
      .catch(err => console.error('Failed to load user posts', err));
  }, [username, authUser]);

  const startEditing = () => {
    setEditBio(bio);
    setEditLocation(location);
    setEditWebsite(website);
    setEditCurrentPassword('');
    setEditPassword('');
    setError(null);
    setIsEditing(true);
  };

  const saveProfile = async () => {
    if (!profileUser) return;
    setError(null);
    
    if (editPassword && !editCurrentPassword) {
      setError("Please enter your current password to set a new password.");
      return;
    }
    try {
      const updatedUser = await userService.updateUser(profileUser.id, {
        bio: editBio,
        location: editLocation,
        website: editWebsite,
        currentPassword: editCurrentPassword,
        password: editPassword,
      });
      setBio(updatedUser.bio || editBio);
      setLocation(updatedUser.location || editLocation);
      setWebsite(updatedUser.website || editWebsite);
      setProfileUser(updatedUser);
      if (isOwnProfile) {
        updateAuthUser(updatedUser);
      }
      setIsEditing(false);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Current password is incorrect.");
        return;
      }
      // If backend is down, just update locally
      console.log('Backend not available or other error, saving profile locally.');
      setBio(editBio);
      setLocation(editLocation);
      setWebsite(editWebsite);
      
      const updatedLocalUser = { ...profileUser, bio: editBio, location: editLocation, website: editWebsite };
      setProfileUser(updatedLocalUser);
      if (isOwnProfile) {
        updateAuthUser(updatedLocalUser);
      }
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileUser) return;
    
    setIsUploadingAvatar(true);
    try {
      const updatedUser = await userService.uploadAvatar(profileUser.id, file);
      setProfileUser(updatedUser);
      if (isOwnProfile) {
        updateAuthUser(updatedUser);
      }
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileUser || !username || isFollowPending) return;
    setIsFollowPending(true);
    try {
      if (profileUser.following) {
        await userService.unfollowUser(username);
        setProfileUser({ ...profileUser, following: false, followerCount: Math.max(0, (profileUser.followerCount ?? 1) - 1) });
      } else {
        await userService.followUser(username);
        setProfileUser({ ...profileUser, following: true, followerCount: (profileUser.followerCount ?? 0) + 1 });
      }
    } catch (err) {
      console.error('Failed to update follow status', err);
    } finally {
      setIsFollowPending(false);
    }
  };

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
              {!isOwnProfile && authUser && (
                <button
                  className={`follow-btn ${profileUser?.following ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  disabled={isFollowPending}
                >
                  {profileUser?.following ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  {profileUser?.following ? 'Following' : 'Follow'}
                </button>
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

            {error && <div className="error-message" style={{ color: 'red', fontSize: '0.875rem', marginBottom: '8px' }}>{error}</div>}

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
              {isEditing && (
                <>
                  <span className="meta-item editable">
                    <Lock size={14} />
                    <input
                      type="password"
                      value={editCurrentPassword}
                      onChange={(e) => setEditCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      autoComplete="new-password"
                    />
                  </span>
                  <span className="meta-item editable">
                    <Lock size={14} />
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="New password"
                      autoComplete="new-password"
                    />
                  </span>
                </>
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
