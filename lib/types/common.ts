/**
 * Common TypeScript Type Utilities
 *
 * Herbruikbare type utilities voor betere type safety.
 */

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific properties optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Deep Partial - make all nested properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Deep Required - make all nested properties required
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

/**
 * Nullable type
 */
export type Nullable<T> = T | null

/**
 * Optional type
 */
export type Optional<T> = T | undefined

/**
 * Maybe type (both null and undefined)
 */
export type Maybe<T> = T | null | undefined

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Extract promise type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Async function type
 */
export type AsyncFunction<Args extends unknown[] = unknown[], Result = unknown> = (
  ...args: Args
) => Promise<Result>

/**
 * Function with specific return type
 */
export type FunctionReturning<T> = (...args: unknown[]) => T

/**
 * Pick by value type
 */
export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

/**
 * Omit by value type
 */
export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>

/**
 * String literal array to union type
 */
export type ArrayToUnion<T extends ReadonlyArray<unknown>> = T[number]

/**
 * Value of object type
 */
export type ValueOf<T> = T[keyof T]

/**
 * Entries type for Object.entries
 */
export type Entries<T> = Array<
  {
    [K in keyof T]: [K, T[K]]
  }[keyof T]
>

/**
 * Mutable type - removes readonly
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * Exact type - disallows extra properties
 */
export type Exact<T, U extends T> = T & {
  [K in keyof U]: K extends keyof T ? U[K] : never
}

/**
 * Brand type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B }

/**
 * ID types
 */
export type UUID = Brand<string, 'UUID'>
export type UserId = Brand<string, 'UserId'>
export type VacancyId = Brand<string, 'VacancyId'>

/**
 * Result type for error handling (Railway Pattern)
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E }

/**
 * Create success result
 */
export function success<T>(value: T): Result<T, never> {
  return { success: true, value }
}

/**
 * Create error result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error }
}

/**
 * Check if result is success
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success
}

/**
 * Check if result is failure
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success
}
