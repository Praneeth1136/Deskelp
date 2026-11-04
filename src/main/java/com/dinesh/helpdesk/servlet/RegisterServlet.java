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
import com.dinesh.helpdesk.util.PasswordUtil;

/**
 * POST /api/auth/register
 *
 * Request body (JSON):
 *   {
 *     "fullName": "...",
 *     "email": "...",
 *     "password": "...",
 *     "confirmPassword": "..."
 *   }
 *
 * Creates a new EMPLOYEE account.
 * Passwords are hashed with BCrypt before being stored.
 */
@WebServlet("/api/auth/register")
public class RegisterServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        request.setCharacterEncoding("UTF-8");

        Map<String, Object> body = JsonResponse.readBody(request);

        String fullName       = JsonResponse.getString(body, "fullName");
        String email          = JsonResponse.getString(body, "email");
        String password       = JsonResponse.getString(body, "password");
        String confirmPassword =
                JsonResponse.getString(body, "confirmPassword");

        if(fullName == null ||
           email == null ||
           password == null ||
           confirmPassword == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "All fields are required");

            return;
        }

        if(password.length() < 6)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Password must be at least 6 characters");

            return;
        }

        if(!password.equals(confirmPassword))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Passwords do not match");

            return;
        }

        email = email.toLowerCase();

        UserDAO userDAO = new UserDAO();

        if(userDAO.emailExists(email))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_CONFLICT,
                    "This email is already registered");

            return;
        }

        String passwordHash = PasswordUtil.hashPassword(password);

        User user = new User(
                fullName,
                email,
                passwordHash,
                "EMPLOYEE");

        boolean registered = userDAO.registerUser(user);

        if(registered)
        {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("message",
                    "Registration successful. You can now log in.");

            JsonResponse.send(
                    response,
                    HttpServletResponse.SC_CREATED,
                    data);
        }
        else
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Registration failed. Please try again.");
        }
    }
}
