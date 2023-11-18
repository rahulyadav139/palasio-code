import axios, { AxiosError } from 'axios';
import { useAlert } from './useAlert';
import { useState } from 'react';

export const useError = () => {
  const { setError } = useAlert();
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const errorHandler = (err: AxiosError | unknown, message?: string) => {
    let errorMessage: string | undefined;

    if (axios.isAxiosError(err)) {
      if (err.response) {
        const status = err.response.status;

        setStatusCode(status);

        if (status >= 500) {
          errorMessage = 'Internal server error';
        } else if (status === 400) {
          errorMessage = 'Bad request';
        }
      } else {
        setStatusCode(0);
        errorMessage = 'Network error';
      }
    } else {
      setStatusCode(-1);
      errorMessage = 'Unexpected error';
    }

    if (message) {
      errorMessage = message;
    }

    if (errorMessage) {
      setError(errorMessage);
    }
  };

  const getStatusCode = () => statusCode;

  return { getStatusCode, errorHandler };
};
