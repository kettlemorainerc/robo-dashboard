package com.squedgy.network.tables.message;

import com.squedgy.network.tables.*;

import javax.websocket.*;
import java.io.*;
import java.util.function.*;

import static com.squedgy.network.tables.ValueSocket.*;

public abstract class NetworkTableMessage<Value> extends Message {
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
        session.getAsyncRemote().sendObject(mapper.writeValueAsString(withValue(get.apply(key))));
    }

    @Override
    public void onSet(Session session) throws IOException {
        set.accept(key, value);
        ValueSocket.alertListeners(getKey(), NetworkUtilities.get(key));
    }

    @Override
    public void onDelete(Session session) throws IOException { NetworkUtilities.delete(key);}
}
