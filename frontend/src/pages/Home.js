import React, {useEffect, useState} from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
export default function Home(){
  const [courses,setCourses] = useState([]);
  const nav = useNavigate();
  useEffect(()=>{ API.get('/courses').then(r=>setCourses(r.data)); },[]);
  return (
    <div className="container mt-4">
      <h1>Available Courses</h1>
      <div className="list-group">
        {courses.map(c=>(
          <button key={c._id} className="list-group-item list-group-item-action" onClick={()=>nav('/course/'+c._id)}>
            <div className="d-flex justify-content-between"><div>{c.title}</div><small>{c.language}</small></div>
          </button>
        ))}
      </div>
    </div>
  );
}
