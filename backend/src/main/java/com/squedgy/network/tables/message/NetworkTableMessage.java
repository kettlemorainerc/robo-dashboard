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

    protected abstract NetworkTableMessage<Value> withValue(Value value);

    @Override
    public void onGet(Session session) throws IOException {
        NetworkTableMessage<Value> giveBack = withValue(get.apply(key));
        LOG.info("Returning: {}", giveBack.value);
        session.getAsyncRemote().sendObject(mapper.writeValueAsString(giveBack));
    }

    @Override
    public void onSet(Session session) throws IOException {
        set.accept(key, value);
//        ValueSocket.alertListeners(getKey(), NetworkUtilities.get(key));
    }

    @Override
    public void onDelete(Session session) throws IOException { NetworkUtilities.delete(key);}

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
