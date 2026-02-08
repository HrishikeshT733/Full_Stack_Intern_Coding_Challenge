// import React from 'react';
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Alert,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import {
//   AdminPanelSettings as AdminIcon,
//   Storage as DatabaseIcon,
//   Login as LoginIcon
// } from '@mui/icons-material';

// const AdminSetupInfo = () => {
//   return (
//     <Container maxWidth="md">
//       <Box sx={{ mt: 8 }}>
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Admin Setup Instructions
//           </Typography>
          
//           <Alert severity="info" sx={{ mb: 3 }}>
//             <Typography variant="body1">
//               Since only existing admins can create new admin users, the first admin user must be created manually in the database.
//             </Typography>
//           </Alert>
          
//           <Typography variant="h6" gutterBottom>
//             Steps to Setup First Admin:
//           </Typography>
          
//           <List>
//             <ListItem>
//               <ListItemIcon>
//                 <DatabaseIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="1. Create First Admin Manually"
//                 secondary="Insert an admin user directly into your PostgreSQL/MySQL database with role='admin'"
//               />
//             </ListItem>
            
//             <ListItem>
//               <ListItemIcon>
//                 <LoginIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="2. Login as Admin"
//                 secondary="Use the manually created admin credentials to login"
//               />
//             </ListItem>
            
//             <ListItem>
//               <ListItemIcon>
//                 <AdminIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="3. Create Other Users"
//                 secondary="Once logged in as admin, you can create other admin users, store owners, and normal users"
//               />
//             </ListItem>
//           </List>
          
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
//             <Button
//               variant="outlined"
//               component={Link}
//               to="/login"
//             >
//               Go to Login
//             </Button>
//             <Button
//               variant="contained"
//               component={Link}
//               to="/register"
//             >
//               Register as Normal User
//             </Button>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default AdminSetupInfo;

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AdminPanelSettings as AdminIcon,
  Storage  as DatabaseIcon,
  Login as LoginIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon
} from '@mui/icons-material';

const AdminSetupInfo = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          Admin Setup Instructions
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
          Setting up the first administrator for the Store Rating System
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1">
          <strong>Important:</strong> Since only existing administrators can create new admin users, 
          the first admin user must be created manually in the database.
        </Typography>
      </Alert>

      {/* Steps Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Step-by-Step Setup Guide
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <DatabaseIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 1: Create First Admin in Database"
                secondary={
                  <>
                    <Typography variant="body2">
                      Insert a user directly into your database with the following details:
                    </Typography>
                    <Box component="pre" sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                      {`INSERT INTO users (name, email, password, address, role, createdAt) 
VALUES (
  'System Administrator', 
  'admin@example.com', 
  'hashed_password_here', 
  'Admin Address', 
  'admin', 
  CURRENT_TIMESTAMP
);`}
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Note: Make sure to hash the password properly (use bcrypt with your backend's method).
                    </Typography>
                  </>
                }
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <LoginIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 2: Login as Admin"
                secondary="Use the manually created admin credentials (email: admin@example.com) to login to the system"
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <AdminIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 3: Access Admin Dashboard"
                secondary="Once logged in, you'll have access to the admin dashboard and user management"
              />
            </ListItem>
            
            <Divider component="li" />
            
            <ListItem>
              <ListItemIcon>
                <PeopleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 4: Create Other Users"
                secondary="As an admin, you can now create other admin users, store owners, and normal users through the admin panel"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Roles Information */}
      <Typography variant="h5" gutterBottom>
        Understanding User Roles
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={3} mb={4}>
        {/* Admin Card */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AdminIcon color="error" sx={{ mr: 2 }} />
            <Typography variant="h6">Administrator</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>Permissions:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Create and manage users (admins, store owners, normal users)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Create stores and assign them to store owners" />
            </ListItem>
            <ListItem>
              <ListItemText primary="View dashboard with system statistics" />
            </ListItem>
            <ListItem>
              <ListItemText primary="View all stores and users with filtering capabilities" />
            </ListItem>
          </List>
        </Paper>

        {/* Store Owner Card */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <StoreIcon color="warning" sx={{ mr: 2 }} />
            <Typography variant="h6">Store Owner</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>Permissions:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="View ratings submitted for their assigned store" />
            </ListItem>
            <ListItem>
              <ListItemText primary="See average rating of their store" />
            </ListItem>
            <ListItem>
              <ListItemText primary="View list of users who rated their store" />
            </ListItem>
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Store owners cannot create their own stores. Only administrators can create stores and assign them to store owners.
            </Typography>
          </Alert>
        </Paper>

        {/* Normal User Card */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <StarIcon color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">Normal User</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>Permissions:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Browse and search all stores" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Submit ratings (1-5) for individual stores" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Update their submitted ratings" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Update their password and profile" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          component={Link}
          to="/login"
          size="large"
        >
          Go to Login
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/register"
          size="large"
        >
          Register as Normal User
        </Button>
      </Box>

      {/* Database Info */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom>
          Database Information
        </Typography>
        <Typography variant="body2" paragraph>
          This system uses PostgreSQL/MySQL as the database. Make sure your database is running and the connection is properly configured in the backend.
        </Typography>
        <Typography variant="body2">
          <strong>Default admin credentials (for manual setup):</strong>
        </Typography>
        <Box component="pre" sx={{ mt: 1, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
          {`Email: admin@example.com
Name: System Administrator (20-60 characters)
Address: Admin Address (max 400 characters)
Password: Choose a strong password (8-16 chars, uppercase, special char)
Role: admin`}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminSetupInfo;