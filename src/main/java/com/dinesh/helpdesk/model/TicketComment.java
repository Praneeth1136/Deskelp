package com.dinesh.helpdesk.model;

import java.sql.Timestamp;

public class TicketComment
{
    private int commentId;
    private int ticketId;
    private int userId;

    private String userName;
    private String userRole;
    private String message;

    private Timestamp createdAt;

    public TicketComment()
    {
    }

    public int getCommentId()
    {
        return commentId;
    }

    public void setCommentId(int commentId)
    {
        this.commentId = commentId;
    }

    public int getTicketId()
    {
        return ticketId;
    }

    public void setTicketId(int ticketId)
    {
        this.ticketId = ticketId;
    }

    public int getUserId()
    {
        return userId;
    }

    public void setUserId(int userId)
    {
        this.userId = userId;
    }

    public String getUserName()
    {
        return userName;
    }

    public void setUserName(String userName)
    {
        this.userName = userName;
    }

    public String getUserRole()
    {
        return userRole;
    }

    public void setUserRole(String userRole)
    {
        this.userRole = userRole;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    public Timestamp getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt)
    {
        this.createdAt = createdAt;
    }
}