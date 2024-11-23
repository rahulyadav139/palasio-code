'use client';

import { Editor } from '@/components';
import { useAlert } from '@/hooks';
import { Box } from '@mui/material';
import React, { FC, useRef, useState } from 'react';
import { ISnippet } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useError } from '@/hooks';
import axios from 'axios';
import { SnippetHeader } from './SnippetHeader';

interface SnippetType {
  snippet: ISnippet;
}

export const Snippet: FC<SnippetType> = ({ snippet }) => {
  const [snippetInfo, setSnippetInfo] = useState<{
    name: string;
    language: string;
  }>({ name: snippet.name, language: snippet.language });
  const router = useRouter();
  const path = usePathname();
  const { setSuccess } = useAlert();

  const { user } = useUser();
  const { errorHandler } = useError();
  const [isLoading, setIsLoading] = useState(false);

  const editor = useRef<{ getValue: () => string } | null>(null);

  const forkSnippetHandler = async () => {
    if (!user) {
      return router.push(encodeURI(`/login?redirect=${path}`));
    }

    try {
      setIsLoading(true);
      const [uid] = window.crypto.randomUUID().split('-');

      const payload: Record<string, string> = {
        data: snippet.data,
        author: user._id,
        original_uid: snippet.uid,
        language: snippet.language,
        name: `${snippet.name} (copy)`,
        uid,
      };

      await axios.post('/api/snippet', payload);

      setSuccess('Snippet forked!');

      router.push(`/snippet/${uid}`);
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSnippetHandler = async () => {
    try {
      setIsLoading(true);
      const { name, language } = snippetInfo;

      await axios.patch(`/api/user/snippets/${snippet._id}`, {
        name,
        language,
        data: editor.current?.getValue(),
      });
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  const readOnly = !user || snippet.author !== user._id;

  return (
    <Box
      sx={{
        height: '100dvh',
        background: '#292C33',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SnippetHeader
        snippetInfo={snippetInfo}
        editMode={!readOnly}
        onEdit={value => setSnippetInfo(prev => ({ ...prev, ...value }))}
        onFork={forkSnippetHandler}
        onSave={saveSnippetHandler}
        loading={isLoading}
      />
      <Editor
        ref={editor}
        key={snippet.uid}
        initialState={snippet.data}
        readonly={readOnly}
        language={snippetInfo.language}
      />
    </Box>
  );
};
