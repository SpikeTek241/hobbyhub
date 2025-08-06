import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    car_make: '',
    car_model: '',
    car_year: ''
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) console.error(error.message);
    else {
      setPost(data);
      setFormData({
        title: data.title,
        content: data.content,
        image_url: data.image_url,
        car_make: data.car_make,
        car_model: data.car_model,
        car_year: data.car_year
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts')
      .update({
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        car_make: formData.car_make,
        car_model: formData.car_model,
        car_year: parseInt(formData.car_year)
      })
      .eq('id', id);

    if (error) console.error(error.message);
    else navigate(`/post/${id}`);
  }

  if (!post) return <div className="p-4">Loading post...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required />
        <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Content" rows="4" />
        <input type="text" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Image URL" />
        <input type="text" value={formData.car_make} onChange={(e) => setFormData({ ...formData, car_make: e.target.value })} placeholder="Car Make" />
        <input type="text" value={formData.car_model} onChange={(e) => setFormData({ ...formData, car_model: e.target.value })} placeholder="Car Model" />
        <input type="number" value={formData.car_year} onChange={(e) => setFormData({ ...formData, car_year: e.target.value })} placeholder="Car Year" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Post</button>
      </form>
    </div>
  );
}
