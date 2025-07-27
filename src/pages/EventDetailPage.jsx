import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  deleteEvent,
  getEventParticipants,
  addEventParticipant,
  getAllUsers,
  getUserByUsername,
} from "../utils/api";
import EventDetail from "../components/EventDetail";
import ParticipantTable from "../components/ParticipantTable";
import AddParticipantDialog from "../components/AddParticipantDialog";
import { Snackbar, Alert, Box } from "@mui/material";

/* 
  COMPREHENSIVE VALIDATION PATTERN DOCUMENTATION
  =============================================
  
  This component demonstrates a comprehensive validation pattern that can be reused 
  across different features. The key principles are:

  1. SEPARATION OF ERROR CONCERNS
     - Page-level errors: Critical system failures that affect the entire page
     - Dialog-level errors: Form validation errors that should stay within modals/dialogs
     - Form-level errors: Immediate client-side validation feedback

  2. ERROR STATE MANAGEMENT
     - `error`: Page-level critical errors (network failures, system crashes)
     - `dialogError`: Dialog-specific validation errors (business logic, user input validation)
     - `formError` (in dialog): Immediate form validation (required fields, format)

  3. VALIDATION FLOW
     - Client-side: Immediate feedback for required fields and format validation
     - Server-side: Business logic validation, existence checks, authorization
     - Error propagation: Errors stay at the appropriate level (dialog vs page)

  4. USER EXPERIENCE PRINCIPLES
     - Errors appear in context (within the dialog where the action is happening)
     - Clear error messages that guide user action
     - Errors clear automatically when user addresses them
     - Fresh state on dialog open/close

  HOW TO APPLY THIS PATTERN TO OTHER FEATURES:
  ==========================================
  
  1. Create separate error states for different scopes:
     const [error, setError] = useState(null);           // Page-level
     const [dialogError, setDialogError] = useState(null); // Dialog-level
     
  2. In form submission handlers:
     - Clear dialog errors at start: setDialogError(null)
     - Use setDialogError() for validation errors
     - Use setError() only for critical system errors
     
  3. In dialog components:
     - Clear errors when dialog opens/closes
     - Show backend errors with priority over client errors
     - Clear form errors when user starts typing
     
  4. Pass appropriate error state to components:
     - Page components: error={error}
     - Dialog components: error={dialogError}

  BEFORE vs AFTER COMPARISON:
  ==========================
  BEFORE: All errors used single `error` state → validation errors showed on entire page
  AFTER: Scoped error states → validation errors stay within dialogs, better UX
*/

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [addingParticipant, setAddingParticipant] = useState(false);

  // VALIDATION PATTERN: Separate Error States
  // ==========================================
  // BEFORE: We used a single 'error' state for all errors, causing validation errors
  // to be displayed at the page level, breaking the user experience
  //
  // AFTER: We use TWO separate error states:
  // 1. 'error' - For critical page-level errors (network failures, system errors)
  // 2. 'dialogError' - For form validation errors that should stay within dialogs
  //
  // This pattern ensures proper error scoping and better UX
  const [dialogError, setDialogError] = useState(null); // Dialog-specific validation errors

  const [successMessage, setSuccessMessage] = useState("");

  // USEEFFECT TEKNIK-MU1
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch event details
        const eventResponse = await getEventById(id);
        if (eventResponse.error) {
          setError(eventResponse.message);
          setEvent(null);
        } else {
          // Support both { data: { event: {...} } } and { data: {...} }
          const eventData = eventResponse.data?.event || eventResponse.data;
          setEvent(eventData);
        }

        // Fetch participants count
        const participantsResponse = await getEventParticipants(id);
        if (participantsResponse.error) {
          console.warn(
            "Failed to fetch participants:",
            participantsResponse.message
          );
          setParticipants([]);
          setParticipantCount(0);
        } else {
          // Support both { data: { participants: [...] } } and { data: [...] }
          const participantsData =
            participantsResponse.data?.participants ||
            participantsResponse.data ||
            [];
          console.log("Participants data:", participantsData); // Debug log
          setParticipants(participantsData);
          setParticipantCount(participantsData.length);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data event");
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleDelete = async () => {
    const response = await deleteEvent(id);
    if (!response.error) {
      navigate("/events");
    } else {
      setError("Gagal menghapus event: " + response.message);
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/events");
  };

  const handleAddParticipant = async () => {
    setShowAddDialog(true);
    // Try to fetch users for admin dropdown
    try {
      const usersResponse = await getAllUsers();
      if (!usersResponse.error) {
        setUsers(usersResponse.data);
      }
    } catch (err) {
      console.warn("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    setUsers([]);

    // VALIDATION PATTERN: Clean Up Dialog Errors
    // ==========================================
    // Always clear dialog-specific errors when closing dialogs
    // This prevents old error messages from appearing when reopening
    setDialogError(null);
  };

  const handleSubmitParticipant = async (username, role) => {
    setAddingParticipant(true);

    // VALIDATION PATTERN: Clear Previous Dialog Errors
    // ===============================================
    // Always clear dialog errors at the start of form submission
    // This ensures fresh validation state for each attempt
    setDialogError(null);

    try {
      // VALIDATION PATTERN: Backend Validation with Dialog Error Handling
      // ================================================================
      // Step 1: Validate input against backend (username existence)
      const userResponse = await getUserByUsername(username);

      if (userResponse.error) {
        // BEFORE: setError() - This would show error on entire page
        // AFTER: setDialogError() - This keeps error within the dialog
        if (userResponse.message.includes("tidak ditemukan")) {
          setDialogError("Username not found in the system");
        } else {
          setDialogError("Failed to find user: " + userResponse.message);
        }
        return; // Exit early, don't proceed with API call
      }

      const userId = userResponse.data.id;

      // Step 2: Attempt the main operation (add participant)
      const response = await addEventParticipant(id, { userId, role });

      if (response.error) {
        // VALIDATION PATTERN: Business Logic Error Handling
        // ================================================
        // Handle expected business logic errors in the dialog
        if (response.message.includes("sudah terdaftar")) {
          setDialogError("This user is already a participant in this event");
        } else {
          setDialogError("Failed to add participant: " + response.message);
        }
        return; // Exit early if business logic fails
      }

      // VALIDATION PATTERN: Success Handling
      // ===================================
      // Step 3: Handle successful operation
      setSuccessMessage("Participant added successfully!");
      setShowAddDialog(false);
      setUsers([]);
      setDialogError(null); // Clear any dialog errors on success

      // Step 4: Refresh dependent data
      const participantsResponse = await getEventParticipants(id);
      if (!participantsResponse.error) {
        const participantsData =
          participantsResponse.data?.participants ||
          participantsResponse.data ||
          [];
        setParticipants(participantsData);
        setParticipantCount(participantsData.length);
      }
    } catch (err) {
      // VALIDATION PATTERN: System Error Handling
      // ========================================
      // CRITICAL: Only use page-level errors for unexpected system failures
      // These are errors that indicate the entire page/system has issues
      setError("An unexpected error occurred while adding participant");
      console.error("Error adding participant:", err);
    } finally {
      setAddingParticipant(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  if (loading) {
    return <div>Memuat detail event...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <EventDetail
        event={event}
        participantCount={participantCount}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
        onAddParticipant={handleAddParticipant}
        error={error}
      />

      <Box sx={{ mt: 3 }}>
        {participants.length > 0 ? (
          <ParticipantTable participants={participants} />
        ) : (
          <ParticipantTable
            participants={[]}
            emptyMessage="No participants yet"
          />
        )}
      </Box>

      {/* VALIDATION PATTERN: Dialog Component Integration
          ===============================================
          Pass the dialog-specific error state to the dialog component.
          This ensures validation errors appear within the dialog context,
          not at the page level. 
          
          BEFORE: error={error} - Mixed page and dialog errors
          AFTER: error={dialogError} - Clean separation of concerns */}
      <AddParticipantDialog
        open={showAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleSubmitParticipant}
        users={users}
        loading={addingParticipant}
        error={dialogError}
        participants={participants}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventDetailPage;
