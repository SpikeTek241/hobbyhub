import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [orderBy, setOrderBy] = useState('created_at');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [orderBy]);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order(orderBy, { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  }

  async function handleUpvote(id, currentUpvotes) {
    const { error } = await supabase
    .from('posts')
    .update({ upvotes : currentlyUpvotes + 1 })
    .eq('id', id)

    if (error) {
      console.error('Upvote failed:', error.message);
    } else {
      fetchPosts();
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border px-2 py-1 rounded bg-[#1e1e1e] text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="border px-2 py-1 rounded bg-[#1e1e1e] text-white"
        >
          <option value="created_at">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center mt-8">
            No builds found. Be the first to create one!
          </p>
        ) : (
          filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <div className="border rounded p-4 shadow-md hover:shadow-xl transition duration-200 bg-[#1e1e1e] text-white">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Car"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h2 className="text-lg font-bold">{post.title}</h2>
                <p className="text-sm text-gray-400">
                  {post.car_year} {post.car_make} {post.car_model}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.created_at).toLocaleString()}
                </p>
                <button
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpvote(post.id, post.upvote);
                  }}
                  >
                    {post.upvotes} Upvotes
                  </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
