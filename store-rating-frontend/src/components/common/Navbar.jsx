import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  Chip
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = () => {
    if (!user) return 'default';
    switch (user.role) {
      case 'admin': return 'error';
      case 'store_owner': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleText = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return 'Admin';
      case 'store_owner': return 'Store Owner';
      case 'user': return 'User';
      default: return '';
    }
  };

  const userDisplayName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Rating System
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin-setup"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Admin Setup
                </Button>
              </>
            ) : (
              <>
                {/* Show user role and name */}
                <Chip
                  label={`${userDisplayName} (${getRoleText()})`}
                  color={getRoleColor()}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
                
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                
                {/* Normal User: Can browse and rate stores */}
                {isNormalUser() && (
                  <Button color="inherit" component={Link} to="/stores">
                    Browse Stores
                  </Button>
                )}
                
                {/* Admin: Can manage everything */}
                {isAdmin() && (
                  <>
                    <Button color="inherit" component={Link} to="/admin/dashboard">
                      Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/users">
                      Users
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/stores">
                      Stores
                    </Button>
                  </>
                )}
                
                {/* Store Owner: Can only view their store ratings */}
                {isStoreOwner() && (
                  <Button color="inherit" component={Link} to="/store-owner/ratings">
                    My Store Ratings
                  </Button>
                )}
                
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

               {/* {!user && (
  <>
    <Button color="inherit" component={Link} to="/login">
      Login
    </Button>
    <Button color="inherit" component={Link} to="/register">
      Register
    </Button>
    <Button color="inherit" component={Link} to="/admin-setup">
      Admin Setup
    </Button>
  </>
)} */}