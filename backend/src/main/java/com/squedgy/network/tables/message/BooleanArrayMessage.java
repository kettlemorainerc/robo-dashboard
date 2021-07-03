package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class BooleanArrayMessage extends NetworkTableMessage<boolean[]> {
    private static final String type = "boolean[]";

    public static BooleanArrayMessage get(String key) {
        return new BooleanArrayMessage(Type.GET, key, null);
    }

    public static BooleanArrayMessage set(String key, boolean... value) {
        return new BooleanArrayMessage(Type.SET, key, value);
    }

    public BooleanArrayMessage(Type messageType, String key, boolean[] value) {
        super(messageType, key, value, NetworkUtilities::getBooleanArray, NetworkUtilities::setBooleanArray);
    }

    public NetworkTableMessage<boolean[]> withValue(boolean[] value) {
        return new BooleanArrayMessage(messageType, key, value);
    }

    @Override
    public String getType() {
        return type;
    }

    public static boolean matchesBooleanArray(String type) {return Objects.equals(type, BooleanArrayMessage.type);}

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }
}
