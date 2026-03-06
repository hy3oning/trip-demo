package com.tripzone.dto.lodging;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LodgingRequest {

    private Long sellerId;

    @NotBlank
    private String name;

    @NotBlank
    private String region;

    @NotBlank
    private String address;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal pricePerNight;

    private String thumbnailUrl;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private BigDecimal rating;
}
