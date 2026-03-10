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
    // 프론트는 axios withCredentials=true 로 세션 쿠키 기반 인증을 사용한다.
    // 즉 JWT를 새로 만들기보다 login/logout/me 흐름을 먼저 안정화하는 편이 구현 비용이 낮다.
    //
    // 권장 응답 계약
    // - POST /login: UserResponse 반환 + 세션 생성
    // - POST /logout: 204
    // - GET /me: 현재 로그인 사용자 정보 반환
    //
    // 프론트 로그인 사용자 식별자는 userId 를 기준으로 사용한다.
    // UserResponse 에서 id 대신 userId 필드를 유지하는 편이 프론트 수정 비용이 적다.

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
        // 세션에는 최소 userId, role 두 값만 유지한다.
        // 상세 사용자 정보는 /me 응답에서 조회하도록 두면 세션 직렬화 부담이 적다.
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
        // 앱 새로고침 시 프론트가 현재 사용자 복원에 활용할 수 있는 핵심 엔드포인트다.
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
