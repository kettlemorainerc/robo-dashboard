package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class DoubleMessage extends NetworkTableMessage<Double> {
    private static final String type = "double";

    public DoubleMessage(Type messageType, String key, double value) {
        super(messageType, key, value, NetworkUtilities::getDouble, NetworkUtilities::setDouble);
    }

    @Override
    public String getType() {
        return type;
    }

    protected NetworkTableMessage<Double> withValue(Double value) {
        return new DoubleMessage(messageType, key, value);
    }

    public static boolean matchesDouble(String id) {return Objects.equals(type, id);}
}
