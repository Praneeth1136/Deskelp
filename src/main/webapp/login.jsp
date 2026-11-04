<%@ page contentType="text/html; charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Sign In - IT Helpdesk</title>

    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">
</head>

<body class="auth-page">

    <main class="auth-layout">

        <section class="auth-information">

            <div class="auth-information-content">

                <a class="auth-brand"
                   href="${pageContext.request.contextPath}/">

                    <span class="auth-brand-mark">IT</span>
                    <span>Helpdesk</span>

                </a>

                <p class="auth-label">
                    SUPPORT MANAGEMENT
                </p>

                <h1>
                    Keep every technical issue
                    visible and accountable.
                </h1>

                <p class="auth-description">
                    A single workspace for employees,
                    support agents and administrators
                    to manage IT requests.
                </p>

                <div class="auth-benefits">

                    <div>
                        <span>✓</span>
                        Track requests from creation to closure
                    </div>

                    <div>
                        <span>✓</span>
                        Monitor priority-based SLA deadlines
                    </div>

                    <div>
                        <span>✓</span>
                        Maintain comments and status history
                    </div>

                </div>

            </div>

        </section>

        <section class="auth-form-section">

            <div class="auth-card">

                <a class="auth-home-link"
                   href="${pageContext.request.contextPath}/">
                    ← Return to home
                </a>

                <div class="auth-card-heading">

                    <p class="auth-label">
                        SECURE ACCESS
                    </p>

                    <h2>Welcome back</h2>

                    <p>
                        Sign in to continue to the
                        IT Helpdesk system.
                    </p>

                </div>

                <%
                    String error =
                            (String) request.getAttribute("error");

                    if(error != null)
                    {
                %>

                    <div class="auth-message error-message">
                        <%= error %>
                    </div>

                <%
                    }

                    if(request.getParameter("logout") != null)
                    {
                %>

                    <div class="auth-message success-message">
                        You have logged out successfully.
                    </div>

                <%
                    }
                %>

                <form class="auth-form"
                      action="${pageContext.request.contextPath}/login"
                      method="post">

                    <div class="auth-field">

                        <label for="email">
                            Email address
                        </label>

                        <input type="email"
                               id="email"
                               name="email"
                               placeholder="name@example.com"
                               autocomplete="email"
                               required>

                    </div>

                    <div class="auth-field">

                        <label for="password">
                            Password
                        </label>

                        <input type="password"
                               id="password"
                               name="password"
                               placeholder="Enter your password"
                               autocomplete="current-password"
                               required>

                    </div>

                    <button class="auth-submit"
                            type="submit">
                        Sign In
                    </button>

                </form>

                <p class="auth-switch">
                    Don’t have an employee account?

                    <a href="${pageContext.request.contextPath}/register">
                        Create one
                    </a>
                </p>

            </div>

        </section>

    </main>

</body>
</html>