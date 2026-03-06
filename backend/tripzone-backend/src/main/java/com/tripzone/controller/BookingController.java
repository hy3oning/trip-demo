package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.domain.User;
import com.tripzone.dto.booking.BookingRequest;
import com.tripzone.dto.booking.BookingResponse;
import com.tripzone.service.BookingService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, HttpSession session) {
        Long userId = requireUserId(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(userId, request));
    }

    @GetMapping("/me")
    public List<BookingResponse> getMyBookings(HttpSession session) {
        return bookingService.getMyBookings(requireUserId(session));
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingResponse cancelBooking(@PathVariable Long bookingId, HttpSession session) {
        Long userId = requireUserId(session);
        boolean isAdmin = requireRole(session) == User.Role.ADMIN;
        return bookingService.cancelBooking(bookingId, userId, isAdmin);
    }

    private Long requireUserId(HttpSession session) {
        Object userId = session.getAttribute(SessionKeys.USER_ID);
        if (userId instanceof Number numberUserId) {
            return numberUserId.longValue();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }

    private User.Role requireRole(HttpSession session) {
        Object role = session.getAttribute(SessionKeys.ROLE);
        if (role instanceof String roleName) {
            return User.Role.valueOf(roleName);
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }
}
