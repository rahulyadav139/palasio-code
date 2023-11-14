'use client';
import { Editor } from '@/components/Editor';
import { useTimeout } from '@/hooks';
import { Add, Close, Edit, Save, Share } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Tooltip,
  Select,
  MenuItem,
  Collapse,
  Alert,
} from '@mui/material';
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import langOptions from '@/asset/languageOptions.json';

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
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const [isShareTooltip, setIsShareTooltip] = useTimeout(2);
  const [isAlert, setIsAlert] = useTimeout(8);
  const [editSnippetName, setEditSnippetName] = useState<boolean>(false);

  const [snippetInfo, setSnippetInfo] = useState<ISnippetInfo>({
    name: snippet?.name ?? '',
    language: snippet?.language ?? 'text',
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (snippet) return;
    const [uid] = window.crypto.randomUUID().split('-');
    setSnippetInfo(prev => ({ ...prev, name: `snippet-${uid}` }));
  }, [snippet]);

  const saveSnippetHandler: any = useCallback(
    async (data: string) => {
      try {
        setIsLoading(true);

        if (!snippetId) {
          const [uid] = window.crypto.randomUUID().split('-');

          const payload: Record<string, string> = {
            data,
            uid,
            ...snippetInfo,
          };

          const res = await fetch('/api/snippet', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('something went wrong');

          window.history.replaceState(null, 'Page', `/snippet/${uid}`);
          setSnippetId(uid);
          setIsAlert(true);
        } else {
          const res = await fetch(`/api/snippet/${snippetId}`, {
            method: 'PATCH',
            body: JSON.stringify({ data, ...snippetInfo }),
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
      <Collapse in={Boolean(isAlert)}>
        <Alert
          variant="filled"
          severity="warning"
          sx={{
            borderRadius: 0,
            p: 0,
            px: 2,
            fontSize: '0.8rem',
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setIsAlert(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          This snippet will be deleted in a week!
        </Alert>
      </Collapse>
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
                {!Boolean(snippet) && (
                  <IconButton
                    onClick={() => setEditSnippetName(true)}
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
                    <Edit sx={{ fontSize: '1rem' }} />
                  </IconButton>
                )}
                <Typography>{snippetInfo.name}</Typography>
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
              <Select
                value={snippetInfo.language}
                onChange={e =>
                  setSnippetInfo(prev => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  background: '#292C33',
                  color: 'white',
                  minWidth: 100,
                  fontSize: '0.7rem',
                  '& .MuiPaper-root': {
                    minWidth: 100,
                  },
                  '& .MuiSelect-icon': {
                    color: 'white',
                  },
                }}
              >
                {langOptions.map(el => (
                  <MenuItem
                    sx={{
                      fontSize: '0.8rem',
                    }}
                    key={el.value}
                    value={el.value}
                  >
                    {el.label}
                  </MenuItem>
                ))}
              </Select>
              <Box
                sx={{ minWidth: 35, display: 'flex', justifyContent: 'center' }}
              >
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
              </Box>
            </>
          ) : (
            <Link href="/snippet">
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
            open={isShareTooltip}
            placement="bottom"
          >
            <IconButton
              onClick={() => {
                setIsShareTooltip(true);
                navigator.clipboard.writeText(window.location.href);
              }}
              disabled={!snippetId && !Boolean(snippet)}
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
    </Box>
  );
};
