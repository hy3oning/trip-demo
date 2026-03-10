package com.tripzone.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SessionAuthenticationFilter extends OncePerRequestFilter {
    // HttpSession -> Spring Security Authentication 브리지 역할.
    // 컨트롤러에서 매번 세션을 직접 해석하지 않아도 ROLE 기반 인가를 붙일 수 있게 해준다.
    //
    // 주의:
    // - 세션 role 문자열은 User.Role enum name 과 동일해야 한다.
    // - principal 은 현재 userId 문자열만 넣고 있다.
    //   나중에 필요하면 CustomUserPrincipal 로 확장 가능하지만 지금은 최소 구성이 효율적이다.

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object userId = session.getAttribute(SessionKeys.USER_ID);
                Object role = session.getAttribute(SessionKeys.ROLE);

                if (userId instanceof Number numberUserId && role instanceof String roleName) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    String.valueOf(numberUserId.longValue()),
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + roleName)));
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
