package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.dinesh.helpdesk.config.DBConnection;

public class TicketClosureDAO {

    public boolean closeTicket(int ticketId, int userId) {

        String checkSql =
                "SELECT status FROM tickets " +
                "WHERE ticket_id = ? AND created_by = ? FOR UPDATE";

        String updateSql =
                "UPDATE tickets SET status = 'CLOSED', " +
                "updated_at = CURRENT_TIMESTAMP " +
                "WHERE ticket_id = ? AND created_by = ? " +
                "AND status = 'RESOLVED'";

        String historySql =
                "INSERT INTO ticket_history " +
                "(ticket_id, changed_by, old_status, new_status) " +
                "VALUES (?, ?, 'RESOLVED', 'CLOSED')";

        try (Connection connection = DBConnection.getConnection()) {

            connection.setAutoCommit(false);

            try {
                String currentStatus = null;

                try (PreparedStatement checkStatement =
                             connection.prepareStatement(checkSql)) {

                    checkStatement.setInt(1, ticketId);
                    checkStatement.setInt(2, userId);

                    try (ResultSet resultSet =
                                 checkStatement.executeQuery()) {

                        if (resultSet.next()) {
                            currentStatus =
                                    resultSet.getString("status");
                        }
                    }
                }

                if (currentStatus == null ||
                        !currentStatus.equals("RESOLVED")) {

                    connection.rollback();
                    return false;
                }

                int updatedRows;

                try (PreparedStatement updateStatement =
                             connection.prepareStatement(updateSql)) {

                    updateStatement.setInt(1, ticketId);
                    updateStatement.setInt(2, userId);

                    updatedRows =
                            updateStatement.executeUpdate();
                }

                if (updatedRows == 0) {
                    connection.rollback();
                    return false;
                }

                try (PreparedStatement historyStatement =
                             connection.prepareStatement(historySql)) {

                    historyStatement.setInt(1, ticketId);
                    historyStatement.setInt(2, userId);
                    historyStatement.executeUpdate();
                }

                connection.commit();
                return true;

            } catch (Exception e) {
                connection.rollback();
                e.printStackTrace();
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}