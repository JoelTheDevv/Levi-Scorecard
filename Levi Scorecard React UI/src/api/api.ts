const API_BASE_URL = "/api";

export async function getTeams() {
  const response = await fetch(
    `${API_BASE_URL}/teams`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  return response.json();
}

export async function getEmployees() {
  const response = await fetch(
    `${API_BASE_URL}/employees`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}

export async function getTodayScores() {
  const response = await fetch(
    `${API_BASE_URL}/scores/today`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch today's scores"
    );
  }

  return response.json();
}

export async function recordTransfer(
  employeeId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/scores/${employeeId}/transfer`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to record transfer"
    );
  }

  return response.json();
}

export async function undoTransfer(
  employeeId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/scores/${employeeId}/undotransfer`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to record transfer"
    );
  }

  return response.json();
}

export async function login(
  loginIdentifier: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginIdentifier,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid login credentials");
  }

  return response.json();
}

export function logout() {
  localStorage.removeItem('token');
}

export async function createTeam(name: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/teams`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create team");
  }

  return response.json();
}

export async function createEmployee(
  name: string,
  teamId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/employees`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        teamId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  return response.json();
}

export async function reassignEmployee(
  employeeId: number,
  teamId: number
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/employees/${employeeId}/team/${teamId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reassign employee");
  }

  return response.json();
}

export async function endDay() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/day/end`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to end day");
  }

  return response.json();
}

export async function getDayStatus() {
  const response = await fetch(`${API_BASE_URL}/day/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch day status");
  }

  return response.json();
}

export async function resetDay() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/day/reset`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to start new business day"
    );
  }

  return response.json();
}

export async function getDayResult() {
  const response = await fetch(
    `${API_BASE_URL}/day/result`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch day result");
  }

  return response.json();
}

export async function resumeDay() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/day/resume`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to start new business day"
    );
  }

  return response.json();
}