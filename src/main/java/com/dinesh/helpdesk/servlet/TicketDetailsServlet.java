package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.CommentDAO;
import com.dinesh.helpdesk.dao.HistoryDAO;
import com.dinesh.helpdesk.dao.TicketDetailsDAO;
import com.dinesh.helpdesk.model.Ticket;
import com.dinesh.helpdesk.model.TicketComment;
import com.dinesh.helpdesk.model.TicketHistory;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * GET /api/tickets/details?id={ticketId}
 *
 * Returns the full details of a ticket including its comments
 * and status history.
 *
 * Access rules (enforced by TicketDetailsDAO):
 *   EMPLOYEE – can only view their own tickets
 *   AGENT    – can only view tickets assigned to them
 *   ADMIN    – can view all tickets
 */
@WebServlet("/api/tickets/details")
public class TicketDetailsServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException
    {
        int    userId = (int)    request.getAttribute("userId");
        String role   = (String) request.getAttribute("role");

        int ticketId;

        try
        {
            ticketId = Integer.parseInt(
                    request.getParameter("id"));
        }
        catch(Exception e)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid ticket ID");

            return;
        }

        TicketDetailsDAO detailsDAO = new TicketDetailsDAO();

        boolean allowed = detailsDAO.canUserAccessTicket(
                ticketId,
                userId,
                role);

        if(!allowed)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "You do not have permission to view this ticket");

            return;
        }

        Ticket ticket = detailsDAO.getTicketById(ticketId);

        if(ticket == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_NOT_FOUND,
                    "Ticket not found");

            return;
        }

        CommentDAO commentDAO = new CommentDAO();
        HistoryDAO historyDAO = new HistoryDAO();

        List<TicketComment> comments =
                commentDAO.getCommentsByTicket(ticketId);

        List<TicketHistory> history =
                historyDAO.getHistoryByTicket(ticketId);

        Map<String, Object> data = new LinkedHashMap<>();

        data.put("ticket",   ticket);
        data.put("comments", comments);
        data.put("history",  history);

        JsonResponse.send(response, HttpServletResponse.SC_OK, data);
    }
}
