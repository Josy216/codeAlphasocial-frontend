import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;
const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const Label = styled.label`
  font-size: 14px;
`;
const Upload = ({ setOpen }) => {
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };



  const handleUpload = async (e)=>{
    e.preventDefault();
    try {
      // Check if required fields are present
      if (!inputs.title || !inputs.desc || !inputs.videoUrl || !inputs.imgUrl) {
        alert("Please fill in all required fields including video URL and image URL");
        return;
      }

      const res = await axios.post("/videos", {...inputs, tags}, {
        withCredentials: true, // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setOpen(false);
      if (res.status === 200 || res.status === 201) {
        navigate(`/video/${res.data._id}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.status === 401) {
        alert("Please sign in to upload videos");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert("Upload failed: " + (error.response?.data?.message || error.message));
      }
    }
  }

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Video URL:</Label>
        <Input
          type="url"
          placeholder="Enter video URL (e.g., YouTube, Vimeo, direct video link)"
          name="videoUrl"
          onChange={handleChange}
        />
        <Label>Thumbnail Image URL:</Label>
        <Input
          type="url"
          placeholder="Enter image URL for video thumbnail"
          name="imgUrl"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
