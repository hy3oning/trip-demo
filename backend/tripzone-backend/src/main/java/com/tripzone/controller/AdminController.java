package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.domain.User;
import com.tripzone.dto.auth.UserResponse;
import com.tripzone.dto.inquiry.InquiryResponse;
import com.tripzone.service.AuthService;
import com.tripzone.service.InquiryService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AuthService authService;
    private final InquiryService inquiryService;

    public AdminController(AuthService authService, InquiryService inquiryService) {
        this.authService = authService;
        this.inquiryService = inquiryService;
    }

    @GetMapping("/users")
    public List<UserResponse> users(HttpSession session) {
        requireAdmin(session);
        return authService.getAllUsers();
    }

    @GetMapping("/inquiries")
    public List<InquiryResponse> inquiries(HttpSession session) {
        requireAdmin(session);
        return inquiryService.getAllInquiries();
    }

    private void requireAdmin(HttpSession session) {
        Object role = session.getAttribute(SessionKeys.ROLE);
        if (!(role instanceof String roleName) || User.Role.valueOf(roleName) != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }
}
