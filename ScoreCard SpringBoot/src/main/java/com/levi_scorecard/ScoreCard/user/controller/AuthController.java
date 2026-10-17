package com.levi_scorecard.ScoreCard.user.controller;

import com.levi_scorecard.ScoreCard.security.service.JwtService;
import com.levi_scorecard.ScoreCard.user.dto.LoginRequest;
import com.levi_scorecard.ScoreCard.user.dto.LoginResponse;
import com.levi_scorecard.ScoreCard.user.dto.PassChangeRequest;
import com.levi_scorecard.ScoreCard.user.entity.User;
import com.levi_scorecard.ScoreCard.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.secret.code}")
    private String secretCode;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.loginIdentifier(),
                        request.password()
                )
        );

        String token =
                jwtService.generateToken(request.loginIdentifier());

        return new LoginResponse(token);
    }

    @PostMapping("/changepass")
    public ResponseEntity<String> changePass(
            @RequestBody PassChangeRequest request
    ) {
        if (request == null
                || request.getLoginIdentifier() == null
                || request.getCurrentPassword() == null
                || request.getNewPassword() == null
                || request.getSecretCode() == null
                || request.getLoginIdentifier().isBlank()
                || request.getCurrentPassword().isBlank()
                || request.getNewPassword().isBlank()
                || request.getSecretCode().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("All fields are required.");
        }

        if (!secretCode.equals(request.getSecretCode())) {
            return ResponseEntity.badRequest()
                    .body("Invalid secret code. Password change denied.");
        }

        User user = userRepository
                .findByLoginIdentifier(request.getLoginIdentifier())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getLoginIdentifier(),
                            request.getCurrentPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect current password.");
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully.");
    }
}