import java.lang.classfile.*;
import java.lang.classfile.instruction.*;
import java.lang.constant.*;
import java.nio.file.*;
import java.util.jar.*;
import java.util.zip.ZipFile;

/** Build an overlay for the SHA-256-verified 0.1.0 release; never rewrite the release. */
public class BuildCompatibility {
    public static void main(String[] args) throws Exception {
        String name = "top/mcfpp/nbt/parsers/SnbtGrammar.class";
        String dictionary = "top/mcfpp/nbt/parsers/term/Dictionary";
        byte[] original;
        try (var zip = new ZipFile(args[0]); var input = zip.getInputStream(zip.getEntry(name))) {
            original = input.readAllBytes();
        }
        var classFile = ClassFile.of();
        int[] edits = {0};
        CodeTransform allocation = (builder, element) -> {
            if (element instanceof NewObjectInstruction instruction
                    && instruction.className().name().equalsString(dictionary)) {
                if (edits[0] != 0) throw new IllegalStateException("Unexpected Dictionary allocation");
                builder.invokestatic(ClassDesc.of("top.mcfpp.playground.CheerpJCompatibility"),
                        "newDictionary", MethodTypeDesc.of(ClassDesc.ofDescriptor("L" + dictionary + ";")));
                edits[0] = 1;
            } else if (edits[0] == 1 && element instanceof Instruction instruction
                    && instruction.opcode() == Opcode.DUP) {
                edits[0] = 2;
            } else if (edits[0] == 2 && element instanceof InvokeInstruction instruction
                    && instruction.opcode() == Opcode.INVOKESPECIAL
                    && instruction.owner().name().equalsString(dictionary)
                    && instruction.name().equalsString("<init>")
                    && instruction.typeSymbol().equals(MethodTypeDesc.of(ConstantDescs.CD_void))) {
                edits[0] = 3;
            } else {
                // The three allocation instructions must be consecutive.
                if (edits[0] > 0 && edits[0] < 3 && element instanceof Instruction) {
                    throw new IllegalStateException("Unexpected Dictionary constructor bytecode");
                }
                builder.with(element);
            }
        };
        byte[] patched = classFile.transformClass(classFile.parse(original),
                ClassTransform.transformingMethodBodies(method -> method.methodName().equalsString("createParser"), allocation));
        if (edits[0] != 3) throw new IllegalStateException("Expected exactly one constructor replacement");
        var errors = classFile.verify(patched);
        if (!errors.isEmpty()) throw new IllegalStateException(errors.toString());
        try (var jar = new JarOutputStream(Files.newOutputStream(Path.of(args[2])))) {
            write(jar, name, patched);
            write(jar, "top/mcfpp/playground/CheerpJCompatibility.class", Files.readAllBytes(Path.of(args[1])));
        }
        System.out.println("CheerpJ compatibility: replaced one allocation; classfile verification passed.");
    }

    private static void write(JarOutputStream jar, String name, byte[] bytes) throws Exception {
        var entry = new JarEntry(name);
        entry.setTime(0); // Reproducible archive, independent of preparation time.
        jar.putNextEntry(entry);
        jar.write(bytes);
        jar.closeEntry();
    }
}
