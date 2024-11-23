'use client';

import { useAlert } from '@/hooks';
import { Collaborator, ICollaborativeSnippet } from '@/types/ISnippet';
import { debounce } from '@/utils';
import { Close, Undo } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Modal,
  Box,
  Typography,
  Divider,
  Stack,
  Autocomplete,
  TextField,
  CircularProgress,
  AutocompleteInputChangeReason,
  Chip,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';

interface IAddCollaborators {
  isModal: boolean;
  onClose: () => void;
  onUpdate: (updated: Collaborator[]) => void;
  snippet: ICollaborativeSnippet;
}

export const AddCollaborators: FC<IAddCollaborators> = ({
  isModal,
  onClose,
  snippet,
  onUpdate,
}) => {
  const [addCollaborators, setAddCollaborators] = useState<Collaborator[]>([]);
  const [removeCollaborators, setRemoveCollaborators] = useState<string[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Collaborator[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { setSuccess, setError, setWarning } = useAlert();
  const [isUpdatingCollaborators, setIsUpdatingCollaborators] =
    useState<boolean>(false);

  const collaborators = (snippet.collaborators ?? []).filter(
    collaborator => collaborator._id !== snippet.author
  );

  // const loading = open && options.length === 0;

  const fetchData = async (value: string) => {
    try {
      setIsLoading(true);

      const { data } = await axios.get(`/api/users?query=${value}`);

      setOptions(
        data.users.filter((user: Collaborator) => user._id !== snippet.author)
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handler = useMemo(() => {
    return debounce((value: string) => {
      if (!value) return;

      fetchData(value);
    });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    handler(searchQuery);
  }, [searchQuery, handler]);

  useEffect(() => {
    if (open) return;

    setOptions([]);
  }, [open]);

  const inputChangeHandler = (
    e: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setSearchQuery(value);
  };

  const handleCollaborators = async () => {
    try {
      const add = addCollaborators.map(user => user._id);

      if (Boolean(add.length) && snippet.collaborators.length === 5) {
        return setWarning('Maximum 5 collaborators allowed!');
      }
      const payload: Record<string, string[]> = {
        add,
        remove: removeCollaborators,
      };

      setIsUpdatingCollaborators(true);

      await axios.patch(
        `/api/user/snippets/${snippet._id}/collaborators`,
        payload
      );

      const collaborators: Collaborator[] = JSON.parse(
        JSON.stringify(snippet.collaborators)
      );

      const updatedCollaborators = collaborators
        .filter(collaborator => !removeCollaborators.includes(collaborator._id))
        .concat(addCollaborators);

      onUpdate(updatedCollaborators);

      setAddCollaborators([]);
      setRemoveCollaborators([]);

      onClose();

      setSuccess('Access updated');
    } catch (err) {
      setError('Internal server error');
      console.log(err);
    } finally {
      setIsUpdatingCollaborators(false);
    }
  };

  return (
    <Modal
      slotProps={{
        backdrop: {
          sx: {
            outline: 'none',
          },
        },
      }}
      open={isModal}
      onClose={onClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          background: 'white',
          p: 2,
          borderRadius: '10px',
          minWidth: 'min(600px, 90%)',
          maxWidth: 600,
          height: '100%',
          maxHeight: 300,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography fontWeight="bold" gutterBottom>
          Add Collaborators
        </Typography>
        <Divider />
        <Autocomplete
          multiple
          open={open && !!options.length}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          id="collaborators-input"
          options={options}
          isOptionEqualToValue={(option, value) => option.email === value.email}
          value={addCollaborators}
          onChange={(event, newValue, reason) => {
            if (reason === 'clear') {
              return setAddCollaborators([]);
            }

            setAddCollaborators(newValue);
          }}
          getOptionLabel={option => option.email}
          onInputChange={inputChangeHandler}
          inputValue={searchQuery}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.name ?? option.email}
                {...getTagProps({ index })}
                key={option._id}
              />
            ))
          }
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Name or Email"
              sx={{ overflowX: 'auto' }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {open && isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              <Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
              >
                <Typography variant="body1">{option.name ?? '-'}</Typography>
                <Typography variant="body2">{option.email}</Typography>
              </Stack>
            </li>
          )}
        />
        {!Boolean(collaborators.length) ? (
          <Typography
            variant="body2"
            marginTop={1}
            component="div"
            align="center"
          >
            No users!
          </Typography>
        ) : (
          <Box sx={{ p: 1, px: 1 }}>
            {collaborators.map(collaborator => {
              const isRemoved = removeCollaborators.includes(collaborator._id);
              return (
                <Stack
                  key={collaborator._id}
                  direction="row"
                  alignItems="center"
                  gap={1}
                >
                  <Typography color={isRemoved ? 'error' : 'default'}>
                    {collaborator.name ?? '-'}
                  </Typography>
                  <Typography variant="body2" ml="auto">
                    {collaborator.email}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      if (isRemoved) {
                        setRemoveCollaborators(prev =>
                          prev.filter(el => el !== collaborator._id)
                        );
                      } else {
                        setRemoveCollaborators(prev =>
                          prev.concat(collaborator._id)
                        );
                      }
                    }}
                    size="small"
                  >
                    {isRemoved ? (
                      <Undo fontSize="small" />
                    ) : (
                      <Close fontSize="small" />
                    )}
                  </IconButton>
                </Stack>
              );
            })}
          </Box>
        )}

        <Stack direction="row" justifyContent="flex-end" mt="auto">
          <LoadingButton
            loading={isUpdatingCollaborators}
            disabled={
              !Boolean(removeCollaborators.length) &&
              !Boolean(addCollaborators.length)
            }
            variant="contained"
            disableElevation
            sx={{ textTransform: 'initial', px: 3 }}
            onClick={handleCollaborators}
          >
            Add
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  );
};
