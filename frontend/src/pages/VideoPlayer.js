import { useParams } from "react-router-dom";
import API from "../api";
import { useEffect, useState } from "react";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    API.get(`/courses/video/${id}`)
      .then(res => setVideo(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!video) return <p className="text-white">Loading...</p>;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <iframe
        src={video.videoUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
