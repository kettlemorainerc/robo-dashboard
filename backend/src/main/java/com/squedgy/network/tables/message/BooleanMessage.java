package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class BooleanMessage extends NetworkTableMessage<Boolean> {
    private static final String type = "boolean";

    public static BooleanMessage get(String key) {
        return new BooleanMessage(Type.GET, key, false);
    }

    public static BooleanMessage set(String key, boolean value) {
        return new BooleanMessage(Type.SET, key, value);
    }

    public BooleanMessage(Type messageType, String key, boolean value) {
        super(messageType, key, value, NetworkUtilities::getBoolean, NetworkUtilities::setBoolean);
    }

    @Override
    public String getType() {
        return type;
    }

    public NetworkTableMessage<Boolean> withValue(Boolean value) {
        return new BooleanMessage(messageType, key, value);
    }

    public static boolean matchesBoolean(String key) {return Objects.equals(key, type);}
}
