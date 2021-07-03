package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;
import org.slf4j.*;

import javax.websocket.*;
import java.io.*;
import java.util.*;
import java.util.function.*;

import static com.squedgy.network.tables.ValueSocket.*;
import static org.slf4j.LoggerFactory.*;

public abstract class NetworkTableMessage<Value> extends Message {
    private static final Logger LOG = getLogger(NetworkTableMessage.class);
    protected final Value value;
    protected final Function<String, Value> get;
    protected final BiConsumer<String, Value> set;
    public NetworkTableMessage(
        Type messageType,
        String key,
        Value value,
        Function<String, Value> get,
        BiConsumer<String, Value> set
    ) {
        super(messageType, key);
        this.value = value;
        this.get = get;
        this.set = set;
    }

    public Value getValue() {return value;}

    @Override
    public void onTogglePersist(Session session) {
        NetworkUtilities.togglePersist(key);
    }

    public abstract NetworkTableMessage<Value> withValue(Value value);

    @Override
    public void onGet(Session session) throws IOException {
        NetworkTableMessage<Value> giveBack = withValue(get.apply(key));
        LOG.info("Returning: {}", giveBack.value);
        session.getAsyncRemote().sendObject(mapper.writeValueAsString(giveBack));
    }

    @Override
    public void onSet(Session session) throws IOException {
        set.accept(key, value);
    }

    @Override
    public void onDelete(Session session) throws IOException { NetworkUtilities.delete(key);}

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof NetworkTableMessage)) return false;
        NetworkTableMessage<?> that = (NetworkTableMessage<?>) o;
        boolean valueEqual;
        Object thisVal = getValue(), thatVal = that.getValue();

        if(thisVal == null || thatVal == null || thisVal.getClass() != thatVal.getClass()) valueEqual = thisVal == thatVal;
        else if(thisVal instanceof short[]) valueEqual = Arrays.equals((short[]) thisVal, (short[]) thatVal);
        else if(thisVal instanceof byte[]) valueEqual = Arrays.equals((byte[]) thisVal, (byte[]) thatVal);
        else if(thisVal instanceof int[]) valueEqual = Arrays.equals((int[]) thisVal, (int[]) thatVal);
        else if(thisVal instanceof long[]) valueEqual = Arrays.equals((long[]) thisVal, (long[]) thatVal);
        else if(thisVal instanceof float[]) valueEqual = Arrays.equals((float[]) thisVal, (float[]) thatVal);
        else if(thisVal instanceof double[]) valueEqual = Arrays.equals((double[]) thisVal, (double[]) thatVal);
        else if(thisVal instanceof boolean[]) valueEqual = Arrays.equals((boolean[]) thisVal, (boolean[]) thatVal);
        else if(thisVal instanceof char[]) valueEqual = Arrays.equals((char[]) thisVal, (char[]) thatVal);
        else if(thisVal instanceof Object[]) valueEqual = Arrays.deepEquals((Object[]) thisVal, (Object[]) thatVal);
        else valueEqual = Objects.equals(thisVal, thatVal);
        return valueEqual &&
               Objects.equals(get, that.get) &&
               Objects.equals(set, that.set) &&
               Objects.equals(getType(), that.getType()) &&
               Objects.equals(getMessageType(), that.getMessageType()) &&
               Objects.equals(getKey(), that.getKey());
    }

    @Override
    public int hashCode() {
        Object value = getValue();
        int hash;
        if(value != null && value.getClass().isArray()) { // Note: fun...
            if(value instanceof short[]) hash = Arrays.hashCode((short[]) value);
            else if(value instanceof byte[]) hash = Arrays.hashCode((byte[]) value);
            else if(value instanceof int[]) hash = Arrays.hashCode((int[]) value);
            else if(value instanceof long[]) hash = Arrays.hashCode((long[]) value);
            else if(value instanceof float[]) hash = Arrays.hashCode((float[]) value);
            else if(value instanceof double[]) hash = Arrays.hashCode((double[]) value);
            else if(value instanceof boolean[]) hash = Arrays.hashCode((boolean[]) value);
            else if(value instanceof char[]) hash = Arrays.hashCode((char[]) value);
            else hash = Arrays.hashCode((Object[]) value);
        } else hash = Objects.hashCode(value);
        return Objects.hash(hash, get, set, getType(), getMessageType(), getKey());
    }

    @Override
    public String toString() {
        String pattern = "";
        if(messageType == Type.GET) pattern = "get \"%1$s\" as type %3$s";
        else if (messageType == Type.SET) pattern = "set \"%1$s\" to %2$s";
        else if (messageType == Type.DELETE) pattern = "delete \"%1$s\"";
        else if (messageType == Type.TOGGLE_PERSIST) pattern = "toggle persistence of \"%1$s\"";

        String val;
        if(value instanceof String[]) {
            val = Arrays.toString((String[]) value);
        } else if(value instanceof double[]) {
            val = Arrays.toString((double[]) value);
        } else if(value instanceof boolean[]) {
            val = Arrays.toString((boolean[]) value);
        } else {
            val = "" + value;
        }
        return String.format(
            pattern,
            key,
            val,
            getType()
        );
    }
}
