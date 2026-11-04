package com.dinesh.helpdesk.util;

public class HtmlUtil
{
    public static String escape(String value)
    {
        if(value == null)
        {
            return "";
        }

        String safeValue = value;

        safeValue = safeValue.replace("&", "&amp;");
        safeValue = safeValue.replace("<", "&lt;");
        safeValue = safeValue.replace(">", "&gt;");
        safeValue = safeValue.replace("\"", "&quot;");
        safeValue = safeValue.replace("'", "&#39;");

        return safeValue;
    }
}