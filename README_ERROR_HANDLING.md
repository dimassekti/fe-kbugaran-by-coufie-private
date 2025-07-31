# Error Handling System Documentation

## Overview

This document describes the comprehensive error handling system implemented in the Healthcare Management Application. The system provides consistent error handling across both backend and frontend, with proper categorization, user-friendly messages, and appropriate visual feedback.

## Architecture

### Backend Error Handling

#### 1. Error Classes

**DatabaseError.js** (`src/exceptions/DatabaseError.js`)

```javascript
class DatabaseError extends ClientError {
  static fromPostgreSQLError(error) {
    // Handles PostgreSQL constraint violations and database errors
    // Provides user-friendly messages for common database issues
  }
}
```

**Existing Error Classes**:

- `ClientError` - Base client error class
- `AuthenticationError` - Authentication failures
- `AuthorizationError` - Permission denied
- `InvariantError` - Validation errors
- `NotFoundError` - Resource not found

#### 2. Error Handler Utilities

**errorHandler.js** (`src/utils/errorHandler.js`)

```javascript
// Core functions:
categorizeError(error); // Categorizes errors by type and severity
logError(error, context); // Logs errors with appropriate detail level
parsePostgreSQLError(error); // Parses PostgreSQL error messages
```

#### 3. Server Middleware

**Enhanced Error Middleware** (`src/server.js`)

```javascript
server.ext("onPreResponse", (request, h) => {
  // Handles all error types including:
  // - ClientError instances (validation, auth, etc.)
  // - DatabaseError instances (constraint violations)
  // - Generic Error instances (unexpected errors)
  // - Provides appropriate HTTP status codes and messages
});
```

### Frontend Error Handling

#### 1. ErrorAlert Component

**ErrorAlert.jsx** (`src/components/ErrorAlert.jsx`)

```jsx
function ErrorAlert({
  message,
  severity = "error",
  open = false,
  onClose,
  autoHide = true,
  duration = 6000,
}) {
  // Renders Material-UI Snackbar with Alert
  // Supports: error, warning, info, success severities
  // Auto-dismiss functionality
  // Consistent positioning and styling
}
```

#### 2. API Utilities

**Enhanced API Functions** (`src/utils/api.js`)

```javascript
// Enhanced error handling with:
categorizeAPIError(status, message); // Maps HTTP status to UI severity
// Enhanced error messages for specific scenarios
// Consistent error response format: { error, message, type, data }
```

#### 3. Page Components

All page components now implement consistent error handling patterns:

- State management for error messages and types
- ErrorAlert component integration
- Form validation with immediate feedback
- Success message display
- Loading state management

## Error Categories and Mapping

### Backend to Frontend Error Mapping

| Backend Error Type         | HTTP Status | Frontend Severity | Use Case                     |
| -------------------------- | ----------- | ----------------- | ---------------------------- |
| ValidationError            | 400         | error             | Form validation failures     |
| AuthenticationError        | 401         | warning           | Login required               |
| AuthorizationError         | 403         | warning           | Permission denied            |
| NotFoundError              | 404         | info              | Resource not found           |
| DatabaseError (constraint) | 409         | warning           | Unique constraint violations |
| DatabaseError (other)      | 500         | error             | Database connection issues   |
| InvariantError             | 400         | error             | Business logic violations    |
| Generic Error              | 500         | error             | Unexpected server errors     |

### UI Severity Levels

- **error** (red): Critical issues requiring immediate attention
- **warning** (orange): Important issues that may need user action
- **info** (blue): Informational messages (not found, etc.)
- **success** (green): Successful operations

## Implementation Examples

### Backend Service Implementation

```javascript
// src/services/postgres/HospitalsService.js
async addHospital({ name, address, phone }) {
  try {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO hospitals(id, name, address, phone) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, address, phone],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add hospital');
    }

    return result.rows[0].id;
  } catch (error) {
    if (error.code) {
      throw DatabaseError.fromPostgreSQLError(error);
    }
    throw error;
  }
}
```

### Frontend Page Implementation

```jsx
// src/pages/AddHospitalPage.jsx
import ErrorAlert from "../components/ErrorAlert";

function AddHospitalPage() {
  const [error, setError] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const [success, setSuccess] = useState({ show: false, message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError({
        show: true,
        message: validationError,
        type: "error",
      });
      return;
    }

    try {
      const result = await addHospital(formData);

      if (result.error) {
        setError({
          show: true,
          message: result.message,
          type: result.type || "error",
        });
        return;
      }

      setSuccess({
        show: true,
        message: "Hospital added successfully!",
      });

      // Reset form or redirect
    } catch (error) {
      setError({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      {/* Form JSX */}

      <ErrorAlert
        message={error.message}
        severity={error.type}
        open={error.show}
        onClose={() => setError((prev) => ({ ...prev, show: false }))}
      />

      <ErrorAlert
        message={success.message}
        severity="success"
        open={success.show}
        onClose={() => setSuccess((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
```

## Validation Alignment

### Backend Validation (Joi Schema)

```javascript
// src/validator/hospitals/schema.js
const HospitalPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    "string.empty": "Hospital name is required",
    "string.max": "Hospital name must not exceed 255 characters",
    "any.required": "Hospital name is required",
  }),
  address: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Hospital address is required",
    "string.max": "Hospital address must not exceed 500 characters",
    "any.required": "Hospital address is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(8)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number can only contain numbers, +, -, spaces, and parentheses",
      "string.min": "Phone number must be at least 8 characters",
      "string.max": "Phone number must not exceed 20 characters",
      "any.required": "Phone number is required",
    }),
});
```

### Frontend Validation

```javascript
// Client-side validation function
const validateForm = () => {
  if (!formData.name?.trim()) {
    return "Hospital name is required";
  }
  if (formData.name.length > 255) {
    return "Hospital name must not exceed 255 characters";
  }
  if (!formData.address?.trim()) {
    return "Hospital address is required";
  }
  if (formData.address.length > 500) {
    return "Hospital address must not exceed 500 characters";
  }
  if (!formData.phone?.trim()) {
    return "Phone number is required";
  }
  if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
    return "Phone number can only contain numbers, +, -, spaces, and parentheses";
  }
  if (formData.phone.length < 8 || formData.phone.length > 20) {
    return "Phone number must be between 8 and 20 characters";
  }
  return null;
};
```

## Error Logging

### Development Environment

- Full error details logged to console
- Stack traces included for debugging
- Database query details (sanitized)

### Production Environment

- Sanitized error messages only
- No sensitive data in logs
- Structured logging for monitoring

### Log Levels

```javascript
// src/utils/errorHandler.js
const logError = (error, context = {}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    console.error(`Error in ${context.operation || "unknown operation"}:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      context,
    });
  } else {
    // Production: Log to monitoring service
    console.error(`Error: ${error.message}`, {
      operation: context.operation,
      userId: context.userId,
      timestamp: new Date().toISOString(),
    });
  }
};
```

## Best Practices

### Backend

1. Always use appropriate error classes for different scenarios
2. Include contextual information in error messages
3. Handle database constraint violations gracefully
4. Provide user-friendly messages for common errors
5. Log errors with appropriate detail level

### Frontend

1. Use ErrorAlert component consistently across all pages
2. Implement client-side validation that matches backend validation
3. Categorize errors appropriately (error, warning, info, success)
4. Provide immediate feedback for user actions
5. Handle loading states and network errors gracefully

### Database

1. Use meaningful constraint names for better error messages
2. Implement proper indexes for performance
3. Use soft deletes where appropriate to maintain data integrity

## Testing Error Scenarios

### Unit Tests

- Test error class instantiation and message formatting
- Test validation schema with various invalid inputs
- Test service layer error handling

### Integration Tests

- Test API endpoints with invalid data
- Test constraint violation scenarios
- Test authentication and authorization errors

### Frontend Tests

- Test ErrorAlert component rendering
- Test form validation functions
- Test error state management in components

## Migration Guide

For existing code, follow these steps:

1. Replace generic `throw new Error()` with appropriate error classes
2. Update service methods to handle database errors properly
3. Replace existing error displays with ErrorAlert component
4. Align frontend validation with backend validation rules
5. Update API functions to use enhanced error handling

## Future Enhancements

1. **Error Analytics**: Track error patterns for system improvement
2. **User Feedback**: Allow users to report errors or provide feedback
3. **Internationalization**: Support multiple languages for error messages
4. **Recovery Suggestions**: Provide actionable suggestions for error resolution
5. **Offline Handling**: Handle network connectivity issues gracefully

This error handling system provides a robust foundation for maintaining application reliability and user experience. Regular review and updates ensure continued effectiveness as the application evolves.
