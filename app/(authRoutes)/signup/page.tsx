'use client';
import { Box, TextField, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { regex } from '@/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import { useError } from '@/hooks';

interface IFormData {
  email: string;
  password: string;
  name: string;
}

export default function Register() {
  const router = useRouter();
  const { errorHandler, getStatusCode } = useError();
  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
    name: '',
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const registerHandler: FormEventHandler = async e => {
    e.preventDefault();

    if (
      !regex.email.test(formData.email) ||
      !regex.password.test(formData.password) ||
      !formData.name.trim()
    ) {
      return setIsFormValid(false);
    } else setIsFormValid(true);

    try {
      setIsLoading(true);
      await axios.post('/api/auth/signup', formData);
      router.replace('/home');
    } catch (err) {
      let errorMessage: string | undefined;

      const status = getStatusCode(err);

      if (status === 409) {
        errorMessage = 'Email is already registered!';
      }

      errorHandler(err, errorMessage);

      setIsLoading(false);
    }
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: 'min(90%, 400px)',
        mx: 'auto',
      }}
    >
      <h2>Sign Up</h2>
      <Typography gutterBottom variant="body1">
        Already a member?&nbsp;
        <MuiLink underline="hover" href="/login" component={Link}>
          Login
        </MuiLink>
      </Typography>
      <MuiLink
        component={Link}
        underline="hover"
        href="/snippet"
        variant="body2"
      >
        Create Snippet
      </MuiLink>

      <Box
        component="form"
        onSubmit={registerHandler}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          mt: 5,
        }}
      >
        <TextField
          name="name"
          onChange={inputHandler}
          value={formData.name}
          required
          label="Name"
          fullWidth
          variant="standard"
          error={!isFormValid && !formData.name.trim()}
          helperText={
            !isFormValid && !formData.name.trim() ? 'Incorrect email' : ''
          }
        />
        <TextField
          name="email"
          onChange={inputHandler}
          value={formData.email}
          required
          label="Email"
          fullWidth
          variant="standard"
          error={!isFormValid && !regex.email.test(formData.email)}
          helperText={
            !isFormValid && !regex.email.test(formData.email)
              ? 'Incorrect email'
              : ''
          }
        />
        <TextField
          name="password"
          onChange={inputHandler}
          value={formData.password}
          required
          label="Password"
          fullWidth
          variant="standard"
          error={!isFormValid && !regex.password.test(formData.password)}
          helperText={
            !isFormValid && !regex.password.test(formData.password)
              ? 'At-least 1 uppercase and lowercase letter, 1 special character and 1 number'
              : ''
          }
          type="password"
        />

        <LoadingButton
          loading={isLoading}
          type="submit"
          sx={{ mt: 3 }}
          disableElevation
          fullWidth
          variant="contained"
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
}
