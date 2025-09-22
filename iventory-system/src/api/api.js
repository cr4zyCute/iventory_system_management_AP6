const API_BASE_URL = '/api';

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
};
