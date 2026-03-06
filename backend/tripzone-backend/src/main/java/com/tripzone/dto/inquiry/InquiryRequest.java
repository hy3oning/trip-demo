package com.tripzone.dto.inquiry;

import com.tripzone.domain.Inquiry;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryRequest {

    @NotNull
    private Inquiry.InquiryType inquiryType;

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
