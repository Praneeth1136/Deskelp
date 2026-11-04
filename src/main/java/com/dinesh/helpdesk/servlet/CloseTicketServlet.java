package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.TicketClosureDAO;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * POST /api/tickets/close
 *
 * Request body (JSON):
 *   { "ticketId": 5 }
 *
 * Closes a RESOLVED ticket.
 * Only the EMPLOYEE who created the ticket can close it.
 * The status change is recorded in ticket_history.
 */
@WebServlet("/api/tickets/close")
public class CloseTicketServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"EMPLOYEE".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only employees can close tickets");

            return;
        }

        int userId = (int) request.getAttribute("userId");

        Map<String, Object> body = JsonResponse.readBody(request);

        Object ticketIdValue = body.get("ticketId");

        if(ticketIdValue == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId is required");

            return;
        }

        try
        {
            int ticketId =
                    Integer.parseInt(ticketIdValue.toString());

            TicketClosureDAO closureDAO = new TicketClosureDAO();

            boolean closed = closureDAO.closeTicket(
                    ticketId,
                    userId);

            if(closed)
            {
                Map<String, Object> data = new LinkedHashMap<>();

                data.put("message", "Ticket closed successfully");

                JsonResponse.send(
                        response,
                        HttpServletResponse.SC_OK,
                        data);
            }
            else
            {
                JsonResponse.sendError(
                        response,
                        HttpServletResponse.SC_BAD_REQUEST,
                        "Failed to close ticket. " +
                        "It may not be RESOLVED or you may not be the creator.");
            }
        }
        catch(NumberFormatException e)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId must be a valid number");
        }
    }
}
