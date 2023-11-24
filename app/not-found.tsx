import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography fontSize="5rem" fontWeight="bold" marginBottom="0.5rem">
        404
      </Typography>
      <Typography gutterBottom variant="body1">
        Page Not Found
      </Typography>
      <MuiLink variant="body2" component={Link} href="/home" underline="hover">
        Return Home
      </MuiLink>
    </Box>
  );
}
