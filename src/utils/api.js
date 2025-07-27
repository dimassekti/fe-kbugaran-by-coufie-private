const BASE_URL = "http://localhost:5000";

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
};
