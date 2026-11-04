package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.TicketDAO;
import com.dinesh.helpdesk.model.Ticket;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * POST /api/tickets/create
 *
 * Request body (JSON):
 *   {
 *     "title":       "...",
 *     "description": "...",
 *     "category":    "HARDWARE | SOFTWARE | NETWORK | ACCOUNT_ACCESS | OTHER",
 *     "priority":    "LOW | MEDIUM | HIGH | CRITICAL"
 *   }
 *
 * Only EMPLOYEE role can create tickets.
 * The SLA due time is calculated automatically from the priority.
 */
@WebServlet("/api/tickets/create")
public class CreateTicketServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        request.setCharacterEncoding("UTF-8");

        String role = (String) request.getAttribute("role");

        if(!"EMPLOYEE".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only employees can create tickets");

            return;
        }

        int userId = (int) request.getAttribute("userId");

        Map<String, Object> body = JsonResponse.readBody(request);

        String title       = JsonResponse.getString(body, "title");
        String description = JsonResponse.getString(body, "description");
        String category    = JsonResponse.getString(body, "category");
        String priority    = JsonResponse.getString(body, "priority");

        if(title == null || description == null ||
           category == null || priority == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "All ticket fields are required");

            return;
        }

        if(title.length() > 150)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Title cannot exceed 150 characters");

            return;
        }

        if(description.length() > 2000)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Description cannot exceed 2000 characters");

            return;
        }

        category = category.toUpperCase();
        priority = priority.toUpperCase();

        boolean validCategory =
                "HARDWARE".equals(category)       ||
                "SOFTWARE".equals(category)       ||
                "NETWORK".equals(category)        ||
                "ACCOUNT_ACCESS".equals(category) ||
                "OTHER".equals(category);

        if(!validCategory)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid category selected");

            return;
        }

        int slaHours;

        switch(priority)
        {
            case "CRITICAL": slaHours = 4;  break;
            case "HIGH":     slaHours = 8;  break;
            case "MEDIUM":   slaHours = 24; break;
            case "LOW":      slaHours = 48; break;

            default:
                JsonResponse.sendError(
                        response,
                        HttpServletResponse.SC_BAD_REQUEST,
                        "Invalid priority selected");

                return;
        }

        LocalDateTime dueDate =
                LocalDateTime.now().plusHours(slaHours);

        Timestamp dueAt = Timestamp.valueOf(dueDate);

        Ticket ticket = new Ticket(
                userId,
                title,
                description,
                category,
                priority,
                dueAt);

        TicketDAO ticketDAO = new TicketDAO();

        boolean created = ticketDAO.createTicket(ticket);

        if(created)
        {
            Map<String, Object> data = new LinkedHashMap<>();

            data.put("message", "Ticket created successfully");

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
                    "Ticket creation failed. Please try again.");
        }
    }
}
