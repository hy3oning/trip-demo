package com.tripzone.dto.lodging;

import com.tripzone.domain.Lodging;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LodgingResponse {

    private Long lodgingId;
    private Long sellerId;
    private String name;
    private String region;
    private String address;
    private String description;
    private BigDecimal pricePerNight;
    private String thumbnailUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal rating;
    private LocalDateTime createdAt;

    public static LodgingResponse from(Lodging lodging) {
        return LodgingResponse.builder()
                .lodgingId(lodging.getLodgingId())
                .sellerId(lodging.getSellerId())
                .name(lodging.getName())
                .region(lodging.getRegion())
                .address(lodging.getAddress())
                .description(lodging.getDescription())
                .pricePerNight(lodging.getPricePerNight())
                .thumbnailUrl(lodging.getThumbnailUrl())
                .latitude(lodging.getLatitude())
                .longitude(lodging.getLongitude())
                .rating(lodging.getRating())
                .createdAt(lodging.getCreatedAt())
                .build();
    }
}
