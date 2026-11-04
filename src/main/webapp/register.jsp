<%@ page contentType="text/html; charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Create Account - IT Helpdesk</title>

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
                    EMPLOYEE REGISTRATION
                </p>

                <h1>
                    Get technical support without
                    losing track of your request.
                </h1>

                <p class="auth-description">
                    Create an employee account to report
                    issues, monitor deadlines and communicate
                    with the assigned support agent.
                </p>

                <div class="auth-benefits">

                    <div>
                        <span>✓</span>
                        Create categorized support tickets
                    </div>

                    <div>
                        <span>✓</span>
                        Follow every status change
                    </div>

                    <div>
                        <span>✓</span>
                        Review comments and ticket history
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
                        CREATE ACCOUNT
                    </p>

                    <h2>Employee registration</h2>

                    <p>
                        Enter your details to create
                        a helpdesk account.
                    </p>

                </div>

                <%
                    String error =
                            (String) request.getAttribute("error");

                    String success =
                            (String) request.getAttribute("success");

                    if(error != null)
                    {
                %>

                    <div class="auth-message error-message">
                        <%= error %>
                    </div>

                <%
                    }

                    if(success != null)
                    {
                %>

                    <div class="auth-message success-message">
                        <%= success %>
                    </div>

                <%
                    }
                %>

                <form class="auth-form"
                      action="${pageContext.request.contextPath}/register"
                      method="post">

                    <div class="auth-field">

                        <label for="fullName">
                            Full name
                        </label>

                        <input type="text"
                               id="fullName"
                               name="fullName"
                               maxlength="100"
                               placeholder="Enter your full name"
                               autocomplete="name"
                               required>

                    </div>

                    <div class="auth-field">

                        <label for="email">
                            Email address
                        </label>

                        <input type="email"
                               id="email"
                               name="email"
                               maxlength="120"
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
                               minlength="6"
                               placeholder="Minimum 6 characters"
                               autocomplete="new-password"
                               required>

                    </div>

                    <div class="auth-field">

                        <label for="confirmPassword">
                            Confirm password
                        </label>

                        <input type="password"
                               id="confirmPassword"
                               name="confirmPassword"
                               minlength="6"
                               placeholder="Enter the password again"
                               autocomplete="new-password"
                               required>

                    </div>

                    <button class="auth-submit"
                            type="submit">
                        Create Account
                    </button>

                </form>

                <p class="auth-switch">
                    Already have an account?

                    <a href="${pageContext.request.contextPath}/login">
                        Sign in
                    </a>
                </p>

            </div>

        </section>

    </main>

</body>
</html>