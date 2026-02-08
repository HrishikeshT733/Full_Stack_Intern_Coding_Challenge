import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  Store as StoreIcon,
  PersonOutline as UserIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, loading, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (loading || !userData) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const roleColor = {
    admin: 'error',
    user: 'primary',
    store_owner: 'warning'
  };

  const roleIcon = {
    admin: <AdminIcon />,
    user: <UserIcon />,
    store_owner: <StoreIcon />
  };

  const rolePermissions = {
    admin: [
      'Create and manage users (admins, store owners, normal users)',
      'Create and assign stores to store owners',
      'View all stores and filter them',
      'View dashboard statistics',
      'View all user details'
    ],
    store_owner: [
      'View ratings for your assigned store',
      'See average rating of your store',
      'View list of users who rated your store',
      'Note: Contact admin to create/assign a store to you'
    ],
    user: [
      'Browse and search all stores',
      'Submit ratings (1-5) for stores',
      'Update your submitted ratings',
      'Update your password'
    ]
  };

  const profileItems = [
    {
      icon: <PersonIcon />,
      label: 'Name',
      value: userData.name
    },
    {
      icon: <EmailIcon />,
      label: 'Email',
      value: userData.email
    },
    {
      icon: <HomeIcon />,
      label: 'Address',
      value: userData.address || 'Not provided'
    },
    {
      icon: <BadgeIcon />,
      label: 'Role',
      value: (
        <Box display="flex" alignItems="center" gap={1}>
          {roleIcon[userData.role]}
          <Chip 
            label={userData.role.toUpperCase().replace('_', ' ')} 
            color={roleColor[userData.role] || 'default'} 
            size="medium"
          />
        </Box>
      )
    },
    {
      icon: <UpdateIcon />,
      label: 'Account Created',
      value: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'
    }
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                {profileItems.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Box display="flex" alignItems="center">
                      <Box mr={2} color="primary.main">
                        {item.icon}
                      </Box>
                      <Box flexGrow={1}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body1">
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Box mt={3}>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/update-password"
                >
                  Update Password
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Role Information & Permissions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Role Information
              </Typography>
              
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                icon={roleIcon[userData.role]}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {userData.role === 'admin' ? 'Administrator' : 
                   userData.role === 'store_owner' ? 'Store Owner' : 
                   'Normal User'}
                </Typography>
                <Typography variant="body2">
                  {userData.role === 'admin' ? 'You have full system access' : 
                   userData.role === 'store_owner' ? 'You manage store ratings' : 
                   'You can rate stores and update your profile'}
                </Typography>
              </Alert>
              
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Your Permissions:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                {rolePermissions[userData.role]?.map((permission, index) => (
                  <Typography 
                    key={index} 
                    component="li" 
                    variant="body2"
                    sx={{ mb: 0.5 }}
                  >
                    {permission}
                  </Typography>
                ))}
              </Box>
              
              {/* Quick Actions */}
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Quick Actions:
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {isAdmin() && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/admin/dashboard"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/admin/users"
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/admin/stores"
                    >
                      Manage Stores
                    </Button>
                  </>
                )}
                
                {isStoreOwner() && (
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/store-owner/ratings"
                  >
                    View My Store Ratings
                  </Button>
                )}
                
                {isNormalUser() && (
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/stores"
                  >
                    Browse Stores
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Additional Information */}
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              User ID: {userData.id}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
        
        {/* Notes based on role */}
        {isStoreOwner() && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> As a store owner, you don't create stores yourself. 
              An administrator will create a store and assign it to you. 
              Once assigned, you can view ratings for your store.
            </Typography>
          </Alert>
        )}
        
        {isAdmin() && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> As an administrator, you can create store owners and assign stores to them. 
              Store owners cannot create their own stores.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;