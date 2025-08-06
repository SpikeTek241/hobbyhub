import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    car_make: '',
    car_model: '',
    car_year: '',
    upvotes: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('posts').insert([formData]);

    if (error) {
      console.error('Insert error:', error.message);
      alert('Post failed to save.');
    } else {
      alert('Post created!');
      navigate('/');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          name="content"
          placeholder="Describe your build..."
          value={formData.content}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="car_make"
          placeholder="Car Make"
          value={formData.car_make}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="car_model"
          placeholder="Car Model"
          value={formData.car_model}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          name="car_year"
          placeholder="Car Year"
          value={formData.car_year}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
