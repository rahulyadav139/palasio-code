'use client';

import { Typography, Box, Button, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { SnippetCard } from '@/components';
import axios from 'axios';
import { ISnippet } from '@/types';
import { useAlert, useError } from '@/hooks';

export const SavedSnippets = () => {
  return <></>;
  // const [snippets, setSnippets] = useState<ISnippet[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [enableReload, setEnableReload] = useState<boolean>(false);
  // const { errorHandler } = useError();
  // const { setSuccess } = useAlert();

  // useEffect(() => {
  //   if (!isLoading) return;
  //   (async () => {
  //     try {
  //       const { data } = await axios.get('/api/user/snippets?createdBy=others');

  //       setSnippets(data.snippets);
  //     } catch (err) {
  //       errorHandler(err);
  //       setEnableReload(true);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, [isLoading]);

  // const removeSnippetHandler = async (snippetId: string) => {
  //   try {
  //     await axios.delete(`/api/user/snippets/${snippetId}/remove`);
  //     setSnippets(prev => prev.filter(snippet => snippet._id !== snippetId));
  //     setSuccess('Snippet removed!');
  //   } catch (err) {
  //     errorHandler(err);
  //   }
  // };

  // return (
  //   <Box
  //     sx={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       gap: 1,
  //       py: 2,
  //       width: '100%',
  //     }}
  //   >
  //     {isLoading &&
  //       Array.from({ length: 2 }).map((_, i) => (
  //         <Skeleton
  //           key={`card_${i + 1}`}
  //           variant="rounded"
  //           width="100%"
  //           height={56}
  //         />
  //       ))}
  //     {!Boolean(snippets.length) && enableReload && (
  //       <Button
  //         sx={{
  //           textTransform: 'initial',
  //           p: 0,
  //           fontSize: '0.8rem',
  //           '&:hover': {
  //             textDecoration: 'underline',
  //           },
  //         }}
  //         onClick={() => setIsLoading(true)}
  //       >
  //         Reload
  //       </Button>
  //     )}

  //     {!Boolean(snippets.length) && !isLoading && !enableReload && (
  //       <Typography>No snippets</Typography>
  //     )}
  //     {snippets.map(snippet => (
  //       <SnippetCard
  //         onDelete={() => removeSnippetHandler(snippet._id)}
  //         key={snippet._id}
  //         snippet={snippet}
  //       />
  //     ))}
  //   </Box>
  // );
};
