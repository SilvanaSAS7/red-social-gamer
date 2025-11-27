const API_URL = '/api/castr';

export const createStream = async (name, region = 'US-West') => {
  const response = await fetch(`${API_URL}/streams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, region }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create stream');
  }

  return response.json();
};

export const getStream = async (id) => {
  const response = await fetch(`${API_URL}/streams/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get stream');
  }

  return response.json();
};
