import { FC, useState, useLayoutEffect } from 'react';
import {
  Modal,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  TextField,
  Autocomplete,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ISnippetInfo } from './Snippet';
import langOptions from '@/asset/languageOptions.json';

interface ISnippetCustomization {
  open: boolean;
  onClose: () => void;
  setSnippetInfo: React.Dispatch<React.SetStateAction<ISnippetInfo>>;
}

export const SnippetCustomization: FC<ISnippetCustomization> = ({
  open,
  onClose,
  setSnippetInfo,
}) => {
  const [inputs, setInputs] = useState<ISnippetInfo>({
    name: '',
    language: 'text',
  });

  useLayoutEffect(() => {
    const [uid] = window.crypto.randomUUID().split('-');
    setInputs({ name: `snippet-${uid}`, language: 'text' });
  }, []);

  const inputHandler = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      open={open}
      sx={{
        outline: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          // height: 200,
          width: 'min(600px, 90%)',
          background: 'white',
          borderRadius: '10px',
          p: 2,
          outline: 'none',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" fontWeight="bold">
            Select Language
          </Typography>

          <IconButton
            sx={{
              top: 0,
              right: 0,
            }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography gutterBottom variant="body2" color="text.secondary">
          Snippet Name
        </Typography>
        <TextField
          onChange={e => inputHandler('name', e.target.value)}
          value={inputs.name}
          size="small"
          fullWidth
        />

        <Typography
          marginTop={2}
          gutterBottom
          variant="body2"
          color="text.secondary"
        >
          Language
        </Typography>
        <Autocomplete
          options={langOptions}
          onChange={(e, newValue) => {
            if (newValue === null) return;

            inputHandler('language', newValue.value);
          }}
          value={langOptions.find(el => el.value === inputs.language)}
          getOptionLabel={option => option.label}
          renderInput={params => <TextField {...params} size="small" />}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            );
          }}
        />
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button
            sx={{ textTransform: 'capitalize' }}
            disabled={!Boolean(inputs.name)}
            variant="contained"
            disableElevation
            onClick={() => {
              setSnippetInfo(inputs);
              onClose();
            }}
          >
            start coding
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
