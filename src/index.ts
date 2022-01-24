/**
 * A simple implementation of SyncExternalStore for use with React’s `useSyncExternalStore`
 * @packageDocumentation
 */

/**
 * A simple SyncExternalStore for use with React’s `useSyncExternalStore`
 * @public
 */
export class SyncExternalStore<T> {
  private _state: T
  private _subscribers: Set<(value: T) => void> = new Set()

  /**
   * The `subscribe` function to pass as the 1st argument to `useSyncExternalStore`
   */
  public subscribe: (callback: (value: T) => void) => () => void

  /**
   * The `getSnapshot` function to pass as the 2nd argument to `useSyncExternalStore`
   */
  public getSnapshot: () => T

  /**
   * Creates a new SyncExternalStore.
   * @param _state - The initial state of the store
   */
  public constructor(initialState: T) {
    this._state = initialState
    this.subscribe = (callback) => {
      this._subscribers.add(callback)
      return () => this._subscribers.delete(callback)
    }
    this.getSnapshot = () => this._state
  }

  /**
   * The current state of the store.
   */
  public get state(): T {
    return this._state
  }
  public set state(value: T) {
    this._state = value
    for (const subscriber of Array.from(this._subscribers)) {
      subscriber(value)
    }
  }
}
