package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.dinesh.helpdesk.config.DBConnection;
import com.dinesh.helpdesk.model.Ticket;

public class TicketDetailsDAO
{
    public boolean canUserAccessTicket(int ticketId,
                                       int userId,
                                       String role)
    {
        String query =
                "SELECT ticket_id FROM tickets " +
                "WHERE ticket_id = ? " +
                "AND (created_by = ? " +
                "OR assigned_to = ? " +
                "OR ? = 'ADMIN')";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, ticketId);
            statement.setInt(2, userId);
            statement.setInt(3, userId);
            statement.setString(4, role);

            ResultSet result = statement.executeQuery();

            return result.next();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    public Ticket getTicketById(int ticketId)
    {
        String query =
                "SELECT t.ticket_id, t.created_by, " +
                "t.assigned_to, t.title, t.description, " +
                "t.category, t.priority, t.status, " +
                "t.created_at, t.due_at, " +
                "creator.full_name AS creator_name, " +
                "agent.full_name AS agent_name " +
                "FROM tickets t " +
                "JOIN users creator " +
                "ON t.created_by = creator.user_id " +
                "LEFT JOIN users agent " +
                "ON t.assigned_to = agent.user_id " +
                "WHERE t.ticket_id = ?";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, ticketId);

            ResultSet result = statement.executeQuery();

            if(result.next())
            {
                Ticket ticket = new Ticket();

                ticket.setTicketId(
                        result.getInt("ticket_id"));

                ticket.setCreatedBy(
                        result.getInt("created_by"));

                ticket.setAssignedTo(
                        result.getInt("assigned_to"));

                ticket.setCreatedByName(
                        result.getString("creator_name"));

                ticket.setAssignedToName(
                        result.getString("agent_name"));

                ticket.setTitle(
                        result.getString("title"));

                ticket.setDescription(
                        result.getString("description"));

                ticket.setCategory(
                        result.getString("category"));

                ticket.setPriority(
                        result.getString("priority"));

                ticket.setStatus(
                        result.getString("status"));

                ticket.setCreatedAt(
                        result.getTimestamp("created_at"));

                ticket.setDueAt(
                        result.getTimestamp("due_at"));

                return ticket;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return null;
    }
}