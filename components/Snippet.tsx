'use client';

import { Editor } from '@/components';
import { useAlert, useTimeout } from '@/hooks';
import {
  Add,
  Share,
  Home,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { ISnippet } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useError } from '@/hooks';
import axios from 'axios';

interface SnippetType {
  snippet: ISnippet;
}

export const Snippet: FC<SnippetType> = ({ snippet: snippetData }) => {
  const [snippet, setSnippet] = useState<ISnippet>(snippetData);
  const [isShareTooltip, setIsShareTooltip] = useTimeout(2);
  const router = useRouter();
  const path = usePathname();
  const { setWarning, setSuccess } = useAlert();

  const { user, getUser, isLoading: isGettingUser } = useUser();
  const { errorHandler } = useError();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) return;

    getUser().catch(err => errorHandler(err));
  }, [user]);

  const saveSnippetHandler = async () => {
    if (!user) {
      return router.push(encodeURI(`/login?redirect=${path}`));
    }

    if (snippet.author === user?._id) {
      return setWarning('You are owner of this snippet!');
    }

    try {
      setIsLoading(true);
      if (snippet.saved_by?.includes(user._id)) {
        await axios.delete(`/api/user/snippets/${snippet.uid}/remove`);
        setSnippet(prev => ({
          ...prev,
          saved_by: prev.saved_by?.filter(id => id !== user._id),
        }));

        setSuccess('Snippet removed');
      } else {
        const { data } = await axios.post(
          `/api/user/snippets/${snippet.uid}/save`
        );
        setSnippet(prev => ({
          ...prev,
          saved_by: [...(prev.saved_by ?? []), user._id],
        }));

        setSuccess('Snippet saved');
      }
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100dvh',
        background: '#292C33',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="nav"
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          gap: 1,
          background: 'black',
          color: 'white',
        }}
      >
        <IconButton
          sx={{
            color: 'white',
            '&:hover': {
              background: '#292C33',
            },
          }}
          onClick={() => router.push('/home')}
        >
          <Home />
        </IconButton>
        <Typography>{snippet.name}</Typography>

        <Stack direction="row" gap={1} alignItems="center" ml="auto">
          {!isGettingUser && snippet?.author && !isLoading && (
            <IconButton
              sx={{
                '&:hover': {
                  background: '#292C33',
                },
                color: 'white',
              }}
              onClick={saveSnippetHandler}
            >
              {user && snippet.saved_by?.includes(user._id) ? (
                <Bookmark />
              ) : (
                <BookmarkBorder />
              )}
            </IconButton>
          )}
          {(isLoading || isGettingUser) && snippet?.author && (
            <CircularProgress size={20} />
          )}
          <Link href="/snippet">
            <IconButton
              sx={{
                '&:hover': {
                  background: '#292C33',
                },
              }}
            >
              <Add sx={{ color: 'white' }} />
            </IconButton>
          </Link>

          <Tooltip
            title="Link copied!"
            disableFocusListener
            disableHoverListener
            disableTouchListener
            open={isShareTooltip}
            placement="bottom"
          >
            <IconButton
              onClick={() => {
                setIsShareTooltip(true);
                navigator.clipboard.writeText(window.location.href);
              }}
              sx={{
                color: 'white',
                '&.Mui-disabled': {
                  color: 'white',
                  opacity: 0.7,
                },
                '&:hover': {
                  background: '#292C33',
                },
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Editor doc={snippet.data} readonly={true} language={snippet.language} />
    </Box>
  );
};
