import { Box, Button, Chip, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          Palasio
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* <Link href="/login">
            <Button size="small" variant="contained" disableElevation>
              Login
            </Button>
          </Link> */}
          {/* <Link href="/singup">
            <Button size="small" disableElevation>
              Signup
            </Button>
          </Link> */}
          <Link href="/code">
            <Chip variant="outlined" label="Create" />
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
