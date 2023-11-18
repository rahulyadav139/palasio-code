'use client';
import { useTimeout, useUser } from '@/hooks';
import {
  Box,
  Collapse,
  Alert,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Close, Edit, Home, Login, Save, Share } from '@mui/icons-material';
import {
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { Editor } from '@/components/Editor';

import langOptions from '@/assets/languageOptions.json';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export interface ISnippetInfo {
  name: string;
  language: string;
}

const initialSnippetInfo: ISnippetInfo = {
  name: '',
  language: '',
};

export default function CreateSnippet() {
  const [isAlert, setIsAlert] = useTimeout(8);
  const [isShareTooltip, setIsShareTooltip] = useTimeout(2);
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snippetInfo, setSnippetInfo] =
    useState<ISnippetInfo>(initialSnippetInfo);
  const [editSnippetName, setEditSnippetName] = useState<boolean>(false);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [isSavedSnippet, setIsSavedSnippet] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    const [uid] = window.crypto.randomUUID().split('-');
    setSnippetId(uid);
    setSnippetInfo({ name: `snippet-${uid}`, language: 'text' });
  }, []);

  const saveSnippetHandler: any = useCallback(
    async (data: string) => {
      try {
        setIsLoading(true);

        if (!isSavedSnippet) {
          const payload: Record<string, string> = {
            data,
            uid: snippetId!,
            ...snippetInfo,
          };

          if (user) {
            payload.author = user._id;
          }

          await axios.post('/api/snippet', payload);

          window.history.replaceState(null, 'Page', `/snippet/${snippetId!}`);

          setIsSavedSnippet(true);
          setIsAlert(true);
        } else {
          const payload = {
            data,
            ...snippetInfo,
          };

          // if()
          await axios.patch(`/api/snippet/${snippetId}`, {
            data,
            ...snippetInfo,
          });
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

        {!editSnippetName ? (
          <Stack direction="row" gap={1} alignItems="center">
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

            <Typography>{snippetInfo?.name}</Typography>
          </Stack>
        ) : (
          <input
            ref={inputRef}
            defaultValue={snippetInfo?.name}
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

        <Stack direction="row" gap={1} alignItems="center" ml="auto">
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
          <Box sx={{ minWidth: 35, display: 'flex', justifyContent: 'center' }}>
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
              disabled={!isSavedSnippet}
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
        doc={''}
        saveData={saveData}
        language={snippetInfo.language}
        saveDataHandler={saveSnippetHandler}
      />
    </Box>
  );
}
