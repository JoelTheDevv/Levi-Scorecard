package com.levi_scorecard.ScoreCard.user.controller;

import com.levi_scorecard.ScoreCard.security.service.JwtService;
import com.levi_scorecard.ScoreCard.user.dto.LoginRequest;
import com.levi_scorecard.ScoreCard.user.dto.LoginResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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
}