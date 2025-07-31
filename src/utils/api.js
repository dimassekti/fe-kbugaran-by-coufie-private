const BASE_URL = "http://localhost:5000";

// Error categorization helper
function categorizeAPIError(status, message) {
  // Categorize errors based on HTTP status codes and message content
  if (status >= 400 && status < 500) {
    if (status === 401) return "warning";
    if (status === 403) return "warning";
    if (status === 404) return "info";
    if (
      status === 409 ||
      message?.includes("already exists") ||
      message?.includes("unique") ||
      message?.includes("constraint")
    )
      return "warning";
    return "error"; // Other 4xx errors (like validation errors)
  }

  if (status >= 500) {
    return "error"; // Server errors
  }

  return "error"; // Default to error for unknown cases
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function putAccessToken(accessToken) {
  return localStorage.setItem("accessToken", accessToken);
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function putRefreshToken(refreshToken) {
  return localStorage.setItem("refreshToken", refreshToken);
}

async function checkBackendStatus() {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function showConnectionError() {
  return {
    error: true,
    message:
      "Cannot connect to server. Please check if the backend is running on http://localhost:5000",
  };
}

function removeTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return { error: true, message: "No refresh token available" };
  }

  const response = await fetch(`${BASE_URL}/authentications`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, message: responseJson.message };
  }

  putAccessToken(responseJson.data.accessToken);
  return { error: false, data: responseJson.data };
}

async function fetchWithToken(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  // If token expired, try to refresh and retry
  if (response.status === 401) {
    const refreshResult = await refreshAccessToken();
    if (!refreshResult.error) {
      // Retry the original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
    }
  }

  return response;
}

async function login({ username, password }) {
  try {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      // Handle specific error types
      if (responseJson.message.includes("username")) {
        return {
          error: true,
          message: "Username is required. Please enter your username.",
        };
      } else if (responseJson.message.includes("password")) {
        return {
          error: true,
          message: "Password is required. Please enter your password.",
        };
      } else if (responseJson.message.includes("credentials")) {
        return {
          error: true,
          message: "Invalid username or password. Please try again.",
        };
      }

      return { error: true, message: responseJson.message };
    }

    // Store both access and refresh tokens
    putAccessToken(responseJson.data.accessToken);
    putRefreshToken(responseJson.data.refreshToken);

    return { error: false, data: responseJson.data };
  } catch (error) {
    // Network or connection error
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

async function register({ username, password, fullname }) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, fullname }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      // Handle specific error types
      if (responseJson.message.includes("username")) {
        return {
          error: true,
          message:
            "Username is required or already exists. Please choose a different username.",
        };
      } else if (responseJson.message.includes("password")) {
        return {
          error: true,
          message: "Password is required. Please enter a valid password.",
        };
      } else if (responseJson.message.includes("fullname")) {
        return {
          error: true,
          message: "Full name is required. Please enter your full name.",
        };
      }

      return { error: true, message: responseJson.message };
    }

    return { error: false };
  } catch (error) {
    // Network or connection error
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred during registration. Please try again.",
    };
  }
}

async function logout() {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      console.error("Logout error:", responseJson.message);
    }
  }

  // Always remove tokens from localStorage regardless of server response
  removeTokens();
  return { error: false };
}

async function getUserLogged() {
  const response = await fetchWithToken(`${BASE_URL}/users/me`);
  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function addNote({ title, body }) {
  const response = await fetchWithToken(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getActiveNotes() {
  const response = await fetchWithToken(`${BASE_URL}/notes`);
  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getArchivedNotes() {
  const response = await fetchWithToken(`${BASE_URL}/notes/archived`);
  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getNote(id) {
  const response = await fetchWithToken(`${BASE_URL}/notes/${id}`);
  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function archiveNote(id) {
  const response = await fetchWithToken(`${BASE_URL}/notes/${id}/archive`, {
    method: "POST",
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function unarchiveNote(id) {
  const response = await fetchWithToken(`${BASE_URL}/notes/${id}/unarchive`, {
    method: "POST",
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function deleteNote(id) {
  const response = await fetchWithToken(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

// Event API functions
async function addEvent({
  name,
  description,
  date,
  location,
  organizer,
  capacity,
  category,
}) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        date,
        location,
        organizer,
        capacity,
        category,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding event. Please try again.",
    };
  }
}

async function getEvents() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/events`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: null, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: null,
      message:
        "An unexpected error occurred while fetching events. Please try again.",
    };
  }
}

async function getEventById(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/events/${id}`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: null, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: null,
      message:
        "An unexpected error occurred while fetching event. Please try again.",
    };
  }
}

async function updateEvent(
  id,
  { name, description, date, location, organizer, capacity, category }
) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        date,
        location,
        organizer,
        capacity,
        category,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while updating event. Please try again.",
    };
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while deleting event. Please try again.",
    };
  }
}

// TEKNIK-MU1 , tampilkan peserta event
async function getEventParticipants(eventId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/participants`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: [], message: responseJson.message };
    }

    return { error: false, data: responseJson.data || [] };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching event participants. Please try again.",
    };
  }
}

async function addEventParticipant(eventId, { userId, role }) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/participants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      }
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding event participant. Please try again.",
    };
  }
}

async function getParticipantById(participantId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/participants/${participantId}`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data.participant };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while fetching participant details. Please try again.",
    };
  }
}

async function getParticipantMedicalStatus(eventId, userId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/checkups/${userId}`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while fetching medical status. Please try again.",
    };
  }
}

async function createParticipantCheckup(eventId, checkupData) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/checkups`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkupData),
      }
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while creating checkup. Please try again.",
    };
  }
}

async function updateParticipantCheckup(eventId, userId, checkupData) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/checkups/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkupData),
      }
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while updating checkup. Please try again.",
    };
  }
}

async function getAllUsers() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/users`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: [], message: responseJson.message };
    }

    return { error: false, data: responseJson.data || [] };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching users. Please try again.",
    };
  }
}

async function getUserByUsername(username) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/users/username/${encodeURIComponent(username)}`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: null, message: responseJson.message };
    }

    return { error: false, data: responseJson.data.user };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: null,
      message:
        "An unexpected error occurred while fetching user by username. Please try again.",
    };
  }
}

// Hospital API functions
async function getHospitals() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hospitals`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      // Enhanced error categorization
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );
      return {
        error: true,
        data: [],
        message: responseJson.message,
        type: errorType,
      };
    }

    // Backend returns data.hospitals, but frontend expects data to be the array
    const hospitalsArray =
      responseJson.data?.hospitals || responseJson.data || [];
    return { error: false, data: hospitalsArray };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching hospitals. Please try again.",
      type: "error",
    };
  }
}

async function getHospitalById(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hospitals/${id}`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );
      return {
        error: true,
        data: null,
        message: responseJson.message,
        type: errorType,
      };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: null,
      message:
        "An unexpected error occurred while fetching hospital. Please try again.",
      type: "error",
    };
  }
}

async function addHospital(payload) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hospitals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );

      // Enhanced error message for validation or constraint violations
      let enhancedMessage = responseJson.message;
      if (
        response.status === 409 ||
        responseJson.message.includes("already exists") ||
        responseJson.message.includes("unique")
      ) {
        enhancedMessage = `A hospital with this information already exists. Please check the name and try again.`;
      } else if (response.status === 400) {
        enhancedMessage = `Please check your input: ${responseJson.message}`;
      }

      return {
        error: true,
        message: enhancedMessage,
        type: errorType,
      };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding hospital. Please try again.",
      type: "error",
    };
  }
}

async function updateHospital(id, payload) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hospitals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );

      // Enhanced error message for validation or constraint violations
      let enhancedMessage = responseJson.message;
      if (
        response.status === 409 ||
        responseJson.message.includes("already exists") ||
        responseJson.message.includes("unique")
      ) {
        enhancedMessage = `A hospital with this information already exists. Please check the name and try again.`;
      } else if (response.status === 400) {
        enhancedMessage = `Please check your input: ${responseJson.message}`;
      } else if (response.status === 404) {
        enhancedMessage = `Hospital not found. It may have been deleted by another user.`;
      }

      return {
        error: true,
        message: enhancedMessage,
        type: errorType,
      };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while updating hospital. Please try again.",
      type: "error",
    };
  }
}

async function deleteHospital(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hospitals/${id}`, {
      method: "DELETE",
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );

      // Enhanced error message for deletion scenarios
      let enhancedMessage = responseJson.message;
      if (response.status === 404) {
        enhancedMessage = `Hospital not found. It may have already been deleted.`;
      } else if (
        response.status === 409 ||
        responseJson.message.includes("constraint") ||
        responseJson.message.includes("reference")
      ) {
        enhancedMessage = `Cannot delete hospital as it has associated data (staff, events, etc.). Please remove all related data first.`;
      } else if (response.status === 403) {
        enhancedMessage = `You don't have permission to delete this hospital.`;
      }

      return {
        error: true,
        message: enhancedMessage,
        type: errorType,
      };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while deleting hospital. Please try again.",
      type: "error",
    };
  }
}

async function getHospitalStaff(hospitalId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/hospitals/${hospitalId}/staff`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: [], message: responseJson.message };
    }

    return { error: false, data: responseJson.data || [] };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching hospital staff. Please try again.",
    };
  }
}

async function addHospitalStaff(hospitalId, payload) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/hospitals/${hospitalId}/staff`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding hospital staff. Please try again.",
    };
  }
}

async function updateHospitalStaff(staffId, payload) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/hospitals/staff/${staffId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while updating hospital staff. Please try again.",
    };
  }
}

async function deleteHospitalStaff(staffId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/hospitals/staff/${staffId}`,
      {
        method: "DELETE",
      }
    );

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while deleting hospital staff. Please try again.",
    };
  }
}

async function getEventMedicalStaff(eventId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/medical-staff`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: [], message: responseJson.message };
    }

    return { error: false, data: responseJson.data || [] };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching event medical staff. Please try again.",
    };
  }
}

async function addEventMedicalStaff(eventId, payload) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/medical-staff`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding event medical staff. Please try again.",
    };
  }
}

async function deleteEventMedicalStaff(staffId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/medical-staff/${staffId}`,
      {
        method: "DELETE",
      }
    );

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, message: responseJson.message };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while deleting event medical staff. Please try again.",
    };
  }
}

async function getAvailableStaffForEvent(eventId) {
  try {
    const response = await fetchWithToken(
      `${BASE_URL}/events/${eventId}/available-staff`
    );
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      return { error: true, data: [], message: responseJson.message };
    }

    return { error: false, data: responseJson.data || [] };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      data: [],
      message:
        "An unexpected error occurred while fetching available staff. Please try again.",
    };
  }
}

async function addUserByAdmin(payload) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      const errorType = categorizeAPIError(
        response.status,
        responseJson.message
      );

      // Enhanced error message for validation or constraint violations
      let enhancedMessage = responseJson.message;
      if (
        response.status === 409 ||
        responseJson.message.includes("already exists") ||
        responseJson.message.includes("unique")
      ) {
        enhancedMessage = `A user with this username already exists. Please choose a different username.`;
      } else if (response.status === 400) {
        enhancedMessage = `Please check your input: ${responseJson.message}`;
      } else if (response.status === 403) {
        enhancedMessage = `You don't have permission to create users with this role.`;
      }

      return {
        error: true,
        message: enhancedMessage,
        type: errorType,
      };
    }

    return { error: false, data: responseJson.data };
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return showConnectionError();
    }

    return {
      error: true,
      message:
        "An unexpected error occurred while adding user. Please try again.",
      type: "error",
    };
  }
}

export {
  getAccessToken,
  putAccessToken,
  getRefreshToken,
  putRefreshToken,
  removeTokens,
  refreshAccessToken,
  checkBackendStatus,
  showConnectionError,
  login,
  register,
  logout,
  getUserLogged,
  addNote,
  getActiveNotes,
  getArchivedNotes,
  getNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  addEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  addEventParticipant,
  getParticipantById,
  getParticipantMedicalStatus,
  createParticipantCheckup,
  updateParticipantCheckup,
  getAllUsers,
  getUserByUsername,
  getHospitals,
  getHospitalById,
  addHospital,
  updateHospital,
  deleteHospital,
  getHospitalStaff,
  addHospitalStaff,
  updateHospitalStaff,
  deleteHospitalStaff,
  getEventMedicalStaff,
  addEventMedicalStaff,
  deleteEventMedicalStaff,
  getAvailableStaffForEvent,
  addUserByAdmin,
};
