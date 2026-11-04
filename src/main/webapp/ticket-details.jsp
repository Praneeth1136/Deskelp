<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.Timestamp" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>
<%@ page import="com.dinesh.helpdesk.model.Ticket" %>
<%@ page import="com.dinesh.helpdesk.model.TicketComment" %>
<%@ page import="com.dinesh.helpdesk.model.TicketHistory" %>
<%@ page import="com.dinesh.helpdesk.util.HtmlUtil" %>

<%
    User user =
            (User) session.getAttribute("loggedInUser");

    if(user == null)
    {
        response.sendRedirect(
                request.getContextPath() + "/login");
        return;
    }

    Ticket ticket =
            (Ticket) request.getAttribute("ticket");

    if(ticket == null)
    {
        response.sendRedirect(
                request.getContextPath() + "/dashboard");
        return;
    }

    List<TicketComment> comments =
            (List<TicketComment>)
            request.getAttribute("comments");

    List<TicketHistory> history =
            (List<TicketHistory>)
            request.getAttribute("history");

    String returnPage;

    if("ADMIN".equalsIgnoreCase(user.getRole()))
    {
        returnPage = "/admin-dashboard";
    }
    else if("AGENT".equalsIgnoreCase(user.getRole()))
    {
        returnPage = "/agent-dashboard";
    }
    else
    {
        returnPage = "/my-tickets";
    }

    boolean completed =
            "RESOLVED".equalsIgnoreCase(
                    ticket.getStatus()) ||
            "CLOSED".equalsIgnoreCase(
                    ticket.getStatus());

    boolean overdue =
            !completed &&
            ticket.getDueAt() != null &&
            ticket.getDueAt().before(
                    new Timestamp(
                            System.currentTimeMillis()));

    boolean canCloseTicket =
            "EMPLOYEE".equalsIgnoreCase(user.getRole()) &&
            ticket.getCreatedBy() == user.getUserId() &&
            "RESOLVED".equalsIgnoreCase(
                    ticket.getStatus());
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Ticket Details - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">
</head>

<body>

    <h1>Ticket Details</h1>

    <a href="<%= request.getContextPath() + returnPage %>">
        Return to Dashboard
    </a>

    &nbsp; | &nbsp;

    <a href="${pageContext.request.contextPath}/logout">
        Logout
    </a>

    <hr>

    <h2>
        Ticket #<%= ticket.getTicketId() %>
    </h2>

    <p>
        <strong>Title:</strong>
        <%= HtmlUtil.escape(ticket.getTitle()) %>
    </p>

    <p>
        <strong>Description:</strong>
        <%= HtmlUtil.escape(ticket.getDescription()) %>
    </p>

    <p>
        <strong>Created By:</strong>
        <%= HtmlUtil.escape(
                ticket.getCreatedByName()) %>
    </p>

    <p>
        <strong>Assigned Agent:</strong>

        <% if(ticket.getAssignedToName() == null) { %>

            Not Assigned

        <% } else { %>

            <%= HtmlUtil.escape(
                    ticket.getAssignedToName()) %>

        <% } %>
    </p>

    <p>
        <strong>Category:</strong>
        <%= ticket.getCategory() %>
    </p>

    <p>
        <strong>Priority:</strong>
        <%= ticket.getPriority() %>
    </p>

    <p>
        <strong>Status:</strong>
        <%= ticket.getStatus() %>
    </p>

    <p>
        <strong>Created:</strong>
        <%= ticket.getCreatedAt() %>
    </p>

    <p>
        <strong>Due:</strong>
        <%= ticket.getDueAt() %>
    </p>

    <p>
        <strong>SLA:</strong>

        <% if(completed) { %>

            <span style="color: green;">
                Completed
            </span>

        <% } else if(overdue) { %>

            <span style="color: red;">
                Overdue
            </span>

        <% } else { %>

            <span style="color: blue;">
                Within SLA
            </span>

        <% } %>
    </p>

    <hr>

    <% if("true".equals(
            request.getParameter("closed"))) { %>

        <p style="color: green;">
            Ticket closed successfully.
        </p>

    <% } %>

    <% if("true".equals(
            request.getParameter("closeError"))) { %>

        <p style="color: red;">
            Ticket could not be closed. Only the employee
            who created a resolved ticket can close it.
        </p>

    <% } %>

    <% if(canCloseTicket) { %>

        <h2>Close Ticket</h2>

        <p>
            The support agent has resolved this ticket.
            Close it if your issue has been fixed.
        </p>

        <form action="${pageContext.request.contextPath}/close-ticket"
              method="post">

            <input type="hidden"
                   name="ticketId"
                   value="<%= ticket.getTicketId() %>">

            <button type="submit">
                Close Ticket
            </button>

        </form>

        <hr>

    <% } %>

    <h2>Comments</h2>

    <% if(request.getParameter("commented") != null) { %>

        <p style="color: green;">
            Comment added successfully.
        </p>

    <% } %>

    <% if(request.getParameter("error") != null) { %>

        <p style="color: red;">
            Comment could not be added.
        </p>

    <% } %>

    <%
        if(comments == null || comments.isEmpty())
        {
    %>

        <p>No comments have been added.</p>

    <%
        }
        else
        {
            for(TicketComment comment : comments)
            {
    %>

        <div>
            <strong>
                <%= HtmlUtil.escape(
                        comment.getUserName()) %>

                (<%= comment.getUserRole() %>)
            </strong>

            <p>
                <%= HtmlUtil.escape(
                        comment.getMessage()) %>
            </p>

            <small>
                <%= comment.getCreatedAt() %>
            </small>
        </div>

        <hr>

    <%
            }
        }
    %>

    <h3>Add Comment</h3>

    <form action="${pageContext.request.contextPath}/add-comment"
          method="post">

        <input type="hidden"
               name="ticketId"
               value="<%= ticket.getTicketId() %>">

        <textarea name="message"
                  rows="4"
                  maxlength="1000"
                  required></textarea>

        <br><br>

        <button type="submit">
            Add Comment
        </button>

    </form>

    <hr>

    <h2>Status History</h2>

    <%
        if(history == null || history.isEmpty())
        {
    %>

        <p>No status changes are available.</p>

    <%
        }
        else
        {
    %>

        <table>

            <tr>
                <th>Changed By</th>
                <th>Old Status</th>
                <th>New Status</th>
                <th>Changed At</th>
            </tr>

            <%
                for(TicketHistory item : history)
                {
            %>

                <tr>
                    <td>
                        <%= HtmlUtil.escape(
                                item.getChangedByName()) %>
                    </td>

                    <td>
                        <%= item.getOldStatus() %>
                    </td>

                    <td>
                        <%= item.getNewStatus() %>
                    </td>

                    <td>
                        <%= item.getChangedAt() %>
                    </td>
                </tr>

            <%
                }
            %>

        </table>

    <%
        }
    %>

</body>
</html>