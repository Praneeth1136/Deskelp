package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.dinesh.helpdesk.config.DBConnection;
import com.dinesh.helpdesk.model.TicketComment;

public class CommentDAO
{
    public boolean addComment(TicketComment comment)
    {
        String query =
                "INSERT INTO ticket_comments " +
                "(ticket_id, user_id, message) " +
                "VALUES (?, ?, ?)";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, comment.getTicketId());
            statement.setInt(2, comment.getUserId());
            statement.setString(3, comment.getMessage());

            int rows = statement.executeUpdate();

            return rows > 0;
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    public List<TicketComment> getCommentsByTicket(
            int ticketId)
    {
        List<TicketComment> comments =
                new ArrayList<TicketComment>();

        String query =
                "SELECT c.comment_id, c.ticket_id, " +
                "c.user_id, c.message, c.created_at, " +
                "u.full_name, u.role " +
                "FROM ticket_comments c " +
                "JOIN users u ON c.user_id = u.user_id " +
                "WHERE c.ticket_id = ? " +
                "ORDER BY c.created_at";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setInt(1, ticketId);

            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                TicketComment comment =
                        new TicketComment();

                comment.setCommentId(
                        result.getInt("comment_id"));

                comment.setTicketId(
                        result.getInt("ticket_id"));

                comment.setUserId(
                        result.getInt("user_id"));

                comment.setMessage(
                        result.getString("message"));

                comment.setCreatedAt(
                        result.getTimestamp("created_at"));

                comment.setUserName(
                        result.getString("full_name"));

                comment.setUserRole(
                        result.getString("role"));

                comments.add(comment);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return comments;
    }
}