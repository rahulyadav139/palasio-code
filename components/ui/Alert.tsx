import { useAlert } from '@/hooks';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

export const Alert = () => {
  const { alert, setAlert } = useAlert();

  const handleClose = () => {
    setAlert(null);
  };

  if (!alert) return;

  return (
    <Snackbar
      open={Boolean(alert)}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ minWidth: 400 }}
    >
      <MuiAlert
        onClose={handleClose}
        severity={alert.type}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};
