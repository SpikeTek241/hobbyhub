import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) console.error(error.message);
    else setPost(data);
    setLoading(false);
  }

  async function handleUpvote() {
    const { data, error } = await supabase.from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single();
    if (error) console.error(error.message);
    else setPost(data);
  }

  async function handleDelete() {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error.message);
    else navigate('/');
  }

  if (loading) return <div className="p-4 text-center">Loading post...</div>;
  if (!post) return <div className="p-4 text-center">Post not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-1">
        {post.car_year} {post.car_make} {post.car_model} · {new Date(post.created_at).toLocaleString()}
      </p>
      {post.image_url && <img src={post.image_url} alt="Car" className="w-full rounded shadow mb-4" />}
      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="flex gap-4 items-center mb-6">
        <button onClick={handleUpvote} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          🔼 Upvote ({post.upvotes})
        </button>
        <button onClick={() => navigate(`/edit/${post.id}`)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Post
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete Post
        </button>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Comments (coming soon)</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full border rounded p-2 mb-2"
        />
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">Submit Comment</button>
      </div>
    </div>
  );
}
