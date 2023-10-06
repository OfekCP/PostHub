import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './NavBar/NavBar';
import Login from './Authentication/Login';
import Registration from './Authentication/Registration';
import Blog from './Blog/Blog';
import Profile from './Profile/Profile';
import { useUser } from './Authentication/UserContext';
import Home from './HomePage/Home'
import LikedPost from './Profile/LikedPost'
import PostDetails from './HomePage/PostDetails';
function App() {
  const { user, username } = useUser();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path='/add-blog' element={<Blog user={user} />} />
        <Route path='profile' element={user && user.username ? <Profile user={user} /> : <div>Loading...</div>} />
        <Route path='/profile/likedpost' element={<LikedPost user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
