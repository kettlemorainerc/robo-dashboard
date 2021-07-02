package com.squedgy.network.tables;

import com.squedgy.network.tables.message.*;
import edu.wpi.first.networktables.*;
import org.apache.http.cookie.*;

import java.util.*;

import static edu.wpi.first.networktables.EntryListenerFlags.*;

/**
 * A utility wrapper around Network Tables to utilize various instances
 *
 * TODO: Toggle starting the server if we can find a robot available network table
 */
public final class NetworkUtilities {
    private static final NetworkTableInstance NETWORK_TABLE = NetworkTableInstance.getDefault();
    private static final Map<String, NetworkTable> CACHED_TABLES = new HashMap<>();
    public static final String SMART_DASHBOARD_NAME = "SmartDashboard";
    static {
        NETWORK_TABLE.startServer();
        CACHED_TABLES.put(SMART_DASHBOARD_NAME, NETWORK_TABLE.getTable(SMART_DASHBOARD_NAME));
//        NETWORK_TABLE.startClient("127.0.0.1");
    }

    private NetworkUtilities() {}
    
    private static NetworkTable getNetworkTable(String table) {
        return CACHED_TABLES.computeIfAbsent(table, NETWORK_TABLE::getTable);
    }

    public static NetworkTableValue get(String table, String key) {
        return getNetworkTable(table).getEntry(key).getValue();
    }

    public static NetworkTableValue get(String key) {
        return get(SMART_DASHBOARD_NAME, key);
    }

    public static void setBooleanArray(String table, String key, boolean[] val) {
        getNetworkTable(table).getEntry(key).setBooleanArray(val);
    }

    public static void setBooleanArray(String key, boolean[] val) {
        setBooleanArray(SMART_DASHBOARD_NAME, key, val);
    }

    public static void setStringArray(String table, String key, String[] val) {
        getNetworkTable(table).getEntry(key).setStringArray(val);
    }

    public static void setStringArray(String key, String[] val) {
        setStringArray(SMART_DASHBOARD_NAME, key, val);
    }

    public static void setDoubleArray(String table, String key, double[] val) {
        getNetworkTable(table).getEntry(key).setDoubleArray(val);
    }

    public static void setDoubleArray(String key, double[] val) {
        setDoubleArray(SMART_DASHBOARD_NAME, key, val);
    }

    public static void setBoolean(String table, String key, boolean val) {
        getNetworkTable(table).getEntry(key).setBoolean(val);
    }

    public static void setBoolean(String key, boolean val) {
        setBoolean(SMART_DASHBOARD_NAME, key, val);
    }

    public static void setString(String table, String key, String val) {
        getNetworkTable(table).getEntry(key).setString(val);
    }

    public static void setString(String key, String val) {
        setString(SMART_DASHBOARD_NAME, key, val);
    }

    public static void setDouble(String table, String key, double val) {
        getNetworkTable(table).getEntry(key).setDouble(val);
    }

    public static void setDouble(String key, double val) {
        setDouble(SMART_DASHBOARD_NAME, key, val);
    }

    public static boolean[] getBooleanArray(String table, String key) {
        return getNetworkTable(table).getEntry(key).getBooleanArray((boolean[]) null);
    }

    public static boolean[] getBooleanArray(String key) {
        return getBooleanArray(SMART_DASHBOARD_NAME, key);
    }

    public static String[] getStringArray(String table, String key) {
        return getNetworkTable(table).getEntry(key).getStringArray(null);
    }

    public static String[] getStringArray(String key) {
        return getStringArray(SMART_DASHBOARD_NAME, key);
    }

    public static double[] getDoubleArray(String table, String key) {
        return getNetworkTable(table).getEntry(key).getDoubleArray((double[]) null);
    }

    public static double[] getDoubleArray(String key) {
        return getDoubleArray(SMART_DASHBOARD_NAME, key);
    }

    public static boolean getBoolean(String table, String key) {
        return getNetworkTable(table).getEntry(key).getBoolean(false);
    }

    public static boolean getBoolean(String key) {
        return getBoolean(SMART_DASHBOARD_NAME, key);
    }

    public static String getString(String table, String key) {
        return getNetworkTable(table).getEntry(key).getString(null);
    }

    public static String getString(String key) {
        return getString(SMART_DASHBOARD_NAME, key);
    }

    public static double getDouble(String table, String key) {
        return getNetworkTable(table).getEntry(key).getDouble(Double.NaN);
    }

    public static double getDouble(String key) {
        return getDouble(SMART_DASHBOARD_NAME, key);
    }

    public static void togglePersist(String table, String key) {
        NetworkTableEntry entry = getNetworkTable(table).getEntry(key);
        if(entry.isPersistent()) entry.clearPersistent();
        else entry.setPersistent();
    }

    public static void togglePersist(String key) {
        togglePersist(SMART_DASHBOARD_NAME, key);
    }

    public static int addListener(String table, TableEntryListener listener, int flags) {
        return getNetworkTable(table).addEntryListener(listener, flags);
    }

    public static int addListener(String table, TableEntryListener listener) {
        int flags = kLocal | kFlags | kDelete | kNew | kUpdate;
        System.out.println("FLAGS: " + flags);
        return addListener(table, listener, flags);
    }

    public static int addListener(TableEntryListener listener, int flags) {
        return addListener(SMART_DASHBOARD_NAME, listener, flags);
    }

    public static int addListener(TableEntryListener listener) {
        int flags = kLocal | kFlags | kDelete | kNew | kUpdate;
        System.out.println("FLAGS: " + flags);
        return addListener(listener, flags);
    }

    public static void removeListener(String table, int listener) {
        getNetworkTable(table).removeEntryListener(listener);
    }

    public static void removeListener(int listener) {
        removeListener(SMART_DASHBOARD_NAME, listener);
    }

    public static void delete(String table, String key) {
        getNetworkTable(table).delete(key);
    }

    public static void delete(String key) {
        delete(SMART_DASHBOARD_NAME, key);
    }
}
