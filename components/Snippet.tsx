'use client';
import { Editor } from '@/components/Editor';
import { useTimeout } from '@/hooks';
import { Add, Share, Home } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import React, { FC } from 'react';
import Link from 'next/link';
import { ISnippet } from '@/types/ISnippet';

import { useRouter } from 'next/navigation';

interface SnippetType {
  snippet: ISnippet;
}

export const Snippet: FC<SnippetType> = ({ snippet }) => {
  const [isShareTooltip, setIsShareTooltip] = useTimeout(2);
  const router = useRouter();

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
          <Link href="/snippet">
            <IconButton>
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
              <Share sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Editor doc={snippet.data} readonly={true} language={snippet.language} />
    </Box>
  );
};
