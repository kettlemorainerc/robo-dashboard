package com.squedgy.network.tables;

import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.*;
import com.squedgy.network.tables.message.*;
import com.squedgy.network.tables.message.Message.*;
import edu.wpi.first.networktables.*;
import org.slf4j.*;

import javax.enterprise.context.*;
import javax.websocket.*;
import javax.websocket.server.*;
import java.io.*;
import java.util.*;

import static com.squedgy.network.tables.NetworkUtilities.*;
import static org.slf4j.LoggerFactory.*;

@ApplicationScoped
@ServerEndpoint("/")
public class ValueSocket {
    private static final Logger LOG = getLogger(ValueSocket.class);
    public static final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
    private static final Set<Session> sessions = new HashSet<>();

    public static Message messageFor(String key, NetworkTableValue value) {
        if(value.isBoolean()) return new BooleanMessage(Type.SET, key, getBoolean(key));
        else if(value.isBooleanArray()) return new BooleanArrayMessage(Type.SET, key, getBooleanArray(key));
        else if(value.isString()) return new StringMessage(Type.SET, key, getString(key));
        else if(value.isStringArray()) return new StringArrayMessage(Type.SET, key, getStringArray(key));
        else if(value.isDouble()) return new DoubleMessage(Type.SET, key, getDouble(key));
        else if(value.isDoubleArray()) return new DoubleArrayMessage(Type.SET, key, getDoubleArray(key));

        return null;
    }
    
    private static void onEntryUpdate(NetworkTable table, String key, NetworkTableEntry entry, NetworkTableValue value, int flags) {
        LOG.info("Received Entry update: {} {} {} {}", table.getPath(), key, entry, value);

        try {
            alertListeners(key, value);
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public static void alertListeners(String key, NetworkTableValue value) throws JsonProcessingException {
        Message toSend = messageFor(key, value);
        if(toSend == null) return;
        String sending = mapper.writeValueAsString(toSend);
        LOG.info("Sending message to connected sessions: {}", sending);
        for(Session sess : sessions) sess.getAsyncRemote().sendObject(sending);
    }

    @OnOpen
    public void open(Session session) {
        LOG.info("New session: {}", session);
        sessions.add(session);
    }

    @OnClose
    public void close(Session session) {
        LOG.info("Session closed: {}", session);
        sessions.remove(session);
    }

    @OnError
    public void error(Session session, Throwable thrown) {
        close(session);
        LOG.warn("A session closed unexpectedly", thrown);
    }

    @OnMessage
    public void message(String message, Session session) throws IOException {
        LOG.info("New Message from [{}]: {}", session, message);
        Message actual = mapper.readValue(message, Message.class);
        Type messageType = actual.getMessageType();

        if(messageType == Type.GET) actual.onGet(session);
        else if(messageType == Type.SET) actual.onSet(session);
        else if(messageType == Type.DELETE) actual.onDelete(session);
        else if(messageType == Type.TOGGLE_PERSIST) actual.onTogglePersist(session);
        else throw new IllegalArgumentException("Unimplemented message type: " + messageType);
    }
}
