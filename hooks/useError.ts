import axios, { AxiosError } from 'axios';
import { useAlert } from './useAlert';

export const useError = () => {
  const { setError } = useAlert();

  const errorHandler = (err: AxiosError | unknown, message?: string) => {
    let errorMessage: string | undefined;

    const status = getStatusCode(err);

    if (status >= 500) {
      errorMessage = 'Internal server error';
    } else if (status === 400) {
      errorMessage = 'Bad request';
    } else if (status === 0) {
      errorMessage = 'Network error';
    } else if (status === -1) {
      errorMessage = 'Unexpected error';
    }

    if (message) {
      errorMessage = message;
    }

    if (errorMessage) {
      setError(errorMessage);
    }
  };

  const getStatusCode = (err: AxiosError | unknown) => {
    let status: number | undefined;
    if (axios.isAxiosError(err)) {
      if (err.response) {
        status = err.response.status;
      } else {
        status = 0;
      }
    } else {
      status = -1;
    }

    return status;
  };

  return { getStatusCode, errorHandler };
};
