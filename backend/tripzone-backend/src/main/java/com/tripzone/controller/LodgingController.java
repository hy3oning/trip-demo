package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.domain.User;
import com.tripzone.dto.lodging.LodgingRequest;
import com.tripzone.dto.lodging.LodgingResponse;
import com.tripzone.service.LodgingService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/lodgings")
public class LodgingController {

    private final LodgingService lodgingService;

    public LodgingController(LodgingService lodgingService) {
        this.lodgingService = lodgingService;
    }

    @GetMapping
    public List<LodgingResponse> listLodgings(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Long sellerId) {
        return lodgingService.listLodgings(region, sellerId);
    }

    @GetMapping("/{lodgingId}")
    public LodgingResponse getLodging(@PathVariable Long lodgingId) {
        return lodgingService.getLodging(lodgingId);
    }

    @PostMapping
    public ResponseEntity<LodgingResponse> createLodging(@Valid @RequestBody LodgingRequest request, HttpSession session) {
        User.Role role = requireRole(session);
        if (role != User.Role.SELLER && role != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seller or admin role required");
        }

        Long userId = requireUserId(session);
        if (role == User.Role.SELLER) {
            request.setSellerId(userId);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(lodgingService.createLodging(request));
    }

    @PatchMapping("/{lodgingId}")
    public LodgingResponse updateLodging(
            @PathVariable Long lodgingId,
            @RequestBody LodgingRequest request,
            HttpSession session) {
        ensureLodgingOwnerOrAdmin(lodgingId, session);
        return lodgingService.updateLodging(lodgingId, request);
    }

    @DeleteMapping("/{lodgingId}")
    public ResponseEntity<Void> deleteLodging(@PathVariable Long lodgingId, HttpSession session) {
        ensureLodgingOwnerOrAdmin(lodgingId, session);
        lodgingService.deleteLodging(lodgingId);
        return ResponseEntity.noContent().build();
    }

    private void ensureLodgingOwnerOrAdmin(Long lodgingId, HttpSession session) {
        User.Role role = requireRole(session);
        if (role == User.Role.ADMIN) {
            return;
        }

        Long userId = requireUserId(session);
        Long ownerId = lodgingService.getLodgingEntity(lodgingId).getSellerId();
        if (role != User.Role.SELLER || !userId.equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }
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
