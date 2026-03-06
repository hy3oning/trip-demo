package com.tripzone.service;

import com.tripzone.domain.Lodging;
import com.tripzone.dto.lodging.LodgingRequest;
import com.tripzone.dto.lodging.LodgingResponse;
import com.tripzone.repository.LodgingRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LodgingService {

    private final LodgingRepository lodgingRepository;

    public LodgingService(LodgingRepository lodgingRepository) {
        this.lodgingRepository = lodgingRepository;
    }

    public List<LodgingResponse> listLodgings(String region, Long sellerId) {
        List<Lodging> lodgings;
        if (region != null && !region.isBlank() && sellerId != null) {
            lodgings = lodgingRepository.findByRegionIgnoreCaseAndSellerIdOrderByCreatedAtDesc(region, sellerId);
        } else if (region != null && !region.isBlank()) {
            lodgings = lodgingRepository.findByRegionIgnoreCaseOrderByCreatedAtDesc(region);
        } else if (sellerId != null) {
            lodgings = lodgingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        } else {
            lodgings = lodgingRepository.findAll();
        }
        return lodgings.stream().map(LodgingResponse::from).toList();
    }

    public LodgingResponse getLodging(Long lodgingId) {
        return LodgingResponse.from(getLodgingEntity(lodgingId));
    }

    public Lodging getLodgingEntity(Long lodgingId) {
        return lodgingRepository.findById(lodgingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lodging not found"));
    }

    public LodgingResponse createLodging(LodgingRequest request) {
        Lodging savedLodging = lodgingRepository.save(Lodging.builder()
                .sellerId(request.getSellerId())
                .name(request.getName())
                .region(request.getRegion())
                .address(request.getAddress())
                .description(request.getDescription())
                .pricePerNight(request.getPricePerNight())
                .thumbnailUrl(request.getThumbnailUrl())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .rating(request.getRating())
                .build());
        return LodgingResponse.from(savedLodging);
    }

    public LodgingResponse updateLodging(Long lodgingId, LodgingRequest request) {
        Lodging lodging = getLodgingEntity(lodgingId);

        if (request.getName() != null) {
            lodging.setName(request.getName());
        }
        if (request.getRegion() != null) {
            lodging.setRegion(request.getRegion());
        }
        if (request.getAddress() != null) {
            lodging.setAddress(request.getAddress());
        }
        if (request.getDescription() != null) {
            lodging.setDescription(request.getDescription());
        }
        if (request.getPricePerNight() != null) {
            lodging.setPricePerNight(request.getPricePerNight());
        }
        if (request.getThumbnailUrl() != null) {
            lodging.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getLatitude() != null) {
            lodging.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            lodging.setLongitude(request.getLongitude());
        }
        if (request.getRating() != null) {
            lodging.setRating(request.getRating());
        }

        return LodgingResponse.from(lodgingRepository.save(lodging));
    }

    public void deleteLodging(Long lodgingId) {
        lodgingRepository.delete(getLodgingEntity(lodgingId));
    }

    public List<LodgingResponse> getSellerLodgings(Long sellerId) {
        return lodgingRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(LodgingResponse::from)
                .toList();
    }
}
