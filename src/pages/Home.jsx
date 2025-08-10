import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/videos/${type}`);
        // Ensure we always set an array
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [type]);

  if (loading) {
    return <Container>Loading videos...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      {videos && videos.length > 0 ? (
        videos.map((video) => (
          <Card key={video._id} video={video}/>
        ))
      ) : (
        <div>No videos available</div>
      )}
    </Container>
  );
};

export default Home;
