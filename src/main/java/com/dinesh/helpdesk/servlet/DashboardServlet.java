package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.util.JsonResponse;

/**
 * GET /api/dashboard
 *
 * Returns the logged-in user's identity and role.
 * The React frontend uses this to decide which dashboard to show.
 *
 * The user's data is extracted from the JWT claims that
 * JwtAuthFilter stored as request attributes.
 */
@WebServlet("/api/dashboard")
public class DashboardServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException
    {
        int    userId = (int)    request.getAttribute("userId");
        String email  = (String) request.getAttribute("email");
        String role   = (String) request.getAttribute("role");

        Map<String, Object> data = new LinkedHashMap<>();

        data.put("userId", userId);
        data.put("email",  email);
        data.put("role",   role);

        JsonResponse.send(response, HttpServletResponse.SC_OK, data);
    }
}
