import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const Register = () => {
  const { register: registerUser } = useAuth();
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
    
    const result = await registerUser(data);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
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
            Register
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting to login...
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
                required: 'Please confirm your password',
                validate: value => 
                  value === password || 'Passwords do not match'
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
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            
            <Typography align="center">
              Already have an account?{' '}
              <Link to="/login">Login here</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;