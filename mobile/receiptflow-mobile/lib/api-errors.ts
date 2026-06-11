import axios from 'axios';

const extractMessage = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const candidates = [
    record.error,
    record.message,
    record.detail,
    record.title,
  ];

  for (const candidate of candidates) {
    const message = extractMessage(candidate);
    if (message) {
      return message;
    }
  }

  const nestedErrors = record.errors;
  if (typeof nestedErrors === 'string') {
    return nestedErrors.trim() || null;
  }

  if (Array.isArray(nestedErrors)) {
    const firstMessage = nestedErrors
      .map((item) => extractMessage(item))
      .find((item): item is string => Boolean(item));
    if (firstMessage) {
      return firstMessage;
    }
  }

  return null;
};

const statusMessages: Record<number, string> = {
  401: 'Incorrect email or password.',
  403: 'You do not have permission to access this.',
  404: 'Requested resource was not found.',
  409: 'This account already exists.',
  422: 'Please check your input fields.',
  500: 'User already exists .',
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {

  
  if (axios.isAxiosError(error)) {
    const responseMessage = extractMessage(error.response?.data);
    if (responseMessage) {
      return responseMessage;
    }

    const status = error.response?.status;
    if (status && statusMessages[status]) {
      return statusMessages[status];
    }
if (error.response?.status === 401) {
  return 'Email or password is incorrect';
}
    if (!error.response) {
      return 'No internet connection or server is unreachable.';
    }

    return fallbackMessage;
  }

  const message = extractMessage(error);
  return message ?? fallbackMessage;
};
