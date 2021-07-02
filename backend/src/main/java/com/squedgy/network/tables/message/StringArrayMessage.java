package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class StringArrayMessage extends NetworkTableMessage<String[]> {
    private static final String type = "string[]";

    public StringArrayMessage(Type messageType, String key, String[] value) {
        super(messageType, key, value, NetworkUtilities::getStringArray, NetworkUtilities::setStringArray);
    }

    @Override
    public String getType() {
        return type;
    }

    protected NetworkTableMessage<String[]> withValue(String[] value) {
        return new StringArrayMessage(messageType, key, value);
    }

    public static boolean matchesStringArray(String id) {return Objects.equals(id, type);}
}
