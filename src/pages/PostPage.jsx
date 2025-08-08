// src/pages/PostPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // comments
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error.message);
      setPost(null);
    } else {
      setPost(data);
    }
    setLoading(false);
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fetch comments error:', error.message);
      setComments([]);
    } else {
      setComments(data || []);
    }
  }

  async function handleUpvote() {
    if (!post) return;
    // optimistic UI
    setPost((p) => ({ ...p, upvotes: (p?.upvotes || 0) + 1 }));
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: (post.upvotes || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(error.message);
      // revert if failed
      setPost((p) => ({ ...p, upvotes: (p?.upvotes || 1) - 1 }));
    } else {
      setPost(data);
    }
  }

  async function handleDelete() {
    const confirmDel = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDel) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error.message);
    else navigate('/');
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: text }])
      .select();

    if (error) {
      console.error('Add comment error:', error.message);
    } else if (data && data.length) {
      // append without a refetch for snappier UX
      setComments((prev) => [...prev, data[0]]);
      setComment('');
    }

    setSubmitting(false);
  }

  if (loading) return <div className="p-4 text-center">Loading post...</div>;
  if (!post) return <div className="p-4 text-center">Post not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      <p className="text-gray-500 mb-1">
        {/* Safe even if car fields are empty */}
        {[post.car_year, post.car_make, post.car_model].filter(Boolean).join(' ')}
        {` · ${new Date(post.created_at).toLocaleString()}`}
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full rounded shadow mb-4"
        />
      )}

      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="flex gap-4 items-center mb-6">
        <button onClick={handleUpvote} className="bg-green-600 text-white px-4 py-2 rounded">
          🔼 Upvote ({post.upvotes ?? 0})
        </button>
        <button onClick={() => navigate(`/edit/${post.id}`)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit Post
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Post
        </button>
      </div>

      {/* Comments */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 mb-3">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-2 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="border rounded p-2 bg-gray-100">
                <p className="text-sm">{c.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            className="w-full border rounded p-2 mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
