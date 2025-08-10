import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const VideoIframe = styled.iframe`
  width: 100%;
  height: 480px;
  max-height: 720px;
  border: none;
  border-radius: 8px;
`;

const VideoError = styled.div`
  width: 100%;
  height: 480px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  font-size: 16px;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube watch URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null;
  };

  // Helper function to get Vimeo embed URL
  const getVimeoEmbedUrl = (url) => {
    if (!url) return null;
    
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return null;
  };

  // Helper function to check if URL is a direct video file
  const isDirectVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Helper function to determine video type
  const getVideoType = (url) => {
    if (!url) return 'unknown';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    
    if (isDirectVideoUrl(url)) {
      return 'direct';
    }
    
    return 'unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.error('Error fetching video data:', err);
        // You could set an error state here if needed
        // setError('Failed to load video');
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    if (!currentUser || !currentVideo) return;
    try {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };
  
  const handleDislike = async () => {
    if (!currentUser || !currentVideo) return;
    try {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error('Error disliking video:', err);
    }
  };

  const handleSub = async () => {
    if (!currentUser || !channel._id) return;
    try {
      currentUser.subscribedUsers?.includes(channel._id)
        ? await axios.put(`/users/unsub/${channel._id}`)
        : await axios.put(`/users/sub/${channel._id}`);
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error('Error subscribing/unsubscribing:', err);
    }
  };

  //TODO: DELETE VIDEO FUNCTIONALITY

  // Show loading state if video data is not yet loaded
  if (!currentVideo) {
    return (
      <Container>
        <Content>
          <div>Loading video...</div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <VideoWrapper>
          {(() => {
            const videoType = getVideoType(currentVideo.videoUrl);
            
            switch (videoType) {
              case 'youtube':
                return (
                  <VideoIframe
                    src={getYouTubeEmbedUrl(currentVideo.videoUrl)}
                    title={currentVideo.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                );
              
              case 'vimeo':
                return (
                  <VideoIframe
                    src={getVimeoEmbedUrl(currentVideo.videoUrl)}
                    title={currentVideo.title}
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                );
              
              case 'direct':
                return (
                  <VideoFrame
                    src={currentVideo.videoUrl}
                    controls
                    poster={currentVideo.imgUrl}
                    onError={(e) => {
                      console.log('Direct video failed to load:', currentVideo.videoUrl);
                    }}
                  />
                );
              
              default:
                return (
                  <VideoError>
                    <div>
                      <p>Unable to play this video format</p>
                      <p>Supported: YouTube, Vimeo, or direct video files (.mp4, .webm, etc.)</p>
                      <p>URL: {currentVideo.videoUrl}</p>
                    </div>
                  </VideoError>
                );
            }
          })()}
        </VideoWrapper>
        <Title>{currentVideo.title || 'Untitled Video'}</Title>
        <Details>
          <Info>
            {currentVideo.views || 0} views • {currentVideo.createdAt ? format(currentVideo.createdAt) : 'Unknown date'}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length || 0}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name || 'Unknown Channel'}</ChannelName>
              <ChannelCounter>{channel.subscribers || 0} subscribers</ChannelCounter>
              <Description>{currentVideo.desc || 'No description available'}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags || []} />
    </Container>
  );
};

export default Video;
