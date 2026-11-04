package com.dinesh.helpdesk.filter;

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
 * CORSFilter adds the HTTP headers that allow the React frontend
 * running on http://localhost:5173 to call this backend API.
 *
 * Without these headers the browser blocks the request before it
 * even reaches the servlet (same-origin policy).
 *
 * It also handles OPTIONS pre-flight requests which the browser
 * sends automatically before POST / PUT requests with custom headers.
 *
 * This filter is registered in web.xml BEFORE JwtAuthFilter so that
 * the OPTIONS pre-flight request is never rejected by the JWT check.
 */
public class CORSFilter implements Filter
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

        // Allow requests from the React dev server
        httpResponse.setHeader(
                "Access-Control-Allow-Origin",
                "http://localhost:5173");

        // Allowed HTTP methods
        httpResponse.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS");

        // Allowed request headers (Authorization carries the JWT)
        httpResponse.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization");

        // Allow cookies / credentials if needed in the future
        httpResponse.setHeader(
                "Access-Control-Allow-Credentials",
                "true");

        // Handle browser pre-flight check and stop here
        if("OPTIONS".equalsIgnoreCase(httpRequest.getMethod()))
        {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy()
    {
        // Nothing to clean up
    }
}

