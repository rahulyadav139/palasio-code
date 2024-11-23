'use client';
import { IconButton, Typography, Stack } from '@mui/material';
import { useState, useRef, FC } from 'react';
import { Edit } from '@mui/icons-material';

interface ISnippetName {
  value: string;
  isEdit?: boolean;
  setValue?: (value: string) => void;
}

export const SnippetName: FC<ISnippetName> = ({ isEdit, value, setValue }) => {
  const [editSnippetName, setEditSnippetName] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Stack direction="row" gap={1} alignItems="center">
        {!editSnippetName && (
          <>
            {isEdit && (
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

            <Typography>{value}</Typography>
          </>
        )}

        {editSnippetName && isEdit && setValue && (
          <input
            ref={inputRef}
            defaultValue={value}
            onBlur={() => {
              setEditSnippetName(false);
              if (!inputRef.current?.value) return;

              setValue(inputRef.current.value);
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
      </Stack>
    </>
  );
};
