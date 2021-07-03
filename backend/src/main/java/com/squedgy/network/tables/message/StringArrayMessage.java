package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class StringArrayMessage extends NetworkTableMessage<String[]> {
    private static final String type = "string[]";

    public static StringArrayMessage get(String key) {
        return new StringArrayMessage(Type.GET, key, null);
    }

    public static StringArrayMessage set(String key, String... value) {
        return new StringArrayMessage(Type.SET, key, value);
    }

    public StringArrayMessage(Type messageType, String key, String[] value) {
        super(messageType, key, value, NetworkUtilities::getStringArray, NetworkUtilities::setStringArray);
    }

    @Override
    public String getType() {
        return type;
    }

    public NetworkTableMessage<String[]> withValue(String[] value) {
        return new StringArrayMessage(messageType, key, value);
    }

    public static boolean matchesStringArray(String id) {return Objects.equals(id, type);}
}
