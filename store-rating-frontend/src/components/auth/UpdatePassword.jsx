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
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const UpdatePassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    const result = await updatePassword(data.newPassword);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8 || value.length > 16) 
      return 'Password must be 8-16 characters';
    if (!/[A-Z]/.test(value)) 
      return 'Must contain at least one uppercase letter';
    if (!/[!@#$%^&*]/.test(value)) 
      return 'Must contain at least one special character';
    return true;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Update Password
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password updated successfully! Redirecting...
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
              type="password"
              label="New Password"
              margin="normal"
              {...register('newPassword', {
                validate: validatePassword
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === newPassword || 'Passwords do not match'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default UpdatePassword;