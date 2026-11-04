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
 * POST /api/admin/assign
 *
 * Request body (JSON):
 *   { "ticketId": 5, "agentId": 3 }
 *
 * Assigns an OPEN ticket to a support agent.
 * Only ADMIN role can call this endpoint.
 *
 * The DAO wraps the assignment in a database transaction
 * and records the status change in ticket_history.
 */
@WebServlet("/api/admin/assign")
public class AssignTicketServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"ADMIN".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only admins can assign tickets");

            return;
        }

        int adminId = (int) request.getAttribute("userId");

        Map<String, Object> body = JsonResponse.readBody(request);

        Object ticketIdValue = body.get("ticketId");
        Object agentIdValue  = body.get("agentId");

        if(ticketIdValue == null || agentIdValue == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId and agentId are required");

            return;
        }

        try
        {
            int ticketId =
                    Integer.parseInt(ticketIdValue.toString());

            int agentId =
                    Integer.parseInt(agentIdValue.toString());

            TicketDAO ticketDAO = new TicketDAO();

            boolean assigned = ticketDAO.assignTicket(
                    ticketId,
                    agentId,
                    adminId);

            if(assigned)
            {
                Map<String, Object> data = new LinkedHashMap<>();

                data.put("message", "Ticket assigned successfully");

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
                        "Assignment failed. Ticket may not be OPEN " +
                        "or agent ID may be invalid.");
            }
        }
        catch(NumberFormatException e)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId and agentId must be valid numbers");
        }
    }
}
