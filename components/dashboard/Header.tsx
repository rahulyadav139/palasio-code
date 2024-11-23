'use client';

import { useUser, useError } from '@/hooks';
import { Add, ContactPage, Groups } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Header = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { errorHandler } = useError();
  const [isCreatingSnippet, setIsCreatingSnippet] = useState<boolean>(false);

  const userLogoutHandler = async () => {
    try {
      setIsLoading(true);
      await axios.delete('/api/auth/logout');

      router.push('/login');
    } catch (err) {
      errorHandler(err);
      setIsLoading(false);
    }
  };

  const createCollaborationSnippet = async () => {
    try {
      setIsCreatingSnippet(true);
      const [uid] = window.crypto.randomUUID().split('-');

      const payload = {
        name: `collab-${uid}`,
        uid,
        data: '',
        language: 'text',
        // collaborators: [user._id],
        isCollaborative: true,
        author: user._id,
      };

      await axios.post('/api/snippet', payload);
      router.push(`/collab/${uid}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsCreatingSnippet(false);
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
        {isCreatingSnippet ? (
          <CircularProgress size={20} />
        ) : (
          <Tooltip title="New collaborative snippet">
            <IconButton onClick={createCollaborationSnippet}>
              <ContactPage />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="New snippet">
          <IconButton onClick={() => router.push('/snippet')}>
            <Add />
          </IconButton>
        </Tooltip>
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
