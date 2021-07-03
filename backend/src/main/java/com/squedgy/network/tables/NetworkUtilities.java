package com.squedgy.network.tables;

import edu.wpi.first.networktables.*;

import java.util.function.*;

import static edu.wpi.first.networktables.EntryListenerFlags.*;

/**
 * A utility wrapper around Network Tables to utilize various instances
 *
 * TODO: Toggle starting the server if we can find a robot available network table
 */
public final class NetworkUtilities {
    private static final NetworkTableInstance NETWORK_TABLE = NetworkTableInstance.getDefault();

    public static void initializeNT() {
        NETWORK_TABLE.startServer("networktables.ini", "127.0.0.1", NetworkTableInstance.kDefaultPort);
//        NETWORK_TABLE.startClient("127.0.0.1", NetworkTableInstance.kDefaultPort);
    }

    private NetworkUtilities() {}

    public static NetworkTableValue get(String key) {
        return getEntry(key).getValue();
    }

    public static NetworkTableEntry getEntry(String name) {
        return NETWORK_TABLE.getEntry(name);
    }

    public static void setBooleanArray(String key, boolean[] val) {
        getEntry(key).setBooleanArray(val);
    }

    public static boolean[] getBooleanArray(String key) {
        return getEntry(key).getBooleanArray((boolean[]) null);
    }

    public static boolean getBoolean(String key) {
        return getEntry(key).getBoolean(false);
    }

    public static void setBoolean(String key, boolean val) {
        getEntry(key).setBoolean(val);
    }

    public static void setStringArray(String key, String[] val) {
        getEntry(key).setStringArray(val);
    }

    public static String[] getStringArray(String key) {
        return getEntry(key).getStringArray(null);
    }

    public static void setString(String key, String val) {
        getEntry(key).setString(val);
    }

    public static String getString(String key) {
        return getEntry(key).getString(null);
    }

    public static void setDoubleArray(String key, double[] val) {
        getEntry(key).setDoubleArray(val);
    }

    public static double[] getDoubleArray(String key) {
        return getEntry(key).getDoubleArray((double[]) null);
    }

    public static double getDouble(String key) {
        return getEntry(key).getDouble(Double.NaN);
    }

    public static void setDouble(String key, double val) {
        getEntry(key).setDouble(val);
    }

    public static void togglePersist(String key) {
        ifOrElse(key, NetworkTableEntry::isPersistent, NetworkTableEntry::clearPersistent, NetworkTableEntry::setPersistent);
    }

    public static int addListener(Consumer<EntryNotification> listener, int flags) {
        return NETWORK_TABLE.addEntryListener("", listener, flags); // getNetworkTable(table).addEntryListener(listener, flags);
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


    private static void ifOrElse(
        String key,
        Predicate<NetworkTableEntry> only,
        Consumer<NetworkTableEntry> then,
        Consumer<NetworkTableEntry> orElse
    ) {
        NetworkTableEntry entry = NETWORK_TABLE.getEntry(key);
        if(only.test(entry)) then.accept(entry);
        else orElse.accept(entry);
    }

    private static <T> T ifOrElse(
        String key,
        Predicate<NetworkTableEntry> when,
        T arg,
        BiFunction<NetworkTableEntry, T, T> then,
        BiFunction<NetworkTableEntry, T, T> orElse
    ) {
        NetworkTableEntry entry = NETWORK_TABLE.getEntry(key);
        if(when.test(entry)) return then.apply(entry, arg);
        else return orElse.apply(entry, arg);
    }

    private static void nothing(NetworkTableEntry entry) {}
    private static <T> T nothing(NetworkTableEntry entry, T ignored) {return null;}

    private static void ifExists(String key, Consumer<NetworkTableEntry> run) {
        ifOrElse(key, NetworkTableEntry::exists, run, NetworkUtilities::nothing);
    }

    private static <T> T ifExists(String key, BiFunction<NetworkTableEntry, T, T> get, T arg) {
        return ifOrElse(key, NetworkTableEntry::exists, arg, get, NetworkUtilities::nothing);
    }
}
