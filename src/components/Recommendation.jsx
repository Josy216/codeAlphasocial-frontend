import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no tags or empty tags, fetch random videos instead
        if (!tags || tags.length === 0) {
          const res = await axios.get(`/videos/random`);
          setVideos(Array.isArray(res.data) ? res.data : []);
        } else {
          // Convert tags array to comma-separated string
          const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
          const res = await axios.get(`/videos/tags?tags=${tagsString}`);
          setVideos(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
        // Fallback to random videos if tag-based recommendations fail
        try {
          const res = await axios.get(`/videos/random`);
          setVideos(Array.isArray(res.data) ? res.data : []);
        } catch (fallbackErr) {
          console.error("Error fetching fallback videos:", fallbackErr);
          setVideos([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [tags]);

  if (loading) {
    return <Container>Loading recommendations...</Container>;
  }

  if (error) {
    return <Container>Error loading recommendations</Container>;
  }

  return (
    <Container>
      {videos && videos.length > 0 ? (
        videos.map((video) => (
          <Card type="sm" key={video._id} video={video} />
        ))
      ) : (
        <div>No recommendations available</div>
      )}
    </Container>
  );
};

export default Recommendation;
