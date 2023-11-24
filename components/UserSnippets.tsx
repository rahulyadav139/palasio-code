'use client';

import { Typography, Box, Button, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { SnippetCard } from '@/components';
import axios from 'axios';
import { ISnippet } from '@/types';
import { useAlert, useError } from '@/hooks';

export const UserSnippets = () => {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enableReload, setEnableReload] = useState<boolean>(false);
  const { errorHandler } = useError();
  const { setSuccess } = useAlert();

  useEffect(() => {
    if (!isLoading) return;
    (async () => {
      try {
        const { data } = await axios.get('/api/user/snippets');

        setSnippets(data.snippets);
      } catch (err) {
        errorHandler(err);
        setEnableReload(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  const removeSnippetHandler = async (
    snippetUid: string,
    originalUid: string | undefined
  ) => {
    try {
      let url: string | undefined;

      if (originalUid) {
        url = `/api/user/snippets/${originalUid}/remove`;
      } else {
        url = `/api/user/snippets/${snippetUid}`;
      }
      await axios.delete(url);
      setSnippets(prev => prev.filter(snippet => snippet.uid !== snippetUid));
      setSuccess('Snippet deleted!');
    } catch (err) {
      errorHandler(err);
    }
  };

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
      {isLoading &&
        Array.from({ length: 2 }).map((_, i) => (
          <Skeleton
            key={`card_${i + 1}`}
            variant="rounded"
            width="100%"
            height={56}
          />
        ))}
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

      {!Boolean(snippets.length) && !isLoading && !enableReload && (
        <Typography>No snippets</Typography>
      )}
      {snippets.map(snippet => (
        <SnippetCard
          onDelete={removeSnippetHandler}
          key={snippet._id}
          snippet={snippet}
        />
      ))}
    </Box>
  );
};
