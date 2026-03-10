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
    // 현재 프론트 문의 작성 플로우는 이 컨트롤러와 잘 맞는다.
    // 문의 내역 수정/삭제 UI도 존재하므로, 실제 연결 시 아래 확장 여지를 염두에 두면 된다.
    //
    // 추후 추가 권장 엔드포인트
    // - PATCH /api/v1/inquiries/{inquiryId}
    // - DELETE /api/v1/inquiries/{inquiryId}
    //
    // inquiryType 은 프론트에서 USER_TO_SELLER / SELLER_TO_ADMIN / COMMON_TO_ADMIN 을 사용한다.
    // Enum 문자열 계약은 프론트 상수와 그대로 맞추는 편이 가장 안전하다.

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
        // 문의 목록도 예약과 동일하게 세션 사용자 기준 조회가 가장 단순하다.
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
