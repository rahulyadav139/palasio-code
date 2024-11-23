'use client';

import { Typography, Box, Button, Skeleton, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { SnippetCard } from '@/components';
import axios from 'axios';
import { ISnippet } from '@/types';
import { useAlert, useError, useUser } from '@/hooks';
import { useRouter } from 'next/navigation';

enum SnippetType {
  STANDARD = 'STANDARD',
  COLLABORATIVE = 'COLLABORATIVE',
}

export const UserSnippets = () => {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enableReload, setEnableReload] = useState<boolean>(false);
  const [snippetType, setSnippetType] = useState<SnippetType>(
    SnippetType.STANDARD
  );

  const { errorHandler } = useError();
  const { setSuccess } = useAlert();
  const { user } = useUser();
  const router = useRouter();

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

  const deleteSnippetHandler = async (snippetId: string) => {
    try {
      await axios.delete(`/api/user/snippets/${snippetId}`);
      setSnippets(prev => prev.filter(snippet => snippet._id !== snippetId));
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

      {Boolean(snippets.length) && !isLoading && (
        <>
          <Tabs
            value={snippetType}
            onChange={(e, newValue) => setSnippetType(newValue)}
            sx={{
              '& .MuiButtonBase-root': {
                textTransform: 'initial',
              },
            }}
          >
            <Tab label="Standard" value={SnippetType.STANDARD} />
            <Tab label="Collaborative" value={SnippetType.COLLABORATIVE} />
          </Tabs>

          {snippetType === SnippetType.STANDARD &&
            snippets
              .filter(snippet => !snippet.isCollaborative)
              .map(snippet => (
                <SnippetCard
                  {...(snippet.author === user?._id && {
                    onDelete: () => deleteSnippetHandler(snippet._id),
                  })}
                  key={snippet._id}
                  snippet={snippet}
                  onClick={() => {
                    router.push(`/snippet/${snippet.uid}`);
                  }}
                />
              ))}

          {snippetType === SnippetType.COLLABORATIVE &&
            snippets
              .filter(snippet => snippet.isCollaborative)
              .map(snippet => (
                <SnippetCard
                  {...(snippet.author === user?._id && {
                    onDelete: () => deleteSnippetHandler(snippet._id),
                  })}
                  key={snippet._id}
                  snippet={snippet}
                  onClick={() => {
                    router.push(`/collab/${snippet.uid}`);
                  }}
                />
              ))}
        </>
      )}
    </Box>
  );
};
