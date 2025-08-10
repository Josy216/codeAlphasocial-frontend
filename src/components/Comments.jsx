import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const CommentButton = styled.button`
  background-color: #065fd4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 18px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  
  &:hover {
    background-color: #0553c2;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Comments = ({videoId}) => {

  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/comments/${videoId}`);
        // Ensure we always set an array
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      await submitComment();
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    
    if (!currentUser) {
      alert('Please sign in to comment');
      return;
    }
    
    try {
      const res = await axios.post(`/comments`, {
        desc: newComment,
        videoId: videoId
      });
      
      // Add the new comment to the list
      setComments(prev => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    }
  };

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img} />
        <Input 
          placeholder="Add a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleAddComment}
        />
        <CommentButton 
          onClick={submitComment}
          disabled={!newComment.trim() || !currentUser}
        >
          Comment
        </CommentButton>
      </NewComment>
      {loading ? (
        <div>Loading comments...</div>
      ) : error ? (
        <div>Error loading comments</div>
      ) : comments && comments.length > 0 ? (
        comments.map(comment=>(
          <Comment key={comment._id} comment={comment}/>
        ))
      ) : (
        <div>No comments yet</div>
      )}
    </Container>
  );
};

export default Comments;
