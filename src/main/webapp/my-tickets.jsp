<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.Timestamp" %>
<%@ page import="com.dinesh.helpdesk.model.Ticket" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>
<%@ page import="com.dinesh.helpdesk.util.HtmlUtil" %>

<%
    User loggedInUser =
            (User) session.getAttribute("loggedInUser");

    if(loggedInUser == null ||
       !"EMPLOYEE".equalsIgnoreCase(loggedInUser.getRole()))
    {
        response.sendRedirect(
                request.getContextPath() + "/dashboard");
        return;
    }

    List<Ticket> tickets =
            (List<Ticket>) request.getAttribute("tickets");
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>My Tickets - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">
</head>

<body>

    <h1>My Support Tickets</h1>

    <% if(request.getParameter("created") != null) { %>

        <p style="color: green;">
            Ticket created successfully.
        </p>

    <% } %>

    <a href="${pageContext.request.contextPath}/create-ticket">
        Create New Ticket
    </a>

    &nbsp; | &nbsp;

    <a href="${pageContext.request.contextPath}/dashboard">
        Dashboard
    </a>

    &nbsp; | &nbsp;

    <a href="${pageContext.request.contextPath}/logout">
        Logout
    </a>

    <br><br>

    <%
        if(tickets == null || tickets.isEmpty())
        {
    %>

        <p>You have not created any tickets yet.</p>

    <%
        }
        else
        {
    %>

        <table>

            <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Due At</th>
                <th>SLA</th>
            </tr>

            <%
                for(Ticket ticket : tickets)
                {
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
            %>

                <tr>
                    <td>
                        <%= ticket.getTicketId() %>
                    </td>

                    <td>
                        <a href="${pageContext.request.contextPath}/ticket-details?id=<%= ticket.getTicketId() %>">
                            <%= HtmlUtil.escape(
                                    ticket.getTitle()) %>
                        </a>
                    </td>

                    <td>
                        <%= HtmlUtil.escape(
                                ticket.getDescription()) %>
                    </td>

                    <td>
                        <%= ticket.getCategory() %>
                    </td>

                    <td>
                        <%= ticket.getPriority() %>
                    </td>

                    <td>
                        <%= ticket.getStatus() %>
                    </td>

                    <td>
                        <%= ticket.getCreatedAt() %>
                    </td>

                    <td>
                        <%= ticket.getDueAt() %>
                    </td>

                    <td>
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