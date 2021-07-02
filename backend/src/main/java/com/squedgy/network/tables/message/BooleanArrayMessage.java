package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class BooleanArrayMessage extends NetworkTableMessage<boolean[]> {
    private static final String type = "boolean[]";

    public BooleanArrayMessage(Type messageType, String key, boolean[] value) {
        super(messageType, key, value, NetworkUtilities::getBooleanArray, NetworkUtilities::setBooleanArray);
    }

    protected NetworkTableMessage<boolean[]> withValue(boolean[] value) {
        return new BooleanArrayMessage(messageType, key, value);
    }

    @Override
    public String getType() {
        return type;
    }

    public static boolean matchesBooleanArray(String type) {return Objects.equals(type, BooleanArrayMessage.type);}
}
