'use client';

import { Typography, Box, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SnippetCard } from '@/components';
import axios from 'axios';
import { ISnippet } from '@/types';
import { useError } from '@/hooks';

export const UserSnippets = () => {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enableReload, setEnableReload] = useState<boolean>(false);
  const { errorHandler } = useError();

  const updateSnippetsHandler = useCallback(async () => {
    const { data } = await axios.get('/api/user/snippets');

    setSnippets(data.snippets);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    (async () => {
      try {
        await updateSnippetsHandler();
      } catch (err) {
        errorHandler(err);
        setEnableReload(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isLoading, updateSnippetsHandler]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        py: 2,
        width: '100%',
      }}
    >
      {!Boolean(snippets.length) && enableReload && (
        <Button
          sx={{
            textTransform: 'initial',
            p: 0,
            fontSize: '0.8rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => setIsLoading(true)}
        >
          Reload
        </Button>
      )}

      {!Boolean(snippets.length) && !enableReload && (
        <Typography>No snippets</Typography>
      )}
      {snippets.map(snippet => (
        <SnippetCard
          updateSnippets={updateSnippetsHandler}
          key={snippet._id}
          snippet={snippet}
        />
      ))}
    </Box>
  );
};
