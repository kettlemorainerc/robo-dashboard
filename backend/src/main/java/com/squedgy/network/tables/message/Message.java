package com.squedgy.network.tables.message;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonTypeInfo.*;
import com.fasterxml.jackson.databind.annotation.*;

import javax.websocket.*;
import java.io.*;

@JsonTypeInfo(
    use = Id.CUSTOM,
    property = "type",
    visible = true
)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeIdResolver(MessageTypeResolver.class)
public abstract class Message {
    public enum Type {GET, SET, DELETE, TOGGLE_PERSIST}
    protected final Type messageType;
    protected final String key;

    public Message(Type messageType, String key) {
        this.messageType = messageType;
        this.key = key;
    }

    public abstract String getType();

    public Type getMessageType() {return messageType;}

    public String getKey() {return key;}

    public void onGet(Session session) throws IOException {}
    public void onSet(Session session) throws IOException {}
    public void onDelete(Session session) throws IOException {}
    public void onTogglePersist(Session session) {}
}
