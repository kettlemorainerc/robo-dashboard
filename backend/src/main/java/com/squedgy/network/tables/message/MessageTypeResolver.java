package com.squedgy.network.tables.message;

import com.fasterxml.jackson.annotation.JsonTypeInfo.*;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.jsontype.*;
import com.fasterxml.jackson.databind.type.*;

import java.io.*;
import java.util.*;
import java.util.function.*;
import java.util.regex.*;

public class MessageTypeResolver implements TypeIdResolver {
    private JavaType baseType;

    @Override
    public void init(JavaType baseType) {
        this.baseType = baseType;
    }

    @Override
    public String idFromValue(Object value) {
        return value instanceof Message ? ((Message) value).getType() : null;
    }

    @Override
    public String idFromValueAndType(Object value, Class<?> suggestedType) {
        if(value != null) return idFromValue(value);
        String name = suggestedType.getName();

        Pattern pat = Pattern.compile("^(String|Boolean|Double)((Array)?)");
        Matcher matcher = pat.matcher(name);
        String type = matcher.group(1);
        String arr = matcher.group(2);
        if(arr.isBlank()) return type.toLowerCase(Locale.ROOT);
        return type.toLowerCase(Locale.ROOT) + "[]";
    }

    @Override
    public String idFromBaseType() {
        return idFromValueAndType(null, baseType.getRawClass());
    }

    @Override
    public JavaType typeFromId(DatabindContext context, String id) throws IOException {
        Class<?> target = classFromType(id);

        if(target == null) throw new IllegalArgumentException("No known message type: " + id);

        return TypeFactory.defaultInstance().constructSpecializedType(baseType, target);
    }

    @Override
    public String getDescForKnownTypeIds() {
        return "Known types: string, string[], boolean, boolean[], double, double[]";
    }

    @Override
    public Id getMechanism() {
        return Id.CUSTOM;
    }
    
    public static Class<? extends Message> classFromType(String type) {
        return KNOWN_MESSAGES.stream()
                             .filter(match -> match.check.test(type))
                             .findFirst()
                             .map(m -> m.result)
                             .orElseThrow();
    }
    
    private static final List<Match<Class<? extends Message>>> KNOWN_MESSAGES = List.of(
        new Match<>(StringMessage.class, StringMessage::matchesString),
        new Match<>(StringArrayMessage.class, StringArrayMessage::matchesStringArray),
        new Match<>(DoubleMessage.class, DoubleMessage::matchesDouble),
        new Match<>(DoubleArrayMessage.class, DoubleArrayMessage::matchesDoubleArray),
        new Match<>(BooleanMessage.class, BooleanMessage::matchesBoolean),
        new Match<>(BooleanArrayMessage.class, BooleanArrayMessage::matchesBooleanArray)
    );
    
    private static class Match<T> {
        private final Predicate<String> check;
        private final T result;
        
        private Match(T value, Predicate<String> onlyIf) {
            this.check = onlyIf;
            this.result = value;
        }
    }
}
