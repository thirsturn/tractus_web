import { useParams } from 'react-router-dom';

export default function UserProfilePage() {
  const { username } = useParams();

  return (
    <div>
      <h2>{username}'s Profile</h2>
      <p>This is where account details, settings, and user history will go for {username}!</p>
    </div>
  )
}
