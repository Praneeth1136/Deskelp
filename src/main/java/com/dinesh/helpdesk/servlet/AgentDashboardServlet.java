package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.TicketDAO;
import com.dinesh.helpdesk.model.Ticket;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * GET /api/agent/tickets
 *
 * Returns all tickets assigned to the logged-in agent,
 * ordered by priority (CRITICAL first) then by created date.
 * Only AGENT role can call this endpoint.
 */
@WebServlet("/api/agent/tickets")
public class AgentDashboardServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"AGENT".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only agents can access this endpoint");

            return;
        }

        int agentId = (int) request.getAttribute("userId");

        TicketDAO ticketDAO = new TicketDAO();

        List<Ticket> tickets =
                ticketDAO.getTicketsByAgent(agentId);

        JsonResponse.send(response, HttpServletResponse.SC_OK, tickets);
    }
}
