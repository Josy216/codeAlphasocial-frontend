import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import Upload from "./Upload";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};

`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
  cursor: pointer;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      dispatch(logout());
      navigate('/');
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, clear the local state
      dispatch(logout());
      navigate('/');
      setShowDropdown(false);
    }
  };

  const handleSearch = () => {
    if (q.trim()) {
      navigate(`/search?q=${q}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }; 
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchOutlinedIcon onClick={handleSearch}/>
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
              <Avatar 
                src={currentUser.img} 
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {currentUser.name}
              {showDropdown && (
                <UserDropdown ref={dropdownRef}>
                  <DropdownItem onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                  </DropdownItem>
                </UserDropdown>
              )}
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
