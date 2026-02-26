import axios from "axios";

// Using Next.js API proxy to avoid CORS issues
const API_URL = "/api/proxy";
const REGISTRATION_API_URL = "/api/register";

export type RegistrationPayload = Record<string, string>;

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    teamName: string;
    stats: {
      totalTeams: number;
      registeredTeams: number;
      availableTeams: number;
    };
  };
}

export interface TeamPlayer {
  name: string;
  email: string;
}

export interface Team {
  teamName: string;
  players: TeamPlayer[];
}

export const registerTeam = async (
  payload: RegistrationPayload
): Promise<RegistrationResponse> => {
  try {
    const response = await axios.post<RegistrationResponse>(REGISTRATION_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to register team. Please try again.");
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const cache_bust = Date.now();
    const response = await axios.get<{
      success: boolean;
      totalTeams: number;
      teams: Team[];
      isRegistrationClosed?: boolean;
    }>(`/api/teams?_ts=${cache_bust}`);
    
    if (response.data.success && Array.isArray(response.data.teams)) {
      return response.data.teams;
    }
    throw new Error("Failed to fetch teams");
  } catch (error) {
    console.error("Fetch teams error:", error);
    throw new Error("Failed to fetch teams. Please try again.");
  }
};

export const fetchIsRegistrationClosed = async (): Promise<boolean> => {
  try {
    const cache_bust = Date.now();
    const response = await axios.get<{
      success: boolean;
      isRegistrationClosed?: boolean;
    }>(`/api/teams?_ts=${cache_bust}`);

    if (!response.data?.success) return false;
    return response.data.isRegistrationClosed === true;
  } catch (error) {
    console.error("Fetch registration status error:", error);
    return false;
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
