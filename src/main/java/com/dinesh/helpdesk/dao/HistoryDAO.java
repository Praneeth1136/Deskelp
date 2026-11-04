package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.dinesh.helpdesk.config.DBConnection;
import com.dinesh.helpdesk.model.TicketHistory;

public class HistoryDAO
{
    public List<TicketHistory> getHistoryByTicket(
            int ticketId)
    {
        List<TicketHistory> historyList =
                new ArrayList<TicketHistory>();

        String query =
                "SELECT h.history_id, h.ticket_id, " +
                "h.changed_by, h.old_status, " +
                "h.new_status, h.changed_at, " +
                "u.full_name " +
                "FROM ticket_history h " +
                "JOIN users u ON h.changed_by = u.user_id " +
                "WHERE h.ticket_id = ? " +
                "ORDER BY h.changed_at";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, ticketId);

            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                TicketHistory history =
                        new TicketHistory();

                history.setHistoryId(
                        result.getInt("history_id"));

                history.setTicketId(
                        result.getInt("ticket_id"));

                history.setChangedBy(
                        result.getInt("changed_by"));

                history.setChangedByName(
                        result.getString("full_name"));

                history.setOldStatus(
                        result.getString("old_status"));

                history.setNewStatus(
                        result.getString("new_status"));

                history.setChangedAt(
                        result.getTimestamp("changed_at"));

                historyList.add(history);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return historyList;
    }
}