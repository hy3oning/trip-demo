package com.tripzone.dto.booking;

import com.tripzone.domain.Booking;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {

    private Long bookingId;
    private Long userId;
    private Long lodgingId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private BigDecimal totalPrice;
    private Booking.BookingStatus bookingStatus;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .userId(booking.getUserId())
                .lodgingId(booking.getLodgingId())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .guests(booking.getGuests())
                .totalPrice(booking.getTotalPrice())
                .bookingStatus(booking.getBookingStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
