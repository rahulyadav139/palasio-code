'use client';
import {
  Box,
  TextField,
  Typography,
  Button,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { regex } from '@/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import { useAlert } from '@/hooks/useAlert';

interface IFormData {
  email: string;
  password: string;
}

export default function Register() {
  const { setAlert } = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginHandler: FormEventHandler = async e => {
    e.preventDefault();

    if (!regex.email.test(formData.email) || !formData.password.trim())
      return setIsFormValid(false);
    else setIsFormValid(true);

    try {
      setIsLoading(true);
      await axios.post('/api/auth/login', {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      router.replace('/home');
    } catch (err) {
      let errorMessage: string | undefined;

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        errorMessage = 'Incorrect username or password!';
      } else {
        errorMessage = 'Internal server error';
      }

      if (errorMessage) {
        setAlert({ type: 'error', message: errorMessage });
      }
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
      <h2>Login</h2>
      <Typography gutterBottom variant="body1">
        Not a member?&nbsp;
        <MuiLink underline="hover" href="/signup" component={Link}>
          Sign up
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
        onSubmit={loginHandler}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          mt: 5,
        }}
      >
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
          type="password"
          error={!isFormValid && !formData.password}
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
