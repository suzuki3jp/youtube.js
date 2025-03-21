import { expect, test } from "vitest";
import { isNullish } from "../src/utils";

test("isNullish", () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish("")).toBe(false);
    expect(isNullish(0)).toBe(false);
    expect(isNullish([])).toBe(false);
    expect(isNullish({})).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish(true)).toBe(false);
    expect(isNullish(Symbol())).toBe(false);
    expect(isNullish(() => {})).toBe(false);
    expect(isNullish(new Map())).toBe(false);
    expect(isNullish(new Set())).toBe(false);
    expect(isNullish(new Date())).toBe(false);
    expect(isNullish(new Error())).toBe(false);
    expect(isNullish(new RegExp(/^[a-z0-9]+$/i))).toBe(false);
    expect(isNullish(new Int8Array())).toBe(false);
    expect(isNullish(new Uint8Array())).toBe(false);
    expect(isNullish(new Uint8ClampedArray())).toBe(false);
    expect(isNullish(new Int16Array())).toBe(false);
    expect(isNullish(new Uint16Array())).toBe(false);
    expect(isNullish(new Int32Array())).toBe(false);
    expect(isNullish(new Uint32Array())).toBe(false);
    expect(isNullish(new Float32Array())).toBe(false);
    expect(isNullish(new Float64Array())).toBe(false);
    expect(isNullish(new BigInt64Array())).toBe(false);
    expect(isNullish(new BigUint64Array())).toBe(false);
    expect(isNullish(new DataView(new ArrayBuffer(1)))).toBe(false);
    expect(isNullish(new ArrayBuffer(1))).toBe(false);
    expect(isNullish(new SharedArrayBuffer(1))).toBe(false);
    expect(isNullish(new WeakMap())).toBe(false);
    expect(isNullish(new WeakSet())).toBe(false);
    expect(isNullish(new Promise(() => {}))).toBe(false);
    expect(isNullish(new URL("http://example.com"))).toBe(false);
    expect(isNullish(new URLSearchParams())).toBe(false);
    expect(isNullish(new Headers())).toBe(false);
    expect(isNullish(new FormData())).toBe(false);
    expect(isNullish(new ReadableStream())).toBe(false);
    expect(isNullish(new WritableStream())).toBe(false);
    expect(isNullish(new TransformStream())).toBe(false);
    expect(isNullish(new Blob())).toBe(false);
    expect(isNullish(new File([], ""))).toBe;
});
