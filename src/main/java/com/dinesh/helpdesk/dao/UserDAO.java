package com.dinesh.helpdesk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.dinesh.helpdesk.config.DBConnection;
import com.dinesh.helpdesk.model.User;

public class UserDAO
{
    public boolean emailExists(String email)
    {
        String query =
                "SELECT user_id FROM users WHERE email = ?";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setString(1, email);

            ResultSet result = statement.executeQuery();

            if(result.next())
            {
                return true;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    public boolean registerUser(User user)
    {
        String query =
                "INSERT INTO users " +
                "(full_name, email, password_hash, role) " +
                "VALUES (?, ?, ?, ?)";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setString(1, user.getFullName());
            statement.setString(2, user.getEmail());
            statement.setString(3, user.getPasswordHash());
            statement.setString(4, user.getRole());

            int rows = statement.executeUpdate();

            return rows > 0;
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    /**
     * findByEmail fetches a user by email including the password hash.
     * The servlet then uses PasswordUtil.checkPassword() to verify
     * the BCrypt hash rather than comparing hashes in SQL.
     */
    public User findByEmail(String email)
    {
        String query =
                "SELECT user_id, full_name, email, " +
                "password_hash, role " +
                "FROM users " +
                "WHERE email = ?";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            statement.setString(1, email);

            ResultSet result = statement.executeQuery();

            if(result.next())
            {
                User user = new User();

                user.setUserId(result.getInt("user_id"));
                user.setFullName(result.getString("full_name"));
                user.setEmail(result.getString("email"));
                user.setPasswordHash(result.getString("password_hash"));
                user.setRole(result.getString("role"));

                return user;
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return null;
    }

    public List<User> getAllAgents()
    {
        List<User> agents = new ArrayList<User>();

        String query =
                "SELECT user_id, full_name, email, role " +
                "FROM users " +
                "WHERE role = 'AGENT' " +
                "ORDER BY full_name";

        try(Connection connection = DBConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(query))
        {
            ResultSet result = statement.executeQuery();

            while(result.next())
            {
                User agent = new User();

                agent.setUserId(result.getInt("user_id"));
                agent.setFullName(
                        result.getString("full_name"));
                agent.setEmail(result.getString("email"));
                agent.setRole(result.getString("role"));

                agents.add(agent);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }

        return agents;
    }
}
