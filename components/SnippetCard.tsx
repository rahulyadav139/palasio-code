'use client';

import { useAlert, useError } from '@/hooks';
import { ISnippet } from '@/types';
import { Delete } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useState, SyntheticEvent } from 'react';

interface ISnippetCard {
  snippet: ISnippet;
  updateSnippets: () => Promise<void>;
}

export const SnippetCard: FC<ISnippetCard> = ({ snippet, updateSnippets }) => {
  const router = useRouter();
  const { setSuccess } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const { errorHandler } = useError();
  const deleteSnippetHandler = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      setIsLoading(true);

      await axios.delete(`/api/user/snippets/${snippet._id}`);

      await updateSnippets();
      setSuccess('Snippet deleted!');
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openSnippetHandler = () => {
    router.push(`/snippet/${snippet.uid}`);
  };
  return (
    <Box
      sx={{
        p: 1,
        px: 2,
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        minHeight: 56,
        boxShadow:
          'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
        ...(!isLoading && {
          '&:hover': {
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          },
        }),
      }}
      onClick={openSnippetHandler}
    >
      <Typography variant="body2" fontWeight="bold">
        {snippet.name}
      </Typography>
      {!isLoading ? (
        <IconButton onClick={deleteSnippetHandler} sx={{ ml: 'auto' }}>
          <Delete />
        </IconButton>
      ) : (
        <CircularProgress size={20} />
      )}
    </Box>
  );
};
