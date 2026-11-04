package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.dinesh.helpdesk.config.DBConnection;
import com.dinesh.helpdesk.model.Ticket;

public class TicketDAO
{
    public boolean createTicket(Ticket ticket)
    {
        String query =
                "INSERT INTO tickets " +
                "(created_by, title, description, category, " +
                "priority, status, due_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, ticket.getCreatedBy());
            statement.setString(2, ticket.getTitle());
            statement.setString(3, ticket.getDescription());
            statement.setString(4, ticket.getCategory());
            statement.setString(5, ticket.getPriority());
            statement.setString(6, ticket.getStatus());
            statement.setTimestamp(7, ticket.getDueAt());

            int rows = statement.executeUpdate();

            return rows > 0;
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    public List<Ticket> getTicketsByUser(int userId)
    {
        List<Ticket> tickets = new ArrayList<Ticket>();

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
                "WHERE t.created_by = ? " +
                "ORDER BY t.created_at DESC";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, userId);

            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                Ticket ticket = createTicketObject(result);
                tickets.add(ticket);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return tickets;
    }

    public List<Ticket> getAllTickets()
    {
        List<Ticket> tickets = new ArrayList<Ticket>();

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
                "ORDER BY t.created_at DESC";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                Ticket ticket = createTicketObject(result);
                tickets.add(ticket);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return tickets;
    }

    public boolean assignTicket(int ticketId,
                                int agentId,
                                int adminId)
    {
        String checkAgentQuery =
                "SELECT user_id FROM users " +
                "WHERE user_id = ? AND role = 'AGENT'";

        String findTicketQuery =
                "SELECT status FROM tickets " +
                "WHERE ticket_id = ? FOR UPDATE";

        String updateTicketQuery =
                "UPDATE tickets " +
                "SET assigned_to = ?, status = 'ASSIGNED' " +
                "WHERE ticket_id = ?";

        String historyQuery =
                "INSERT INTO ticket_history " +
                "(ticket_id, changed_by, old_status, new_status) " +
                "VALUES (?, ?, ?, ?)";

        try(Connection connection = DBConnection.getConnection())
        {
            connection.setAutoCommit(false);

            try
            {
                try(PreparedStatement checkAgent =
                        connection.prepareStatement(
                                checkAgentQuery))
                {
                    checkAgent.setInt(1, agentId);

                    ResultSet agentResult =
                            checkAgent.executeQuery();

                    if(!agentResult.next())
                    {
                        connection.rollback();
                        return false;
                    }
                }

                String oldStatus;

                try(PreparedStatement findTicket =
                        connection.prepareStatement(
                                findTicketQuery))
                {
                    findTicket.setInt(1, ticketId);

                    ResultSet ticketResult =
                            findTicket.executeQuery();

                    if(!ticketResult.next())
                    {
                        connection.rollback();
                        return false;
                    }

                    oldStatus =
                            ticketResult.getString("status");

                    if(!"OPEN".equalsIgnoreCase(oldStatus))
                    {
                        connection.rollback();
                        return false;
                    }
                }

                int rows;

                try(PreparedStatement updateTicket =
                        connection.prepareStatement(
                                updateTicketQuery))
                {
                    updateTicket.setInt(1, agentId);
                    updateTicket.setInt(2, ticketId);

                    rows = updateTicket.executeUpdate();
                }

                if(rows == 0)
                {
                    connection.rollback();
                    return false;
                }

                try(PreparedStatement historyStatement =
                        connection.prepareStatement(
                                historyQuery))
                {
                    historyStatement.setInt(1, ticketId);
                    historyStatement.setInt(2, adminId);
                    historyStatement.setString(3, oldStatus);
                    historyStatement.setString(
                            4, "ASSIGNED");

                    historyStatement.executeUpdate();
                }

                connection.commit();
                return true;
            }
            catch(Exception e)
            {
                connection.rollback();
                throw e;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }
    public List<Ticket> getTicketsByAgent(int agentId)
    {
        List<Ticket> tickets = new ArrayList<Ticket>();

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
                "WHERE t.assigned_to = ? " +
                "ORDER BY CASE t.priority " +
                "WHEN 'CRITICAL' THEN 1 " +
                "WHEN 'HIGH' THEN 2 " +
                "WHEN 'MEDIUM' THEN 3 " +
                "WHEN 'LOW' THEN 4 " +
                "ELSE 5 END, t.created_at";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, agentId);

            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                Ticket ticket = createTicketObject(result);
                tickets.add(ticket);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return tickets;
    }

    public boolean updateTicketStatus(int ticketId,
                                      int agentId,
                                      String newStatus)
    {
        String findTicketQuery =
                "SELECT status FROM tickets " +
                "WHERE ticket_id = ? AND assigned_to = ? " +
                "FOR UPDATE";

        String updateTicketQuery =
                "UPDATE tickets " +
                "SET status = ?, " +
                "resolved_at = CASE " +
                "WHEN ? = 'RESOLVED' THEN CURRENT_TIMESTAMP " +
                "ELSE NULL END " +
                "WHERE ticket_id = ? AND assigned_to = ?";

        String historyQuery =
                "INSERT INTO ticket_history " +
                "(ticket_id, changed_by, old_status, new_status) " +
                "VALUES (?, ?, ?, ?)";

        try(Connection connection = DBConnection.getConnection())
        {
            connection.setAutoCommit(false);

            try
            {
                String oldStatus;

                try(PreparedStatement findTicket =
                        connection.prepareStatement(
                                findTicketQuery))
                {
                    findTicket.setInt(1, ticketId);
                    findTicket.setInt(2, agentId);

                    ResultSet result =
                            findTicket.executeQuery();

                    if(!result.next())
                    {
                        connection.rollback();
                        return false;
                    }

                    oldStatus = result.getString("status");
                }

                boolean validChange =
                        ("ASSIGNED".equalsIgnoreCase(oldStatus) &&
                         "IN_PROGRESS".equalsIgnoreCase(newStatus))
                        ||
                        ("IN_PROGRESS".equalsIgnoreCase(oldStatus) &&
                         "RESOLVED".equalsIgnoreCase(newStatus));

                if(!validChange)
                {
                    connection.rollback();
                    return false;
                }

                int rows;

                try(PreparedStatement updateTicket =
                        connection.prepareStatement(
                                updateTicketQuery))
                {
                    updateTicket.setString(1, newStatus);
                    updateTicket.setString(2, newStatus);
                    updateTicket.setInt(3, ticketId);
                    updateTicket.setInt(4, agentId);

                    rows = updateTicket.executeUpdate();
                }

                if(rows == 0)
                {
                    connection.rollback();
                    return false;
                }

                try(PreparedStatement historyStatement =
                        connection.prepareStatement(historyQuery))
                {
                    historyStatement.setInt(1, ticketId);
                    historyStatement.setInt(2, agentId);
                    historyStatement.setString(3, oldStatus);
                    historyStatement.setString(4, newStatus);

                    historyStatement.executeUpdate();
                }

                connection.commit();
                return true;
            }
            catch(Exception e)
            {
                connection.rollback();
                throw e;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    private Ticket createTicketObject(ResultSet result)
            throws SQLException
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