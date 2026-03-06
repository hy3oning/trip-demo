package com.tripzone.repository;

import com.tripzone.domain.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByLodgingIdInOrderByCreatedAtDesc(List<Long> lodgingIds);
}
