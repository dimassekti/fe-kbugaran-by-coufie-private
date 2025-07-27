import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getEvents } from "../../utils/api";

const EventPreviewSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents();
        if (response.error) {
          setError("Failed to load events");
        } else {
          // Get first 3 events
          setEvents((response.data.events || []).slice(0, 3));
        }
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date TBA";
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}>
      <Box
        textAlign="center"
        mb={6}>
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "2.75rem",
            },
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 2,
          }}>
          Upcoming Events
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto" }}>
          Discover exciting events happening in your community
        </Typography>
      </Box>

      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <Grid
          container
          spacing={4}
          sx={{ mb: 6 }}>
          {events.length > 0 ? (
            events.map((event, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={event.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://picsum.photos/300/200?random=${
                      event.id || index + 10
                    }`}
                    alt={event.name || "Event"}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                      {event.name || "Event Name"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}>
                      📅 {formatDate(event.eventDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}>
                      📍 {event.location || "Location TBA"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}>
                      {event.description || "Event description coming soon..."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid
              item
              xs={12}>
              <Box
                textAlign="center"
                py={4}>
                <Typography
                  variant="h6"
                  color="text.secondary">
                  No events available at the moment
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/events")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          }}>
          View All Events
        </Button>
      </Box>
    </Container>
  );
};

export default EventPreviewSection;
