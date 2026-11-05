package top.mcfpp.playground;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import top.mcfpp.nbt.parsers.term.Dictionary;

/** Keep this allocation out of CheerpJ 5.0's optimized constructor call path. */
public final class CheerpJCompatibility {
    private static final Constructor<Dictionary> CONSTRUCTOR;

    static {
        try {
            CONSTRUCTOR = Dictionary.class.getConstructor();
        } catch (NoSuchMethodException error) {
            throw new ExceptionInInitializerError(error);
        }
    }

    public static Dictionary newDictionary() {
        try {
            return CONSTRUCTOR.newInstance();
        } catch (InvocationTargetException error) {
            throw new IllegalStateException("NBT Dictionary constructor failed", error.getCause());
        } catch (ReflectiveOperationException error) {
            throw new IllegalStateException("Cannot construct NBT Dictionary", error);
        }
    }
}
