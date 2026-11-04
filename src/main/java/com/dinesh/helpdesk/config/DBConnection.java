package com.dinesh.helpdesk.config;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class DBConnection
{
    public static Connection getConnection() throws Exception
    {
        Properties properties = new Properties();

        InputStream file = DBConnection.class
                .getClassLoader()
                .getResourceAsStream("db.properties");

        if(file == null)
        {
            throw new Exception("db.properties file was not found");
        }

        properties.load(file);
        file.close();

        String url = properties.getProperty("db.url");
        String username = properties.getProperty("db.username");
        String password = properties.getProperty("db.password");

        Class.forName("com.mysql.cj.jdbc.Driver");

        Connection connection =
                DriverManager.getConnection(url, username, password);

        return connection;
    }
}