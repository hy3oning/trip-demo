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
    // 현재 프론트 기준 예약 생성은 이미 이 컨트롤러 계약과 맞는다.
    // 다만 mock 단계에서 예약 목록/수정/삭제는 json-server 방식으로도 사용 중이었다.
    //
    // 프론트와 가장 자연스럽게 맞추려면 아래 2단계 접근이 효율적이다.
    // 1) 우선 /me 기반 조회 + 생성 + 취소만 구현해 실제 예약 흐름을 완성한다.
    // 2) 이후 필요 시 PATCH /{bookingId}, DELETE /{bookingId} 를 추가해
    //    마이페이지 편집 UI와 1:1로 맞춘다.
    //
    // 권장 정책
    // - 목록 조회는 userId query param 을 받지 말고 세션 사용자 기준으로만 처리
    // - 취소는 hard delete 보다 상태 변경(CANCELLED) 우선
    // - 판매자/관리자 통계가 붙을 수 있으므로 createdAt, bookingStatus 는 유지

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
        // 프론트는 "내 예약" 화면에서 사용자 본인 예약만 필요하다.
        // /me 로 고정해두면 권한 체크와 쿼리 조건이 단순해진다.
        return bookingService.getMyBookings(requireUserId(session));
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingResponse cancelBooking(@PathVariable Long bookingId, HttpSession session) {
        // 취소 권한:
        // - 일반 사용자: 본인 예약만 취소
        // - 관리자: 운영상 전체 취소 가능
        // 판매자 취소 허용 여부는 정책이 정해질 때 별도 분기 추가
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
