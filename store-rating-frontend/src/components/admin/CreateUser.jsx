import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { storeService } from '../../services/storeService';
import { useAuth } from '../../context/AuthContext';

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await storeService.createAdminUser(data);
      setSuccess(true);
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8 || value.length > 16) 
      return 'Password must be 8-16 characters';
    if (!/[A-Z]/.test(value)) 
      return 'Must contain at least one uppercase letter';
    if (!/[!@#$%^&*]/.test(value)) 
      return 'Must contain at least one special character (!@#$%^&*)';
    return true;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New User
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              User created successfully! Redirecting...
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 20,
                  message: 'Name must be at least 20 characters'
                },
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
              label="Email"
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
              label="Address"
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
            
            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                defaultValue="user"
                {...register('role', { required: 'Role is required' })}
                error={!!errors.role}
              >
                <MenuItem value="user">Normal User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
              </Select>
              {errors.role && (
                <Typography color="error" variant="caption">
                  {errors.role.message}
                </Typography>
              )}
            </FormControl> */}

            <FormControl fullWidth margin="normal">
  <InputLabel>Role</InputLabel>
  <Select
    label="Role"
    defaultValue="store_owner" // Default to store owner since that's what admin creates
    {...register('role', { required: 'Role is required' })}
    error={!!errors.role}
  >
    <MenuItem value="store_owner">Store Owner</MenuItem>
    <MenuItem value="user">Normal User</MenuItem>
    <MenuItem value="admin">Admin (use carefully)</MenuItem>
  </Select>
  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
    Note: Store owners can create their own stores after registration
  </Typography>
</FormControl>
            
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              {...register('password', {
                validate: validatePassword
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: value => 
                  value === password || 'Passwords do not match'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <Box display="flex" gap={2} sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/users')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create User'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateUser;