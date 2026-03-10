package com.tripzone.config;

import static org.springframework.security.config.Customizer.withDefaults;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // 현재 프론트 동작 기준 보안 전략
    // - 브라우저 + 세션 쿠키 기반
    // - API 호출은 axios withCredentials=true
    // - 인증 없는 공개 API는 auth, lodging 조회 정도만 필요
    //
    // 구현 우선순위
    // 1) 세션 인증 안정화
    // 2) CORS + 쿠키 전달 확인
    // 3) 역할별 접근 제어 세분화
    //
    // JWT로 바로 확장하기보다 세션 기반 MVP를 먼저 마무리하는 편이
    // 현재 프론트와의 정합성 면에서 가장 빠르다.

    private final SessionAuthenticationFilter sessionAuthenticationFilter;

    public SecurityConfig(SessionAuthenticationFilter sessionAuthenticationFilter) {
        this.sessionAuthenticationFilter = sessionAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 프론트가 별도 도메인/포트에서 붙을 가능성이 높아 cors 설정은 실제 배포 전 반드시 구체화 필요
                .cors(withDefaults())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // 숙소 목록/상세는 비로그인 접근이 필요한 화면이다.
                        .requestMatchers(HttpMethod.GET, "/api/v1/lodgings", "/api/v1/lodgings/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
