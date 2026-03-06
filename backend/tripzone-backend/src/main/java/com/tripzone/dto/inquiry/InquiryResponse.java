package com.tripzone.dto.inquiry;

import com.tripzone.domain.Inquiry;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InquiryResponse {

    private Long inquiryId;
    private Long senderUserId;
    private Inquiry.InquiryType inquiryType;
    private String title;
    private String content;
    private Inquiry.InquiryStatus inquiryStatus;
    private LocalDateTime createdAt;

    public static InquiryResponse from(Inquiry inquiry) {
        return InquiryResponse.builder()
                .inquiryId(inquiry.getInquiryId())
                .senderUserId(inquiry.getSenderUserId())
                .inquiryType(inquiry.getInquiryType())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .inquiryStatus(inquiry.getInquiryStatus())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}
