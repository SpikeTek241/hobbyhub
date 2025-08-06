// src/components/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">
        <Link to="/">OctaneNexus</Link>
      </h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create" className="hover:underline">Create Post</Link>
      </nav>
    </header>
  );
}
