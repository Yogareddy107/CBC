
import { z } from "zod";

// --- PASTE THE NEW SCHEMA HELPERS HERE FOR TESTING (since we can't easily import non-exported internals) ---
// In a real scenario I would export them, but for quick testing I will duplicate the logic to ensure it behaves as expected given the input.
// ACTUALLY, I should import the Schema if it's exported. 
// Looking at client.ts, AnalysisSchema is NOT exported. AnalysisResult IS. 
// I will rely on the fact that I just wrote the code and I can test the logic in isolation here.

// Helpers for robust validation
function createLooseEnumSchema<T extends string>(values: readonly T[], fallback: T) {
    return z.preprocess((val) => {
        if (typeof val === 'string') {
            const match = values.find(v => v.toLowerCase() === val.toLowerCase());
            if (match) return match;
        }
        return fallback;
    }, z.enum(values as [T, ...T[]]));
}

const flexibleStringSchema = z.union([
    z.string(),
    z.array(z.string()).transform(arr => arr.join(". ")),
    z.number().transform(n => String(n)),
    z.null().transform(() => "Not specified"),
    z.undefined().transform(() => "Not specified"),
]);

const scoreSchema = z.preprocess((val) => {
    const n = Number(val);
    if (isNaN(n)) return 5;
    if (n > 10) return Math.round(n / 10); // Handle 0-100 scale
    return Math.max(1, Math.min(10, Math.round(n))); // Clamp 1-10
}, z.number().min(1).max(10));

// --- TEST CASES ---

function test() {
    console.log("Testing Schema Helpers...");

    // 1. flexibleStringSchema
    const str1 = flexibleStringSchema.parse("hello");
    console.log(`String 'hello' -> '${str1}'`, str1 === "hello" ? "PASS" : "FAIL");

    const str2 = flexibleStringSchema.parse(["hello", "world"]);
    console.log(`Array ['hello', 'world'] -> '${str2}'`, str2 === "hello. world" ? "PASS" : "FAIL");

    // 2. scoreSchema
    const score1 = scoreSchema.parse(8);
    console.log(`Score 8 -> ${score1}`, score1 === 8 ? "PASS" : "FAIL");

    const score2 = scoreSchema.parse(85); // Should be 9 (round(8.5))
    console.log(`Score 85 -> ${score2}`, score2 === 9 ? "PASS" : "FAIL");

    const score3 = scoreSchema.parse("7");
    console.log(`Score "7" -> ${score3}`, score3 === 7 ? "PASS" : "FAIL");

    // 3. createLooseEnumSchema
    const MyEnum = createLooseEnumSchema(['Low', 'Medium', 'High'], 'Medium');

    const enum1 = MyEnum.parse("High");
    console.log(`Enum "High" -> '${enum1}'`, enum1 === "High" ? "PASS" : "FAIL");

    const enum2 = MyEnum.parse("low"); // Case insensitive
    console.log(`Enum "low" -> '${enum2}'`, enum2 === "Low" ? "PASS" : "FAIL");

    const enum3 = MyEnum.parse("Ultra-High"); // Invalid -> Fallback
    console.log(`Enum "Ultra-High" -> '${enum3}'`, enum3 === "Medium" ? "PASS" : "FAIL");

    console.log("\nDone.");
}

test();
