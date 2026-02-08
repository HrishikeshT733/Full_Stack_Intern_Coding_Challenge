import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { storeService } from '../../services/storeService';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await storeService.getStores(filters);
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchStores(search);
  };

  const handleRatingClick = async (store) => {
    setSelectedStore(store);
    try {
      const response = await storeService.getUserRating(store.id);
      setUserRating(response.data?.rating || 0);
    } catch (error) {
      setUserRating(0);
    }
    setRatingDialog(true);
  };

  const submitRating = async () => {
    if (!selectedStore || !userRating) return;
    
    setSubmitting(true);
    setMessage('');
    
    try {
      await storeService.submitRating(selectedStore.id, userRating);
      setMessage('Rating submitted successfully!');
      fetchStores(search);
      setTimeout(() => {
        setRatingDialog(false);
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
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
        Stores
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Store Name"
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Address"
              value={search.address}
              onChange={(e) => setSearch({ ...search, address: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} md={6} key={store.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {store.name}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {store.address}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={calculateAverageRating(store.ratings)} readOnly precision={0.5} />
                      <Typography ml={1}>
                        ({calculateAverageRating(store.ratings)})
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRatingClick(store)}
                  >
                    Rate Store
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog open={ratingDialog} onClose={() => setRatingDialog(false)}>
        <DialogTitle>Rate {selectedStore?.name}</DialogTitle>
        <DialogContent>
          {message && (
            <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Select your rating:</Typography>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
              max={5}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog(false)}>Cancel</Button>
          <Button 
            onClick={submitRating} 
            variant="contained"
            disabled={submitting || !userRating}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserStores;