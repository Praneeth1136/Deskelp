package com.dinesh.helpdesk.model;

import java.sql.Timestamp;

public class Ticket
{
    private int ticketId;
    private int createdBy;
    private int assignedTo;

    private String createdByName;
    private String assignedToName;

    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;

    private Timestamp createdAt;
    private Timestamp dueAt;

    public Ticket()
    {
    }

    public Ticket(int createdBy, String title,
                  String description, String category,
                  String priority, Timestamp dueAt)
    {
        this.createdBy = createdBy;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.dueAt = dueAt;
        this.status = "OPEN";
    }

    public int getTicketId()
    {
        return ticketId;
    }

    public void setTicketId(int ticketId)
    {
        this.ticketId = ticketId;
    }

    public int getCreatedBy()
    {
        return createdBy;
    }

    public void setCreatedBy(int createdBy)
    {
        this.createdBy = createdBy;
    }

    public int getAssignedTo()
    {
        return assignedTo;
    }

    public void setAssignedTo(int assignedTo)
    {
        this.assignedTo = assignedTo;
    }

    public String getCreatedByName()
    {
        return createdByName;
    }

    public void setCreatedByName(String createdByName)
    {
        this.createdByName = createdByName;
    }

    public String getAssignedToName()
    {
        return assignedToName;
    }

    public void setAssignedToName(String assignedToName)
    {
        this.assignedToName = assignedToName;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getCategory()
    {
        return category;
    }

    public void setCategory(String category)
    {
        this.category = category;
    }

    public String getPriority()
    {
        return priority;
    }

    public void setPriority(String priority)
    {
        this.priority = priority;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public Timestamp getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt)
    {
        this.createdAt = createdAt;
    }

    public Timestamp getDueAt()
    {
        return dueAt;
    }

    public void setDueAt(Timestamp dueAt)
    {
        this.dueAt = dueAt;
    }
}