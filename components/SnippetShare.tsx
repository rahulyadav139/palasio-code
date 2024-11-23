'use client';
import { Tooltip, IconButton } from '@mui/material';
import { Share } from '@mui/icons-material';
import { useTimeout } from '@/hooks';

export const SnippetShare = () => {
  const [isShareTooltip, setIsShareTooltip] = useTimeout(2);
  return (
    <Tooltip
      title="Link copied!"
      disableFocusListener
      disableHoverListener
      disableTouchListener
      open={isShareTooltip}
      placement="bottom"
    >
      <IconButton
        onClick={() => {
          setIsShareTooltip(true);
          navigator.clipboard.writeText(window.location.href);
        }}
        // disabled={!isSavedSnippet}
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
        <Share sx={{ fontSize: '1.2rem' }} />
      </IconButton>
    </Tooltip>
  );
};
