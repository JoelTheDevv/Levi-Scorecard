
package com.levi_scorecard.ScoreCard.exception;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles explicitly assigned HTTP status exceptions
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(
            ResponseStatusException exception) {

        String message = exception.getReason() != null
                ? exception.getReason()
                : "Request failed";

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(Map.of("message", message));
    }

    // Handles invalid username/password during login
    // and an incorrect current password during password change
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(
            BadCredentialsException exception,
            HttpServletRequest request) {

        String path = request.getRequestURI();

        String message = path.endsWith("/changepass")
                ? "Incorrect current password."
                : "Invalid username or password.";

        return error(HttpStatus.UNAUTHORIZED, message);
    }

    // Handles other Spring Security authentication failures
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(
            AuthenticationException exception) {

        return error(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed. Please check your credentials."
        );
    }

    // Handles authenticated users who lack permission
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(
            AccessDeniedException exception) {

        return error(HttpStatus.FORBIDDEN, "You do not have permission to perform this action.");
    }

    // Handles validation errors on request DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError ->
                        fieldError.getField() + ": "
                                + (fieldError.getDefaultMessage() != null
                                ? fieldError.getDefaultMessage()
                                : "Invalid value"))
                .orElse("Invalid request data.");

        return error(HttpStatus.BAD_REQUEST, message);
    }

    // Handles malformed JSON or unreadable request bodies
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleUnreadableRequest(
            HttpMessageNotReadableException exception) {

        return error(HttpStatus.BAD_REQUEST, "Invalid or malformed request body.");
    }

    // Handles missing required request parameters
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> handleMissingParameter(
            MissingServletRequestParameterException exception) {

        return error(
                HttpStatus.BAD_REQUEST,
                "Missing required parameter: " + exception.getParameterName()
        );
    }

    // Fallback for unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpectedException(
            Exception exception) {

        // Log the full exception on the server if needed.
        // Do not expose internal exception details to the client.
        return error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected server error occurred."
        );
    }

    private ResponseEntity<Map<String, String>> error(
            HttpStatus status,
            String message) {

        return ResponseEntity
                .status(status)
                .body(Map.of("message", message));
    }
}
