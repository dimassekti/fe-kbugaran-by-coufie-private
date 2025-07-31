import React from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const ErrorAlert = ({
  open,
  message,
  severity = "error",
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}>
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

ErrorAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  onClose: PropTypes.func.isRequired,
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"]),
  }),
};

export default ErrorAlert;
