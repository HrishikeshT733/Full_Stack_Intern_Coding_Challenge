import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search as SearchIcon, Store as StoreIcon, Add as AddIcon } from '@mui/icons-material';
import { storeService } from '../../services/storeService';
import { useForm } from 'react-hook-form';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    email: ''
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchStores();
    fetchStoreOwners();
  }, []);

  const fetchStores = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await storeService.getStores(filterParams);
      setStores(response.data);
    } catch (error) {
      setError('Failed to load stores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOwners = async () => {
    setOwnersLoading(true);
    try {
      const response = await storeService.getUsers({ role: 'store_owner' });
      setStoreOwners(response.data);
    } catch (error) {
      console.error('Failed to fetch store owners:', error);
    } finally {
      setOwnersLoading(false);
    }
  };

  const handleSearch = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        activeFilters[key] = filters[key];
      }
    });
    fetchStores(activeFilters);
  };

  const handleViewStore = (store) => {
    setSelectedStore(store);
    setViewDialog(true);
  };

  const handleCreateStore = async (data) => {
    setCreateLoading(true);
    setError('');
    try {
      await storeService.createStore(data);
      setCreateDialog(false);
      reset();
      fetchStores();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create store');
    } finally {
      setCreateLoading(false);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4">
          Stores Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog(true)}
        >
          Create Store
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField
              label="Store Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Address"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              label="Email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Stores Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Owner Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total Ratings</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.length > 0 ? (
              stores.map((store) => (
                <TableRow 
                  key={store.id}
                  hover
                  onClick={() => handleViewStore(store)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <StoreIcon fontSize="small" />
                      {store.name}
                    </Box>
                  </TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {store.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {store.owner ? (
                      <Box>
                        <Typography variant="body2">{store.owner.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {store.ownerId}
                        </Typography>
                      </Box>
                    ) : (
                      `Owner ID: ${store.ownerId}`
                    )}
                  </TableCell>
                  <TableCell>{store.owner?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Rating 
                        value={calculateAverageRating(store.ratings)} 
                        readOnly 
                        precision={0.5} 
                        size="small" 
                      />
                      <Typography variant="body2" ml={1}>
                        ({calculateAverageRating(store.ratings)})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{store.ratings?.length || 0}</TableCell>
                  <TableCell>{formatDate(store.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary" py={3}>
                    No stores found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Store Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Store Details</DialogTitle>
        <DialogContent>
          {selectedStore && (
            <Box sx={{ mt: 2 }}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Store Name</Typography>
                <Typography variant="body1">{selectedStore.name}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{selectedStore.email}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                <Typography variant="body1">{selectedStore.address}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Owner</Typography>
                <Typography variant="body1">
                  {selectedStore.owner ? (
                    <>
                      {selectedStore.owner.name} (ID: {selectedStore.ownerId})
                    </>
                  ) : (
                    `Owner ID: ${selectedStore.ownerId}`
                  )}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Owner Email</Typography>
                <Typography variant="body1">{selectedStore.owner?.email || 'N/A'}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Average Rating</Typography>
                <Box display="flex" alignItems="center">
                  <Rating 
                    value={calculateAverageRating(selectedStore.ratings)} 
                    readOnly 
                    precision={0.5} 
                  />
                  <Typography variant="h6" ml={2}>
                    {calculateAverageRating(selectedStore.ratings)}/5
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Based on {selectedStore.ratings?.length || 0} ratings
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Created Date</Typography>
                <Typography variant="body1">{formatDate(selectedStore.createdAt)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Store Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Store</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(handleCreateStore)}>
            <TextField
              fullWidth
              label="Store Name *"
              margin="normal"
              {...register('name', {
                required: 'Store name is required',
                maxLength: {
                  value: 60,
                  message: 'Name cannot exceed 60 characters'
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              fullWidth
              label="Store Email *"
              margin="normal"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              fullWidth
              label="Address *"
              margin="normal"
              multiline
              rows={2}
              {...register('address', {
                required: 'Address is required',
                maxLength: {
                  value: 400,
                  message: 'Address cannot exceed 400 characters'
                }
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Store Owner *</InputLabel>
              <Select
                label="Store Owner *"
                {...register('ownerId', {
                  required: 'Store owner is required',
                  valueAsNumber: true
                })}
                error={!!errors.ownerId}
              >
                <MenuItem value="" disabled>
                  {ownersLoading ? 'Loading store owners...' : 'Select a store owner'}
                </MenuItem>
                {storeOwners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </MenuItem>
                ))}
              </Select>
              {errors.ownerId && (
                <Typography color="error" variant="caption">
                  {errors.ownerId.message}
                </Typography>
              )}
              {storeOwners.length === 0 && !ownersLoading && (
                <Typography variant="caption" color="textSecondary">
                  No store owners found. Create store owners first.
                </Typography>
              )}
            </FormControl>
            
            <DialogActions>
              <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={createLoading || storeOwners.length === 0}
              >
                {createLoading ? <CircularProgress size={24} /> : 'Create Store'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default StoresList;