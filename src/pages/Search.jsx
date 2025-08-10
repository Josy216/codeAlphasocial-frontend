import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/videos/search${query}`);
        // Ensure we always set an array
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [query]);

  if (loading) {
    return <Container>Loading search results...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return <Container>
    {videos && videos.length > 0 ? (
      videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))
    ) : (
      <div>No videos found</div>
    )}
  </Container>;
};

export default Search;
