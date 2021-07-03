package com.squedgy.network.tables;

import com.fasterxml.jackson.core.*;
import com.squedgy.network.tables.message.*;
import com.squedgy.network.tables.message.Message.*;
import io.quarkus.test.common.http.*;
import io.quarkus.test.junit.*;
import org.junit.jupiter.api.*;

import javax.websocket.*;
import java.net.*;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class ValueSocketTest {
    private static final LinkedBlockingDeque<Message> MESSAGES = new LinkedBlockingDeque<>();
    private static final String DOUBLE = "/SmartDashboard/double", B = "/SmartDashboard/b";

    @TestHTTPResource("/")
    URI uri;

    @BeforeAll
    public static void beforeAll() {
        NetworkUtilities.setNetworkTableParams(false, 2005);
    }

    @Test
    public void testUpdates() throws Exception {
        NetworkUtilities.setDouble(B, 12);
        try(Session session = ContainerProvider.getWebSocketContainer().connectToServer(Client.class, uri)) {
            NetworkUtilities.setDouble(DOUBLE, 45);
            assertEquals(
                DoubleMessage.set(DOUBLE, 45d),
                MESSAGES.poll(100, TimeUnit.MILLISECONDS)
            );

            DoubleMessage request = DoubleMessage.get(B);
            session.getAsyncRemote().sendObject(ValueSocket.mapper.writeValueAsString(request));
            assertEquals(
                request.withValue(12d),
                MESSAGES.poll(100, TimeUnit.MILLISECONDS)
            );
        }
    }

    @ClientEndpoint
    public static class Client {

        @OnOpen
        public void open(Session session) {
//            // Send a message to indicate that we are ready,
//            // as the message handler may not be registered immediately after this callback.
//            session.getAsyncRemote().sendText("_ready_");
        }

        @OnMessage
        void message(String msg) throws JsonProcessingException {
            MESSAGES.add(ValueSocket.mapper.readValue(msg, Message.class));
        }

    }
}
