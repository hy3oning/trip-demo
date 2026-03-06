package com.tripzone.service;

import com.tripzone.domain.Booking;
import com.tripzone.domain.Lodging;
import com.tripzone.dto.booking.BookingRequest;
import com.tripzone.dto.booking.BookingResponse;
import com.tripzone.repository.BookingRepository;
import com.tripzone.repository.LodgingRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final LodgingRepository lodgingRepository;

    public BookingService(BookingRepository bookingRepository, LodgingRepository lodgingRepository) {
        this.bookingRepository = bookingRepository;
        this.lodgingRepository = lodgingRepository;
    }

    public BookingResponse createBooking(Long userId, BookingRequest request) {
        validateDateRange(request);

        lodgingRepository.findById(request.getLodgingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lodging not found"));

        Booking savedBooking = bookingRepository.save(Booking.builder()
                .userId(userId)
                .lodgingId(request.getLodgingId())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .guests(request.getGuests())
                .totalPrice(request.getTotalPrice())
                .bookingStatus(Booking.BookingStatus.CONFIRMED)
                .build());

        return BookingResponse.from(savedBooking);
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingResponse::from)
                .toList();
    }

    public BookingResponse cancelBooking(Long bookingId, Long requesterUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!isAdmin && !booking.getUserId().equals(requesterUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot cancel this booking");
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    public List<BookingResponse> getBookingsForSeller(Long sellerId) {
        List<Long> sellerLodgingIds = lodgingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(Lodging::getLodgingId)
                .toList();

        if (sellerLodgingIds.isEmpty()) {
            return List.of();
        }

        return bookingRepository.findByLodgingIdInOrderByCreatedAtDesc(sellerLodgingIds)
                .stream()
                .map(BookingResponse::from)
                .toList();
    }

    private void validateDateRange(BookingRequest request) {
        if (request.getCheckIn() == null || request.getCheckOut() == null || !request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "checkOut must be after checkIn");
        }
    }
}
