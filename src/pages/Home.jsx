import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [sortOption]);

  async function fetchPosts() {
    let query = supabase.from('posts').select('*');

    if (sortOption === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortOption === 'popular') {
      query = query.order('upvotes', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="app-title">Welcome To OctaneNexus</h1>

        <div className="nav-controls">
          <input
            type="text"
            placeholder="Search posts"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link to="/create" className="create-link">Create New Post</Link>
        </div>

        <div className="sort-buttons">
          <button
            className={sortOption === 'newest' ? 'active' : ''}
            onClick={() => setSortOption('newest')}
          >
            Newest
          </button>
          <button
            className={sortOption === 'popular' ? 'active' : ''}
            onClick={() => setSortOption('popular')}
          >
            Most Popular
          </button>
        </div>
      </div>

      {filteredPosts.map((post) => (
        <Link key={post.id} to={`/post/${post.id}`} className="post-card">
          <h2>{post.title}</h2>
          <p>{new Date(post.created_at).toLocaleString()}</p>
          <p>{post.upvotes} upvotes</p>
        </Link>
      ))}
    </div>
  );
}