import { useParams } from 'react-router-dom';

export default function ThreadDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Thread Details (ID: {id})</h2>
      <p>This is where the thread content and comments will go!</p>
    </div>
  )
}
