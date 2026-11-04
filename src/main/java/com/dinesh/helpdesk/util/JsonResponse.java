package com.dinesh.helpdesk.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * JsonResponse centralises all JSON writing for the REST API.
 *
 * Every endpoint uses one of two methods:
 *   send()      – for successful responses  (2xx)
 *   sendError() – for failure responses     (4xx / 5xx)
 *
 * readBody() reads and parses a JSON request body.
 * getString() safely extracts a String value from the parsed body.
 */
public class JsonResponse
{
    private static final ObjectMapper mapper = new ObjectMapper();

    // ----------------------------------------------------------------
    // Write a successful JSON response
    // ----------------------------------------------------------------

    public static void send(HttpServletResponse response,
                            int status,
                            Object data)
            throws IOException
    {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("success", true);
        body.put("data", data);

        response.getWriter()
                .write(mapper.writeValueAsString(body));
    }

    // ----------------------------------------------------------------
    // Write an error JSON response
    // ----------------------------------------------------------------

    public static void sendError(HttpServletResponse response,
                                 int status,
                                 String message)
            throws IOException
    {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("success", false);
        body.put("error", message);

        response.getWriter()
                .write(mapper.writeValueAsString(body));
    }

    // ----------------------------------------------------------------
    // Parse a JSON request body into a Map
    // ----------------------------------------------------------------

    @SuppressWarnings("unchecked")
    public static Map<String, Object> readBody(HttpServletRequest request)
            throws IOException
    {
        StringBuilder builder = new StringBuilder();

        BufferedReader reader = request.getReader();

        String line;

        while((line = reader.readLine()) != null)
        {
            builder.append(line);
        }

        String bodyText = builder.toString().trim();

        if(bodyText.isEmpty())
        {
            return new LinkedHashMap<>();
        }

        return mapper.readValue(
                bodyText,
                new TypeReference<Map<String, Object>>(){});
    }

    // ----------------------------------------------------------------
    // Safely get a trimmed String value from the parsed body
    // ----------------------------------------------------------------

    public static String getString(Map<String, Object> body,
                                   String key)
    {
        Object value = body.get(key);

        if(value == null)
        {
            return null;
        }

        String text = value.toString().trim();

        if(text.isEmpty())
        {
            return null;
        }

        return text;
    }
}

