// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   CircularProgress
// } from '@mui/material';
// import {
//   People as PeopleIcon,
//   Store as StoreIcon,
//   Star as StarIcon
// } from '@mui/icons-material';
// import { storeService } from '../../services/storeService';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const response = await storeService.getDashboardStats();
//       setStats(response.data);
//     } catch (error) {
//       setError('Failed to load dashboard statistics');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container>
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   const statCards = [
//     {
//       title: 'Total Users',
//       value: stats?.totalUsers || 0,
//       icon: <PeopleIcon sx={{ fontSize: 40 }} />,
//       color: '#1976d2'
//     },
//     {
//       title: 'Total Stores',
//       value: stats?.totalStores || 0,
//       icon: <StoreIcon sx={{ fontSize: 40 }} />,
//       color: '#2e7d32'
//     },
//     {
//       title: 'Total Ratings',
//       value: stats?.totalRatings || 0,
//       icon: <StarIcon sx={{ fontSize: 40 }} />,
//       color: '#ed6c02'
//     }
//   ];

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
//         Admin Dashboard
//       </Typography>
      
//       {error && (
//         <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
//           <Typography color="error">{error}</Typography>
//         </Paper>
//       )}
      
//       <Grid container spacing={3}>
//         {statCards.map((stat, index) => (
//           <Grid item xs={12} md={4} key={index}>
//             <Card>
//               <CardContent>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Box>
//                     <Typography color="textSecondary" gutterBottom>
//                       {stat.title}
//                     </Typography>
//                     <Typography variant="h4" component="div">
//                       {stat.value}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ color: stat.color }}>
//                     {stat.icon}
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentStores, setRecentStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await storeService.getDashboardStats();
      setStats(statsResponse.data);
      
      // Fetch recent users
      const usersResponse = await storeService.getUsers();
      const sortedUsers = usersResponse.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentUsers(sortedUsers);
      
      // Fetch recent stores
      const storesResponse = await storeService.getStores();
      const sortedStores = storesResponse.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentStores(sortedStores);
      
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'store_owner': return 'warning';
      default: return 'primary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.totalUsers || 0}
                  </Typography>
                </Box>
                <Box sx={{ color: '#1976d2' }}>
                  <PeopleIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box mt={2}>
                <Button
                  size="small"
                  component={Link}
                  to="/admin/users"
                  startIcon={<ListIcon />}
                >
                  View All Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Stores
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.totalStores || 0}
                  </Typography>
                </Box>
                <Box sx={{ color: '#2e7d32' }}>
                  <StoreIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box mt={2}>
                <Button
                  size="small"
                  component={Link}
                  to="/admin/stores"
                  startIcon={<ListIcon />}
                >
                  View All Stores
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Ratings
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.totalRatings || 0}
                  </Typography>
                </Box>
                <Box sx={{ color: '#ed6c02' }}>
                  <StarIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Average Rating: {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}/5
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            component={Link}
            to="/admin/users/create"
            startIcon={<AddIcon />}
          >
            Create New User
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/admin/stores"
            startIcon={<AddIcon />}
          >
            Create New Store
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/admin/users"
            startIcon={<PeopleIcon />}
          >
            Manage Users
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/admin/stores"
            startIcon={<StoreIcon />}
          >
            Manage Stores
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Users
              </Typography>
              <Button
                size="small"
                component={Link}
                to="/admin/users"
              >
                View All
              </Button>
            </Box>
            
            {recentUsers.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role.toUpperCase().replace('_', ' ')} 
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center" py={3}>
                No users found
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Stores */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Stores
              </Typography>
              <Button
                size="small"
                component={Link}
                to="/admin/stores"
              >
                View All
              </Button>
            </Box>
            
            {recentStores.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentStores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell>{store.name}</TableCell>
                        <TableCell>
                          {store.owner?.name || `ID: ${store.ownerId}`}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <StarIcon fontSize="small" sx={{ color: '#ffb400', mr: 0.5 }} />
                            {calculateAverageRating(store.ratings)}
                            <Typography variant="caption" color="textSecondary" ml={0.5}>
                              ({store.ratings?.length || 0})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(store.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center" py={3}>
                No stores found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Admin Instructions */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          How to Create a Store Owner
        </Typography>
        
        <Box component="ol" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              Create Store Owner User
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Go to "Users" → "Create User" → Set Role to "Store Owner"
            </Typography>
          </Box>
          
          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              Create Store and Assign Owner
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Go to "Stores" → "Create Store" → Select the store owner from dropdown
            </Typography>
          </Box>
          
          <Box component="li">
            <Typography variant="body1" fontWeight="bold">
              Store Owner Access
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The store owner can now log in and view ratings for their assigned store
            </Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Store owners cannot create their own stores. 
            Only administrators can create stores and assign them to store owners.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default Dashboard;