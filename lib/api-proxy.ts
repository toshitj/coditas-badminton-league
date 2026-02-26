import axios from "axios";

// Use Next.js API proxy to avoid CORS issues
const API_URL = "/api/proxy";

export interface PlayerData {
  malePlayer1Name: string;
  malePlayer1Email: string;
  malePlayer2Name: string;
  malePlayer2Email: string;
  femalePlayer1Name: string;
  femalePlayer1Email: string;
  femalePlayer2Name: string;
  femalePlayer2Email: string;
}

export interface RegistrationData extends PlayerData {
  transactionId: string;
  paymentScreenshot: string;
}

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

export interface Team {
  teamName: string;
  malePlayer1: {
    name: string;
    email: string;
  };
  malePlayer2: {
    name: string;
    email: string;
  };
  femalePlayer1: {
    name: string;
    email: string;
  };
  femalePlayer2: {
    name: string;
    email: string;
  };
  transactionId?: string;
}

export const registerTeam = async (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    const payload = {
      action: "registerTeam",
      ...data,
    };
    
    const response = await axios.post<RegistrationResponse>(API_URL, payload, {
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
    const response = await axios.get<{
      success: boolean;
      message: string;
      data: {
        teams: Team[];
        totalTeams: number;
      };
    }>(`${API_URL}?action=getRegisteredTeams`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.teams;
    }
    throw new Error(response.data.message || "Failed to fetch teams");
  } catch (error) {
    console.error("Fetch teams error:", error);
    throw new Error("Failed to fetch teams. Please try again.");
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
