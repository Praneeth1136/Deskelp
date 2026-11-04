package com.dinesh.helpdesk.model;

import java.sql.Timestamp;

public class TicketHistory
{
    private int historyId;
    private int ticketId;
    private int changedBy;

    private String changedByName;
    private String oldStatus;
    private String newStatus;

    private Timestamp changedAt;

    public TicketHistory()
    {
    }

    public int getHistoryId()
    {
        return historyId;
    }

    public void setHistoryId(int historyId)
    {
        this.historyId = historyId;
    }

    public int getTicketId()
    {
        return ticketId;
    }

    public void setTicketId(int ticketId)
    {
        this.ticketId = ticketId;
    }

    public int getChangedBy()
    {
        return changedBy;
    }

    public void setChangedBy(int changedBy)
    {
        this.changedBy = changedBy;
    }

    public String getChangedByName()
    {
        return changedByName;
    }

    public void setChangedByName(String changedByName)
    {
        this.changedByName = changedByName;
    }

    public String getOldStatus()
    {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus)
    {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus()
    {
        return newStatus;
    }

    public void setNewStatus(String newStatus)
    {
        this.newStatus = newStatus;
    }

    public Timestamp getChangedAt()
    {
        return changedAt;
    }

    public void setChangedAt(Timestamp changedAt)
    {
        this.changedAt = changedAt;
    }
}