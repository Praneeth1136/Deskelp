package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.util.JsonResponse;

/**
 * POST /api/auth/logout
 *
 * JWT is stateless so the server cannot truly invalidate a token.
 * The client is responsible for deleting the token from localStorage.
 *
 * This endpoint exists so the React frontend can call a consistent
 * logout URL and receive a confirmation response.
 */
@WebServlet("/api/auth/logout")
public class LogoutServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws IOException
    {
        Map<String, Object> data = new LinkedHashMap<>();

        data.put("message", "Logged out successfully");

        JsonResponse.send(response, HttpServletResponse.SC_OK, data);
    }
}
