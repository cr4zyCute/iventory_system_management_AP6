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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: { id: number; username: string };
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = 'Login failed';
    try {
      const data = JSON.parse(text);
      message = data?.message || message;
    } catch (_) {
      // ignore parse error, use default message
    }
    throw new Error(message);
  }
  return (await response.json()) as LoginResponse;
};
