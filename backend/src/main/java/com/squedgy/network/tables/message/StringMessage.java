package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class StringMessage extends NetworkTableMessage<String> {
    private static final String type = "string";

    public static StringMessage get(String key) {
        return new StringMessage(Type.GET, key, null);
    }

    public static StringMessage set(String key, String value) {
        return new StringMessage(Type.SET, key, value);
    }

    public StringMessage(Type messageType, String key, String value) {
        super(messageType, key, value, NetworkUtilities::getString, NetworkUtilities::setString);
    }

    @Override
    public String getType() {
        return type;
    }

    public NetworkTableMessage<String> withValue(String value) {
        return new StringMessage(messageType, key, value);
    }

    public static boolean matchesString(String id) {return Objects.equals(id, type);}
}
