package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.TicketDAO;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * POST /api/agent/update-status
 *
 * Request body (JSON):
 *   { "ticketId": 5, "newStatus": "IN_PROGRESS | RESOLVED" }
 *
 * Valid transitions (enforced by TicketDAO):
 *   ASSIGNED    → IN_PROGRESS
 *   IN_PROGRESS → RESOLVED
 *
 * Only AGENT role can call this endpoint.
 * The status change is recorded in ticket_history.
 */
@WebServlet("/api/agent/update-status")
public class UpdateTicketStatusServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"AGENT".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only agents can update ticket status");

            return;
        }

        int agentId = (int) request.getAttribute("userId");

        Map<String, Object> body = JsonResponse.readBody(request);

        Object ticketIdValue  = body.get("ticketId");
        String newStatus      = JsonResponse.getString(body, "newStatus");

        if(ticketIdValue == null || newStatus == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId and newStatus are required");

            return;
        }

        newStatus = newStatus.toUpperCase();

        if(!"IN_PROGRESS".equals(newStatus) &&
           !"RESOLVED".equals(newStatus))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "newStatus must be IN_PROGRESS or RESOLVED");

            return;
        }

        try
        {
            int ticketId =
                    Integer.parseInt(ticketIdValue.toString());

            TicketDAO ticketDAO = new TicketDAO();

            boolean updated = ticketDAO.updateTicketStatus(
                    ticketId,
                    agentId,
                    newStatus);

            if(updated)
            {
                Map<String, Object> data = new LinkedHashMap<>();

                data.put("message", "Ticket status updated to " + newStatus);

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
                        "Status update failed. The transition may not be allowed.");
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
