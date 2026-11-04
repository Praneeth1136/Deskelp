<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>
<%@ page import="com.dinesh.helpdesk.util.HtmlUtil" %>

<%
    User loggedInUser =
            (User) session.getAttribute("loggedInUser");

    if(loggedInUser == null)
    {
        response.sendRedirect(
                request.getContextPath() + "/login");
        return;
    }
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Employee Dashboard - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/dashboard-style.css">
</head>

<body class="dashboard-page">

<header class="dashboard-header">
    <div class="dashboard-header-content">

        <a class="dashboard-brand"
           href="${pageContext.request.contextPath}/dashboard">

            <span class="dashboard-brand-mark">IT</span>
            Helpdesk
        </a>

        <div class="dashboard-user">

            <div class="dashboard-user-details">
                <strong>
                    <%= HtmlUtil.escape(
                            loggedInUser.getFullName()) %>
                </strong>

                <span>Employee Account</span>
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
                EMPLOYEE DASHBOARD
            </p>

            <h1>
                Welcome,
                <%= HtmlUtil.escape(
                        loggedInUser.getFullName()) %>
            </h1>

            <p class="dashboard-welcome-text">
                Create support requests, check their progress
                and communicate with the IT support team.
            </p>
        </div>

        <div class="dashboard-welcome-actions">

            <a class="primary-link"
               href="${pageContext.request.contextPath}/create-ticket">
                Create Ticket
            </a>

            <a class="secondary-link"
               href="${pageContext.request.contextPath}/my-tickets">
                My Tickets
            </a>

        </div>
    </section>

    <section class="dashboard-section">

        <div class="dashboard-section-heading">
            <h2>Support Actions</h2>

            <p>
                Select what you would like to do.
            </p>
        </div>

        <div class="employee-action-grid">

            <div class="employee-action-card">

                <span class="card-number">01</span>

                <h3>Create Support Ticket</h3>

                <p>
                    Report hardware, software, network
                    or account-access problems.
                </p>

                <a class="card-link"
                   href="${pageContext.request.contextPath}/create-ticket">
                    Create New Ticket
                </a>

            </div>

            <div class="employee-action-card">

                <span class="card-number">02</span>

                <h3>View My Tickets</h3>

                <p>
                    Track ticket status, read comments
                    and check SLA deadlines.
                </p>

                <a class="card-link"
                   href="${pageContext.request.contextPath}/my-tickets">
                    View Ticket History
                </a>

            </div>

        </div>

        <div class="information-grid">

            <div class="information-card">

                <h3>Ticket Workflow</h3>

                <div class="workflow-list">

                    <span class="workflow-item">OPEN</span>
                    <span class="workflow-arrow">&rarr;</span>

                    <span class="workflow-item">ASSIGNED</span>
                    <span class="workflow-arrow">&rarr;</span>

                    <span class="workflow-item">IN PROGRESS</span>
                    <span class="workflow-arrow">&rarr;</span>

                    <span class="workflow-item">RESOLVED</span>
                    <span class="workflow-arrow">&rarr;</span>

                    <span class="workflow-item">CLOSED</span>

                </div>
            </div>

            <div class="information-card">

                <h3>Response Targets</h3>

                <div class="sla-list">

                    <div class="sla-item">
                        <span>Critical</span>
                        <strong>4 hours</strong>
                    </div>

                    <div class="sla-item">
                        <span>High</span>
                        <strong>8 hours</strong>
                    </div>

                    <div class="sla-item">
                        <span>Medium</span>
                        <strong>24 hours</strong>
                    </div>

                    <div class="sla-item">
                        <span>Low</span>
                        <strong>48 hours</strong>
                    </div>

                </div>
            </div>

        </div>
    </section>

</main>

<footer class="dashboard-footer">
    <p>IT Helpdesk Ticketing System</p>
    <span>Employee Support Portal</span>
</footer>

</body>
</html>