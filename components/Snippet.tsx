'use client';
import { Editor } from '@/components/Editor';
import { useTimeout } from '@/hooks';
import { Save, Share } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import React, { FC, useCallback } from 'react';
import { SnippetCustomization } from './SnippetCustomization';

import { useState } from 'react';

interface ISnippet {
  snippet: any;
}

export interface ISnippetInfo {
  name: string;
  language: string;
}

export const Snippet: FC<ISnippet> = ({ snippet }) => {
  const [saveData, setSaveData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState(!snippet);
  const [snippetId, setSnippetId] = useState<string | null>(null);

  const [snippetInfo, setSnippetInfo] = useState<ISnippetInfo>({
    name: snippet?.name ?? '',
    language: snippet?.language ?? 'text',
  });
  const [timer, setTimer] = useTimeout(2);

  const saveSnippetHandler: any = useCallback(
    async (data: string) => {
      try {
        setIsLoading(true);

        if (!snippetId) {
          const [uid] = window.crypto.randomUUID().split('-');
          setSnippetId(uid);
          const payload: Record<string, string> = {
            data,
            uid,
            ...snippetInfo,
          };

          const res = await fetch('/api/code', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('something went wrong');

          window.history.replaceState(null, 'Page', `/code/${uid}`);
        } else {
          const res = await fetch(`/api/code/${snippetId}`, {
            method: 'PATCH',
            body: JSON.stringify({ data }),
          });
          if (!res.ok) throw new Error('something went wrong');
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        setSaveData(false);
      }
    },
    [snippetInfo, snippetId]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        background: '#292C33',
      }}
    >
      <Box
        component="nav"
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          background: 'black',
          color: 'white',
          minHeight: '55px',
        }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Typography>{snippetInfo.name}</Typography>
          {/* <IconButton size="small">
            <Edit fontSize="small" sx={{ color: 'white' }} />
          </IconButton> */}
        </Stack>

        <Stack direction="row" gap={1} alignItems="center" ml="auto">
          {!Boolean(snippet) && (
            <>
              {!isLoading ? (
                <IconButton onClick={() => setSaveData(true)}>
                  <Save fontSize="small" sx={{ color: 'white' }} />
                </IconButton>
              ) : (
                <CircularProgress size={20} />
              )}
            </>
          )}
          <Tooltip
            title="Link copied!"
            disableFocusListener
            disableHoverListener
            disableTouchListener
            open={timer}
            placement="bottom"
          >
            <IconButton
              onClick={() => {
                setTimer(true);
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <Share fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Editor
        doc={snippet?.data ?? ''}
        readonly={Boolean(snippet)}
        saveData={saveData}
        language={snippetInfo.language}
        saveDataHandler={saveSnippetHandler}
      />

      {isModal && (
        <SnippetCustomization
          setSnippetInfo={setSnippetInfo}
          open={isModal}
          onClose={() => setIsModal(false)}
        />
      )}
    </Box>
  );
};
