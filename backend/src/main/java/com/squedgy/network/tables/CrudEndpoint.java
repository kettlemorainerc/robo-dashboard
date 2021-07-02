package com.squedgy.network.tables;

import com.fasterxml.jackson.core.*;
import com.squedgy.network.tables.message.*;
import org.slf4j.*;

import javax.enterprise.context.*;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;

import static org.slf4j.LoggerFactory.*;

@ApplicationScoped
@Path("/{key}")
public class CrudEndpoint {
    private static final Logger LOG = getLogger(CrudEndpoint.class);

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getValue(@PathParam("key") String key) throws JsonProcessingException {
        LOG.info("GET: {}", key);
        Message message = ValueSocket.messageFor(key, NetworkUtilities.get(key));
        return Response.ok(new ByteArrayInputStream(ValueSocket.mapper.writeValueAsBytes(message)), "application/json").build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response setValue(@PathParam("key") String key, InputStream content) throws IOException {
        LOG.info("PUT: {}", key);
        Message message = ValueSocket.mapper.readValue(content, Message.class);
        LOG.info("Received input\n\t{}", message);
        message.onSet(null);

        return Response.ok("{\"set\": true}", "application/json").build();
    }
}
