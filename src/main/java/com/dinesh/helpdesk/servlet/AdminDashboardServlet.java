package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.TicketDAO;
import com.dinesh.helpdesk.dao.UserDAO;
import com.dinesh.helpdesk.model.Ticket;
import com.dinesh.helpdesk.model.User;
import com.dinesh.helpdesk.util.JsonResponse;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GET /api/admin/tickets
 *
 * Returns all tickets and all support agents.
 * Only ADMIN role can call this endpoint.
 *
 * The React admin dashboard uses this single endpoint to build
 * the full ticket table with the assign-to-agent dropdown.
 */
@WebServlet("/api/admin/tickets")
public class AdminDashboardServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"ADMIN".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only admins can access this endpoint");

            return;
        }

        TicketDAO ticketDAO = new TicketDAO();
        UserDAO   userDAO   = new UserDAO();

        List<Ticket> tickets = ticketDAO.getAllTickets();
        List<User>   agents  = userDAO.getAllAgents();

        Map<String, Object> data = new LinkedHashMap<>();

        data.put("tickets", tickets);
        data.put("agents",  agents);

        JsonResponse.send(response, HttpServletResponse.SC_OK, data);
    }
}
