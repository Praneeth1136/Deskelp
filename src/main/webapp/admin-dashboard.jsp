<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.Timestamp" %>
<%@ page import="com.dinesh.helpdesk.model.Ticket" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>
<%@ page import="com.dinesh.helpdesk.util.HtmlUtil" %>

<%
    User admin =
            (User) session.getAttribute("loggedInUser");

    if(admin == null ||
       !"ADMIN".equalsIgnoreCase(admin.getRole()))
    {
        response.sendRedirect(
                request.getContextPath() + "/login");
        return;
    }

    List<Ticket> tickets =
            (List<Ticket>) request.getAttribute("tickets");

    List<User> agents =
            (List<User>) request.getAttribute("agents");

    int totalTickets = 0;
    int openTickets = 0;
    int activeTickets = 0;
    int completedTickets = 0;

    if(tickets != null)
    {
        totalTickets = tickets.size();

        for(Ticket item : tickets)
        {
            String itemStatus = item.getStatus();

            if("OPEN".equalsIgnoreCase(itemStatus))
            {
                openTickets++;
            }
            else if("ASSIGNED".equalsIgnoreCase(itemStatus) ||
                    "IN_PROGRESS".equalsIgnoreCase(itemStatus))
            {
                activeTickets++;
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

    <title>Administrator Dashboard - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/dashboard-style.css">
</head>

<body class="dashboard-page">

<header class="dashboard-header">
    <div class="dashboard-header-content">

        <a class="dashboard-brand"
           href="${pageContext.request.contextPath}/admin-dashboard">

            <span class="dashboard-brand-mark">IT</span>
            Helpdesk
        </a>

        <div class="dashboard-user">

            <div class="dashboard-user-details">
                <strong>
                    <%= HtmlUtil.escape(admin.getFullName()) %>
                </strong>

                <span>Administrator Account</span>
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
                ADMINISTRATOR DASHBOARD
            </p>

            <h1>Support Operations</h1>

            <p class="dashboard-welcome-text">
                Review all support requests, monitor SLA
                deadlines and assign open tickets to agents.
            </p>
        </div>

        <div class="dashboard-welcome-actions">

            <a class="primary-link"
               href="${pageContext.request.contextPath}/admin-dashboard">
                Refresh Tickets
            </a>

        </div>
    </section>

    <section class="summary-grid">

        <div class="summary-card">
            <span>Total Tickets</span>
            <strong><%= totalTickets %></strong>
        </div>

        <div class="summary-card">
            <span>Waiting Assignment</span>
            <strong><%= openTickets %></strong>
        </div>

        <div class="summary-card">
            <span>Active Tickets</span>
            <strong><%= activeTickets %></strong>
        </div>

        <div class="summary-card">
            <span>Completed Tickets</span>
            <strong><%= completedTickets %></strong>
        </div>

    </section>

    <% if(request.getParameter("assigned") != null) { %>

        <div class="dashboard-message success">
            Ticket assigned successfully.
        </div>

    <% } %>

    <% if(request.getParameter("error") != null) { %>

        <div class="dashboard-message error">
            Ticket assignment failed.
        </div>

    <% } %>

    <section class="dashboard-panel">

        <div class="panel-heading">
            <h2>All Support Tickets</h2>

            <p>
                Open a ticket to view its complete details,
                comments and status history.
            </p>
        </div>

        <%
            if(tickets == null || tickets.isEmpty())
            {
        %>

            <div class="empty-state">
                No support tickets are currently available.
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
                            <th>Agent</th>
                            <th>Assignment</th>
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
                                <% if(ticket.getAssignedToName() == null) { %>

                                    <span class="no-action">
                                        Not assigned
                                    </span>

                                <% } else { %>

                                    <%= HtmlUtil.escape(
                                            ticket.getAssignedToName()) %>

                                <% } %>
                            </td>

                            <td>
                                <% if("OPEN".equalsIgnoreCase(
                                        ticket.getStatus())) { %>

                                    <% if(agents != null &&
                                          !agents.isEmpty()) { %>

                                        <form action="${pageContext.request.contextPath}/assign-ticket"
                                              method="post">

                                            <input type="hidden"
                                                   name="ticketId"
                                                   value="<%= ticket.getTicketId() %>">

                                            <select name="agentId" required>

                                                <option value="">
                                                    Select agent
                                                </option>

                                                <%
                                                    for(User agent : agents)
                                                    {
                                                %>

                                                    <option value="<%= agent.getUserId() %>">
                                                        <%= HtmlUtil.escape(
                                                                agent.getFullName()) %>
                                                    </option>

                                                <%
                                                    }
                                                %>

                                            </select>

                                            <button class="action-button"
                                                    type="submit">
                                                Assign
                                            </button>

                                        </form>

                                    <% } else { %>

                                        <span class="no-action">
                                            No agents available
                                        </span>

                                    <% } %>

                                <% } else { %>

                                    <span class="no-action">
                                        No assignment needed
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
    <span>Administrator Portal</span>
</footer>

</body>
</html>