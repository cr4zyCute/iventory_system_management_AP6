interface TestResponse {
  message: string;
}

const API_BASE_URL = '/api';

export const testConnection = async (): Promise<TestResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json() as TestResponse;
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
};

// Add more API functions here as your backend grows
