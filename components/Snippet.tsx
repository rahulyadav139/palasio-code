'use client';
import { Editor } from '@/components/Editor';
import { useTimeout } from '@/hooks';
import { Add, Edit, Save, Share } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { SnippetCustomization } from './SnippetCustomization';

import { useState } from 'react';
import Link from 'next/link';

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
  const [timer, setTimer] = useTimeout(2);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [editSnippetName, setEditSnippetName] = useState<boolean>(false);

  const [snippetInfo, setSnippetInfo] = useState<ISnippetInfo>({
    name: snippet?.name ?? '',
    language: snippet?.language ?? 'text',
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

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
          setIsSaved(true);
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

  useEffect(() => {
    if (!editSnippetName) return;

    inputRef.current?.focus();
  }, [editSnippetName]);

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
          background: 'black',
          color: 'white',
        }}
      >
        {Boolean(snippetInfo.name) && (
          <>
            {!editSnippetName ? (
              <Stack direction="row" gap={1} alignItems="center">
                <Typography>{snippetInfo.name}</Typography>
                {!Boolean(snippet) && (
                  <IconButton
                    size="small"
                    onClick={() => setEditSnippetName(true)}
                  >
                    <Edit sx={{ color: 'white', fontSize: '1rem' }} />
                  </IconButton>
                )}
              </Stack>
            ) : (
              <input
                ref={inputRef}
                defaultValue={snippetInfo.name}
                onBlur={() => {
                  setEditSnippetName(false);
                  if (!inputRef.current?.value) return;

                  setSnippetInfo(prev => ({
                    ...prev,
                    name: inputRef.current?.value!,
                  }));
                }}
                style={{
                  color: 'white',
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  borderBottom: '1px solid white',
                  paddingBottom: '5px',
                  width: 200,
                }}
              />
            )}
          </>
        )}

        <Stack direction="row" gap={1} alignItems="center" ml="auto">
          {!Boolean(snippet) ? (
            <>
              {!isLoading ? (
                <IconButton
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
                  onClick={() => setSaveData(true)}
                >
                  <Save fontSize="small" sx={{ color: 'white' }} />
                </IconButton>
              ) : (
                <CircularProgress size={20} />
              )}
            </>
          ) : (
            <Link href="/code">
              <IconButton>
                <Add sx={{ color: 'white' }} />
              </IconButton>
            </Link>
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
              disabled={!isSaved}
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
