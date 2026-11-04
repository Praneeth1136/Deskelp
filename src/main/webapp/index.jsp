<%@ page contentType="text/html; charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>IT Helpdesk Ticketing System</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">
</head>

<body class="landing-page">

    <header class="landing-header">

        <div class="header-content">

            <a class="brand"
               href="${pageContext.request.contextPath}/">

                <span class="brand-mark">IT</span>

                <span class="brand-name">
                    Helpdesk
                </span>
            </a>

            <nav class="landing-navigation">

                <a class="navigation-login"
                   href="${pageContext.request.contextPath}/login">
                    Sign In
                </a>

                <a class="navigation-register"
                   href="${pageContext.request.contextPath}/register">
                    Create Account
                </a>

            </nav>

        </div>

    </header>

    <main>

        <section class="hero-section">

            <div class="hero-container">

                <div class="hero-content">

                    <p class="hero-label">
                        IT SUPPORT MANAGEMENT
                    </p>

                    <h1>
                        Technical support made simple,
                        organized and trackable.
                    </h1>

                    <p class="hero-description">
                        Report workplace IT problems, monitor
                        service deadlines and communicate with
                        support agents from one secure system.
                    </p>

                    <div class="hero-actions">

                        <a class="primary-action"
                           href="${pageContext.request.contextPath}/register">
                            Raise a Support Ticket
                        </a>

                        <a class="secondary-action"
                           href="${pageContext.request.contextPath}/login">
                            Sign In
                        </a>

                    </div>

                    <div class="role-summary">

                        <span>Employee requests</span>
                        <span>Agent workflow</span>
                        <span>Administrator control</span>

                    </div>

                </div>

                <div class="ticket-preview">

                    <div class="preview-header">

                        <div>
                            <p class="preview-label">
                                ACTIVE SUPPORT TICKET
                            </p>

                            <h2>Network connectivity issue</h2>
                        </div>

                        <span class="preview-status">
                            IN PROGRESS
                        </span>

                    </div>

                    <p class="preview-description">
                        Unable to connect to the office Wi-Fi
                        network from the assigned workstation.
                    </p>

                    <div class="preview-information">

                        <div>
                            <span>Category</span>
                            <strong>Network</strong>
                        </div>

                        <div>
                            <span>Priority</span>
                            <strong class="priority-high">
                                High
                            </strong>
                        </div>

                        <div>
                            <span>SLA</span>
                            <strong class="sla-safe">
                                Within deadline
                            </strong>
                        </div>

                    </div>

                    <div class="preview-progress">

                        <div class="progress-step completed-step">
                            <span>1</span>
                            <p>Created</p>
                        </div>

                        <div class="progress-line active-line"></div>

                        <div class="progress-step completed-step">
                            <span>2</span>
                            <p>Assigned</p>
                        </div>

                        <div class="progress-line active-line"></div>

                        <div class="progress-step current-step">
                            <span>3</span>
                            <p>In Progress</p>
                        </div>

                        <div class="progress-line"></div>

                        <div class="progress-step">
                            <span>4</span>
                            <p>Resolved</p>
                        </div>

                    </div>

                </div>

            </div>

        </section>

        <section class="feature-section">

            <div class="section-heading">

                <p class="section-label">
                    CORE FEATURES
                </p>

                <h2>
                    Everything required to manage
                    technical-support requests
                </h2>

                <p>
                    A clear workflow for employees,
                    support agents and administrators.
                </p>

            </div>

            <div class="feature-grid">

                <article class="feature-card">

                    <div class="feature-number">01</div>

                    <h3>Submit and track</h3>

                    <p>
                        Employees can create categorized
                        support tickets and monitor their
                        complete status.
                    </p>

                </article>

                <article class="feature-card">

                    <div class="feature-number">02</div>

                    <h3>Assign and resolve</h3>

                    <p>
                        Administrators assign requests while
                        agents follow a controlled resolution
                        workflow.
                    </p>

                </article>

                <article class="feature-card">

                    <div class="feature-number">03</div>

                    <h3>Monitor service levels</h3>

                    <p>
                        Priority-based SLA deadlines help
                        identify requests that require
                        immediate attention.
                    </p>

                </article>

            </div>

        </section>

        <section class="workflow-section">

            <div class="workflow-content">

                <div>

                    <p class="section-label">
                        TICKET LIFECYCLE
                    </p>

                    <h2>
                        Every request follows a
                        controlled workflow
                    </h2>

                </div>

                <div class="workflow-steps">

                    <span>Open</span>
                    <strong>→</strong>
                    <span>Assigned</span>
                    <strong>→</strong>
                    <span>In Progress</span>
                    <strong>→</strong>
                    <span>Resolved</span>
                    <strong>→</strong>
                    <span>Closed</span>

                </div>

            </div>

        </section>

    </main>

    <footer class="landing-footer">

        <p>
            IT Helpdesk Ticketing System
        </p>

        <span>
            Built with Java, Servlets, JSP, JDBC and MySQL
        </span>

    </footer>

</body>
</html>