package com.tripzone.repository;

import com.tripzone.domain.Lodging;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LodgingRepository extends JpaRepository<Lodging, Long> {

    List<Lodging> findByRegionIgnoreCaseOrderByCreatedAtDesc(String region);

    List<Lodging> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<Lodging> findByRegionIgnoreCaseAndSellerIdOrderByCreatedAtDesc(String region, Long sellerId);
}
