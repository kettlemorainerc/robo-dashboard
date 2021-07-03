package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class DoubleMessage extends NetworkTableMessage<Double> {
    private static final String type = "double";

    public static DoubleMessage get(String key) {
        return new DoubleMessage(Type.GET, key, 0d);
    }

    public static DoubleMessage set(String key, double value) {
        return new DoubleMessage(Type.SET, key, value);
    }

    public DoubleMessage(Type messageType, String key, double value) {
        super(messageType, key, value, NetworkUtilities::getDouble, NetworkUtilities::setDouble);
    }

    @Override
    public String getType() {
        return type;
    }

    public NetworkTableMessage<Double> withValue(Double value) {
        return new DoubleMessage(messageType, key, value);
    }

    public static boolean matchesDouble(String id) {return Objects.equals(type, id);}
}
