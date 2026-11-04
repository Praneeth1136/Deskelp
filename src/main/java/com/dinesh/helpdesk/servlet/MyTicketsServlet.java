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
 * GET /api/tickets/my
 *
 * Returns all tickets created by the logged-in employee.
 * Only EMPLOYEE role can call this endpoint.
 */
@WebServlet("/api/tickets/my")
public class MyTicketsServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException
    {
        String role = (String) request.getAttribute("role");

        if(!"EMPLOYEE".equalsIgnoreCase(role))
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Only employees can view their tickets");

            return;
        }

        int userId = (int) request.getAttribute("userId");

        TicketDAO ticketDAO = new TicketDAO();

        List<Ticket> tickets =
                ticketDAO.getTicketsByUser(userId);

        JsonResponse.send(response, HttpServletResponse.SC_OK, tickets);
    }
}
