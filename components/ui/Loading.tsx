import { Box } from '@mui/material';
import Image from 'next/image';

export const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
      }}
    >
      <Image width={500} height={80} src="/loading.svg" alt="loading" />
    </Box>
  );
};
