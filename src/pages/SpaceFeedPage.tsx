import { useParams } from 'react-router-dom';

export default function SpaceFeedPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Space Feed {id ? `(ID: ${id})` : '(Home)'}</h2>
      <p>This is where the list of threads will go!</p>
    </div>
  )
}
