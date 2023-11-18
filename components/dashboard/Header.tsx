'use client';

import { useUser } from '@/hooks';
import { Add } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Header = () => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userLogoutHandler = async () => {
    try {
      setIsLoading(true);
      await axios.delete('/api/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 1,
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography component="div" variant="body1">
          Hello 👋
        </Typography>
        <Typography variant="body2">{user?.email}</Typography>
      </Box>
      <Box
        component="nav"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <IconButton onClick={() => router.push('/snippet')}>
          <Add />
        </IconButton>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          size="small"
          disableElevation
          onClick={userLogoutHandler}
          sx={{
            textTransform: 'initial',
          }}
        >
          Logout
        </LoadingButton>
      </Box>
    </Box>
  );
};
