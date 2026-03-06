package com.tripzone.controller;

import com.tripzone.config.SessionKeys;
import com.tripzone.dto.inquiry.InquiryRequest;
import com.tripzone.dto.inquiry.InquiryResponse;
import com.tripzone.service.InquiryService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(
            @Valid @RequestBody InquiryRequest request,
            HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inquiryService.createInquiry(requireUserId(session), request));
    }

    @GetMapping("/me")
    public List<InquiryResponse> getMyInquiries(HttpSession session) {
        return inquiryService.getMyInquiries(requireUserId(session));
    }

    private Long requireUserId(HttpSession session) {
        Object userId = session.getAttribute(SessionKeys.USER_ID);
        if (userId instanceof Number numberUserId) {
            return numberUserId.longValue();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
    }
}
