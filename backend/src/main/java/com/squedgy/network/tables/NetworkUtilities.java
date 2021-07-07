package com.squedgy.network.tables;

import edu.wpi.first.networktables.*;

import java.util.*;
import java.util.function.*;

import static edu.wpi.first.networktables.EntryListenerFlags.*;
import static edu.wpi.first.networktables.NetworkTableInstance.*;

/**
 * A utility wrapper around Network Tables to utilize various instances
 *
 * TODO: Toggle starting the server if we can find a robot available network table
 */
public final class NetworkUtilities {
    private static final NetworkTableInstance NETWORK_TABLE = NetworkTableInstance.getDefault();

    public static void initializeNT() {
        setNetworkTableParams(true);
    }

    public static void shutdown() {
        NETWORK_TABLE.stopServer();
        NETWORK_TABLE.stopClient();
    }

    public static void setNetworkTableParams(boolean asClient) {
        setNetworkTableParams(asClient, kDefaultPort);
    }

    public static void setNetworkTableParams(boolean asClient, int port) {
        if(asClient) {
            NETWORK_TABLE.stopServer();
            NETWORK_TABLE.startClientTeam(2077, port);
        } else {
            NETWORK_TABLE.stopClient();
            NETWORK_TABLE.startServer("networktables.ini", "127.0.0.1", port);
        }
    }

    private NetworkUtilities() {}

    public static NetworkTableValue get(String key) {
        return getEntry(key).getValue();
    }

    public static NetworkTableEntry getEntry(String name) {
        return NETWORK_TABLE.getEntry(name);
    }

    public static void setBooleanArray(String key, boolean[] val) {
        if(!Arrays.equals(val, getBooleanArray(key))) getEntry(key).setBooleanArray(val);
    }

    public static boolean[] getBooleanArray(String key) {
        return getEntry(key).getBooleanArray((boolean[]) null);
    }

    public static void setBoolean(String key, boolean val) {
        if(val != getBoolean(key))getEntry(key).setBoolean(val);
    }

    public static boolean getBoolean(String key) {
        return getEntry(key).getBoolean(false);
    }

    public static void setStringArray(String key, String[] val) {
        if(!Arrays.equals(val, getStringArray(key))) getEntry(key).setStringArray(val);
    }

    public static String[] getStringArray(String key) {
        return getEntry(key).getStringArray(null);
    }

    public static void setString(String key, String val) {
        if(!Objects.equals(val, getString(key))) getEntry(key).setString(val);
    }

    public static String getString(String key) {
        return getEntry(key).getString(null);
    }

    public static void setDoubleArray(String key, double[] val) {
        if(!Arrays.equals(val, getDoubleArray(key))) getEntry(key).setDoubleArray(val);
    }

    public static double[] getDoubleArray(String key) {
        return getEntry(key).getDoubleArray((double[]) null);
    }

    public static void setDouble(String key, double val) {
        if(val != getDouble(key)) getEntry(key).setDouble(val);
    }

    public static double getDouble(String key) {
        return getEntry(key).getDouble(0);
    }

    public static void togglePersist(String key) {
        ifOrElse(key, NetworkTableEntry::isPersistent, NetworkTableEntry::clearPersistent, NetworkTableEntry::setPersistent);
    }

    public static int addListener(Consumer<EntryNotification> listener, int flags) {
        return NETWORK_TABLE.addEntryListener("", listener, flags);
    }

    public static int addListener(Consumer<EntryNotification> listener) {
        int flags = kLocal | kFlags | kDelete | kNew | kUpdate;
        return addListener(listener, flags);
    }

    public static void removeListener(int listener) {
        NETWORK_TABLE.removeEntryListener(listener);
    }

    public static void delete(String key) {
        ifExists(key, NetworkTableEntry::delete);
    }

    private static void nothing(NetworkTableEntry entry) {}

    private static void ifOrElse(
        String entryKey,
        Predicate<NetworkTableEntry> only,
        Consumer<NetworkTableEntry> then,
        Consumer<NetworkTableEntry> orElse
    ) {
        NetworkTableEntry entry = NETWORK_TABLE.getEntry(entryKey);
        if(only.test(entry)) then.accept(entry);
        else orElse.accept(entry);
    }

    private static void ifExists(String entryKey, Consumer<NetworkTableEntry> run) {
        ifOrElse(entryKey, NetworkTableEntry::exists, run, NetworkUtilities::nothing);
    }
}
