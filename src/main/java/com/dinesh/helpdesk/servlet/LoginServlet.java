package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.UserDAO;
import com.dinesh.helpdesk.model.User;
import com.dinesh.helpdesk.util.JsonResponse;
import com.dinesh.helpdesk.util.JwtUtil;
import com.dinesh.helpdesk.util.PasswordUtil;

/**
 * POST /api/auth/login
 *
 * Request body (JSON):
 *   { "email": "...", "password": "..." }
 *
 * Success response:
 *   { "success": true, "data": { "token": "...", "user": { ... } } }
 *
 * The client stores the returned JWT and sends it in the
 * Authorization header for every subsequent request.
 */
@WebServlet("/api/auth/login")
public class LoginServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        request.setCharacterEncoding("UTF-8");

        Map<String, Object> body = JsonResponse.readBody(request);

        String email    = JsonResponse.getString(body, "email");
        String password = JsonResponse.getString(body, "password");

        if(email == null || password == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Email and password are required");

            return;
        }

        email = email.toLowerCase();

        UserDAO userDAO = new UserDAO();

        User user = userDAO.findByEmail(email);

        // findByEmail returns null if no account exists for that email.
        // checkPassword verifies the BCrypt hash.
        if(user == null ||
           !PasswordUtil.checkPassword(password, user.getPasswordHash()))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid email or password");

            return;
        }

        String token = JwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getRole());

        // Build the response payload
        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("userId",   user.getUserId());
        userData.put("fullName", user.getFullName());
        userData.put("email",    user.getEmail());
        userData.put("role",     user.getRole());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("user",  userData);

        JsonResponse.send(response, HttpServletResponse.SC_OK, data);
    }
}
