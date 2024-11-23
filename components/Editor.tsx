'use client';

import { Box } from '@mui/material';
import React, {
  useState,
  FC,
  useCallback,
  useEffect,
  useImperativeHandle,
  memo,
  forwardRef,
} from 'react';
import { basicSetup, minimalSetup } from 'codemirror';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { IEditor } from '@/types';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { markdown } from '@codemirror/lang-markdown';
import { php } from '@codemirror/lang-php';
import { java } from '@codemirror/lang-java';
import { LanguageSupport } from '@codemirror/language';
import { randomColor } from '@/utils';
import { SocketIOProvider } from 'y-socket.io';
import * as Y from 'yjs';
// @ts-ignore
import { yCollab } from 'y-codemirror.next';

const extHolder = new Compartment();

const languages: Record<string, () => LanguageSupport> = {
  cpp,
  css,
  html,
  java,
  javascript,
  json,
  markdown,
  php,
  python,
  rust,
};

const color = randomColor();

export const Editor = memo(
  forwardRef(
    (
      { initialState, collaboration, readonly, language: lang }: IEditor,
      ref
    ) => {
      const [editor, setEditor] = useState<EditorView | null>(null);
      const [provider, setProvider] = useState<SocketIOProvider | null>(null);

      const [isInitialized, setIsInitialized] = useState(
        !Boolean(collaboration)
      );

      const websocketData = collaboration?.doc.toJSON()?.data;

      useEffect(() => {
        if (!isInitialized && editor) {
          if (websocketData && initialState !== websocketData) {
            editor?.dispatch({
              changes: {
                from: 0,
                to: editor.state.doc.length,
                insert: websocketData,
              },
            });

            setIsInitialized(true);
          }
        }
      }, [websocketData, isInitialized, editor]);

      useImperativeHandle(
        ref,
        () => ({
          getValue: () => editor?.state.doc.toString(),
        }),
        [editor]
      );

      useEffect(() => {
        if (!editor) return;

        const extensions: Extension[] = [];

        [
          EditorView.editable.of(!readonly),
          EditorState.readOnly.of(!!readonly),
          placeholder(readonly ? '' : '> Start typing here...'),
        ].forEach(ex => extensions.push(ex));

        if (lang !== 'text') {
          const selectedLang = languages[lang];
          extensions.push(selectedLang());

          if (!readonly) {
            extensions.push(basicSetup);
          } else {
            extensions.push(minimalSetup);
            extensions.push(lineNumbers());
          }
        }

        if (!readonly) {
          editor.focus();
        }

        if (readonly && provider) {
          provider?.awareness.setLocalStateField('user', {
            ...collaboration?.awareness,
            color: 'transparent',
          });
        }

        if (!readonly && provider) {
          provider?.awareness.setLocalStateField(
            'user',
            collaboration?.awareness
          );
        }

        editor.dispatch({
          effects: extHolder.reconfigure(extensions),
        });
      }, [lang, editor, readonly]);

      const editorContainer = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;

        if (editor) {
          editor.destroy();
        }

        const extensions = [
          keymap.of([indentWithTab]),
          oneDark,
          extHolder.of([]),
        ];

        if (collaboration && !provider) {
          const { doc, roomId } = collaboration;

          const ytext = doc.getText('data');

          const undoManager = new Y.UndoManager(ytext);

          const host = window.location.host;

          const socketProvider = new SocketIOProvider(
            `wss://palasio.in/api/socket`,
            roomId,
            doc,
            { autoConnect: true }
          );

          socketProvider.awareness.setLocalStateField('user', {
            name: 'Anonymous',
            color,
            ...collaboration.awareness,
          });

          socketProvider.socket.on('sync-step-1', () => {
            collaboration.onConnected?.();
          });

          setProvider(socketProvider);

          const ext = yCollab(ytext, socketProvider.awareness, {
            undoManager,
          });

          extensions.push(ext);
        }

        const state = EditorState.create({
          doc: initialState,
          extensions,
        });

        const view = new EditorView({
          state,
          parent: node,
        });

        setEditor(view);
      }, []);

      return (
        <>
          <Box
            sx={{ flex: '1 1 auto', m: 1 }}
            component="div"
            ref={editorContainer}
          />
        </>
      );
    }
  )
);
