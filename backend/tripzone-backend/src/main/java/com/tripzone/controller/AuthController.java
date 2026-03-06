package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.domain.User;
import com.tripzone.dto.auth.LoginRequest;
import com.tripzone.dto.auth.SignupRequest;
import com.tripzone.dto.auth.UserResponse;
import com.tripzone.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = authService.login(request);
        session.setAttribute(SessionKeys.USER_ID, user.getUserId());
        session.setAttribute(SessionKeys.ROLE, user.getRole().name());
        return UserResponse.from(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserResponse me(HttpSession session) {
        Long userId = requireUserId(session);
        return authService.me(userId);
    }

    private Long requireUserId(HttpSession session) {
        Object userId = session.getAttribute(SessionKeys.USER_ID);
        if (userId instanceof Number numberUserId) {
            return numberUserId.longValue();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }
}
