package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class BooleanMessage extends NetworkTableMessage<Boolean> {
    private static final String type = "boolean";

    public BooleanMessage(Type messageType, String key, boolean value) {
        super(messageType, key, value, NetworkUtilities::getBoolean, NetworkUtilities::setBoolean);
    }

    @Override
    public String getType() {
        return type;
    }

    protected NetworkTableMessage<Boolean> withValue(Boolean value) {
        return new BooleanMessage(messageType, key, value);
    }

    public static boolean matchesBoolean(String key) {return Objects.equals(key, type);}
}
