package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import java.util.*;

public class DoubleArrayMessage extends NetworkTableMessage<double[]> {
    private static final String type = "double[]";

    public DoubleArrayMessage(Type messageType, String key, double[] value) {
        super(messageType, key, value, NetworkUtilities::getDoubleArray, NetworkUtilities::setDoubleArray);
    }

    @Override
    public String getType() {
        return type;
    }

    protected NetworkTableMessage<double[]> withValue(double[] value) {
        return new DoubleArrayMessage(messageType, key, value);
    }

    public static boolean matchesDoubleArray(String id) {return Objects.equals(id, type);}
}
