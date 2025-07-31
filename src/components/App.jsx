import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNavigation from "./PageNavigation";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import AddPage from "../pages/AddPage";
import DetailPage from "../pages/DetailPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import EventsPage from "../pages/EventsPage";
import AddEventPage from "../pages/AddEventPage";
import EventDetailPage from "../pages/EventDetailPage";
import EditEventPage from "../pages/EditEventPage";
import ParticipantListPage from "../pages/ParticipantListPage";
import EventParticipantsPage from "../pages/EventParticipantsPage";
import ParticipantDetailPage from "../pages/ParticipantDetailPage";
import ParticipantCheckUpPage from "../pages/ParticipantCheckUpPage";
import HospitalsPage from "../pages/HospitalsPage";
import AddHospitalPage from "../pages/AddHospitalPage";
import HospitalDetailPage from "../pages/HospitalDetailPage";
import EditHospitalPage from "../pages/EditHospitalPage";
import UsersPage from "../pages/UsersPage";
import { getUserLogged, putAccessToken, logout } from "../utils/api";
import { ThemeProvider } from "../contexts/ThemeContext";
import ToggleTheme from "./ToggleTheme";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authedUser: null,
      initializing: true,

      theme: localStorage.getItem("theme") || "light",
      toggleTheme: () => {
        this.setState((prevState) => {
          const newTheme = prevState.theme === "light" ? "dark" : "light";

          localStorage.setItem("theme", newTheme);

          return {
            theme: newTheme,
          };
        });
      },
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.theme !== this.state.theme) {
      document.documentElement.setAttribute("data-theme", this.state.theme);
    }
  }

  async componentDidMount() {
    document.documentElement.setAttribute("data-theme", this.state.theme);

    const { data } = await getUserLogged();
    console.log("getUserLogged result:", { data });
    console.log("User role:", data?.user?.role);
    this.setState(() => {
      return {
        authedUser: data,
        initializing: false,
      };
    });
  }

  async onLoginSuccess({ accessToken }) {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    console.log("onLoginSuccess getUserLogged result:", { data });
    console.log("User role:", data?.user?.role);
    this.setState(() => {
      return {
        authedUser: data,
      };
    });
  }

  async onLogout() {
    // Call the logout API to invalidate refresh token
    await logout();

    this.setState(() => {
      return {
        authedUser: null,
      };
    });
  }

  // cek auth user
  render() {
    if (this.state.initializing) {
      return null;
    }

    if (this.state.authedUser === null) {
      return (
        <ThemeProvider value={this.state}>
          <div className="app-container">
            <header>
              <PageNavigation />
              <ToggleTheme />
            </header>
            <main>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage />}
                />
                <Route
                  path="/about"
                  element={<AboutPage />}
                />
                <Route
                  path="/register"
                  element={<RegisterPage />}
                />
                <Route
                  path="/login"
                  element={<LoginPage loginSuccess={this.onLoginSuccess} />}
                />
                <Route
                  path="/*"
                  element={<LoginPage loginSuccess={this.onLoginSuccess} />}
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider value={this.state}>
        <div className="app-container">
          <header>
            <PageNavigation
              logout={this.onLogout}
              name={
                this.state.authedUser.user?.fullname ||
                this.state.authedUser.user?.username ||
                "User"
              }
              userRole={this.state.authedUser.user?.role}
            />
            <ToggleTheme />
          </header>
          <main>
            <Routes>
              <Route
                path="/"
                element={<HomePage />}
              />
              <Route
                path="/about"
                element={<AboutPage />}
              />
              <Route
                path="/hospitals"
                element={<HospitalsPage />}
              />
              <Route
                path="/hospitals/add"
                element={<AddHospitalPage />}
              />
              <Route
                path="/hospitals/:id"
                element={<HospitalDetailPage />}
              />
              <Route
                path="/hospitals/:id/edit"
                element={<EditHospitalPage />}
              />
              <Route
                path="/users"
                element={<UsersPage />}
              />
              <Route
                path="/notes/:id"
                element={<DetailPage />}
              />
              <Route
                path="/events"
                element={<EventsPage />}
              />
              <Route
                path="/events/add"
                element={<AddEventPage />}
              />
              <Route
                path="/events/:id"
                element={<EventDetailPage />}
              />
              <Route
                path="/events/:id/edit"
                element={<EditEventPage />}
              />
              <Route
                path="/events/:id/participants"
                element={<ParticipantListPage />}
              />
              <Route
                path="/events/:eventId/participants"
                element={<EventParticipantsPage />}
              />
              <Route
                path="/participants/:participantId"
                element={<ParticipantDetailPage />}
              />
              <Route
                path="/participants/:participantId/checkup"
                element={<ParticipantCheckUpPage />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    );
  }
  // (imports already at top)
}

export default App;
