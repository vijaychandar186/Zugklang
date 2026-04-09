
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PassportFlag
 * 
 */
export type PassportFlag = $Result.DefaultSelection<Prisma.$PassportFlagPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model Authenticator
 * 
 */
export type Authenticator = $Result.DefaultSelection<Prisma.$AuthenticatorPayload>
/**
 * Model Game
 * 
 */
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>
/**
 * Model GameAnalysis
 * 
 */
export type GameAnalysis = $Result.DefaultSelection<Prisma.$GameAnalysisPayload>
/**
 * Model Rating
 * 
 */
export type Rating = $Result.DefaultSelection<Prisma.$RatingPayload>
/**
 * Model PuzzleRating
 * 
 */
export type PuzzleRating = $Result.DefaultSelection<Prisma.$PuzzleRatingPayload>
/**
 * Model PuzzleAttempt
 * 
 */
export type PuzzleAttempt = $Result.DefaultSelection<Prisma.$PuzzleAttemptPayload>
/**
 * Model PuzzleRushScore
 * 
 */
export type PuzzleRushScore = $Result.DefaultSelection<Prisma.$PuzzleRushScorePayload>
/**
 * Model MemorySession
 * 
 */
export type MemorySession = $Result.DefaultSelection<Prisma.$MemorySessionPayload>
/**
 * Model VisionSession
 * 
 */
export type VisionSession = $Result.DefaultSelection<Prisma.$VisionSessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passportFlag`: Exposes CRUD operations for the **PassportFlag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PassportFlags
    * const passportFlags = await prisma.passportFlag.findMany()
    * ```
    */
  get passportFlag(): Prisma.PassportFlagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authenticator`: Exposes CRUD operations for the **Authenticator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Authenticators
    * const authenticators = await prisma.authenticator.findMany()
    * ```
    */
  get authenticator(): Prisma.AuthenticatorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.game.findMany()
    * ```
    */
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameAnalysis`: Exposes CRUD operations for the **GameAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameAnalyses
    * const gameAnalyses = await prisma.gameAnalysis.findMany()
    * ```
    */
  get gameAnalysis(): Prisma.GameAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rating`: Exposes CRUD operations for the **Rating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ratings
    * const ratings = await prisma.rating.findMany()
    * ```
    */
  get rating(): Prisma.RatingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.puzzleRating`: Exposes CRUD operations for the **PuzzleRating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PuzzleRatings
    * const puzzleRatings = await prisma.puzzleRating.findMany()
    * ```
    */
  get puzzleRating(): Prisma.PuzzleRatingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.puzzleAttempt`: Exposes CRUD operations for the **PuzzleAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PuzzleAttempts
    * const puzzleAttempts = await prisma.puzzleAttempt.findMany()
    * ```
    */
  get puzzleAttempt(): Prisma.PuzzleAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.puzzleRushScore`: Exposes CRUD operations for the **PuzzleRushScore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PuzzleRushScores
    * const puzzleRushScores = await prisma.puzzleRushScore.findMany()
    * ```
    */
  get puzzleRushScore(): Prisma.PuzzleRushScoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.memorySession`: Exposes CRUD operations for the **MemorySession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MemorySessions
    * const memorySessions = await prisma.memorySession.findMany()
    * ```
    */
  get memorySession(): Prisma.MemorySessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.visionSession`: Exposes CRUD operations for the **VisionSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisionSessions
    * const visionSessions = await prisma.visionSession.findMany()
    * ```
    */
  get visionSession(): Prisma.VisionSessionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.0
   * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PassportFlag: 'PassportFlag',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    Authenticator: 'Authenticator',
    Game: 'Game',
    GameAnalysis: 'GameAnalysis',
    Rating: 'Rating',
    PuzzleRating: 'PuzzleRating',
    PuzzleAttempt: 'PuzzleAttempt',
    PuzzleRushScore: 'PuzzleRushScore',
    MemorySession: 'MemorySession',
    VisionSession: 'VisionSession'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "passportFlag" | "account" | "session" | "verificationToken" | "authenticator" | "game" | "gameAnalysis" | "rating" | "puzzleRating" | "puzzleAttempt" | "puzzleRushScore" | "memorySession" | "visionSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PassportFlag: {
        payload: Prisma.$PassportFlagPayload<ExtArgs>
        fields: Prisma.PassportFlagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PassportFlagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PassportFlagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          findFirst: {
            args: Prisma.PassportFlagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PassportFlagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          findMany: {
            args: Prisma.PassportFlagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[]
          }
          create: {
            args: Prisma.PassportFlagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          createMany: {
            args: Prisma.PassportFlagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PassportFlagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[]
          }
          delete: {
            args: Prisma.PassportFlagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          update: {
            args: Prisma.PassportFlagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          deleteMany: {
            args: Prisma.PassportFlagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PassportFlagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PassportFlagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[]
          }
          upsert: {
            args: Prisma.PassportFlagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>
          }
          aggregate: {
            args: Prisma.PassportFlagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePassportFlag>
          }
          groupBy: {
            args: Prisma.PassportFlagGroupByArgs<ExtArgs>
            result: $Utils.Optional<PassportFlagGroupByOutputType>[]
          }
          count: {
            args: Prisma.PassportFlagCountArgs<ExtArgs>
            result: $Utils.Optional<PassportFlagCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      Authenticator: {
        payload: Prisma.$AuthenticatorPayload<ExtArgs>
        fields: Prisma.AuthenticatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthenticatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthenticatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          findFirst: {
            args: Prisma.AuthenticatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthenticatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          findMany: {
            args: Prisma.AuthenticatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[]
          }
          create: {
            args: Prisma.AuthenticatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          createMany: {
            args: Prisma.AuthenticatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthenticatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[]
          }
          delete: {
            args: Prisma.AuthenticatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          update: {
            args: Prisma.AuthenticatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          deleteMany: {
            args: Prisma.AuthenticatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthenticatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthenticatorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[]
          }
          upsert: {
            args: Prisma.AuthenticatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>
          }
          aggregate: {
            args: Prisma.AuthenticatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthenticator>
          }
          groupBy: {
            args: Prisma.AuthenticatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthenticatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthenticatorCountArgs<ExtArgs>
            result: $Utils.Optional<AuthenticatorCountAggregateOutputType> | number
          }
        }
      }
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>
        fields: Prisma.GameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGame>
          }
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameCountArgs<ExtArgs>
            result: $Utils.Optional<GameCountAggregateOutputType> | number
          }
        }
      }
      GameAnalysis: {
        payload: Prisma.$GameAnalysisPayload<ExtArgs>
        fields: Prisma.GameAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          findFirst: {
            args: Prisma.GameAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          findMany: {
            args: Prisma.GameAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[]
          }
          create: {
            args: Prisma.GameAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          createMany: {
            args: Prisma.GameAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[]
          }
          delete: {
            args: Prisma.GameAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          update: {
            args: Prisma.GameAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.GameAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.GameAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>
          }
          aggregate: {
            args: Prisma.GameAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameAnalysis>
          }
          groupBy: {
            args: Prisma.GameAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<GameAnalysisCountAggregateOutputType> | number
          }
        }
      }
      Rating: {
        payload: Prisma.$RatingPayload<ExtArgs>
        fields: Prisma.RatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findFirst: {
            args: Prisma.RatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findMany: {
            args: Prisma.RatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          create: {
            args: Prisma.RatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          createMany: {
            args: Prisma.RatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          delete: {
            args: Prisma.RatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          update: {
            args: Prisma.RatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          deleteMany: {
            args: Prisma.RatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RatingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          upsert: {
            args: Prisma.RatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          aggregate: {
            args: Prisma.RatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRating>
          }
          groupBy: {
            args: Prisma.RatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.RatingCountArgs<ExtArgs>
            result: $Utils.Optional<RatingCountAggregateOutputType> | number
          }
        }
      }
      PuzzleRating: {
        payload: Prisma.$PuzzleRatingPayload<ExtArgs>
        fields: Prisma.PuzzleRatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PuzzleRatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PuzzleRatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          findFirst: {
            args: Prisma.PuzzleRatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PuzzleRatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          findMany: {
            args: Prisma.PuzzleRatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[]
          }
          create: {
            args: Prisma.PuzzleRatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          createMany: {
            args: Prisma.PuzzleRatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PuzzleRatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[]
          }
          delete: {
            args: Prisma.PuzzleRatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          update: {
            args: Prisma.PuzzleRatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          deleteMany: {
            args: Prisma.PuzzleRatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PuzzleRatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PuzzleRatingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[]
          }
          upsert: {
            args: Prisma.PuzzleRatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>
          }
          aggregate: {
            args: Prisma.PuzzleRatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePuzzleRating>
          }
          groupBy: {
            args: Prisma.PuzzleRatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PuzzleRatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PuzzleRatingCountArgs<ExtArgs>
            result: $Utils.Optional<PuzzleRatingCountAggregateOutputType> | number
          }
        }
      }
      PuzzleAttempt: {
        payload: Prisma.$PuzzleAttemptPayload<ExtArgs>
        fields: Prisma.PuzzleAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PuzzleAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PuzzleAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          findFirst: {
            args: Prisma.PuzzleAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PuzzleAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          findMany: {
            args: Prisma.PuzzleAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[]
          }
          create: {
            args: Prisma.PuzzleAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          createMany: {
            args: Prisma.PuzzleAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PuzzleAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[]
          }
          delete: {
            args: Prisma.PuzzleAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          update: {
            args: Prisma.PuzzleAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          deleteMany: {
            args: Prisma.PuzzleAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PuzzleAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PuzzleAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[]
          }
          upsert: {
            args: Prisma.PuzzleAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>
          }
          aggregate: {
            args: Prisma.PuzzleAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePuzzleAttempt>
          }
          groupBy: {
            args: Prisma.PuzzleAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<PuzzleAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.PuzzleAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<PuzzleAttemptCountAggregateOutputType> | number
          }
        }
      }
      PuzzleRushScore: {
        payload: Prisma.$PuzzleRushScorePayload<ExtArgs>
        fields: Prisma.PuzzleRushScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PuzzleRushScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PuzzleRushScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          findFirst: {
            args: Prisma.PuzzleRushScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PuzzleRushScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          findMany: {
            args: Prisma.PuzzleRushScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[]
          }
          create: {
            args: Prisma.PuzzleRushScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          createMany: {
            args: Prisma.PuzzleRushScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PuzzleRushScoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[]
          }
          delete: {
            args: Prisma.PuzzleRushScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          update: {
            args: Prisma.PuzzleRushScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          deleteMany: {
            args: Prisma.PuzzleRushScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PuzzleRushScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PuzzleRushScoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[]
          }
          upsert: {
            args: Prisma.PuzzleRushScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>
          }
          aggregate: {
            args: Prisma.PuzzleRushScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePuzzleRushScore>
          }
          groupBy: {
            args: Prisma.PuzzleRushScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<PuzzleRushScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.PuzzleRushScoreCountArgs<ExtArgs>
            result: $Utils.Optional<PuzzleRushScoreCountAggregateOutputType> | number
          }
        }
      }
      MemorySession: {
        payload: Prisma.$MemorySessionPayload<ExtArgs>
        fields: Prisma.MemorySessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemorySessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemorySessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          findFirst: {
            args: Prisma.MemorySessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemorySessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          findMany: {
            args: Prisma.MemorySessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          create: {
            args: Prisma.MemorySessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          createMany: {
            args: Prisma.MemorySessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemorySessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          delete: {
            args: Prisma.MemorySessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          update: {
            args: Prisma.MemorySessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          deleteMany: {
            args: Prisma.MemorySessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemorySessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemorySessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          upsert: {
            args: Prisma.MemorySessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          aggregate: {
            args: Prisma.MemorySessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMemorySession>
          }
          groupBy: {
            args: Prisma.MemorySessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemorySessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemorySessionCountArgs<ExtArgs>
            result: $Utils.Optional<MemorySessionCountAggregateOutputType> | number
          }
        }
      }
      VisionSession: {
        payload: Prisma.$VisionSessionPayload<ExtArgs>
        fields: Prisma.VisionSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisionSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisionSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          findFirst: {
            args: Prisma.VisionSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisionSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          findMany: {
            args: Prisma.VisionSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[]
          }
          create: {
            args: Prisma.VisionSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          createMany: {
            args: Prisma.VisionSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisionSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[]
          }
          delete: {
            args: Prisma.VisionSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          update: {
            args: Prisma.VisionSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          deleteMany: {
            args: Prisma.VisionSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisionSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VisionSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[]
          }
          upsert: {
            args: Prisma.VisionSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>
          }
          aggregate: {
            args: Prisma.VisionSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisionSession>
          }
          groupBy: {
            args: Prisma.VisionSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisionSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisionSessionCountArgs<ExtArgs>
            result: $Utils.Optional<VisionSessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    passportFlag?: PassportFlagOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    authenticator?: AuthenticatorOmit
    game?: GameOmit
    gameAnalysis?: GameAnalysisOmit
    rating?: RatingOmit
    puzzleRating?: PuzzleRatingOmit
    puzzleAttempt?: PuzzleAttemptOmit
    puzzleRushScore?: PuzzleRushScoreOmit
    memorySession?: MemorySessionOmit
    visionSession?: VisionSessionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    Authenticator: number
    whiteGames: number
    blackGames: number
    ratings: number
    analyses: number
    puzzleAttempts: number
    puzzleRushScores: number
    memorySessions: number
    visionSessions: number
    passportFlags: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    Authenticator?: boolean | UserCountOutputTypeCountAuthenticatorArgs
    whiteGames?: boolean | UserCountOutputTypeCountWhiteGamesArgs
    blackGames?: boolean | UserCountOutputTypeCountBlackGamesArgs
    ratings?: boolean | UserCountOutputTypeCountRatingsArgs
    analyses?: boolean | UserCountOutputTypeCountAnalysesArgs
    puzzleAttempts?: boolean | UserCountOutputTypeCountPuzzleAttemptsArgs
    puzzleRushScores?: boolean | UserCountOutputTypeCountPuzzleRushScoresArgs
    memorySessions?: boolean | UserCountOutputTypeCountMemorySessionsArgs
    visionSessions?: boolean | UserCountOutputTypeCountVisionSessionsArgs
    passportFlags?: boolean | UserCountOutputTypeCountPassportFlagsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuthenticatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticatorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWhiteGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBlackGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameAnalysisWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPuzzleAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleAttemptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPuzzleRushScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleRushScoreWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMemorySessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemorySessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVisionSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisionSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPassportFlagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PassportFlagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    flagCode: string | null
    banned: boolean | null
    bannedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    flagCode: string | null
    banned: boolean | null
    bannedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    flagCode: number
    banned: number
    bannedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    flagCode?: true
    banned?: true
    bannedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    flagCode?: true
    banned?: true
    bannedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    flagCode?: true
    banned?: true
    bannedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    flagCode: string
    banned: boolean
    bannedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    flagCode?: boolean
    banned?: boolean
    bannedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    Authenticator?: boolean | User$AuthenticatorArgs<ExtArgs>
    whiteGames?: boolean | User$whiteGamesArgs<ExtArgs>
    blackGames?: boolean | User$blackGamesArgs<ExtArgs>
    ratings?: boolean | User$ratingsArgs<ExtArgs>
    puzzleRating?: boolean | User$puzzleRatingArgs<ExtArgs>
    analyses?: boolean | User$analysesArgs<ExtArgs>
    puzzleAttempts?: boolean | User$puzzleAttemptsArgs<ExtArgs>
    puzzleRushScores?: boolean | User$puzzleRushScoresArgs<ExtArgs>
    memorySessions?: boolean | User$memorySessionsArgs<ExtArgs>
    visionSessions?: boolean | User$visionSessionsArgs<ExtArgs>
    passportFlags?: boolean | User$passportFlagsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    flagCode?: boolean
    banned?: boolean
    bannedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    flagCode?: boolean
    banned?: boolean
    bannedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    flagCode?: boolean
    banned?: boolean
    bannedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "flagCode" | "banned" | "bannedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    Authenticator?: boolean | User$AuthenticatorArgs<ExtArgs>
    whiteGames?: boolean | User$whiteGamesArgs<ExtArgs>
    blackGames?: boolean | User$blackGamesArgs<ExtArgs>
    ratings?: boolean | User$ratingsArgs<ExtArgs>
    puzzleRating?: boolean | User$puzzleRatingArgs<ExtArgs>
    analyses?: boolean | User$analysesArgs<ExtArgs>
    puzzleAttempts?: boolean | User$puzzleAttemptsArgs<ExtArgs>
    puzzleRushScores?: boolean | User$puzzleRushScoresArgs<ExtArgs>
    memorySessions?: boolean | User$memorySessionsArgs<ExtArgs>
    visionSessions?: boolean | User$visionSessionsArgs<ExtArgs>
    passportFlags?: boolean | User$passportFlagsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      Authenticator: Prisma.$AuthenticatorPayload<ExtArgs>[]
      whiteGames: Prisma.$GamePayload<ExtArgs>[]
      blackGames: Prisma.$GamePayload<ExtArgs>[]
      ratings: Prisma.$RatingPayload<ExtArgs>[]
      puzzleRating: Prisma.$PuzzleRatingPayload<ExtArgs> | null
      analyses: Prisma.$GameAnalysisPayload<ExtArgs>[]
      puzzleAttempts: Prisma.$PuzzleAttemptPayload<ExtArgs>[]
      puzzleRushScores: Prisma.$PuzzleRushScorePayload<ExtArgs>[]
      memorySessions: Prisma.$MemorySessionPayload<ExtArgs>[]
      visionSessions: Prisma.$VisionSessionPayload<ExtArgs>[]
      passportFlags: Prisma.$PassportFlagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      emailVerified: Date | null
      image: string | null
      flagCode: string
      banned: boolean
      bannedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Authenticator<T extends User$AuthenticatorArgs<ExtArgs> = {}>(args?: Subset<T, User$AuthenticatorArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    whiteGames<T extends User$whiteGamesArgs<ExtArgs> = {}>(args?: Subset<T, User$whiteGamesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    blackGames<T extends User$blackGamesArgs<ExtArgs> = {}>(args?: Subset<T, User$blackGamesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratings<T extends User$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, User$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    puzzleRating<T extends User$puzzleRatingArgs<ExtArgs> = {}>(args?: Subset<T, User$puzzleRatingArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    analyses<T extends User$analysesArgs<ExtArgs> = {}>(args?: Subset<T, User$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    puzzleAttempts<T extends User$puzzleAttemptsArgs<ExtArgs> = {}>(args?: Subset<T, User$puzzleAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    puzzleRushScores<T extends User$puzzleRushScoresArgs<ExtArgs> = {}>(args?: Subset<T, User$puzzleRushScoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    memorySessions<T extends User$memorySessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$memorySessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    visionSessions<T extends User$visionSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$visionSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    passportFlags<T extends User$passportFlagsArgs<ExtArgs> = {}>(args?: Subset<T, User$passportFlagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly flagCode: FieldRef<"User", 'String'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly bannedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.Authenticator
   */
  export type User$AuthenticatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    where?: AuthenticatorWhereInput
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    cursor?: AuthenticatorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * User.whiteGames
   */
  export type User$whiteGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * User.blackGames
   */
  export type User$blackGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * User.ratings
   */
  export type User$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    cursor?: RatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * User.puzzleRating
   */
  export type User$puzzleRatingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    where?: PuzzleRatingWhereInput
  }

  /**
   * User.analyses
   */
  export type User$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    where?: GameAnalysisWhereInput
    orderBy?: GameAnalysisOrderByWithRelationInput | GameAnalysisOrderByWithRelationInput[]
    cursor?: GameAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[]
  }

  /**
   * User.puzzleAttempts
   */
  export type User$puzzleAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    where?: PuzzleAttemptWhereInput
    orderBy?: PuzzleAttemptOrderByWithRelationInput | PuzzleAttemptOrderByWithRelationInput[]
    cursor?: PuzzleAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[]
  }

  /**
   * User.puzzleRushScores
   */
  export type User$puzzleRushScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    where?: PuzzleRushScoreWhereInput
    orderBy?: PuzzleRushScoreOrderByWithRelationInput | PuzzleRushScoreOrderByWithRelationInput[]
    cursor?: PuzzleRushScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PuzzleRushScoreScalarFieldEnum | PuzzleRushScoreScalarFieldEnum[]
  }

  /**
   * User.memorySessions
   */
  export type User$memorySessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    where?: MemorySessionWhereInput
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    cursor?: MemorySessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * User.visionSessions
   */
  export type User$visionSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    where?: VisionSessionWhereInput
    orderBy?: VisionSessionOrderByWithRelationInput | VisionSessionOrderByWithRelationInput[]
    cursor?: VisionSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[]
  }

  /**
   * User.passportFlags
   */
  export type User$passportFlagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    where?: PassportFlagWhereInput
    orderBy?: PassportFlagOrderByWithRelationInput | PassportFlagOrderByWithRelationInput[]
    cursor?: PassportFlagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PassportFlag
   */

  export type AggregatePassportFlag = {
    _count: PassportFlagCountAggregateOutputType | null
    _min: PassportFlagMinAggregateOutputType | null
    _max: PassportFlagMaxAggregateOutputType | null
  }

  export type PassportFlagMinAggregateOutputType = {
    id: string | null
    userId: string | null
    flagCode: string | null
    createdAt: Date | null
  }

  export type PassportFlagMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    flagCode: string | null
    createdAt: Date | null
  }

  export type PassportFlagCountAggregateOutputType = {
    id: number
    userId: number
    flagCode: number
    createdAt: number
    _all: number
  }


  export type PassportFlagMinAggregateInputType = {
    id?: true
    userId?: true
    flagCode?: true
    createdAt?: true
  }

  export type PassportFlagMaxAggregateInputType = {
    id?: true
    userId?: true
    flagCode?: true
    createdAt?: true
  }

  export type PassportFlagCountAggregateInputType = {
    id?: true
    userId?: true
    flagCode?: true
    createdAt?: true
    _all?: true
  }

  export type PassportFlagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PassportFlag to aggregate.
     */
    where?: PassportFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PassportFlags to fetch.
     */
    orderBy?: PassportFlagOrderByWithRelationInput | PassportFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PassportFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PassportFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PassportFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PassportFlags
    **/
    _count?: true | PassportFlagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PassportFlagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PassportFlagMaxAggregateInputType
  }

  export type GetPassportFlagAggregateType<T extends PassportFlagAggregateArgs> = {
        [P in keyof T & keyof AggregatePassportFlag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePassportFlag[P]>
      : GetScalarType<T[P], AggregatePassportFlag[P]>
  }




  export type PassportFlagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PassportFlagWhereInput
    orderBy?: PassportFlagOrderByWithAggregationInput | PassportFlagOrderByWithAggregationInput[]
    by: PassportFlagScalarFieldEnum[] | PassportFlagScalarFieldEnum
    having?: PassportFlagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PassportFlagCountAggregateInputType | true
    _min?: PassportFlagMinAggregateInputType
    _max?: PassportFlagMaxAggregateInputType
  }

  export type PassportFlagGroupByOutputType = {
    id: string
    userId: string
    flagCode: string
    createdAt: Date
    _count: PassportFlagCountAggregateOutputType | null
    _min: PassportFlagMinAggregateOutputType | null
    _max: PassportFlagMaxAggregateOutputType | null
  }

  type GetPassportFlagGroupByPayload<T extends PassportFlagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PassportFlagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PassportFlagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PassportFlagGroupByOutputType[P]>
            : GetScalarType<T[P], PassportFlagGroupByOutputType[P]>
        }
      >
    >


  export type PassportFlagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flagCode?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passportFlag"]>

  export type PassportFlagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flagCode?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passportFlag"]>

  export type PassportFlagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    flagCode?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passportFlag"]>

  export type PassportFlagSelectScalar = {
    id?: boolean
    userId?: boolean
    flagCode?: boolean
    createdAt?: boolean
  }

  export type PassportFlagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "flagCode" | "createdAt", ExtArgs["result"]["passportFlag"]>
  export type PassportFlagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PassportFlagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PassportFlagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PassportFlagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PassportFlag"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      flagCode: string
      createdAt: Date
    }, ExtArgs["result"]["passportFlag"]>
    composites: {}
  }

  type PassportFlagGetPayload<S extends boolean | null | undefined | PassportFlagDefaultArgs> = $Result.GetResult<Prisma.$PassportFlagPayload, S>

  type PassportFlagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PassportFlagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PassportFlagCountAggregateInputType | true
    }

  export interface PassportFlagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PassportFlag'], meta: { name: 'PassportFlag' } }
    /**
     * Find zero or one PassportFlag that matches the filter.
     * @param {PassportFlagFindUniqueArgs} args - Arguments to find a PassportFlag
     * @example
     * // Get one PassportFlag
     * const passportFlag = await prisma.passportFlag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PassportFlagFindUniqueArgs>(args: SelectSubset<T, PassportFlagFindUniqueArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PassportFlag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PassportFlagFindUniqueOrThrowArgs} args - Arguments to find a PassportFlag
     * @example
     * // Get one PassportFlag
     * const passportFlag = await prisma.passportFlag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PassportFlagFindUniqueOrThrowArgs>(args: SelectSubset<T, PassportFlagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PassportFlag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagFindFirstArgs} args - Arguments to find a PassportFlag
     * @example
     * // Get one PassportFlag
     * const passportFlag = await prisma.passportFlag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PassportFlagFindFirstArgs>(args?: SelectSubset<T, PassportFlagFindFirstArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PassportFlag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagFindFirstOrThrowArgs} args - Arguments to find a PassportFlag
     * @example
     * // Get one PassportFlag
     * const passportFlag = await prisma.passportFlag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PassportFlagFindFirstOrThrowArgs>(args?: SelectSubset<T, PassportFlagFindFirstOrThrowArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PassportFlags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PassportFlags
     * const passportFlags = await prisma.passportFlag.findMany()
     * 
     * // Get first 10 PassportFlags
     * const passportFlags = await prisma.passportFlag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passportFlagWithIdOnly = await prisma.passportFlag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PassportFlagFindManyArgs>(args?: SelectSubset<T, PassportFlagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PassportFlag.
     * @param {PassportFlagCreateArgs} args - Arguments to create a PassportFlag.
     * @example
     * // Create one PassportFlag
     * const PassportFlag = await prisma.passportFlag.create({
     *   data: {
     *     // ... data to create a PassportFlag
     *   }
     * })
     * 
     */
    create<T extends PassportFlagCreateArgs>(args: SelectSubset<T, PassportFlagCreateArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PassportFlags.
     * @param {PassportFlagCreateManyArgs} args - Arguments to create many PassportFlags.
     * @example
     * // Create many PassportFlags
     * const passportFlag = await prisma.passportFlag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PassportFlagCreateManyArgs>(args?: SelectSubset<T, PassportFlagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PassportFlags and returns the data saved in the database.
     * @param {PassportFlagCreateManyAndReturnArgs} args - Arguments to create many PassportFlags.
     * @example
     * // Create many PassportFlags
     * const passportFlag = await prisma.passportFlag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PassportFlags and only return the `id`
     * const passportFlagWithIdOnly = await prisma.passportFlag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PassportFlagCreateManyAndReturnArgs>(args?: SelectSubset<T, PassportFlagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PassportFlag.
     * @param {PassportFlagDeleteArgs} args - Arguments to delete one PassportFlag.
     * @example
     * // Delete one PassportFlag
     * const PassportFlag = await prisma.passportFlag.delete({
     *   where: {
     *     // ... filter to delete one PassportFlag
     *   }
     * })
     * 
     */
    delete<T extends PassportFlagDeleteArgs>(args: SelectSubset<T, PassportFlagDeleteArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PassportFlag.
     * @param {PassportFlagUpdateArgs} args - Arguments to update one PassportFlag.
     * @example
     * // Update one PassportFlag
     * const passportFlag = await prisma.passportFlag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PassportFlagUpdateArgs>(args: SelectSubset<T, PassportFlagUpdateArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PassportFlags.
     * @param {PassportFlagDeleteManyArgs} args - Arguments to filter PassportFlags to delete.
     * @example
     * // Delete a few PassportFlags
     * const { count } = await prisma.passportFlag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PassportFlagDeleteManyArgs>(args?: SelectSubset<T, PassportFlagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PassportFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PassportFlags
     * const passportFlag = await prisma.passportFlag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PassportFlagUpdateManyArgs>(args: SelectSubset<T, PassportFlagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PassportFlags and returns the data updated in the database.
     * @param {PassportFlagUpdateManyAndReturnArgs} args - Arguments to update many PassportFlags.
     * @example
     * // Update many PassportFlags
     * const passportFlag = await prisma.passportFlag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PassportFlags and only return the `id`
     * const passportFlagWithIdOnly = await prisma.passportFlag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PassportFlagUpdateManyAndReturnArgs>(args: SelectSubset<T, PassportFlagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PassportFlag.
     * @param {PassportFlagUpsertArgs} args - Arguments to update or create a PassportFlag.
     * @example
     * // Update or create a PassportFlag
     * const passportFlag = await prisma.passportFlag.upsert({
     *   create: {
     *     // ... data to create a PassportFlag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PassportFlag we want to update
     *   }
     * })
     */
    upsert<T extends PassportFlagUpsertArgs>(args: SelectSubset<T, PassportFlagUpsertArgs<ExtArgs>>): Prisma__PassportFlagClient<$Result.GetResult<Prisma.$PassportFlagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PassportFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagCountArgs} args - Arguments to filter PassportFlags to count.
     * @example
     * // Count the number of PassportFlags
     * const count = await prisma.passportFlag.count({
     *   where: {
     *     // ... the filter for the PassportFlags we want to count
     *   }
     * })
    **/
    count<T extends PassportFlagCountArgs>(
      args?: Subset<T, PassportFlagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PassportFlagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PassportFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PassportFlagAggregateArgs>(args: Subset<T, PassportFlagAggregateArgs>): Prisma.PrismaPromise<GetPassportFlagAggregateType<T>>

    /**
     * Group by PassportFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassportFlagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PassportFlagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PassportFlagGroupByArgs['orderBy'] }
        : { orderBy?: PassportFlagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PassportFlagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPassportFlagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PassportFlag model
   */
  readonly fields: PassportFlagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PassportFlag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PassportFlagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PassportFlag model
   */
  interface PassportFlagFieldRefs {
    readonly id: FieldRef<"PassportFlag", 'String'>
    readonly userId: FieldRef<"PassportFlag", 'String'>
    readonly flagCode: FieldRef<"PassportFlag", 'String'>
    readonly createdAt: FieldRef<"PassportFlag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PassportFlag findUnique
   */
  export type PassportFlagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter, which PassportFlag to fetch.
     */
    where: PassportFlagWhereUniqueInput
  }

  /**
   * PassportFlag findUniqueOrThrow
   */
  export type PassportFlagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter, which PassportFlag to fetch.
     */
    where: PassportFlagWhereUniqueInput
  }

  /**
   * PassportFlag findFirst
   */
  export type PassportFlagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter, which PassportFlag to fetch.
     */
    where?: PassportFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PassportFlags to fetch.
     */
    orderBy?: PassportFlagOrderByWithRelationInput | PassportFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PassportFlags.
     */
    cursor?: PassportFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PassportFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PassportFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PassportFlags.
     */
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[]
  }

  /**
   * PassportFlag findFirstOrThrow
   */
  export type PassportFlagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter, which PassportFlag to fetch.
     */
    where?: PassportFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PassportFlags to fetch.
     */
    orderBy?: PassportFlagOrderByWithRelationInput | PassportFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PassportFlags.
     */
    cursor?: PassportFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PassportFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PassportFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PassportFlags.
     */
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[]
  }

  /**
   * PassportFlag findMany
   */
  export type PassportFlagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter, which PassportFlags to fetch.
     */
    where?: PassportFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PassportFlags to fetch.
     */
    orderBy?: PassportFlagOrderByWithRelationInput | PassportFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PassportFlags.
     */
    cursor?: PassportFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PassportFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PassportFlags.
     */
    skip?: number
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[]
  }

  /**
   * PassportFlag create
   */
  export type PassportFlagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * The data needed to create a PassportFlag.
     */
    data: XOR<PassportFlagCreateInput, PassportFlagUncheckedCreateInput>
  }

  /**
   * PassportFlag createMany
   */
  export type PassportFlagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PassportFlags.
     */
    data: PassportFlagCreateManyInput | PassportFlagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PassportFlag createManyAndReturn
   */
  export type PassportFlagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * The data used to create many PassportFlags.
     */
    data: PassportFlagCreateManyInput | PassportFlagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PassportFlag update
   */
  export type PassportFlagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * The data needed to update a PassportFlag.
     */
    data: XOR<PassportFlagUpdateInput, PassportFlagUncheckedUpdateInput>
    /**
     * Choose, which PassportFlag to update.
     */
    where: PassportFlagWhereUniqueInput
  }

  /**
   * PassportFlag updateMany
   */
  export type PassportFlagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PassportFlags.
     */
    data: XOR<PassportFlagUpdateManyMutationInput, PassportFlagUncheckedUpdateManyInput>
    /**
     * Filter which PassportFlags to update
     */
    where?: PassportFlagWhereInput
    /**
     * Limit how many PassportFlags to update.
     */
    limit?: number
  }

  /**
   * PassportFlag updateManyAndReturn
   */
  export type PassportFlagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * The data used to update PassportFlags.
     */
    data: XOR<PassportFlagUpdateManyMutationInput, PassportFlagUncheckedUpdateManyInput>
    /**
     * Filter which PassportFlags to update
     */
    where?: PassportFlagWhereInput
    /**
     * Limit how many PassportFlags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PassportFlag upsert
   */
  export type PassportFlagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * The filter to search for the PassportFlag to update in case it exists.
     */
    where: PassportFlagWhereUniqueInput
    /**
     * In case the PassportFlag found by the `where` argument doesn't exist, create a new PassportFlag with this data.
     */
    create: XOR<PassportFlagCreateInput, PassportFlagUncheckedCreateInput>
    /**
     * In case the PassportFlag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PassportFlagUpdateInput, PassportFlagUncheckedUpdateInput>
  }

  /**
   * PassportFlag delete
   */
  export type PassportFlagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
    /**
     * Filter which PassportFlag to delete.
     */
    where: PassportFlagWhereUniqueInput
  }

  /**
   * PassportFlag deleteMany
   */
  export type PassportFlagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PassportFlags to delete
     */
    where?: PassportFlagWhereInput
    /**
     * Limit how many PassportFlags to delete.
     */
    limit?: number
  }

  /**
   * PassportFlag without action
   */
  export type PassportFlagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassportFlag
     */
    select?: PassportFlagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PassportFlag
     */
    omit?: PassportFlagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassportFlagInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const accountWithUserIdOnly = await prisma.account.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `userId`
     * const accountWithUserIdOnly = await prisma.account.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `userId`
     * const accountWithUserIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sessionToken" | "userId" | "expires" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `sessionToken`
     * const sessionWithSessionTokenOnly = await prisma.session.findMany({ select: { sessionToken: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `sessionToken`
     * const sessionWithSessionTokenOnly = await prisma.session.createManyAndReturn({
     *   select: { sessionToken: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `sessionToken`
     * const sessionWithSessionTokenOnly = await prisma.session.updateManyAndReturn({
     *   select: { sessionToken: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model Authenticator
   */

  export type AggregateAuthenticator = {
    _count: AuthenticatorCountAggregateOutputType | null
    _avg: AuthenticatorAvgAggregateOutputType | null
    _sum: AuthenticatorSumAggregateOutputType | null
    _min: AuthenticatorMinAggregateOutputType | null
    _max: AuthenticatorMaxAggregateOutputType | null
  }

  export type AuthenticatorAvgAggregateOutputType = {
    counter: number | null
  }

  export type AuthenticatorSumAggregateOutputType = {
    counter: number | null
  }

  export type AuthenticatorMinAggregateOutputType = {
    credentialID: string | null
    userId: string | null
    providerAccountId: string | null
    credentialPublicKey: string | null
    counter: number | null
    credentialDeviceType: string | null
    credentialBackedUp: boolean | null
    transports: string | null
  }

  export type AuthenticatorMaxAggregateOutputType = {
    credentialID: string | null
    userId: string | null
    providerAccountId: string | null
    credentialPublicKey: string | null
    counter: number | null
    credentialDeviceType: string | null
    credentialBackedUp: boolean | null
    transports: string | null
  }

  export type AuthenticatorCountAggregateOutputType = {
    credentialID: number
    userId: number
    providerAccountId: number
    credentialPublicKey: number
    counter: number
    credentialDeviceType: number
    credentialBackedUp: number
    transports: number
    _all: number
  }


  export type AuthenticatorAvgAggregateInputType = {
    counter?: true
  }

  export type AuthenticatorSumAggregateInputType = {
    counter?: true
  }

  export type AuthenticatorMinAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
  }

  export type AuthenticatorMaxAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
  }

  export type AuthenticatorCountAggregateInputType = {
    credentialID?: true
    userId?: true
    providerAccountId?: true
    credentialPublicKey?: true
    counter?: true
    credentialDeviceType?: true
    credentialBackedUp?: true
    transports?: true
    _all?: true
  }

  export type AuthenticatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authenticator to aggregate.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Authenticators
    **/
    _count?: true | AuthenticatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthenticatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthenticatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthenticatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthenticatorMaxAggregateInputType
  }

  export type GetAuthenticatorAggregateType<T extends AuthenticatorAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthenticator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthenticator[P]>
      : GetScalarType<T[P], AggregateAuthenticator[P]>
  }




  export type AuthenticatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthenticatorWhereInput
    orderBy?: AuthenticatorOrderByWithAggregationInput | AuthenticatorOrderByWithAggregationInput[]
    by: AuthenticatorScalarFieldEnum[] | AuthenticatorScalarFieldEnum
    having?: AuthenticatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthenticatorCountAggregateInputType | true
    _avg?: AuthenticatorAvgAggregateInputType
    _sum?: AuthenticatorSumAggregateInputType
    _min?: AuthenticatorMinAggregateInputType
    _max?: AuthenticatorMaxAggregateInputType
  }

  export type AuthenticatorGroupByOutputType = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports: string | null
    _count: AuthenticatorCountAggregateOutputType | null
    _avg: AuthenticatorAvgAggregateOutputType | null
    _sum: AuthenticatorSumAggregateOutputType | null
    _min: AuthenticatorMinAggregateOutputType | null
    _max: AuthenticatorMaxAggregateOutputType | null
  }

  type GetAuthenticatorGroupByPayload<T extends AuthenticatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthenticatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthenticatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>
            : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>
        }
      >
    >


  export type AuthenticatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticator"]>

  export type AuthenticatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticator"]>

  export type AuthenticatorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authenticator"]>

  export type AuthenticatorSelectScalar = {
    credentialID?: boolean
    userId?: boolean
    providerAccountId?: boolean
    credentialPublicKey?: boolean
    counter?: boolean
    credentialDeviceType?: boolean
    credentialBackedUp?: boolean
    transports?: boolean
  }

  export type AuthenticatorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"credentialID" | "userId" | "providerAccountId" | "credentialPublicKey" | "counter" | "credentialDeviceType" | "credentialBackedUp" | "transports", ExtArgs["result"]["authenticator"]>
  export type AuthenticatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthenticatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthenticatorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuthenticatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Authenticator"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      credentialID: string
      userId: string
      providerAccountId: string
      credentialPublicKey: string
      counter: number
      credentialDeviceType: string
      credentialBackedUp: boolean
      transports: string | null
    }, ExtArgs["result"]["authenticator"]>
    composites: {}
  }

  type AuthenticatorGetPayload<S extends boolean | null | undefined | AuthenticatorDefaultArgs> = $Result.GetResult<Prisma.$AuthenticatorPayload, S>

  type AuthenticatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthenticatorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthenticatorCountAggregateInputType | true
    }

  export interface AuthenticatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Authenticator'], meta: { name: 'Authenticator' } }
    /**
     * Find zero or one Authenticator that matches the filter.
     * @param {AuthenticatorFindUniqueArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthenticatorFindUniqueArgs>(args: SelectSubset<T, AuthenticatorFindUniqueArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Authenticator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthenticatorFindUniqueOrThrowArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthenticatorFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthenticatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Authenticator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindFirstArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthenticatorFindFirstArgs>(args?: SelectSubset<T, AuthenticatorFindFirstArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Authenticator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindFirstOrThrowArgs} args - Arguments to find a Authenticator
     * @example
     * // Get one Authenticator
     * const authenticator = await prisma.authenticator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthenticatorFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthenticatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Authenticators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Authenticators
     * const authenticators = await prisma.authenticator.findMany()
     * 
     * // Get first 10 Authenticators
     * const authenticators = await prisma.authenticator.findMany({ take: 10 })
     * 
     * // Only select the `credentialID`
     * const authenticatorWithCredentialIDOnly = await prisma.authenticator.findMany({ select: { credentialID: true } })
     * 
     */
    findMany<T extends AuthenticatorFindManyArgs>(args?: SelectSubset<T, AuthenticatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Authenticator.
     * @param {AuthenticatorCreateArgs} args - Arguments to create a Authenticator.
     * @example
     * // Create one Authenticator
     * const Authenticator = await prisma.authenticator.create({
     *   data: {
     *     // ... data to create a Authenticator
     *   }
     * })
     * 
     */
    create<T extends AuthenticatorCreateArgs>(args: SelectSubset<T, AuthenticatorCreateArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Authenticators.
     * @param {AuthenticatorCreateManyArgs} args - Arguments to create many Authenticators.
     * @example
     * // Create many Authenticators
     * const authenticator = await prisma.authenticator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthenticatorCreateManyArgs>(args?: SelectSubset<T, AuthenticatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Authenticators and returns the data saved in the database.
     * @param {AuthenticatorCreateManyAndReturnArgs} args - Arguments to create many Authenticators.
     * @example
     * // Create many Authenticators
     * const authenticator = await prisma.authenticator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Authenticators and only return the `credentialID`
     * const authenticatorWithCredentialIDOnly = await prisma.authenticator.createManyAndReturn({
     *   select: { credentialID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthenticatorCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthenticatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Authenticator.
     * @param {AuthenticatorDeleteArgs} args - Arguments to delete one Authenticator.
     * @example
     * // Delete one Authenticator
     * const Authenticator = await prisma.authenticator.delete({
     *   where: {
     *     // ... filter to delete one Authenticator
     *   }
     * })
     * 
     */
    delete<T extends AuthenticatorDeleteArgs>(args: SelectSubset<T, AuthenticatorDeleteArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Authenticator.
     * @param {AuthenticatorUpdateArgs} args - Arguments to update one Authenticator.
     * @example
     * // Update one Authenticator
     * const authenticator = await prisma.authenticator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthenticatorUpdateArgs>(args: SelectSubset<T, AuthenticatorUpdateArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Authenticators.
     * @param {AuthenticatorDeleteManyArgs} args - Arguments to filter Authenticators to delete.
     * @example
     * // Delete a few Authenticators
     * const { count } = await prisma.authenticator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthenticatorDeleteManyArgs>(args?: SelectSubset<T, AuthenticatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authenticators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Authenticators
     * const authenticator = await prisma.authenticator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthenticatorUpdateManyArgs>(args: SelectSubset<T, AuthenticatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Authenticators and returns the data updated in the database.
     * @param {AuthenticatorUpdateManyAndReturnArgs} args - Arguments to update many Authenticators.
     * @example
     * // Update many Authenticators
     * const authenticator = await prisma.authenticator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Authenticators and only return the `credentialID`
     * const authenticatorWithCredentialIDOnly = await prisma.authenticator.updateManyAndReturn({
     *   select: { credentialID: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthenticatorUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthenticatorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Authenticator.
     * @param {AuthenticatorUpsertArgs} args - Arguments to update or create a Authenticator.
     * @example
     * // Update or create a Authenticator
     * const authenticator = await prisma.authenticator.upsert({
     *   create: {
     *     // ... data to create a Authenticator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Authenticator we want to update
     *   }
     * })
     */
    upsert<T extends AuthenticatorUpsertArgs>(args: SelectSubset<T, AuthenticatorUpsertArgs<ExtArgs>>): Prisma__AuthenticatorClient<$Result.GetResult<Prisma.$AuthenticatorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Authenticators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorCountArgs} args - Arguments to filter Authenticators to count.
     * @example
     * // Count the number of Authenticators
     * const count = await prisma.authenticator.count({
     *   where: {
     *     // ... the filter for the Authenticators we want to count
     *   }
     * })
    **/
    count<T extends AuthenticatorCountArgs>(
      args?: Subset<T, AuthenticatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthenticatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Authenticator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthenticatorAggregateArgs>(args: Subset<T, AuthenticatorAggregateArgs>): Prisma.PrismaPromise<GetAuthenticatorAggregateType<T>>

    /**
     * Group by Authenticator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthenticatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthenticatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthenticatorGroupByArgs['orderBy'] }
        : { orderBy?: AuthenticatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthenticatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthenticatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Authenticator model
   */
  readonly fields: AuthenticatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Authenticator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthenticatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Authenticator model
   */
  interface AuthenticatorFieldRefs {
    readonly credentialID: FieldRef<"Authenticator", 'String'>
    readonly userId: FieldRef<"Authenticator", 'String'>
    readonly providerAccountId: FieldRef<"Authenticator", 'String'>
    readonly credentialPublicKey: FieldRef<"Authenticator", 'String'>
    readonly counter: FieldRef<"Authenticator", 'Int'>
    readonly credentialDeviceType: FieldRef<"Authenticator", 'String'>
    readonly credentialBackedUp: FieldRef<"Authenticator", 'Boolean'>
    readonly transports: FieldRef<"Authenticator", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Authenticator findUnique
   */
  export type AuthenticatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator findUniqueOrThrow
   */
  export type AuthenticatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator findFirst
   */
  export type AuthenticatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authenticators.
     */
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator findFirstOrThrow
   */
  export type AuthenticatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticator to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Authenticators.
     */
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator findMany
   */
  export type AuthenticatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter, which Authenticators to fetch.
     */
    where?: AuthenticatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Authenticators to fetch.
     */
    orderBy?: AuthenticatorOrderByWithRelationInput | AuthenticatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Authenticators.
     */
    cursor?: AuthenticatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Authenticators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Authenticators.
     */
    skip?: number
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[]
  }

  /**
   * Authenticator create
   */
  export type AuthenticatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The data needed to create a Authenticator.
     */
    data: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>
  }

  /**
   * Authenticator createMany
   */
  export type AuthenticatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Authenticators.
     */
    data: AuthenticatorCreateManyInput | AuthenticatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Authenticator createManyAndReturn
   */
  export type AuthenticatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * The data used to create many Authenticators.
     */
    data: AuthenticatorCreateManyInput | AuthenticatorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Authenticator update
   */
  export type AuthenticatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The data needed to update a Authenticator.
     */
    data: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>
    /**
     * Choose, which Authenticator to update.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator updateMany
   */
  export type AuthenticatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Authenticators.
     */
    data: XOR<AuthenticatorUpdateManyMutationInput, AuthenticatorUncheckedUpdateManyInput>
    /**
     * Filter which Authenticators to update
     */
    where?: AuthenticatorWhereInput
    /**
     * Limit how many Authenticators to update.
     */
    limit?: number
  }

  /**
   * Authenticator updateManyAndReturn
   */
  export type AuthenticatorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * The data used to update Authenticators.
     */
    data: XOR<AuthenticatorUpdateManyMutationInput, AuthenticatorUncheckedUpdateManyInput>
    /**
     * Filter which Authenticators to update
     */
    where?: AuthenticatorWhereInput
    /**
     * Limit how many Authenticators to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Authenticator upsert
   */
  export type AuthenticatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * The filter to search for the Authenticator to update in case it exists.
     */
    where: AuthenticatorWhereUniqueInput
    /**
     * In case the Authenticator found by the `where` argument doesn't exist, create a new Authenticator with this data.
     */
    create: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>
    /**
     * In case the Authenticator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>
  }

  /**
   * Authenticator delete
   */
  export type AuthenticatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
    /**
     * Filter which Authenticator to delete.
     */
    where: AuthenticatorWhereUniqueInput
  }

  /**
   * Authenticator deleteMany
   */
  export type AuthenticatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Authenticators to delete
     */
    where?: AuthenticatorWhereInput
    /**
     * Limit how many Authenticators to delete.
     */
    limit?: number
  }

  /**
   * Authenticator without action
   */
  export type AuthenticatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Authenticator
     */
    select?: AuthenticatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Authenticator
     */
    omit?: AuthenticatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthenticatorInclude<ExtArgs> | null
  }


  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  export type GameAvgAggregateOutputType = {
    whitePregameRating: number | null
    blackPregameRating: number | null
    whiteRatingDelta: number | null
    blackRatingDelta: number | null
    moveCount: number | null
  }

  export type GameSumAggregateOutputType = {
    whitePregameRating: number | null
    blackPregameRating: number | null
    whiteRatingDelta: number | null
    blackRatingDelta: number | null
    moveCount: number | null
  }

  export type GameMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    whiteUserId: string | null
    blackUserId: string | null
    variant: string | null
    gameType: string | null
    result: string | null
    resultReason: string | null
    startingFen: string | null
    whitePregameRating: number | null
    blackPregameRating: number | null
    whiteRatingDelta: number | null
    blackRatingDelta: number | null
    moveCount: number | null
    rated: boolean | null
    playedAt: Date | null
    createdAt: Date | null
  }

  export type GameMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    whiteUserId: string | null
    blackUserId: string | null
    variant: string | null
    gameType: string | null
    result: string | null
    resultReason: string | null
    startingFen: string | null
    whitePregameRating: number | null
    blackPregameRating: number | null
    whiteRatingDelta: number | null
    blackRatingDelta: number | null
    moveCount: number | null
    rated: boolean | null
    playedAt: Date | null
    createdAt: Date | null
  }

  export type GameCountAggregateOutputType = {
    id: number
    roomId: number
    whiteUserId: number
    blackUserId: number
    variant: number
    gameType: number
    result: number
    resultReason: number
    moves: number
    startingFen: number
    timeControl: number
    whitePregameRating: number
    blackPregameRating: number
    whiteRatingDelta: number
    blackRatingDelta: number
    moveCount: number
    rated: number
    playedAt: number
    createdAt: number
    _all: number
  }


  export type GameAvgAggregateInputType = {
    whitePregameRating?: true
    blackPregameRating?: true
    whiteRatingDelta?: true
    blackRatingDelta?: true
    moveCount?: true
  }

  export type GameSumAggregateInputType = {
    whitePregameRating?: true
    blackPregameRating?: true
    whiteRatingDelta?: true
    blackRatingDelta?: true
    moveCount?: true
  }

  export type GameMinAggregateInputType = {
    id?: true
    roomId?: true
    whiteUserId?: true
    blackUserId?: true
    variant?: true
    gameType?: true
    result?: true
    resultReason?: true
    startingFen?: true
    whitePregameRating?: true
    blackPregameRating?: true
    whiteRatingDelta?: true
    blackRatingDelta?: true
    moveCount?: true
    rated?: true
    playedAt?: true
    createdAt?: true
  }

  export type GameMaxAggregateInputType = {
    id?: true
    roomId?: true
    whiteUserId?: true
    blackUserId?: true
    variant?: true
    gameType?: true
    result?: true
    resultReason?: true
    startingFen?: true
    whitePregameRating?: true
    blackPregameRating?: true
    whiteRatingDelta?: true
    blackRatingDelta?: true
    moveCount?: true
    rated?: true
    playedAt?: true
    createdAt?: true
  }

  export type GameCountAggregateInputType = {
    id?: true
    roomId?: true
    whiteUserId?: true
    blackUserId?: true
    variant?: true
    gameType?: true
    result?: true
    resultReason?: true
    moves?: true
    startingFen?: true
    timeControl?: true
    whitePregameRating?: true
    blackPregameRating?: true
    whiteRatingDelta?: true
    blackRatingDelta?: true
    moveCount?: true
    rated?: true
    playedAt?: true
    createdAt?: true
    _all?: true
  }

  export type GameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Games
    **/
    _count?: true | GameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMaxAggregateInputType
  }

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
        [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>
  }




  export type GameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
    orderBy?: GameOrderByWithAggregationInput | GameOrderByWithAggregationInput[]
    by: GameScalarFieldEnum[] | GameScalarFieldEnum
    having?: GameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameCountAggregateInputType | true
    _avg?: GameAvgAggregateInputType
    _sum?: GameSumAggregateInputType
    _min?: GameMinAggregateInputType
    _max?: GameMaxAggregateInputType
  }

  export type GameGroupByOutputType = {
    id: string
    roomId: string | null
    whiteUserId: string | null
    blackUserId: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves: string[]
    startingFen: string
    timeControl: JsonValue
    whitePregameRating: number | null
    blackPregameRating: number | null
    whiteRatingDelta: number | null
    blackRatingDelta: number | null
    moveCount: number
    rated: boolean
    playedAt: Date | null
    createdAt: Date
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameGroupByOutputType[P]>
            : GetScalarType<T[P], GameGroupByOutputType[P]>
        }
      >
    >


  export type GameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    whiteUserId?: boolean
    blackUserId?: boolean
    variant?: boolean
    gameType?: boolean
    result?: boolean
    resultReason?: boolean
    moves?: boolean
    startingFen?: boolean
    timeControl?: boolean
    whitePregameRating?: boolean
    blackPregameRating?: boolean
    whiteRatingDelta?: boolean
    blackRatingDelta?: boolean
    moveCount?: boolean
    rated?: boolean
    playedAt?: boolean
    createdAt?: boolean
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
    analysis?: boolean | Game$analysisArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    whiteUserId?: boolean
    blackUserId?: boolean
    variant?: boolean
    gameType?: boolean
    result?: boolean
    resultReason?: boolean
    moves?: boolean
    startingFen?: boolean
    timeControl?: boolean
    whitePregameRating?: boolean
    blackPregameRating?: boolean
    whiteRatingDelta?: boolean
    blackRatingDelta?: boolean
    moveCount?: boolean
    rated?: boolean
    playedAt?: boolean
    createdAt?: boolean
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    whiteUserId?: boolean
    blackUserId?: boolean
    variant?: boolean
    gameType?: boolean
    result?: boolean
    resultReason?: boolean
    moves?: boolean
    startingFen?: boolean
    timeControl?: boolean
    whitePregameRating?: boolean
    blackPregameRating?: boolean
    whiteRatingDelta?: boolean
    blackRatingDelta?: boolean
    moveCount?: boolean
    rated?: boolean
    playedAt?: boolean
    createdAt?: boolean
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectScalar = {
    id?: boolean
    roomId?: boolean
    whiteUserId?: boolean
    blackUserId?: boolean
    variant?: boolean
    gameType?: boolean
    result?: boolean
    resultReason?: boolean
    moves?: boolean
    startingFen?: boolean
    timeControl?: boolean
    whitePregameRating?: boolean
    blackPregameRating?: boolean
    whiteRatingDelta?: boolean
    blackRatingDelta?: boolean
    moveCount?: boolean
    rated?: boolean
    playedAt?: boolean
    createdAt?: boolean
  }

  export type GameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "whiteUserId" | "blackUserId" | "variant" | "gameType" | "result" | "resultReason" | "moves" | "startingFen" | "timeControl" | "whitePregameRating" | "blackPregameRating" | "whiteRatingDelta" | "blackRatingDelta" | "moveCount" | "rated" | "playedAt" | "createdAt", ExtArgs["result"]["game"]>
  export type GameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
    analysis?: boolean | Game$analysisArgs<ExtArgs>
  }
  export type GameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
  }
  export type GameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    white?: boolean | Game$whiteArgs<ExtArgs>
    black?: boolean | Game$blackArgs<ExtArgs>
  }

  export type $GamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Game"
    objects: {
      white: Prisma.$UserPayload<ExtArgs> | null
      black: Prisma.$UserPayload<ExtArgs> | null
      analysis: Prisma.$GameAnalysisPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string | null
      whiteUserId: string | null
      blackUserId: string | null
      variant: string
      gameType: string
      result: string
      resultReason: string
      moves: string[]
      startingFen: string
      timeControl: Prisma.JsonValue
      whitePregameRating: number | null
      blackPregameRating: number | null
      whiteRatingDelta: number | null
      blackRatingDelta: number | null
      moveCount: number
      rated: boolean
      playedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["game"]>
    composites: {}
  }

  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> = $Result.GetResult<Prisma.$GamePayload, S>

  type GameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameCountAggregateInputType | true
    }

  export interface GameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Game'], meta: { name: 'Game' } }
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameFindUniqueArgs>(args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Game that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameFindFirstArgs>(args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameFindManyArgs>(args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     * 
     */
    create<T extends GameCreateArgs>(args: SelectSubset<T, GameCreateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Games.
     * @param {GameCreateManyArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameCreateManyArgs>(args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Games and returns the data saved in the database.
     * @param {GameCreateManyAndReturnArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     * 
     */
    delete<T extends GameDeleteArgs>(args: SelectSubset<T, GameDeleteArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameUpdateArgs>(args: SelectSubset<T, GameUpdateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDeleteManyArgs>(args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameUpdateManyArgs>(args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games and returns the data updated in the database.
     * @param {GameUpdateManyAndReturnArgs} args - Arguments to update many Games.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(args: SelectSubset<T, GameUpsertArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAggregateArgs>(args: Subset<T, GameAggregateArgs>): Prisma.PrismaPromise<GetGameAggregateType<T>>

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs['orderBy'] }
        : { orderBy?: GameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Game model
   */
  readonly fields: GameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    white<T extends Game$whiteArgs<ExtArgs> = {}>(args?: Subset<T, Game$whiteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    black<T extends Game$blackArgs<ExtArgs> = {}>(args?: Subset<T, Game$blackArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    analysis<T extends Game$analysisArgs<ExtArgs> = {}>(args?: Subset<T, Game$analysisArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Game model
   */
  interface GameFieldRefs {
    readonly id: FieldRef<"Game", 'String'>
    readonly roomId: FieldRef<"Game", 'String'>
    readonly whiteUserId: FieldRef<"Game", 'String'>
    readonly blackUserId: FieldRef<"Game", 'String'>
    readonly variant: FieldRef<"Game", 'String'>
    readonly gameType: FieldRef<"Game", 'String'>
    readonly result: FieldRef<"Game", 'String'>
    readonly resultReason: FieldRef<"Game", 'String'>
    readonly moves: FieldRef<"Game", 'String[]'>
    readonly startingFen: FieldRef<"Game", 'String'>
    readonly timeControl: FieldRef<"Game", 'Json'>
    readonly whitePregameRating: FieldRef<"Game", 'Int'>
    readonly blackPregameRating: FieldRef<"Game", 'Int'>
    readonly whiteRatingDelta: FieldRef<"Game", 'Int'>
    readonly blackRatingDelta: FieldRef<"Game", 'Int'>
    readonly moveCount: FieldRef<"Game", 'Int'>
    readonly rated: FieldRef<"Game", 'Boolean'>
    readonly playedAt: FieldRef<"Game", 'DateTime'>
    readonly createdAt: FieldRef<"Game", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Game findUnique
   */
  export type GameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findFirst
   */
  export type GameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findMany
   */
  export type GameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game create
   */
  export type GameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>
  }

  /**
   * Game createMany
   */
  export type GameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Game createManyAndReturn
   */
  export type GameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game update
   */
  export type GameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
  }

  /**
   * Game updateManyAndReturn
   */
  export type GameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game upsert
   */
  export type GameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>
  }

  /**
   * Game delete
   */
  export type GameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to delete.
     */
    limit?: number
  }

  /**
   * Game.white
   */
  export type Game$whiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Game.black
   */
  export type Game$blackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Game.analysis
   */
  export type Game$analysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    where?: GameAnalysisWhereInput
  }

  /**
   * Game without action
   */
  export type GameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
  }


  /**
   * Model GameAnalysis
   */

  export type AggregateGameAnalysis = {
    _count: GameAnalysisCountAggregateOutputType | null
    _min: GameAnalysisMinAggregateOutputType | null
    _max: GameAnalysisMaxAggregateOutputType | null
  }

  export type GameAnalysisMinAggregateOutputType = {
    id: string | null
    gameId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type GameAnalysisMaxAggregateOutputType = {
    id: string | null
    gameId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type GameAnalysisCountAggregateOutputType = {
    id: number
    gameId: number
    userId: number
    results: number
    createdAt: number
    _all: number
  }


  export type GameAnalysisMinAggregateInputType = {
    id?: true
    gameId?: true
    userId?: true
    createdAt?: true
  }

  export type GameAnalysisMaxAggregateInputType = {
    id?: true
    gameId?: true
    userId?: true
    createdAt?: true
  }

  export type GameAnalysisCountAggregateInputType = {
    id?: true
    gameId?: true
    userId?: true
    results?: true
    createdAt?: true
    _all?: true
  }

  export type GameAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameAnalysis to aggregate.
     */
    where?: GameAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameAnalyses to fetch.
     */
    orderBy?: GameAnalysisOrderByWithRelationInput | GameAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameAnalyses
    **/
    _count?: true | GameAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameAnalysisMaxAggregateInputType
  }

  export type GetGameAnalysisAggregateType<T extends GameAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateGameAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameAnalysis[P]>
      : GetScalarType<T[P], AggregateGameAnalysis[P]>
  }




  export type GameAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameAnalysisWhereInput
    orderBy?: GameAnalysisOrderByWithAggregationInput | GameAnalysisOrderByWithAggregationInput[]
    by: GameAnalysisScalarFieldEnum[] | GameAnalysisScalarFieldEnum
    having?: GameAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameAnalysisCountAggregateInputType | true
    _min?: GameAnalysisMinAggregateInputType
    _max?: GameAnalysisMaxAggregateInputType
  }

  export type GameAnalysisGroupByOutputType = {
    id: string
    gameId: string
    userId: string
    results: JsonValue
    createdAt: Date
    _count: GameAnalysisCountAggregateOutputType | null
    _min: GameAnalysisMinAggregateOutputType | null
    _max: GameAnalysisMaxAggregateOutputType | null
  }

  type GetGameAnalysisGroupByPayload<T extends GameAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], GameAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type GameAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    userId?: boolean
    results?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameAnalysis"]>

  export type GameAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    userId?: boolean
    results?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameAnalysis"]>

  export type GameAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    userId?: boolean
    results?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameAnalysis"]>

  export type GameAnalysisSelectScalar = {
    id?: boolean
    gameId?: boolean
    userId?: boolean
    results?: boolean
    createdAt?: boolean
  }

  export type GameAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gameId" | "userId" | "results" | "createdAt", ExtArgs["result"]["gameAnalysis"]>
  export type GameAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GameAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GameAnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GameAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameAnalysis"
    objects: {
      game: Prisma.$GamePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gameId: string
      userId: string
      results: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["gameAnalysis"]>
    composites: {}
  }

  type GameAnalysisGetPayload<S extends boolean | null | undefined | GameAnalysisDefaultArgs> = $Result.GetResult<Prisma.$GameAnalysisPayload, S>

  type GameAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameAnalysisCountAggregateInputType | true
    }

  export interface GameAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameAnalysis'], meta: { name: 'GameAnalysis' } }
    /**
     * Find zero or one GameAnalysis that matches the filter.
     * @param {GameAnalysisFindUniqueArgs} args - Arguments to find a GameAnalysis
     * @example
     * // Get one GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameAnalysisFindUniqueArgs>(args: SelectSubset<T, GameAnalysisFindUniqueArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameAnalysisFindUniqueOrThrowArgs} args - Arguments to find a GameAnalysis
     * @example
     * // Get one GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, GameAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisFindFirstArgs} args - Arguments to find a GameAnalysis
     * @example
     * // Get one GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameAnalysisFindFirstArgs>(args?: SelectSubset<T, GameAnalysisFindFirstArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisFindFirstOrThrowArgs} args - Arguments to find a GameAnalysis
     * @example
     * // Get one GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, GameAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameAnalyses
     * const gameAnalyses = await prisma.gameAnalysis.findMany()
     * 
     * // Get first 10 GameAnalyses
     * const gameAnalyses = await prisma.gameAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameAnalysisWithIdOnly = await prisma.gameAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameAnalysisFindManyArgs>(args?: SelectSubset<T, GameAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameAnalysis.
     * @param {GameAnalysisCreateArgs} args - Arguments to create a GameAnalysis.
     * @example
     * // Create one GameAnalysis
     * const GameAnalysis = await prisma.gameAnalysis.create({
     *   data: {
     *     // ... data to create a GameAnalysis
     *   }
     * })
     * 
     */
    create<T extends GameAnalysisCreateArgs>(args: SelectSubset<T, GameAnalysisCreateArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameAnalyses.
     * @param {GameAnalysisCreateManyArgs} args - Arguments to create many GameAnalyses.
     * @example
     * // Create many GameAnalyses
     * const gameAnalysis = await prisma.gameAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameAnalysisCreateManyArgs>(args?: SelectSubset<T, GameAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameAnalyses and returns the data saved in the database.
     * @param {GameAnalysisCreateManyAndReturnArgs} args - Arguments to create many GameAnalyses.
     * @example
     * // Create many GameAnalyses
     * const gameAnalysis = await prisma.gameAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameAnalyses and only return the `id`
     * const gameAnalysisWithIdOnly = await prisma.gameAnalysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, GameAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameAnalysis.
     * @param {GameAnalysisDeleteArgs} args - Arguments to delete one GameAnalysis.
     * @example
     * // Delete one GameAnalysis
     * const GameAnalysis = await prisma.gameAnalysis.delete({
     *   where: {
     *     // ... filter to delete one GameAnalysis
     *   }
     * })
     * 
     */
    delete<T extends GameAnalysisDeleteArgs>(args: SelectSubset<T, GameAnalysisDeleteArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameAnalysis.
     * @param {GameAnalysisUpdateArgs} args - Arguments to update one GameAnalysis.
     * @example
     * // Update one GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameAnalysisUpdateArgs>(args: SelectSubset<T, GameAnalysisUpdateArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameAnalyses.
     * @param {GameAnalysisDeleteManyArgs} args - Arguments to filter GameAnalyses to delete.
     * @example
     * // Delete a few GameAnalyses
     * const { count } = await prisma.gameAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameAnalysisDeleteManyArgs>(args?: SelectSubset<T, GameAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameAnalyses
     * const gameAnalysis = await prisma.gameAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameAnalysisUpdateManyArgs>(args: SelectSubset<T, GameAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameAnalyses and returns the data updated in the database.
     * @param {GameAnalysisUpdateManyAndReturnArgs} args - Arguments to update many GameAnalyses.
     * @example
     * // Update many GameAnalyses
     * const gameAnalysis = await prisma.gameAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameAnalyses and only return the `id`
     * const gameAnalysisWithIdOnly = await prisma.gameAnalysis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, GameAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameAnalysis.
     * @param {GameAnalysisUpsertArgs} args - Arguments to update or create a GameAnalysis.
     * @example
     * // Update or create a GameAnalysis
     * const gameAnalysis = await prisma.gameAnalysis.upsert({
     *   create: {
     *     // ... data to create a GameAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends GameAnalysisUpsertArgs>(args: SelectSubset<T, GameAnalysisUpsertArgs<ExtArgs>>): Prisma__GameAnalysisClient<$Result.GetResult<Prisma.$GameAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisCountArgs} args - Arguments to filter GameAnalyses to count.
     * @example
     * // Count the number of GameAnalyses
     * const count = await prisma.gameAnalysis.count({
     *   where: {
     *     // ... the filter for the GameAnalyses we want to count
     *   }
     * })
    **/
    count<T extends GameAnalysisCountArgs>(
      args?: Subset<T, GameAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAnalysisAggregateArgs>(args: Subset<T, GameAnalysisAggregateArgs>): Prisma.PrismaPromise<GetGameAnalysisAggregateType<T>>

    /**
     * Group by GameAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: GameAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameAnalysis model
   */
  readonly fields: GameAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameAnalysis model
   */
  interface GameAnalysisFieldRefs {
    readonly id: FieldRef<"GameAnalysis", 'String'>
    readonly gameId: FieldRef<"GameAnalysis", 'String'>
    readonly userId: FieldRef<"GameAnalysis", 'String'>
    readonly results: FieldRef<"GameAnalysis", 'Json'>
    readonly createdAt: FieldRef<"GameAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameAnalysis findUnique
   */
  export type GameAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which GameAnalysis to fetch.
     */
    where: GameAnalysisWhereUniqueInput
  }

  /**
   * GameAnalysis findUniqueOrThrow
   */
  export type GameAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which GameAnalysis to fetch.
     */
    where: GameAnalysisWhereUniqueInput
  }

  /**
   * GameAnalysis findFirst
   */
  export type GameAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which GameAnalysis to fetch.
     */
    where?: GameAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameAnalyses to fetch.
     */
    orderBy?: GameAnalysisOrderByWithRelationInput | GameAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameAnalyses.
     */
    cursor?: GameAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameAnalyses.
     */
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[]
  }

  /**
   * GameAnalysis findFirstOrThrow
   */
  export type GameAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which GameAnalysis to fetch.
     */
    where?: GameAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameAnalyses to fetch.
     */
    orderBy?: GameAnalysisOrderByWithRelationInput | GameAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameAnalyses.
     */
    cursor?: GameAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameAnalyses.
     */
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[]
  }

  /**
   * GameAnalysis findMany
   */
  export type GameAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which GameAnalyses to fetch.
     */
    where?: GameAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameAnalyses to fetch.
     */
    orderBy?: GameAnalysisOrderByWithRelationInput | GameAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameAnalyses.
     */
    cursor?: GameAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameAnalyses.
     */
    skip?: number
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[]
  }

  /**
   * GameAnalysis create
   */
  export type GameAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a GameAnalysis.
     */
    data: XOR<GameAnalysisCreateInput, GameAnalysisUncheckedCreateInput>
  }

  /**
   * GameAnalysis createMany
   */
  export type GameAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameAnalyses.
     */
    data: GameAnalysisCreateManyInput | GameAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameAnalysis createManyAndReturn
   */
  export type GameAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many GameAnalyses.
     */
    data: GameAnalysisCreateManyInput | GameAnalysisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameAnalysis update
   */
  export type GameAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a GameAnalysis.
     */
    data: XOR<GameAnalysisUpdateInput, GameAnalysisUncheckedUpdateInput>
    /**
     * Choose, which GameAnalysis to update.
     */
    where: GameAnalysisWhereUniqueInput
  }

  /**
   * GameAnalysis updateMany
   */
  export type GameAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameAnalyses.
     */
    data: XOR<GameAnalysisUpdateManyMutationInput, GameAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which GameAnalyses to update
     */
    where?: GameAnalysisWhereInput
    /**
     * Limit how many GameAnalyses to update.
     */
    limit?: number
  }

  /**
   * GameAnalysis updateManyAndReturn
   */
  export type GameAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update GameAnalyses.
     */
    data: XOR<GameAnalysisUpdateManyMutationInput, GameAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which GameAnalyses to update
     */
    where?: GameAnalysisWhereInput
    /**
     * Limit how many GameAnalyses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameAnalysis upsert
   */
  export type GameAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the GameAnalysis to update in case it exists.
     */
    where: GameAnalysisWhereUniqueInput
    /**
     * In case the GameAnalysis found by the `where` argument doesn't exist, create a new GameAnalysis with this data.
     */
    create: XOR<GameAnalysisCreateInput, GameAnalysisUncheckedCreateInput>
    /**
     * In case the GameAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameAnalysisUpdateInput, GameAnalysisUncheckedUpdateInput>
  }

  /**
   * GameAnalysis delete
   */
  export type GameAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
    /**
     * Filter which GameAnalysis to delete.
     */
    where: GameAnalysisWhereUniqueInput
  }

  /**
   * GameAnalysis deleteMany
   */
  export type GameAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameAnalyses to delete
     */
    where?: GameAnalysisWhereInput
    /**
     * Limit how many GameAnalyses to delete.
     */
    limit?: number
  }

  /**
   * GameAnalysis without action
   */
  export type GameAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameAnalysis
     */
    select?: GameAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameAnalysis
     */
    omit?: GameAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Rating
   */

  export type AggregateRating = {
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  export type RatingAvgAggregateOutputType = {
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
  }

  export type RatingSumAggregateOutputType = {
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
  }

  export type RatingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    variant: string | null
    category: string | null
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RatingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    variant: string | null
    category: string | null
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RatingCountAggregateOutputType = {
    id: number
    userId: number
    variant: number
    category: number
    rating: number
    rd: number
    sigma: number
    gameCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RatingAvgAggregateInputType = {
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
  }

  export type RatingSumAggregateInputType = {
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
  }

  export type RatingMinAggregateInputType = {
    id?: true
    userId?: true
    variant?: true
    category?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RatingMaxAggregateInputType = {
    id?: true
    userId?: true
    variant?: true
    category?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RatingCountAggregateInputType = {
    id?: true
    userId?: true
    variant?: true
    category?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rating to aggregate.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ratings
    **/
    _count?: true | RatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RatingMaxAggregateInputType
  }

  export type GetRatingAggregateType<T extends RatingAggregateArgs> = {
        [P in keyof T & keyof AggregateRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRating[P]>
      : GetScalarType<T[P], AggregateRating[P]>
  }




  export type RatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithAggregationInput | RatingOrderByWithAggregationInput[]
    by: RatingScalarFieldEnum[] | RatingScalarFieldEnum
    having?: RatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RatingCountAggregateInputType | true
    _avg?: RatingAvgAggregateInputType
    _sum?: RatingSumAggregateInputType
    _min?: RatingMinAggregateInputType
    _max?: RatingMaxAggregateInputType
  }

  export type RatingGroupByOutputType = {
    id: string
    userId: string
    variant: string
    category: string
    rating: number
    rd: number
    sigma: number
    gameCount: number
    createdAt: Date
    updatedAt: Date
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  type GetRatingGroupByPayload<T extends RatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RatingGroupByOutputType[P]>
            : GetScalarType<T[P], RatingGroupByOutputType[P]>
        }
      >
    >


  export type RatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    variant?: boolean
    category?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    variant?: boolean
    category?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    variant?: boolean
    category?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectScalar = {
    id?: boolean
    userId?: boolean
    variant?: boolean
    category?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "variant" | "category" | "rating" | "rd" | "sigma" | "gameCount" | "createdAt" | "updatedAt", ExtArgs["result"]["rating"]>
  export type RatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RatingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RatingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rating"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      variant: string
      category: string
      rating: number
      rd: number
      sigma: number
      gameCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rating"]>
    composites: {}
  }

  type RatingGetPayload<S extends boolean | null | undefined | RatingDefaultArgs> = $Result.GetResult<Prisma.$RatingPayload, S>

  type RatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RatingCountAggregateInputType | true
    }

  export interface RatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rating'], meta: { name: 'Rating' } }
    /**
     * Find zero or one Rating that matches the filter.
     * @param {RatingFindUniqueArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RatingFindUniqueArgs>(args: SelectSubset<T, RatingFindUniqueArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RatingFindUniqueOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RatingFindUniqueOrThrowArgs>(args: SelectSubset<T, RatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RatingFindFirstArgs>(args?: SelectSubset<T, RatingFindFirstArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RatingFindFirstOrThrowArgs>(args?: SelectSubset<T, RatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ratings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ratings
     * const ratings = await prisma.rating.findMany()
     * 
     * // Get first 10 Ratings
     * const ratings = await prisma.rating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ratingWithIdOnly = await prisma.rating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RatingFindManyArgs>(args?: SelectSubset<T, RatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rating.
     * @param {RatingCreateArgs} args - Arguments to create a Rating.
     * @example
     * // Create one Rating
     * const Rating = await prisma.rating.create({
     *   data: {
     *     // ... data to create a Rating
     *   }
     * })
     * 
     */
    create<T extends RatingCreateArgs>(args: SelectSubset<T, RatingCreateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ratings.
     * @param {RatingCreateManyArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RatingCreateManyArgs>(args?: SelectSubset<T, RatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ratings and returns the data saved in the database.
     * @param {RatingCreateManyAndReturnArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ratings and only return the `id`
     * const ratingWithIdOnly = await prisma.rating.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RatingCreateManyAndReturnArgs>(args?: SelectSubset<T, RatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Rating.
     * @param {RatingDeleteArgs} args - Arguments to delete one Rating.
     * @example
     * // Delete one Rating
     * const Rating = await prisma.rating.delete({
     *   where: {
     *     // ... filter to delete one Rating
     *   }
     * })
     * 
     */
    delete<T extends RatingDeleteArgs>(args: SelectSubset<T, RatingDeleteArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rating.
     * @param {RatingUpdateArgs} args - Arguments to update one Rating.
     * @example
     * // Update one Rating
     * const rating = await prisma.rating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RatingUpdateArgs>(args: SelectSubset<T, RatingUpdateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ratings.
     * @param {RatingDeleteManyArgs} args - Arguments to filter Ratings to delete.
     * @example
     * // Delete a few Ratings
     * const { count } = await prisma.rating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RatingDeleteManyArgs>(args?: SelectSubset<T, RatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ratings
     * const rating = await prisma.rating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RatingUpdateManyArgs>(args: SelectSubset<T, RatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ratings and returns the data updated in the database.
     * @param {RatingUpdateManyAndReturnArgs} args - Arguments to update many Ratings.
     * @example
     * // Update many Ratings
     * const rating = await prisma.rating.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ratings and only return the `id`
     * const ratingWithIdOnly = await prisma.rating.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RatingUpdateManyAndReturnArgs>(args: SelectSubset<T, RatingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Rating.
     * @param {RatingUpsertArgs} args - Arguments to update or create a Rating.
     * @example
     * // Update or create a Rating
     * const rating = await prisma.rating.upsert({
     *   create: {
     *     // ... data to create a Rating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rating we want to update
     *   }
     * })
     */
    upsert<T extends RatingUpsertArgs>(args: SelectSubset<T, RatingUpsertArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingCountArgs} args - Arguments to filter Ratings to count.
     * @example
     * // Count the number of Ratings
     * const count = await prisma.rating.count({
     *   where: {
     *     // ... the filter for the Ratings we want to count
     *   }
     * })
    **/
    count<T extends RatingCountArgs>(
      args?: Subset<T, RatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RatingAggregateArgs>(args: Subset<T, RatingAggregateArgs>): Prisma.PrismaPromise<GetRatingAggregateType<T>>

    /**
     * Group by Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RatingGroupByArgs['orderBy'] }
        : { orderBy?: RatingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rating model
   */
  readonly fields: RatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rating model
   */
  interface RatingFieldRefs {
    readonly id: FieldRef<"Rating", 'String'>
    readonly userId: FieldRef<"Rating", 'String'>
    readonly variant: FieldRef<"Rating", 'String'>
    readonly category: FieldRef<"Rating", 'String'>
    readonly rating: FieldRef<"Rating", 'Int'>
    readonly rd: FieldRef<"Rating", 'Float'>
    readonly sigma: FieldRef<"Rating", 'Float'>
    readonly gameCount: FieldRef<"Rating", 'Int'>
    readonly createdAt: FieldRef<"Rating", 'DateTime'>
    readonly updatedAt: FieldRef<"Rating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rating findUnique
   */
  export type RatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findUniqueOrThrow
   */
  export type RatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findFirst
   */
  export type RatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findFirstOrThrow
   */
  export type RatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findMany
   */
  export type RatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Ratings to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating create
   */
  export type RatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to create a Rating.
     */
    data: XOR<RatingCreateInput, RatingUncheckedCreateInput>
  }

  /**
   * Rating createMany
   */
  export type RatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rating createManyAndReturn
   */
  export type RatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rating update
   */
  export type RatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to update a Rating.
     */
    data: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
    /**
     * Choose, which Rating to update.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating updateMany
   */
  export type RatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ratings.
     */
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>
    /**
     * Filter which Ratings to update
     */
    where?: RatingWhereInput
    /**
     * Limit how many Ratings to update.
     */
    limit?: number
  }

  /**
   * Rating updateManyAndReturn
   */
  export type RatingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * The data used to update Ratings.
     */
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>
    /**
     * Filter which Ratings to update
     */
    where?: RatingWhereInput
    /**
     * Limit how many Ratings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rating upsert
   */
  export type RatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The filter to search for the Rating to update in case it exists.
     */
    where: RatingWhereUniqueInput
    /**
     * In case the Rating found by the `where` argument doesn't exist, create a new Rating with this data.
     */
    create: XOR<RatingCreateInput, RatingUncheckedCreateInput>
    /**
     * In case the Rating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
  }

  /**
   * Rating delete
   */
  export type RatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter which Rating to delete.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating deleteMany
   */
  export type RatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ratings to delete
     */
    where?: RatingWhereInput
    /**
     * Limit how many Ratings to delete.
     */
    limit?: number
  }

  /**
   * Rating without action
   */
  export type RatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rating
     */
    omit?: RatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
  }


  /**
   * Model PuzzleRating
   */

  export type AggregatePuzzleRating = {
    _count: PuzzleRatingCountAggregateOutputType | null
    _avg: PuzzleRatingAvgAggregateOutputType | null
    _sum: PuzzleRatingSumAggregateOutputType | null
    _min: PuzzleRatingMinAggregateOutputType | null
    _max: PuzzleRatingMaxAggregateOutputType | null
  }

  export type PuzzleRatingAvgAggregateOutputType = {
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
  }

  export type PuzzleRatingSumAggregateOutputType = {
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
  }

  export type PuzzleRatingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PuzzleRatingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    rating: number | null
    rd: number | null
    sigma: number | null
    gameCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PuzzleRatingCountAggregateOutputType = {
    id: number
    userId: number
    rating: number
    rd: number
    sigma: number
    gameCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PuzzleRatingAvgAggregateInputType = {
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
  }

  export type PuzzleRatingSumAggregateInputType = {
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
  }

  export type PuzzleRatingMinAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PuzzleRatingMaxAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PuzzleRatingCountAggregateInputType = {
    id?: true
    userId?: true
    rating?: true
    rd?: true
    sigma?: true
    gameCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PuzzleRatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleRating to aggregate.
     */
    where?: PuzzleRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRatings to fetch.
     */
    orderBy?: PuzzleRatingOrderByWithRelationInput | PuzzleRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PuzzleRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PuzzleRatings
    **/
    _count?: true | PuzzleRatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PuzzleRatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PuzzleRatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PuzzleRatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PuzzleRatingMaxAggregateInputType
  }

  export type GetPuzzleRatingAggregateType<T extends PuzzleRatingAggregateArgs> = {
        [P in keyof T & keyof AggregatePuzzleRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleRating[P]>
      : GetScalarType<T[P], AggregatePuzzleRating[P]>
  }




  export type PuzzleRatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleRatingWhereInput
    orderBy?: PuzzleRatingOrderByWithAggregationInput | PuzzleRatingOrderByWithAggregationInput[]
    by: PuzzleRatingScalarFieldEnum[] | PuzzleRatingScalarFieldEnum
    having?: PuzzleRatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PuzzleRatingCountAggregateInputType | true
    _avg?: PuzzleRatingAvgAggregateInputType
    _sum?: PuzzleRatingSumAggregateInputType
    _min?: PuzzleRatingMinAggregateInputType
    _max?: PuzzleRatingMaxAggregateInputType
  }

  export type PuzzleRatingGroupByOutputType = {
    id: string
    userId: string
    rating: number
    rd: number
    sigma: number
    gameCount: number
    createdAt: Date
    updatedAt: Date
    _count: PuzzleRatingCountAggregateOutputType | null
    _avg: PuzzleRatingAvgAggregateOutputType | null
    _sum: PuzzleRatingSumAggregateOutputType | null
    _min: PuzzleRatingMinAggregateOutputType | null
    _max: PuzzleRatingMaxAggregateOutputType | null
  }

  type GetPuzzleRatingGroupByPayload<T extends PuzzleRatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PuzzleRatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PuzzleRatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleRatingGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleRatingGroupByOutputType[P]>
        }
      >
    >


  export type PuzzleRatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRating"]>

  export type PuzzleRatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRating"]>

  export type PuzzleRatingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRating"]>

  export type PuzzleRatingSelectScalar = {
    id?: boolean
    userId?: boolean
    rating?: boolean
    rd?: boolean
    sigma?: boolean
    gameCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PuzzleRatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "rating" | "rd" | "sigma" | "gameCount" | "createdAt" | "updatedAt", ExtArgs["result"]["puzzleRating"]>
  export type PuzzleRatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleRatingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleRatingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PuzzleRatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PuzzleRating"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      rating: number
      rd: number
      sigma: number
      gameCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["puzzleRating"]>
    composites: {}
  }

  type PuzzleRatingGetPayload<S extends boolean | null | undefined | PuzzleRatingDefaultArgs> = $Result.GetResult<Prisma.$PuzzleRatingPayload, S>

  type PuzzleRatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PuzzleRatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PuzzleRatingCountAggregateInputType | true
    }

  export interface PuzzleRatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PuzzleRating'], meta: { name: 'PuzzleRating' } }
    /**
     * Find zero or one PuzzleRating that matches the filter.
     * @param {PuzzleRatingFindUniqueArgs} args - Arguments to find a PuzzleRating
     * @example
     * // Get one PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PuzzleRatingFindUniqueArgs>(args: SelectSubset<T, PuzzleRatingFindUniqueArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PuzzleRating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PuzzleRatingFindUniqueOrThrowArgs} args - Arguments to find a PuzzleRating
     * @example
     * // Get one PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PuzzleRatingFindUniqueOrThrowArgs>(args: SelectSubset<T, PuzzleRatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleRating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingFindFirstArgs} args - Arguments to find a PuzzleRating
     * @example
     * // Get one PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PuzzleRatingFindFirstArgs>(args?: SelectSubset<T, PuzzleRatingFindFirstArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleRating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingFindFirstOrThrowArgs} args - Arguments to find a PuzzleRating
     * @example
     * // Get one PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PuzzleRatingFindFirstOrThrowArgs>(args?: SelectSubset<T, PuzzleRatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PuzzleRatings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PuzzleRatings
     * const puzzleRatings = await prisma.puzzleRating.findMany()
     * 
     * // Get first 10 PuzzleRatings
     * const puzzleRatings = await prisma.puzzleRating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const puzzleRatingWithIdOnly = await prisma.puzzleRating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PuzzleRatingFindManyArgs>(args?: SelectSubset<T, PuzzleRatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PuzzleRating.
     * @param {PuzzleRatingCreateArgs} args - Arguments to create a PuzzleRating.
     * @example
     * // Create one PuzzleRating
     * const PuzzleRating = await prisma.puzzleRating.create({
     *   data: {
     *     // ... data to create a PuzzleRating
     *   }
     * })
     * 
     */
    create<T extends PuzzleRatingCreateArgs>(args: SelectSubset<T, PuzzleRatingCreateArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PuzzleRatings.
     * @param {PuzzleRatingCreateManyArgs} args - Arguments to create many PuzzleRatings.
     * @example
     * // Create many PuzzleRatings
     * const puzzleRating = await prisma.puzzleRating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PuzzleRatingCreateManyArgs>(args?: SelectSubset<T, PuzzleRatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PuzzleRatings and returns the data saved in the database.
     * @param {PuzzleRatingCreateManyAndReturnArgs} args - Arguments to create many PuzzleRatings.
     * @example
     * // Create many PuzzleRatings
     * const puzzleRating = await prisma.puzzleRating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PuzzleRatings and only return the `id`
     * const puzzleRatingWithIdOnly = await prisma.puzzleRating.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PuzzleRatingCreateManyAndReturnArgs>(args?: SelectSubset<T, PuzzleRatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PuzzleRating.
     * @param {PuzzleRatingDeleteArgs} args - Arguments to delete one PuzzleRating.
     * @example
     * // Delete one PuzzleRating
     * const PuzzleRating = await prisma.puzzleRating.delete({
     *   where: {
     *     // ... filter to delete one PuzzleRating
     *   }
     * })
     * 
     */
    delete<T extends PuzzleRatingDeleteArgs>(args: SelectSubset<T, PuzzleRatingDeleteArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PuzzleRating.
     * @param {PuzzleRatingUpdateArgs} args - Arguments to update one PuzzleRating.
     * @example
     * // Update one PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PuzzleRatingUpdateArgs>(args: SelectSubset<T, PuzzleRatingUpdateArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PuzzleRatings.
     * @param {PuzzleRatingDeleteManyArgs} args - Arguments to filter PuzzleRatings to delete.
     * @example
     * // Delete a few PuzzleRatings
     * const { count } = await prisma.puzzleRating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PuzzleRatingDeleteManyArgs>(args?: SelectSubset<T, PuzzleRatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PuzzleRatings
     * const puzzleRating = await prisma.puzzleRating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PuzzleRatingUpdateManyArgs>(args: SelectSubset<T, PuzzleRatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleRatings and returns the data updated in the database.
     * @param {PuzzleRatingUpdateManyAndReturnArgs} args - Arguments to update many PuzzleRatings.
     * @example
     * // Update many PuzzleRatings
     * const puzzleRating = await prisma.puzzleRating.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PuzzleRatings and only return the `id`
     * const puzzleRatingWithIdOnly = await prisma.puzzleRating.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PuzzleRatingUpdateManyAndReturnArgs>(args: SelectSubset<T, PuzzleRatingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PuzzleRating.
     * @param {PuzzleRatingUpsertArgs} args - Arguments to update or create a PuzzleRating.
     * @example
     * // Update or create a PuzzleRating
     * const puzzleRating = await prisma.puzzleRating.upsert({
     *   create: {
     *     // ... data to create a PuzzleRating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PuzzleRating we want to update
     *   }
     * })
     */
    upsert<T extends PuzzleRatingUpsertArgs>(args: SelectSubset<T, PuzzleRatingUpsertArgs<ExtArgs>>): Prisma__PuzzleRatingClient<$Result.GetResult<Prisma.$PuzzleRatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PuzzleRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingCountArgs} args - Arguments to filter PuzzleRatings to count.
     * @example
     * // Count the number of PuzzleRatings
     * const count = await prisma.puzzleRating.count({
     *   where: {
     *     // ... the filter for the PuzzleRatings we want to count
     *   }
     * })
    **/
    count<T extends PuzzleRatingCountArgs>(
      args?: Subset<T, PuzzleRatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleRatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PuzzleRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PuzzleRatingAggregateArgs>(args: Subset<T, PuzzleRatingAggregateArgs>): Prisma.PrismaPromise<GetPuzzleRatingAggregateType<T>>

    /**
     * Group by PuzzleRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRatingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PuzzleRatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PuzzleRatingGroupByArgs['orderBy'] }
        : { orderBy?: PuzzleRatingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PuzzleRatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPuzzleRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PuzzleRating model
   */
  readonly fields: PuzzleRatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PuzzleRating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PuzzleRatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PuzzleRating model
   */
  interface PuzzleRatingFieldRefs {
    readonly id: FieldRef<"PuzzleRating", 'String'>
    readonly userId: FieldRef<"PuzzleRating", 'String'>
    readonly rating: FieldRef<"PuzzleRating", 'Int'>
    readonly rd: FieldRef<"PuzzleRating", 'Float'>
    readonly sigma: FieldRef<"PuzzleRating", 'Float'>
    readonly gameCount: FieldRef<"PuzzleRating", 'Int'>
    readonly createdAt: FieldRef<"PuzzleRating", 'DateTime'>
    readonly updatedAt: FieldRef<"PuzzleRating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PuzzleRating findUnique
   */
  export type PuzzleRatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRating to fetch.
     */
    where: PuzzleRatingWhereUniqueInput
  }

  /**
   * PuzzleRating findUniqueOrThrow
   */
  export type PuzzleRatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRating to fetch.
     */
    where: PuzzleRatingWhereUniqueInput
  }

  /**
   * PuzzleRating findFirst
   */
  export type PuzzleRatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRating to fetch.
     */
    where?: PuzzleRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRatings to fetch.
     */
    orderBy?: PuzzleRatingOrderByWithRelationInput | PuzzleRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleRatings.
     */
    cursor?: PuzzleRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleRatings.
     */
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[]
  }

  /**
   * PuzzleRating findFirstOrThrow
   */
  export type PuzzleRatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRating to fetch.
     */
    where?: PuzzleRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRatings to fetch.
     */
    orderBy?: PuzzleRatingOrderByWithRelationInput | PuzzleRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleRatings.
     */
    cursor?: PuzzleRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleRatings.
     */
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[]
  }

  /**
   * PuzzleRating findMany
   */
  export type PuzzleRatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRatings to fetch.
     */
    where?: PuzzleRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRatings to fetch.
     */
    orderBy?: PuzzleRatingOrderByWithRelationInput | PuzzleRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PuzzleRatings.
     */
    cursor?: PuzzleRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRatings.
     */
    skip?: number
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[]
  }

  /**
   * PuzzleRating create
   */
  export type PuzzleRatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * The data needed to create a PuzzleRating.
     */
    data: XOR<PuzzleRatingCreateInput, PuzzleRatingUncheckedCreateInput>
  }

  /**
   * PuzzleRating createMany
   */
  export type PuzzleRatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PuzzleRatings.
     */
    data: PuzzleRatingCreateManyInput | PuzzleRatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PuzzleRating createManyAndReturn
   */
  export type PuzzleRatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * The data used to create many PuzzleRatings.
     */
    data: PuzzleRatingCreateManyInput | PuzzleRatingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleRating update
   */
  export type PuzzleRatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * The data needed to update a PuzzleRating.
     */
    data: XOR<PuzzleRatingUpdateInput, PuzzleRatingUncheckedUpdateInput>
    /**
     * Choose, which PuzzleRating to update.
     */
    where: PuzzleRatingWhereUniqueInput
  }

  /**
   * PuzzleRating updateMany
   */
  export type PuzzleRatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PuzzleRatings.
     */
    data: XOR<PuzzleRatingUpdateManyMutationInput, PuzzleRatingUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleRatings to update
     */
    where?: PuzzleRatingWhereInput
    /**
     * Limit how many PuzzleRatings to update.
     */
    limit?: number
  }

  /**
   * PuzzleRating updateManyAndReturn
   */
  export type PuzzleRatingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * The data used to update PuzzleRatings.
     */
    data: XOR<PuzzleRatingUpdateManyMutationInput, PuzzleRatingUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleRatings to update
     */
    where?: PuzzleRatingWhereInput
    /**
     * Limit how many PuzzleRatings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleRating upsert
   */
  export type PuzzleRatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * The filter to search for the PuzzleRating to update in case it exists.
     */
    where: PuzzleRatingWhereUniqueInput
    /**
     * In case the PuzzleRating found by the `where` argument doesn't exist, create a new PuzzleRating with this data.
     */
    create: XOR<PuzzleRatingCreateInput, PuzzleRatingUncheckedCreateInput>
    /**
     * In case the PuzzleRating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PuzzleRatingUpdateInput, PuzzleRatingUncheckedUpdateInput>
  }

  /**
   * PuzzleRating delete
   */
  export type PuzzleRatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
    /**
     * Filter which PuzzleRating to delete.
     */
    where: PuzzleRatingWhereUniqueInput
  }

  /**
   * PuzzleRating deleteMany
   */
  export type PuzzleRatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleRatings to delete
     */
    where?: PuzzleRatingWhereInput
    /**
     * Limit how many PuzzleRatings to delete.
     */
    limit?: number
  }

  /**
   * PuzzleRating without action
   */
  export type PuzzleRatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRating
     */
    select?: PuzzleRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRating
     */
    omit?: PuzzleRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRatingInclude<ExtArgs> | null
  }


  /**
   * Model PuzzleAttempt
   */

  export type AggregatePuzzleAttempt = {
    _count: PuzzleAttemptCountAggregateOutputType | null
    _avg: PuzzleAttemptAvgAggregateOutputType | null
    _sum: PuzzleAttemptSumAggregateOutputType | null
    _min: PuzzleAttemptMinAggregateOutputType | null
    _max: PuzzleAttemptMaxAggregateOutputType | null
  }

  export type PuzzleAttemptAvgAggregateOutputType = {
    rating: number | null
  }

  export type PuzzleAttemptSumAggregateOutputType = {
    rating: number | null
  }

  export type PuzzleAttemptMinAggregateOutputType = {
    id: string | null
    userId: string | null
    puzzleId: string | null
    difficulty: string | null
    rating: number | null
    solved: boolean | null
    usedHint: boolean | null
    createdAt: Date | null
  }

  export type PuzzleAttemptMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    puzzleId: string | null
    difficulty: string | null
    rating: number | null
    solved: boolean | null
    usedHint: boolean | null
    createdAt: Date | null
  }

  export type PuzzleAttemptCountAggregateOutputType = {
    id: number
    userId: number
    puzzleId: number
    difficulty: number
    rating: number
    solved: number
    usedHint: number
    createdAt: number
    _all: number
  }


  export type PuzzleAttemptAvgAggregateInputType = {
    rating?: true
  }

  export type PuzzleAttemptSumAggregateInputType = {
    rating?: true
  }

  export type PuzzleAttemptMinAggregateInputType = {
    id?: true
    userId?: true
    puzzleId?: true
    difficulty?: true
    rating?: true
    solved?: true
    usedHint?: true
    createdAt?: true
  }

  export type PuzzleAttemptMaxAggregateInputType = {
    id?: true
    userId?: true
    puzzleId?: true
    difficulty?: true
    rating?: true
    solved?: true
    usedHint?: true
    createdAt?: true
  }

  export type PuzzleAttemptCountAggregateInputType = {
    id?: true
    userId?: true
    puzzleId?: true
    difficulty?: true
    rating?: true
    solved?: true
    usedHint?: true
    createdAt?: true
    _all?: true
  }

  export type PuzzleAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleAttempt to aggregate.
     */
    where?: PuzzleAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleAttempts to fetch.
     */
    orderBy?: PuzzleAttemptOrderByWithRelationInput | PuzzleAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PuzzleAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PuzzleAttempts
    **/
    _count?: true | PuzzleAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PuzzleAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PuzzleAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PuzzleAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PuzzleAttemptMaxAggregateInputType
  }

  export type GetPuzzleAttemptAggregateType<T extends PuzzleAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregatePuzzleAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleAttempt[P]>
      : GetScalarType<T[P], AggregatePuzzleAttempt[P]>
  }




  export type PuzzleAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleAttemptWhereInput
    orderBy?: PuzzleAttemptOrderByWithAggregationInput | PuzzleAttemptOrderByWithAggregationInput[]
    by: PuzzleAttemptScalarFieldEnum[] | PuzzleAttemptScalarFieldEnum
    having?: PuzzleAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PuzzleAttemptCountAggregateInputType | true
    _avg?: PuzzleAttemptAvgAggregateInputType
    _sum?: PuzzleAttemptSumAggregateInputType
    _min?: PuzzleAttemptMinAggregateInputType
    _max?: PuzzleAttemptMaxAggregateInputType
  }

  export type PuzzleAttemptGroupByOutputType = {
    id: string
    userId: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint: boolean
    createdAt: Date
    _count: PuzzleAttemptCountAggregateOutputType | null
    _avg: PuzzleAttemptAvgAggregateOutputType | null
    _sum: PuzzleAttemptSumAggregateOutputType | null
    _min: PuzzleAttemptMinAggregateOutputType | null
    _max: PuzzleAttemptMaxAggregateOutputType | null
  }

  type GetPuzzleAttemptGroupByPayload<T extends PuzzleAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PuzzleAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PuzzleAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleAttemptGroupByOutputType[P]>
        }
      >
    >


  export type PuzzleAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    puzzleId?: boolean
    difficulty?: boolean
    rating?: boolean
    solved?: boolean
    usedHint?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleAttempt"]>

  export type PuzzleAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    puzzleId?: boolean
    difficulty?: boolean
    rating?: boolean
    solved?: boolean
    usedHint?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleAttempt"]>

  export type PuzzleAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    puzzleId?: boolean
    difficulty?: boolean
    rating?: boolean
    solved?: boolean
    usedHint?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleAttempt"]>

  export type PuzzleAttemptSelectScalar = {
    id?: boolean
    userId?: boolean
    puzzleId?: boolean
    difficulty?: boolean
    rating?: boolean
    solved?: boolean
    usedHint?: boolean
    createdAt?: boolean
  }

  export type PuzzleAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "puzzleId" | "difficulty" | "rating" | "solved" | "usedHint" | "createdAt", ExtArgs["result"]["puzzleAttempt"]>
  export type PuzzleAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleAttemptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PuzzleAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PuzzleAttempt"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      puzzleId: string
      difficulty: string
      rating: number
      solved: boolean
      usedHint: boolean
      createdAt: Date
    }, ExtArgs["result"]["puzzleAttempt"]>
    composites: {}
  }

  type PuzzleAttemptGetPayload<S extends boolean | null | undefined | PuzzleAttemptDefaultArgs> = $Result.GetResult<Prisma.$PuzzleAttemptPayload, S>

  type PuzzleAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PuzzleAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PuzzleAttemptCountAggregateInputType | true
    }

  export interface PuzzleAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PuzzleAttempt'], meta: { name: 'PuzzleAttempt' } }
    /**
     * Find zero or one PuzzleAttempt that matches the filter.
     * @param {PuzzleAttemptFindUniqueArgs} args - Arguments to find a PuzzleAttempt
     * @example
     * // Get one PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PuzzleAttemptFindUniqueArgs>(args: SelectSubset<T, PuzzleAttemptFindUniqueArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PuzzleAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PuzzleAttemptFindUniqueOrThrowArgs} args - Arguments to find a PuzzleAttempt
     * @example
     * // Get one PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PuzzleAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, PuzzleAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptFindFirstArgs} args - Arguments to find a PuzzleAttempt
     * @example
     * // Get one PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PuzzleAttemptFindFirstArgs>(args?: SelectSubset<T, PuzzleAttemptFindFirstArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptFindFirstOrThrowArgs} args - Arguments to find a PuzzleAttempt
     * @example
     * // Get one PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PuzzleAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, PuzzleAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PuzzleAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PuzzleAttempts
     * const puzzleAttempts = await prisma.puzzleAttempt.findMany()
     * 
     * // Get first 10 PuzzleAttempts
     * const puzzleAttempts = await prisma.puzzleAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const puzzleAttemptWithIdOnly = await prisma.puzzleAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PuzzleAttemptFindManyArgs>(args?: SelectSubset<T, PuzzleAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PuzzleAttempt.
     * @param {PuzzleAttemptCreateArgs} args - Arguments to create a PuzzleAttempt.
     * @example
     * // Create one PuzzleAttempt
     * const PuzzleAttempt = await prisma.puzzleAttempt.create({
     *   data: {
     *     // ... data to create a PuzzleAttempt
     *   }
     * })
     * 
     */
    create<T extends PuzzleAttemptCreateArgs>(args: SelectSubset<T, PuzzleAttemptCreateArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PuzzleAttempts.
     * @param {PuzzleAttemptCreateManyArgs} args - Arguments to create many PuzzleAttempts.
     * @example
     * // Create many PuzzleAttempts
     * const puzzleAttempt = await prisma.puzzleAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PuzzleAttemptCreateManyArgs>(args?: SelectSubset<T, PuzzleAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PuzzleAttempts and returns the data saved in the database.
     * @param {PuzzleAttemptCreateManyAndReturnArgs} args - Arguments to create many PuzzleAttempts.
     * @example
     * // Create many PuzzleAttempts
     * const puzzleAttempt = await prisma.puzzleAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PuzzleAttempts and only return the `id`
     * const puzzleAttemptWithIdOnly = await prisma.puzzleAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PuzzleAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, PuzzleAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PuzzleAttempt.
     * @param {PuzzleAttemptDeleteArgs} args - Arguments to delete one PuzzleAttempt.
     * @example
     * // Delete one PuzzleAttempt
     * const PuzzleAttempt = await prisma.puzzleAttempt.delete({
     *   where: {
     *     // ... filter to delete one PuzzleAttempt
     *   }
     * })
     * 
     */
    delete<T extends PuzzleAttemptDeleteArgs>(args: SelectSubset<T, PuzzleAttemptDeleteArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PuzzleAttempt.
     * @param {PuzzleAttemptUpdateArgs} args - Arguments to update one PuzzleAttempt.
     * @example
     * // Update one PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PuzzleAttemptUpdateArgs>(args: SelectSubset<T, PuzzleAttemptUpdateArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PuzzleAttempts.
     * @param {PuzzleAttemptDeleteManyArgs} args - Arguments to filter PuzzleAttempts to delete.
     * @example
     * // Delete a few PuzzleAttempts
     * const { count } = await prisma.puzzleAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PuzzleAttemptDeleteManyArgs>(args?: SelectSubset<T, PuzzleAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PuzzleAttempts
     * const puzzleAttempt = await prisma.puzzleAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PuzzleAttemptUpdateManyArgs>(args: SelectSubset<T, PuzzleAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleAttempts and returns the data updated in the database.
     * @param {PuzzleAttemptUpdateManyAndReturnArgs} args - Arguments to update many PuzzleAttempts.
     * @example
     * // Update many PuzzleAttempts
     * const puzzleAttempt = await prisma.puzzleAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PuzzleAttempts and only return the `id`
     * const puzzleAttemptWithIdOnly = await prisma.puzzleAttempt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PuzzleAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, PuzzleAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PuzzleAttempt.
     * @param {PuzzleAttemptUpsertArgs} args - Arguments to update or create a PuzzleAttempt.
     * @example
     * // Update or create a PuzzleAttempt
     * const puzzleAttempt = await prisma.puzzleAttempt.upsert({
     *   create: {
     *     // ... data to create a PuzzleAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PuzzleAttempt we want to update
     *   }
     * })
     */
    upsert<T extends PuzzleAttemptUpsertArgs>(args: SelectSubset<T, PuzzleAttemptUpsertArgs<ExtArgs>>): Prisma__PuzzleAttemptClient<$Result.GetResult<Prisma.$PuzzleAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PuzzleAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptCountArgs} args - Arguments to filter PuzzleAttempts to count.
     * @example
     * // Count the number of PuzzleAttempts
     * const count = await prisma.puzzleAttempt.count({
     *   where: {
     *     // ... the filter for the PuzzleAttempts we want to count
     *   }
     * })
    **/
    count<T extends PuzzleAttemptCountArgs>(
      args?: Subset<T, PuzzleAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PuzzleAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PuzzleAttemptAggregateArgs>(args: Subset<T, PuzzleAttemptAggregateArgs>): Prisma.PrismaPromise<GetPuzzleAttemptAggregateType<T>>

    /**
     * Group by PuzzleAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleAttemptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PuzzleAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PuzzleAttemptGroupByArgs['orderBy'] }
        : { orderBy?: PuzzleAttemptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PuzzleAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPuzzleAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PuzzleAttempt model
   */
  readonly fields: PuzzleAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PuzzleAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PuzzleAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PuzzleAttempt model
   */
  interface PuzzleAttemptFieldRefs {
    readonly id: FieldRef<"PuzzleAttempt", 'String'>
    readonly userId: FieldRef<"PuzzleAttempt", 'String'>
    readonly puzzleId: FieldRef<"PuzzleAttempt", 'String'>
    readonly difficulty: FieldRef<"PuzzleAttempt", 'String'>
    readonly rating: FieldRef<"PuzzleAttempt", 'Int'>
    readonly solved: FieldRef<"PuzzleAttempt", 'Boolean'>
    readonly usedHint: FieldRef<"PuzzleAttempt", 'Boolean'>
    readonly createdAt: FieldRef<"PuzzleAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PuzzleAttempt findUnique
   */
  export type PuzzleAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleAttempt to fetch.
     */
    where: PuzzleAttemptWhereUniqueInput
  }

  /**
   * PuzzleAttempt findUniqueOrThrow
   */
  export type PuzzleAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleAttempt to fetch.
     */
    where: PuzzleAttemptWhereUniqueInput
  }

  /**
   * PuzzleAttempt findFirst
   */
  export type PuzzleAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleAttempt to fetch.
     */
    where?: PuzzleAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleAttempts to fetch.
     */
    orderBy?: PuzzleAttemptOrderByWithRelationInput | PuzzleAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleAttempts.
     */
    cursor?: PuzzleAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleAttempts.
     */
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[]
  }

  /**
   * PuzzleAttempt findFirstOrThrow
   */
  export type PuzzleAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleAttempt to fetch.
     */
    where?: PuzzleAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleAttempts to fetch.
     */
    orderBy?: PuzzleAttemptOrderByWithRelationInput | PuzzleAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleAttempts.
     */
    cursor?: PuzzleAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleAttempts.
     */
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[]
  }

  /**
   * PuzzleAttempt findMany
   */
  export type PuzzleAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleAttempts to fetch.
     */
    where?: PuzzleAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleAttempts to fetch.
     */
    orderBy?: PuzzleAttemptOrderByWithRelationInput | PuzzleAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PuzzleAttempts.
     */
    cursor?: PuzzleAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleAttempts.
     */
    skip?: number
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[]
  }

  /**
   * PuzzleAttempt create
   */
  export type PuzzleAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a PuzzleAttempt.
     */
    data: XOR<PuzzleAttemptCreateInput, PuzzleAttemptUncheckedCreateInput>
  }

  /**
   * PuzzleAttempt createMany
   */
  export type PuzzleAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PuzzleAttempts.
     */
    data: PuzzleAttemptCreateManyInput | PuzzleAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PuzzleAttempt createManyAndReturn
   */
  export type PuzzleAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many PuzzleAttempts.
     */
    data: PuzzleAttemptCreateManyInput | PuzzleAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleAttempt update
   */
  export type PuzzleAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a PuzzleAttempt.
     */
    data: XOR<PuzzleAttemptUpdateInput, PuzzleAttemptUncheckedUpdateInput>
    /**
     * Choose, which PuzzleAttempt to update.
     */
    where: PuzzleAttemptWhereUniqueInput
  }

  /**
   * PuzzleAttempt updateMany
   */
  export type PuzzleAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PuzzleAttempts.
     */
    data: XOR<PuzzleAttemptUpdateManyMutationInput, PuzzleAttemptUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleAttempts to update
     */
    where?: PuzzleAttemptWhereInput
    /**
     * Limit how many PuzzleAttempts to update.
     */
    limit?: number
  }

  /**
   * PuzzleAttempt updateManyAndReturn
   */
  export type PuzzleAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * The data used to update PuzzleAttempts.
     */
    data: XOR<PuzzleAttemptUpdateManyMutationInput, PuzzleAttemptUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleAttempts to update
     */
    where?: PuzzleAttemptWhereInput
    /**
     * Limit how many PuzzleAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleAttempt upsert
   */
  export type PuzzleAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the PuzzleAttempt to update in case it exists.
     */
    where: PuzzleAttemptWhereUniqueInput
    /**
     * In case the PuzzleAttempt found by the `where` argument doesn't exist, create a new PuzzleAttempt with this data.
     */
    create: XOR<PuzzleAttemptCreateInput, PuzzleAttemptUncheckedCreateInput>
    /**
     * In case the PuzzleAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PuzzleAttemptUpdateInput, PuzzleAttemptUncheckedUpdateInput>
  }

  /**
   * PuzzleAttempt delete
   */
  export type PuzzleAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
    /**
     * Filter which PuzzleAttempt to delete.
     */
    where: PuzzleAttemptWhereUniqueInput
  }

  /**
   * PuzzleAttempt deleteMany
   */
  export type PuzzleAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleAttempts to delete
     */
    where?: PuzzleAttemptWhereInput
    /**
     * Limit how many PuzzleAttempts to delete.
     */
    limit?: number
  }

  /**
   * PuzzleAttempt without action
   */
  export type PuzzleAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleAttempt
     */
    select?: PuzzleAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleAttempt
     */
    omit?: PuzzleAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleAttemptInclude<ExtArgs> | null
  }


  /**
   * Model PuzzleRushScore
   */

  export type AggregatePuzzleRushScore = {
    _count: PuzzleRushScoreCountAggregateOutputType | null
    _avg: PuzzleRushScoreAvgAggregateOutputType | null
    _sum: PuzzleRushScoreSumAggregateOutputType | null
    _min: PuzzleRushScoreMinAggregateOutputType | null
    _max: PuzzleRushScoreMaxAggregateOutputType | null
  }

  export type PuzzleRushScoreAvgAggregateOutputType = {
    score: number | null
    mistakes: number | null
    timeLimitSeconds: number | null
    maxMistakes: number | null
  }

  export type PuzzleRushScoreSumAggregateOutputType = {
    score: number | null
    mistakes: number | null
    timeLimitSeconds: number | null
    maxMistakes: number | null
  }

  export type PuzzleRushScoreMinAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: string | null
    difficulty: string | null
    score: number | null
    mistakes: number | null
    timeLimitSeconds: number | null
    maxMistakes: number | null
    createdAt: Date | null
  }

  export type PuzzleRushScoreMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: string | null
    difficulty: string | null
    score: number | null
    mistakes: number | null
    timeLimitSeconds: number | null
    maxMistakes: number | null
    createdAt: Date | null
  }

  export type PuzzleRushScoreCountAggregateOutputType = {
    id: number
    userId: number
    mode: number
    difficulty: number
    score: number
    mistakes: number
    timeLimitSeconds: number
    maxMistakes: number
    createdAt: number
    _all: number
  }


  export type PuzzleRushScoreAvgAggregateInputType = {
    score?: true
    mistakes?: true
    timeLimitSeconds?: true
    maxMistakes?: true
  }

  export type PuzzleRushScoreSumAggregateInputType = {
    score?: true
    mistakes?: true
    timeLimitSeconds?: true
    maxMistakes?: true
  }

  export type PuzzleRushScoreMinAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    difficulty?: true
    score?: true
    mistakes?: true
    timeLimitSeconds?: true
    maxMistakes?: true
    createdAt?: true
  }

  export type PuzzleRushScoreMaxAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    difficulty?: true
    score?: true
    mistakes?: true
    timeLimitSeconds?: true
    maxMistakes?: true
    createdAt?: true
  }

  export type PuzzleRushScoreCountAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    difficulty?: true
    score?: true
    mistakes?: true
    timeLimitSeconds?: true
    maxMistakes?: true
    createdAt?: true
    _all?: true
  }

  export type PuzzleRushScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleRushScore to aggregate.
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRushScores to fetch.
     */
    orderBy?: PuzzleRushScoreOrderByWithRelationInput | PuzzleRushScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PuzzleRushScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRushScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRushScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PuzzleRushScores
    **/
    _count?: true | PuzzleRushScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PuzzleRushScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PuzzleRushScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PuzzleRushScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PuzzleRushScoreMaxAggregateInputType
  }

  export type GetPuzzleRushScoreAggregateType<T extends PuzzleRushScoreAggregateArgs> = {
        [P in keyof T & keyof AggregatePuzzleRushScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleRushScore[P]>
      : GetScalarType<T[P], AggregatePuzzleRushScore[P]>
  }




  export type PuzzleRushScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PuzzleRushScoreWhereInput
    orderBy?: PuzzleRushScoreOrderByWithAggregationInput | PuzzleRushScoreOrderByWithAggregationInput[]
    by: PuzzleRushScoreScalarFieldEnum[] | PuzzleRushScoreScalarFieldEnum
    having?: PuzzleRushScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PuzzleRushScoreCountAggregateInputType | true
    _avg?: PuzzleRushScoreAvgAggregateInputType
    _sum?: PuzzleRushScoreSumAggregateInputType
    _min?: PuzzleRushScoreMinAggregateInputType
    _max?: PuzzleRushScoreMaxAggregateInputType
  }

  export type PuzzleRushScoreGroupByOutputType = {
    id: string
    userId: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds: number | null
    maxMistakes: number | null
    createdAt: Date
    _count: PuzzleRushScoreCountAggregateOutputType | null
    _avg: PuzzleRushScoreAvgAggregateOutputType | null
    _sum: PuzzleRushScoreSumAggregateOutputType | null
    _min: PuzzleRushScoreMinAggregateOutputType | null
    _max: PuzzleRushScoreMaxAggregateOutputType | null
  }

  type GetPuzzleRushScoreGroupByPayload<T extends PuzzleRushScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PuzzleRushScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PuzzleRushScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleRushScoreGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleRushScoreGroupByOutputType[P]>
        }
      >
    >


  export type PuzzleRushScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    difficulty?: boolean
    score?: boolean
    mistakes?: boolean
    timeLimitSeconds?: boolean
    maxMistakes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRushScore"]>

  export type PuzzleRushScoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    difficulty?: boolean
    score?: boolean
    mistakes?: boolean
    timeLimitSeconds?: boolean
    maxMistakes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRushScore"]>

  export type PuzzleRushScoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    difficulty?: boolean
    score?: boolean
    mistakes?: boolean
    timeLimitSeconds?: boolean
    maxMistakes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["puzzleRushScore"]>

  export type PuzzleRushScoreSelectScalar = {
    id?: boolean
    userId?: boolean
    mode?: boolean
    difficulty?: boolean
    score?: boolean
    mistakes?: boolean
    timeLimitSeconds?: boolean
    maxMistakes?: boolean
    createdAt?: boolean
  }

  export type PuzzleRushScoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "mode" | "difficulty" | "score" | "mistakes" | "timeLimitSeconds" | "maxMistakes" | "createdAt", ExtArgs["result"]["puzzleRushScore"]>
  export type PuzzleRushScoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleRushScoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PuzzleRushScoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PuzzleRushScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PuzzleRushScore"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      mode: string
      difficulty: string
      score: number
      mistakes: number
      timeLimitSeconds: number | null
      maxMistakes: number | null
      createdAt: Date
    }, ExtArgs["result"]["puzzleRushScore"]>
    composites: {}
  }

  type PuzzleRushScoreGetPayload<S extends boolean | null | undefined | PuzzleRushScoreDefaultArgs> = $Result.GetResult<Prisma.$PuzzleRushScorePayload, S>

  type PuzzleRushScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PuzzleRushScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PuzzleRushScoreCountAggregateInputType | true
    }

  export interface PuzzleRushScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PuzzleRushScore'], meta: { name: 'PuzzleRushScore' } }
    /**
     * Find zero or one PuzzleRushScore that matches the filter.
     * @param {PuzzleRushScoreFindUniqueArgs} args - Arguments to find a PuzzleRushScore
     * @example
     * // Get one PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PuzzleRushScoreFindUniqueArgs>(args: SelectSubset<T, PuzzleRushScoreFindUniqueArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PuzzleRushScore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PuzzleRushScoreFindUniqueOrThrowArgs} args - Arguments to find a PuzzleRushScore
     * @example
     * // Get one PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PuzzleRushScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, PuzzleRushScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleRushScore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreFindFirstArgs} args - Arguments to find a PuzzleRushScore
     * @example
     * // Get one PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PuzzleRushScoreFindFirstArgs>(args?: SelectSubset<T, PuzzleRushScoreFindFirstArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PuzzleRushScore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreFindFirstOrThrowArgs} args - Arguments to find a PuzzleRushScore
     * @example
     * // Get one PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PuzzleRushScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, PuzzleRushScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PuzzleRushScores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PuzzleRushScores
     * const puzzleRushScores = await prisma.puzzleRushScore.findMany()
     * 
     * // Get first 10 PuzzleRushScores
     * const puzzleRushScores = await prisma.puzzleRushScore.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const puzzleRushScoreWithIdOnly = await prisma.puzzleRushScore.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PuzzleRushScoreFindManyArgs>(args?: SelectSubset<T, PuzzleRushScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PuzzleRushScore.
     * @param {PuzzleRushScoreCreateArgs} args - Arguments to create a PuzzleRushScore.
     * @example
     * // Create one PuzzleRushScore
     * const PuzzleRushScore = await prisma.puzzleRushScore.create({
     *   data: {
     *     // ... data to create a PuzzleRushScore
     *   }
     * })
     * 
     */
    create<T extends PuzzleRushScoreCreateArgs>(args: SelectSubset<T, PuzzleRushScoreCreateArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PuzzleRushScores.
     * @param {PuzzleRushScoreCreateManyArgs} args - Arguments to create many PuzzleRushScores.
     * @example
     * // Create many PuzzleRushScores
     * const puzzleRushScore = await prisma.puzzleRushScore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PuzzleRushScoreCreateManyArgs>(args?: SelectSubset<T, PuzzleRushScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PuzzleRushScores and returns the data saved in the database.
     * @param {PuzzleRushScoreCreateManyAndReturnArgs} args - Arguments to create many PuzzleRushScores.
     * @example
     * // Create many PuzzleRushScores
     * const puzzleRushScore = await prisma.puzzleRushScore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PuzzleRushScores and only return the `id`
     * const puzzleRushScoreWithIdOnly = await prisma.puzzleRushScore.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PuzzleRushScoreCreateManyAndReturnArgs>(args?: SelectSubset<T, PuzzleRushScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PuzzleRushScore.
     * @param {PuzzleRushScoreDeleteArgs} args - Arguments to delete one PuzzleRushScore.
     * @example
     * // Delete one PuzzleRushScore
     * const PuzzleRushScore = await prisma.puzzleRushScore.delete({
     *   where: {
     *     // ... filter to delete one PuzzleRushScore
     *   }
     * })
     * 
     */
    delete<T extends PuzzleRushScoreDeleteArgs>(args: SelectSubset<T, PuzzleRushScoreDeleteArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PuzzleRushScore.
     * @param {PuzzleRushScoreUpdateArgs} args - Arguments to update one PuzzleRushScore.
     * @example
     * // Update one PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PuzzleRushScoreUpdateArgs>(args: SelectSubset<T, PuzzleRushScoreUpdateArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PuzzleRushScores.
     * @param {PuzzleRushScoreDeleteManyArgs} args - Arguments to filter PuzzleRushScores to delete.
     * @example
     * // Delete a few PuzzleRushScores
     * const { count } = await prisma.puzzleRushScore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PuzzleRushScoreDeleteManyArgs>(args?: SelectSubset<T, PuzzleRushScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleRushScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PuzzleRushScores
     * const puzzleRushScore = await prisma.puzzleRushScore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PuzzleRushScoreUpdateManyArgs>(args: SelectSubset<T, PuzzleRushScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PuzzleRushScores and returns the data updated in the database.
     * @param {PuzzleRushScoreUpdateManyAndReturnArgs} args - Arguments to update many PuzzleRushScores.
     * @example
     * // Update many PuzzleRushScores
     * const puzzleRushScore = await prisma.puzzleRushScore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PuzzleRushScores and only return the `id`
     * const puzzleRushScoreWithIdOnly = await prisma.puzzleRushScore.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PuzzleRushScoreUpdateManyAndReturnArgs>(args: SelectSubset<T, PuzzleRushScoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PuzzleRushScore.
     * @param {PuzzleRushScoreUpsertArgs} args - Arguments to update or create a PuzzleRushScore.
     * @example
     * // Update or create a PuzzleRushScore
     * const puzzleRushScore = await prisma.puzzleRushScore.upsert({
     *   create: {
     *     // ... data to create a PuzzleRushScore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PuzzleRushScore we want to update
     *   }
     * })
     */
    upsert<T extends PuzzleRushScoreUpsertArgs>(args: SelectSubset<T, PuzzleRushScoreUpsertArgs<ExtArgs>>): Prisma__PuzzleRushScoreClient<$Result.GetResult<Prisma.$PuzzleRushScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PuzzleRushScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreCountArgs} args - Arguments to filter PuzzleRushScores to count.
     * @example
     * // Count the number of PuzzleRushScores
     * const count = await prisma.puzzleRushScore.count({
     *   where: {
     *     // ... the filter for the PuzzleRushScores we want to count
     *   }
     * })
    **/
    count<T extends PuzzleRushScoreCountArgs>(
      args?: Subset<T, PuzzleRushScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleRushScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PuzzleRushScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PuzzleRushScoreAggregateArgs>(args: Subset<T, PuzzleRushScoreAggregateArgs>): Prisma.PrismaPromise<GetPuzzleRushScoreAggregateType<T>>

    /**
     * Group by PuzzleRushScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PuzzleRushScoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PuzzleRushScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PuzzleRushScoreGroupByArgs['orderBy'] }
        : { orderBy?: PuzzleRushScoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PuzzleRushScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPuzzleRushScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PuzzleRushScore model
   */
  readonly fields: PuzzleRushScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PuzzleRushScore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PuzzleRushScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PuzzleRushScore model
   */
  interface PuzzleRushScoreFieldRefs {
    readonly id: FieldRef<"PuzzleRushScore", 'String'>
    readonly userId: FieldRef<"PuzzleRushScore", 'String'>
    readonly mode: FieldRef<"PuzzleRushScore", 'String'>
    readonly difficulty: FieldRef<"PuzzleRushScore", 'String'>
    readonly score: FieldRef<"PuzzleRushScore", 'Int'>
    readonly mistakes: FieldRef<"PuzzleRushScore", 'Int'>
    readonly timeLimitSeconds: FieldRef<"PuzzleRushScore", 'Int'>
    readonly maxMistakes: FieldRef<"PuzzleRushScore", 'Int'>
    readonly createdAt: FieldRef<"PuzzleRushScore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PuzzleRushScore findUnique
   */
  export type PuzzleRushScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRushScore to fetch.
     */
    where: PuzzleRushScoreWhereUniqueInput
  }

  /**
   * PuzzleRushScore findUniqueOrThrow
   */
  export type PuzzleRushScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRushScore to fetch.
     */
    where: PuzzleRushScoreWhereUniqueInput
  }

  /**
   * PuzzleRushScore findFirst
   */
  export type PuzzleRushScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRushScore to fetch.
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRushScores to fetch.
     */
    orderBy?: PuzzleRushScoreOrderByWithRelationInput | PuzzleRushScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleRushScores.
     */
    cursor?: PuzzleRushScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRushScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRushScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleRushScores.
     */
    distinct?: PuzzleRushScoreScalarFieldEnum | PuzzleRushScoreScalarFieldEnum[]
  }

  /**
   * PuzzleRushScore findFirstOrThrow
   */
  export type PuzzleRushScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRushScore to fetch.
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRushScores to fetch.
     */
    orderBy?: PuzzleRushScoreOrderByWithRelationInput | PuzzleRushScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PuzzleRushScores.
     */
    cursor?: PuzzleRushScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRushScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRushScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PuzzleRushScores.
     */
    distinct?: PuzzleRushScoreScalarFieldEnum | PuzzleRushScoreScalarFieldEnum[]
  }

  /**
   * PuzzleRushScore findMany
   */
  export type PuzzleRushScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter, which PuzzleRushScores to fetch.
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PuzzleRushScores to fetch.
     */
    orderBy?: PuzzleRushScoreOrderByWithRelationInput | PuzzleRushScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PuzzleRushScores.
     */
    cursor?: PuzzleRushScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PuzzleRushScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PuzzleRushScores.
     */
    skip?: number
    distinct?: PuzzleRushScoreScalarFieldEnum | PuzzleRushScoreScalarFieldEnum[]
  }

  /**
   * PuzzleRushScore create
   */
  export type PuzzleRushScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * The data needed to create a PuzzleRushScore.
     */
    data: XOR<PuzzleRushScoreCreateInput, PuzzleRushScoreUncheckedCreateInput>
  }

  /**
   * PuzzleRushScore createMany
   */
  export type PuzzleRushScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PuzzleRushScores.
     */
    data: PuzzleRushScoreCreateManyInput | PuzzleRushScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PuzzleRushScore createManyAndReturn
   */
  export type PuzzleRushScoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * The data used to create many PuzzleRushScores.
     */
    data: PuzzleRushScoreCreateManyInput | PuzzleRushScoreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleRushScore update
   */
  export type PuzzleRushScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * The data needed to update a PuzzleRushScore.
     */
    data: XOR<PuzzleRushScoreUpdateInput, PuzzleRushScoreUncheckedUpdateInput>
    /**
     * Choose, which PuzzleRushScore to update.
     */
    where: PuzzleRushScoreWhereUniqueInput
  }

  /**
   * PuzzleRushScore updateMany
   */
  export type PuzzleRushScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PuzzleRushScores.
     */
    data: XOR<PuzzleRushScoreUpdateManyMutationInput, PuzzleRushScoreUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleRushScores to update
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * Limit how many PuzzleRushScores to update.
     */
    limit?: number
  }

  /**
   * PuzzleRushScore updateManyAndReturn
   */
  export type PuzzleRushScoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * The data used to update PuzzleRushScores.
     */
    data: XOR<PuzzleRushScoreUpdateManyMutationInput, PuzzleRushScoreUncheckedUpdateManyInput>
    /**
     * Filter which PuzzleRushScores to update
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * Limit how many PuzzleRushScores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PuzzleRushScore upsert
   */
  export type PuzzleRushScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * The filter to search for the PuzzleRushScore to update in case it exists.
     */
    where: PuzzleRushScoreWhereUniqueInput
    /**
     * In case the PuzzleRushScore found by the `where` argument doesn't exist, create a new PuzzleRushScore with this data.
     */
    create: XOR<PuzzleRushScoreCreateInput, PuzzleRushScoreUncheckedCreateInput>
    /**
     * In case the PuzzleRushScore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PuzzleRushScoreUpdateInput, PuzzleRushScoreUncheckedUpdateInput>
  }

  /**
   * PuzzleRushScore delete
   */
  export type PuzzleRushScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
    /**
     * Filter which PuzzleRushScore to delete.
     */
    where: PuzzleRushScoreWhereUniqueInput
  }

  /**
   * PuzzleRushScore deleteMany
   */
  export type PuzzleRushScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PuzzleRushScores to delete
     */
    where?: PuzzleRushScoreWhereInput
    /**
     * Limit how many PuzzleRushScores to delete.
     */
    limit?: number
  }

  /**
   * PuzzleRushScore without action
   */
  export type PuzzleRushScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PuzzleRushScore
     */
    select?: PuzzleRushScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PuzzleRushScore
     */
    omit?: PuzzleRushScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PuzzleRushScoreInclude<ExtArgs> | null
  }


  /**
   * Model MemorySession
   */

  export type AggregateMemorySession = {
    _count: MemorySessionCountAggregateOutputType | null
    _avg: MemorySessionAvgAggregateOutputType | null
    _sum: MemorySessionSumAggregateOutputType | null
    _min: MemorySessionMinAggregateOutputType | null
    _max: MemorySessionMaxAggregateOutputType | null
  }

  export type MemorySessionAvgAggregateOutputType = {
    pieceCount: number | null
    memorizeTimeSeconds: number | null
    correctPieces: number | null
    totalPieces: number | null
    accuracy: number | null
    progressiveLevel: number | null
  }

  export type MemorySessionSumAggregateOutputType = {
    pieceCount: number | null
    memorizeTimeSeconds: number | null
    correctPieces: number | null
    totalPieces: number | null
    accuracy: number | null
    progressiveLevel: number | null
  }

  export type MemorySessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: string | null
    pieceCount: number | null
    memorizeTimeSeconds: number | null
    correctPieces: number | null
    totalPieces: number | null
    accuracy: number | null
    progressiveLevel: number | null
    createdAt: Date | null
  }

  export type MemorySessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: string | null
    pieceCount: number | null
    memorizeTimeSeconds: number | null
    correctPieces: number | null
    totalPieces: number | null
    accuracy: number | null
    progressiveLevel: number | null
    createdAt: Date | null
  }

  export type MemorySessionCountAggregateOutputType = {
    id: number
    userId: number
    mode: number
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel: number
    createdAt: number
    _all: number
  }


  export type MemorySessionAvgAggregateInputType = {
    pieceCount?: true
    memorizeTimeSeconds?: true
    correctPieces?: true
    totalPieces?: true
    accuracy?: true
    progressiveLevel?: true
  }

  export type MemorySessionSumAggregateInputType = {
    pieceCount?: true
    memorizeTimeSeconds?: true
    correctPieces?: true
    totalPieces?: true
    accuracy?: true
    progressiveLevel?: true
  }

  export type MemorySessionMinAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    pieceCount?: true
    memorizeTimeSeconds?: true
    correctPieces?: true
    totalPieces?: true
    accuracy?: true
    progressiveLevel?: true
    createdAt?: true
  }

  export type MemorySessionMaxAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    pieceCount?: true
    memorizeTimeSeconds?: true
    correctPieces?: true
    totalPieces?: true
    accuracy?: true
    progressiveLevel?: true
    createdAt?: true
  }

  export type MemorySessionCountAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    pieceCount?: true
    memorizeTimeSeconds?: true
    correctPieces?: true
    totalPieces?: true
    accuracy?: true
    progressiveLevel?: true
    createdAt?: true
    _all?: true
  }

  export type MemorySessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemorySession to aggregate.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MemorySessions
    **/
    _count?: true | MemorySessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MemorySessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MemorySessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemorySessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemorySessionMaxAggregateInputType
  }

  export type GetMemorySessionAggregateType<T extends MemorySessionAggregateArgs> = {
        [P in keyof T & keyof AggregateMemorySession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemorySession[P]>
      : GetScalarType<T[P], AggregateMemorySession[P]>
  }




  export type MemorySessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemorySessionWhereInput
    orderBy?: MemorySessionOrderByWithAggregationInput | MemorySessionOrderByWithAggregationInput[]
    by: MemorySessionScalarFieldEnum[] | MemorySessionScalarFieldEnum
    having?: MemorySessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemorySessionCountAggregateInputType | true
    _avg?: MemorySessionAvgAggregateInputType
    _sum?: MemorySessionSumAggregateInputType
    _min?: MemorySessionMinAggregateInputType
    _max?: MemorySessionMaxAggregateInputType
  }

  export type MemorySessionGroupByOutputType = {
    id: string
    userId: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel: number | null
    createdAt: Date
    _count: MemorySessionCountAggregateOutputType | null
    _avg: MemorySessionAvgAggregateOutputType | null
    _sum: MemorySessionSumAggregateOutputType | null
    _min: MemorySessionMinAggregateOutputType | null
    _max: MemorySessionMaxAggregateOutputType | null
  }

  type GetMemorySessionGroupByPayload<T extends MemorySessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemorySessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemorySessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>
            : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>
        }
      >
    >


  export type MemorySessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    pieceCount?: boolean
    memorizeTimeSeconds?: boolean
    correctPieces?: boolean
    totalPieces?: boolean
    accuracy?: boolean
    progressiveLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    pieceCount?: boolean
    memorizeTimeSeconds?: boolean
    correctPieces?: boolean
    totalPieces?: boolean
    accuracy?: boolean
    progressiveLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    pieceCount?: boolean
    memorizeTimeSeconds?: boolean
    correctPieces?: boolean
    totalPieces?: boolean
    accuracy?: boolean
    progressiveLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectScalar = {
    id?: boolean
    userId?: boolean
    mode?: boolean
    pieceCount?: boolean
    memorizeTimeSeconds?: boolean
    correctPieces?: boolean
    totalPieces?: boolean
    accuracy?: boolean
    progressiveLevel?: boolean
    createdAt?: boolean
  }

  export type MemorySessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "mode" | "pieceCount" | "memorizeTimeSeconds" | "correctPieces" | "totalPieces" | "accuracy" | "progressiveLevel" | "createdAt", ExtArgs["result"]["memorySession"]>
  export type MemorySessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MemorySessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MemorySessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MemorySessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MemorySession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      mode: string
      pieceCount: number
      memorizeTimeSeconds: number
      correctPieces: number
      totalPieces: number
      accuracy: number
      progressiveLevel: number | null
      createdAt: Date
    }, ExtArgs["result"]["memorySession"]>
    composites: {}
  }

  type MemorySessionGetPayload<S extends boolean | null | undefined | MemorySessionDefaultArgs> = $Result.GetResult<Prisma.$MemorySessionPayload, S>

  type MemorySessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemorySessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemorySessionCountAggregateInputType | true
    }

  export interface MemorySessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MemorySession'], meta: { name: 'MemorySession' } }
    /**
     * Find zero or one MemorySession that matches the filter.
     * @param {MemorySessionFindUniqueArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemorySessionFindUniqueArgs>(args: SelectSubset<T, MemorySessionFindUniqueArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MemorySession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemorySessionFindUniqueOrThrowArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemorySessionFindUniqueOrThrowArgs>(args: SelectSubset<T, MemorySessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemorySession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindFirstArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemorySessionFindFirstArgs>(args?: SelectSubset<T, MemorySessionFindFirstArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemorySession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindFirstOrThrowArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemorySessionFindFirstOrThrowArgs>(args?: SelectSubset<T, MemorySessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MemorySessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MemorySessions
     * const memorySessions = await prisma.memorySession.findMany()
     * 
     * // Get first 10 MemorySessions
     * const memorySessions = await prisma.memorySession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemorySessionFindManyArgs>(args?: SelectSubset<T, MemorySessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MemorySession.
     * @param {MemorySessionCreateArgs} args - Arguments to create a MemorySession.
     * @example
     * // Create one MemorySession
     * const MemorySession = await prisma.memorySession.create({
     *   data: {
     *     // ... data to create a MemorySession
     *   }
     * })
     * 
     */
    create<T extends MemorySessionCreateArgs>(args: SelectSubset<T, MemorySessionCreateArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MemorySessions.
     * @param {MemorySessionCreateManyArgs} args - Arguments to create many MemorySessions.
     * @example
     * // Create many MemorySessions
     * const memorySession = await prisma.memorySession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemorySessionCreateManyArgs>(args?: SelectSubset<T, MemorySessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MemorySessions and returns the data saved in the database.
     * @param {MemorySessionCreateManyAndReturnArgs} args - Arguments to create many MemorySessions.
     * @example
     * // Create many MemorySessions
     * const memorySession = await prisma.memorySession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MemorySessions and only return the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemorySessionCreateManyAndReturnArgs>(args?: SelectSubset<T, MemorySessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MemorySession.
     * @param {MemorySessionDeleteArgs} args - Arguments to delete one MemorySession.
     * @example
     * // Delete one MemorySession
     * const MemorySession = await prisma.memorySession.delete({
     *   where: {
     *     // ... filter to delete one MemorySession
     *   }
     * })
     * 
     */
    delete<T extends MemorySessionDeleteArgs>(args: SelectSubset<T, MemorySessionDeleteArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MemorySession.
     * @param {MemorySessionUpdateArgs} args - Arguments to update one MemorySession.
     * @example
     * // Update one MemorySession
     * const memorySession = await prisma.memorySession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemorySessionUpdateArgs>(args: SelectSubset<T, MemorySessionUpdateArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MemorySessions.
     * @param {MemorySessionDeleteManyArgs} args - Arguments to filter MemorySessions to delete.
     * @example
     * // Delete a few MemorySessions
     * const { count } = await prisma.memorySession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemorySessionDeleteManyArgs>(args?: SelectSubset<T, MemorySessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemorySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MemorySessions
     * const memorySession = await prisma.memorySession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemorySessionUpdateManyArgs>(args: SelectSubset<T, MemorySessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemorySessions and returns the data updated in the database.
     * @param {MemorySessionUpdateManyAndReturnArgs} args - Arguments to update many MemorySessions.
     * @example
     * // Update many MemorySessions
     * const memorySession = await prisma.memorySession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MemorySessions and only return the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemorySessionUpdateManyAndReturnArgs>(args: SelectSubset<T, MemorySessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MemorySession.
     * @param {MemorySessionUpsertArgs} args - Arguments to update or create a MemorySession.
     * @example
     * // Update or create a MemorySession
     * const memorySession = await prisma.memorySession.upsert({
     *   create: {
     *     // ... data to create a MemorySession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MemorySession we want to update
     *   }
     * })
     */
    upsert<T extends MemorySessionUpsertArgs>(args: SelectSubset<T, MemorySessionUpsertArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MemorySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionCountArgs} args - Arguments to filter MemorySessions to count.
     * @example
     * // Count the number of MemorySessions
     * const count = await prisma.memorySession.count({
     *   where: {
     *     // ... the filter for the MemorySessions we want to count
     *   }
     * })
    **/
    count<T extends MemorySessionCountArgs>(
      args?: Subset<T, MemorySessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemorySessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MemorySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemorySessionAggregateArgs>(args: Subset<T, MemorySessionAggregateArgs>): Prisma.PrismaPromise<GetMemorySessionAggregateType<T>>

    /**
     * Group by MemorySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemorySessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemorySessionGroupByArgs['orderBy'] }
        : { orderBy?: MemorySessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemorySessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemorySessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MemorySession model
   */
  readonly fields: MemorySessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MemorySession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemorySessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MemorySession model
   */
  interface MemorySessionFieldRefs {
    readonly id: FieldRef<"MemorySession", 'String'>
    readonly userId: FieldRef<"MemorySession", 'String'>
    readonly mode: FieldRef<"MemorySession", 'String'>
    readonly pieceCount: FieldRef<"MemorySession", 'Int'>
    readonly memorizeTimeSeconds: FieldRef<"MemorySession", 'Int'>
    readonly correctPieces: FieldRef<"MemorySession", 'Int'>
    readonly totalPieces: FieldRef<"MemorySession", 'Int'>
    readonly accuracy: FieldRef<"MemorySession", 'Float'>
    readonly progressiveLevel: FieldRef<"MemorySession", 'Int'>
    readonly createdAt: FieldRef<"MemorySession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MemorySession findUnique
   */
  export type MemorySessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession findUniqueOrThrow
   */
  export type MemorySessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession findFirst
   */
  export type MemorySessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemorySessions.
     */
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession findFirstOrThrow
   */
  export type MemorySessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemorySessions.
     */
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession findMany
   */
  export type MemorySessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter, which MemorySessions to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession create
   */
  export type MemorySessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * The data needed to create a MemorySession.
     */
    data: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>
  }

  /**
   * MemorySession createMany
   */
  export type MemorySessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MemorySessions.
     */
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MemorySession createManyAndReturn
   */
  export type MemorySessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data used to create many MemorySessions.
     */
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MemorySession update
   */
  export type MemorySessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * The data needed to update a MemorySession.
     */
    data: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>
    /**
     * Choose, which MemorySession to update.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession updateMany
   */
  export type MemorySessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MemorySessions.
     */
    data: XOR<MemorySessionUpdateManyMutationInput, MemorySessionUncheckedUpdateManyInput>
    /**
     * Filter which MemorySessions to update
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to update.
     */
    limit?: number
  }

  /**
   * MemorySession updateManyAndReturn
   */
  export type MemorySessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data used to update MemorySessions.
     */
    data: XOR<MemorySessionUpdateManyMutationInput, MemorySessionUncheckedUpdateManyInput>
    /**
     * Filter which MemorySessions to update
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MemorySession upsert
   */
  export type MemorySessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * The filter to search for the MemorySession to update in case it exists.
     */
    where: MemorySessionWhereUniqueInput
    /**
     * In case the MemorySession found by the `where` argument doesn't exist, create a new MemorySession with this data.
     */
    create: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>
    /**
     * In case the MemorySession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>
  }

  /**
   * MemorySession delete
   */
  export type MemorySessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
    /**
     * Filter which MemorySession to delete.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession deleteMany
   */
  export type MemorySessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemorySessions to delete
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to delete.
     */
    limit?: number
  }

  /**
   * MemorySession without action
   */
  export type MemorySessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemorySessionInclude<ExtArgs> | null
  }


  /**
   * Model VisionSession
   */

  export type AggregateVisionSession = {
    _count: VisionSessionCountAggregateOutputType | null
    _avg: VisionSessionAvgAggregateOutputType | null
    _sum: VisionSessionSumAggregateOutputType | null
    _min: VisionSessionMinAggregateOutputType | null
    _max: VisionSessionMaxAggregateOutputType | null
  }

  export type VisionSessionAvgAggregateOutputType = {
    timeLimitSeconds: number | null
    score: number | null
    totalAttempts: number | null
    accuracy: number | null
    avgResponseTimeMs: number | null
  }

  export type VisionSessionSumAggregateOutputType = {
    timeLimitSeconds: number | null
    score: number | null
    totalAttempts: number | null
    accuracy: number | null
    avgResponseTimeMs: number | null
  }

  export type VisionSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    trainingMode: string | null
    colorMode: string | null
    timeLimitSeconds: number | null
    score: number | null
    totalAttempts: number | null
    accuracy: number | null
    avgResponseTimeMs: number | null
    createdAt: Date | null
  }

  export type VisionSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    trainingMode: string | null
    colorMode: string | null
    timeLimitSeconds: number | null
    score: number | null
    totalAttempts: number | null
    accuracy: number | null
    avgResponseTimeMs: number | null
    createdAt: Date | null
  }

  export type VisionSessionCountAggregateOutputType = {
    id: number
    userId: number
    trainingMode: number
    colorMode: number
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt: number
    _all: number
  }


  export type VisionSessionAvgAggregateInputType = {
    timeLimitSeconds?: true
    score?: true
    totalAttempts?: true
    accuracy?: true
    avgResponseTimeMs?: true
  }

  export type VisionSessionSumAggregateInputType = {
    timeLimitSeconds?: true
    score?: true
    totalAttempts?: true
    accuracy?: true
    avgResponseTimeMs?: true
  }

  export type VisionSessionMinAggregateInputType = {
    id?: true
    userId?: true
    trainingMode?: true
    colorMode?: true
    timeLimitSeconds?: true
    score?: true
    totalAttempts?: true
    accuracy?: true
    avgResponseTimeMs?: true
    createdAt?: true
  }

  export type VisionSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    trainingMode?: true
    colorMode?: true
    timeLimitSeconds?: true
    score?: true
    totalAttempts?: true
    accuracy?: true
    avgResponseTimeMs?: true
    createdAt?: true
  }

  export type VisionSessionCountAggregateInputType = {
    id?: true
    userId?: true
    trainingMode?: true
    colorMode?: true
    timeLimitSeconds?: true
    score?: true
    totalAttempts?: true
    accuracy?: true
    avgResponseTimeMs?: true
    createdAt?: true
    _all?: true
  }

  export type VisionSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisionSession to aggregate.
     */
    where?: VisionSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisionSessions to fetch.
     */
    orderBy?: VisionSessionOrderByWithRelationInput | VisionSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisionSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisionSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisionSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisionSessions
    **/
    _count?: true | VisionSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VisionSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VisionSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisionSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisionSessionMaxAggregateInputType
  }

  export type GetVisionSessionAggregateType<T extends VisionSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateVisionSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisionSession[P]>
      : GetScalarType<T[P], AggregateVisionSession[P]>
  }




  export type VisionSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisionSessionWhereInput
    orderBy?: VisionSessionOrderByWithAggregationInput | VisionSessionOrderByWithAggregationInput[]
    by: VisionSessionScalarFieldEnum[] | VisionSessionScalarFieldEnum
    having?: VisionSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisionSessionCountAggregateInputType | true
    _avg?: VisionSessionAvgAggregateInputType
    _sum?: VisionSessionSumAggregateInputType
    _min?: VisionSessionMinAggregateInputType
    _max?: VisionSessionMaxAggregateInputType
  }

  export type VisionSessionGroupByOutputType = {
    id: string
    userId: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt: Date
    _count: VisionSessionCountAggregateOutputType | null
    _avg: VisionSessionAvgAggregateOutputType | null
    _sum: VisionSessionSumAggregateOutputType | null
    _min: VisionSessionMinAggregateOutputType | null
    _max: VisionSessionMaxAggregateOutputType | null
  }

  type GetVisionSessionGroupByPayload<T extends VisionSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisionSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisionSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisionSessionGroupByOutputType[P]>
            : GetScalarType<T[P], VisionSessionGroupByOutputType[P]>
        }
      >
    >


  export type VisionSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trainingMode?: boolean
    colorMode?: boolean
    timeLimitSeconds?: boolean
    score?: boolean
    totalAttempts?: boolean
    accuracy?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visionSession"]>

  export type VisionSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trainingMode?: boolean
    colorMode?: boolean
    timeLimitSeconds?: boolean
    score?: boolean
    totalAttempts?: boolean
    accuracy?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visionSession"]>

  export type VisionSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trainingMode?: boolean
    colorMode?: boolean
    timeLimitSeconds?: boolean
    score?: boolean
    totalAttempts?: boolean
    accuracy?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visionSession"]>

  export type VisionSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    trainingMode?: boolean
    colorMode?: boolean
    timeLimitSeconds?: boolean
    score?: boolean
    totalAttempts?: boolean
    accuracy?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
  }

  export type VisionSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "trainingMode" | "colorMode" | "timeLimitSeconds" | "score" | "totalAttempts" | "accuracy" | "avgResponseTimeMs" | "createdAt", ExtArgs["result"]["visionSession"]>
  export type VisionSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VisionSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VisionSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VisionSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisionSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      trainingMode: string
      colorMode: string
      timeLimitSeconds: number
      score: number
      totalAttempts: number
      accuracy: number
      avgResponseTimeMs: number
      createdAt: Date
    }, ExtArgs["result"]["visionSession"]>
    composites: {}
  }

  type VisionSessionGetPayload<S extends boolean | null | undefined | VisionSessionDefaultArgs> = $Result.GetResult<Prisma.$VisionSessionPayload, S>

  type VisionSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VisionSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VisionSessionCountAggregateInputType | true
    }

  export interface VisionSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisionSession'], meta: { name: 'VisionSession' } }
    /**
     * Find zero or one VisionSession that matches the filter.
     * @param {VisionSessionFindUniqueArgs} args - Arguments to find a VisionSession
     * @example
     * // Get one VisionSession
     * const visionSession = await prisma.visionSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisionSessionFindUniqueArgs>(args: SelectSubset<T, VisionSessionFindUniqueArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VisionSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VisionSessionFindUniqueOrThrowArgs} args - Arguments to find a VisionSession
     * @example
     * // Get one VisionSession
     * const visionSession = await prisma.visionSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisionSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, VisionSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisionSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionFindFirstArgs} args - Arguments to find a VisionSession
     * @example
     * // Get one VisionSession
     * const visionSession = await prisma.visionSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisionSessionFindFirstArgs>(args?: SelectSubset<T, VisionSessionFindFirstArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VisionSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionFindFirstOrThrowArgs} args - Arguments to find a VisionSession
     * @example
     * // Get one VisionSession
     * const visionSession = await prisma.visionSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisionSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, VisionSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VisionSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisionSessions
     * const visionSessions = await prisma.visionSession.findMany()
     * 
     * // Get first 10 VisionSessions
     * const visionSessions = await prisma.visionSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visionSessionWithIdOnly = await prisma.visionSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisionSessionFindManyArgs>(args?: SelectSubset<T, VisionSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VisionSession.
     * @param {VisionSessionCreateArgs} args - Arguments to create a VisionSession.
     * @example
     * // Create one VisionSession
     * const VisionSession = await prisma.visionSession.create({
     *   data: {
     *     // ... data to create a VisionSession
     *   }
     * })
     * 
     */
    create<T extends VisionSessionCreateArgs>(args: SelectSubset<T, VisionSessionCreateArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VisionSessions.
     * @param {VisionSessionCreateManyArgs} args - Arguments to create many VisionSessions.
     * @example
     * // Create many VisionSessions
     * const visionSession = await prisma.visionSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisionSessionCreateManyArgs>(args?: SelectSubset<T, VisionSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisionSessions and returns the data saved in the database.
     * @param {VisionSessionCreateManyAndReturnArgs} args - Arguments to create many VisionSessions.
     * @example
     * // Create many VisionSessions
     * const visionSession = await prisma.visionSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisionSessions and only return the `id`
     * const visionSessionWithIdOnly = await prisma.visionSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisionSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, VisionSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VisionSession.
     * @param {VisionSessionDeleteArgs} args - Arguments to delete one VisionSession.
     * @example
     * // Delete one VisionSession
     * const VisionSession = await prisma.visionSession.delete({
     *   where: {
     *     // ... filter to delete one VisionSession
     *   }
     * })
     * 
     */
    delete<T extends VisionSessionDeleteArgs>(args: SelectSubset<T, VisionSessionDeleteArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VisionSession.
     * @param {VisionSessionUpdateArgs} args - Arguments to update one VisionSession.
     * @example
     * // Update one VisionSession
     * const visionSession = await prisma.visionSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisionSessionUpdateArgs>(args: SelectSubset<T, VisionSessionUpdateArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VisionSessions.
     * @param {VisionSessionDeleteManyArgs} args - Arguments to filter VisionSessions to delete.
     * @example
     * // Delete a few VisionSessions
     * const { count } = await prisma.visionSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisionSessionDeleteManyArgs>(args?: SelectSubset<T, VisionSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisionSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisionSessions
     * const visionSession = await prisma.visionSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisionSessionUpdateManyArgs>(args: SelectSubset<T, VisionSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisionSessions and returns the data updated in the database.
     * @param {VisionSessionUpdateManyAndReturnArgs} args - Arguments to update many VisionSessions.
     * @example
     * // Update many VisionSessions
     * const visionSession = await prisma.visionSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VisionSessions and only return the `id`
     * const visionSessionWithIdOnly = await prisma.visionSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VisionSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, VisionSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VisionSession.
     * @param {VisionSessionUpsertArgs} args - Arguments to update or create a VisionSession.
     * @example
     * // Update or create a VisionSession
     * const visionSession = await prisma.visionSession.upsert({
     *   create: {
     *     // ... data to create a VisionSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisionSession we want to update
     *   }
     * })
     */
    upsert<T extends VisionSessionUpsertArgs>(args: SelectSubset<T, VisionSessionUpsertArgs<ExtArgs>>): Prisma__VisionSessionClient<$Result.GetResult<Prisma.$VisionSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VisionSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionCountArgs} args - Arguments to filter VisionSessions to count.
     * @example
     * // Count the number of VisionSessions
     * const count = await prisma.visionSession.count({
     *   where: {
     *     // ... the filter for the VisionSessions we want to count
     *   }
     * })
    **/
    count<T extends VisionSessionCountArgs>(
      args?: Subset<T, VisionSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisionSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisionSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisionSessionAggregateArgs>(args: Subset<T, VisionSessionAggregateArgs>): Prisma.PrismaPromise<GetVisionSessionAggregateType<T>>

    /**
     * Group by VisionSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisionSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisionSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisionSessionGroupByArgs['orderBy'] }
        : { orderBy?: VisionSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisionSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisionSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisionSession model
   */
  readonly fields: VisionSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisionSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisionSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VisionSession model
   */
  interface VisionSessionFieldRefs {
    readonly id: FieldRef<"VisionSession", 'String'>
    readonly userId: FieldRef<"VisionSession", 'String'>
    readonly trainingMode: FieldRef<"VisionSession", 'String'>
    readonly colorMode: FieldRef<"VisionSession", 'String'>
    readonly timeLimitSeconds: FieldRef<"VisionSession", 'Int'>
    readonly score: FieldRef<"VisionSession", 'Int'>
    readonly totalAttempts: FieldRef<"VisionSession", 'Int'>
    readonly accuracy: FieldRef<"VisionSession", 'Float'>
    readonly avgResponseTimeMs: FieldRef<"VisionSession", 'Int'>
    readonly createdAt: FieldRef<"VisionSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VisionSession findUnique
   */
  export type VisionSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter, which VisionSession to fetch.
     */
    where: VisionSessionWhereUniqueInput
  }

  /**
   * VisionSession findUniqueOrThrow
   */
  export type VisionSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter, which VisionSession to fetch.
     */
    where: VisionSessionWhereUniqueInput
  }

  /**
   * VisionSession findFirst
   */
  export type VisionSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter, which VisionSession to fetch.
     */
    where?: VisionSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisionSessions to fetch.
     */
    orderBy?: VisionSessionOrderByWithRelationInput | VisionSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisionSessions.
     */
    cursor?: VisionSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisionSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisionSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisionSessions.
     */
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[]
  }

  /**
   * VisionSession findFirstOrThrow
   */
  export type VisionSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter, which VisionSession to fetch.
     */
    where?: VisionSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisionSessions to fetch.
     */
    orderBy?: VisionSessionOrderByWithRelationInput | VisionSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisionSessions.
     */
    cursor?: VisionSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisionSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisionSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisionSessions.
     */
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[]
  }

  /**
   * VisionSession findMany
   */
  export type VisionSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter, which VisionSessions to fetch.
     */
    where?: VisionSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisionSessions to fetch.
     */
    orderBy?: VisionSessionOrderByWithRelationInput | VisionSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisionSessions.
     */
    cursor?: VisionSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisionSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisionSessions.
     */
    skip?: number
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[]
  }

  /**
   * VisionSession create
   */
  export type VisionSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a VisionSession.
     */
    data: XOR<VisionSessionCreateInput, VisionSessionUncheckedCreateInput>
  }

  /**
   * VisionSession createMany
   */
  export type VisionSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisionSessions.
     */
    data: VisionSessionCreateManyInput | VisionSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisionSession createManyAndReturn
   */
  export type VisionSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * The data used to create many VisionSessions.
     */
    data: VisionSessionCreateManyInput | VisionSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisionSession update
   */
  export type VisionSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a VisionSession.
     */
    data: XOR<VisionSessionUpdateInput, VisionSessionUncheckedUpdateInput>
    /**
     * Choose, which VisionSession to update.
     */
    where: VisionSessionWhereUniqueInput
  }

  /**
   * VisionSession updateMany
   */
  export type VisionSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisionSessions.
     */
    data: XOR<VisionSessionUpdateManyMutationInput, VisionSessionUncheckedUpdateManyInput>
    /**
     * Filter which VisionSessions to update
     */
    where?: VisionSessionWhereInput
    /**
     * Limit how many VisionSessions to update.
     */
    limit?: number
  }

  /**
   * VisionSession updateManyAndReturn
   */
  export type VisionSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * The data used to update VisionSessions.
     */
    data: XOR<VisionSessionUpdateManyMutationInput, VisionSessionUncheckedUpdateManyInput>
    /**
     * Filter which VisionSessions to update
     */
    where?: VisionSessionWhereInput
    /**
     * Limit how many VisionSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisionSession upsert
   */
  export type VisionSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the VisionSession to update in case it exists.
     */
    where: VisionSessionWhereUniqueInput
    /**
     * In case the VisionSession found by the `where` argument doesn't exist, create a new VisionSession with this data.
     */
    create: XOR<VisionSessionCreateInput, VisionSessionUncheckedCreateInput>
    /**
     * In case the VisionSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisionSessionUpdateInput, VisionSessionUncheckedUpdateInput>
  }

  /**
   * VisionSession delete
   */
  export type VisionSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
    /**
     * Filter which VisionSession to delete.
     */
    where: VisionSessionWhereUniqueInput
  }

  /**
   * VisionSession deleteMany
   */
  export type VisionSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisionSessions to delete
     */
    where?: VisionSessionWhereInput
    /**
     * Limit how many VisionSessions to delete.
     */
    limit?: number
  }

  /**
   * VisionSession without action
   */
  export type VisionSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisionSession
     */
    select?: VisionSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VisionSession
     */
    omit?: VisionSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisionSessionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    flagCode: 'flagCode',
    banned: 'banned',
    bannedAt: 'bannedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PassportFlagScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    flagCode: 'flagCode',
    createdAt: 'createdAt'
  };

  export type PassportFlagScalarFieldEnum = (typeof PassportFlagScalarFieldEnum)[keyof typeof PassportFlagScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const AuthenticatorScalarFieldEnum: {
    credentialID: 'credentialID',
    userId: 'userId',
    providerAccountId: 'providerAccountId',
    credentialPublicKey: 'credentialPublicKey',
    counter: 'counter',
    credentialDeviceType: 'credentialDeviceType',
    credentialBackedUp: 'credentialBackedUp',
    transports: 'transports'
  };

  export type AuthenticatorScalarFieldEnum = (typeof AuthenticatorScalarFieldEnum)[keyof typeof AuthenticatorScalarFieldEnum]


  export const GameScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    whiteUserId: 'whiteUserId',
    blackUserId: 'blackUserId',
    variant: 'variant',
    gameType: 'gameType',
    result: 'result',
    resultReason: 'resultReason',
    moves: 'moves',
    startingFen: 'startingFen',
    timeControl: 'timeControl',
    whitePregameRating: 'whitePregameRating',
    blackPregameRating: 'blackPregameRating',
    whiteRatingDelta: 'whiteRatingDelta',
    blackRatingDelta: 'blackRatingDelta',
    moveCount: 'moveCount',
    rated: 'rated',
    playedAt: 'playedAt',
    createdAt: 'createdAt'
  };

  export type GameScalarFieldEnum = (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum]


  export const GameAnalysisScalarFieldEnum: {
    id: 'id',
    gameId: 'gameId',
    userId: 'userId',
    results: 'results',
    createdAt: 'createdAt'
  };

  export type GameAnalysisScalarFieldEnum = (typeof GameAnalysisScalarFieldEnum)[keyof typeof GameAnalysisScalarFieldEnum]


  export const RatingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    variant: 'variant',
    category: 'category',
    rating: 'rating',
    rd: 'rd',
    sigma: 'sigma',
    gameCount: 'gameCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RatingScalarFieldEnum = (typeof RatingScalarFieldEnum)[keyof typeof RatingScalarFieldEnum]


  export const PuzzleRatingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    rating: 'rating',
    rd: 'rd',
    sigma: 'sigma',
    gameCount: 'gameCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PuzzleRatingScalarFieldEnum = (typeof PuzzleRatingScalarFieldEnum)[keyof typeof PuzzleRatingScalarFieldEnum]


  export const PuzzleAttemptScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    puzzleId: 'puzzleId',
    difficulty: 'difficulty',
    rating: 'rating',
    solved: 'solved',
    usedHint: 'usedHint',
    createdAt: 'createdAt'
  };

  export type PuzzleAttemptScalarFieldEnum = (typeof PuzzleAttemptScalarFieldEnum)[keyof typeof PuzzleAttemptScalarFieldEnum]


  export const PuzzleRushScoreScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    mode: 'mode',
    difficulty: 'difficulty',
    score: 'score',
    mistakes: 'mistakes',
    timeLimitSeconds: 'timeLimitSeconds',
    maxMistakes: 'maxMistakes',
    createdAt: 'createdAt'
  };

  export type PuzzleRushScoreScalarFieldEnum = (typeof PuzzleRushScoreScalarFieldEnum)[keyof typeof PuzzleRushScoreScalarFieldEnum]


  export const MemorySessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    mode: 'mode',
    pieceCount: 'pieceCount',
    memorizeTimeSeconds: 'memorizeTimeSeconds',
    correctPieces: 'correctPieces',
    totalPieces: 'totalPieces',
    accuracy: 'accuracy',
    progressiveLevel: 'progressiveLevel',
    createdAt: 'createdAt'
  };

  export type MemorySessionScalarFieldEnum = (typeof MemorySessionScalarFieldEnum)[keyof typeof MemorySessionScalarFieldEnum]


  export const VisionSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    trainingMode: 'trainingMode',
    colorMode: 'colorMode',
    timeLimitSeconds: 'timeLimitSeconds',
    score: 'score',
    totalAttempts: 'totalAttempts',
    accuracy: 'accuracy',
    avgResponseTimeMs: 'avgResponseTimeMs',
    createdAt: 'createdAt'
  };

  export type VisionSessionScalarFieldEnum = (typeof VisionSessionScalarFieldEnum)[keyof typeof VisionSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    flagCode?: StringFilter<"User"> | string
    banned?: BoolFilter<"User"> | boolean
    bannedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    Authenticator?: AuthenticatorListRelationFilter
    whiteGames?: GameListRelationFilter
    blackGames?: GameListRelationFilter
    ratings?: RatingListRelationFilter
    puzzleRating?: XOR<PuzzleRatingNullableScalarRelationFilter, PuzzleRatingWhereInput> | null
    analyses?: GameAnalysisListRelationFilter
    puzzleAttempts?: PuzzleAttemptListRelationFilter
    puzzleRushScores?: PuzzleRushScoreListRelationFilter
    memorySessions?: MemorySessionListRelationFilter
    visionSessions?: VisionSessionListRelationFilter
    passportFlags?: PassportFlagListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    flagCode?: SortOrder
    banned?: SortOrder
    bannedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    Authenticator?: AuthenticatorOrderByRelationAggregateInput
    whiteGames?: GameOrderByRelationAggregateInput
    blackGames?: GameOrderByRelationAggregateInput
    ratings?: RatingOrderByRelationAggregateInput
    puzzleRating?: PuzzleRatingOrderByWithRelationInput
    analyses?: GameAnalysisOrderByRelationAggregateInput
    puzzleAttempts?: PuzzleAttemptOrderByRelationAggregateInput
    puzzleRushScores?: PuzzleRushScoreOrderByRelationAggregateInput
    memorySessions?: MemorySessionOrderByRelationAggregateInput
    visionSessions?: VisionSessionOrderByRelationAggregateInput
    passportFlags?: PassportFlagOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    flagCode?: StringFilter<"User"> | string
    banned?: BoolFilter<"User"> | boolean
    bannedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    Authenticator?: AuthenticatorListRelationFilter
    whiteGames?: GameListRelationFilter
    blackGames?: GameListRelationFilter
    ratings?: RatingListRelationFilter
    puzzleRating?: XOR<PuzzleRatingNullableScalarRelationFilter, PuzzleRatingWhereInput> | null
    analyses?: GameAnalysisListRelationFilter
    puzzleAttempts?: PuzzleAttemptListRelationFilter
    puzzleRushScores?: PuzzleRushScoreListRelationFilter
    memorySessions?: MemorySessionListRelationFilter
    visionSessions?: VisionSessionListRelationFilter
    passportFlags?: PassportFlagListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    flagCode?: SortOrder
    banned?: SortOrder
    bannedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    flagCode?: StringWithAggregatesFilter<"User"> | string
    banned?: BoolWithAggregatesFilter<"User"> | boolean
    bannedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PassportFlagWhereInput = {
    AND?: PassportFlagWhereInput | PassportFlagWhereInput[]
    OR?: PassportFlagWhereInput[]
    NOT?: PassportFlagWhereInput | PassportFlagWhereInput[]
    id?: StringFilter<"PassportFlag"> | string
    userId?: StringFilter<"PassportFlag"> | string
    flagCode?: StringFilter<"PassportFlag"> | string
    createdAt?: DateTimeFilter<"PassportFlag"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PassportFlagOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    flagCode?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PassportFlagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_flagCode?: PassportFlagUserIdFlagCodeCompoundUniqueInput
    AND?: PassportFlagWhereInput | PassportFlagWhereInput[]
    OR?: PassportFlagWhereInput[]
    NOT?: PassportFlagWhereInput | PassportFlagWhereInput[]
    userId?: StringFilter<"PassportFlag"> | string
    flagCode?: StringFilter<"PassportFlag"> | string
    createdAt?: DateTimeFilter<"PassportFlag"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_flagCode">

  export type PassportFlagOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    flagCode?: SortOrder
    createdAt?: SortOrder
    _count?: PassportFlagCountOrderByAggregateInput
    _max?: PassportFlagMaxOrderByAggregateInput
    _min?: PassportFlagMinOrderByAggregateInput
  }

  export type PassportFlagScalarWhereWithAggregatesInput = {
    AND?: PassportFlagScalarWhereWithAggregatesInput | PassportFlagScalarWhereWithAggregatesInput[]
    OR?: PassportFlagScalarWhereWithAggregatesInput[]
    NOT?: PassportFlagScalarWhereWithAggregatesInput | PassportFlagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PassportFlag"> | string
    userId?: StringWithAggregatesFilter<"PassportFlag"> | string
    flagCode?: StringWithAggregatesFilter<"PassportFlag"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PassportFlag"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type AuthenticatorWhereInput = {
    AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    OR?: AuthenticatorWhereInput[]
    NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    credentialID?: StringFilter<"Authenticator"> | string
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuthenticatorOrderByWithRelationInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuthenticatorWhereUniqueInput = Prisma.AtLeast<{
    credentialID?: string
    userId_credentialID?: AuthenticatorUserIdCredentialIDCompoundUniqueInput
    AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    OR?: AuthenticatorWhereInput[]
    NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[]
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "userId_credentialID" | "credentialID">

  export type AuthenticatorOrderByWithAggregationInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrderInput | SortOrder
    _count?: AuthenticatorCountOrderByAggregateInput
    _avg?: AuthenticatorAvgOrderByAggregateInput
    _max?: AuthenticatorMaxOrderByAggregateInput
    _min?: AuthenticatorMinOrderByAggregateInput
    _sum?: AuthenticatorSumOrderByAggregateInput
  }

  export type AuthenticatorScalarWhereWithAggregatesInput = {
    AND?: AuthenticatorScalarWhereWithAggregatesInput | AuthenticatorScalarWhereWithAggregatesInput[]
    OR?: AuthenticatorScalarWhereWithAggregatesInput[]
    NOT?: AuthenticatorScalarWhereWithAggregatesInput | AuthenticatorScalarWhereWithAggregatesInput[]
    credentialID?: StringWithAggregatesFilter<"Authenticator"> | string
    userId?: StringWithAggregatesFilter<"Authenticator"> | string
    providerAccountId?: StringWithAggregatesFilter<"Authenticator"> | string
    credentialPublicKey?: StringWithAggregatesFilter<"Authenticator"> | string
    counter?: IntWithAggregatesFilter<"Authenticator"> | number
    credentialDeviceType?: StringWithAggregatesFilter<"Authenticator"> | string
    credentialBackedUp?: BoolWithAggregatesFilter<"Authenticator"> | boolean
    transports?: StringNullableWithAggregatesFilter<"Authenticator"> | string | null
  }

  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    id?: StringFilter<"Game"> | string
    roomId?: StringNullableFilter<"Game"> | string | null
    whiteUserId?: StringNullableFilter<"Game"> | string | null
    blackUserId?: StringNullableFilter<"Game"> | string | null
    variant?: StringFilter<"Game"> | string
    gameType?: StringFilter<"Game"> | string
    result?: StringFilter<"Game"> | string
    resultReason?: StringFilter<"Game"> | string
    moves?: StringNullableListFilter<"Game">
    startingFen?: StringFilter<"Game"> | string
    timeControl?: JsonFilter<"Game">
    whitePregameRating?: IntNullableFilter<"Game"> | number | null
    blackPregameRating?: IntNullableFilter<"Game"> | number | null
    whiteRatingDelta?: IntNullableFilter<"Game"> | number | null
    blackRatingDelta?: IntNullableFilter<"Game"> | number | null
    moveCount?: IntFilter<"Game"> | number
    rated?: BoolFilter<"Game"> | boolean
    playedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeFilter<"Game"> | Date | string
    white?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    black?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    analysis?: XOR<GameAnalysisNullableScalarRelationFilter, GameAnalysisWhereInput> | null
  }

  export type GameOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrderInput | SortOrder
    whiteUserId?: SortOrderInput | SortOrder
    blackUserId?: SortOrderInput | SortOrder
    variant?: SortOrder
    gameType?: SortOrder
    result?: SortOrder
    resultReason?: SortOrder
    moves?: SortOrder
    startingFen?: SortOrder
    timeControl?: SortOrder
    whitePregameRating?: SortOrderInput | SortOrder
    blackPregameRating?: SortOrderInput | SortOrder
    whiteRatingDelta?: SortOrderInput | SortOrder
    blackRatingDelta?: SortOrderInput | SortOrder
    moveCount?: SortOrder
    rated?: SortOrder
    playedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    white?: UserOrderByWithRelationInput
    black?: UserOrderByWithRelationInput
    analysis?: GameAnalysisOrderByWithRelationInput
  }

  export type GameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomId?: string
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    whiteUserId?: StringNullableFilter<"Game"> | string | null
    blackUserId?: StringNullableFilter<"Game"> | string | null
    variant?: StringFilter<"Game"> | string
    gameType?: StringFilter<"Game"> | string
    result?: StringFilter<"Game"> | string
    resultReason?: StringFilter<"Game"> | string
    moves?: StringNullableListFilter<"Game">
    startingFen?: StringFilter<"Game"> | string
    timeControl?: JsonFilter<"Game">
    whitePregameRating?: IntNullableFilter<"Game"> | number | null
    blackPregameRating?: IntNullableFilter<"Game"> | number | null
    whiteRatingDelta?: IntNullableFilter<"Game"> | number | null
    blackRatingDelta?: IntNullableFilter<"Game"> | number | null
    moveCount?: IntFilter<"Game"> | number
    rated?: BoolFilter<"Game"> | boolean
    playedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeFilter<"Game"> | Date | string
    white?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    black?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    analysis?: XOR<GameAnalysisNullableScalarRelationFilter, GameAnalysisWhereInput> | null
  }, "id" | "roomId">

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrderInput | SortOrder
    whiteUserId?: SortOrderInput | SortOrder
    blackUserId?: SortOrderInput | SortOrder
    variant?: SortOrder
    gameType?: SortOrder
    result?: SortOrder
    resultReason?: SortOrder
    moves?: SortOrder
    startingFen?: SortOrder
    timeControl?: SortOrder
    whitePregameRating?: SortOrderInput | SortOrder
    blackPregameRating?: SortOrderInput | SortOrder
    whiteRatingDelta?: SortOrderInput | SortOrder
    blackRatingDelta?: SortOrderInput | SortOrder
    moveCount?: SortOrder
    rated?: SortOrder
    playedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GameCountOrderByAggregateInput
    _avg?: GameAvgOrderByAggregateInput
    _max?: GameMaxOrderByAggregateInput
    _min?: GameMinOrderByAggregateInput
    _sum?: GameSumOrderByAggregateInput
  }

  export type GameScalarWhereWithAggregatesInput = {
    AND?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    OR?: GameScalarWhereWithAggregatesInput[]
    NOT?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Game"> | string
    roomId?: StringNullableWithAggregatesFilter<"Game"> | string | null
    whiteUserId?: StringNullableWithAggregatesFilter<"Game"> | string | null
    blackUserId?: StringNullableWithAggregatesFilter<"Game"> | string | null
    variant?: StringWithAggregatesFilter<"Game"> | string
    gameType?: StringWithAggregatesFilter<"Game"> | string
    result?: StringWithAggregatesFilter<"Game"> | string
    resultReason?: StringWithAggregatesFilter<"Game"> | string
    moves?: StringNullableListFilter<"Game">
    startingFen?: StringWithAggregatesFilter<"Game"> | string
    timeControl?: JsonWithAggregatesFilter<"Game">
    whitePregameRating?: IntNullableWithAggregatesFilter<"Game"> | number | null
    blackPregameRating?: IntNullableWithAggregatesFilter<"Game"> | number | null
    whiteRatingDelta?: IntNullableWithAggregatesFilter<"Game"> | number | null
    blackRatingDelta?: IntNullableWithAggregatesFilter<"Game"> | number | null
    moveCount?: IntWithAggregatesFilter<"Game"> | number
    rated?: BoolWithAggregatesFilter<"Game"> | boolean
    playedAt?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Game"> | Date | string
  }

  export type GameAnalysisWhereInput = {
    AND?: GameAnalysisWhereInput | GameAnalysisWhereInput[]
    OR?: GameAnalysisWhereInput[]
    NOT?: GameAnalysisWhereInput | GameAnalysisWhereInput[]
    id?: StringFilter<"GameAnalysis"> | string
    gameId?: StringFilter<"GameAnalysis"> | string
    userId?: StringFilter<"GameAnalysis"> | string
    results?: JsonFilter<"GameAnalysis">
    createdAt?: DateTimeFilter<"GameAnalysis"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type GameAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    gameId?: SortOrder
    userId?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
    game?: GameOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type GameAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gameId?: string
    AND?: GameAnalysisWhereInput | GameAnalysisWhereInput[]
    OR?: GameAnalysisWhereInput[]
    NOT?: GameAnalysisWhereInput | GameAnalysisWhereInput[]
    userId?: StringFilter<"GameAnalysis"> | string
    results?: JsonFilter<"GameAnalysis">
    createdAt?: DateTimeFilter<"GameAnalysis"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "gameId">

  export type GameAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    gameId?: SortOrder
    userId?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
    _count?: GameAnalysisCountOrderByAggregateInput
    _max?: GameAnalysisMaxOrderByAggregateInput
    _min?: GameAnalysisMinOrderByAggregateInput
  }

  export type GameAnalysisScalarWhereWithAggregatesInput = {
    AND?: GameAnalysisScalarWhereWithAggregatesInput | GameAnalysisScalarWhereWithAggregatesInput[]
    OR?: GameAnalysisScalarWhereWithAggregatesInput[]
    NOT?: GameAnalysisScalarWhereWithAggregatesInput | GameAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameAnalysis"> | string
    gameId?: StringWithAggregatesFilter<"GameAnalysis"> | string
    userId?: StringWithAggregatesFilter<"GameAnalysis"> | string
    results?: JsonWithAggregatesFilter<"GameAnalysis">
    createdAt?: DateTimeWithAggregatesFilter<"GameAnalysis"> | Date | string
  }

  export type RatingWhereInput = {
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    id?: StringFilter<"Rating"> | string
    userId?: StringFilter<"Rating"> | string
    variant?: StringFilter<"Rating"> | string
    category?: StringFilter<"Rating"> | string
    rating?: IntFilter<"Rating"> | number
    rd?: FloatFilter<"Rating"> | number
    sigma?: FloatFilter<"Rating"> | number
    gameCount?: IntFilter<"Rating"> | number
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    updatedAt?: DateTimeFilter<"Rating"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RatingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    variant?: SortOrder
    category?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RatingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_variant_category?: RatingUserIdVariantCategoryCompoundUniqueInput
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    userId?: StringFilter<"Rating"> | string
    variant?: StringFilter<"Rating"> | string
    category?: StringFilter<"Rating"> | string
    rating?: IntFilter<"Rating"> | number
    rd?: FloatFilter<"Rating"> | number
    sigma?: FloatFilter<"Rating"> | number
    gameCount?: IntFilter<"Rating"> | number
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    updatedAt?: DateTimeFilter<"Rating"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_variant_category">

  export type RatingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    variant?: SortOrder
    category?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RatingCountOrderByAggregateInput
    _avg?: RatingAvgOrderByAggregateInput
    _max?: RatingMaxOrderByAggregateInput
    _min?: RatingMinOrderByAggregateInput
    _sum?: RatingSumOrderByAggregateInput
  }

  export type RatingScalarWhereWithAggregatesInput = {
    AND?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    OR?: RatingScalarWhereWithAggregatesInput[]
    NOT?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Rating"> | string
    userId?: StringWithAggregatesFilter<"Rating"> | string
    variant?: StringWithAggregatesFilter<"Rating"> | string
    category?: StringWithAggregatesFilter<"Rating"> | string
    rating?: IntWithAggregatesFilter<"Rating"> | number
    rd?: FloatWithAggregatesFilter<"Rating"> | number
    sigma?: FloatWithAggregatesFilter<"Rating"> | number
    gameCount?: IntWithAggregatesFilter<"Rating"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Rating"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Rating"> | Date | string
  }

  export type PuzzleRatingWhereInput = {
    AND?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[]
    OR?: PuzzleRatingWhereInput[]
    NOT?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[]
    id?: StringFilter<"PuzzleRating"> | string
    userId?: StringFilter<"PuzzleRating"> | string
    rating?: IntFilter<"PuzzleRating"> | number
    rd?: FloatFilter<"PuzzleRating"> | number
    sigma?: FloatFilter<"PuzzleRating"> | number
    gameCount?: IntFilter<"PuzzleRating"> | number
    createdAt?: DateTimeFilter<"PuzzleRating"> | Date | string
    updatedAt?: DateTimeFilter<"PuzzleRating"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PuzzleRatingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PuzzleRatingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[]
    OR?: PuzzleRatingWhereInput[]
    NOT?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[]
    rating?: IntFilter<"PuzzleRating"> | number
    rd?: FloatFilter<"PuzzleRating"> | number
    sigma?: FloatFilter<"PuzzleRating"> | number
    gameCount?: IntFilter<"PuzzleRating"> | number
    createdAt?: DateTimeFilter<"PuzzleRating"> | Date | string
    updatedAt?: DateTimeFilter<"PuzzleRating"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type PuzzleRatingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PuzzleRatingCountOrderByAggregateInput
    _avg?: PuzzleRatingAvgOrderByAggregateInput
    _max?: PuzzleRatingMaxOrderByAggregateInput
    _min?: PuzzleRatingMinOrderByAggregateInput
    _sum?: PuzzleRatingSumOrderByAggregateInput
  }

  export type PuzzleRatingScalarWhereWithAggregatesInput = {
    AND?: PuzzleRatingScalarWhereWithAggregatesInput | PuzzleRatingScalarWhereWithAggregatesInput[]
    OR?: PuzzleRatingScalarWhereWithAggregatesInput[]
    NOT?: PuzzleRatingScalarWhereWithAggregatesInput | PuzzleRatingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PuzzleRating"> | string
    userId?: StringWithAggregatesFilter<"PuzzleRating"> | string
    rating?: IntWithAggregatesFilter<"PuzzleRating"> | number
    rd?: FloatWithAggregatesFilter<"PuzzleRating"> | number
    sigma?: FloatWithAggregatesFilter<"PuzzleRating"> | number
    gameCount?: IntWithAggregatesFilter<"PuzzleRating"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PuzzleRating"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PuzzleRating"> | Date | string
  }

  export type PuzzleAttemptWhereInput = {
    AND?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[]
    OR?: PuzzleAttemptWhereInput[]
    NOT?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[]
    id?: StringFilter<"PuzzleAttempt"> | string
    userId?: StringFilter<"PuzzleAttempt"> | string
    puzzleId?: StringFilter<"PuzzleAttempt"> | string
    difficulty?: StringFilter<"PuzzleAttempt"> | string
    rating?: IntFilter<"PuzzleAttempt"> | number
    solved?: BoolFilter<"PuzzleAttempt"> | boolean
    usedHint?: BoolFilter<"PuzzleAttempt"> | boolean
    createdAt?: DateTimeFilter<"PuzzleAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PuzzleAttemptOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    puzzleId?: SortOrder
    difficulty?: SortOrder
    rating?: SortOrder
    solved?: SortOrder
    usedHint?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PuzzleAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[]
    OR?: PuzzleAttemptWhereInput[]
    NOT?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[]
    userId?: StringFilter<"PuzzleAttempt"> | string
    puzzleId?: StringFilter<"PuzzleAttempt"> | string
    difficulty?: StringFilter<"PuzzleAttempt"> | string
    rating?: IntFilter<"PuzzleAttempt"> | number
    solved?: BoolFilter<"PuzzleAttempt"> | boolean
    usedHint?: BoolFilter<"PuzzleAttempt"> | boolean
    createdAt?: DateTimeFilter<"PuzzleAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PuzzleAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    puzzleId?: SortOrder
    difficulty?: SortOrder
    rating?: SortOrder
    solved?: SortOrder
    usedHint?: SortOrder
    createdAt?: SortOrder
    _count?: PuzzleAttemptCountOrderByAggregateInput
    _avg?: PuzzleAttemptAvgOrderByAggregateInput
    _max?: PuzzleAttemptMaxOrderByAggregateInput
    _min?: PuzzleAttemptMinOrderByAggregateInput
    _sum?: PuzzleAttemptSumOrderByAggregateInput
  }

  export type PuzzleAttemptScalarWhereWithAggregatesInput = {
    AND?: PuzzleAttemptScalarWhereWithAggregatesInput | PuzzleAttemptScalarWhereWithAggregatesInput[]
    OR?: PuzzleAttemptScalarWhereWithAggregatesInput[]
    NOT?: PuzzleAttemptScalarWhereWithAggregatesInput | PuzzleAttemptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PuzzleAttempt"> | string
    userId?: StringWithAggregatesFilter<"PuzzleAttempt"> | string
    puzzleId?: StringWithAggregatesFilter<"PuzzleAttempt"> | string
    difficulty?: StringWithAggregatesFilter<"PuzzleAttempt"> | string
    rating?: IntWithAggregatesFilter<"PuzzleAttempt"> | number
    solved?: BoolWithAggregatesFilter<"PuzzleAttempt"> | boolean
    usedHint?: BoolWithAggregatesFilter<"PuzzleAttempt"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PuzzleAttempt"> | Date | string
  }

  export type PuzzleRushScoreWhereInput = {
    AND?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[]
    OR?: PuzzleRushScoreWhereInput[]
    NOT?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[]
    id?: StringFilter<"PuzzleRushScore"> | string
    userId?: StringFilter<"PuzzleRushScore"> | string
    mode?: StringFilter<"PuzzleRushScore"> | string
    difficulty?: StringFilter<"PuzzleRushScore"> | string
    score?: IntFilter<"PuzzleRushScore"> | number
    mistakes?: IntFilter<"PuzzleRushScore"> | number
    timeLimitSeconds?: IntNullableFilter<"PuzzleRushScore"> | number | null
    maxMistakes?: IntNullableFilter<"PuzzleRushScore"> | number | null
    createdAt?: DateTimeFilter<"PuzzleRushScore"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PuzzleRushScoreOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrderInput | SortOrder
    maxMistakes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PuzzleRushScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[]
    OR?: PuzzleRushScoreWhereInput[]
    NOT?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[]
    userId?: StringFilter<"PuzzleRushScore"> | string
    mode?: StringFilter<"PuzzleRushScore"> | string
    difficulty?: StringFilter<"PuzzleRushScore"> | string
    score?: IntFilter<"PuzzleRushScore"> | number
    mistakes?: IntFilter<"PuzzleRushScore"> | number
    timeLimitSeconds?: IntNullableFilter<"PuzzleRushScore"> | number | null
    maxMistakes?: IntNullableFilter<"PuzzleRushScore"> | number | null
    createdAt?: DateTimeFilter<"PuzzleRushScore"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PuzzleRushScoreOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrderInput | SortOrder
    maxMistakes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PuzzleRushScoreCountOrderByAggregateInput
    _avg?: PuzzleRushScoreAvgOrderByAggregateInput
    _max?: PuzzleRushScoreMaxOrderByAggregateInput
    _min?: PuzzleRushScoreMinOrderByAggregateInput
    _sum?: PuzzleRushScoreSumOrderByAggregateInput
  }

  export type PuzzleRushScoreScalarWhereWithAggregatesInput = {
    AND?: PuzzleRushScoreScalarWhereWithAggregatesInput | PuzzleRushScoreScalarWhereWithAggregatesInput[]
    OR?: PuzzleRushScoreScalarWhereWithAggregatesInput[]
    NOT?: PuzzleRushScoreScalarWhereWithAggregatesInput | PuzzleRushScoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PuzzleRushScore"> | string
    userId?: StringWithAggregatesFilter<"PuzzleRushScore"> | string
    mode?: StringWithAggregatesFilter<"PuzzleRushScore"> | string
    difficulty?: StringWithAggregatesFilter<"PuzzleRushScore"> | string
    score?: IntWithAggregatesFilter<"PuzzleRushScore"> | number
    mistakes?: IntWithAggregatesFilter<"PuzzleRushScore"> | number
    timeLimitSeconds?: IntNullableWithAggregatesFilter<"PuzzleRushScore"> | number | null
    maxMistakes?: IntNullableWithAggregatesFilter<"PuzzleRushScore"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"PuzzleRushScore"> | Date | string
  }

  export type MemorySessionWhereInput = {
    AND?: MemorySessionWhereInput | MemorySessionWhereInput[]
    OR?: MemorySessionWhereInput[]
    NOT?: MemorySessionWhereInput | MemorySessionWhereInput[]
    id?: StringFilter<"MemorySession"> | string
    userId?: StringFilter<"MemorySession"> | string
    mode?: StringFilter<"MemorySession"> | string
    pieceCount?: IntFilter<"MemorySession"> | number
    memorizeTimeSeconds?: IntFilter<"MemorySession"> | number
    correctPieces?: IntFilter<"MemorySession"> | number
    totalPieces?: IntFilter<"MemorySession"> | number
    accuracy?: FloatFilter<"MemorySession"> | number
    progressiveLevel?: IntNullableFilter<"MemorySession"> | number | null
    createdAt?: DateTimeFilter<"MemorySession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MemorySessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MemorySessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MemorySessionWhereInput | MemorySessionWhereInput[]
    OR?: MemorySessionWhereInput[]
    NOT?: MemorySessionWhereInput | MemorySessionWhereInput[]
    userId?: StringFilter<"MemorySession"> | string
    mode?: StringFilter<"MemorySession"> | string
    pieceCount?: IntFilter<"MemorySession"> | number
    memorizeTimeSeconds?: IntFilter<"MemorySession"> | number
    correctPieces?: IntFilter<"MemorySession"> | number
    totalPieces?: IntFilter<"MemorySession"> | number
    accuracy?: FloatFilter<"MemorySession"> | number
    progressiveLevel?: IntNullableFilter<"MemorySession"> | number | null
    createdAt?: DateTimeFilter<"MemorySession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MemorySessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MemorySessionCountOrderByAggregateInput
    _avg?: MemorySessionAvgOrderByAggregateInput
    _max?: MemorySessionMaxOrderByAggregateInput
    _min?: MemorySessionMinOrderByAggregateInput
    _sum?: MemorySessionSumOrderByAggregateInput
  }

  export type MemorySessionScalarWhereWithAggregatesInput = {
    AND?: MemorySessionScalarWhereWithAggregatesInput | MemorySessionScalarWhereWithAggregatesInput[]
    OR?: MemorySessionScalarWhereWithAggregatesInput[]
    NOT?: MemorySessionScalarWhereWithAggregatesInput | MemorySessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MemorySession"> | string
    userId?: StringWithAggregatesFilter<"MemorySession"> | string
    mode?: StringWithAggregatesFilter<"MemorySession"> | string
    pieceCount?: IntWithAggregatesFilter<"MemorySession"> | number
    memorizeTimeSeconds?: IntWithAggregatesFilter<"MemorySession"> | number
    correctPieces?: IntWithAggregatesFilter<"MemorySession"> | number
    totalPieces?: IntWithAggregatesFilter<"MemorySession"> | number
    accuracy?: FloatWithAggregatesFilter<"MemorySession"> | number
    progressiveLevel?: IntNullableWithAggregatesFilter<"MemorySession"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"MemorySession"> | Date | string
  }

  export type VisionSessionWhereInput = {
    AND?: VisionSessionWhereInput | VisionSessionWhereInput[]
    OR?: VisionSessionWhereInput[]
    NOT?: VisionSessionWhereInput | VisionSessionWhereInput[]
    id?: StringFilter<"VisionSession"> | string
    userId?: StringFilter<"VisionSession"> | string
    trainingMode?: StringFilter<"VisionSession"> | string
    colorMode?: StringFilter<"VisionSession"> | string
    timeLimitSeconds?: IntFilter<"VisionSession"> | number
    score?: IntFilter<"VisionSession"> | number
    totalAttempts?: IntFilter<"VisionSession"> | number
    accuracy?: FloatFilter<"VisionSession"> | number
    avgResponseTimeMs?: IntFilter<"VisionSession"> | number
    createdAt?: DateTimeFilter<"VisionSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type VisionSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    trainingMode?: SortOrder
    colorMode?: SortOrder
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type VisionSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VisionSessionWhereInput | VisionSessionWhereInput[]
    OR?: VisionSessionWhereInput[]
    NOT?: VisionSessionWhereInput | VisionSessionWhereInput[]
    userId?: StringFilter<"VisionSession"> | string
    trainingMode?: StringFilter<"VisionSession"> | string
    colorMode?: StringFilter<"VisionSession"> | string
    timeLimitSeconds?: IntFilter<"VisionSession"> | number
    score?: IntFilter<"VisionSession"> | number
    totalAttempts?: IntFilter<"VisionSession"> | number
    accuracy?: FloatFilter<"VisionSession"> | number
    avgResponseTimeMs?: IntFilter<"VisionSession"> | number
    createdAt?: DateTimeFilter<"VisionSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type VisionSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    trainingMode?: SortOrder
    colorMode?: SortOrder
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
    _count?: VisionSessionCountOrderByAggregateInput
    _avg?: VisionSessionAvgOrderByAggregateInput
    _max?: VisionSessionMaxOrderByAggregateInput
    _min?: VisionSessionMinOrderByAggregateInput
    _sum?: VisionSessionSumOrderByAggregateInput
  }

  export type VisionSessionScalarWhereWithAggregatesInput = {
    AND?: VisionSessionScalarWhereWithAggregatesInput | VisionSessionScalarWhereWithAggregatesInput[]
    OR?: VisionSessionScalarWhereWithAggregatesInput[]
    NOT?: VisionSessionScalarWhereWithAggregatesInput | VisionSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VisionSession"> | string
    userId?: StringWithAggregatesFilter<"VisionSession"> | string
    trainingMode?: StringWithAggregatesFilter<"VisionSession"> | string
    colorMode?: StringWithAggregatesFilter<"VisionSession"> | string
    timeLimitSeconds?: IntWithAggregatesFilter<"VisionSession"> | number
    score?: IntWithAggregatesFilter<"VisionSession"> | number
    totalAttempts?: IntWithAggregatesFilter<"VisionSession"> | number
    accuracy?: FloatWithAggregatesFilter<"VisionSession"> | number
    avgResponseTimeMs?: IntWithAggregatesFilter<"VisionSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"VisionSession"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagCreateInput = {
    id?: string
    flagCode: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPassportFlagsInput
  }

  export type PassportFlagUncheckedCreateInput = {
    id?: string
    userId: string
    flagCode: string
    createdAt?: Date | string
  }

  export type PassportFlagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPassportFlagsNestedInput
  }

  export type PassportFlagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagCreateManyInput = {
    id?: string
    userId: string
    flagCode: string
    createdAt?: Date | string
  }

  export type PassportFlagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticatorCreateInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
    user: UserCreateNestedOneWithoutAuthenticatorInput
  }

  export type AuthenticatorUncheckedCreateInput = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUpdateInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAuthenticatorNestedInput
  }

  export type AuthenticatorUncheckedUpdateInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorCreateManyInput = {
    credentialID: string
    userId: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUpdateManyMutationInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateManyInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameCreateInput = {
    id?: string
    roomId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    white?: UserCreateNestedOneWithoutWhiteGamesInput
    black?: UserCreateNestedOneWithoutBlackGamesInput
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateInput = {
    id?: string
    roomId?: string | null
    whiteUserId?: string | null
    blackUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput
  }

  export type GameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    white?: UserUpdateOneWithoutWhiteGamesNestedInput
    black?: UserUpdateOneWithoutBlackGamesNestedInput
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput
  }

  export type GameCreateManyInput = {
    id?: string
    roomId?: string | null
    whiteUserId?: string | null
    blackUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisCreateInput = {
    id?: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    game: GameCreateNestedOneWithoutAnalysisInput
    user: UserCreateNestedOneWithoutAnalysesInput
  }

  export type GameAnalysisUncheckedCreateInput = {
    id?: string
    gameId: string
    userId: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GameAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutAnalysisNestedInput
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type GameAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisCreateManyInput = {
    id?: string
    gameId: string
    userId: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GameAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingCreateInput = {
    id?: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateInput = {
    id?: string
    userId: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingCreateManyInput = {
    id?: string
    userId: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRatingCreateInput = {
    id?: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPuzzleRatingInput
  }

  export type PuzzleRatingUncheckedCreateInput = {
    id?: string
    userId: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PuzzleRatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPuzzleRatingNestedInput
  }

  export type PuzzleRatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRatingCreateManyInput = {
    id?: string
    userId: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PuzzleRatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptCreateInput = {
    id?: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPuzzleAttemptsInput
  }

  export type PuzzleAttemptUncheckedCreateInput = {
    id?: string
    userId: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
  }

  export type PuzzleAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPuzzleAttemptsNestedInput
  }

  export type PuzzleAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptCreateManyInput = {
    id?: string
    userId: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
  }

  export type PuzzleAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreCreateInput = {
    id?: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPuzzleRushScoresInput
  }

  export type PuzzleRushScoreUncheckedCreateInput = {
    id?: string
    userId: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
  }

  export type PuzzleRushScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPuzzleRushScoresNestedInput
  }

  export type PuzzleRushScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreCreateManyInput = {
    id?: string
    userId: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
  }

  export type PuzzleRushScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionCreateInput = {
    id?: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMemorySessionsInput
  }

  export type MemorySessionUncheckedCreateInput = {
    id?: string
    userId: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
  }

  export type MemorySessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMemorySessionsNestedInput
  }

  export type MemorySessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionCreateManyInput = {
    id?: string
    userId: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
  }

  export type MemorySessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionCreateInput = {
    id?: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutVisionSessionsInput
  }

  export type VisionSessionUncheckedCreateInput = {
    id?: string
    userId: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
  }

  export type VisionSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVisionSessionsNestedInput
  }

  export type VisionSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionCreateManyInput = {
    id?: string
    userId: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
  }

  export type VisionSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AuthenticatorListRelationFilter = {
    every?: AuthenticatorWhereInput
    some?: AuthenticatorWhereInput
    none?: AuthenticatorWhereInput
  }

  export type GameListRelationFilter = {
    every?: GameWhereInput
    some?: GameWhereInput
    none?: GameWhereInput
  }

  export type RatingListRelationFilter = {
    every?: RatingWhereInput
    some?: RatingWhereInput
    none?: RatingWhereInput
  }

  export type PuzzleRatingNullableScalarRelationFilter = {
    is?: PuzzleRatingWhereInput | null
    isNot?: PuzzleRatingWhereInput | null
  }

  export type GameAnalysisListRelationFilter = {
    every?: GameAnalysisWhereInput
    some?: GameAnalysisWhereInput
    none?: GameAnalysisWhereInput
  }

  export type PuzzleAttemptListRelationFilter = {
    every?: PuzzleAttemptWhereInput
    some?: PuzzleAttemptWhereInput
    none?: PuzzleAttemptWhereInput
  }

  export type PuzzleRushScoreListRelationFilter = {
    every?: PuzzleRushScoreWhereInput
    some?: PuzzleRushScoreWhereInput
    none?: PuzzleRushScoreWhereInput
  }

  export type MemorySessionListRelationFilter = {
    every?: MemorySessionWhereInput
    some?: MemorySessionWhereInput
    none?: MemorySessionWhereInput
  }

  export type VisionSessionListRelationFilter = {
    every?: VisionSessionWhereInput
    some?: VisionSessionWhereInput
    none?: VisionSessionWhereInput
  }

  export type PassportFlagListRelationFilter = {
    every?: PassportFlagWhereInput
    some?: PassportFlagWhereInput
    none?: PassportFlagWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthenticatorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RatingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PuzzleAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PuzzleRushScoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MemorySessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisionSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PassportFlagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    flagCode?: SortOrder
    banned?: SortOrder
    bannedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    flagCode?: SortOrder
    banned?: SortOrder
    bannedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    flagCode?: SortOrder
    banned?: SortOrder
    bannedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PassportFlagUserIdFlagCodeCompoundUniqueInput = {
    userId: string
    flagCode: string
  }

  export type PassportFlagCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flagCode?: SortOrder
    createdAt?: SortOrder
  }

  export type PassportFlagMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flagCode?: SortOrder
    createdAt?: SortOrder
  }

  export type PassportFlagMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    flagCode?: SortOrder
    createdAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AuthenticatorUserIdCredentialIDCompoundUniqueInput = {
    userId: string
    credentialID: string
  }

  export type AuthenticatorCountOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorAvgOrderByAggregateInput = {
    counter?: SortOrder
  }

  export type AuthenticatorMaxOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorMinOrderByAggregateInput = {
    credentialID?: SortOrder
    userId?: SortOrder
    providerAccountId?: SortOrder
    credentialPublicKey?: SortOrder
    counter?: SortOrder
    credentialDeviceType?: SortOrder
    credentialBackedUp?: SortOrder
    transports?: SortOrder
  }

  export type AuthenticatorSumOrderByAggregateInput = {
    counter?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type GameAnalysisNullableScalarRelationFilter = {
    is?: GameAnalysisWhereInput | null
    isNot?: GameAnalysisWhereInput | null
  }

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    whiteUserId?: SortOrder
    blackUserId?: SortOrder
    variant?: SortOrder
    gameType?: SortOrder
    result?: SortOrder
    resultReason?: SortOrder
    moves?: SortOrder
    startingFen?: SortOrder
    timeControl?: SortOrder
    whitePregameRating?: SortOrder
    blackPregameRating?: SortOrder
    whiteRatingDelta?: SortOrder
    blackRatingDelta?: SortOrder
    moveCount?: SortOrder
    rated?: SortOrder
    playedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameAvgOrderByAggregateInput = {
    whitePregameRating?: SortOrder
    blackPregameRating?: SortOrder
    whiteRatingDelta?: SortOrder
    blackRatingDelta?: SortOrder
    moveCount?: SortOrder
  }

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    whiteUserId?: SortOrder
    blackUserId?: SortOrder
    variant?: SortOrder
    gameType?: SortOrder
    result?: SortOrder
    resultReason?: SortOrder
    startingFen?: SortOrder
    whitePregameRating?: SortOrder
    blackPregameRating?: SortOrder
    whiteRatingDelta?: SortOrder
    blackRatingDelta?: SortOrder
    moveCount?: SortOrder
    rated?: SortOrder
    playedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    whiteUserId?: SortOrder
    blackUserId?: SortOrder
    variant?: SortOrder
    gameType?: SortOrder
    result?: SortOrder
    resultReason?: SortOrder
    startingFen?: SortOrder
    whitePregameRating?: SortOrder
    blackPregameRating?: SortOrder
    whiteRatingDelta?: SortOrder
    blackRatingDelta?: SortOrder
    moveCount?: SortOrder
    rated?: SortOrder
    playedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameSumOrderByAggregateInput = {
    whitePregameRating?: SortOrder
    blackPregameRating?: SortOrder
    whiteRatingDelta?: SortOrder
    blackRatingDelta?: SortOrder
    moveCount?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type GameScalarRelationFilter = {
    is?: GameWhereInput
    isNot?: GameWhereInput
  }

  export type GameAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    userId?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type GameAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type GameAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type RatingUserIdVariantCategoryCompoundUniqueInput = {
    userId: string
    variant: string
    category: string
  }

  export type RatingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    variant?: SortOrder
    category?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RatingAvgOrderByAggregateInput = {
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
  }

  export type RatingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    variant?: SortOrder
    category?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RatingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    variant?: SortOrder
    category?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RatingSumOrderByAggregateInput = {
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type PuzzleRatingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PuzzleRatingAvgOrderByAggregateInput = {
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
  }

  export type PuzzleRatingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PuzzleRatingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PuzzleRatingSumOrderByAggregateInput = {
    rating?: SortOrder
    rd?: SortOrder
    sigma?: SortOrder
    gameCount?: SortOrder
  }

  export type PuzzleAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    puzzleId?: SortOrder
    difficulty?: SortOrder
    rating?: SortOrder
    solved?: SortOrder
    usedHint?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleAttemptAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type PuzzleAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    puzzleId?: SortOrder
    difficulty?: SortOrder
    rating?: SortOrder
    solved?: SortOrder
    usedHint?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    puzzleId?: SortOrder
    difficulty?: SortOrder
    rating?: SortOrder
    solved?: SortOrder
    usedHint?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleAttemptSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type PuzzleRushScoreCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrder
    maxMistakes?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleRushScoreAvgOrderByAggregateInput = {
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrder
    maxMistakes?: SortOrder
  }

  export type PuzzleRushScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrder
    maxMistakes?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleRushScoreMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    difficulty?: SortOrder
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrder
    maxMistakes?: SortOrder
    createdAt?: SortOrder
  }

  export type PuzzleRushScoreSumOrderByAggregateInput = {
    score?: SortOrder
    mistakes?: SortOrder
    timeLimitSeconds?: SortOrder
    maxMistakes?: SortOrder
  }

  export type MemorySessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionAvgOrderByAggregateInput = {
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrder
  }

  export type MemorySessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionSumOrderByAggregateInput = {
    pieceCount?: SortOrder
    memorizeTimeSeconds?: SortOrder
    correctPieces?: SortOrder
    totalPieces?: SortOrder
    accuracy?: SortOrder
    progressiveLevel?: SortOrder
  }

  export type VisionSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trainingMode?: SortOrder
    colorMode?: SortOrder
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
  }

  export type VisionSessionAvgOrderByAggregateInput = {
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
  }

  export type VisionSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trainingMode?: SortOrder
    colorMode?: SortOrder
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
  }

  export type VisionSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trainingMode?: SortOrder
    colorMode?: SortOrder
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
  }

  export type VisionSessionSumOrderByAggregateInput = {
    timeLimitSeconds?: SortOrder
    score?: SortOrder
    totalAttempts?: SortOrder
    accuracy?: SortOrder
    avgResponseTimeMs?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AuthenticatorCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
  }

  export type GameCreateNestedManyWithoutWhiteInput = {
    create?: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput> | GameCreateWithoutWhiteInput[] | GameUncheckedCreateWithoutWhiteInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhiteInput | GameCreateOrConnectWithoutWhiteInput[]
    createMany?: GameCreateManyWhiteInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type GameCreateNestedManyWithoutBlackInput = {
    create?: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput> | GameCreateWithoutBlackInput[] | GameUncheckedCreateWithoutBlackInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackInput | GameCreateOrConnectWithoutBlackInput[]
    createMany?: GameCreateManyBlackInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type RatingCreateNestedManyWithoutUserInput = {
    create?: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput> | RatingCreateWithoutUserInput[] | RatingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutUserInput | RatingCreateOrConnectWithoutUserInput[]
    createMany?: RatingCreateManyUserInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type PuzzleRatingCreateNestedOneWithoutUserInput = {
    create?: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput
    connect?: PuzzleRatingWhereUniqueInput
  }

  export type GameAnalysisCreateNestedManyWithoutUserInput = {
    create?: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput> | GameAnalysisCreateWithoutUserInput[] | GameAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutUserInput | GameAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: GameAnalysisCreateManyUserInputEnvelope
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
  }

  export type PuzzleAttemptCreateNestedManyWithoutUserInput = {
    create?: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput> | PuzzleAttemptCreateWithoutUserInput[] | PuzzleAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleAttemptCreateOrConnectWithoutUserInput | PuzzleAttemptCreateOrConnectWithoutUserInput[]
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
  }

  export type PuzzleRushScoreCreateNestedManyWithoutUserInput = {
    create?: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput> | PuzzleRushScoreCreateWithoutUserInput[] | PuzzleRushScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleRushScoreCreateOrConnectWithoutUserInput | PuzzleRushScoreCreateOrConnectWithoutUserInput[]
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope
    connect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
  }

  export type MemorySessionCreateNestedManyWithoutUserInput = {
    create?: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput> | MemorySessionCreateWithoutUserInput[] | MemorySessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MemorySessionCreateOrConnectWithoutUserInput | MemorySessionCreateOrConnectWithoutUserInput[]
    createMany?: MemorySessionCreateManyUserInputEnvelope
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
  }

  export type VisionSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput> | VisionSessionCreateWithoutUserInput[] | VisionSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisionSessionCreateOrConnectWithoutUserInput | VisionSessionCreateOrConnectWithoutUserInput[]
    createMany?: VisionSessionCreateManyUserInputEnvelope
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
  }

  export type PassportFlagCreateNestedManyWithoutUserInput = {
    create?: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput> | PassportFlagCreateWithoutUserInput[] | PassportFlagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PassportFlagCreateOrConnectWithoutUserInput | PassportFlagCreateOrConnectWithoutUserInput[]
    createMany?: PassportFlagCreateManyUserInputEnvelope
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AuthenticatorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutWhiteInput = {
    create?: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput> | GameCreateWithoutWhiteInput[] | GameUncheckedCreateWithoutWhiteInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhiteInput | GameCreateOrConnectWithoutWhiteInput[]
    createMany?: GameCreateManyWhiteInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutBlackInput = {
    create?: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput> | GameCreateWithoutBlackInput[] | GameUncheckedCreateWithoutBlackInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackInput | GameCreateOrConnectWithoutBlackInput[]
    createMany?: GameCreateManyBlackInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type RatingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput> | RatingCreateWithoutUserInput[] | RatingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutUserInput | RatingCreateOrConnectWithoutUserInput[]
    createMany?: RatingCreateManyUserInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type PuzzleRatingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput
    connect?: PuzzleRatingWhereUniqueInput
  }

  export type GameAnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput> | GameAnalysisCreateWithoutUserInput[] | GameAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutUserInput | GameAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: GameAnalysisCreateManyUserInputEnvelope
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
  }

  export type PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput> | PuzzleAttemptCreateWithoutUserInput[] | PuzzleAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleAttemptCreateOrConnectWithoutUserInput | PuzzleAttemptCreateOrConnectWithoutUserInput[]
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
  }

  export type PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput> | PuzzleRushScoreCreateWithoutUserInput[] | PuzzleRushScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleRushScoreCreateOrConnectWithoutUserInput | PuzzleRushScoreCreateOrConnectWithoutUserInput[]
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope
    connect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
  }

  export type MemorySessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput> | MemorySessionCreateWithoutUserInput[] | MemorySessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MemorySessionCreateOrConnectWithoutUserInput | MemorySessionCreateOrConnectWithoutUserInput[]
    createMany?: MemorySessionCreateManyUserInputEnvelope
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
  }

  export type VisionSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput> | VisionSessionCreateWithoutUserInput[] | VisionSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisionSessionCreateOrConnectWithoutUserInput | VisionSessionCreateOrConnectWithoutUserInput[]
    createMany?: VisionSessionCreateManyUserInputEnvelope
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
  }

  export type PassportFlagUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput> | PassportFlagCreateWithoutUserInput[] | PassportFlagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PassportFlagCreateOrConnectWithoutUserInput | PassportFlagCreateOrConnectWithoutUserInput[]
    createMany?: PassportFlagCreateManyUserInputEnvelope
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AuthenticatorUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticatorUpsertWithWhereUniqueWithoutUserInput | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    disconnect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    update?: AuthenticatorUpdateWithWhereUniqueWithoutUserInput | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticatorUpdateManyWithWhereWithoutUserInput | AuthenticatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
  }

  export type GameUpdateManyWithoutWhiteNestedInput = {
    create?: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput> | GameCreateWithoutWhiteInput[] | GameUncheckedCreateWithoutWhiteInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhiteInput | GameCreateOrConnectWithoutWhiteInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWhiteInput | GameUpsertWithWhereUniqueWithoutWhiteInput[]
    createMany?: GameCreateManyWhiteInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWhiteInput | GameUpdateWithWhereUniqueWithoutWhiteInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWhiteInput | GameUpdateManyWithWhereWithoutWhiteInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type GameUpdateManyWithoutBlackNestedInput = {
    create?: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput> | GameCreateWithoutBlackInput[] | GameUncheckedCreateWithoutBlackInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackInput | GameCreateOrConnectWithoutBlackInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutBlackInput | GameUpsertWithWhereUniqueWithoutBlackInput[]
    createMany?: GameCreateManyBlackInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutBlackInput | GameUpdateWithWhereUniqueWithoutBlackInput[]
    updateMany?: GameUpdateManyWithWhereWithoutBlackInput | GameUpdateManyWithWhereWithoutBlackInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type RatingUpdateManyWithoutUserNestedInput = {
    create?: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput> | RatingCreateWithoutUserInput[] | RatingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutUserInput | RatingCreateOrConnectWithoutUserInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutUserInput | RatingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RatingCreateManyUserInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutUserInput | RatingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutUserInput | RatingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type PuzzleRatingUpdateOneWithoutUserNestedInput = {
    create?: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput
    upsert?: PuzzleRatingUpsertWithoutUserInput
    disconnect?: PuzzleRatingWhereInput | boolean
    delete?: PuzzleRatingWhereInput | boolean
    connect?: PuzzleRatingWhereUniqueInput
    update?: XOR<XOR<PuzzleRatingUpdateToOneWithWhereWithoutUserInput, PuzzleRatingUpdateWithoutUserInput>, PuzzleRatingUncheckedUpdateWithoutUserInput>
  }

  export type GameAnalysisUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput> | GameAnalysisCreateWithoutUserInput[] | GameAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutUserInput | GameAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: GameAnalysisUpsertWithWhereUniqueWithoutUserInput | GameAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameAnalysisCreateManyUserInputEnvelope
    set?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    disconnect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    delete?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    update?: GameAnalysisUpdateWithWhereUniqueWithoutUserInput | GameAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameAnalysisUpdateManyWithWhereWithoutUserInput | GameAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[]
  }

  export type PuzzleAttemptUpdateManyWithoutUserNestedInput = {
    create?: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput> | PuzzleAttemptCreateWithoutUserInput[] | PuzzleAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleAttemptCreateOrConnectWithoutUserInput | PuzzleAttemptCreateOrConnectWithoutUserInput[]
    upsert?: PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope
    set?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    disconnect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    delete?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    update?: PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PuzzleAttemptUpdateManyWithWhereWithoutUserInput | PuzzleAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[]
  }

  export type PuzzleRushScoreUpdateManyWithoutUserNestedInput = {
    create?: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput> | PuzzleRushScoreCreateWithoutUserInput[] | PuzzleRushScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleRushScoreCreateOrConnectWithoutUserInput | PuzzleRushScoreCreateOrConnectWithoutUserInput[]
    upsert?: PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope
    set?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    disconnect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    delete?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    connect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    update?: PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PuzzleRushScoreUpdateManyWithWhereWithoutUserInput | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[]
  }

  export type MemorySessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput> | MemorySessionCreateWithoutUserInput[] | MemorySessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MemorySessionCreateOrConnectWithoutUserInput | MemorySessionCreateOrConnectWithoutUserInput[]
    upsert?: MemorySessionUpsertWithWhereUniqueWithoutUserInput | MemorySessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MemorySessionCreateManyUserInputEnvelope
    set?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    disconnect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    delete?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    update?: MemorySessionUpdateWithWhereUniqueWithoutUserInput | MemorySessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MemorySessionUpdateManyWithWhereWithoutUserInput | MemorySessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[]
  }

  export type VisionSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput> | VisionSessionCreateWithoutUserInput[] | VisionSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisionSessionCreateOrConnectWithoutUserInput | VisionSessionCreateOrConnectWithoutUserInput[]
    upsert?: VisionSessionUpsertWithWhereUniqueWithoutUserInput | VisionSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VisionSessionCreateManyUserInputEnvelope
    set?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    disconnect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    delete?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    update?: VisionSessionUpdateWithWhereUniqueWithoutUserInput | VisionSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VisionSessionUpdateManyWithWhereWithoutUserInput | VisionSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[]
  }

  export type PassportFlagUpdateManyWithoutUserNestedInput = {
    create?: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput> | PassportFlagCreateWithoutUserInput[] | PassportFlagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PassportFlagCreateOrConnectWithoutUserInput | PassportFlagCreateOrConnectWithoutUserInput[]
    upsert?: PassportFlagUpsertWithWhereUniqueWithoutUserInput | PassportFlagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PassportFlagCreateManyUserInputEnvelope
    set?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    disconnect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    delete?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    update?: PassportFlagUpdateWithWhereUniqueWithoutUserInput | PassportFlagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PassportFlagUpdateManyWithWhereWithoutUserInput | PassportFlagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AuthenticatorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput> | AuthenticatorCreateWithoutUserInput[] | AuthenticatorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthenticatorCreateOrConnectWithoutUserInput | AuthenticatorCreateOrConnectWithoutUserInput[]
    upsert?: AuthenticatorUpsertWithWhereUniqueWithoutUserInput | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthenticatorCreateManyUserInputEnvelope
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    disconnect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[]
    update?: AuthenticatorUpdateWithWhereUniqueWithoutUserInput | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthenticatorUpdateManyWithWhereWithoutUserInput | AuthenticatorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutWhiteNestedInput = {
    create?: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput> | GameCreateWithoutWhiteInput[] | GameUncheckedCreateWithoutWhiteInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhiteInput | GameCreateOrConnectWithoutWhiteInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWhiteInput | GameUpsertWithWhereUniqueWithoutWhiteInput[]
    createMany?: GameCreateManyWhiteInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWhiteInput | GameUpdateWithWhereUniqueWithoutWhiteInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWhiteInput | GameUpdateManyWithWhereWithoutWhiteInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutBlackNestedInput = {
    create?: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput> | GameCreateWithoutBlackInput[] | GameUncheckedCreateWithoutBlackInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackInput | GameCreateOrConnectWithoutBlackInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutBlackInput | GameUpsertWithWhereUniqueWithoutBlackInput[]
    createMany?: GameCreateManyBlackInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutBlackInput | GameUpdateWithWhereUniqueWithoutBlackInput[]
    updateMany?: GameUpdateManyWithWhereWithoutBlackInput | GameUpdateManyWithWhereWithoutBlackInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type RatingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput> | RatingCreateWithoutUserInput[] | RatingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutUserInput | RatingCreateOrConnectWithoutUserInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutUserInput | RatingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RatingCreateManyUserInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutUserInput | RatingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutUserInput | RatingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput
    upsert?: PuzzleRatingUpsertWithoutUserInput
    disconnect?: PuzzleRatingWhereInput | boolean
    delete?: PuzzleRatingWhereInput | boolean
    connect?: PuzzleRatingWhereUniqueInput
    update?: XOR<XOR<PuzzleRatingUpdateToOneWithWhereWithoutUserInput, PuzzleRatingUpdateWithoutUserInput>, PuzzleRatingUncheckedUpdateWithoutUserInput>
  }

  export type GameAnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput> | GameAnalysisCreateWithoutUserInput[] | GameAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutUserInput | GameAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: GameAnalysisUpsertWithWhereUniqueWithoutUserInput | GameAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameAnalysisCreateManyUserInputEnvelope
    set?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    disconnect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    delete?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[]
    update?: GameAnalysisUpdateWithWhereUniqueWithoutUserInput | GameAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameAnalysisUpdateManyWithWhereWithoutUserInput | GameAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[]
  }

  export type PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput> | PuzzleAttemptCreateWithoutUserInput[] | PuzzleAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleAttemptCreateOrConnectWithoutUserInput | PuzzleAttemptCreateOrConnectWithoutUserInput[]
    upsert?: PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope
    set?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    disconnect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    delete?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[]
    update?: PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PuzzleAttemptUpdateManyWithWhereWithoutUserInput | PuzzleAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[]
  }

  export type PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput> | PuzzleRushScoreCreateWithoutUserInput[] | PuzzleRushScoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PuzzleRushScoreCreateOrConnectWithoutUserInput | PuzzleRushScoreCreateOrConnectWithoutUserInput[]
    upsert?: PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope
    set?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    disconnect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    delete?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    connect?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[]
    update?: PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PuzzleRushScoreUpdateManyWithWhereWithoutUserInput | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[]
  }

  export type MemorySessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput> | MemorySessionCreateWithoutUserInput[] | MemorySessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MemorySessionCreateOrConnectWithoutUserInput | MemorySessionCreateOrConnectWithoutUserInput[]
    upsert?: MemorySessionUpsertWithWhereUniqueWithoutUserInput | MemorySessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MemorySessionCreateManyUserInputEnvelope
    set?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    disconnect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    delete?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[]
    update?: MemorySessionUpdateWithWhereUniqueWithoutUserInput | MemorySessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MemorySessionUpdateManyWithWhereWithoutUserInput | MemorySessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[]
  }

  export type VisionSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput> | VisionSessionCreateWithoutUserInput[] | VisionSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: VisionSessionCreateOrConnectWithoutUserInput | VisionSessionCreateOrConnectWithoutUserInput[]
    upsert?: VisionSessionUpsertWithWhereUniqueWithoutUserInput | VisionSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: VisionSessionCreateManyUserInputEnvelope
    set?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    disconnect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    delete?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[]
    update?: VisionSessionUpdateWithWhereUniqueWithoutUserInput | VisionSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: VisionSessionUpdateManyWithWhereWithoutUserInput | VisionSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[]
  }

  export type PassportFlagUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput> | PassportFlagCreateWithoutUserInput[] | PassportFlagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PassportFlagCreateOrConnectWithoutUserInput | PassportFlagCreateOrConnectWithoutUserInput[]
    upsert?: PassportFlagUpsertWithWhereUniqueWithoutUserInput | PassportFlagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PassportFlagCreateManyUserInputEnvelope
    set?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    disconnect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    delete?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[]
    update?: PassportFlagUpdateWithWhereUniqueWithoutUserInput | PassportFlagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PassportFlagUpdateManyWithWhereWithoutUserInput | PassportFlagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPassportFlagsInput = {
    create?: XOR<UserCreateWithoutPassportFlagsInput, UserUncheckedCreateWithoutPassportFlagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPassportFlagsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPassportFlagsNestedInput = {
    create?: XOR<UserCreateWithoutPassportFlagsInput, UserUncheckedCreateWithoutPassportFlagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPassportFlagsInput
    upsert?: UserUpsertWithoutPassportFlagsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPassportFlagsInput, UserUpdateWithoutPassportFlagsInput>, UserUncheckedUpdateWithoutPassportFlagsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAuthenticatorInput = {
    create?: XOR<UserCreateWithoutAuthenticatorInput, UserUncheckedCreateWithoutAuthenticatorInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticatorInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAuthenticatorNestedInput = {
    create?: XOR<UserCreateWithoutAuthenticatorInput, UserUncheckedCreateWithoutAuthenticatorInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticatorInput
    upsert?: UserUpsertWithoutAuthenticatorInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuthenticatorInput, UserUpdateWithoutAuthenticatorInput>, UserUncheckedUpdateWithoutAuthenticatorInput>
  }

  export type GameCreatemovesInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutWhiteGamesInput = {
    create?: XOR<UserCreateWithoutWhiteGamesInput, UserUncheckedCreateWithoutWhiteGamesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWhiteGamesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBlackGamesInput = {
    create?: XOR<UserCreateWithoutBlackGamesInput, UserUncheckedCreateWithoutBlackGamesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBlackGamesInput
    connect?: UserWhereUniqueInput
  }

  export type GameAnalysisCreateNestedOneWithoutGameInput = {
    create?: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput
    connect?: GameAnalysisWhereUniqueInput
  }

  export type GameAnalysisUncheckedCreateNestedOneWithoutGameInput = {
    create?: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput
    connect?: GameAnalysisWhereUniqueInput
  }

  export type GameUpdatemovesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneWithoutWhiteGamesNestedInput = {
    create?: XOR<UserCreateWithoutWhiteGamesInput, UserUncheckedCreateWithoutWhiteGamesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWhiteGamesInput
    upsert?: UserUpsertWithoutWhiteGamesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWhiteGamesInput, UserUpdateWithoutWhiteGamesInput>, UserUncheckedUpdateWithoutWhiteGamesInput>
  }

  export type UserUpdateOneWithoutBlackGamesNestedInput = {
    create?: XOR<UserCreateWithoutBlackGamesInput, UserUncheckedCreateWithoutBlackGamesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBlackGamesInput
    upsert?: UserUpsertWithoutBlackGamesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBlackGamesInput, UserUpdateWithoutBlackGamesInput>, UserUncheckedUpdateWithoutBlackGamesInput>
  }

  export type GameAnalysisUpdateOneWithoutGameNestedInput = {
    create?: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput
    upsert?: GameAnalysisUpsertWithoutGameInput
    disconnect?: GameAnalysisWhereInput | boolean
    delete?: GameAnalysisWhereInput | boolean
    connect?: GameAnalysisWhereUniqueInput
    update?: XOR<XOR<GameAnalysisUpdateToOneWithWhereWithoutGameInput, GameAnalysisUpdateWithoutGameInput>, GameAnalysisUncheckedUpdateWithoutGameInput>
  }

  export type GameAnalysisUncheckedUpdateOneWithoutGameNestedInput = {
    create?: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput
    upsert?: GameAnalysisUpsertWithoutGameInput
    disconnect?: GameAnalysisWhereInput | boolean
    delete?: GameAnalysisWhereInput | boolean
    connect?: GameAnalysisWhereUniqueInput
    update?: XOR<XOR<GameAnalysisUpdateToOneWithWhereWithoutGameInput, GameAnalysisUpdateWithoutGameInput>, GameAnalysisUncheckedUpdateWithoutGameInput>
  }

  export type GameCreateNestedOneWithoutAnalysisInput = {
    create?: XOR<GameCreateWithoutAnalysisInput, GameUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: GameCreateOrConnectWithoutAnalysisInput
    connect?: GameWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput
    connect?: UserWhereUniqueInput
  }

  export type GameUpdateOneRequiredWithoutAnalysisNestedInput = {
    create?: XOR<GameCreateWithoutAnalysisInput, GameUncheckedCreateWithoutAnalysisInput>
    connectOrCreate?: GameCreateOrConnectWithoutAnalysisInput
    upsert?: GameUpsertWithoutAnalysisInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutAnalysisInput, GameUpdateWithoutAnalysisInput>, GameUncheckedUpdateWithoutAnalysisInput>
  }

  export type UserUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput
    upsert?: UserUpsertWithoutAnalysesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnalysesInput, UserUpdateWithoutAnalysesInput>, UserUncheckedUpdateWithoutAnalysesInput>
  }

  export type UserCreateNestedOneWithoutRatingsInput = {
    create?: XOR<UserCreateWithoutRatingsInput, UserUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRatingsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<UserCreateWithoutRatingsInput, UserUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRatingsInput
    upsert?: UserUpsertWithoutRatingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRatingsInput, UserUpdateWithoutRatingsInput>, UserUncheckedUpdateWithoutRatingsInput>
  }

  export type UserCreateNestedOneWithoutPuzzleRatingInput = {
    create?: XOR<UserCreateWithoutPuzzleRatingInput, UserUncheckedCreateWithoutPuzzleRatingInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRatingInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPuzzleRatingNestedInput = {
    create?: XOR<UserCreateWithoutPuzzleRatingInput, UserUncheckedCreateWithoutPuzzleRatingInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRatingInput
    upsert?: UserUpsertWithoutPuzzleRatingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPuzzleRatingInput, UserUpdateWithoutPuzzleRatingInput>, UserUncheckedUpdateWithoutPuzzleRatingInput>
  }

  export type UserCreateNestedOneWithoutPuzzleAttemptsInput = {
    create?: XOR<UserCreateWithoutPuzzleAttemptsInput, UserUncheckedCreateWithoutPuzzleAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleAttemptsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPuzzleAttemptsNestedInput = {
    create?: XOR<UserCreateWithoutPuzzleAttemptsInput, UserUncheckedCreateWithoutPuzzleAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleAttemptsInput
    upsert?: UserUpsertWithoutPuzzleAttemptsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPuzzleAttemptsInput, UserUpdateWithoutPuzzleAttemptsInput>, UserUncheckedUpdateWithoutPuzzleAttemptsInput>
  }

  export type UserCreateNestedOneWithoutPuzzleRushScoresInput = {
    create?: XOR<UserCreateWithoutPuzzleRushScoresInput, UserUncheckedCreateWithoutPuzzleRushScoresInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRushScoresInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPuzzleRushScoresNestedInput = {
    create?: XOR<UserCreateWithoutPuzzleRushScoresInput, UserUncheckedCreateWithoutPuzzleRushScoresInput>
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRushScoresInput
    upsert?: UserUpsertWithoutPuzzleRushScoresInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPuzzleRushScoresInput, UserUpdateWithoutPuzzleRushScoresInput>, UserUncheckedUpdateWithoutPuzzleRushScoresInput>
  }

  export type UserCreateNestedOneWithoutMemorySessionsInput = {
    create?: XOR<UserCreateWithoutMemorySessionsInput, UserUncheckedCreateWithoutMemorySessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMemorySessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMemorySessionsNestedInput = {
    create?: XOR<UserCreateWithoutMemorySessionsInput, UserUncheckedCreateWithoutMemorySessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMemorySessionsInput
    upsert?: UserUpsertWithoutMemorySessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMemorySessionsInput, UserUpdateWithoutMemorySessionsInput>, UserUncheckedUpdateWithoutMemorySessionsInput>
  }

  export type UserCreateNestedOneWithoutVisionSessionsInput = {
    create?: XOR<UserCreateWithoutVisionSessionsInput, UserUncheckedCreateWithoutVisionSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVisionSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutVisionSessionsNestedInput = {
    create?: XOR<UserCreateWithoutVisionSessionsInput, UserUncheckedCreateWithoutVisionSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVisionSessionsInput
    upsert?: UserUpsertWithoutVisionSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVisionSessionsInput, UserUpdateWithoutVisionSessionsInput>, UserUncheckedUpdateWithoutVisionSessionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuthenticatorCreateWithoutUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorUncheckedCreateWithoutUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type AuthenticatorCreateOrConnectWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    create: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput>
  }

  export type AuthenticatorCreateManyUserInputEnvelope = {
    data: AuthenticatorCreateManyUserInput | AuthenticatorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GameCreateWithoutWhiteInput = {
    id?: string
    roomId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    black?: UserCreateNestedOneWithoutBlackGamesInput
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateWithoutWhiteInput = {
    id?: string
    roomId?: string | null
    blackUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput
  }

  export type GameCreateOrConnectWithoutWhiteInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
  }

  export type GameCreateManyWhiteInputEnvelope = {
    data: GameCreateManyWhiteInput | GameCreateManyWhiteInput[]
    skipDuplicates?: boolean
  }

  export type GameCreateWithoutBlackInput = {
    id?: string
    roomId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    white?: UserCreateNestedOneWithoutWhiteGamesInput
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateWithoutBlackInput = {
    id?: string
    roomId?: string | null
    whiteUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput
  }

  export type GameCreateOrConnectWithoutBlackInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
  }

  export type GameCreateManyBlackInputEnvelope = {
    data: GameCreateManyBlackInput | GameCreateManyBlackInput[]
    skipDuplicates?: boolean
  }

  export type RatingCreateWithoutUserInput = {
    id?: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RatingUncheckedCreateWithoutUserInput = {
    id?: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RatingCreateOrConnectWithoutUserInput = {
    where: RatingWhereUniqueInput
    create: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
  }

  export type RatingCreateManyUserInputEnvelope = {
    data: RatingCreateManyUserInput | RatingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PuzzleRatingCreateWithoutUserInput = {
    id?: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PuzzleRatingUncheckedCreateWithoutUserInput = {
    id?: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PuzzleRatingCreateOrConnectWithoutUserInput = {
    where: PuzzleRatingWhereUniqueInput
    create: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
  }

  export type GameAnalysisCreateWithoutUserInput = {
    id?: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    game: GameCreateNestedOneWithoutAnalysisInput
  }

  export type GameAnalysisUncheckedCreateWithoutUserInput = {
    id?: string
    gameId: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GameAnalysisCreateOrConnectWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput
    create: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput>
  }

  export type GameAnalysisCreateManyUserInputEnvelope = {
    data: GameAnalysisCreateManyUserInput | GameAnalysisCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PuzzleAttemptCreateWithoutUserInput = {
    id?: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
  }

  export type PuzzleAttemptUncheckedCreateWithoutUserInput = {
    id?: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
  }

  export type PuzzleAttemptCreateOrConnectWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput
    create: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput>
  }

  export type PuzzleAttemptCreateManyUserInputEnvelope = {
    data: PuzzleAttemptCreateManyUserInput | PuzzleAttemptCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PuzzleRushScoreCreateWithoutUserInput = {
    id?: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
  }

  export type PuzzleRushScoreUncheckedCreateWithoutUserInput = {
    id?: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
  }

  export type PuzzleRushScoreCreateOrConnectWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput
    create: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput>
  }

  export type PuzzleRushScoreCreateManyUserInputEnvelope = {
    data: PuzzleRushScoreCreateManyUserInput | PuzzleRushScoreCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MemorySessionCreateWithoutUserInput = {
    id?: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
  }

  export type MemorySessionUncheckedCreateWithoutUserInput = {
    id?: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
  }

  export type MemorySessionCreateOrConnectWithoutUserInput = {
    where: MemorySessionWhereUniqueInput
    create: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput>
  }

  export type MemorySessionCreateManyUserInputEnvelope = {
    data: MemorySessionCreateManyUserInput | MemorySessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type VisionSessionCreateWithoutUserInput = {
    id?: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
  }

  export type VisionSessionUncheckedCreateWithoutUserInput = {
    id?: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
  }

  export type VisionSessionCreateOrConnectWithoutUserInput = {
    where: VisionSessionWhereUniqueInput
    create: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput>
  }

  export type VisionSessionCreateManyUserInputEnvelope = {
    data: VisionSessionCreateManyUserInput | VisionSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PassportFlagCreateWithoutUserInput = {
    id?: string
    flagCode: string
    createdAt?: Date | string
  }

  export type PassportFlagUncheckedCreateWithoutUserInput = {
    id?: string
    flagCode: string
    createdAt?: Date | string
  }

  export type PassportFlagCreateOrConnectWithoutUserInput = {
    where: PassportFlagWhereUniqueInput
    create: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput>
  }

  export type PassportFlagCreateManyUserInputEnvelope = {
    data: PassportFlagCreateManyUserInput | PassportFlagCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type AuthenticatorUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    update: XOR<AuthenticatorUpdateWithoutUserInput, AuthenticatorUncheckedUpdateWithoutUserInput>
    create: XOR<AuthenticatorCreateWithoutUserInput, AuthenticatorUncheckedCreateWithoutUserInput>
  }

  export type AuthenticatorUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput
    data: XOR<AuthenticatorUpdateWithoutUserInput, AuthenticatorUncheckedUpdateWithoutUserInput>
  }

  export type AuthenticatorUpdateManyWithWhereWithoutUserInput = {
    where: AuthenticatorScalarWhereInput
    data: XOR<AuthenticatorUpdateManyMutationInput, AuthenticatorUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthenticatorScalarWhereInput = {
    AND?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
    OR?: AuthenticatorScalarWhereInput[]
    NOT?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[]
    credentialID?: StringFilter<"Authenticator"> | string
    userId?: StringFilter<"Authenticator"> | string
    providerAccountId?: StringFilter<"Authenticator"> | string
    credentialPublicKey?: StringFilter<"Authenticator"> | string
    counter?: IntFilter<"Authenticator"> | number
    credentialDeviceType?: StringFilter<"Authenticator"> | string
    credentialBackedUp?: BoolFilter<"Authenticator"> | boolean
    transports?: StringNullableFilter<"Authenticator"> | string | null
  }

  export type GameUpsertWithWhereUniqueWithoutWhiteInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutWhiteInput, GameUncheckedUpdateWithoutWhiteInput>
    create: XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
  }

  export type GameUpdateWithWhereUniqueWithoutWhiteInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutWhiteInput, GameUncheckedUpdateWithoutWhiteInput>
  }

  export type GameUpdateManyWithWhereWithoutWhiteInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutWhiteInput>
  }

  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[]
    OR?: GameScalarWhereInput[]
    NOT?: GameScalarWhereInput | GameScalarWhereInput[]
    id?: StringFilter<"Game"> | string
    roomId?: StringNullableFilter<"Game"> | string | null
    whiteUserId?: StringNullableFilter<"Game"> | string | null
    blackUserId?: StringNullableFilter<"Game"> | string | null
    variant?: StringFilter<"Game"> | string
    gameType?: StringFilter<"Game"> | string
    result?: StringFilter<"Game"> | string
    resultReason?: StringFilter<"Game"> | string
    moves?: StringNullableListFilter<"Game">
    startingFen?: StringFilter<"Game"> | string
    timeControl?: JsonFilter<"Game">
    whitePregameRating?: IntNullableFilter<"Game"> | number | null
    blackPregameRating?: IntNullableFilter<"Game"> | number | null
    whiteRatingDelta?: IntNullableFilter<"Game"> | number | null
    blackRatingDelta?: IntNullableFilter<"Game"> | number | null
    moveCount?: IntFilter<"Game"> | number
    rated?: BoolFilter<"Game"> | boolean
    playedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeFilter<"Game"> | Date | string
  }

  export type GameUpsertWithWhereUniqueWithoutBlackInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutBlackInput, GameUncheckedUpdateWithoutBlackInput>
    create: XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
  }

  export type GameUpdateWithWhereUniqueWithoutBlackInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutBlackInput, GameUncheckedUpdateWithoutBlackInput>
  }

  export type GameUpdateManyWithWhereWithoutBlackInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutBlackInput>
  }

  export type RatingUpsertWithWhereUniqueWithoutUserInput = {
    where: RatingWhereUniqueInput
    update: XOR<RatingUpdateWithoutUserInput, RatingUncheckedUpdateWithoutUserInput>
    create: XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
  }

  export type RatingUpdateWithWhereUniqueWithoutUserInput = {
    where: RatingWhereUniqueInput
    data: XOR<RatingUpdateWithoutUserInput, RatingUncheckedUpdateWithoutUserInput>
  }

  export type RatingUpdateManyWithWhereWithoutUserInput = {
    where: RatingScalarWhereInput
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyWithoutUserInput>
  }

  export type RatingScalarWhereInput = {
    AND?: RatingScalarWhereInput | RatingScalarWhereInput[]
    OR?: RatingScalarWhereInput[]
    NOT?: RatingScalarWhereInput | RatingScalarWhereInput[]
    id?: StringFilter<"Rating"> | string
    userId?: StringFilter<"Rating"> | string
    variant?: StringFilter<"Rating"> | string
    category?: StringFilter<"Rating"> | string
    rating?: IntFilter<"Rating"> | number
    rd?: FloatFilter<"Rating"> | number
    sigma?: FloatFilter<"Rating"> | number
    gameCount?: IntFilter<"Rating"> | number
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    updatedAt?: DateTimeFilter<"Rating"> | Date | string
  }

  export type PuzzleRatingUpsertWithoutUserInput = {
    update: XOR<PuzzleRatingUpdateWithoutUserInput, PuzzleRatingUncheckedUpdateWithoutUserInput>
    create: XOR<PuzzleRatingCreateWithoutUserInput, PuzzleRatingUncheckedCreateWithoutUserInput>
    where?: PuzzleRatingWhereInput
  }

  export type PuzzleRatingUpdateToOneWithWhereWithoutUserInput = {
    where?: PuzzleRatingWhereInput
    data: XOR<PuzzleRatingUpdateWithoutUserInput, PuzzleRatingUncheckedUpdateWithoutUserInput>
  }

  export type PuzzleRatingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRatingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput
    update: XOR<GameAnalysisUpdateWithoutUserInput, GameAnalysisUncheckedUpdateWithoutUserInput>
    create: XOR<GameAnalysisCreateWithoutUserInput, GameAnalysisUncheckedCreateWithoutUserInput>
  }

  export type GameAnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput
    data: XOR<GameAnalysisUpdateWithoutUserInput, GameAnalysisUncheckedUpdateWithoutUserInput>
  }

  export type GameAnalysisUpdateManyWithWhereWithoutUserInput = {
    where: GameAnalysisScalarWhereInput
    data: XOR<GameAnalysisUpdateManyMutationInput, GameAnalysisUncheckedUpdateManyWithoutUserInput>
  }

  export type GameAnalysisScalarWhereInput = {
    AND?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[]
    OR?: GameAnalysisScalarWhereInput[]
    NOT?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[]
    id?: StringFilter<"GameAnalysis"> | string
    gameId?: StringFilter<"GameAnalysis"> | string
    userId?: StringFilter<"GameAnalysis"> | string
    results?: JsonFilter<"GameAnalysis">
    createdAt?: DateTimeFilter<"GameAnalysis"> | Date | string
  }

  export type PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput
    update: XOR<PuzzleAttemptUpdateWithoutUserInput, PuzzleAttemptUncheckedUpdateWithoutUserInput>
    create: XOR<PuzzleAttemptCreateWithoutUserInput, PuzzleAttemptUncheckedCreateWithoutUserInput>
  }

  export type PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput
    data: XOR<PuzzleAttemptUpdateWithoutUserInput, PuzzleAttemptUncheckedUpdateWithoutUserInput>
  }

  export type PuzzleAttemptUpdateManyWithWhereWithoutUserInput = {
    where: PuzzleAttemptScalarWhereInput
    data: XOR<PuzzleAttemptUpdateManyMutationInput, PuzzleAttemptUncheckedUpdateManyWithoutUserInput>
  }

  export type PuzzleAttemptScalarWhereInput = {
    AND?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[]
    OR?: PuzzleAttemptScalarWhereInput[]
    NOT?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[]
    id?: StringFilter<"PuzzleAttempt"> | string
    userId?: StringFilter<"PuzzleAttempt"> | string
    puzzleId?: StringFilter<"PuzzleAttempt"> | string
    difficulty?: StringFilter<"PuzzleAttempt"> | string
    rating?: IntFilter<"PuzzleAttempt"> | number
    solved?: BoolFilter<"PuzzleAttempt"> | boolean
    usedHint?: BoolFilter<"PuzzleAttempt"> | boolean
    createdAt?: DateTimeFilter<"PuzzleAttempt"> | Date | string
  }

  export type PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput
    update: XOR<PuzzleRushScoreUpdateWithoutUserInput, PuzzleRushScoreUncheckedUpdateWithoutUserInput>
    create: XOR<PuzzleRushScoreCreateWithoutUserInput, PuzzleRushScoreUncheckedCreateWithoutUserInput>
  }

  export type PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput
    data: XOR<PuzzleRushScoreUpdateWithoutUserInput, PuzzleRushScoreUncheckedUpdateWithoutUserInput>
  }

  export type PuzzleRushScoreUpdateManyWithWhereWithoutUserInput = {
    where: PuzzleRushScoreScalarWhereInput
    data: XOR<PuzzleRushScoreUpdateManyMutationInput, PuzzleRushScoreUncheckedUpdateManyWithoutUserInput>
  }

  export type PuzzleRushScoreScalarWhereInput = {
    AND?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[]
    OR?: PuzzleRushScoreScalarWhereInput[]
    NOT?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[]
    id?: StringFilter<"PuzzleRushScore"> | string
    userId?: StringFilter<"PuzzleRushScore"> | string
    mode?: StringFilter<"PuzzleRushScore"> | string
    difficulty?: StringFilter<"PuzzleRushScore"> | string
    score?: IntFilter<"PuzzleRushScore"> | number
    mistakes?: IntFilter<"PuzzleRushScore"> | number
    timeLimitSeconds?: IntNullableFilter<"PuzzleRushScore"> | number | null
    maxMistakes?: IntNullableFilter<"PuzzleRushScore"> | number | null
    createdAt?: DateTimeFilter<"PuzzleRushScore"> | Date | string
  }

  export type MemorySessionUpsertWithWhereUniqueWithoutUserInput = {
    where: MemorySessionWhereUniqueInput
    update: XOR<MemorySessionUpdateWithoutUserInput, MemorySessionUncheckedUpdateWithoutUserInput>
    create: XOR<MemorySessionCreateWithoutUserInput, MemorySessionUncheckedCreateWithoutUserInput>
  }

  export type MemorySessionUpdateWithWhereUniqueWithoutUserInput = {
    where: MemorySessionWhereUniqueInput
    data: XOR<MemorySessionUpdateWithoutUserInput, MemorySessionUncheckedUpdateWithoutUserInput>
  }

  export type MemorySessionUpdateManyWithWhereWithoutUserInput = {
    where: MemorySessionScalarWhereInput
    data: XOR<MemorySessionUpdateManyMutationInput, MemorySessionUncheckedUpdateManyWithoutUserInput>
  }

  export type MemorySessionScalarWhereInput = {
    AND?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[]
    OR?: MemorySessionScalarWhereInput[]
    NOT?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[]
    id?: StringFilter<"MemorySession"> | string
    userId?: StringFilter<"MemorySession"> | string
    mode?: StringFilter<"MemorySession"> | string
    pieceCount?: IntFilter<"MemorySession"> | number
    memorizeTimeSeconds?: IntFilter<"MemorySession"> | number
    correctPieces?: IntFilter<"MemorySession"> | number
    totalPieces?: IntFilter<"MemorySession"> | number
    accuracy?: FloatFilter<"MemorySession"> | number
    progressiveLevel?: IntNullableFilter<"MemorySession"> | number | null
    createdAt?: DateTimeFilter<"MemorySession"> | Date | string
  }

  export type VisionSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: VisionSessionWhereUniqueInput
    update: XOR<VisionSessionUpdateWithoutUserInput, VisionSessionUncheckedUpdateWithoutUserInput>
    create: XOR<VisionSessionCreateWithoutUserInput, VisionSessionUncheckedCreateWithoutUserInput>
  }

  export type VisionSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: VisionSessionWhereUniqueInput
    data: XOR<VisionSessionUpdateWithoutUserInput, VisionSessionUncheckedUpdateWithoutUserInput>
  }

  export type VisionSessionUpdateManyWithWhereWithoutUserInput = {
    where: VisionSessionScalarWhereInput
    data: XOR<VisionSessionUpdateManyMutationInput, VisionSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type VisionSessionScalarWhereInput = {
    AND?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[]
    OR?: VisionSessionScalarWhereInput[]
    NOT?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[]
    id?: StringFilter<"VisionSession"> | string
    userId?: StringFilter<"VisionSession"> | string
    trainingMode?: StringFilter<"VisionSession"> | string
    colorMode?: StringFilter<"VisionSession"> | string
    timeLimitSeconds?: IntFilter<"VisionSession"> | number
    score?: IntFilter<"VisionSession"> | number
    totalAttempts?: IntFilter<"VisionSession"> | number
    accuracy?: FloatFilter<"VisionSession"> | number
    avgResponseTimeMs?: IntFilter<"VisionSession"> | number
    createdAt?: DateTimeFilter<"VisionSession"> | Date | string
  }

  export type PassportFlagUpsertWithWhereUniqueWithoutUserInput = {
    where: PassportFlagWhereUniqueInput
    update: XOR<PassportFlagUpdateWithoutUserInput, PassportFlagUncheckedUpdateWithoutUserInput>
    create: XOR<PassportFlagCreateWithoutUserInput, PassportFlagUncheckedCreateWithoutUserInput>
  }

  export type PassportFlagUpdateWithWhereUniqueWithoutUserInput = {
    where: PassportFlagWhereUniqueInput
    data: XOR<PassportFlagUpdateWithoutUserInput, PassportFlagUncheckedUpdateWithoutUserInput>
  }

  export type PassportFlagUpdateManyWithWhereWithoutUserInput = {
    where: PassportFlagScalarWhereInput
    data: XOR<PassportFlagUpdateManyMutationInput, PassportFlagUncheckedUpdateManyWithoutUserInput>
  }

  export type PassportFlagScalarWhereInput = {
    AND?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[]
    OR?: PassportFlagScalarWhereInput[]
    NOT?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[]
    id?: StringFilter<"PassportFlag"> | string
    userId?: StringFilter<"PassportFlag"> | string
    flagCode?: StringFilter<"PassportFlag"> | string
    createdAt?: DateTimeFilter<"PassportFlag"> | Date | string
  }

  export type UserCreateWithoutPassportFlagsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPassportFlagsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPassportFlagsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPassportFlagsInput, UserUncheckedCreateWithoutPassportFlagsInput>
  }

  export type UserUpsertWithoutPassportFlagsInput = {
    update: XOR<UserUpdateWithoutPassportFlagsInput, UserUncheckedUpdateWithoutPassportFlagsInput>
    create: XOR<UserCreateWithoutPassportFlagsInput, UserUncheckedCreateWithoutPassportFlagsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPassportFlagsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPassportFlagsInput, UserUncheckedUpdateWithoutPassportFlagsInput>
  }

  export type UserUpdateWithoutPassportFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPassportFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAuthenticatorInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuthenticatorInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuthenticatorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuthenticatorInput, UserUncheckedCreateWithoutAuthenticatorInput>
  }

  export type UserUpsertWithoutAuthenticatorInput = {
    update: XOR<UserUpdateWithoutAuthenticatorInput, UserUncheckedUpdateWithoutAuthenticatorInput>
    create: XOR<UserCreateWithoutAuthenticatorInput, UserUncheckedCreateWithoutAuthenticatorInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuthenticatorInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuthenticatorInput, UserUncheckedUpdateWithoutAuthenticatorInput>
  }

  export type UserUpdateWithoutAuthenticatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuthenticatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutWhiteGamesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWhiteGamesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWhiteGamesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWhiteGamesInput, UserUncheckedCreateWithoutWhiteGamesInput>
  }

  export type UserCreateWithoutBlackGamesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBlackGamesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBlackGamesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBlackGamesInput, UserUncheckedCreateWithoutBlackGamesInput>
  }

  export type GameAnalysisCreateWithoutGameInput = {
    id?: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAnalysesInput
  }

  export type GameAnalysisUncheckedCreateWithoutGameInput = {
    id?: string
    userId: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GameAnalysisCreateOrConnectWithoutGameInput = {
    where: GameAnalysisWhereUniqueInput
    create: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
  }

  export type UserUpsertWithoutWhiteGamesInput = {
    update: XOR<UserUpdateWithoutWhiteGamesInput, UserUncheckedUpdateWithoutWhiteGamesInput>
    create: XOR<UserCreateWithoutWhiteGamesInput, UserUncheckedCreateWithoutWhiteGamesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWhiteGamesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWhiteGamesInput, UserUncheckedUpdateWithoutWhiteGamesInput>
  }

  export type UserUpdateWithoutWhiteGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWhiteGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutBlackGamesInput = {
    update: XOR<UserUpdateWithoutBlackGamesInput, UserUncheckedUpdateWithoutBlackGamesInput>
    create: XOR<UserCreateWithoutBlackGamesInput, UserUncheckedCreateWithoutBlackGamesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBlackGamesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBlackGamesInput, UserUncheckedUpdateWithoutBlackGamesInput>
  }

  export type UserUpdateWithoutBlackGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBlackGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GameAnalysisUpsertWithoutGameInput = {
    update: XOR<GameAnalysisUpdateWithoutGameInput, GameAnalysisUncheckedUpdateWithoutGameInput>
    create: XOR<GameAnalysisCreateWithoutGameInput, GameAnalysisUncheckedCreateWithoutGameInput>
    where?: GameAnalysisWhereInput
  }

  export type GameAnalysisUpdateToOneWithWhereWithoutGameInput = {
    where?: GameAnalysisWhereInput
    data: XOR<GameAnalysisUpdateWithoutGameInput, GameAnalysisUncheckedUpdateWithoutGameInput>
  }

  export type GameAnalysisUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type GameAnalysisUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameCreateWithoutAnalysisInput = {
    id?: string
    roomId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
    white?: UserCreateNestedOneWithoutWhiteGamesInput
    black?: UserCreateNestedOneWithoutBlackGamesInput
  }

  export type GameUncheckedCreateWithoutAnalysisInput = {
    id?: string
    roomId?: string | null
    whiteUserId?: string | null
    blackUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GameCreateOrConnectWithoutAnalysisInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutAnalysisInput, GameUncheckedCreateWithoutAnalysisInput>
  }

  export type UserCreateWithoutAnalysesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnalysesInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnalysesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
  }

  export type GameUpsertWithoutAnalysisInput = {
    update: XOR<GameUpdateWithoutAnalysisInput, GameUncheckedUpdateWithoutAnalysisInput>
    create: XOR<GameCreateWithoutAnalysisInput, GameUncheckedCreateWithoutAnalysisInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutAnalysisInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutAnalysisInput, GameUncheckedUpdateWithoutAnalysisInput>
  }

  export type GameUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    white?: UserUpdateOneWithoutWhiteGamesNestedInput
    black?: UserUpdateOneWithoutBlackGamesNestedInput
  }

  export type GameUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutAnalysesInput = {
    update: XOR<UserUpdateWithoutAnalysesInput, UserUncheckedUpdateWithoutAnalysesInput>
    create: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnalysesInput, UserUncheckedUpdateWithoutAnalysesInput>
  }

  export type UserUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutRatingsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRatingsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRatingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRatingsInput, UserUncheckedCreateWithoutRatingsInput>
  }

  export type UserUpsertWithoutRatingsInput = {
    update: XOR<UserUpdateWithoutRatingsInput, UserUncheckedUpdateWithoutRatingsInput>
    create: XOR<UserCreateWithoutRatingsInput, UserUncheckedCreateWithoutRatingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRatingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRatingsInput, UserUncheckedUpdateWithoutRatingsInput>
  }

  export type UserUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPuzzleRatingInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPuzzleRatingInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPuzzleRatingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPuzzleRatingInput, UserUncheckedCreateWithoutPuzzleRatingInput>
  }

  export type UserUpsertWithoutPuzzleRatingInput = {
    update: XOR<UserUpdateWithoutPuzzleRatingInput, UserUncheckedUpdateWithoutPuzzleRatingInput>
    create: XOR<UserCreateWithoutPuzzleRatingInput, UserUncheckedCreateWithoutPuzzleRatingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPuzzleRatingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPuzzleRatingInput, UserUncheckedUpdateWithoutPuzzleRatingInput>
  }

  export type UserUpdateWithoutPuzzleRatingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPuzzleRatingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPuzzleAttemptsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPuzzleAttemptsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPuzzleAttemptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPuzzleAttemptsInput, UserUncheckedCreateWithoutPuzzleAttemptsInput>
  }

  export type UserUpsertWithoutPuzzleAttemptsInput = {
    update: XOR<UserUpdateWithoutPuzzleAttemptsInput, UserUncheckedUpdateWithoutPuzzleAttemptsInput>
    create: XOR<UserCreateWithoutPuzzleAttemptsInput, UserUncheckedCreateWithoutPuzzleAttemptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPuzzleAttemptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPuzzleAttemptsInput, UserUncheckedUpdateWithoutPuzzleAttemptsInput>
  }

  export type UserUpdateWithoutPuzzleAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPuzzleAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPuzzleRushScoresInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPuzzleRushScoresInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPuzzleRushScoresInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPuzzleRushScoresInput, UserUncheckedCreateWithoutPuzzleRushScoresInput>
  }

  export type UserUpsertWithoutPuzzleRushScoresInput = {
    update: XOR<UserUpdateWithoutPuzzleRushScoresInput, UserUncheckedUpdateWithoutPuzzleRushScoresInput>
    create: XOR<UserCreateWithoutPuzzleRushScoresInput, UserUncheckedCreateWithoutPuzzleRushScoresInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPuzzleRushScoresInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPuzzleRushScoresInput, UserUncheckedUpdateWithoutPuzzleRushScoresInput>
  }

  export type UserUpdateWithoutPuzzleRushScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPuzzleRushScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutMemorySessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMemorySessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMemorySessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMemorySessionsInput, UserUncheckedCreateWithoutMemorySessionsInput>
  }

  export type UserUpsertWithoutMemorySessionsInput = {
    update: XOR<UserUpdateWithoutMemorySessionsInput, UserUncheckedUpdateWithoutMemorySessionsInput>
    create: XOR<UserCreateWithoutMemorySessionsInput, UserUncheckedCreateWithoutMemorySessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMemorySessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMemorySessionsInput, UserUncheckedUpdateWithoutMemorySessionsInput>
  }

  export type UserUpdateWithoutMemorySessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMemorySessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutVisionSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput
    whiteGames?: GameCreateNestedManyWithoutWhiteInput
    blackGames?: GameCreateNestedManyWithoutBlackInput
    ratings?: RatingCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVisionSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    flagCode?: string
    banned?: boolean
    bannedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVisionSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVisionSessionsInput, UserUncheckedCreateWithoutVisionSessionsInput>
  }

  export type UserUpsertWithoutVisionSessionsInput = {
    update: XOR<UserUpdateWithoutVisionSessionsInput, UserUncheckedUpdateWithoutVisionSessionsInput>
    create: XOR<UserCreateWithoutVisionSessionsInput, UserUncheckedCreateWithoutVisionSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVisionSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVisionSessionsInput, UserUncheckedUpdateWithoutVisionSessionsInput>
  }

  export type UserUpdateWithoutVisionSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUpdateManyWithoutBlackNestedInput
    ratings?: RatingUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVisionSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    flagCode?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    bannedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateManyUserInput = {
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthenticatorCreateManyUserInput = {
    credentialID: string
    providerAccountId: string
    credentialPublicKey: string
    counter: number
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports?: string | null
  }

  export type GameCreateManyWhiteInput = {
    id?: string
    roomId?: string | null
    blackUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GameCreateManyBlackInput = {
    id?: string
    roomId?: string | null
    whiteUserId?: string | null
    variant: string
    gameType: string
    result: string
    resultReason: string
    moves?: GameCreatemovesInput | string[]
    startingFen: string
    timeControl: JsonNullValueInput | InputJsonValue
    whitePregameRating?: number | null
    blackPregameRating?: number | null
    whiteRatingDelta?: number | null
    blackRatingDelta?: number | null
    moveCount: number
    rated?: boolean
    playedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RatingCreateManyUserInput = {
    id?: string
    variant?: string
    category: string
    rating?: number
    rd?: number
    sigma?: number
    gameCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameAnalysisCreateManyUserInput = {
    id?: string
    gameId: string
    results: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PuzzleAttemptCreateManyUserInput = {
    id?: string
    puzzleId: string
    difficulty: string
    rating: number
    solved: boolean
    usedHint?: boolean
    createdAt?: Date | string
  }

  export type PuzzleRushScoreCreateManyUserInput = {
    id?: string
    mode: string
    difficulty: string
    score: number
    mistakes: number
    timeLimitSeconds?: number | null
    maxMistakes?: number | null
    createdAt?: Date | string
  }

  export type MemorySessionCreateManyUserInput = {
    id?: string
    mode: string
    pieceCount: number
    memorizeTimeSeconds: number
    correctPieces: number
    totalPieces: number
    accuracy: number
    progressiveLevel?: number | null
    createdAt?: Date | string
  }

  export type VisionSessionCreateManyUserInput = {
    id?: string
    trainingMode: string
    colorMode: string
    timeLimitSeconds: number
    score: number
    totalAttempts: number
    accuracy: number
    avgResponseTimeMs: number
    createdAt?: Date | string
  }

  export type PassportFlagCreateManyUserInput = {
    id?: string
    flagCode: string
    createdAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthenticatorUpdateWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthenticatorUncheckedUpdateManyWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    credentialPublicKey?: StringFieldUpdateOperationsInput | string
    counter?: IntFieldUpdateOperationsInput | number
    credentialDeviceType?: StringFieldUpdateOperationsInput | string
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean
    transports?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameUpdateWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    black?: UserUpdateOneWithoutBlackGamesNestedInput
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameUpdateWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    white?: UserUpdateOneWithoutWhiteGamesNestedInput
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null
    variant?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    result?: StringFieldUpdateOperationsInput | string
    resultReason?: StringFieldUpdateOperationsInput | string
    moves?: GameUpdatemovesInput | string[]
    startingFen?: StringFieldUpdateOperationsInput | string
    timeControl?: JsonNullValueInput | InputJsonValue
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null
    moveCount?: IntFieldUpdateOperationsInput | number
    rated?: BoolFieldUpdateOperationsInput | boolean
    playedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    rd?: FloatFieldUpdateOperationsInput | number
    sigma?: FloatFieldUpdateOperationsInput | number
    gameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutAnalysisNestedInput
  }

  export type GameAnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameAnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    puzzleId?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    solved?: BoolFieldUpdateOperationsInput | boolean
    usedHint?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PuzzleRushScoreUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    mistakes?: IntFieldUpdateOperationsInput | number
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pieceCount?: IntFieldUpdateOperationsInput | number
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number
    correctPieces?: IntFieldUpdateOperationsInput | number
    totalPieces?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisionSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingMode?: StringFieldUpdateOperationsInput | string
    colorMode?: StringFieldUpdateOperationsInput | string
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    totalAttempts?: IntFieldUpdateOperationsInput | number
    accuracy?: FloatFieldUpdateOperationsInput | number
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PassportFlagUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    flagCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}