import { describe, it, expect, vi } from "vite-plus/test";
import { SyncExternalStore } from "./index.js";

describe("SyncExternalStore", () => {
  it("should initialize with the provided state", () => {
    const store = new SyncExternalStore(42);
    expect(store.getSnapshot()).toBe(42);
    expect(store.state).toBe(42);
  });

  it("should allow reading and writing state", () => {
    const store = new SyncExternalStore("initial");
    expect(store.state).toBe("initial");
    store.state = "updated";
    expect(store.state).toBe("updated");
    expect(store.getSnapshot()).toBe("updated");
  });

  it("should notify subscribers when state changes", () => {
    const store = new SyncExternalStore(0);
    const subscriber = vi.fn();

    store.subscribe(subscriber);
    store.state = 1;

    expect(subscriber).toHaveBeenCalledWith(1);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it("should not notify subscribers when state is set to the same value", () => {
    const store = new SyncExternalStore(5);
    const subscriber = vi.fn();

    store.subscribe(subscriber);
    store.state = 5;

    expect(subscriber).not.toHaveBeenCalled();
  });

  it("should support multiple subscribers", () => {
    const store = new SyncExternalStore(0);
    const subscriber1 = vi.fn();
    const subscriber2 = vi.fn();

    store.subscribe(subscriber1);
    store.subscribe(subscriber2);
    store.state = 42;

    expect(subscriber1).toHaveBeenCalledWith(42);
    expect(subscriber2).toHaveBeenCalledWith(42);
  });

  it("should allow unsubscribing", () => {
    const store = new SyncExternalStore(0);
    const subscriber = vi.fn();

    const unsubscribe = store.subscribe(subscriber);
    store.state = 1;
    expect(subscriber).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.state = 2;
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it("should work with object state", () => {
    const initialState = { count: 0 };
    const store = new SyncExternalStore(initialState);
    const subscriber = vi.fn();

    store.subscribe(subscriber);

    const newState = { count: 1 };
    store.state = newState;

    expect(subscriber).toHaveBeenCalledWith(newState);
    expect(store.getSnapshot()).toBe(newState);
  });

  it("should work with array state", () => {
    const store = new SyncExternalStore<number[]>([1, 2, 3]);
    const subscriber = vi.fn();

    store.subscribe(subscriber);

    const newArray = [1, 2, 3, 4];
    store.state = newArray;

    expect(subscriber).toHaveBeenCalledWith(newArray);
    expect(store.getSnapshot()).toEqual([1, 2, 3, 4]);
  });

  it("should handle null and undefined states", () => {
    const storeNull = new SyncExternalStore<string | null>(null);
    expect(storeNull.getSnapshot()).toBeNull();

    storeNull.state = "value";
    expect(storeNull.getSnapshot()).toBe("value");

    storeNull.state = null;
    expect(storeNull.getSnapshot()).toBeNull();
  });
});
