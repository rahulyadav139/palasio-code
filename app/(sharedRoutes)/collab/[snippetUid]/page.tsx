'use client';

import { AddCollaborators, Editor, Loading, SnippetName } from '@/components';
import { Box, CircularProgress, Modal } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useError, useUser } from '@/hooks';
import NotFound from '@/app/not-found';
import { Collaborator } from '@/types/ISnippet';
import { ICollaborativeSnippet } from '@/types/ISnippet';
import { SnippetHeader } from '@/components/SnippetHeader';
import * as Y from 'yjs';

const ydoc = new Y.Doc();

interface Snippet {
  _id: string;
  name: string;
  language: string;
  collaborators: Collaborator[];
  uid: string;
  author: string;
}

const initialSnippetData: Snippet = {
  name: '',
  language: 'text',
  collaborators: [],
  _id: '',
  uid: '',
  author: '',
};

export default function Collaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [snippet, setSnippet] = useState<Snippet>(initialSnippetData);

  const { user } = useUser();
  const { errorHandler } = useError();
  const params = useParams();
  const snippetUid = params?.snippetUid;

  const editor = useRef<{ getValue: () => string } | null>(null);

  const updateSnippet = <T extends keyof Snippet>(
    key: T,
    value: Snippet[T]
  ) => {
    setSnippet(prev => ({ ...prev, [key]: value }));

    const ymap = ydoc.getMap('meta');

    ymap.set(key, value);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `/api/snippet/${snippetUid}?isCollaborative=true`
        );

        const snippet = data.snippet;

        const initialData = {
          _id: snippet._id,
          collaborators: snippet.collaborators,
          uid: snippet.uid,
          name: snippet.name,
          language: snippet.language,
          author: snippet.author,
        };

        const ymap = ydoc.getMap('meta');

        setSnippet(initialData);

        ymap.observe(() => {
          setSnippet(prev => Object.assign({}, prev, ymap.toJSON()));
        });

        setInitialData(data.snippet.data);
        await axios.get('/api/socket');
      } catch (err) {
        errorHandler(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveSnippetHandler = async () => {
    try {
      setIsSaving(true);

      const payload: Partial<ICollaborativeSnippet> = {
        data: editor.current?.getValue(),
        language: snippet.language,
        name: snippet.name,
      };

      await axios.patch(`/api/user/snippets/${snippet._id}`, payload);
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsSaving(false);
    }
  };

  const { isAuthor, readonly } = useMemo(() => {
    const isAuthor = snippet.author === user?._id;
    const isCollaborator = snippet.collaborators?.some(
      collaborator => collaborator._id === user?._id
    );
    const readonly = (!isAuthor && !isCollaborator) ?? true;

    return { isAuthor, readonly };
  }, [snippet, user]);

  if (isLoading) return <Loading />;

  if (isError) return <NotFound />;

  return (
    <>
      <Box
        sx={{
          height: '100dvh',
          background: '#292C33',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SnippetHeader
          snippetInfo={{
            name: snippet.name!,
            language: snippet.language!,
          }}
          editMode={!readonly}
          onEdit={({ name, language }) => {
            name && updateSnippet('name', name);
            language && updateSnippet('language', language);
          }}
          onSave={saveSnippetHandler}
          {...(isAuthor && {
            onAddCollaborators: () => setIsModal(true),
          })}
          loading={isSaving}
        />

        <Editor
          ref={editor}
          key={snippetUid as string}
          initialState={initialData}
          readonly={readonly}
          language={snippet.language}
          collaboration={{
            doc: ydoc,
            roomId: snippet.uid,
            awareness: {
              name: user?.name,
            },
            onConnected: () => {
              setIsConnected(true);
            },
          }}
        />
      </Box>
      {isAuthor && (
        <AddCollaborators
          snippet={snippet as any as ICollaborativeSnippet}
          onUpdate={updated => updateSnippet('collaborators', updated)}
          isModal={isModal}
          onClose={() => setIsModal(false)}
        />
      )}

      {!isConnected && (
        <Modal
          open={!isConnected}
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: 'blur(5px)',
              },
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100dvh',
              outline: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        </Modal>
      )}
    </>
  );
}
