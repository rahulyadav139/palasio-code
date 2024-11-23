import { UserSnippets } from '@/components';

import { Box, Divider, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body1" fontWeight="bold">
        Your Snippets
      </Typography>

      <Divider />
      <UserSnippets />
    </Box>
  );
}
