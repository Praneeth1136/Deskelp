<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.Timestamp" %>
<%@ page import="com.dinesh.helpdesk.model.Ticket" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>
<%@ page import="com.dinesh.helpdesk.util.HtmlUtil" %>

<%
    User agent =
            (User) session.getAttribute("loggedInUser");

    if(agent == null ||
       !"AGENT".equalsIgnoreCase(agent.getRole()))
    {
        response.sendRedirect(
                request.getContextPath() + "/login");
        return;
    }

    List<Ticket> tickets =
            (List<Ticket>) request.getAttribute("tickets");

    int totalTickets = 0;
    int assignedTickets = 0;
    int inProgressTickets = 0;
    int completedTickets = 0;

    if(tickets != null)
    {
        totalTickets = tickets.size();

        for(Ticket item : tickets)
        {
            String itemStatus = item.getStatus();

            if("ASSIGNED".equalsIgnoreCase(itemStatus))
            {
                assignedTickets++;
            }
            else if("IN_PROGRESS".equalsIgnoreCase(itemStatus))
            {
                inProgressTickets++;
            }
            else if("RESOLVED".equalsIgnoreCase(itemStatus) ||
                    "CLOSED".equalsIgnoreCase(itemStatus))
            {
                completedTickets++;
            }
        }
    }
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Agent Dashboard - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/dashboard-style.css">
</head>

<body class="dashboard-page">

<header class="dashboard-header">
    <div class="dashboard-header-content">

        <a class="dashboard-brand"
           href="${pageContext.request.contextPath}/agent-dashboard">

            <span class="dashboard-brand-mark">IT</span>
            Helpdesk
        </a>

        <div class="dashboard-user">

            <div class="dashboard-user-details">
                <strong>
                    <%= HtmlUtil.escape(agent.getFullName()) %>
                </strong>

                <span>Support Agent Account</span>
            </div>

            <a class="logout-link"
               href="${pageContext.request.contextPath}/logout">
                Logout
            </a>

        </div>
    </div>
</header>

<main class="dashboard-container">

    <section class="dashboard-welcome">

        <div>
            <p class="dashboard-eyebrow">
                SUPPORT AGENT DASHBOARD
            </p>

            <h1>Your Assigned Tickets</h1>

            <p class="dashboard-welcome-text">
                Review assigned support requests, begin work
                and mark completed problems as resolved.
            </p>
        </div>

        <div class="dashboard-welcome-actions">

            <a class="primary-link"
               href="${pageContext.request.contextPath}/agent-dashboard">
                Refresh Tickets
            </a>

        </div>
    </section>

    <section class="summary-grid">

        <div class="summary-card">
            <span>Total Assigned</span>
            <strong><%= totalTickets %></strong>
        </div>

        <div class="summary-card">
            <span>Waiting to Start</span>
            <strong><%= assignedTickets %></strong>
        </div>

        <div class="summary-card">
            <span>In Progress</span>
            <strong><%= inProgressTickets %></strong>
        </div>

        <div class="summary-card">
            <span>Completed</span>
            <strong><%= completedTickets %></strong>
        </div>

    </section>

    <% if(request.getParameter("updated") != null) { %>

        <div class="dashboard-message success">
            Ticket status updated successfully.
        </div>

    <% } %>

    <% if(request.getParameter("error") != null) { %>

        <div class="dashboard-message error">
            Ticket status update failed.
        </div>

    <% } %>

    <section class="dashboard-panel">

        <div class="panel-heading">
            <h2>Assigned Support Tickets</h2>

            <p>
                Open a ticket to view its description,
                comments and complete status history.
            </p>
        </div>

        <%
            if(tickets == null || tickets.isEmpty())
            {
        %>

            <div class="empty-state">
                No tickets have been assigned to you.
            </div>

        <%
            }
            else
            {
        %>

            <div class="table-container">

                <table class="dashboard-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Due</th>
                            <th>SLA</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

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

                            String priorityClass =
                                    "priority-" +
                                    ticket.getPriority().toLowerCase();

                            String statusClass =
                                    "status-" +
                                    ticket.getStatus()
                                          .toLowerCase()
                                          .replace('_', '-');
                    %>

                        <tr>
                            <td>
                                #<%= ticket.getTicketId() %>
                            </td>

                            <td>
                                <%= HtmlUtil.escape(
                                        ticket.getCreatedByName()) %>
                            </td>

                            <td>
                                <a class="ticket-link"
                                   href="${pageContext.request.contextPath}/ticket-details?id=<%= ticket.getTicketId() %>">

                                    <%= HtmlUtil.escape(
                                            ticket.getTitle()) %>
                                </a>
                            </td>

                            <td>
                                <%= HtmlUtil.escape(
                                        ticket.getCategory()) %>
                            </td>

                            <td>
                                <span class="badge <%= priorityClass %>">
                                    <%= ticket.getPriority() %>
                                </span>
                            </td>

                            <td>
                                <span class="badge <%= statusClass %>">
                                    <%= ticket.getStatus()
                                             .replace("_", " ") %>
                                </span>
                            </td>

                            <td class="date-text">
                                <%= ticket.getCreatedAt() %>
                            </td>

                            <td class="date-text">
                                <%= ticket.getDueAt() %>
                            </td>

                            <td>
                                <% if(completed) { %>

                                    <span class="badge sla-completed">
                                        COMPLETED
                                    </span>

                                <% } else if(overdue) { %>

                                    <span class="badge sla-overdue">
                                        OVERDUE
                                    </span>

                                <% } else { %>

                                    <span class="badge sla-within">
                                        WITHIN SLA
                                    </span>

                                <% } %>
                            </td>

                            <td>
                                <% if("ASSIGNED".equalsIgnoreCase(
                                        ticket.getStatus())) { %>

                                    <form action="${pageContext.request.contextPath}/update-ticket-status"
                                          method="post">

                                        <input type="hidden"
                                               name="ticketId"
                                               value="<%= ticket.getTicketId() %>">

                                        <input type="hidden"
                                               name="newStatus"
                                               value="IN_PROGRESS">

                                        <button class="action-button"
                                                type="submit">
                                            Start Work
                                        </button>

                                    </form>

                                <% } else if("IN_PROGRESS".equalsIgnoreCase(
                                        ticket.getStatus())) { %>

                                    <form action="${pageContext.request.contextPath}/update-ticket-status"
                                          method="post">

                                        <input type="hidden"
                                               name="ticketId"
                                               value="<%= ticket.getTicketId() %>">

                                        <input type="hidden"
                                               name="newStatus"
                                               value="RESOLVED">

                                        <button class="action-button resolve-button"
                                                type="submit">
                                            Mark Resolved
                                        </button>

                                    </form>

                                <% } else { %>

                                    <span class="no-action">
                                        No action required
                                    </span>

                                <% } %>
                            </td>
                        </tr>

                    <%
                        }
                    %>

                    </tbody>
                </table>
            </div>

        <%
            }
        %>

    </section>

</main>

<footer class="dashboard-footer">
    <p>IT Helpdesk Ticketing System</p>
    <span>Support Agent Portal</span>
</footer>

</body>
</html>