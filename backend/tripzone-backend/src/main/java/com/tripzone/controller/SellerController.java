package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.domain.User;
import com.tripzone.dto.booking.BookingResponse;
import com.tripzone.dto.lodging.LodgingResponse;
import com.tripzone.service.BookingService;
import com.tripzone.service.LodgingService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/seller")
public class SellerController {

    private final LodgingService lodgingService;
    private final BookingService bookingService;

    public SellerController(LodgingService lodgingService, BookingService bookingService) {
        this.lodgingService = lodgingService;
        this.bookingService = bookingService;
    }

    @GetMapping("/lodgings")
    public List<LodgingResponse> myLodgings(HttpSession session) {
        Long sellerId = requireSeller(session);
        return lodgingService.getSellerLodgings(sellerId);
    }

    @GetMapping("/bookings")
    public List<BookingResponse> sellerBookings(HttpSession session) {
        Long sellerId = requireSeller(session);
        return bookingService.getBookingsForSeller(sellerId);
    }

    private Long requireSeller(HttpSession session) {
        Object role = session.getAttribute(SessionKeys.ROLE);
        if (!(role instanceof String roleName) || User.Role.valueOf(roleName) != User.Role.SELLER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seller role required");
        }

        Object userId = session.getAttribute(SessionKeys.USER_ID);
        if (userId instanceof Number numberUserId) {
            return numberUserId.longValue();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }
}
