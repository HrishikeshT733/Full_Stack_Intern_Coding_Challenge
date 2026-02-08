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
  Chip,
  IconButton,
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
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { storeService } from '../../services/storeService';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await storeService.getUsers(filterParams);
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        activeFilters[key] = filters[key];
      }
    });
    fetchUsers(activeFilters);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialog(true);
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
        Users Management
      </Typography>
      
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
              label="Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              label="Address"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                label="Role"
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="user">Normal User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Search
          </Button>
        </Box>
      </Paper>
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {user.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.toUpperCase()} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" py={3}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* User Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                <Typography variant="body1">{selectedUser.name}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                <Typography variant="body1">{selectedUser.address}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Role</Typography>
                <Chip 
                  label={selectedUser.role.toUpperCase()} 
                  color={getRoleColor(selectedUser.role)}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">Joined Date</Typography>
                <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersList;