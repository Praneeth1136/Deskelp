<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="com.dinesh.helpdesk.model.User" %>

<%
    User loggedInUser =
            (User) session.getAttribute("loggedInUser");

    if(loggedInUser == null)
    {
        response.sendRedirect(
                request.getContextPath() + "/login");
        return;
    }

    String error =
            (String) request.getAttribute("error");
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet"
      href="${pageContext.request.contextPath}/css/style.css">
    <title>Create Ticket - IT Helpdesk</title>
</head>

<body>

    <h1>Create Support Ticket</h1>

    <% if(error != null) { %>

        <p style="color: red;"><%= error %></p>

    <% } %>

    <form action="${pageContext.request.contextPath}/create-ticket"
          method="post">

        <label>Ticket Title</label><br>

        <input type="text"
               name="title"
               maxlength="150"
               required>

        <br><br>

        <label>Problem Description</label><br>

        <textarea name="description"
          rows="6"
          cols="50"
          maxlength="2000"
          required></textarea>

        <br><br>

        <label>Category</label><br>

        <select name="category" required>
            <option value="">Select category</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SOFTWARE">Software</option>
            <option value="NETWORK">Network</option>
            <option value="ACCOUNT_ACCESS">
                Account Access
            </option>
            <option value="OTHER">Other</option>
        </select>

        <br><br>

        <label>Priority</label><br>

        <select name="priority" required>
            <option value="">Select priority</option>
            <option value="LOW">Low - 48 hours</option>
            <option value="MEDIUM">Medium - 24 hours</option>
            <option value="HIGH">High - 8 hours</option>
            <option value="CRITICAL">
                Critical - 4 hours
            </option>
        </select>

        <br><br>

        <button type="submit">Submit Ticket</button>

    </form>

    <br>

    <a href="${pageContext.request.contextPath}/dashboard">
        Return to Dashboard
    </a>

</body>
</html>