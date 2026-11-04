package com.dinesh.helpdesk.servlet;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dinesh.helpdesk.dao.CommentDAO;
import com.dinesh.helpdesk.dao.TicketDetailsDAO;
import com.dinesh.helpdesk.model.TicketComment;
import com.dinesh.helpdesk.util.JsonResponse;

/**
 * POST /api/tickets/comment
 *
 * Request body (JSON):
 *   { "ticketId": 5, "message": "..." }
 *
 * Adds a comment to a ticket.
 * EMPLOYEE and AGENT roles can comment on tickets they can access.
 * Message must be between 1 and 1000 characters.
 */
@WebServlet("/api/tickets/comment")
public class AddCommentServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException
    {
        request.setCharacterEncoding("UTF-8");

        int    userId = (int)    request.getAttribute("userId");
        String role   = (String) request.getAttribute("role");

        Map<String, Object> body = JsonResponse.readBody(request);

        Object ticketIdValue = body.get("ticketId");
        String message       = JsonResponse.getString(body, "message");

        if(ticketIdValue == null || message == null)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId and message are required");

            return;
        }

        if(message.length() > 1000)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Message cannot exceed 1000 characters");

            return;
        }

        int ticketId;

        try
        {
            ticketId = Integer.parseInt(ticketIdValue.toString());
        }
        catch(NumberFormatException e)
        {
            JsonResponse.sendError(
                    response,
                    HttpServletResponse.SC_BAD_REQUEST,
                    "ticketId must be a valid number");

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
                    "You do not have permission to comment on this ticket");

            return;
        }

        TicketComment comment = new TicketComment();

        comment.setTicketId(ticketId);
        comment.setUserId(userId);
        comment.setMessage(message);

        CommentDAO commentDAO = new CommentDAO();

        boolean added = commentDAO.addComment(comment);

        if(added)
        {
            Map<String, Object> data = new LinkedHashMap<>();

            data.put("message", "Comment added successfully");

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
                    "Failed to add comment. Please try again.");
        }
    }
}
