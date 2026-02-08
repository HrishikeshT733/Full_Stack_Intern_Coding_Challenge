// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Box,
//   Rating,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { storeService } from '../../services/storeService';

// const StoreRatings = () => {
//   const [storeData, setStoreData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchStoreRatings();
//   }, []);

//   const fetchStoreRatings = async () => {
//     try {
//       setLoading(true);
//       const response = await storeService.getStoreRatings();
      
//       // The backend should return data in this format:
//       // {
//       //   store: { id, name, address, email },
//       //   ratings: [{ id, rating, user: { id, name, email }, createdAt }],
//       //   averageRating: number
//       // }
      
//       setStoreData(response.data);
//     } catch (error) {
//       setError('Failed to load store ratings');
//       console.error('Error fetching store ratings:', error);
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

//   if (error) {
//     return (
//       <Container>
//         <Alert severity="error" sx={{ mt: 3 }}>
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   // If no store exists for this owner
//   if (!storeData || !storeData.store) {
//     return (
//       <Container maxWidth="lg">
//         <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
//           <Typography variant="h6" gutterBottom>
//             No Store Assigned
//           </Typography>
//           <Typography color="textSecondary">
//             You don't have a store assigned to you yet. Please contact an administrator to create a store and assign it to you.
//           </Typography>
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//             Note: Only administrators can create stores and assign them to store owners.
//           </Typography>
//         </Paper>
//       </Container>
//     );
//   }

//   const { store, ratings = [], averageRating = 0 } = storeData;

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
//         My Store Ratings
//       </Typography>
      
//       {/* Store Info */}
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               {store.name}
//             </Typography>
//             <Typography color="textSecondary">
//               {store.address}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               Email: {store.email}
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center">
//             <Typography variant="h6" mr={2}>
//               Average Rating:
//             </Typography>
//             <Rating value={averageRating} readOnly precision={0.5} size="large" />
//             <Typography variant="h5" ml={2}>
//               {averageRating.toFixed(1)}/5
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>
      
//       {/* Ratings Table */}
//       {ratings.length > 0 ? (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>User Name</TableCell>
//                 <TableCell>User Email</TableCell>
//                 <TableCell>Rating</TableCell>
//                 <TableCell>Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {ratings.map((rating) => (
//                 <TableRow key={rating.id}>
//                   <TableCell>
//                     {rating.user?.name || `User #${rating.userId}`}
//                   </TableCell>
//                   <TableCell>
//                     {rating.user?.email || 'Email not available'}
//                   </TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center">
//                       <Rating value={rating.rating} readOnly size="small" />
//                       <Typography variant="body2" display="inline" ml={1}>
//                         ({rating.rating}/5)
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     {new Date(rating.createdAt).toLocaleDateString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Paper sx={{ p: 4, textAlign: 'center' }}>
//           <Typography color="textSecondary">
//             No ratings received yet for your store
//           </Typography>
//         </Paper>
//       )}
//     </Container>
//   );
// };

// export default StoreRatings;


import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Rating,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { storeService } from '../../services/storeService';
import { useAuth } from '../../context/AuthContext';

const StoreRatings = () => {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStoreRatings();
  }, []);

  const fetchStoreRatings = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStoreRatings();
      
      // Expected response format from backend:
      // {
      //   store: { id, name, email, address },
      //   ratings: [{ id, rating, user: { id, name, email }, createdAt }],
      //   averageRating: number
      // }
      
      setStoreData(response.data);
    } catch (error) {
      setError('Failed to load store ratings');
      console.error('Error fetching store ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // If no store is assigned to this store owner
  if (!storeData || !storeData.store) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
          My Store Ratings
        </Typography>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Store Assigned
          </Typography>
          <Typography color="textSecondary" paragraph>
            You don't have a store assigned to you yet.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please contact an administrator to create a store and assign it to you.
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Store owners cannot create their own stores. Only administrators can create stores and assign them to store owners.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    );
  }

  const { store, ratings = [], averageRating = 0 } = storeData;
  const totalRatings = ratings.length;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4 }}>
        My Store Ratings
      </Typography>
      
      {/* Store Summary Card */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" gutterBottom>
              {store.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {store.address}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {store.email}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Store Rating Summary
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={averageRating} readOnly precision={0.1} size="large" />
              <Typography variant="h4" ml={2}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary" ml={1}>
                /5
              </Typography>
            </Box>
            <Chip 
              label={`${totalRatings} Rating${totalRatings !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {/* Ratings Breakdown */}
      {totalRatings > 0 ? (
        <>
          {/* Rating Distribution */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => r.rating === star).length;
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                
                return (
                  <Box key={star} display="flex" alignItems="center" gap={2}>
                    <Box width={40}>
                      <Typography variant="body2">{star} stars</Typography>
                    </Box>
                    <Box flex={1}>
                      <Box
                        sx={{
                          height: 20,
                          backgroundColor: 'primary.light',
                          borderRadius: 1,
                          width: `${percentage}%`,
                          minWidth: count > 0 ? 10 : 0
                        }}
                      />
                    </Box>
                    <Box width={60}>
                      <Typography variant="body2" color="textSecondary">
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Ratings Table */}
          <Typography variant="h6" gutterBottom>
            All Ratings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Date Submitted</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1">
                          {rating.user?.name || `User #${rating.userId}`}
                        </Typography>
                        {rating.user && (
                          <Typography variant="caption" color="textSecondary">
                            ID: {rating.userId}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {rating.user?.email || 'Email not available'}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Rating value={rating.rating} readOnly size="small" />
                        <Typography variant="body2" ml={1}>
                          {rating.rating}/5
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDate(rating.createdAt)}
                    </TableCell>
                    <TableCell>
                      {rating.comments || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Ratings Yet
          </Typography>
          <Typography color="textSecondary">
            Your store hasn't received any ratings yet. 
            Encourage users to rate your store!
          </Typography>
        </Paper>
      )}

      {/* Store Information Card */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Store Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex">
            <Typography variant="body2" sx={{ width: 120 }} color="textSecondary">
              Store ID:
            </Typography>
            <Typography variant="body2">{store.id}</Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body2" sx={{ width: 120 }} color="textSecondary">
              Store Name:
            </Typography>
            <Typography variant="body2">{store.name}</Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body2" sx={{ width: 120 }} color="textSecondary">
              Email:
            </Typography>
            <Typography variant="body2">{store.email}</Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body2" sx={{ width: 120 }} color="textSecondary">
              Address:
            </Typography>
            <Typography variant="body2">{store.address}</Typography>
          </Box>
          <Box display="flex">
            <Typography variant="body2" sx={{ width: 120 }} color="textSecondary">
              Your User ID:
            </Typography>
            <Typography variant="body2">{user?.id}</Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            This is your store dashboard. Here you can see all ratings submitted by users for your store.
            If you need to update store information or have any issues, please contact an administrator.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default StoreRatings;