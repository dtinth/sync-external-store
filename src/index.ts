/**
 * A simple implementation of a SyncExternalStore for use with React 18’s `useSyncExternalStore`.
 *
 * @example
 * ```
 * const store = new SyncExternalStore(0);
 *
 * function App() {
 *   const count = useSyncExternalStore(store.subscribe, store.getSnapshot);
 *   return (
 *     <button type="button" onClick={() => store.state++}>
 *       {count}
 *     </button>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

/**
 * A simple SyncExternalStore for use with React’s `useSyncExternalStore`.
 * @public
 */
export class SyncExternalStore<T> {
  private _state: T
  private _subscribers: Set<(value: T) => void> = new Set()

  /**
   * The `subscribe` function to pass as the 1st argument to `useSyncExternalStore`.
   */
  public subscribe: (onStoreChange: (value: T) => void) => () => void

  /**
   * The `getSnapshot` function to pass as the 2nd argument to `useSyncExternalStore`.
   */
  public getSnapshot: () => T

  /**
   * Creates a new SyncExternalStore.
   * @param _state - The initial state of the store
   */
  public constructor(initialState: T) {
    this._state = initialState
    this.subscribe = (onStoreChange) => {
      this._subscribers.add(onStoreChange)
      return () => this._subscribers.delete(onStoreChange)
    }
    this.getSnapshot = () => this._state
  }

  /**
   * The current state of the store.
   * Assigning a new value to this property will cause all subscribers to be notified.
   * @remarks
   * Assigning the same value will not cause any subscribers to be notified.
   */
  public get state(): T {
    return this._state
  }
  public set state(value: T) {
    if (value !== this._state) {
      this._state = value
      this._subscribers.forEach((subscriber) => subscriber(value))
    }
  }
}
