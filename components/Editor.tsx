'use client';

import { Box } from '@mui/material';
import React, { useState, FC, useCallback, useEffect, useMemo } from 'react';
import { basicSetup } from 'codemirror';
import { language } from '@codemirror/language';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { IEditor } from '@/types/IEditor';
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

const langHolder = new Compartment();

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

export const Editor: FC<IEditor> = ({
  doc,
  readonly,
  saveData,
  saveDataHandler,
  language: lang,
}) => {
  const [editor, setEditor] = useState<EditorView | null>(null);

  const editorContainer = useCallback(
    (node: HTMLElement) => {
      if (!node) return;

      if (editor) {
        editor.destroy();
      }

      const extensions = [
        keymap.of([indentWithTab]),
        oneDark,
        EditorView.editable.of(!readonly),
        placeholder('> Start typing here...'),
        langHolder.of([]),
      ];

      const initialState = EditorState.create({
        doc,
        extensions,
      });

      const view = new EditorView({
        state: initialState,
        parent: node,
      });

      if (!readonly) {
        view.focus();
      }

      setEditor(view);
    },
    [doc, readonly]
  );

  useEffect(() => {
    if (!editor) return;
    if (lang !== 'text') {
      const selectedLang = languages[lang];
      editor.dispatch({
        effects: langHolder.reconfigure([selectedLang(), basicSetup]),
      });
    } else {
      editor.dispatch({
        effects: langHolder.reconfigure([]),
      });
    }
  }, [lang, editor]);

  useEffect(() => {
    if (saveData && saveDataHandler) {
      saveDataHandler(editor?.state.doc.toString());
    }
  }, [saveData, saveDataHandler]);

  return (
    <Box
      sx={{ flex: '1 1 auto', p: 1 }}
      component="div"
      ref={editorContainer}
    />
  );
};
