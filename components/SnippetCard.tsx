'use client';

import { ISnippet } from '@/types';
import { dateFormatter } from '@/utils';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState, SyntheticEvent } from 'react';

interface ISnippetCard {
  snippet: ISnippet;
  onDelete: (id: string, originalUid: string | undefined) => Promise<void>;
}

export const SnippetCard: FC<ISnippetCard> = ({ snippet, onDelete }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const openSnippetHandler = () => {
    router.push(`/snippet/${snippet.uid}`);
  };

  const deleteSnippetHandler = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);

    await onDelete(snippet.uid, snippet?.original_uid);

    setIsLoading(false);
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
        gap: 1,
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
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {snippet.name}
        </Typography>
        <Typography fontSize="12.8px">
          {dateFormatter(snippet.created_at)}
        </Typography>
      </Box>
      {snippet?.original_uid && (
        <Chip
          size="small"
          label="Cloned"
          color="error"
          sx={{ ml: 'auto', fontSize: '10px', px: '0.7rem' }}
        />
      )}
      {!isLoading ? (
        <IconButton onClick={deleteSnippetHandler}>
          <Delete />
        </IconButton>
      ) : (
        <CircularProgress size={20} />
      )}
    </Box>
  );
};
