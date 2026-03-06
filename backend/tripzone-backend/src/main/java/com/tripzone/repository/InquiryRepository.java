package com.tripzone.repository;

import com.tripzone.domain.Inquiry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findBySenderUserIdOrderByCreatedAtDesc(Long senderUserId);
}
