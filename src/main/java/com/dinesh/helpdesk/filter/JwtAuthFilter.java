package com.dinesh.helpdesk.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.dinesh.helpdesk.util.JsonResponse;
import com.dinesh.helpdesk.util.JwtUtil;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JwtAuthFilter protects every /api/* route.
 *
 * Routes under /api/auth/ (login, register) are exempt because
 * the user does not have a token yet when they call those endpoints.
 *
 * For every other /api/* request the filter:
 *   1. Reads the Authorization header (expected: "Bearer <token>")
 *   2. Validates the JWT using JwtUtil
 *   3. If valid: extracts userId, email and role and stores them
 *      as request attributes so the servlet can read them
 *   4. If invalid or missing: returns HTTP 401 Unauthorized JSON
 *
 * This filter is registered in web.xml AFTER CORSFilter.
 */
public class JwtAuthFilter implements Filter
{
    @Override
    public void init(FilterConfig filterConfig)
            throws ServletException
    {
        // Nothing to initialise
    }

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException
    {
        HttpServletRequest  httpRequest  = (HttpServletRequest)  request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getServletPath();

        // Public routes: login and register do not need a token
        if(path.startsWith("/api/auth/"))
        {
            chain.doFilter(request, response);
            return;
        }

        // All other /api/* routes require a valid JWT
        String authHeader = httpRequest.getHeader("Authorization");

        if(authHeader == null ||
           !authHeader.startsWith("Bearer "))
        {
            JsonResponse.sendError(
                    httpResponse,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Authorization token is required");

            return;
        }

        // Strip the "Bearer " prefix to get the raw token string
        String token = authHeader.substring(7);

        DecodedJWT jwt = JwtUtil.validateToken(token);

        if(jwt == null)
        {
            JsonResponse.sendError(
                    httpResponse,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired token");

            return;
        }

        // Store the user's identity as request attributes
        // so every servlet can read them without touching the JWT again
        httpRequest.setAttribute(
                "userId",
                jwt.getClaim("userId").asInt());

        httpRequest.setAttribute(
                "email",
                jwt.getClaim("email").asString());

        httpRequest.setAttribute(
                "role",
                jwt.getClaim("role").asString());

        chain.doFilter(request, response);
    }

    @Override
    public void destroy()
    {
        // Nothing to clean up
    }
}

