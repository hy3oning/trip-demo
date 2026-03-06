package com.tripzone.service;

import com.tripzone.domain.Inquiry;
import com.tripzone.dto.inquiry.InquiryRequest;
import com.tripzone.dto.inquiry.InquiryResponse;
import com.tripzone.repository.InquiryRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    public InquiryResponse createInquiry(Long senderUserId, InquiryRequest request) {
        Inquiry savedInquiry = inquiryRepository.save(Inquiry.builder()
                .senderUserId(senderUserId)
                .inquiryType(request.getInquiryType())
                .title(request.getTitle())
                .content(request.getContent())
                .inquiryStatus(Inquiry.InquiryStatus.OPEN)
                .build());

        return InquiryResponse.from(savedInquiry);
    }

    public List<InquiryResponse> getMyInquiries(Long senderUserId) {
        return inquiryRepository.findBySenderUserIdOrderByCreatedAtDesc(senderUserId)
                .stream()
                .map(InquiryResponse::from)
                .toList();
    }

    public List<InquiryResponse> getAllInquiries() {
        return inquiryRepository.findAll().stream().map(InquiryResponse::from).toList();
    }
}
