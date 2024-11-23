'use client';
import { useTimeout, useUser, useError, useAlert } from '@/hooks';
import { Box, Collapse, Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useLayoutEffect, useRef } from 'react';
import { Editor } from '@/components';
import axios from 'axios';
import { SnippetHeader } from '@/components/SnippetHeader';

export interface ISnippetInfo {
  name: string;
  language: string;
  uid: string;
}

const initialSnippetInfo: ISnippetInfo = {
  name: '',
  language: '',
  uid: '',
};

export default function CreateSnippet() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snippetInfo, setSnippetInfo] =
    useState<ISnippetInfo>(initialSnippetInfo);
  const [isSavedSnippet, setIsSavedSnippet] = useState<boolean>(false);
  const [isAlert, setIsAlert] = useTimeout(8);

  const { user } = useUser();
  const { setError } = useAlert();
  const { errorHandler } = useError();

  const editor = useRef<{ getValue: () => string } | null>(null);

  useLayoutEffect(() => {
    const [uid] = window.crypto.randomUUID().split('-');

    setSnippetInfo({ name: `snippet-${uid}`, language: 'text', uid });
  }, []);

  const saveSnippetHandler = async () => {
    const data = editor.current?.getValue() ?? '';

    if (!isSavedSnippet && !data.trim()) return setError('Empty snippet!');

    try {
      setIsLoading(true);

      if (!isSavedSnippet) {
        const payload: Record<string, string> = {
          data,
          ...snippetInfo,
        };

        if (user) {
          payload.author = user._id;
        }

        await axios.post('/api/snippet', payload);

        window.history.replaceState(
          null,
          'Page',
          `/snippet/${snippetInfo.uid}`
        );

        setIsSavedSnippet(true);

        setIsAlert(!user);
      } else {
        const { uid, ...metadata } = snippetInfo;
        const payload: Record<string, string> = {
          data,
          ...metadata,
        };

        await axios.patch(`/api/snippet/${snippetInfo.uid}`, payload);
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

      <SnippetHeader
        editMode
        onEdit={value => setSnippetInfo(prev => ({ ...prev, ...value }))}
        snippetInfo={{ name: snippetInfo.name, language: snippetInfo.language }}
        onSave={saveSnippetHandler}
        loading={isLoading}
      />
      <Editor ref={editor} language={snippetInfo.language} />
    </Box>
  );
}
