import { useUser } from '@/hooks';
import { ISnippet } from '@/types';
import {
  Add,
  Edit,
  ForkRight,
  Home,
  PersonAdd,
  Save,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton as MuiIconButton,
  IconButtonProps,
  MenuItem,
  Select,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import langOptions from '@/assets/languageOptions.json';
import { SnippetShare } from './SnippetShare';
import { AddCollaborators } from './AddCollaborators';
import { ICollaborativeSnippet } from '@/types/ISnippet';
import Link from 'next/link';

type SnippetHeaderProps =
  //   | {
  //       editMode?: false;
  //       snippet: ISnippet;
  //       onFork?: () => void;
  //       loading?: boolean;
  //     }
  //   | {
  //       editMode: false;
  //       snippet: ISnippet;
  //       onFork: () => void;
  //       loading: boolean;
  //     }
  //   |
  {
    editMode: boolean;
    snippetInfo: { name: string; language: string };
    onSave?: () => void;
    onFork?: () => void;
    onAddCollaborators?: () => void;
    onEdit?: ({ name, language }: { name?: string; language?: string }) => void;
    loading?: boolean;
  };
export const SnippetHeader = (props: SnippetHeaderProps) => {
  const [editName, setEditName] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
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
        onClick={() => {
          const path = user ? '/home' : '/login';
          router.push(path);
        }}
      >
        <Home />
      </IconButton>

      {!editName && (
        <Stack direction="row" gap={1} alignItems="center">
          {props.editMode && (
            <IconButton
              onClick={() => setEditName(true)}
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

          <Typography>{props.snippetInfo.name}</Typography>
        </Stack>
      )}

      {props.editMode && editName && (
        <input
          ref={inputRef}
          defaultValue={props.snippetInfo.name}
          onBlur={() => {
            setEditName(false);
            if (!inputRef.current?.value) return;

            props.onEdit?.({ name: inputRef.current?.value! });
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
        {props.editMode && (
          <>
            {props.onAddCollaborators && (
              <IconButton onClick={props.onAddCollaborators}>
                <PersonAdd />
              </IconButton>
            )}
            <Select
              value={props.snippetInfo.language}
              onChange={e => props.onEdit?.({ language: e.target.value })}
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

            <IconButton
              title="Save"
              onClick={props.onSave}
              loading={props.loading}
            >
              <Save fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </>
        )}

        {!props.editMode && props.onFork && (
          <IconButton
            title="Fork"
            loading={props.loading}
            onClick={props.onFork}
          >
            <ForkRight />
          </IconButton>
        )}

        <Tooltip title="New">
          <MuiIconButton
            LinkComponent={Link}
            href="/snippet"
            sx={{
              '&:hover': {
                background: '#292C33',
              },
            }}
          >
            <Add sx={{ color: 'white' }} />
          </MuiIconButton>
        </Tooltip>

        <SnippetShare />
      </Stack>
    </Box>
  );
};

const IconButton = ({
  children,
  title,
  loading = false,
  ...props
}: IconButtonProps & { loading?: boolean }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 40,
      }}
    >
      {loading && <CircularProgress size={20} />}

      {!loading && (
        <Tooltip title={title}>
          <MuiIconButton
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
            {...props}
          >
            {children}
          </MuiIconButton>
        </Tooltip>
      )}
    </Box>
  );
};
