import * as runtime from './runtime/client.js';
import $Types = runtime.Types;
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;
export type PrismaPromise<T> = $Public.PrismaPromise<T>;
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
export type PassportFlag =
  $Result.DefaultSelection<Prisma.$PassportFlagPayload>;
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>;
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
export type VerificationToken =
  $Result.DefaultSelection<Prisma.$VerificationTokenPayload>;
export type Authenticator =
  $Result.DefaultSelection<Prisma.$AuthenticatorPayload>;
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>;
export type GameAnalysis =
  $Result.DefaultSelection<Prisma.$GameAnalysisPayload>;
export type Rating = $Result.DefaultSelection<Prisma.$RatingPayload>;
export type PuzzleRating =
  $Result.DefaultSelection<Prisma.$PuzzleRatingPayload>;
export type PuzzleAttempt =
  $Result.DefaultSelection<Prisma.$PuzzleAttemptPayload>;
export type PuzzleRushScore =
  $Result.DefaultSelection<Prisma.$PuzzleRushScorePayload>;
export type MemorySession =
  $Result.DefaultSelection<Prisma.$MemorySessionPayload>;
export type VisionSession =
  $Result.DefaultSelection<Prisma.$VisionSessionPayload>;
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: {
    types: Prisma.TypeMap<ExtArgs>['other'];
  };
  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
    ) => void
  ): PrismaClient;
  $connect(): $Utils.JsPromise<void>;
  $disconnect(): $Utils.JsPromise<void>;
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: {
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;
  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;
  get passportFlag(): Prisma.PassportFlagDelegate<ExtArgs, ClientOptions>;
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;
  get verificationToken(): Prisma.VerificationTokenDelegate<
    ExtArgs,
    ClientOptions
  >;
  get authenticator(): Prisma.AuthenticatorDelegate<ExtArgs, ClientOptions>;
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;
  get gameAnalysis(): Prisma.GameAnalysisDelegate<ExtArgs, ClientOptions>;
  get rating(): Prisma.RatingDelegate<ExtArgs, ClientOptions>;
  get puzzleRating(): Prisma.PuzzleRatingDelegate<ExtArgs, ClientOptions>;
  get puzzleAttempt(): Prisma.PuzzleAttemptDelegate<ExtArgs, ClientOptions>;
  get puzzleRushScore(): Prisma.PuzzleRushScoreDelegate<ExtArgs, ClientOptions>;
  get memorySession(): Prisma.MemorySessionDelegate<ExtArgs, ClientOptions>;
  get visionSession(): Prisma.VisionSessionDelegate<ExtArgs, ClientOptions>;
}
export namespace Prisma {
  export import DMMF = runtime.DMMF;
  export type PrismaPromise<T> = $Public.PrismaPromise<T>;
  export import validator = runtime.Public.validator;
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;
  export import Decimal = runtime.Decimal;
  export type DecimalJsLike = runtime.DecimalJsLike;
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;
  export type PrismaVersion = {
    client: string;
    engine: string;
  };
  export const prismaVersion: PrismaVersion;
  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;
  namespace NullTypes {
    class DbNull {
      private DbNull: never;
      private constructor();
    }
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }
  export const DbNull: NullTypes.DbNull;
  export const JsonNull: NullTypes.JsonNull;
  export const AnyNull: NullTypes.AnyNull;
  type SelectAndInclude = {
    select: any;
    include: any;
  };
  type SelectAndOmit = {
    select: any;
    omit: any;
  };
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>
  > = PromiseType<ReturnType<T>>;
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  export type Enumerable<T> = T | Array<T>;
  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];
  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };
  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;
  type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
  };
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      [P in K]: Prisma__Pick<O, P & keyof O>;
    }[K];
  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;
  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];
  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never;
  export type Union = any;
  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};
  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;
  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];
  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};
  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};
  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };
  type NoExpand<T> = T extends unknown ? T : never;
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O
              ? {
                  [P in K]: O[P];
                } & O
              : O)
          | ({
              [P in keyof O as P extends K ? P : never]-?: O[P];
            } & O)
      : never
  >;
  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;
  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
  export type Boolean = True | False;
  export type True = 1;
  export type False = 0;
  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];
  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0
    : A1 extends A2
      ? 1
      : 0;
  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;
  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];
  export type Keys<U extends Union> = U extends unknown ? keyof U : never;
  type Cast<A, B> = A extends B ? A : B;
  export const type: unique symbol;
  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;
  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T;
  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;
  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;
  export const ModelName: {
    User: 'User';
    PassportFlag: 'PassportFlag';
    Account: 'Account';
    Session: 'Session';
    VerificationToken: 'VerificationToken';
    Authenticator: 'Authenticator';
    Game: 'Game';
    GameAnalysis: 'GameAnalysis';
    Rating: 'Rating';
    PuzzleRating: 'PuzzleRating';
    PuzzleAttempt: 'PuzzleAttempt';
    PuzzleRushScore: 'PuzzleRushScore';
    MemorySession: 'MemorySession';
    VisionSession: 'VisionSession';
  };
  export type ModelName = (typeof ModelName)[keyof typeof ModelName];
  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      {
        extArgs: $Extensions.InternalArgs;
      },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends {
        omit: infer OmitOptions;
      }
        ? OmitOptions
        : {}
    >;
  }
  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'user'
        | 'passportFlag'
        | 'account'
        | 'session'
        | 'verificationToken'
        | 'authenticator'
        | 'game'
        | 'gameAnalysis'
        | 'rating'
        | 'puzzleRating'
        | 'puzzleAttempt'
        | 'puzzleRushScore'
        | 'memorySession'
        | 'visionSession';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      PassportFlag: {
        payload: Prisma.$PassportFlagPayload<ExtArgs>;
        fields: Prisma.PassportFlagFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PassportFlagFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PassportFlagFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          findFirst: {
            args: Prisma.PassportFlagFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PassportFlagFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          findMany: {
            args: Prisma.PassportFlagFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[];
          };
          create: {
            args: Prisma.PassportFlagCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          createMany: {
            args: Prisma.PassportFlagCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PassportFlagCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[];
          };
          delete: {
            args: Prisma.PassportFlagDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          update: {
            args: Prisma.PassportFlagUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          deleteMany: {
            args: Prisma.PassportFlagDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PassportFlagUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PassportFlagUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>[];
          };
          upsert: {
            args: Prisma.PassportFlagUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PassportFlagPayload>;
          };
          aggregate: {
            args: Prisma.PassportFlagAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePassportFlag>;
          };
          groupBy: {
            args: Prisma.PassportFlagGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PassportFlagGroupByOutputType>[];
          };
          count: {
            args: Prisma.PassportFlagCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<PassportFlagCountAggregateOutputType>
              | number;
          };
        };
      };
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>;
        fields: Prisma.AccountFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccount>;
          };
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountCountAggregateOutputType> | number;
          };
        };
      };
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>;
        fields: Prisma.SessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSession>;
          };
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>;
            result: $Utils.Optional<SessionCountAggregateOutputType> | number;
          };
        };
      };
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>;
        fields: Prisma.VerificationTokenFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[];
          };
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[];
          };
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[];
          };
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>;
          };
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVerificationToken>;
          };
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[];
          };
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<VerificationTokenCountAggregateOutputType>
              | number;
          };
        };
      };
      Authenticator: {
        payload: Prisma.$AuthenticatorPayload<ExtArgs>;
        fields: Prisma.AuthenticatorFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AuthenticatorFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AuthenticatorFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          findFirst: {
            args: Prisma.AuthenticatorFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AuthenticatorFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          findMany: {
            args: Prisma.AuthenticatorFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[];
          };
          create: {
            args: Prisma.AuthenticatorCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          createMany: {
            args: Prisma.AuthenticatorCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AuthenticatorCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[];
          };
          delete: {
            args: Prisma.AuthenticatorDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          update: {
            args: Prisma.AuthenticatorUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          deleteMany: {
            args: Prisma.AuthenticatorDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AuthenticatorUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AuthenticatorUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>[];
          };
          upsert: {
            args: Prisma.AuthenticatorUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuthenticatorPayload>;
          };
          aggregate: {
            args: Prisma.AuthenticatorAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAuthenticator>;
          };
          groupBy: {
            args: Prisma.AuthenticatorGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AuthenticatorGroupByOutputType>[];
          };
          count: {
            args: Prisma.AuthenticatorCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<AuthenticatorCountAggregateOutputType>
              | number;
          };
        };
      };
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>;
        fields: Prisma.GameFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[];
          };
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[];
          };
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[];
          };
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GamePayload>;
          };
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateGame>;
          };
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>;
            result: $Utils.Optional<GameGroupByOutputType>[];
          };
          count: {
            args: Prisma.GameCountArgs<ExtArgs>;
            result: $Utils.Optional<GameCountAggregateOutputType> | number;
          };
        };
      };
      GameAnalysis: {
        payload: Prisma.$GameAnalysisPayload<ExtArgs>;
        fields: Prisma.GameAnalysisFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.GameAnalysisFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.GameAnalysisFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          findFirst: {
            args: Prisma.GameAnalysisFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.GameAnalysisFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          findMany: {
            args: Prisma.GameAnalysisFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[];
          };
          create: {
            args: Prisma.GameAnalysisCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          createMany: {
            args: Prisma.GameAnalysisCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.GameAnalysisCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[];
          };
          delete: {
            args: Prisma.GameAnalysisDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          update: {
            args: Prisma.GameAnalysisUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          deleteMany: {
            args: Prisma.GameAnalysisDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.GameAnalysisUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.GameAnalysisUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>[];
          };
          upsert: {
            args: Prisma.GameAnalysisUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$GameAnalysisPayload>;
          };
          aggregate: {
            args: Prisma.GameAnalysisAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateGameAnalysis>;
          };
          groupBy: {
            args: Prisma.GameAnalysisGroupByArgs<ExtArgs>;
            result: $Utils.Optional<GameAnalysisGroupByOutputType>[];
          };
          count: {
            args: Prisma.GameAnalysisCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<GameAnalysisCountAggregateOutputType>
              | number;
          };
        };
      };
      Rating: {
        payload: Prisma.$RatingPayload<ExtArgs>;
        fields: Prisma.RatingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.RatingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.RatingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          findFirst: {
            args: Prisma.RatingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.RatingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          findMany: {
            args: Prisma.RatingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[];
          };
          create: {
            args: Prisma.RatingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          createMany: {
            args: Prisma.RatingCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.RatingCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[];
          };
          delete: {
            args: Prisma.RatingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          update: {
            args: Prisma.RatingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          deleteMany: {
            args: Prisma.RatingDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.RatingUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.RatingUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[];
          };
          upsert: {
            args: Prisma.RatingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>;
          };
          aggregate: {
            args: Prisma.RatingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateRating>;
          };
          groupBy: {
            args: Prisma.RatingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<RatingGroupByOutputType>[];
          };
          count: {
            args: Prisma.RatingCountArgs<ExtArgs>;
            result: $Utils.Optional<RatingCountAggregateOutputType> | number;
          };
        };
      };
      PuzzleRating: {
        payload: Prisma.$PuzzleRatingPayload<ExtArgs>;
        fields: Prisma.PuzzleRatingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PuzzleRatingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PuzzleRatingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          findFirst: {
            args: Prisma.PuzzleRatingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PuzzleRatingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          findMany: {
            args: Prisma.PuzzleRatingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[];
          };
          create: {
            args: Prisma.PuzzleRatingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          createMany: {
            args: Prisma.PuzzleRatingCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PuzzleRatingCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[];
          };
          delete: {
            args: Prisma.PuzzleRatingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          update: {
            args: Prisma.PuzzleRatingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          deleteMany: {
            args: Prisma.PuzzleRatingDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PuzzleRatingUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PuzzleRatingUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>[];
          };
          upsert: {
            args: Prisma.PuzzleRatingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRatingPayload>;
          };
          aggregate: {
            args: Prisma.PuzzleRatingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePuzzleRating>;
          };
          groupBy: {
            args: Prisma.PuzzleRatingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PuzzleRatingGroupByOutputType>[];
          };
          count: {
            args: Prisma.PuzzleRatingCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<PuzzleRatingCountAggregateOutputType>
              | number;
          };
        };
      };
      PuzzleAttempt: {
        payload: Prisma.$PuzzleAttemptPayload<ExtArgs>;
        fields: Prisma.PuzzleAttemptFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PuzzleAttemptFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PuzzleAttemptFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          findFirst: {
            args: Prisma.PuzzleAttemptFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PuzzleAttemptFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          findMany: {
            args: Prisma.PuzzleAttemptFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[];
          };
          create: {
            args: Prisma.PuzzleAttemptCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          createMany: {
            args: Prisma.PuzzleAttemptCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PuzzleAttemptCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[];
          };
          delete: {
            args: Prisma.PuzzleAttemptDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          update: {
            args: Prisma.PuzzleAttemptUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          deleteMany: {
            args: Prisma.PuzzleAttemptDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PuzzleAttemptUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PuzzleAttemptUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>[];
          };
          upsert: {
            args: Prisma.PuzzleAttemptUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleAttemptPayload>;
          };
          aggregate: {
            args: Prisma.PuzzleAttemptAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePuzzleAttempt>;
          };
          groupBy: {
            args: Prisma.PuzzleAttemptGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PuzzleAttemptGroupByOutputType>[];
          };
          count: {
            args: Prisma.PuzzleAttemptCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<PuzzleAttemptCountAggregateOutputType>
              | number;
          };
        };
      };
      PuzzleRushScore: {
        payload: Prisma.$PuzzleRushScorePayload<ExtArgs>;
        fields: Prisma.PuzzleRushScoreFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PuzzleRushScoreFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PuzzleRushScoreFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          findFirst: {
            args: Prisma.PuzzleRushScoreFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PuzzleRushScoreFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          findMany: {
            args: Prisma.PuzzleRushScoreFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[];
          };
          create: {
            args: Prisma.PuzzleRushScoreCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          createMany: {
            args: Prisma.PuzzleRushScoreCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PuzzleRushScoreCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[];
          };
          delete: {
            args: Prisma.PuzzleRushScoreDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          update: {
            args: Prisma.PuzzleRushScoreUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          deleteMany: {
            args: Prisma.PuzzleRushScoreDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PuzzleRushScoreUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PuzzleRushScoreUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>[];
          };
          upsert: {
            args: Prisma.PuzzleRushScoreUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PuzzleRushScorePayload>;
          };
          aggregate: {
            args: Prisma.PuzzleRushScoreAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePuzzleRushScore>;
          };
          groupBy: {
            args: Prisma.PuzzleRushScoreGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PuzzleRushScoreGroupByOutputType>[];
          };
          count: {
            args: Prisma.PuzzleRushScoreCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<PuzzleRushScoreCountAggregateOutputType>
              | number;
          };
        };
      };
      MemorySession: {
        payload: Prisma.$MemorySessionPayload<ExtArgs>;
        fields: Prisma.MemorySessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MemorySessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MemorySessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          findFirst: {
            args: Prisma.MemorySessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MemorySessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          findMany: {
            args: Prisma.MemorySessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[];
          };
          create: {
            args: Prisma.MemorySessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          createMany: {
            args: Prisma.MemorySessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MemorySessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[];
          };
          delete: {
            args: Prisma.MemorySessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          update: {
            args: Prisma.MemorySessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          deleteMany: {
            args: Prisma.MemorySessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MemorySessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MemorySessionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[];
          };
          upsert: {
            args: Prisma.MemorySessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>;
          };
          aggregate: {
            args: Prisma.MemorySessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMemorySession>;
          };
          groupBy: {
            args: Prisma.MemorySessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MemorySessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.MemorySessionCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<MemorySessionCountAggregateOutputType>
              | number;
          };
        };
      };
      VisionSession: {
        payload: Prisma.$VisionSessionPayload<ExtArgs>;
        fields: Prisma.VisionSessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VisionSessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VisionSessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          findFirst: {
            args: Prisma.VisionSessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VisionSessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          findMany: {
            args: Prisma.VisionSessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[];
          };
          create: {
            args: Prisma.VisionSessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          createMany: {
            args: Prisma.VisionSessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VisionSessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[];
          };
          delete: {
            args: Prisma.VisionSessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          update: {
            args: Prisma.VisionSessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          deleteMany: {
            args: Prisma.VisionSessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VisionSessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.VisionSessionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>[];
          };
          upsert: {
            args: Prisma.VisionSessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VisionSessionPayload>;
          };
          aggregate: {
            args: Prisma.VisionSessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVisionSession>;
          };
          groupBy: {
            args: Prisma.VisionSessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VisionSessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.VisionSessionCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<VisionSessionCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    adapter?: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: string;
    omit?: Prisma.GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    passportFlag?: PassportFlagOmit;
    account?: AccountOmit;
    session?: SessionOmit;
    verificationToken?: VerificationTokenOmit;
    authenticator?: AuthenticatorOmit;
    game?: GameOmit;
    gameAnalysis?: GameAnalysisOmit;
    rating?: RatingOmit;
    puzzleRating?: PuzzleRatingOmit;
    puzzleAttempt?: PuzzleAttemptOmit;
    puzzleRushScore?: PuzzleRushScoreOmit;
    memorySession?: MemorySessionOmit;
    visionSession?: VisionSessionOmit;
  };
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };
  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;
  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };
  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
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
    | 'groupBy';
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined;
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;
  export type Datasource = {
    url?: string;
  };
  export type UserCountOutputType = {
    accounts: number;
    sessions: number;
    Authenticator: number;
    whiteGames: number;
    blackGames: number;
    ratings: number;
    analyses: number;
    puzzleAttempts: number;
    puzzleRushScores: number;
    memorySessions: number;
    visionSessions: number;
    passportFlags: number;
  };
  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs;
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    Authenticator?: boolean | UserCountOutputTypeCountAuthenticatorArgs;
    whiteGames?: boolean | UserCountOutputTypeCountWhiteGamesArgs;
    blackGames?: boolean | UserCountOutputTypeCountBlackGamesArgs;
    ratings?: boolean | UserCountOutputTypeCountRatingsArgs;
    analyses?: boolean | UserCountOutputTypeCountAnalysesArgs;
    puzzleAttempts?: boolean | UserCountOutputTypeCountPuzzleAttemptsArgs;
    puzzleRushScores?: boolean | UserCountOutputTypeCountPuzzleRushScoresArgs;
    memorySessions?: boolean | UserCountOutputTypeCountMemorySessionsArgs;
    visionSessions?: boolean | UserCountOutputTypeCountVisionSessionsArgs;
    passportFlags?: boolean | UserCountOutputTypeCountPassportFlagsArgs;
  };
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };
  export type UserCountOutputTypeCountAccountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AccountWhereInput;
  };
  export type UserCountOutputTypeCountSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: SessionWhereInput;
  };
  export type UserCountOutputTypeCountAuthenticatorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AuthenticatorWhereInput;
  };
  export type UserCountOutputTypeCountWhiteGamesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameWhereInput;
  };
  export type UserCountOutputTypeCountBlackGamesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameWhereInput;
  };
  export type UserCountOutputTypeCountRatingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: RatingWhereInput;
  };
  export type UserCountOutputTypeCountAnalysesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameAnalysisWhereInput;
  };
  export type UserCountOutputTypeCountPuzzleAttemptsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleAttemptWhereInput;
  };
  export type UserCountOutputTypeCountPuzzleRushScoresArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRushScoreWhereInput;
  };
  export type UserCountOutputTypeCountMemorySessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: MemorySessionWhereInput;
  };
  export type UserCountOutputTypeCountVisionSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VisionSessionWhereInput;
  };
  export type UserCountOutputTypeCountPassportFlagsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PassportFlagWhereInput;
  };
  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };
  export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    flagCode: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    flagCode: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    emailVerified: number;
    image: number;
    flagCode: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };
  export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    flagCode?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    flagCode?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    flagCode?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };
  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: UserWhereInput;
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    cursor?: UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };
  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };
  export type UserGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: UserWhereInput;
    orderBy?:
      | UserOrderByWithAggregationInput
      | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };
  export type UserGroupByOutputType = {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    flagCode: string;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };
  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;
  export type UserSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      image?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      accounts?: boolean | User$accountsArgs<ExtArgs>;
      sessions?: boolean | User$sessionsArgs<ExtArgs>;
      Authenticator?: boolean | User$AuthenticatorArgs<ExtArgs>;
      whiteGames?: boolean | User$whiteGamesArgs<ExtArgs>;
      blackGames?: boolean | User$blackGamesArgs<ExtArgs>;
      ratings?: boolean | User$ratingsArgs<ExtArgs>;
      puzzleRating?: boolean | User$puzzleRatingArgs<ExtArgs>;
      analyses?: boolean | User$analysesArgs<ExtArgs>;
      puzzleAttempts?: boolean | User$puzzleAttemptsArgs<ExtArgs>;
      puzzleRushScores?: boolean | User$puzzleRushScoresArgs<ExtArgs>;
      memorySessions?: boolean | User$memorySessionsArgs<ExtArgs>;
      visionSessions?: boolean | User$visionSessionsArgs<ExtArgs>;
      passportFlags?: boolean | User$passportFlagsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;
  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      image?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;
  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      emailVerified?: boolean;
      image?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;
  export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    emailVerified?: boolean;
    image?: boolean;
    flagCode?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
  export type UserOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'name'
    | 'email'
    | 'emailVerified'
    | 'image'
    | 'flagCode'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['user']
  >;
  export type UserInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    accounts?: boolean | User$accountsArgs<ExtArgs>;
    sessions?: boolean | User$sessionsArgs<ExtArgs>;
    Authenticator?: boolean | User$AuthenticatorArgs<ExtArgs>;
    whiteGames?: boolean | User$whiteGamesArgs<ExtArgs>;
    blackGames?: boolean | User$blackGamesArgs<ExtArgs>;
    ratings?: boolean | User$ratingsArgs<ExtArgs>;
    puzzleRating?: boolean | User$puzzleRatingArgs<ExtArgs>;
    analyses?: boolean | User$analysesArgs<ExtArgs>;
    puzzleAttempts?: boolean | User$puzzleAttemptsArgs<ExtArgs>;
    puzzleRushScores?: boolean | User$puzzleRushScoresArgs<ExtArgs>;
    memorySessions?: boolean | User$memorySessionsArgs<ExtArgs>;
    visionSessions?: boolean | User$visionSessionsArgs<ExtArgs>;
    passportFlags?: boolean | User$passportFlagsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};
  export type $UserPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'User';
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[];
      sessions: Prisma.$SessionPayload<ExtArgs>[];
      Authenticator: Prisma.$AuthenticatorPayload<ExtArgs>[];
      whiteGames: Prisma.$GamePayload<ExtArgs>[];
      blackGames: Prisma.$GamePayload<ExtArgs>[];
      ratings: Prisma.$RatingPayload<ExtArgs>[];
      puzzleRating: Prisma.$PuzzleRatingPayload<ExtArgs> | null;
      analyses: Prisma.$GameAnalysisPayload<ExtArgs>[];
      puzzleAttempts: Prisma.$PuzzleAttemptPayload<ExtArgs>[];
      puzzleRushScores: Prisma.$PuzzleRushScorePayload<ExtArgs>[];
      memorySessions: Prisma.$MemorySessionPayload<ExtArgs>[];
      visionSessions: Prisma.$VisionSessionPayload<ExtArgs>[];
      passportFlags: Prisma.$PassportFlagPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        flagCode: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };
  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
    $Result.GetResult<Prisma.$UserPayload, S>;
  type UserCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
  };
  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['User'];
      meta: {
        name: 'User';
      };
    };
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: UserGroupByArgs['orderBy'];
          }
        : {
            orderBy?: UserGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
  }
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$accountsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AccountPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sessionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$SessionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    Authenticator<T extends User$AuthenticatorArgs<ExtArgs> = {}>(
      args?: Subset<T, User$AuthenticatorArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AuthenticatorPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    whiteGames<T extends User$whiteGamesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$whiteGamesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$GamePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    blackGames<T extends User$blackGamesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$blackGamesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$GamePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    ratings<T extends User$ratingsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$ratingsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$RatingPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    puzzleRating<T extends User$puzzleRatingArgs<ExtArgs> = {}>(
      args?: Subset<T, User$puzzleRatingArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    analyses<T extends User$analysesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$analysesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$GameAnalysisPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    puzzleAttempts<T extends User$puzzleAttemptsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$puzzleAttemptsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PuzzleAttemptPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    puzzleRushScores<T extends User$puzzleRushScoresArgs<ExtArgs> = {}>(
      args?: Subset<T, User$puzzleRushScoresArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PuzzleRushScorePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    memorySessions<T extends User$memorySessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$memorySessionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MemorySessionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    visionSessions<T extends User$visionSessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$visionSessionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$VisionSessionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    passportFlags<T extends User$passportFlagsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$passportFlagsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PassportFlagPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly name: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly emailVerified: FieldRef<'User', 'DateTime'>;
    readonly image: FieldRef<'User', 'String'>;
    readonly flagCode: FieldRef<'User', 'String'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly updatedAt: FieldRef<'User', 'DateTime'>;
  }
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where: UserWhereUniqueInput;
  };
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where: UserWhereUniqueInput;
  };
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    cursor?: UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    cursor?: UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };
  export type UserFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    cursor?: UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };
  export type UserCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type UserUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    where: UserWhereUniqueInput;
  };
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    where?: UserWhereInput;
    limit?: number;
  };
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    where?: UserWhereInput;
    limit?: number;
  };
  export type UserUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where: UserWhereUniqueInput;
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };
  export type UserDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where: UserWhereUniqueInput;
  };
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: UserWhereInput;
    limit?: number;
  };
  export type User$accountsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };
  export type User$sessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };
  export type User$AuthenticatorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithRelationInput
      | AuthenticatorOrderByWithRelationInput[];
    cursor?: AuthenticatorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[];
  };
  export type User$whiteGamesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[];
  };
  export type User$blackGamesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[];
  };
  export type User$ratingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where?: RatingWhereInput;
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[];
    cursor?: RatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[];
  };
  export type User$puzzleRatingArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where?: PuzzleRatingWhereInput;
  };
  export type User$analysesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithRelationInput
      | GameAnalysisOrderByWithRelationInput[];
    cursor?: GameAnalysisWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[];
  };
  export type User$puzzleAttemptsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithRelationInput
      | PuzzleAttemptOrderByWithRelationInput[];
    cursor?: PuzzleAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[];
  };
  export type User$puzzleRushScoresArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithRelationInput
      | PuzzleRushScoreOrderByWithRelationInput[];
    cursor?: PuzzleRushScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | PuzzleRushScoreScalarFieldEnum
      | PuzzleRushScoreScalarFieldEnum[];
  };
  export type User$memorySessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithRelationInput
      | MemorySessionOrderByWithRelationInput[];
    cursor?: MemorySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[];
  };
  export type User$visionSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithRelationInput
      | VisionSessionOrderByWithRelationInput[];
    cursor?: VisionSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[];
  };
  export type User$passportFlagsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithRelationInput
      | PassportFlagOrderByWithRelationInput[];
    cursor?: PassportFlagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[];
  };
  export type UserDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
  };
  export type AggregatePassportFlag = {
    _count: PassportFlagCountAggregateOutputType | null;
    _min: PassportFlagMinAggregateOutputType | null;
    _max: PassportFlagMaxAggregateOutputType | null;
  };
  export type PassportFlagMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    flagCode: string | null;
    createdAt: Date | null;
  };
  export type PassportFlagMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    flagCode: string | null;
    createdAt: Date | null;
  };
  export type PassportFlagCountAggregateOutputType = {
    id: number;
    userId: number;
    flagCode: number;
    createdAt: number;
    _all: number;
  };
  export type PassportFlagMinAggregateInputType = {
    id?: true;
    userId?: true;
    flagCode?: true;
    createdAt?: true;
  };
  export type PassportFlagMaxAggregateInputType = {
    id?: true;
    userId?: true;
    flagCode?: true;
    createdAt?: true;
  };
  export type PassportFlagCountAggregateInputType = {
    id?: true;
    userId?: true;
    flagCode?: true;
    createdAt?: true;
    _all?: true;
  };
  export type PassportFlagAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithRelationInput
      | PassportFlagOrderByWithRelationInput[];
    cursor?: PassportFlagWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PassportFlagCountAggregateInputType;
    _min?: PassportFlagMinAggregateInputType;
    _max?: PassportFlagMaxAggregateInputType;
  };
  export type GetPassportFlagAggregateType<
    T extends PassportFlagAggregateArgs
  > = {
    [P in keyof T & keyof AggregatePassportFlag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePassportFlag[P]>
      : GetScalarType<T[P], AggregatePassportFlag[P]>;
  };
  export type PassportFlagGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithAggregationInput
      | PassportFlagOrderByWithAggregationInput[];
    by: PassportFlagScalarFieldEnum[] | PassportFlagScalarFieldEnum;
    having?: PassportFlagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PassportFlagCountAggregateInputType | true;
    _min?: PassportFlagMinAggregateInputType;
    _max?: PassportFlagMaxAggregateInputType;
  };
  export type PassportFlagGroupByOutputType = {
    id: string;
    userId: string;
    flagCode: string;
    createdAt: Date;
    _count: PassportFlagCountAggregateOutputType | null;
    _min: PassportFlagMinAggregateOutputType | null;
    _max: PassportFlagMaxAggregateOutputType | null;
  };
  type GetPassportFlagGroupByPayload<T extends PassportFlagGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PassportFlagGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof PassportFlagGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PassportFlagGroupByOutputType[P]>
            : GetScalarType<T[P], PassportFlagGroupByOutputType[P]>;
        }
      >
    >;
  export type PassportFlagSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passportFlag']
  >;
  export type PassportFlagSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passportFlag']
  >;
  export type PassportFlagSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      flagCode?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passportFlag']
  >;
  export type PassportFlagSelectScalar = {
    id?: boolean;
    userId?: boolean;
    flagCode?: boolean;
    createdAt?: boolean;
  };
  export type PassportFlagOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'flagCode' | 'createdAt',
    ExtArgs['result']['passportFlag']
  >;
  export type PassportFlagInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PassportFlagIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PassportFlagIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $PassportFlagPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'PassportFlag';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        flagCode: string;
        createdAt: Date;
      },
      ExtArgs['result']['passportFlag']
    >;
    composites: {};
  };
  type PassportFlagGetPayload<
    S extends boolean | null | undefined | PassportFlagDefaultArgs
  > = $Result.GetResult<Prisma.$PassportFlagPayload, S>;
  type PassportFlagCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    PassportFlagFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: PassportFlagCountAggregateInputType | true;
  };
  export interface PassportFlagDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PassportFlag'];
      meta: {
        name: 'PassportFlag';
      };
    };
    findUnique<T extends PassportFlagFindUniqueArgs>(
      args: SelectSubset<T, PassportFlagFindUniqueArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends PassportFlagFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PassportFlagFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends PassportFlagFindFirstArgs>(
      args?: SelectSubset<T, PassportFlagFindFirstArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends PassportFlagFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PassportFlagFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends PassportFlagFindManyArgs>(
      args?: SelectSubset<T, PassportFlagFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends PassportFlagCreateArgs>(
      args: SelectSubset<T, PassportFlagCreateArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends PassportFlagCreateManyArgs>(
      args?: SelectSubset<T, PassportFlagCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends PassportFlagCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PassportFlagCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends PassportFlagDeleteArgs>(
      args: SelectSubset<T, PassportFlagDeleteArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends PassportFlagUpdateArgs>(
      args: SelectSubset<T, PassportFlagUpdateArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends PassportFlagDeleteManyArgs>(
      args?: SelectSubset<T, PassportFlagDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends PassportFlagUpdateManyArgs>(
      args: SelectSubset<T, PassportFlagUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends PassportFlagUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PassportFlagUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends PassportFlagUpsertArgs>(
      args: SelectSubset<T, PassportFlagUpsertArgs<ExtArgs>>
    ): Prisma__PassportFlagClient<
      $Result.GetResult<
        Prisma.$PassportFlagPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends PassportFlagCountArgs>(
      args?: Subset<T, PassportFlagCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PassportFlagCountAggregateOutputType>
        : number
    >;
    aggregate<T extends PassportFlagAggregateArgs>(
      args: Subset<T, PassportFlagAggregateArgs>
    ): Prisma.PrismaPromise<GetPassportFlagAggregateType<T>>;
    groupBy<
      T extends PassportFlagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: PassportFlagGroupByArgs['orderBy'];
          }
        : {
            orderBy?: PassportFlagGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, PassportFlagGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPassportFlagGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PassportFlagFieldRefs;
  }
  export interface Prisma__PassportFlagClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface PassportFlagFieldRefs {
    readonly id: FieldRef<'PassportFlag', 'String'>;
    readonly userId: FieldRef<'PassportFlag', 'String'>;
    readonly flagCode: FieldRef<'PassportFlag', 'String'>;
    readonly createdAt: FieldRef<'PassportFlag', 'DateTime'>;
  }
  export type PassportFlagFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where: PassportFlagWhereUniqueInput;
  };
  export type PassportFlagFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where: PassportFlagWhereUniqueInput;
  };
  export type PassportFlagFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithRelationInput
      | PassportFlagOrderByWithRelationInput[];
    cursor?: PassportFlagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[];
  };
  export type PassportFlagFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithRelationInput
      | PassportFlagOrderByWithRelationInput[];
    cursor?: PassportFlagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[];
  };
  export type PassportFlagFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where?: PassportFlagWhereInput;
    orderBy?:
      | PassportFlagOrderByWithRelationInput
      | PassportFlagOrderByWithRelationInput[];
    cursor?: PassportFlagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PassportFlagScalarFieldEnum | PassportFlagScalarFieldEnum[];
  };
  export type PassportFlagCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    data: XOR<PassportFlagCreateInput, PassportFlagUncheckedCreateInput>;
  };
  export type PassportFlagCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: PassportFlagCreateManyInput | PassportFlagCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type PassportFlagCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    data: PassportFlagCreateManyInput | PassportFlagCreateManyInput[];
    skipDuplicates?: boolean;
    include?: PassportFlagIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type PassportFlagUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    data: XOR<PassportFlagUpdateInput, PassportFlagUncheckedUpdateInput>;
    where: PassportFlagWhereUniqueInput;
  };
  export type PassportFlagUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      PassportFlagUpdateManyMutationInput,
      PassportFlagUncheckedUpdateManyInput
    >;
    where?: PassportFlagWhereInput;
    limit?: number;
  };
  export type PassportFlagUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    data: XOR<
      PassportFlagUpdateManyMutationInput,
      PassportFlagUncheckedUpdateManyInput
    >;
    where?: PassportFlagWhereInput;
    limit?: number;
    include?: PassportFlagIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type PassportFlagUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where: PassportFlagWhereUniqueInput;
    create: XOR<PassportFlagCreateInput, PassportFlagUncheckedCreateInput>;
    update: XOR<PassportFlagUpdateInput, PassportFlagUncheckedUpdateInput>;
  };
  export type PassportFlagDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
    where: PassportFlagWhereUniqueInput;
  };
  export type PassportFlagDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PassportFlagWhereInput;
    limit?: number;
  };
  export type PassportFlagDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PassportFlagSelect<ExtArgs> | null;
    omit?: PassportFlagOmit<ExtArgs> | null;
    include?: PassportFlagInclude<ExtArgs> | null;
  };
  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };
  export type AccountAvgAggregateOutputType = {
    expires_at: number | null;
  };
  export type AccountSumAggregateOutputType = {
    expires_at: number | null;
  };
  export type AccountMinAggregateOutputType = {
    userId: string | null;
    type: string | null;
    provider: string | null;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type AccountMaxAggregateOutputType = {
    userId: string | null;
    type: string | null;
    provider: string | null;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type AccountCountAggregateOutputType = {
    userId: number;
    type: number;
    provider: number;
    providerAccountId: number;
    refresh_token: number;
    access_token: number;
    expires_at: number;
    token_type: number;
    scope: number;
    id_token: number;
    session_state: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };
  export type AccountAvgAggregateInputType = {
    expires_at?: true;
  };
  export type AccountSumAggregateInputType = {
    expires_at?: true;
  };
  export type AccountMinAggregateInputType = {
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type AccountMaxAggregateInputType = {
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type AccountCountAggregateInputType = {
    userId?: true;
    type?: true;
    provider?: true;
    providerAccountId?: true;
    refresh_token?: true;
    access_token?: true;
    expires_at?: true;
    token_type?: true;
    scope?: true;
    id_token?: true;
    session_state?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };
  export type AccountAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AccountCountAggregateInputType;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };
  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>;
  };
  export type AccountGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithAggregationInput
      | AccountOrderByWithAggregationInput[];
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };
  export type AccountGroupByOutputType = {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };
  type GetAccountGroupByPayload<T extends AccountGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AccountGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AccountGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>;
        }
      >
    >;
  export type AccountSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      userId?: boolean;
      type?: boolean;
      provider?: boolean;
      providerAccountId?: boolean;
      refresh_token?: boolean;
      access_token?: boolean;
      expires_at?: boolean;
      token_type?: boolean;
      scope?: boolean;
      id_token?: boolean;
      session_state?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;
  export type AccountSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      userId?: boolean;
      type?: boolean;
      provider?: boolean;
      providerAccountId?: boolean;
      refresh_token?: boolean;
      access_token?: boolean;
      expires_at?: boolean;
      token_type?: boolean;
      scope?: boolean;
      id_token?: boolean;
      session_state?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;
  export type AccountSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      userId?: boolean;
      type?: boolean;
      provider?: boolean;
      providerAccountId?: boolean;
      refresh_token?: boolean;
      access_token?: boolean;
      expires_at?: boolean;
      token_type?: boolean;
      scope?: boolean;
      id_token?: boolean;
      session_state?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;
  export type AccountSelectScalar = {
    userId?: boolean;
    type?: boolean;
    provider?: boolean;
    providerAccountId?: boolean;
    refresh_token?: boolean;
    access_token?: boolean;
    expires_at?: boolean;
    token_type?: boolean;
    scope?: boolean;
    id_token?: boolean;
    session_state?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
  export type AccountOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'userId'
    | 'type'
    | 'provider'
    | 'providerAccountId'
    | 'refresh_token'
    | 'access_token'
    | 'expires_at'
    | 'token_type'
    | 'scope'
    | 'id_token'
    | 'session_state'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['account']
  >;
  export type AccountInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $AccountPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Account';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        userId: string;
        type: string;
        provider: string;
        providerAccountId: string;
        refresh_token: string | null;
        access_token: string | null;
        expires_at: number | null;
        token_type: string | null;
        scope: string | null;
        id_token: string | null;
        session_state: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['account']
    >;
    composites: {};
  };
  type AccountGetPayload<
    S extends boolean | null | undefined | AccountDefaultArgs
  > = $Result.GetResult<Prisma.$AccountPayload, S>;
  type AccountCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AccountCountAggregateInputType | true;
  };
  export interface AccountDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Account'];
      meta: {
        name: 'Account';
      };
    };
    findUnique<T extends AccountFindUniqueArgs>(
      args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends AccountFindFirstArgs>(
      args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends AccountFindManyArgs>(
      args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends AccountCreateArgs>(
      args: SelectSubset<T, AccountCreateArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends AccountCreateManyArgs>(
      args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends AccountDeleteArgs>(
      args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends AccountUpdateArgs>(
      args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends AccountUpdateManyArgs>(
      args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends AccountUpsertArgs>(
      args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >;
    aggregate<T extends AccountAggregateArgs>(
      args: Subset<T, AccountAggregateArgs>
    ): Prisma.PrismaPromise<GetAccountAggregateType<T>>;
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: AccountGroupByArgs['orderBy'];
          }
        : {
            orderBy?: AccountGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetAccountGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AccountFieldRefs;
  }
  export interface Prisma__AccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface AccountFieldRefs {
    readonly userId: FieldRef<'Account', 'String'>;
    readonly type: FieldRef<'Account', 'String'>;
    readonly provider: FieldRef<'Account', 'String'>;
    readonly providerAccountId: FieldRef<'Account', 'String'>;
    readonly refresh_token: FieldRef<'Account', 'String'>;
    readonly access_token: FieldRef<'Account', 'String'>;
    readonly expires_at: FieldRef<'Account', 'Int'>;
    readonly token_type: FieldRef<'Account', 'String'>;
    readonly scope: FieldRef<'Account', 'String'>;
    readonly id_token: FieldRef<'Account', 'String'>;
    readonly session_state: FieldRef<'Account', 'String'>;
    readonly createdAt: FieldRef<'Account', 'DateTime'>;
    readonly updatedAt: FieldRef<'Account', 'DateTime'>;
  }
  export type AccountFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where: AccountWhereUniqueInput;
  };
  export type AccountFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where: AccountWhereUniqueInput;
  };
  export type AccountFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };
  export type AccountFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };
  export type AccountFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };
  export type AccountCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
  };
  export type AccountCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type AccountCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type AccountUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
    where: AccountWhereUniqueInput;
  };
  export type AccountUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    where?: AccountWhereInput;
    limit?: number;
  };
  export type AccountUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    where?: AccountWhereInput;
    limit?: number;
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type AccountUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
  };
  export type AccountDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
    where: AccountWhereUniqueInput;
  };
  export type AccountDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AccountWhereInput;
    limit?: number;
  };
  export type AccountDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AccountSelect<ExtArgs> | null;
    omit?: AccountOmit<ExtArgs> | null;
    include?: AccountInclude<ExtArgs> | null;
  };
  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };
  export type SessionMinAggregateOutputType = {
    sessionToken: string | null;
    userId: string | null;
    expires: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type SessionMaxAggregateOutputType = {
    sessionToken: string | null;
    userId: string | null;
    expires: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type SessionCountAggregateOutputType = {
    sessionToken: number;
    userId: number;
    expires: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };
  export type SessionMinAggregateInputType = {
    sessionToken?: true;
    userId?: true;
    expires?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type SessionMaxAggregateInputType = {
    sessionToken?: true;
    userId?: true;
    expires?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type SessionCountAggregateInputType = {
    sessionToken?: true;
    userId?: true;
    expires?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };
  export type SessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SessionCountAggregateInputType;
    _min?: SessionMinAggregateInputType;
    _max?: SessionMaxAggregateInputType;
  };
  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
    [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>;
  };
  export type SessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithAggregationInput
      | SessionOrderByWithAggregationInput[];
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
    having?: SessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SessionCountAggregateInputType | true;
    _min?: SessionMinAggregateInputType;
    _max?: SessionMaxAggregateInputType;
  };
  export type SessionGroupByOutputType = {
    sessionToken: string;
    userId: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };
  type GetSessionGroupByPayload<T extends SessionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<SessionGroupByOutputType, T['by']> & {
          [P in keyof T & keyof SessionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>;
        }
      >
    >;
  export type SessionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      sessionToken?: boolean;
      userId?: boolean;
      expires?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;
  export type SessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      sessionToken?: boolean;
      userId?: boolean;
      expires?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;
  export type SessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      sessionToken?: boolean;
      userId?: boolean;
      expires?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;
  export type SessionSelectScalar = {
    sessionToken?: boolean;
    userId?: boolean;
    expires?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
  export type SessionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    'sessionToken' | 'userId' | 'expires' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['session']
  >;
  export type SessionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $SessionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Session';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        sessionToken: string;
        userId: string;
        expires: Date;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['session']
    >;
    composites: {};
  };
  type SessionGetPayload<
    S extends boolean | null | undefined | SessionDefaultArgs
  > = $Result.GetResult<Prisma.$SessionPayload, S>;
  type SessionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SessionCountAggregateInputType | true;
  };
  export interface SessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Session'];
      meta: {
        name: 'Session';
      };
    };
    findUnique<T extends SessionFindUniqueArgs>(
      args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends SessionFindFirstArgs>(
      args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >;
    aggregate<T extends SessionAggregateArgs>(
      args: Subset<T, SessionAggregateArgs>
    ): Prisma.PrismaPromise<GetSessionAggregateType<T>>;
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: SessionGroupByArgs['orderBy'];
          }
        : {
            orderBy?: SessionGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetSessionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SessionFieldRefs;
  }
  export interface Prisma__SessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface SessionFieldRefs {
    readonly sessionToken: FieldRef<'Session', 'String'>;
    readonly userId: FieldRef<'Session', 'String'>;
    readonly expires: FieldRef<'Session', 'DateTime'>;
    readonly createdAt: FieldRef<'Session', 'DateTime'>;
    readonly updatedAt: FieldRef<'Session', 'DateTime'>;
  }
  export type SessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where: SessionWhereUniqueInput;
  };
  export type SessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where: SessionWhereUniqueInput;
  };
  export type SessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };
  export type SessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };
  export type SessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };
  export type SessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
  };
  export type SessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type SessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type SessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
    where: SessionWhereUniqueInput;
  };
  export type SessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    where?: SessionWhereInput;
    limit?: number;
  };
  export type SessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    where?: SessionWhereInput;
    limit?: number;
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type SessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where: SessionWhereUniqueInput;
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
  };
  export type SessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
    where: SessionWhereUniqueInput;
  };
  export type SessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: SessionWhereInput;
    limit?: number;
  };
  export type SessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: SessionSelect<ExtArgs> | null;
    omit?: SessionOmit<ExtArgs> | null;
    include?: SessionInclude<ExtArgs> | null;
  };
  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null;
    _min: VerificationTokenMinAggregateOutputType | null;
    _max: VerificationTokenMaxAggregateOutputType | null;
  };
  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null;
    token: string | null;
    expires: Date | null;
  };
  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null;
    token: string | null;
    expires: Date | null;
  };
  export type VerificationTokenCountAggregateOutputType = {
    identifier: number;
    token: number;
    expires: number;
    _all: number;
  };
  export type VerificationTokenMinAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
  };
  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
  };
  export type VerificationTokenCountAggregateInputType = {
    identifier?: true;
    token?: true;
    expires?: true;
    _all?: true;
  };
  export type VerificationTokenAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VerificationTokenWhereInput;
    orderBy?:
      | VerificationTokenOrderByWithRelationInput
      | VerificationTokenOrderByWithRelationInput[];
    cursor?: VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VerificationTokenCountAggregateInputType;
    _min?: VerificationTokenMinAggregateInputType;
    _max?: VerificationTokenMaxAggregateInputType;
  };
  export type GetVerificationTokenAggregateType<
    T extends VerificationTokenAggregateArgs
  > = {
    [P in keyof T & keyof AggregateVerificationToken]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>;
  };
  export type VerificationTokenGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VerificationTokenWhereInput;
    orderBy?:
      | VerificationTokenOrderByWithAggregationInput
      | VerificationTokenOrderByWithAggregationInput[];
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum;
    having?: VerificationTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VerificationTokenCountAggregateInputType | true;
    _min?: VerificationTokenMinAggregateInputType;
    _max?: VerificationTokenMaxAggregateInputType;
  };
  export type VerificationTokenGroupByOutputType = {
    identifier: string;
    token: string;
    expires: Date;
    _count: VerificationTokenCountAggregateOutputType | null;
    _min: VerificationTokenMinAggregateOutputType | null;
    _max: VerificationTokenMaxAggregateOutputType | null;
  };
  type GetVerificationTokenGroupByPayload<
    T extends VerificationTokenGroupByArgs
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof VerificationTokenGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
          : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>;
      }
    >
  >;
  export type VerificationTokenSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      identifier?: boolean;
      token?: boolean;
      expires?: boolean;
    },
    ExtArgs['result']['verificationToken']
  >;
  export type VerificationTokenSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      identifier?: boolean;
      token?: boolean;
      expires?: boolean;
    },
    ExtArgs['result']['verificationToken']
  >;
  export type VerificationTokenSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      identifier?: boolean;
      token?: boolean;
      expires?: boolean;
    },
    ExtArgs['result']['verificationToken']
  >;
  export type VerificationTokenSelectScalar = {
    identifier?: boolean;
    token?: boolean;
    expires?: boolean;
  };
  export type VerificationTokenOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    'identifier' | 'token' | 'expires',
    ExtArgs['result']['verificationToken']
  >;
  export type $VerificationTokenPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'VerificationToken';
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        identifier: string;
        token: string;
        expires: Date;
      },
      ExtArgs['result']['verificationToken']
    >;
    composites: {};
  };
  type VerificationTokenGetPayload<
    S extends boolean | null | undefined | VerificationTokenDefaultArgs
  > = $Result.GetResult<Prisma.$VerificationTokenPayload, S>;
  type VerificationTokenCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    VerificationTokenFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: VerificationTokenCountAggregateInputType | true;
  };
  export interface VerificationTokenDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'];
      meta: {
        name: 'VerificationToken';
      };
    };
    findUnique<T extends VerificationTokenFindUniqueArgs>(
      args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends VerificationTokenFindFirstArgs>(
      args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends VerificationTokenFindManyArgs>(
      args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends VerificationTokenCreateArgs>(
      args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends VerificationTokenCreateManyArgs>(
      args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends VerificationTokenDeleteArgs>(
      args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends VerificationTokenUpdateArgs>(
      args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends VerificationTokenDeleteManyArgs>(
      args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends VerificationTokenUpdateManyArgs>(
      args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(
      args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends VerificationTokenUpsertArgs>(
      args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>
    ): Prisma__VerificationTokenClient<
      $Result.GetResult<
        Prisma.$VerificationTokenPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              VerificationTokenCountAggregateOutputType
            >
        : number
    >;
    aggregate<T extends VerificationTokenAggregateArgs>(
      args: Subset<T, VerificationTokenAggregateArgs>
    ): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>;
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: VerificationTokenGroupByArgs['orderBy'];
          }
        : {
            orderBy?: VerificationTokenGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetVerificationTokenGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VerificationTokenFieldRefs;
  }
  export interface Prisma__VerificationTokenClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<'VerificationToken', 'String'>;
    readonly token: FieldRef<'VerificationToken', 'String'>;
    readonly expires: FieldRef<'VerificationToken', 'DateTime'>;
  }
  export type VerificationTokenFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where: VerificationTokenWhereUniqueInput;
  };
  export type VerificationTokenFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where: VerificationTokenWhereUniqueInput;
  };
  export type VerificationTokenFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where?: VerificationTokenWhereInput;
    orderBy?:
      | VerificationTokenOrderByWithRelationInput
      | VerificationTokenOrderByWithRelationInput[];
    cursor?: VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | VerificationTokenScalarFieldEnum
      | VerificationTokenScalarFieldEnum[];
  };
  export type VerificationTokenFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where?: VerificationTokenWhereInput;
    orderBy?:
      | VerificationTokenOrderByWithRelationInput
      | VerificationTokenOrderByWithRelationInput[];
    cursor?: VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | VerificationTokenScalarFieldEnum
      | VerificationTokenScalarFieldEnum[];
  };
  export type VerificationTokenFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where?: VerificationTokenWhereInput;
    orderBy?:
      | VerificationTokenOrderByWithRelationInput
      | VerificationTokenOrderByWithRelationInput[];
    cursor?: VerificationTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | VerificationTokenScalarFieldEnum
      | VerificationTokenScalarFieldEnum[];
  };
  export type VerificationTokenCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    data: XOR<
      VerificationTokenCreateInput,
      VerificationTokenUncheckedCreateInput
    >;
  };
  export type VerificationTokenCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type VerificationTokenCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type VerificationTokenUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    data: XOR<
      VerificationTokenUpdateInput,
      VerificationTokenUncheckedUpdateInput
    >;
    where: VerificationTokenWhereUniqueInput;
  };
  export type VerificationTokenUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      VerificationTokenUpdateManyMutationInput,
      VerificationTokenUncheckedUpdateManyInput
    >;
    where?: VerificationTokenWhereInput;
    limit?: number;
  };
  export type VerificationTokenUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    data: XOR<
      VerificationTokenUpdateManyMutationInput,
      VerificationTokenUncheckedUpdateManyInput
    >;
    where?: VerificationTokenWhereInput;
    limit?: number;
  };
  export type VerificationTokenUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where: VerificationTokenWhereUniqueInput;
    create: XOR<
      VerificationTokenCreateInput,
      VerificationTokenUncheckedCreateInput
    >;
    update: XOR<
      VerificationTokenUpdateInput,
      VerificationTokenUncheckedUpdateInput
    >;
  };
  export type VerificationTokenDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
    where: VerificationTokenWhereUniqueInput;
  };
  export type VerificationTokenDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VerificationTokenWhereInput;
    limit?: number;
  };
  export type VerificationTokenDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VerificationTokenSelect<ExtArgs> | null;
    omit?: VerificationTokenOmit<ExtArgs> | null;
  };
  export type AggregateAuthenticator = {
    _count: AuthenticatorCountAggregateOutputType | null;
    _avg: AuthenticatorAvgAggregateOutputType | null;
    _sum: AuthenticatorSumAggregateOutputType | null;
    _min: AuthenticatorMinAggregateOutputType | null;
    _max: AuthenticatorMaxAggregateOutputType | null;
  };
  export type AuthenticatorAvgAggregateOutputType = {
    counter: number | null;
  };
  export type AuthenticatorSumAggregateOutputType = {
    counter: number | null;
  };
  export type AuthenticatorMinAggregateOutputType = {
    credentialID: string | null;
    userId: string | null;
    providerAccountId: string | null;
    credentialPublicKey: string | null;
    counter: number | null;
    credentialDeviceType: string | null;
    credentialBackedUp: boolean | null;
    transports: string | null;
  };
  export type AuthenticatorMaxAggregateOutputType = {
    credentialID: string | null;
    userId: string | null;
    providerAccountId: string | null;
    credentialPublicKey: string | null;
    counter: number | null;
    credentialDeviceType: string | null;
    credentialBackedUp: boolean | null;
    transports: string | null;
  };
  export type AuthenticatorCountAggregateOutputType = {
    credentialID: number;
    userId: number;
    providerAccountId: number;
    credentialPublicKey: number;
    counter: number;
    credentialDeviceType: number;
    credentialBackedUp: number;
    transports: number;
    _all: number;
  };
  export type AuthenticatorAvgAggregateInputType = {
    counter?: true;
  };
  export type AuthenticatorSumAggregateInputType = {
    counter?: true;
  };
  export type AuthenticatorMinAggregateInputType = {
    credentialID?: true;
    userId?: true;
    providerAccountId?: true;
    credentialPublicKey?: true;
    counter?: true;
    credentialDeviceType?: true;
    credentialBackedUp?: true;
    transports?: true;
  };
  export type AuthenticatorMaxAggregateInputType = {
    credentialID?: true;
    userId?: true;
    providerAccountId?: true;
    credentialPublicKey?: true;
    counter?: true;
    credentialDeviceType?: true;
    credentialBackedUp?: true;
    transports?: true;
  };
  export type AuthenticatorCountAggregateInputType = {
    credentialID?: true;
    userId?: true;
    providerAccountId?: true;
    credentialPublicKey?: true;
    counter?: true;
    credentialDeviceType?: true;
    credentialBackedUp?: true;
    transports?: true;
    _all?: true;
  };
  export type AuthenticatorAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithRelationInput
      | AuthenticatorOrderByWithRelationInput[];
    cursor?: AuthenticatorWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AuthenticatorCountAggregateInputType;
    _avg?: AuthenticatorAvgAggregateInputType;
    _sum?: AuthenticatorSumAggregateInputType;
    _min?: AuthenticatorMinAggregateInputType;
    _max?: AuthenticatorMaxAggregateInputType;
  };
  export type GetAuthenticatorAggregateType<
    T extends AuthenticatorAggregateArgs
  > = {
    [P in keyof T & keyof AggregateAuthenticator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthenticator[P]>
      : GetScalarType<T[P], AggregateAuthenticator[P]>;
  };
  export type AuthenticatorGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithAggregationInput
      | AuthenticatorOrderByWithAggregationInput[];
    by: AuthenticatorScalarFieldEnum[] | AuthenticatorScalarFieldEnum;
    having?: AuthenticatorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuthenticatorCountAggregateInputType | true;
    _avg?: AuthenticatorAvgAggregateInputType;
    _sum?: AuthenticatorSumAggregateInputType;
    _min?: AuthenticatorMinAggregateInputType;
    _max?: AuthenticatorMaxAggregateInputType;
  };
  export type AuthenticatorGroupByOutputType = {
    credentialID: string;
    userId: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports: string | null;
    _count: AuthenticatorCountAggregateOutputType | null;
    _avg: AuthenticatorAvgAggregateOutputType | null;
    _sum: AuthenticatorSumAggregateOutputType | null;
    _min: AuthenticatorMinAggregateOutputType | null;
    _max: AuthenticatorMaxAggregateOutputType | null;
  };
  type GetAuthenticatorGroupByPayload<T extends AuthenticatorGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AuthenticatorGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof AuthenticatorGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>
            : GetScalarType<T[P], AuthenticatorGroupByOutputType[P]>;
        }
      >
    >;
  export type AuthenticatorSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      credentialID?: boolean;
      userId?: boolean;
      providerAccountId?: boolean;
      credentialPublicKey?: boolean;
      counter?: boolean;
      credentialDeviceType?: boolean;
      credentialBackedUp?: boolean;
      transports?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['authenticator']
  >;
  export type AuthenticatorSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      credentialID?: boolean;
      userId?: boolean;
      providerAccountId?: boolean;
      credentialPublicKey?: boolean;
      counter?: boolean;
      credentialDeviceType?: boolean;
      credentialBackedUp?: boolean;
      transports?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['authenticator']
  >;
  export type AuthenticatorSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      credentialID?: boolean;
      userId?: boolean;
      providerAccountId?: boolean;
      credentialPublicKey?: boolean;
      counter?: boolean;
      credentialDeviceType?: boolean;
      credentialBackedUp?: boolean;
      transports?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['authenticator']
  >;
  export type AuthenticatorSelectScalar = {
    credentialID?: boolean;
    userId?: boolean;
    providerAccountId?: boolean;
    credentialPublicKey?: boolean;
    counter?: boolean;
    credentialDeviceType?: boolean;
    credentialBackedUp?: boolean;
    transports?: boolean;
  };
  export type AuthenticatorOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'credentialID'
    | 'userId'
    | 'providerAccountId'
    | 'credentialPublicKey'
    | 'counter'
    | 'credentialDeviceType'
    | 'credentialBackedUp'
    | 'transports',
    ExtArgs['result']['authenticator']
  >;
  export type AuthenticatorInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AuthenticatorIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AuthenticatorIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $AuthenticatorPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Authenticator';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        credentialID: string;
        userId: string;
        providerAccountId: string;
        credentialPublicKey: string;
        counter: number;
        credentialDeviceType: string;
        credentialBackedUp: boolean;
        transports: string | null;
      },
      ExtArgs['result']['authenticator']
    >;
    composites: {};
  };
  type AuthenticatorGetPayload<
    S extends boolean | null | undefined | AuthenticatorDefaultArgs
  > = $Result.GetResult<Prisma.$AuthenticatorPayload, S>;
  type AuthenticatorCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    AuthenticatorFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: AuthenticatorCountAggregateInputType | true;
  };
  export interface AuthenticatorDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Authenticator'];
      meta: {
        name: 'Authenticator';
      };
    };
    findUnique<T extends AuthenticatorFindUniqueArgs>(
      args: SelectSubset<T, AuthenticatorFindUniqueArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends AuthenticatorFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AuthenticatorFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends AuthenticatorFindFirstArgs>(
      args?: SelectSubset<T, AuthenticatorFindFirstArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends AuthenticatorFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AuthenticatorFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends AuthenticatorFindManyArgs>(
      args?: SelectSubset<T, AuthenticatorFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends AuthenticatorCreateArgs>(
      args: SelectSubset<T, AuthenticatorCreateArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends AuthenticatorCreateManyArgs>(
      args?: SelectSubset<T, AuthenticatorCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends AuthenticatorCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AuthenticatorCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends AuthenticatorDeleteArgs>(
      args: SelectSubset<T, AuthenticatorDeleteArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends AuthenticatorUpdateArgs>(
      args: SelectSubset<T, AuthenticatorUpdateArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends AuthenticatorDeleteManyArgs>(
      args?: SelectSubset<T, AuthenticatorDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends AuthenticatorUpdateManyArgs>(
      args: SelectSubset<T, AuthenticatorUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends AuthenticatorUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AuthenticatorUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends AuthenticatorUpsertArgs>(
      args: SelectSubset<T, AuthenticatorUpsertArgs<ExtArgs>>
    ): Prisma__AuthenticatorClient<
      $Result.GetResult<
        Prisma.$AuthenticatorPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends AuthenticatorCountArgs>(
      args?: Subset<T, AuthenticatorCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthenticatorCountAggregateOutputType>
        : number
    >;
    aggregate<T extends AuthenticatorAggregateArgs>(
      args: Subset<T, AuthenticatorAggregateArgs>
    ): Prisma.PrismaPromise<GetAuthenticatorAggregateType<T>>;
    groupBy<
      T extends AuthenticatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: AuthenticatorGroupByArgs['orderBy'];
          }
        : {
            orderBy?: AuthenticatorGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, AuthenticatorGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetAuthenticatorGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AuthenticatorFieldRefs;
  }
  export interface Prisma__AuthenticatorClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface AuthenticatorFieldRefs {
    readonly credentialID: FieldRef<'Authenticator', 'String'>;
    readonly userId: FieldRef<'Authenticator', 'String'>;
    readonly providerAccountId: FieldRef<'Authenticator', 'String'>;
    readonly credentialPublicKey: FieldRef<'Authenticator', 'String'>;
    readonly counter: FieldRef<'Authenticator', 'Int'>;
    readonly credentialDeviceType: FieldRef<'Authenticator', 'String'>;
    readonly credentialBackedUp: FieldRef<'Authenticator', 'Boolean'>;
    readonly transports: FieldRef<'Authenticator', 'String'>;
  }
  export type AuthenticatorFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where: AuthenticatorWhereUniqueInput;
  };
  export type AuthenticatorFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where: AuthenticatorWhereUniqueInput;
  };
  export type AuthenticatorFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithRelationInput
      | AuthenticatorOrderByWithRelationInput[];
    cursor?: AuthenticatorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[];
  };
  export type AuthenticatorFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithRelationInput
      | AuthenticatorOrderByWithRelationInput[];
    cursor?: AuthenticatorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[];
  };
  export type AuthenticatorFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where?: AuthenticatorWhereInput;
    orderBy?:
      | AuthenticatorOrderByWithRelationInput
      | AuthenticatorOrderByWithRelationInput[];
    cursor?: AuthenticatorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuthenticatorScalarFieldEnum | AuthenticatorScalarFieldEnum[];
  };
  export type AuthenticatorCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    data: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>;
  };
  export type AuthenticatorCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: AuthenticatorCreateManyInput | AuthenticatorCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type AuthenticatorCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    data: AuthenticatorCreateManyInput | AuthenticatorCreateManyInput[];
    skipDuplicates?: boolean;
    include?: AuthenticatorIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type AuthenticatorUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    data: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>;
    where: AuthenticatorWhereUniqueInput;
  };
  export type AuthenticatorUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      AuthenticatorUpdateManyMutationInput,
      AuthenticatorUncheckedUpdateManyInput
    >;
    where?: AuthenticatorWhereInput;
    limit?: number;
  };
  export type AuthenticatorUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    data: XOR<
      AuthenticatorUpdateManyMutationInput,
      AuthenticatorUncheckedUpdateManyInput
    >;
    where?: AuthenticatorWhereInput;
    limit?: number;
    include?: AuthenticatorIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type AuthenticatorUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where: AuthenticatorWhereUniqueInput;
    create: XOR<AuthenticatorCreateInput, AuthenticatorUncheckedCreateInput>;
    update: XOR<AuthenticatorUpdateInput, AuthenticatorUncheckedUpdateInput>;
  };
  export type AuthenticatorDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
    where: AuthenticatorWhereUniqueInput;
  };
  export type AuthenticatorDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: AuthenticatorWhereInput;
    limit?: number;
  };
  export type AuthenticatorDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: AuthenticatorSelect<ExtArgs> | null;
    omit?: AuthenticatorOmit<ExtArgs> | null;
    include?: AuthenticatorInclude<ExtArgs> | null;
  };
  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null;
    _avg: GameAvgAggregateOutputType | null;
    _sum: GameSumAggregateOutputType | null;
    _min: GameMinAggregateOutputType | null;
    _max: GameMaxAggregateOutputType | null;
  };
  export type GameAvgAggregateOutputType = {
    whitePregameRating: number | null;
    blackPregameRating: number | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
    moveCount: number | null;
  };
  export type GameSumAggregateOutputType = {
    whitePregameRating: number | null;
    blackPregameRating: number | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
    moveCount: number | null;
  };
  export type GameMinAggregateOutputType = {
    id: string | null;
    roomId: string | null;
    whiteUserId: string | null;
    blackUserId: string | null;
    variant: string | null;
    gameType: string | null;
    result: string | null;
    resultReason: string | null;
    startingFen: string | null;
    whitePregameRating: number | null;
    blackPregameRating: number | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
    moveCount: number | null;
    rated: boolean | null;
    playedAt: Date | null;
    createdAt: Date | null;
  };
  export type GameMaxAggregateOutputType = {
    id: string | null;
    roomId: string | null;
    whiteUserId: string | null;
    blackUserId: string | null;
    variant: string | null;
    gameType: string | null;
    result: string | null;
    resultReason: string | null;
    startingFen: string | null;
    whitePregameRating: number | null;
    blackPregameRating: number | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
    moveCount: number | null;
    rated: boolean | null;
    playedAt: Date | null;
    createdAt: Date | null;
  };
  export type GameCountAggregateOutputType = {
    id: number;
    roomId: number;
    whiteUserId: number;
    blackUserId: number;
    variant: number;
    gameType: number;
    result: number;
    resultReason: number;
    moves: number;
    startingFen: number;
    timeControl: number;
    whitePregameRating: number;
    blackPregameRating: number;
    whiteRatingDelta: number;
    blackRatingDelta: number;
    moveCount: number;
    rated: number;
    playedAt: number;
    createdAt: number;
    _all: number;
  };
  export type GameAvgAggregateInputType = {
    whitePregameRating?: true;
    blackPregameRating?: true;
    whiteRatingDelta?: true;
    blackRatingDelta?: true;
    moveCount?: true;
  };
  export type GameSumAggregateInputType = {
    whitePregameRating?: true;
    blackPregameRating?: true;
    whiteRatingDelta?: true;
    blackRatingDelta?: true;
    moveCount?: true;
  };
  export type GameMinAggregateInputType = {
    id?: true;
    roomId?: true;
    whiteUserId?: true;
    blackUserId?: true;
    variant?: true;
    gameType?: true;
    result?: true;
    resultReason?: true;
    startingFen?: true;
    whitePregameRating?: true;
    blackPregameRating?: true;
    whiteRatingDelta?: true;
    blackRatingDelta?: true;
    moveCount?: true;
    rated?: true;
    playedAt?: true;
    createdAt?: true;
  };
  export type GameMaxAggregateInputType = {
    id?: true;
    roomId?: true;
    whiteUserId?: true;
    blackUserId?: true;
    variant?: true;
    gameType?: true;
    result?: true;
    resultReason?: true;
    startingFen?: true;
    whitePregameRating?: true;
    blackPregameRating?: true;
    whiteRatingDelta?: true;
    blackRatingDelta?: true;
    moveCount?: true;
    rated?: true;
    playedAt?: true;
    createdAt?: true;
  };
  export type GameCountAggregateInputType = {
    id?: true;
    roomId?: true;
    whiteUserId?: true;
    blackUserId?: true;
    variant?: true;
    gameType?: true;
    result?: true;
    resultReason?: true;
    moves?: true;
    startingFen?: true;
    timeControl?: true;
    whitePregameRating?: true;
    blackPregameRating?: true;
    whiteRatingDelta?: true;
    blackRatingDelta?: true;
    moveCount?: true;
    rated?: true;
    playedAt?: true;
    createdAt?: true;
    _all?: true;
  };
  export type GameAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | GameCountAggregateInputType;
    _avg?: GameAvgAggregateInputType;
    _sum?: GameSumAggregateInputType;
    _min?: GameMinAggregateInputType;
    _max?: GameMaxAggregateInputType;
  };
  export type GetGameAggregateType<T extends GameAggregateArgs> = {
    [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>;
  };
  export type GameGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameWhereInput;
    orderBy?:
      | GameOrderByWithAggregationInput
      | GameOrderByWithAggregationInput[];
    by: GameScalarFieldEnum[] | GameScalarFieldEnum;
    having?: GameScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GameCountAggregateInputType | true;
    _avg?: GameAvgAggregateInputType;
    _sum?: GameSumAggregateInputType;
    _min?: GameMinAggregateInputType;
    _max?: GameMaxAggregateInputType;
  };
  export type GameGroupByOutputType = {
    id: string;
    roomId: string | null;
    whiteUserId: string | null;
    blackUserId: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves: string[];
    startingFen: string;
    timeControl: JsonValue;
    whitePregameRating: number | null;
    blackPregameRating: number | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
    moveCount: number;
    rated: boolean;
    playedAt: Date | null;
    createdAt: Date;
    _count: GameCountAggregateOutputType | null;
    _avg: GameAvgAggregateOutputType | null;
    _sum: GameSumAggregateOutputType | null;
    _min: GameMinAggregateOutputType | null;
    _max: GameMaxAggregateOutputType | null;
  };
  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> & {
        [P in keyof T & keyof GameGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], GameGroupByOutputType[P]>
          : GetScalarType<T[P], GameGroupByOutputType[P]>;
      }
    >
  >;
  export type GameSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      roomId?: boolean;
      whiteUserId?: boolean;
      blackUserId?: boolean;
      variant?: boolean;
      gameType?: boolean;
      result?: boolean;
      resultReason?: boolean;
      moves?: boolean;
      startingFen?: boolean;
      timeControl?: boolean;
      whitePregameRating?: boolean;
      blackPregameRating?: boolean;
      whiteRatingDelta?: boolean;
      blackRatingDelta?: boolean;
      moveCount?: boolean;
      rated?: boolean;
      playedAt?: boolean;
      createdAt?: boolean;
      white?: boolean | Game$whiteArgs<ExtArgs>;
      black?: boolean | Game$blackArgs<ExtArgs>;
      analysis?: boolean | Game$analysisArgs<ExtArgs>;
    },
    ExtArgs['result']['game']
  >;
  export type GameSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      roomId?: boolean;
      whiteUserId?: boolean;
      blackUserId?: boolean;
      variant?: boolean;
      gameType?: boolean;
      result?: boolean;
      resultReason?: boolean;
      moves?: boolean;
      startingFen?: boolean;
      timeControl?: boolean;
      whitePregameRating?: boolean;
      blackPregameRating?: boolean;
      whiteRatingDelta?: boolean;
      blackRatingDelta?: boolean;
      moveCount?: boolean;
      rated?: boolean;
      playedAt?: boolean;
      createdAt?: boolean;
      white?: boolean | Game$whiteArgs<ExtArgs>;
      black?: boolean | Game$blackArgs<ExtArgs>;
    },
    ExtArgs['result']['game']
  >;
  export type GameSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      roomId?: boolean;
      whiteUserId?: boolean;
      blackUserId?: boolean;
      variant?: boolean;
      gameType?: boolean;
      result?: boolean;
      resultReason?: boolean;
      moves?: boolean;
      startingFen?: boolean;
      timeControl?: boolean;
      whitePregameRating?: boolean;
      blackPregameRating?: boolean;
      whiteRatingDelta?: boolean;
      blackRatingDelta?: boolean;
      moveCount?: boolean;
      rated?: boolean;
      playedAt?: boolean;
      createdAt?: boolean;
      white?: boolean | Game$whiteArgs<ExtArgs>;
      black?: boolean | Game$blackArgs<ExtArgs>;
    },
    ExtArgs['result']['game']
  >;
  export type GameSelectScalar = {
    id?: boolean;
    roomId?: boolean;
    whiteUserId?: boolean;
    blackUserId?: boolean;
    variant?: boolean;
    gameType?: boolean;
    result?: boolean;
    resultReason?: boolean;
    moves?: boolean;
    startingFen?: boolean;
    timeControl?: boolean;
    whitePregameRating?: boolean;
    blackPregameRating?: boolean;
    whiteRatingDelta?: boolean;
    blackRatingDelta?: boolean;
    moveCount?: boolean;
    rated?: boolean;
    playedAt?: boolean;
    createdAt?: boolean;
  };
  export type GameOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'roomId'
    | 'whiteUserId'
    | 'blackUserId'
    | 'variant'
    | 'gameType'
    | 'result'
    | 'resultReason'
    | 'moves'
    | 'startingFen'
    | 'timeControl'
    | 'whitePregameRating'
    | 'blackPregameRating'
    | 'whiteRatingDelta'
    | 'blackRatingDelta'
    | 'moveCount'
    | 'rated'
    | 'playedAt'
    | 'createdAt',
    ExtArgs['result']['game']
  >;
  export type GameInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    white?: boolean | Game$whiteArgs<ExtArgs>;
    black?: boolean | Game$blackArgs<ExtArgs>;
    analysis?: boolean | Game$analysisArgs<ExtArgs>;
  };
  export type GameIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    white?: boolean | Game$whiteArgs<ExtArgs>;
    black?: boolean | Game$blackArgs<ExtArgs>;
  };
  export type GameIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    white?: boolean | Game$whiteArgs<ExtArgs>;
    black?: boolean | Game$blackArgs<ExtArgs>;
  };
  export type $GamePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Game';
    objects: {
      white: Prisma.$UserPayload<ExtArgs> | null;
      black: Prisma.$UserPayload<ExtArgs> | null;
      analysis: Prisma.$GameAnalysisPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        roomId: string | null;
        whiteUserId: string | null;
        blackUserId: string | null;
        variant: string;
        gameType: string;
        result: string;
        resultReason: string;
        moves: string[];
        startingFen: string;
        timeControl: Prisma.JsonValue;
        whitePregameRating: number | null;
        blackPregameRating: number | null;
        whiteRatingDelta: number | null;
        blackRatingDelta: number | null;
        moveCount: number;
        rated: boolean;
        playedAt: Date | null;
        createdAt: Date;
      },
      ExtArgs['result']['game']
    >;
    composites: {};
  };
  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> =
    $Result.GetResult<Prisma.$GamePayload, S>;
  type GameCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: GameCountAggregateInputType | true;
  };
  export interface GameDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Game'];
      meta: {
        name: 'Game';
      };
    };
    findUnique<T extends GameFindUniqueArgs>(
      args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(
      args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends GameFindFirstArgs>(
      args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(
      args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends GameFindManyArgs>(
      args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends GameCreateArgs>(
      args: SelectSubset<T, GameCreateArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends GameCreateManyArgs>(
      args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(
      args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends GameDeleteArgs>(
      args: SelectSubset<T, GameDeleteArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends GameUpdateArgs>(
      args: SelectSubset<T, GameUpdateArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends GameDeleteManyArgs>(
      args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends GameUpdateManyArgs>(
      args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(
      args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends GameUpsertArgs>(
      args: SelectSubset<T, GameUpsertArgs<ExtArgs>>
    ): Prisma__GameClient<
      $Result.GetResult<
        Prisma.$GamePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >;
    aggregate<T extends GameAggregateArgs>(
      args: Subset<T, GameAggregateArgs>
    ): Prisma.PrismaPromise<GetGameAggregateType<T>>;
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: GameGroupByArgs['orderBy'];
          }
        : {
            orderBy?: GameGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetGameGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: GameFieldRefs;
  }
  export interface Prisma__GameClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    white<T extends Game$whiteArgs<ExtArgs> = {}>(
      args?: Subset<T, Game$whiteArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    black<T extends Game$blackArgs<ExtArgs> = {}>(
      args?: Subset<T, Game$blackArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    analysis<T extends Game$analysisArgs<ExtArgs> = {}>(
      args?: Subset<T, Game$analysisArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface GameFieldRefs {
    readonly id: FieldRef<'Game', 'String'>;
    readonly roomId: FieldRef<'Game', 'String'>;
    readonly whiteUserId: FieldRef<'Game', 'String'>;
    readonly blackUserId: FieldRef<'Game', 'String'>;
    readonly variant: FieldRef<'Game', 'String'>;
    readonly gameType: FieldRef<'Game', 'String'>;
    readonly result: FieldRef<'Game', 'String'>;
    readonly resultReason: FieldRef<'Game', 'String'>;
    readonly moves: FieldRef<'Game', 'String[]'>;
    readonly startingFen: FieldRef<'Game', 'String'>;
    readonly timeControl: FieldRef<'Game', 'Json'>;
    readonly whitePregameRating: FieldRef<'Game', 'Int'>;
    readonly blackPregameRating: FieldRef<'Game', 'Int'>;
    readonly whiteRatingDelta: FieldRef<'Game', 'Int'>;
    readonly blackRatingDelta: FieldRef<'Game', 'Int'>;
    readonly moveCount: FieldRef<'Game', 'Int'>;
    readonly rated: FieldRef<'Game', 'Boolean'>;
    readonly playedAt: FieldRef<'Game', 'DateTime'>;
    readonly createdAt: FieldRef<'Game', 'DateTime'>;
  }
  export type GameFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where: GameWhereUniqueInput;
  };
  export type GameFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where: GameWhereUniqueInput;
  };
  export type GameFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[];
  };
  export type GameFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[];
  };
  export type GameFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where?: GameWhereInput;
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[];
    cursor?: GameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[];
  };
  export type GameCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    data: XOR<GameCreateInput, GameUncheckedCreateInput>;
  };
  export type GameCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: GameCreateManyInput | GameCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type GameCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    data: GameCreateManyInput | GameCreateManyInput[];
    skipDuplicates?: boolean;
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type GameUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>;
    where: GameWhereUniqueInput;
  };
  export type GameUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>;
    where?: GameWhereInput;
    limit?: number;
  };
  export type GameUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>;
    where?: GameWhereInput;
    limit?: number;
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type GameUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where: GameWhereUniqueInput;
    create: XOR<GameCreateInput, GameUncheckedCreateInput>;
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>;
  };
  export type GameDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
    where: GameWhereUniqueInput;
  };
  export type GameDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameWhereInput;
    limit?: number;
  };
  export type Game$whiteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };
  export type Game$blackArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: UserSelect<ExtArgs> | null;
    omit?: UserOmit<ExtArgs> | null;
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };
  export type Game$analysisArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where?: GameAnalysisWhereInput;
  };
  export type GameDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameSelect<ExtArgs> | null;
    omit?: GameOmit<ExtArgs> | null;
    include?: GameInclude<ExtArgs> | null;
  };
  export type AggregateGameAnalysis = {
    _count: GameAnalysisCountAggregateOutputType | null;
    _min: GameAnalysisMinAggregateOutputType | null;
    _max: GameAnalysisMaxAggregateOutputType | null;
  };
  export type GameAnalysisMinAggregateOutputType = {
    id: string | null;
    gameId: string | null;
    userId: string | null;
    createdAt: Date | null;
  };
  export type GameAnalysisMaxAggregateOutputType = {
    id: string | null;
    gameId: string | null;
    userId: string | null;
    createdAt: Date | null;
  };
  export type GameAnalysisCountAggregateOutputType = {
    id: number;
    gameId: number;
    userId: number;
    results: number;
    createdAt: number;
    _all: number;
  };
  export type GameAnalysisMinAggregateInputType = {
    id?: true;
    gameId?: true;
    userId?: true;
    createdAt?: true;
  };
  export type GameAnalysisMaxAggregateInputType = {
    id?: true;
    gameId?: true;
    userId?: true;
    createdAt?: true;
  };
  export type GameAnalysisCountAggregateInputType = {
    id?: true;
    gameId?: true;
    userId?: true;
    results?: true;
    createdAt?: true;
    _all?: true;
  };
  export type GameAnalysisAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithRelationInput
      | GameAnalysisOrderByWithRelationInput[];
    cursor?: GameAnalysisWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | GameAnalysisCountAggregateInputType;
    _min?: GameAnalysisMinAggregateInputType;
    _max?: GameAnalysisMaxAggregateInputType;
  };
  export type GetGameAnalysisAggregateType<
    T extends GameAnalysisAggregateArgs
  > = {
    [P in keyof T & keyof AggregateGameAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameAnalysis[P]>
      : GetScalarType<T[P], AggregateGameAnalysis[P]>;
  };
  export type GameAnalysisGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithAggregationInput
      | GameAnalysisOrderByWithAggregationInput[];
    by: GameAnalysisScalarFieldEnum[] | GameAnalysisScalarFieldEnum;
    having?: GameAnalysisScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GameAnalysisCountAggregateInputType | true;
    _min?: GameAnalysisMinAggregateInputType;
    _max?: GameAnalysisMaxAggregateInputType;
  };
  export type GameAnalysisGroupByOutputType = {
    id: string;
    gameId: string;
    userId: string;
    results: JsonValue;
    createdAt: Date;
    _count: GameAnalysisCountAggregateOutputType | null;
    _min: GameAnalysisMinAggregateOutputType | null;
    _max: GameAnalysisMaxAggregateOutputType | null;
  };
  type GetGameAnalysisGroupByPayload<T extends GameAnalysisGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<GameAnalysisGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof GameAnalysisGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], GameAnalysisGroupByOutputType[P]>;
        }
      >
    >;
  export type GameAnalysisSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      gameId?: boolean;
      userId?: boolean;
      results?: boolean;
      createdAt?: boolean;
      game?: boolean | GameDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['gameAnalysis']
  >;
  export type GameAnalysisSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      gameId?: boolean;
      userId?: boolean;
      results?: boolean;
      createdAt?: boolean;
      game?: boolean | GameDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['gameAnalysis']
  >;
  export type GameAnalysisSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      gameId?: boolean;
      userId?: boolean;
      results?: boolean;
      createdAt?: boolean;
      game?: boolean | GameDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['gameAnalysis']
  >;
  export type GameAnalysisSelectScalar = {
    id?: boolean;
    gameId?: boolean;
    userId?: boolean;
    results?: boolean;
    createdAt?: boolean;
  };
  export type GameAnalysisOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    'id' | 'gameId' | 'userId' | 'results' | 'createdAt',
    ExtArgs['result']['gameAnalysis']
  >;
  export type GameAnalysisInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    game?: boolean | GameDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type GameAnalysisIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    game?: boolean | GameDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type GameAnalysisIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    game?: boolean | GameDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $GameAnalysisPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'GameAnalysis';
    objects: {
      game: Prisma.$GamePayload<ExtArgs>;
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        gameId: string;
        userId: string;
        results: Prisma.JsonValue;
        createdAt: Date;
      },
      ExtArgs['result']['gameAnalysis']
    >;
    composites: {};
  };
  type GameAnalysisGetPayload<
    S extends boolean | null | undefined | GameAnalysisDefaultArgs
  > = $Result.GetResult<Prisma.$GameAnalysisPayload, S>;
  type GameAnalysisCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    GameAnalysisFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: GameAnalysisCountAggregateInputType | true;
  };
  export interface GameAnalysisDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['GameAnalysis'];
      meta: {
        name: 'GameAnalysis';
      };
    };
    findUnique<T extends GameAnalysisFindUniqueArgs>(
      args: SelectSubset<T, GameAnalysisFindUniqueArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends GameAnalysisFindUniqueOrThrowArgs>(
      args: SelectSubset<T, GameAnalysisFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends GameAnalysisFindFirstArgs>(
      args?: SelectSubset<T, GameAnalysisFindFirstArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends GameAnalysisFindFirstOrThrowArgs>(
      args?: SelectSubset<T, GameAnalysisFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends GameAnalysisFindManyArgs>(
      args?: SelectSubset<T, GameAnalysisFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends GameAnalysisCreateArgs>(
      args: SelectSubset<T, GameAnalysisCreateArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends GameAnalysisCreateManyArgs>(
      args?: SelectSubset<T, GameAnalysisCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends GameAnalysisCreateManyAndReturnArgs>(
      args?: SelectSubset<T, GameAnalysisCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends GameAnalysisDeleteArgs>(
      args: SelectSubset<T, GameAnalysisDeleteArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends GameAnalysisUpdateArgs>(
      args: SelectSubset<T, GameAnalysisUpdateArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends GameAnalysisDeleteManyArgs>(
      args?: SelectSubset<T, GameAnalysisDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends GameAnalysisUpdateManyArgs>(
      args: SelectSubset<T, GameAnalysisUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends GameAnalysisUpdateManyAndReturnArgs>(
      args: SelectSubset<T, GameAnalysisUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends GameAnalysisUpsertArgs>(
      args: SelectSubset<T, GameAnalysisUpsertArgs<ExtArgs>>
    ): Prisma__GameAnalysisClient<
      $Result.GetResult<
        Prisma.$GameAnalysisPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends GameAnalysisCountArgs>(
      args?: Subset<T, GameAnalysisCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameAnalysisCountAggregateOutputType>
        : number
    >;
    aggregate<T extends GameAnalysisAggregateArgs>(
      args: Subset<T, GameAnalysisAggregateArgs>
    ): Prisma.PrismaPromise<GetGameAnalysisAggregateType<T>>;
    groupBy<
      T extends GameAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: GameAnalysisGroupByArgs['orderBy'];
          }
        : {
            orderBy?: GameAnalysisGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, GameAnalysisGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetGameAnalysisGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: GameAnalysisFieldRefs;
  }
  export interface Prisma__GameAnalysisClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    game<T extends GameDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, GameDefaultArgs<ExtArgs>>
    ): Prisma__GameClient<
      | $Result.GetResult<
          Prisma.$GamePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface GameAnalysisFieldRefs {
    readonly id: FieldRef<'GameAnalysis', 'String'>;
    readonly gameId: FieldRef<'GameAnalysis', 'String'>;
    readonly userId: FieldRef<'GameAnalysis', 'String'>;
    readonly results: FieldRef<'GameAnalysis', 'Json'>;
    readonly createdAt: FieldRef<'GameAnalysis', 'DateTime'>;
  }
  export type GameAnalysisFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where: GameAnalysisWhereUniqueInput;
  };
  export type GameAnalysisFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where: GameAnalysisWhereUniqueInput;
  };
  export type GameAnalysisFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithRelationInput
      | GameAnalysisOrderByWithRelationInput[];
    cursor?: GameAnalysisWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[];
  };
  export type GameAnalysisFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithRelationInput
      | GameAnalysisOrderByWithRelationInput[];
    cursor?: GameAnalysisWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[];
  };
  export type GameAnalysisFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where?: GameAnalysisWhereInput;
    orderBy?:
      | GameAnalysisOrderByWithRelationInput
      | GameAnalysisOrderByWithRelationInput[];
    cursor?: GameAnalysisWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: GameAnalysisScalarFieldEnum | GameAnalysisScalarFieldEnum[];
  };
  export type GameAnalysisCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    data: XOR<GameAnalysisCreateInput, GameAnalysisUncheckedCreateInput>;
  };
  export type GameAnalysisCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: GameAnalysisCreateManyInput | GameAnalysisCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type GameAnalysisCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    data: GameAnalysisCreateManyInput | GameAnalysisCreateManyInput[];
    skipDuplicates?: boolean;
    include?: GameAnalysisIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type GameAnalysisUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    data: XOR<GameAnalysisUpdateInput, GameAnalysisUncheckedUpdateInput>;
    where: GameAnalysisWhereUniqueInput;
  };
  export type GameAnalysisUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      GameAnalysisUpdateManyMutationInput,
      GameAnalysisUncheckedUpdateManyInput
    >;
    where?: GameAnalysisWhereInput;
    limit?: number;
  };
  export type GameAnalysisUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    data: XOR<
      GameAnalysisUpdateManyMutationInput,
      GameAnalysisUncheckedUpdateManyInput
    >;
    where?: GameAnalysisWhereInput;
    limit?: number;
    include?: GameAnalysisIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type GameAnalysisUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where: GameAnalysisWhereUniqueInput;
    create: XOR<GameAnalysisCreateInput, GameAnalysisUncheckedCreateInput>;
    update: XOR<GameAnalysisUpdateInput, GameAnalysisUncheckedUpdateInput>;
  };
  export type GameAnalysisDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
    where: GameAnalysisWhereUniqueInput;
  };
  export type GameAnalysisDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: GameAnalysisWhereInput;
    limit?: number;
  };
  export type GameAnalysisDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: GameAnalysisSelect<ExtArgs> | null;
    omit?: GameAnalysisOmit<ExtArgs> | null;
    include?: GameAnalysisInclude<ExtArgs> | null;
  };
  export type AggregateRating = {
    _count: RatingCountAggregateOutputType | null;
    _avg: RatingAvgAggregateOutputType | null;
    _sum: RatingSumAggregateOutputType | null;
    _min: RatingMinAggregateOutputType | null;
    _max: RatingMaxAggregateOutputType | null;
  };
  export type RatingAvgAggregateOutputType = {
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
  };
  export type RatingSumAggregateOutputType = {
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
  };
  export type RatingMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    variant: string | null;
    category: string | null;
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type RatingMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    variant: string | null;
    category: string | null;
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type RatingCountAggregateOutputType = {
    id: number;
    userId: number;
    variant: number;
    category: number;
    rating: number;
    rd: number;
    sigma: number;
    gameCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };
  export type RatingAvgAggregateInputType = {
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
  };
  export type RatingSumAggregateInputType = {
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
  };
  export type RatingMinAggregateInputType = {
    id?: true;
    userId?: true;
    variant?: true;
    category?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type RatingMaxAggregateInputType = {
    id?: true;
    userId?: true;
    variant?: true;
    category?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type RatingCountAggregateInputType = {
    id?: true;
    userId?: true;
    variant?: true;
    category?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };
  export type RatingAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: RatingWhereInput;
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[];
    cursor?: RatingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RatingCountAggregateInputType;
    _avg?: RatingAvgAggregateInputType;
    _sum?: RatingSumAggregateInputType;
    _min?: RatingMinAggregateInputType;
    _max?: RatingMaxAggregateInputType;
  };
  export type GetRatingAggregateType<T extends RatingAggregateArgs> = {
    [P in keyof T & keyof AggregateRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRating[P]>
      : GetScalarType<T[P], AggregateRating[P]>;
  };
  export type RatingGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: RatingWhereInput;
    orderBy?:
      | RatingOrderByWithAggregationInput
      | RatingOrderByWithAggregationInput[];
    by: RatingScalarFieldEnum[] | RatingScalarFieldEnum;
    having?: RatingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RatingCountAggregateInputType | true;
    _avg?: RatingAvgAggregateInputType;
    _sum?: RatingSumAggregateInputType;
    _min?: RatingMinAggregateInputType;
    _max?: RatingMaxAggregateInputType;
  };
  export type RatingGroupByOutputType = {
    id: string;
    userId: string;
    variant: string;
    category: string;
    rating: number;
    rd: number;
    sigma: number;
    gameCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: RatingCountAggregateOutputType | null;
    _avg: RatingAvgAggregateOutputType | null;
    _sum: RatingSumAggregateOutputType | null;
    _min: RatingMinAggregateOutputType | null;
    _max: RatingMaxAggregateOutputType | null;
  };
  type GetRatingGroupByPayload<T extends RatingGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<RatingGroupByOutputType, T['by']> & {
          [P in keyof T & keyof RatingGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RatingGroupByOutputType[P]>
            : GetScalarType<T[P], RatingGroupByOutputType[P]>;
        }
      >
    >;
  export type RatingSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      variant?: boolean;
      category?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['rating']
  >;
  export type RatingSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      variant?: boolean;
      category?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['rating']
  >;
  export type RatingSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      variant?: boolean;
      category?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['rating']
  >;
  export type RatingSelectScalar = {
    id?: boolean;
    userId?: boolean;
    variant?: boolean;
    category?: boolean;
    rating?: boolean;
    rd?: boolean;
    sigma?: boolean;
    gameCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
  export type RatingOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'variant'
    | 'category'
    | 'rating'
    | 'rd'
    | 'sigma'
    | 'gameCount'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['rating']
  >;
  export type RatingInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type RatingIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type RatingIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $RatingPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Rating';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        variant: string;
        category: string;
        rating: number;
        rd: number;
        sigma: number;
        gameCount: number;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['rating']
    >;
    composites: {};
  };
  type RatingGetPayload<
    S extends boolean | null | undefined | RatingDefaultArgs
  > = $Result.GetResult<Prisma.$RatingPayload, S>;
  type RatingCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<RatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RatingCountAggregateInputType | true;
  };
  export interface RatingDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Rating'];
      meta: {
        name: 'Rating';
      };
    };
    findUnique<T extends RatingFindUniqueArgs>(
      args: SelectSubset<T, RatingFindUniqueArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends RatingFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RatingFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends RatingFindFirstArgs>(
      args?: SelectSubset<T, RatingFindFirstArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends RatingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RatingFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends RatingFindManyArgs>(
      args?: SelectSubset<T, RatingFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends RatingCreateArgs>(
      args: SelectSubset<T, RatingCreateArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends RatingCreateManyArgs>(
      args?: SelectSubset<T, RatingCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends RatingCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RatingCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends RatingDeleteArgs>(
      args: SelectSubset<T, RatingDeleteArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends RatingUpdateArgs>(
      args: SelectSubset<T, RatingUpdateArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends RatingDeleteManyArgs>(
      args?: SelectSubset<T, RatingDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends RatingUpdateManyArgs>(
      args: SelectSubset<T, RatingUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends RatingUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RatingUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends RatingUpsertArgs>(
      args: SelectSubset<T, RatingUpsertArgs<ExtArgs>>
    ): Prisma__RatingClient<
      $Result.GetResult<
        Prisma.$RatingPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends RatingCountArgs>(
      args?: Subset<T, RatingCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RatingCountAggregateOutputType>
        : number
    >;
    aggregate<T extends RatingAggregateArgs>(
      args: Subset<T, RatingAggregateArgs>
    ): Prisma.PrismaPromise<GetRatingAggregateType<T>>;
    groupBy<
      T extends RatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: RatingGroupByArgs['orderBy'];
          }
        : {
            orderBy?: RatingGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, RatingGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetRatingGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RatingFieldRefs;
  }
  export interface Prisma__RatingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface RatingFieldRefs {
    readonly id: FieldRef<'Rating', 'String'>;
    readonly userId: FieldRef<'Rating', 'String'>;
    readonly variant: FieldRef<'Rating', 'String'>;
    readonly category: FieldRef<'Rating', 'String'>;
    readonly rating: FieldRef<'Rating', 'Int'>;
    readonly rd: FieldRef<'Rating', 'Float'>;
    readonly sigma: FieldRef<'Rating', 'Float'>;
    readonly gameCount: FieldRef<'Rating', 'Int'>;
    readonly createdAt: FieldRef<'Rating', 'DateTime'>;
    readonly updatedAt: FieldRef<'Rating', 'DateTime'>;
  }
  export type RatingFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where: RatingWhereUniqueInput;
  };
  export type RatingFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where: RatingWhereUniqueInput;
  };
  export type RatingFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where?: RatingWhereInput;
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[];
    cursor?: RatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[];
  };
  export type RatingFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where?: RatingWhereInput;
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[];
    cursor?: RatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[];
  };
  export type RatingFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where?: RatingWhereInput;
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[];
    cursor?: RatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[];
  };
  export type RatingCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    data: XOR<RatingCreateInput, RatingUncheckedCreateInput>;
  };
  export type RatingCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: RatingCreateManyInput | RatingCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type RatingCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    data: RatingCreateManyInput | RatingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: RatingIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type RatingUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    data: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>;
    where: RatingWhereUniqueInput;
  };
  export type RatingUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>;
    where?: RatingWhereInput;
    limit?: number;
  };
  export type RatingUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>;
    where?: RatingWhereInput;
    limit?: number;
    include?: RatingIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type RatingUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where: RatingWhereUniqueInput;
    create: XOR<RatingCreateInput, RatingUncheckedCreateInput>;
    update: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>;
  };
  export type RatingDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
    where: RatingWhereUniqueInput;
  };
  export type RatingDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: RatingWhereInput;
    limit?: number;
  };
  export type RatingDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: RatingSelect<ExtArgs> | null;
    omit?: RatingOmit<ExtArgs> | null;
    include?: RatingInclude<ExtArgs> | null;
  };
  export type AggregatePuzzleRating = {
    _count: PuzzleRatingCountAggregateOutputType | null;
    _avg: PuzzleRatingAvgAggregateOutputType | null;
    _sum: PuzzleRatingSumAggregateOutputType | null;
    _min: PuzzleRatingMinAggregateOutputType | null;
    _max: PuzzleRatingMaxAggregateOutputType | null;
  };
  export type PuzzleRatingAvgAggregateOutputType = {
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
  };
  export type PuzzleRatingSumAggregateOutputType = {
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
  };
  export type PuzzleRatingMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type PuzzleRatingMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    rating: number | null;
    rd: number | null;
    sigma: number | null;
    gameCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  export type PuzzleRatingCountAggregateOutputType = {
    id: number;
    userId: number;
    rating: number;
    rd: number;
    sigma: number;
    gameCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };
  export type PuzzleRatingAvgAggregateInputType = {
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
  };
  export type PuzzleRatingSumAggregateInputType = {
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
  };
  export type PuzzleRatingMinAggregateInputType = {
    id?: true;
    userId?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type PuzzleRatingMaxAggregateInputType = {
    id?: true;
    userId?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };
  export type PuzzleRatingCountAggregateInputType = {
    id?: true;
    userId?: true;
    rating?: true;
    rd?: true;
    sigma?: true;
    gameCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };
  export type PuzzleRatingAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRatingWhereInput;
    orderBy?:
      | PuzzleRatingOrderByWithRelationInput
      | PuzzleRatingOrderByWithRelationInput[];
    cursor?: PuzzleRatingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PuzzleRatingCountAggregateInputType;
    _avg?: PuzzleRatingAvgAggregateInputType;
    _sum?: PuzzleRatingSumAggregateInputType;
    _min?: PuzzleRatingMinAggregateInputType;
    _max?: PuzzleRatingMaxAggregateInputType;
  };
  export type GetPuzzleRatingAggregateType<
    T extends PuzzleRatingAggregateArgs
  > = {
    [P in keyof T & keyof AggregatePuzzleRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleRating[P]>
      : GetScalarType<T[P], AggregatePuzzleRating[P]>;
  };
  export type PuzzleRatingGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRatingWhereInput;
    orderBy?:
      | PuzzleRatingOrderByWithAggregationInput
      | PuzzleRatingOrderByWithAggregationInput[];
    by: PuzzleRatingScalarFieldEnum[] | PuzzleRatingScalarFieldEnum;
    having?: PuzzleRatingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PuzzleRatingCountAggregateInputType | true;
    _avg?: PuzzleRatingAvgAggregateInputType;
    _sum?: PuzzleRatingSumAggregateInputType;
    _min?: PuzzleRatingMinAggregateInputType;
    _max?: PuzzleRatingMaxAggregateInputType;
  };
  export type PuzzleRatingGroupByOutputType = {
    id: string;
    userId: string;
    rating: number;
    rd: number;
    sigma: number;
    gameCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PuzzleRatingCountAggregateOutputType | null;
    _avg: PuzzleRatingAvgAggregateOutputType | null;
    _sum: PuzzleRatingSumAggregateOutputType | null;
    _min: PuzzleRatingMinAggregateOutputType | null;
    _max: PuzzleRatingMaxAggregateOutputType | null;
  };
  type GetPuzzleRatingGroupByPayload<T extends PuzzleRatingGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PuzzleRatingGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof PuzzleRatingGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleRatingGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleRatingGroupByOutputType[P]>;
        }
      >
    >;
  export type PuzzleRatingSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRating']
  >;
  export type PuzzleRatingSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRating']
  >;
  export type PuzzleRatingSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      rating?: boolean;
      rd?: boolean;
      sigma?: boolean;
      gameCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRating']
  >;
  export type PuzzleRatingSelectScalar = {
    id?: boolean;
    userId?: boolean;
    rating?: boolean;
    rd?: boolean;
    sigma?: boolean;
    gameCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
  export type PuzzleRatingOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'rating'
    | 'rd'
    | 'sigma'
    | 'gameCount'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['puzzleRating']
  >;
  export type PuzzleRatingInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleRatingIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleRatingIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $PuzzleRatingPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'PuzzleRating';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        rating: number;
        rd: number;
        sigma: number;
        gameCount: number;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['puzzleRating']
    >;
    composites: {};
  };
  type PuzzleRatingGetPayload<
    S extends boolean | null | undefined | PuzzleRatingDefaultArgs
  > = $Result.GetResult<Prisma.$PuzzleRatingPayload, S>;
  type PuzzleRatingCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    PuzzleRatingFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: PuzzleRatingCountAggregateInputType | true;
  };
  export interface PuzzleRatingDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PuzzleRating'];
      meta: {
        name: 'PuzzleRating';
      };
    };
    findUnique<T extends PuzzleRatingFindUniqueArgs>(
      args: SelectSubset<T, PuzzleRatingFindUniqueArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends PuzzleRatingFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PuzzleRatingFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends PuzzleRatingFindFirstArgs>(
      args?: SelectSubset<T, PuzzleRatingFindFirstArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends PuzzleRatingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PuzzleRatingFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends PuzzleRatingFindManyArgs>(
      args?: SelectSubset<T, PuzzleRatingFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends PuzzleRatingCreateArgs>(
      args: SelectSubset<T, PuzzleRatingCreateArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends PuzzleRatingCreateManyArgs>(
      args?: SelectSubset<T, PuzzleRatingCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends PuzzleRatingCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PuzzleRatingCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends PuzzleRatingDeleteArgs>(
      args: SelectSubset<T, PuzzleRatingDeleteArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends PuzzleRatingUpdateArgs>(
      args: SelectSubset<T, PuzzleRatingUpdateArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends PuzzleRatingDeleteManyArgs>(
      args?: SelectSubset<T, PuzzleRatingDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends PuzzleRatingUpdateManyArgs>(
      args: SelectSubset<T, PuzzleRatingUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends PuzzleRatingUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PuzzleRatingUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends PuzzleRatingUpsertArgs>(
      args: SelectSubset<T, PuzzleRatingUpsertArgs<ExtArgs>>
    ): Prisma__PuzzleRatingClient<
      $Result.GetResult<
        Prisma.$PuzzleRatingPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends PuzzleRatingCountArgs>(
      args?: Subset<T, PuzzleRatingCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleRatingCountAggregateOutputType>
        : number
    >;
    aggregate<T extends PuzzleRatingAggregateArgs>(
      args: Subset<T, PuzzleRatingAggregateArgs>
    ): Prisma.PrismaPromise<GetPuzzleRatingAggregateType<T>>;
    groupBy<
      T extends PuzzleRatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: PuzzleRatingGroupByArgs['orderBy'];
          }
        : {
            orderBy?: PuzzleRatingGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, PuzzleRatingGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPuzzleRatingGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PuzzleRatingFieldRefs;
  }
  export interface Prisma__PuzzleRatingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface PuzzleRatingFieldRefs {
    readonly id: FieldRef<'PuzzleRating', 'String'>;
    readonly userId: FieldRef<'PuzzleRating', 'String'>;
    readonly rating: FieldRef<'PuzzleRating', 'Int'>;
    readonly rd: FieldRef<'PuzzleRating', 'Float'>;
    readonly sigma: FieldRef<'PuzzleRating', 'Float'>;
    readonly gameCount: FieldRef<'PuzzleRating', 'Int'>;
    readonly createdAt: FieldRef<'PuzzleRating', 'DateTime'>;
    readonly updatedAt: FieldRef<'PuzzleRating', 'DateTime'>;
  }
  export type PuzzleRatingFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where: PuzzleRatingWhereUniqueInput;
  };
  export type PuzzleRatingFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where: PuzzleRatingWhereUniqueInput;
  };
  export type PuzzleRatingFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where?: PuzzleRatingWhereInput;
    orderBy?:
      | PuzzleRatingOrderByWithRelationInput
      | PuzzleRatingOrderByWithRelationInput[];
    cursor?: PuzzleRatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[];
  };
  export type PuzzleRatingFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where?: PuzzleRatingWhereInput;
    orderBy?:
      | PuzzleRatingOrderByWithRelationInput
      | PuzzleRatingOrderByWithRelationInput[];
    cursor?: PuzzleRatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[];
  };
  export type PuzzleRatingFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where?: PuzzleRatingWhereInput;
    orderBy?:
      | PuzzleRatingOrderByWithRelationInput
      | PuzzleRatingOrderByWithRelationInput[];
    cursor?: PuzzleRatingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleRatingScalarFieldEnum | PuzzleRatingScalarFieldEnum[];
  };
  export type PuzzleRatingCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    data: XOR<PuzzleRatingCreateInput, PuzzleRatingUncheckedCreateInput>;
  };
  export type PuzzleRatingCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: PuzzleRatingCreateManyInput | PuzzleRatingCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleRatingCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    data: PuzzleRatingCreateManyInput | PuzzleRatingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: PuzzleRatingIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleRatingUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    data: XOR<PuzzleRatingUpdateInput, PuzzleRatingUncheckedUpdateInput>;
    where: PuzzleRatingWhereUniqueInput;
  };
  export type PuzzleRatingUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      PuzzleRatingUpdateManyMutationInput,
      PuzzleRatingUncheckedUpdateManyInput
    >;
    where?: PuzzleRatingWhereInput;
    limit?: number;
  };
  export type PuzzleRatingUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    data: XOR<
      PuzzleRatingUpdateManyMutationInput,
      PuzzleRatingUncheckedUpdateManyInput
    >;
    where?: PuzzleRatingWhereInput;
    limit?: number;
    include?: PuzzleRatingIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleRatingUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where: PuzzleRatingWhereUniqueInput;
    create: XOR<PuzzleRatingCreateInput, PuzzleRatingUncheckedCreateInput>;
    update: XOR<PuzzleRatingUpdateInput, PuzzleRatingUncheckedUpdateInput>;
  };
  export type PuzzleRatingDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
    where: PuzzleRatingWhereUniqueInput;
  };
  export type PuzzleRatingDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRatingWhereInput;
    limit?: number;
  };
  export type PuzzleRatingDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRatingSelect<ExtArgs> | null;
    omit?: PuzzleRatingOmit<ExtArgs> | null;
    include?: PuzzleRatingInclude<ExtArgs> | null;
  };
  export type AggregatePuzzleAttempt = {
    _count: PuzzleAttemptCountAggregateOutputType | null;
    _avg: PuzzleAttemptAvgAggregateOutputType | null;
    _sum: PuzzleAttemptSumAggregateOutputType | null;
    _min: PuzzleAttemptMinAggregateOutputType | null;
    _max: PuzzleAttemptMaxAggregateOutputType | null;
  };
  export type PuzzleAttemptAvgAggregateOutputType = {
    rating: number | null;
  };
  export type PuzzleAttemptSumAggregateOutputType = {
    rating: number | null;
  };
  export type PuzzleAttemptMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    puzzleId: string | null;
    difficulty: string | null;
    rating: number | null;
    solved: boolean | null;
    usedHint: boolean | null;
    createdAt: Date | null;
  };
  export type PuzzleAttemptMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    puzzleId: string | null;
    difficulty: string | null;
    rating: number | null;
    solved: boolean | null;
    usedHint: boolean | null;
    createdAt: Date | null;
  };
  export type PuzzleAttemptCountAggregateOutputType = {
    id: number;
    userId: number;
    puzzleId: number;
    difficulty: number;
    rating: number;
    solved: number;
    usedHint: number;
    createdAt: number;
    _all: number;
  };
  export type PuzzleAttemptAvgAggregateInputType = {
    rating?: true;
  };
  export type PuzzleAttemptSumAggregateInputType = {
    rating?: true;
  };
  export type PuzzleAttemptMinAggregateInputType = {
    id?: true;
    userId?: true;
    puzzleId?: true;
    difficulty?: true;
    rating?: true;
    solved?: true;
    usedHint?: true;
    createdAt?: true;
  };
  export type PuzzleAttemptMaxAggregateInputType = {
    id?: true;
    userId?: true;
    puzzleId?: true;
    difficulty?: true;
    rating?: true;
    solved?: true;
    usedHint?: true;
    createdAt?: true;
  };
  export type PuzzleAttemptCountAggregateInputType = {
    id?: true;
    userId?: true;
    puzzleId?: true;
    difficulty?: true;
    rating?: true;
    solved?: true;
    usedHint?: true;
    createdAt?: true;
    _all?: true;
  };
  export type PuzzleAttemptAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithRelationInput
      | PuzzleAttemptOrderByWithRelationInput[];
    cursor?: PuzzleAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PuzzleAttemptCountAggregateInputType;
    _avg?: PuzzleAttemptAvgAggregateInputType;
    _sum?: PuzzleAttemptSumAggregateInputType;
    _min?: PuzzleAttemptMinAggregateInputType;
    _max?: PuzzleAttemptMaxAggregateInputType;
  };
  export type GetPuzzleAttemptAggregateType<
    T extends PuzzleAttemptAggregateArgs
  > = {
    [P in keyof T & keyof AggregatePuzzleAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleAttempt[P]>
      : GetScalarType<T[P], AggregatePuzzleAttempt[P]>;
  };
  export type PuzzleAttemptGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithAggregationInput
      | PuzzleAttemptOrderByWithAggregationInput[];
    by: PuzzleAttemptScalarFieldEnum[] | PuzzleAttemptScalarFieldEnum;
    having?: PuzzleAttemptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PuzzleAttemptCountAggregateInputType | true;
    _avg?: PuzzleAttemptAvgAggregateInputType;
    _sum?: PuzzleAttemptSumAggregateInputType;
    _min?: PuzzleAttemptMinAggregateInputType;
    _max?: PuzzleAttemptMaxAggregateInputType;
  };
  export type PuzzleAttemptGroupByOutputType = {
    id: string;
    userId: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint: boolean;
    createdAt: Date;
    _count: PuzzleAttemptCountAggregateOutputType | null;
    _avg: PuzzleAttemptAvgAggregateOutputType | null;
    _sum: PuzzleAttemptSumAggregateOutputType | null;
    _min: PuzzleAttemptMinAggregateOutputType | null;
    _max: PuzzleAttemptMaxAggregateOutputType | null;
  };
  type GetPuzzleAttemptGroupByPayload<T extends PuzzleAttemptGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PuzzleAttemptGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof PuzzleAttemptGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleAttemptGroupByOutputType[P]>;
        }
      >
    >;
  export type PuzzleAttemptSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      puzzleId?: boolean;
      difficulty?: boolean;
      rating?: boolean;
      solved?: boolean;
      usedHint?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleAttempt']
  >;
  export type PuzzleAttemptSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      puzzleId?: boolean;
      difficulty?: boolean;
      rating?: boolean;
      solved?: boolean;
      usedHint?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleAttempt']
  >;
  export type PuzzleAttemptSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      puzzleId?: boolean;
      difficulty?: boolean;
      rating?: boolean;
      solved?: boolean;
      usedHint?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleAttempt']
  >;
  export type PuzzleAttemptSelectScalar = {
    id?: boolean;
    userId?: boolean;
    puzzleId?: boolean;
    difficulty?: boolean;
    rating?: boolean;
    solved?: boolean;
    usedHint?: boolean;
    createdAt?: boolean;
  };
  export type PuzzleAttemptOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'puzzleId'
    | 'difficulty'
    | 'rating'
    | 'solved'
    | 'usedHint'
    | 'createdAt',
    ExtArgs['result']['puzzleAttempt']
  >;
  export type PuzzleAttemptInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleAttemptIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleAttemptIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $PuzzleAttemptPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'PuzzleAttempt';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        puzzleId: string;
        difficulty: string;
        rating: number;
        solved: boolean;
        usedHint: boolean;
        createdAt: Date;
      },
      ExtArgs['result']['puzzleAttempt']
    >;
    composites: {};
  };
  type PuzzleAttemptGetPayload<
    S extends boolean | null | undefined | PuzzleAttemptDefaultArgs
  > = $Result.GetResult<Prisma.$PuzzleAttemptPayload, S>;
  type PuzzleAttemptCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    PuzzleAttemptFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: PuzzleAttemptCountAggregateInputType | true;
  };
  export interface PuzzleAttemptDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PuzzleAttempt'];
      meta: {
        name: 'PuzzleAttempt';
      };
    };
    findUnique<T extends PuzzleAttemptFindUniqueArgs>(
      args: SelectSubset<T, PuzzleAttemptFindUniqueArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends PuzzleAttemptFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PuzzleAttemptFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends PuzzleAttemptFindFirstArgs>(
      args?: SelectSubset<T, PuzzleAttemptFindFirstArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends PuzzleAttemptFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PuzzleAttemptFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends PuzzleAttemptFindManyArgs>(
      args?: SelectSubset<T, PuzzleAttemptFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends PuzzleAttemptCreateArgs>(
      args: SelectSubset<T, PuzzleAttemptCreateArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends PuzzleAttemptCreateManyArgs>(
      args?: SelectSubset<T, PuzzleAttemptCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends PuzzleAttemptCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PuzzleAttemptCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends PuzzleAttemptDeleteArgs>(
      args: SelectSubset<T, PuzzleAttemptDeleteArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends PuzzleAttemptUpdateArgs>(
      args: SelectSubset<T, PuzzleAttemptUpdateArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends PuzzleAttemptDeleteManyArgs>(
      args?: SelectSubset<T, PuzzleAttemptDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends PuzzleAttemptUpdateManyArgs>(
      args: SelectSubset<T, PuzzleAttemptUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends PuzzleAttemptUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PuzzleAttemptUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends PuzzleAttemptUpsertArgs>(
      args: SelectSubset<T, PuzzleAttemptUpsertArgs<ExtArgs>>
    ): Prisma__PuzzleAttemptClient<
      $Result.GetResult<
        Prisma.$PuzzleAttemptPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends PuzzleAttemptCountArgs>(
      args?: Subset<T, PuzzleAttemptCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleAttemptCountAggregateOutputType>
        : number
    >;
    aggregate<T extends PuzzleAttemptAggregateArgs>(
      args: Subset<T, PuzzleAttemptAggregateArgs>
    ): Prisma.PrismaPromise<GetPuzzleAttemptAggregateType<T>>;
    groupBy<
      T extends PuzzleAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: PuzzleAttemptGroupByArgs['orderBy'];
          }
        : {
            orderBy?: PuzzleAttemptGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, PuzzleAttemptGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPuzzleAttemptGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PuzzleAttemptFieldRefs;
  }
  export interface Prisma__PuzzleAttemptClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface PuzzleAttemptFieldRefs {
    readonly id: FieldRef<'PuzzleAttempt', 'String'>;
    readonly userId: FieldRef<'PuzzleAttempt', 'String'>;
    readonly puzzleId: FieldRef<'PuzzleAttempt', 'String'>;
    readonly difficulty: FieldRef<'PuzzleAttempt', 'String'>;
    readonly rating: FieldRef<'PuzzleAttempt', 'Int'>;
    readonly solved: FieldRef<'PuzzleAttempt', 'Boolean'>;
    readonly usedHint: FieldRef<'PuzzleAttempt', 'Boolean'>;
    readonly createdAt: FieldRef<'PuzzleAttempt', 'DateTime'>;
  }
  export type PuzzleAttemptFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where: PuzzleAttemptWhereUniqueInput;
  };
  export type PuzzleAttemptFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where: PuzzleAttemptWhereUniqueInput;
  };
  export type PuzzleAttemptFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithRelationInput
      | PuzzleAttemptOrderByWithRelationInput[];
    cursor?: PuzzleAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[];
  };
  export type PuzzleAttemptFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithRelationInput
      | PuzzleAttemptOrderByWithRelationInput[];
    cursor?: PuzzleAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[];
  };
  export type PuzzleAttemptFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where?: PuzzleAttemptWhereInput;
    orderBy?:
      | PuzzleAttemptOrderByWithRelationInput
      | PuzzleAttemptOrderByWithRelationInput[];
    cursor?: PuzzleAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PuzzleAttemptScalarFieldEnum | PuzzleAttemptScalarFieldEnum[];
  };
  export type PuzzleAttemptCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    data: XOR<PuzzleAttemptCreateInput, PuzzleAttemptUncheckedCreateInput>;
  };
  export type PuzzleAttemptCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: PuzzleAttemptCreateManyInput | PuzzleAttemptCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleAttemptCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    data: PuzzleAttemptCreateManyInput | PuzzleAttemptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: PuzzleAttemptIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleAttemptUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    data: XOR<PuzzleAttemptUpdateInput, PuzzleAttemptUncheckedUpdateInput>;
    where: PuzzleAttemptWhereUniqueInput;
  };
  export type PuzzleAttemptUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      PuzzleAttemptUpdateManyMutationInput,
      PuzzleAttemptUncheckedUpdateManyInput
    >;
    where?: PuzzleAttemptWhereInput;
    limit?: number;
  };
  export type PuzzleAttemptUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    data: XOR<
      PuzzleAttemptUpdateManyMutationInput,
      PuzzleAttemptUncheckedUpdateManyInput
    >;
    where?: PuzzleAttemptWhereInput;
    limit?: number;
    include?: PuzzleAttemptIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleAttemptUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where: PuzzleAttemptWhereUniqueInput;
    create: XOR<PuzzleAttemptCreateInput, PuzzleAttemptUncheckedCreateInput>;
    update: XOR<PuzzleAttemptUpdateInput, PuzzleAttemptUncheckedUpdateInput>;
  };
  export type PuzzleAttemptDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
    where: PuzzleAttemptWhereUniqueInput;
  };
  export type PuzzleAttemptDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleAttemptWhereInput;
    limit?: number;
  };
  export type PuzzleAttemptDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleAttemptSelect<ExtArgs> | null;
    omit?: PuzzleAttemptOmit<ExtArgs> | null;
    include?: PuzzleAttemptInclude<ExtArgs> | null;
  };
  export type AggregatePuzzleRushScore = {
    _count: PuzzleRushScoreCountAggregateOutputType | null;
    _avg: PuzzleRushScoreAvgAggregateOutputType | null;
    _sum: PuzzleRushScoreSumAggregateOutputType | null;
    _min: PuzzleRushScoreMinAggregateOutputType | null;
    _max: PuzzleRushScoreMaxAggregateOutputType | null;
  };
  export type PuzzleRushScoreAvgAggregateOutputType = {
    score: number | null;
    mistakes: number | null;
    timeLimitSeconds: number | null;
    maxMistakes: number | null;
  };
  export type PuzzleRushScoreSumAggregateOutputType = {
    score: number | null;
    mistakes: number | null;
    timeLimitSeconds: number | null;
    maxMistakes: number | null;
  };
  export type PuzzleRushScoreMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    mode: string | null;
    difficulty: string | null;
    score: number | null;
    mistakes: number | null;
    timeLimitSeconds: number | null;
    maxMistakes: number | null;
    createdAt: Date | null;
  };
  export type PuzzleRushScoreMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    mode: string | null;
    difficulty: string | null;
    score: number | null;
    mistakes: number | null;
    timeLimitSeconds: number | null;
    maxMistakes: number | null;
    createdAt: Date | null;
  };
  export type PuzzleRushScoreCountAggregateOutputType = {
    id: number;
    userId: number;
    mode: number;
    difficulty: number;
    score: number;
    mistakes: number;
    timeLimitSeconds: number;
    maxMistakes: number;
    createdAt: number;
    _all: number;
  };
  export type PuzzleRushScoreAvgAggregateInputType = {
    score?: true;
    mistakes?: true;
    timeLimitSeconds?: true;
    maxMistakes?: true;
  };
  export type PuzzleRushScoreSumAggregateInputType = {
    score?: true;
    mistakes?: true;
    timeLimitSeconds?: true;
    maxMistakes?: true;
  };
  export type PuzzleRushScoreMinAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    difficulty?: true;
    score?: true;
    mistakes?: true;
    timeLimitSeconds?: true;
    maxMistakes?: true;
    createdAt?: true;
  };
  export type PuzzleRushScoreMaxAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    difficulty?: true;
    score?: true;
    mistakes?: true;
    timeLimitSeconds?: true;
    maxMistakes?: true;
    createdAt?: true;
  };
  export type PuzzleRushScoreCountAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    difficulty?: true;
    score?: true;
    mistakes?: true;
    timeLimitSeconds?: true;
    maxMistakes?: true;
    createdAt?: true;
    _all?: true;
  };
  export type PuzzleRushScoreAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithRelationInput
      | PuzzleRushScoreOrderByWithRelationInput[];
    cursor?: PuzzleRushScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PuzzleRushScoreCountAggregateInputType;
    _avg?: PuzzleRushScoreAvgAggregateInputType;
    _sum?: PuzzleRushScoreSumAggregateInputType;
    _min?: PuzzleRushScoreMinAggregateInputType;
    _max?: PuzzleRushScoreMaxAggregateInputType;
  };
  export type GetPuzzleRushScoreAggregateType<
    T extends PuzzleRushScoreAggregateArgs
  > = {
    [P in keyof T & keyof AggregatePuzzleRushScore]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePuzzleRushScore[P]>
      : GetScalarType<T[P], AggregatePuzzleRushScore[P]>;
  };
  export type PuzzleRushScoreGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithAggregationInput
      | PuzzleRushScoreOrderByWithAggregationInput[];
    by: PuzzleRushScoreScalarFieldEnum[] | PuzzleRushScoreScalarFieldEnum;
    having?: PuzzleRushScoreScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PuzzleRushScoreCountAggregateInputType | true;
    _avg?: PuzzleRushScoreAvgAggregateInputType;
    _sum?: PuzzleRushScoreSumAggregateInputType;
    _min?: PuzzleRushScoreMinAggregateInputType;
    _max?: PuzzleRushScoreMaxAggregateInputType;
  };
  export type PuzzleRushScoreGroupByOutputType = {
    id: string;
    userId: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds: number | null;
    maxMistakes: number | null;
    createdAt: Date;
    _count: PuzzleRushScoreCountAggregateOutputType | null;
    _avg: PuzzleRushScoreAvgAggregateOutputType | null;
    _sum: PuzzleRushScoreSumAggregateOutputType | null;
    _min: PuzzleRushScoreMinAggregateOutputType | null;
    _max: PuzzleRushScoreMaxAggregateOutputType | null;
  };
  type GetPuzzleRushScoreGroupByPayload<T extends PuzzleRushScoreGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PuzzleRushScoreGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof PuzzleRushScoreGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PuzzleRushScoreGroupByOutputType[P]>
            : GetScalarType<T[P], PuzzleRushScoreGroupByOutputType[P]>;
        }
      >
    >;
  export type PuzzleRushScoreSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      difficulty?: boolean;
      score?: boolean;
      mistakes?: boolean;
      timeLimitSeconds?: boolean;
      maxMistakes?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRushScore']
  >;
  export type PuzzleRushScoreSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      difficulty?: boolean;
      score?: boolean;
      mistakes?: boolean;
      timeLimitSeconds?: boolean;
      maxMistakes?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRushScore']
  >;
  export type PuzzleRushScoreSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      difficulty?: boolean;
      score?: boolean;
      mistakes?: boolean;
      timeLimitSeconds?: boolean;
      maxMistakes?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['puzzleRushScore']
  >;
  export type PuzzleRushScoreSelectScalar = {
    id?: boolean;
    userId?: boolean;
    mode?: boolean;
    difficulty?: boolean;
    score?: boolean;
    mistakes?: boolean;
    timeLimitSeconds?: boolean;
    maxMistakes?: boolean;
    createdAt?: boolean;
  };
  export type PuzzleRushScoreOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'mode'
    | 'difficulty'
    | 'score'
    | 'mistakes'
    | 'timeLimitSeconds'
    | 'maxMistakes'
    | 'createdAt',
    ExtArgs['result']['puzzleRushScore']
  >;
  export type PuzzleRushScoreInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleRushScoreIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PuzzleRushScoreIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $PuzzleRushScorePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'PuzzleRushScore';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        mode: string;
        difficulty: string;
        score: number;
        mistakes: number;
        timeLimitSeconds: number | null;
        maxMistakes: number | null;
        createdAt: Date;
      },
      ExtArgs['result']['puzzleRushScore']
    >;
    composites: {};
  };
  type PuzzleRushScoreGetPayload<
    S extends boolean | null | undefined | PuzzleRushScoreDefaultArgs
  > = $Result.GetResult<Prisma.$PuzzleRushScorePayload, S>;
  type PuzzleRushScoreCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    PuzzleRushScoreFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: PuzzleRushScoreCountAggregateInputType | true;
  };
  export interface PuzzleRushScoreDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PuzzleRushScore'];
      meta: {
        name: 'PuzzleRushScore';
      };
    };
    findUnique<T extends PuzzleRushScoreFindUniqueArgs>(
      args: SelectSubset<T, PuzzleRushScoreFindUniqueArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends PuzzleRushScoreFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PuzzleRushScoreFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends PuzzleRushScoreFindFirstArgs>(
      args?: SelectSubset<T, PuzzleRushScoreFindFirstArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends PuzzleRushScoreFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PuzzleRushScoreFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends PuzzleRushScoreFindManyArgs>(
      args?: SelectSubset<T, PuzzleRushScoreFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends PuzzleRushScoreCreateArgs>(
      args: SelectSubset<T, PuzzleRushScoreCreateArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends PuzzleRushScoreCreateManyArgs>(
      args?: SelectSubset<T, PuzzleRushScoreCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends PuzzleRushScoreCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PuzzleRushScoreCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends PuzzleRushScoreDeleteArgs>(
      args: SelectSubset<T, PuzzleRushScoreDeleteArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends PuzzleRushScoreUpdateArgs>(
      args: SelectSubset<T, PuzzleRushScoreUpdateArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends PuzzleRushScoreDeleteManyArgs>(
      args?: SelectSubset<T, PuzzleRushScoreDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends PuzzleRushScoreUpdateManyArgs>(
      args: SelectSubset<T, PuzzleRushScoreUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends PuzzleRushScoreUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PuzzleRushScoreUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends PuzzleRushScoreUpsertArgs>(
      args: SelectSubset<T, PuzzleRushScoreUpsertArgs<ExtArgs>>
    ): Prisma__PuzzleRushScoreClient<
      $Result.GetResult<
        Prisma.$PuzzleRushScorePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends PuzzleRushScoreCountArgs>(
      args?: Subset<T, PuzzleRushScoreCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PuzzleRushScoreCountAggregateOutputType>
        : number
    >;
    aggregate<T extends PuzzleRushScoreAggregateArgs>(
      args: Subset<T, PuzzleRushScoreAggregateArgs>
    ): Prisma.PrismaPromise<GetPuzzleRushScoreAggregateType<T>>;
    groupBy<
      T extends PuzzleRushScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: PuzzleRushScoreGroupByArgs['orderBy'];
          }
        : {
            orderBy?: PuzzleRushScoreGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, PuzzleRushScoreGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetPuzzleRushScoreGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PuzzleRushScoreFieldRefs;
  }
  export interface Prisma__PuzzleRushScoreClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface PuzzleRushScoreFieldRefs {
    readonly id: FieldRef<'PuzzleRushScore', 'String'>;
    readonly userId: FieldRef<'PuzzleRushScore', 'String'>;
    readonly mode: FieldRef<'PuzzleRushScore', 'String'>;
    readonly difficulty: FieldRef<'PuzzleRushScore', 'String'>;
    readonly score: FieldRef<'PuzzleRushScore', 'Int'>;
    readonly mistakes: FieldRef<'PuzzleRushScore', 'Int'>;
    readonly timeLimitSeconds: FieldRef<'PuzzleRushScore', 'Int'>;
    readonly maxMistakes: FieldRef<'PuzzleRushScore', 'Int'>;
    readonly createdAt: FieldRef<'PuzzleRushScore', 'DateTime'>;
  }
  export type PuzzleRushScoreFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where: PuzzleRushScoreWhereUniqueInput;
  };
  export type PuzzleRushScoreFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where: PuzzleRushScoreWhereUniqueInput;
  };
  export type PuzzleRushScoreFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithRelationInput
      | PuzzleRushScoreOrderByWithRelationInput[];
    cursor?: PuzzleRushScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | PuzzleRushScoreScalarFieldEnum
      | PuzzleRushScoreScalarFieldEnum[];
  };
  export type PuzzleRushScoreFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithRelationInput
      | PuzzleRushScoreOrderByWithRelationInput[];
    cursor?: PuzzleRushScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | PuzzleRushScoreScalarFieldEnum
      | PuzzleRushScoreScalarFieldEnum[];
  };
  export type PuzzleRushScoreFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where?: PuzzleRushScoreWhereInput;
    orderBy?:
      | PuzzleRushScoreOrderByWithRelationInput
      | PuzzleRushScoreOrderByWithRelationInput[];
    cursor?: PuzzleRushScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | PuzzleRushScoreScalarFieldEnum
      | PuzzleRushScoreScalarFieldEnum[];
  };
  export type PuzzleRushScoreCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    data: XOR<PuzzleRushScoreCreateInput, PuzzleRushScoreUncheckedCreateInput>;
  };
  export type PuzzleRushScoreCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: PuzzleRushScoreCreateManyInput | PuzzleRushScoreCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleRushScoreCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    data: PuzzleRushScoreCreateManyInput | PuzzleRushScoreCreateManyInput[];
    skipDuplicates?: boolean;
    include?: PuzzleRushScoreIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleRushScoreUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    data: XOR<PuzzleRushScoreUpdateInput, PuzzleRushScoreUncheckedUpdateInput>;
    where: PuzzleRushScoreWhereUniqueInput;
  };
  export type PuzzleRushScoreUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      PuzzleRushScoreUpdateManyMutationInput,
      PuzzleRushScoreUncheckedUpdateManyInput
    >;
    where?: PuzzleRushScoreWhereInput;
    limit?: number;
  };
  export type PuzzleRushScoreUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    data: XOR<
      PuzzleRushScoreUpdateManyMutationInput,
      PuzzleRushScoreUncheckedUpdateManyInput
    >;
    where?: PuzzleRushScoreWhereInput;
    limit?: number;
    include?: PuzzleRushScoreIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type PuzzleRushScoreUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where: PuzzleRushScoreWhereUniqueInput;
    create: XOR<
      PuzzleRushScoreCreateInput,
      PuzzleRushScoreUncheckedCreateInput
    >;
    update: XOR<
      PuzzleRushScoreUpdateInput,
      PuzzleRushScoreUncheckedUpdateInput
    >;
  };
  export type PuzzleRushScoreDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
    where: PuzzleRushScoreWhereUniqueInput;
  };
  export type PuzzleRushScoreDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: PuzzleRushScoreWhereInput;
    limit?: number;
  };
  export type PuzzleRushScoreDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: PuzzleRushScoreSelect<ExtArgs> | null;
    omit?: PuzzleRushScoreOmit<ExtArgs> | null;
    include?: PuzzleRushScoreInclude<ExtArgs> | null;
  };
  export type AggregateMemorySession = {
    _count: MemorySessionCountAggregateOutputType | null;
    _avg: MemorySessionAvgAggregateOutputType | null;
    _sum: MemorySessionSumAggregateOutputType | null;
    _min: MemorySessionMinAggregateOutputType | null;
    _max: MemorySessionMaxAggregateOutputType | null;
  };
  export type MemorySessionAvgAggregateOutputType = {
    pieceCount: number | null;
    memorizeTimeSeconds: number | null;
    correctPieces: number | null;
    totalPieces: number | null;
    accuracy: number | null;
    progressiveLevel: number | null;
  };
  export type MemorySessionSumAggregateOutputType = {
    pieceCount: number | null;
    memorizeTimeSeconds: number | null;
    correctPieces: number | null;
    totalPieces: number | null;
    accuracy: number | null;
    progressiveLevel: number | null;
  };
  export type MemorySessionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    mode: string | null;
    pieceCount: number | null;
    memorizeTimeSeconds: number | null;
    correctPieces: number | null;
    totalPieces: number | null;
    accuracy: number | null;
    progressiveLevel: number | null;
    createdAt: Date | null;
  };
  export type MemorySessionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    mode: string | null;
    pieceCount: number | null;
    memorizeTimeSeconds: number | null;
    correctPieces: number | null;
    totalPieces: number | null;
    accuracy: number | null;
    progressiveLevel: number | null;
    createdAt: Date | null;
  };
  export type MemorySessionCountAggregateOutputType = {
    id: number;
    userId: number;
    mode: number;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel: number;
    createdAt: number;
    _all: number;
  };
  export type MemorySessionAvgAggregateInputType = {
    pieceCount?: true;
    memorizeTimeSeconds?: true;
    correctPieces?: true;
    totalPieces?: true;
    accuracy?: true;
    progressiveLevel?: true;
  };
  export type MemorySessionSumAggregateInputType = {
    pieceCount?: true;
    memorizeTimeSeconds?: true;
    correctPieces?: true;
    totalPieces?: true;
    accuracy?: true;
    progressiveLevel?: true;
  };
  export type MemorySessionMinAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    pieceCount?: true;
    memorizeTimeSeconds?: true;
    correctPieces?: true;
    totalPieces?: true;
    accuracy?: true;
    progressiveLevel?: true;
    createdAt?: true;
  };
  export type MemorySessionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    pieceCount?: true;
    memorizeTimeSeconds?: true;
    correctPieces?: true;
    totalPieces?: true;
    accuracy?: true;
    progressiveLevel?: true;
    createdAt?: true;
  };
  export type MemorySessionCountAggregateInputType = {
    id?: true;
    userId?: true;
    mode?: true;
    pieceCount?: true;
    memorizeTimeSeconds?: true;
    correctPieces?: true;
    totalPieces?: true;
    accuracy?: true;
    progressiveLevel?: true;
    createdAt?: true;
    _all?: true;
  };
  export type MemorySessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithRelationInput
      | MemorySessionOrderByWithRelationInput[];
    cursor?: MemorySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MemorySessionCountAggregateInputType;
    _avg?: MemorySessionAvgAggregateInputType;
    _sum?: MemorySessionSumAggregateInputType;
    _min?: MemorySessionMinAggregateInputType;
    _max?: MemorySessionMaxAggregateInputType;
  };
  export type GetMemorySessionAggregateType<
    T extends MemorySessionAggregateArgs
  > = {
    [P in keyof T & keyof AggregateMemorySession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemorySession[P]>
      : GetScalarType<T[P], AggregateMemorySession[P]>;
  };
  export type MemorySessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithAggregationInput
      | MemorySessionOrderByWithAggregationInput[];
    by: MemorySessionScalarFieldEnum[] | MemorySessionScalarFieldEnum;
    having?: MemorySessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MemorySessionCountAggregateInputType | true;
    _avg?: MemorySessionAvgAggregateInputType;
    _sum?: MemorySessionSumAggregateInputType;
    _min?: MemorySessionMinAggregateInputType;
    _max?: MemorySessionMaxAggregateInputType;
  };
  export type MemorySessionGroupByOutputType = {
    id: string;
    userId: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel: number | null;
    createdAt: Date;
    _count: MemorySessionCountAggregateOutputType | null;
    _avg: MemorySessionAvgAggregateOutputType | null;
    _sum: MemorySessionSumAggregateOutputType | null;
    _min: MemorySessionMinAggregateOutputType | null;
    _max: MemorySessionMaxAggregateOutputType | null;
  };
  type GetMemorySessionGroupByPayload<T extends MemorySessionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<MemorySessionGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof MemorySessionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>
            : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>;
        }
      >
    >;
  export type MemorySessionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      pieceCount?: boolean;
      memorizeTimeSeconds?: boolean;
      correctPieces?: boolean;
      totalPieces?: boolean;
      accuracy?: boolean;
      progressiveLevel?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['memorySession']
  >;
  export type MemorySessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      pieceCount?: boolean;
      memorizeTimeSeconds?: boolean;
      correctPieces?: boolean;
      totalPieces?: boolean;
      accuracy?: boolean;
      progressiveLevel?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['memorySession']
  >;
  export type MemorySessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      mode?: boolean;
      pieceCount?: boolean;
      memorizeTimeSeconds?: boolean;
      correctPieces?: boolean;
      totalPieces?: boolean;
      accuracy?: boolean;
      progressiveLevel?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['memorySession']
  >;
  export type MemorySessionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    mode?: boolean;
    pieceCount?: boolean;
    memorizeTimeSeconds?: boolean;
    correctPieces?: boolean;
    totalPieces?: boolean;
    accuracy?: boolean;
    progressiveLevel?: boolean;
    createdAt?: boolean;
  };
  export type MemorySessionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'mode'
    | 'pieceCount'
    | 'memorizeTimeSeconds'
    | 'correctPieces'
    | 'totalPieces'
    | 'accuracy'
    | 'progressiveLevel'
    | 'createdAt',
    ExtArgs['result']['memorySession']
  >;
  export type MemorySessionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MemorySessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MemorySessionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $MemorySessionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'MemorySession';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        mode: string;
        pieceCount: number;
        memorizeTimeSeconds: number;
        correctPieces: number;
        totalPieces: number;
        accuracy: number;
        progressiveLevel: number | null;
        createdAt: Date;
      },
      ExtArgs['result']['memorySession']
    >;
    composites: {};
  };
  type MemorySessionGetPayload<
    S extends boolean | null | undefined | MemorySessionDefaultArgs
  > = $Result.GetResult<Prisma.$MemorySessionPayload, S>;
  type MemorySessionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    MemorySessionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: MemorySessionCountAggregateInputType | true;
  };
  export interface MemorySessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['MemorySession'];
      meta: {
        name: 'MemorySession';
      };
    };
    findUnique<T extends MemorySessionFindUniqueArgs>(
      args: SelectSubset<T, MemorySessionFindUniqueArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends MemorySessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MemorySessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends MemorySessionFindFirstArgs>(
      args?: SelectSubset<T, MemorySessionFindFirstArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends MemorySessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MemorySessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends MemorySessionFindManyArgs>(
      args?: SelectSubset<T, MemorySessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends MemorySessionCreateArgs>(
      args: SelectSubset<T, MemorySessionCreateArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends MemorySessionCreateManyArgs>(
      args?: SelectSubset<T, MemorySessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends MemorySessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MemorySessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends MemorySessionDeleteArgs>(
      args: SelectSubset<T, MemorySessionDeleteArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends MemorySessionUpdateArgs>(
      args: SelectSubset<T, MemorySessionUpdateArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends MemorySessionDeleteManyArgs>(
      args?: SelectSubset<T, MemorySessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends MemorySessionUpdateManyArgs>(
      args: SelectSubset<T, MemorySessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends MemorySessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MemorySessionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends MemorySessionUpsertArgs>(
      args: SelectSubset<T, MemorySessionUpsertArgs<ExtArgs>>
    ): Prisma__MemorySessionClient<
      $Result.GetResult<
        Prisma.$MemorySessionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends MemorySessionCountArgs>(
      args?: Subset<T, MemorySessionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemorySessionCountAggregateOutputType>
        : number
    >;
    aggregate<T extends MemorySessionAggregateArgs>(
      args: Subset<T, MemorySessionAggregateArgs>
    ): Prisma.PrismaPromise<GetMemorySessionAggregateType<T>>;
    groupBy<
      T extends MemorySessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: MemorySessionGroupByArgs['orderBy'];
          }
        : {
            orderBy?: MemorySessionGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, MemorySessionGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetMemorySessionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MemorySessionFieldRefs;
  }
  export interface Prisma__MemorySessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface MemorySessionFieldRefs {
    readonly id: FieldRef<'MemorySession', 'String'>;
    readonly userId: FieldRef<'MemorySession', 'String'>;
    readonly mode: FieldRef<'MemorySession', 'String'>;
    readonly pieceCount: FieldRef<'MemorySession', 'Int'>;
    readonly memorizeTimeSeconds: FieldRef<'MemorySession', 'Int'>;
    readonly correctPieces: FieldRef<'MemorySession', 'Int'>;
    readonly totalPieces: FieldRef<'MemorySession', 'Int'>;
    readonly accuracy: FieldRef<'MemorySession', 'Float'>;
    readonly progressiveLevel: FieldRef<'MemorySession', 'Int'>;
    readonly createdAt: FieldRef<'MemorySession', 'DateTime'>;
  }
  export type MemorySessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where: MemorySessionWhereUniqueInput;
  };
  export type MemorySessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where: MemorySessionWhereUniqueInput;
  };
  export type MemorySessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithRelationInput
      | MemorySessionOrderByWithRelationInput[];
    cursor?: MemorySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[];
  };
  export type MemorySessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithRelationInput
      | MemorySessionOrderByWithRelationInput[];
    cursor?: MemorySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[];
  };
  export type MemorySessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where?: MemorySessionWhereInput;
    orderBy?:
      | MemorySessionOrderByWithRelationInput
      | MemorySessionOrderByWithRelationInput[];
    cursor?: MemorySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[];
  };
  export type MemorySessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    data: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>;
  };
  export type MemorySessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type MemorySessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: MemorySessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type MemorySessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    data: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>;
    where: MemorySessionWhereUniqueInput;
  };
  export type MemorySessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      MemorySessionUpdateManyMutationInput,
      MemorySessionUncheckedUpdateManyInput
    >;
    where?: MemorySessionWhereInput;
    limit?: number;
  };
  export type MemorySessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    data: XOR<
      MemorySessionUpdateManyMutationInput,
      MemorySessionUncheckedUpdateManyInput
    >;
    where?: MemorySessionWhereInput;
    limit?: number;
    include?: MemorySessionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type MemorySessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where: MemorySessionWhereUniqueInput;
    create: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>;
    update: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>;
  };
  export type MemorySessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
    where: MemorySessionWhereUniqueInput;
  };
  export type MemorySessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: MemorySessionWhereInput;
    limit?: number;
  };
  export type MemorySessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: MemorySessionSelect<ExtArgs> | null;
    omit?: MemorySessionOmit<ExtArgs> | null;
    include?: MemorySessionInclude<ExtArgs> | null;
  };
  export type AggregateVisionSession = {
    _count: VisionSessionCountAggregateOutputType | null;
    _avg: VisionSessionAvgAggregateOutputType | null;
    _sum: VisionSessionSumAggregateOutputType | null;
    _min: VisionSessionMinAggregateOutputType | null;
    _max: VisionSessionMaxAggregateOutputType | null;
  };
  export type VisionSessionAvgAggregateOutputType = {
    timeLimitSeconds: number | null;
    score: number | null;
    totalAttempts: number | null;
    accuracy: number | null;
    avgResponseTimeMs: number | null;
  };
  export type VisionSessionSumAggregateOutputType = {
    timeLimitSeconds: number | null;
    score: number | null;
    totalAttempts: number | null;
    accuracy: number | null;
    avgResponseTimeMs: number | null;
  };
  export type VisionSessionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    trainingMode: string | null;
    colorMode: string | null;
    timeLimitSeconds: number | null;
    score: number | null;
    totalAttempts: number | null;
    accuracy: number | null;
    avgResponseTimeMs: number | null;
    createdAt: Date | null;
  };
  export type VisionSessionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    trainingMode: string | null;
    colorMode: string | null;
    timeLimitSeconds: number | null;
    score: number | null;
    totalAttempts: number | null;
    accuracy: number | null;
    avgResponseTimeMs: number | null;
    createdAt: Date | null;
  };
  export type VisionSessionCountAggregateOutputType = {
    id: number;
    userId: number;
    trainingMode: number;
    colorMode: number;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt: number;
    _all: number;
  };
  export type VisionSessionAvgAggregateInputType = {
    timeLimitSeconds?: true;
    score?: true;
    totalAttempts?: true;
    accuracy?: true;
    avgResponseTimeMs?: true;
  };
  export type VisionSessionSumAggregateInputType = {
    timeLimitSeconds?: true;
    score?: true;
    totalAttempts?: true;
    accuracy?: true;
    avgResponseTimeMs?: true;
  };
  export type VisionSessionMinAggregateInputType = {
    id?: true;
    userId?: true;
    trainingMode?: true;
    colorMode?: true;
    timeLimitSeconds?: true;
    score?: true;
    totalAttempts?: true;
    accuracy?: true;
    avgResponseTimeMs?: true;
    createdAt?: true;
  };
  export type VisionSessionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    trainingMode?: true;
    colorMode?: true;
    timeLimitSeconds?: true;
    score?: true;
    totalAttempts?: true;
    accuracy?: true;
    avgResponseTimeMs?: true;
    createdAt?: true;
  };
  export type VisionSessionCountAggregateInputType = {
    id?: true;
    userId?: true;
    trainingMode?: true;
    colorMode?: true;
    timeLimitSeconds?: true;
    score?: true;
    totalAttempts?: true;
    accuracy?: true;
    avgResponseTimeMs?: true;
    createdAt?: true;
    _all?: true;
  };
  export type VisionSessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithRelationInput
      | VisionSessionOrderByWithRelationInput[];
    cursor?: VisionSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VisionSessionCountAggregateInputType;
    _avg?: VisionSessionAvgAggregateInputType;
    _sum?: VisionSessionSumAggregateInputType;
    _min?: VisionSessionMinAggregateInputType;
    _max?: VisionSessionMaxAggregateInputType;
  };
  export type GetVisionSessionAggregateType<
    T extends VisionSessionAggregateArgs
  > = {
    [P in keyof T & keyof AggregateVisionSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisionSession[P]>
      : GetScalarType<T[P], AggregateVisionSession[P]>;
  };
  export type VisionSessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithAggregationInput
      | VisionSessionOrderByWithAggregationInput[];
    by: VisionSessionScalarFieldEnum[] | VisionSessionScalarFieldEnum;
    having?: VisionSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VisionSessionCountAggregateInputType | true;
    _avg?: VisionSessionAvgAggregateInputType;
    _sum?: VisionSessionSumAggregateInputType;
    _min?: VisionSessionMinAggregateInputType;
    _max?: VisionSessionMaxAggregateInputType;
  };
  export type VisionSessionGroupByOutputType = {
    id: string;
    userId: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt: Date;
    _count: VisionSessionCountAggregateOutputType | null;
    _avg: VisionSessionAvgAggregateOutputType | null;
    _sum: VisionSessionSumAggregateOutputType | null;
    _min: VisionSessionMinAggregateOutputType | null;
    _max: VisionSessionMaxAggregateOutputType | null;
  };
  type GetVisionSessionGroupByPayload<T extends VisionSessionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VisionSessionGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof VisionSessionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisionSessionGroupByOutputType[P]>
            : GetScalarType<T[P], VisionSessionGroupByOutputType[P]>;
        }
      >
    >;
  export type VisionSessionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      trainingMode?: boolean;
      colorMode?: boolean;
      timeLimitSeconds?: boolean;
      score?: boolean;
      totalAttempts?: boolean;
      accuracy?: boolean;
      avgResponseTimeMs?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['visionSession']
  >;
  export type VisionSessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      trainingMode?: boolean;
      colorMode?: boolean;
      timeLimitSeconds?: boolean;
      score?: boolean;
      totalAttempts?: boolean;
      accuracy?: boolean;
      avgResponseTimeMs?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['visionSession']
  >;
  export type VisionSessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      trainingMode?: boolean;
      colorMode?: boolean;
      timeLimitSeconds?: boolean;
      score?: boolean;
      totalAttempts?: boolean;
      accuracy?: boolean;
      avgResponseTimeMs?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['visionSession']
  >;
  export type VisionSessionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    trainingMode?: boolean;
    colorMode?: boolean;
    timeLimitSeconds?: boolean;
    score?: boolean;
    totalAttempts?: boolean;
    accuracy?: boolean;
    avgResponseTimeMs?: boolean;
    createdAt?: boolean;
  };
  export type VisionSessionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'trainingMode'
    | 'colorMode'
    | 'timeLimitSeconds'
    | 'score'
    | 'totalAttempts'
    | 'accuracy'
    | 'avgResponseTimeMs'
    | 'createdAt',
    ExtArgs['result']['visionSession']
  >;
  export type VisionSessionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type VisionSessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type VisionSessionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type $VisionSessionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'VisionSession';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        trainingMode: string;
        colorMode: string;
        timeLimitSeconds: number;
        score: number;
        totalAttempts: number;
        accuracy: number;
        avgResponseTimeMs: number;
        createdAt: Date;
      },
      ExtArgs['result']['visionSession']
    >;
    composites: {};
  };
  type VisionSessionGetPayload<
    S extends boolean | null | undefined | VisionSessionDefaultArgs
  > = $Result.GetResult<Prisma.$VisionSessionPayload, S>;
  type VisionSessionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    VisionSessionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: VisionSessionCountAggregateInputType | true;
  };
  export interface VisionSessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['VisionSession'];
      meta: {
        name: 'VisionSession';
      };
    };
    findUnique<T extends VisionSessionFindUniqueArgs>(
      args: SelectSubset<T, VisionSessionFindUniqueArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findUniqueOrThrow<T extends VisionSessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VisionSessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirst<T extends VisionSessionFindFirstArgs>(
      args?: SelectSubset<T, VisionSessionFindFirstArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    findFirstOrThrow<T extends VisionSessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VisionSessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    findMany<T extends VisionSessionFindManyArgs>(
      args?: SelectSubset<T, VisionSessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;
    create<T extends VisionSessionCreateArgs>(
      args: SelectSubset<T, VisionSessionCreateArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    createMany<T extends VisionSessionCreateManyArgs>(
      args?: SelectSubset<T, VisionSessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    createManyAndReturn<T extends VisionSessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VisionSessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;
    delete<T extends VisionSessionDeleteArgs>(
      args: SelectSubset<T, VisionSessionDeleteArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    update<T extends VisionSessionUpdateArgs>(
      args: SelectSubset<T, VisionSessionUpdateArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    deleteMany<T extends VisionSessionDeleteManyArgs>(
      args?: SelectSubset<T, VisionSessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateMany<T extends VisionSessionUpdateManyArgs>(
      args: SelectSubset<T, VisionSessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;
    updateManyAndReturn<T extends VisionSessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, VisionSessionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;
    upsert<T extends VisionSessionUpsertArgs>(
      args: SelectSubset<T, VisionSessionUpsertArgs<ExtArgs>>
    ): Prisma__VisionSessionClient<
      $Result.GetResult<
        Prisma.$VisionSessionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;
    count<T extends VisionSessionCountArgs>(
      args?: Subset<T, VisionSessionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisionSessionCountAggregateOutputType>
        : number
    >;
    aggregate<T extends VisionSessionAggregateArgs>(
      args: Subset<T, VisionSessionAggregateArgs>
    ): Prisma.PrismaPromise<GetVisionSessionAggregateType<T>>;
    groupBy<
      T extends VisionSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? {
            orderBy: VisionSessionGroupByArgs['orderBy'];
          }
        : {
            orderBy?: VisionSessionGroupByArgs['orderBy'];
          },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, VisionSessionGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetVisionSessionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VisionSessionFieldRefs;
  }
  export interface Prisma__VisionSessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }
  interface VisionSessionFieldRefs {
    readonly id: FieldRef<'VisionSession', 'String'>;
    readonly userId: FieldRef<'VisionSession', 'String'>;
    readonly trainingMode: FieldRef<'VisionSession', 'String'>;
    readonly colorMode: FieldRef<'VisionSession', 'String'>;
    readonly timeLimitSeconds: FieldRef<'VisionSession', 'Int'>;
    readonly score: FieldRef<'VisionSession', 'Int'>;
    readonly totalAttempts: FieldRef<'VisionSession', 'Int'>;
    readonly accuracy: FieldRef<'VisionSession', 'Float'>;
    readonly avgResponseTimeMs: FieldRef<'VisionSession', 'Int'>;
    readonly createdAt: FieldRef<'VisionSession', 'DateTime'>;
  }
  export type VisionSessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where: VisionSessionWhereUniqueInput;
  };
  export type VisionSessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where: VisionSessionWhereUniqueInput;
  };
  export type VisionSessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithRelationInput
      | VisionSessionOrderByWithRelationInput[];
    cursor?: VisionSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[];
  };
  export type VisionSessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithRelationInput
      | VisionSessionOrderByWithRelationInput[];
    cursor?: VisionSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[];
  };
  export type VisionSessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where?: VisionSessionWhereInput;
    orderBy?:
      | VisionSessionOrderByWithRelationInput
      | VisionSessionOrderByWithRelationInput[];
    cursor?: VisionSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VisionSessionScalarFieldEnum | VisionSessionScalarFieldEnum[];
  };
  export type VisionSessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    data: XOR<VisionSessionCreateInput, VisionSessionUncheckedCreateInput>;
  };
  export type VisionSessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: VisionSessionCreateManyInput | VisionSessionCreateManyInput[];
    skipDuplicates?: boolean;
  };
  export type VisionSessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    data: VisionSessionCreateManyInput | VisionSessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: VisionSessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };
  export type VisionSessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    data: XOR<VisionSessionUpdateInput, VisionSessionUncheckedUpdateInput>;
    where: VisionSessionWhereUniqueInput;
  };
  export type VisionSessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    data: XOR<
      VisionSessionUpdateManyMutationInput,
      VisionSessionUncheckedUpdateManyInput
    >;
    where?: VisionSessionWhereInput;
    limit?: number;
  };
  export type VisionSessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    data: XOR<
      VisionSessionUpdateManyMutationInput,
      VisionSessionUncheckedUpdateManyInput
    >;
    where?: VisionSessionWhereInput;
    limit?: number;
    include?: VisionSessionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };
  export type VisionSessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where: VisionSessionWhereUniqueInput;
    create: XOR<VisionSessionCreateInput, VisionSessionUncheckedCreateInput>;
    update: XOR<VisionSessionUpdateInput, VisionSessionUncheckedUpdateInput>;
  };
  export type VisionSessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
    where: VisionSessionWhereUniqueInput;
  };
  export type VisionSessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: VisionSessionWhereInput;
    limit?: number;
  };
  export type VisionSessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    select?: VisionSessionSelect<ExtArgs> | null;
    omit?: VisionSessionOmit<ExtArgs> | null;
    include?: VisionSessionInclude<ExtArgs> | null;
  };
  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };
  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
  export const UserScalarFieldEnum: {
    id: 'id';
    name: 'name';
    email: 'email';
    emailVerified: 'emailVerified';
    image: 'image';
    flagCode: 'flagCode';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };
  export type UserScalarFieldEnum =
    (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
  export const PassportFlagScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    flagCode: 'flagCode';
    createdAt: 'createdAt';
  };
  export type PassportFlagScalarFieldEnum =
    (typeof PassportFlagScalarFieldEnum)[keyof typeof PassportFlagScalarFieldEnum];
  export const AccountScalarFieldEnum: {
    userId: 'userId';
    type: 'type';
    provider: 'provider';
    providerAccountId: 'providerAccountId';
    refresh_token: 'refresh_token';
    access_token: 'access_token';
    expires_at: 'expires_at';
    token_type: 'token_type';
    scope: 'scope';
    id_token: 'id_token';
    session_state: 'session_state';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };
  export type AccountScalarFieldEnum =
    (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
  export const SessionScalarFieldEnum: {
    sessionToken: 'sessionToken';
    userId: 'userId';
    expires: 'expires';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };
  export type SessionScalarFieldEnum =
    (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier';
    token: 'token';
    expires: 'expires';
  };
  export type VerificationTokenScalarFieldEnum =
    (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum];
  export const AuthenticatorScalarFieldEnum: {
    credentialID: 'credentialID';
    userId: 'userId';
    providerAccountId: 'providerAccountId';
    credentialPublicKey: 'credentialPublicKey';
    counter: 'counter';
    credentialDeviceType: 'credentialDeviceType';
    credentialBackedUp: 'credentialBackedUp';
    transports: 'transports';
  };
  export type AuthenticatorScalarFieldEnum =
    (typeof AuthenticatorScalarFieldEnum)[keyof typeof AuthenticatorScalarFieldEnum];
  export const GameScalarFieldEnum: {
    id: 'id';
    roomId: 'roomId';
    whiteUserId: 'whiteUserId';
    blackUserId: 'blackUserId';
    variant: 'variant';
    gameType: 'gameType';
    result: 'result';
    resultReason: 'resultReason';
    moves: 'moves';
    startingFen: 'startingFen';
    timeControl: 'timeControl';
    whitePregameRating: 'whitePregameRating';
    blackPregameRating: 'blackPregameRating';
    whiteRatingDelta: 'whiteRatingDelta';
    blackRatingDelta: 'blackRatingDelta';
    moveCount: 'moveCount';
    rated: 'rated';
    playedAt: 'playedAt';
    createdAt: 'createdAt';
  };
  export type GameScalarFieldEnum =
    (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum];
  export const GameAnalysisScalarFieldEnum: {
    id: 'id';
    gameId: 'gameId';
    userId: 'userId';
    results: 'results';
    createdAt: 'createdAt';
  };
  export type GameAnalysisScalarFieldEnum =
    (typeof GameAnalysisScalarFieldEnum)[keyof typeof GameAnalysisScalarFieldEnum];
  export const RatingScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    variant: 'variant';
    category: 'category';
    rating: 'rating';
    rd: 'rd';
    sigma: 'sigma';
    gameCount: 'gameCount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };
  export type RatingScalarFieldEnum =
    (typeof RatingScalarFieldEnum)[keyof typeof RatingScalarFieldEnum];
  export const PuzzleRatingScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    rating: 'rating';
    rd: 'rd';
    sigma: 'sigma';
    gameCount: 'gameCount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };
  export type PuzzleRatingScalarFieldEnum =
    (typeof PuzzleRatingScalarFieldEnum)[keyof typeof PuzzleRatingScalarFieldEnum];
  export const PuzzleAttemptScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    puzzleId: 'puzzleId';
    difficulty: 'difficulty';
    rating: 'rating';
    solved: 'solved';
    usedHint: 'usedHint';
    createdAt: 'createdAt';
  };
  export type PuzzleAttemptScalarFieldEnum =
    (typeof PuzzleAttemptScalarFieldEnum)[keyof typeof PuzzleAttemptScalarFieldEnum];
  export const PuzzleRushScoreScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    mode: 'mode';
    difficulty: 'difficulty';
    score: 'score';
    mistakes: 'mistakes';
    timeLimitSeconds: 'timeLimitSeconds';
    maxMistakes: 'maxMistakes';
    createdAt: 'createdAt';
  };
  export type PuzzleRushScoreScalarFieldEnum =
    (typeof PuzzleRushScoreScalarFieldEnum)[keyof typeof PuzzleRushScoreScalarFieldEnum];
  export const MemorySessionScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    mode: 'mode';
    pieceCount: 'pieceCount';
    memorizeTimeSeconds: 'memorizeTimeSeconds';
    correctPieces: 'correctPieces';
    totalPieces: 'totalPieces';
    accuracy: 'accuracy';
    progressiveLevel: 'progressiveLevel';
    createdAt: 'createdAt';
  };
  export type MemorySessionScalarFieldEnum =
    (typeof MemorySessionScalarFieldEnum)[keyof typeof MemorySessionScalarFieldEnum];
  export const VisionSessionScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    trainingMode: 'trainingMode';
    colorMode: 'colorMode';
    timeLimitSeconds: 'timeLimitSeconds';
    score: 'score';
    totalAttempts: 'totalAttempts';
    accuracy: 'accuracy';
    avgResponseTimeMs: 'avgResponseTimeMs';
    createdAt: 'createdAt';
  };
  export type VisionSessionScalarFieldEnum =
    (typeof VisionSessionScalarFieldEnum)[keyof typeof VisionSessionScalarFieldEnum];
  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };
  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull;
  };
  export type JsonNullValueInput =
    (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };
  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };
  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };
  export type JsonNullValueFilter =
    (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
  >;
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;
  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    name?: StringNullableFilter<'User'> | string | null;
    email?: StringFilter<'User'> | string;
    emailVerified?: DateTimeNullableFilter<'User'> | Date | string | null;
    image?: StringNullableFilter<'User'> | string | null;
    flagCode?: StringFilter<'User'> | string;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    updatedAt?: DateTimeFilter<'User'> | Date | string;
    accounts?: AccountListRelationFilter;
    sessions?: SessionListRelationFilter;
    Authenticator?: AuthenticatorListRelationFilter;
    whiteGames?: GameListRelationFilter;
    blackGames?: GameListRelationFilter;
    ratings?: RatingListRelationFilter;
    puzzleRating?: XOR<
      PuzzleRatingNullableScalarRelationFilter,
      PuzzleRatingWhereInput
    > | null;
    analyses?: GameAnalysisListRelationFilter;
    puzzleAttempts?: PuzzleAttemptListRelationFilter;
    puzzleRushScores?: PuzzleRushScoreListRelationFilter;
    memorySessions?: MemorySessionListRelationFilter;
    visionSessions?: VisionSessionListRelationFilter;
    passportFlags?: PassportFlagListRelationFilter;
  };
  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrderInput | SortOrder;
    image?: SortOrderInput | SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    accounts?: AccountOrderByRelationAggregateInput;
    sessions?: SessionOrderByRelationAggregateInput;
    Authenticator?: AuthenticatorOrderByRelationAggregateInput;
    whiteGames?: GameOrderByRelationAggregateInput;
    blackGames?: GameOrderByRelationAggregateInput;
    ratings?: RatingOrderByRelationAggregateInput;
    puzzleRating?: PuzzleRatingOrderByWithRelationInput;
    analyses?: GameAnalysisOrderByRelationAggregateInput;
    puzzleAttempts?: PuzzleAttemptOrderByRelationAggregateInput;
    puzzleRushScores?: PuzzleRushScoreOrderByRelationAggregateInput;
    memorySessions?: MemorySessionOrderByRelationAggregateInput;
    visionSessions?: VisionSessionOrderByRelationAggregateInput;
    passportFlags?: PassportFlagOrderByRelationAggregateInput;
  };
  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      name?: StringNullableFilter<'User'> | string | null;
      emailVerified?: DateTimeNullableFilter<'User'> | Date | string | null;
      image?: StringNullableFilter<'User'> | string | null;
      flagCode?: StringFilter<'User'> | string;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      accounts?: AccountListRelationFilter;
      sessions?: SessionListRelationFilter;
      Authenticator?: AuthenticatorListRelationFilter;
      whiteGames?: GameListRelationFilter;
      blackGames?: GameListRelationFilter;
      ratings?: RatingListRelationFilter;
      puzzleRating?: XOR<
        PuzzleRatingNullableScalarRelationFilter,
        PuzzleRatingWhereInput
      > | null;
      analyses?: GameAnalysisListRelationFilter;
      puzzleAttempts?: PuzzleAttemptListRelationFilter;
      puzzleRushScores?: PuzzleRushScoreListRelationFilter;
      memorySessions?: MemorySessionListRelationFilter;
      visionSessions?: VisionSessionListRelationFilter;
      passportFlags?: PassportFlagListRelationFilter;
    },
    'id' | 'email'
  >;
  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrderInput | SortOrder;
    image?: SortOrderInput | SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };
  export type UserScalarWhereWithAggregatesInput = {
    AND?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    name?: StringNullableWithAggregatesFilter<'User'> | string | null;
    email?: StringWithAggregatesFilter<'User'> | string;
    emailVerified?:
      | DateTimeNullableWithAggregatesFilter<'User'>
      | Date
      | string
      | null;
    image?: StringNullableWithAggregatesFilter<'User'> | string | null;
    flagCode?: StringWithAggregatesFilter<'User'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
  };
  export type PassportFlagWhereInput = {
    AND?: PassportFlagWhereInput | PassportFlagWhereInput[];
    OR?: PassportFlagWhereInput[];
    NOT?: PassportFlagWhereInput | PassportFlagWhereInput[];
    id?: StringFilter<'PassportFlag'> | string;
    userId?: StringFilter<'PassportFlag'> | string;
    flagCode?: StringFilter<'PassportFlag'> | string;
    createdAt?: DateTimeFilter<'PassportFlag'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type PassportFlagOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type PassportFlagWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_flagCode?: PassportFlagUserIdFlagCodeCompoundUniqueInput;
      AND?: PassportFlagWhereInput | PassportFlagWhereInput[];
      OR?: PassportFlagWhereInput[];
      NOT?: PassportFlagWhereInput | PassportFlagWhereInput[];
      userId?: StringFilter<'PassportFlag'> | string;
      flagCode?: StringFilter<'PassportFlag'> | string;
      createdAt?: DateTimeFilter<'PassportFlag'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId_flagCode'
  >;
  export type PassportFlagOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    _count?: PassportFlagCountOrderByAggregateInput;
    _max?: PassportFlagMaxOrderByAggregateInput;
    _min?: PassportFlagMinOrderByAggregateInput;
  };
  export type PassportFlagScalarWhereWithAggregatesInput = {
    AND?:
      | PassportFlagScalarWhereWithAggregatesInput
      | PassportFlagScalarWhereWithAggregatesInput[];
    OR?: PassportFlagScalarWhereWithAggregatesInput[];
    NOT?:
      | PassportFlagScalarWhereWithAggregatesInput
      | PassportFlagScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PassportFlag'> | string;
    userId?: StringWithAggregatesFilter<'PassportFlag'> | string;
    flagCode?: StringWithAggregatesFilter<'PassportFlag'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'PassportFlag'> | Date | string;
  };
  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[];
    OR?: AccountWhereInput[];
    NOT?: AccountWhereInput | AccountWhereInput[];
    userId?: StringFilter<'Account'> | string;
    type?: StringFilter<'Account'> | string;
    provider?: StringFilter<'Account'> | string;
    providerAccountId?: StringFilter<'Account'> | string;
    refresh_token?: StringNullableFilter<'Account'> | string | null;
    access_token?: StringNullableFilter<'Account'> | string | null;
    expires_at?: IntNullableFilter<'Account'> | number | null;
    token_type?: StringNullableFilter<'Account'> | string | null;
    scope?: StringNullableFilter<'Account'> | string | null;
    id_token?: StringNullableFilter<'Account'> | string | null;
    session_state?: StringNullableFilter<'Account'> | string | null;
    createdAt?: DateTimeFilter<'Account'> | Date | string;
    updatedAt?: DateTimeFilter<'Account'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type AccountOrderByWithRelationInput = {
    userId?: SortOrder;
    type?: SortOrder;
    provider?: SortOrder;
    providerAccountId?: SortOrder;
    refresh_token?: SortOrderInput | SortOrder;
    access_token?: SortOrderInput | SortOrder;
    expires_at?: SortOrderInput | SortOrder;
    token_type?: SortOrderInput | SortOrder;
    scope?: SortOrderInput | SortOrder;
    id_token?: SortOrderInput | SortOrder;
    session_state?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type AccountWhereUniqueInput = Prisma.AtLeast<
    {
      provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput;
      AND?: AccountWhereInput | AccountWhereInput[];
      OR?: AccountWhereInput[];
      NOT?: AccountWhereInput | AccountWhereInput[];
      userId?: StringFilter<'Account'> | string;
      type?: StringFilter<'Account'> | string;
      provider?: StringFilter<'Account'> | string;
      providerAccountId?: StringFilter<'Account'> | string;
      refresh_token?: StringNullableFilter<'Account'> | string | null;
      access_token?: StringNullableFilter<'Account'> | string | null;
      expires_at?: IntNullableFilter<'Account'> | number | null;
      token_type?: StringNullableFilter<'Account'> | string | null;
      scope?: StringNullableFilter<'Account'> | string | null;
      id_token?: StringNullableFilter<'Account'> | string | null;
      session_state?: StringNullableFilter<'Account'> | string | null;
      createdAt?: DateTimeFilter<'Account'> | Date | string;
      updatedAt?: DateTimeFilter<'Account'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'provider_providerAccountId'
  >;
  export type AccountOrderByWithAggregationInput = {
    userId?: SortOrder;
    type?: SortOrder;
    provider?: SortOrder;
    providerAccountId?: SortOrder;
    refresh_token?: SortOrderInput | SortOrder;
    access_token?: SortOrderInput | SortOrder;
    expires_at?: SortOrderInput | SortOrder;
    token_type?: SortOrderInput | SortOrder;
    scope?: SortOrderInput | SortOrder;
    id_token?: SortOrderInput | SortOrder;
    session_state?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AccountCountOrderByAggregateInput;
    _avg?: AccountAvgOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
    _sum?: AccountSumOrderByAggregateInput;
  };
  export type AccountScalarWhereWithAggregatesInput = {
    AND?:
      | AccountScalarWhereWithAggregatesInput
      | AccountScalarWhereWithAggregatesInput[];
    OR?: AccountScalarWhereWithAggregatesInput[];
    NOT?:
      | AccountScalarWhereWithAggregatesInput
      | AccountScalarWhereWithAggregatesInput[];
    userId?: StringWithAggregatesFilter<'Account'> | string;
    type?: StringWithAggregatesFilter<'Account'> | string;
    provider?: StringWithAggregatesFilter<'Account'> | string;
    providerAccountId?: StringWithAggregatesFilter<'Account'> | string;
    refresh_token?:
      | StringNullableWithAggregatesFilter<'Account'>
      | string
      | null;
    access_token?:
      | StringNullableWithAggregatesFilter<'Account'>
      | string
      | null;
    expires_at?: IntNullableWithAggregatesFilter<'Account'> | number | null;
    token_type?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    scope?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    id_token?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    session_state?:
      | StringNullableWithAggregatesFilter<'Account'>
      | string
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'Account'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Account'> | Date | string;
  };
  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[];
    OR?: SessionWhereInput[];
    NOT?: SessionWhereInput | SessionWhereInput[];
    sessionToken?: StringFilter<'Session'> | string;
    userId?: StringFilter<'Session'> | string;
    expires?: DateTimeFilter<'Session'> | Date | string;
    createdAt?: DateTimeFilter<'Session'> | Date | string;
    updatedAt?: DateTimeFilter<'Session'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type SessionOrderByWithRelationInput = {
    sessionToken?: SortOrder;
    userId?: SortOrder;
    expires?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type SessionWhereUniqueInput = Prisma.AtLeast<
    {
      sessionToken?: string;
      AND?: SessionWhereInput | SessionWhereInput[];
      OR?: SessionWhereInput[];
      NOT?: SessionWhereInput | SessionWhereInput[];
      userId?: StringFilter<'Session'> | string;
      expires?: DateTimeFilter<'Session'> | Date | string;
      createdAt?: DateTimeFilter<'Session'> | Date | string;
      updatedAt?: DateTimeFilter<'Session'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'sessionToken'
  >;
  export type SessionOrderByWithAggregationInput = {
    sessionToken?: SortOrder;
    userId?: SortOrder;
    expires?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: SessionCountOrderByAggregateInput;
    _max?: SessionMaxOrderByAggregateInput;
    _min?: SessionMinOrderByAggregateInput;
  };
  export type SessionScalarWhereWithAggregatesInput = {
    AND?:
      | SessionScalarWhereWithAggregatesInput
      | SessionScalarWhereWithAggregatesInput[];
    OR?: SessionScalarWhereWithAggregatesInput[];
    NOT?:
      | SessionScalarWhereWithAggregatesInput
      | SessionScalarWhereWithAggregatesInput[];
    sessionToken?: StringWithAggregatesFilter<'Session'> | string;
    userId?: StringWithAggregatesFilter<'Session'> | string;
    expires?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    createdAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
  };
  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
    OR?: VerificationTokenWhereInput[];
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
    identifier?: StringFilter<'VerificationToken'> | string;
    token?: StringFilter<'VerificationToken'> | string;
    expires?: DateTimeFilter<'VerificationToken'> | Date | string;
  };
  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder;
    token?: SortOrder;
    expires?: SortOrder;
  };
  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<
    {
      identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput;
      AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
      OR?: VerificationTokenWhereInput[];
      NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[];
      identifier?: StringFilter<'VerificationToken'> | string;
      token?: StringFilter<'VerificationToken'> | string;
      expires?: DateTimeFilter<'VerificationToken'> | Date | string;
    },
    'identifier_token'
  >;
  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder;
    token?: SortOrder;
    expires?: SortOrder;
    _count?: VerificationTokenCountOrderByAggregateInput;
    _max?: VerificationTokenMaxOrderByAggregateInput;
    _min?: VerificationTokenMinOrderByAggregateInput;
  };
  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?:
      | VerificationTokenScalarWhereWithAggregatesInput
      | VerificationTokenScalarWhereWithAggregatesInput[];
    OR?: VerificationTokenScalarWhereWithAggregatesInput[];
    NOT?:
      | VerificationTokenScalarWhereWithAggregatesInput
      | VerificationTokenScalarWhereWithAggregatesInput[];
    identifier?: StringWithAggregatesFilter<'VerificationToken'> | string;
    token?: StringWithAggregatesFilter<'VerificationToken'> | string;
    expires?: DateTimeWithAggregatesFilter<'VerificationToken'> | Date | string;
  };
  export type AuthenticatorWhereInput = {
    AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[];
    OR?: AuthenticatorWhereInput[];
    NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[];
    credentialID?: StringFilter<'Authenticator'> | string;
    userId?: StringFilter<'Authenticator'> | string;
    providerAccountId?: StringFilter<'Authenticator'> | string;
    credentialPublicKey?: StringFilter<'Authenticator'> | string;
    counter?: IntFilter<'Authenticator'> | number;
    credentialDeviceType?: StringFilter<'Authenticator'> | string;
    credentialBackedUp?: BoolFilter<'Authenticator'> | boolean;
    transports?: StringNullableFilter<'Authenticator'> | string | null;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type AuthenticatorOrderByWithRelationInput = {
    credentialID?: SortOrder;
    userId?: SortOrder;
    providerAccountId?: SortOrder;
    credentialPublicKey?: SortOrder;
    counter?: SortOrder;
    credentialDeviceType?: SortOrder;
    credentialBackedUp?: SortOrder;
    transports?: SortOrderInput | SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type AuthenticatorWhereUniqueInput = Prisma.AtLeast<
    {
      credentialID?: string;
      userId_credentialID?: AuthenticatorUserIdCredentialIDCompoundUniqueInput;
      AND?: AuthenticatorWhereInput | AuthenticatorWhereInput[];
      OR?: AuthenticatorWhereInput[];
      NOT?: AuthenticatorWhereInput | AuthenticatorWhereInput[];
      userId?: StringFilter<'Authenticator'> | string;
      providerAccountId?: StringFilter<'Authenticator'> | string;
      credentialPublicKey?: StringFilter<'Authenticator'> | string;
      counter?: IntFilter<'Authenticator'> | number;
      credentialDeviceType?: StringFilter<'Authenticator'> | string;
      credentialBackedUp?: BoolFilter<'Authenticator'> | boolean;
      transports?: StringNullableFilter<'Authenticator'> | string | null;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'userId_credentialID' | 'credentialID'
  >;
  export type AuthenticatorOrderByWithAggregationInput = {
    credentialID?: SortOrder;
    userId?: SortOrder;
    providerAccountId?: SortOrder;
    credentialPublicKey?: SortOrder;
    counter?: SortOrder;
    credentialDeviceType?: SortOrder;
    credentialBackedUp?: SortOrder;
    transports?: SortOrderInput | SortOrder;
    _count?: AuthenticatorCountOrderByAggregateInput;
    _avg?: AuthenticatorAvgOrderByAggregateInput;
    _max?: AuthenticatorMaxOrderByAggregateInput;
    _min?: AuthenticatorMinOrderByAggregateInput;
    _sum?: AuthenticatorSumOrderByAggregateInput;
  };
  export type AuthenticatorScalarWhereWithAggregatesInput = {
    AND?:
      | AuthenticatorScalarWhereWithAggregatesInput
      | AuthenticatorScalarWhereWithAggregatesInput[];
    OR?: AuthenticatorScalarWhereWithAggregatesInput[];
    NOT?:
      | AuthenticatorScalarWhereWithAggregatesInput
      | AuthenticatorScalarWhereWithAggregatesInput[];
    credentialID?: StringWithAggregatesFilter<'Authenticator'> | string;
    userId?: StringWithAggregatesFilter<'Authenticator'> | string;
    providerAccountId?: StringWithAggregatesFilter<'Authenticator'> | string;
    credentialPublicKey?: StringWithAggregatesFilter<'Authenticator'> | string;
    counter?: IntWithAggregatesFilter<'Authenticator'> | number;
    credentialDeviceType?: StringWithAggregatesFilter<'Authenticator'> | string;
    credentialBackedUp?: BoolWithAggregatesFilter<'Authenticator'> | boolean;
    transports?:
      | StringNullableWithAggregatesFilter<'Authenticator'>
      | string
      | null;
  };
  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[];
    OR?: GameWhereInput[];
    NOT?: GameWhereInput | GameWhereInput[];
    id?: StringFilter<'Game'> | string;
    roomId?: StringNullableFilter<'Game'> | string | null;
    whiteUserId?: StringNullableFilter<'Game'> | string | null;
    blackUserId?: StringNullableFilter<'Game'> | string | null;
    variant?: StringFilter<'Game'> | string;
    gameType?: StringFilter<'Game'> | string;
    result?: StringFilter<'Game'> | string;
    resultReason?: StringFilter<'Game'> | string;
    moves?: StringNullableListFilter<'Game'>;
    startingFen?: StringFilter<'Game'> | string;
    timeControl?: JsonFilter<'Game'>;
    whitePregameRating?: IntNullableFilter<'Game'> | number | null;
    blackPregameRating?: IntNullableFilter<'Game'> | number | null;
    whiteRatingDelta?: IntNullableFilter<'Game'> | number | null;
    blackRatingDelta?: IntNullableFilter<'Game'> | number | null;
    moveCount?: IntFilter<'Game'> | number;
    rated?: BoolFilter<'Game'> | boolean;
    playedAt?: DateTimeNullableFilter<'Game'> | Date | string | null;
    createdAt?: DateTimeFilter<'Game'> | Date | string;
    white?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
    black?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
    analysis?: XOR<
      GameAnalysisNullableScalarRelationFilter,
      GameAnalysisWhereInput
    > | null;
  };
  export type GameOrderByWithRelationInput = {
    id?: SortOrder;
    roomId?: SortOrderInput | SortOrder;
    whiteUserId?: SortOrderInput | SortOrder;
    blackUserId?: SortOrderInput | SortOrder;
    variant?: SortOrder;
    gameType?: SortOrder;
    result?: SortOrder;
    resultReason?: SortOrder;
    moves?: SortOrder;
    startingFen?: SortOrder;
    timeControl?: SortOrder;
    whitePregameRating?: SortOrderInput | SortOrder;
    blackPregameRating?: SortOrderInput | SortOrder;
    whiteRatingDelta?: SortOrderInput | SortOrder;
    blackRatingDelta?: SortOrderInput | SortOrder;
    moveCount?: SortOrder;
    rated?: SortOrder;
    playedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    white?: UserOrderByWithRelationInput;
    black?: UserOrderByWithRelationInput;
    analysis?: GameAnalysisOrderByWithRelationInput;
  };
  export type GameWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      roomId?: string;
      AND?: GameWhereInput | GameWhereInput[];
      OR?: GameWhereInput[];
      NOT?: GameWhereInput | GameWhereInput[];
      whiteUserId?: StringNullableFilter<'Game'> | string | null;
      blackUserId?: StringNullableFilter<'Game'> | string | null;
      variant?: StringFilter<'Game'> | string;
      gameType?: StringFilter<'Game'> | string;
      result?: StringFilter<'Game'> | string;
      resultReason?: StringFilter<'Game'> | string;
      moves?: StringNullableListFilter<'Game'>;
      startingFen?: StringFilter<'Game'> | string;
      timeControl?: JsonFilter<'Game'>;
      whitePregameRating?: IntNullableFilter<'Game'> | number | null;
      blackPregameRating?: IntNullableFilter<'Game'> | number | null;
      whiteRatingDelta?: IntNullableFilter<'Game'> | number | null;
      blackRatingDelta?: IntNullableFilter<'Game'> | number | null;
      moveCount?: IntFilter<'Game'> | number;
      rated?: BoolFilter<'Game'> | boolean;
      playedAt?: DateTimeNullableFilter<'Game'> | Date | string | null;
      createdAt?: DateTimeFilter<'Game'> | Date | string;
      white?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
      black?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
      analysis?: XOR<
        GameAnalysisNullableScalarRelationFilter,
        GameAnalysisWhereInput
      > | null;
    },
    'id' | 'roomId'
  >;
  export type GameOrderByWithAggregationInput = {
    id?: SortOrder;
    roomId?: SortOrderInput | SortOrder;
    whiteUserId?: SortOrderInput | SortOrder;
    blackUserId?: SortOrderInput | SortOrder;
    variant?: SortOrder;
    gameType?: SortOrder;
    result?: SortOrder;
    resultReason?: SortOrder;
    moves?: SortOrder;
    startingFen?: SortOrder;
    timeControl?: SortOrder;
    whitePregameRating?: SortOrderInput | SortOrder;
    blackPregameRating?: SortOrderInput | SortOrder;
    whiteRatingDelta?: SortOrderInput | SortOrder;
    blackRatingDelta?: SortOrderInput | SortOrder;
    moveCount?: SortOrder;
    rated?: SortOrder;
    playedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: GameCountOrderByAggregateInput;
    _avg?: GameAvgOrderByAggregateInput;
    _max?: GameMaxOrderByAggregateInput;
    _min?: GameMinOrderByAggregateInput;
    _sum?: GameSumOrderByAggregateInput;
  };
  export type GameScalarWhereWithAggregatesInput = {
    AND?:
      | GameScalarWhereWithAggregatesInput
      | GameScalarWhereWithAggregatesInput[];
    OR?: GameScalarWhereWithAggregatesInput[];
    NOT?:
      | GameScalarWhereWithAggregatesInput
      | GameScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Game'> | string;
    roomId?: StringNullableWithAggregatesFilter<'Game'> | string | null;
    whiteUserId?: StringNullableWithAggregatesFilter<'Game'> | string | null;
    blackUserId?: StringNullableWithAggregatesFilter<'Game'> | string | null;
    variant?: StringWithAggregatesFilter<'Game'> | string;
    gameType?: StringWithAggregatesFilter<'Game'> | string;
    result?: StringWithAggregatesFilter<'Game'> | string;
    resultReason?: StringWithAggregatesFilter<'Game'> | string;
    moves?: StringNullableListFilter<'Game'>;
    startingFen?: StringWithAggregatesFilter<'Game'> | string;
    timeControl?: JsonWithAggregatesFilter<'Game'>;
    whitePregameRating?:
      | IntNullableWithAggregatesFilter<'Game'>
      | number
      | null;
    blackPregameRating?:
      | IntNullableWithAggregatesFilter<'Game'>
      | number
      | null;
    whiteRatingDelta?: IntNullableWithAggregatesFilter<'Game'> | number | null;
    blackRatingDelta?: IntNullableWithAggregatesFilter<'Game'> | number | null;
    moveCount?: IntWithAggregatesFilter<'Game'> | number;
    rated?: BoolWithAggregatesFilter<'Game'> | boolean;
    playedAt?:
      | DateTimeNullableWithAggregatesFilter<'Game'>
      | Date
      | string
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'Game'> | Date | string;
  };
  export type GameAnalysisWhereInput = {
    AND?: GameAnalysisWhereInput | GameAnalysisWhereInput[];
    OR?: GameAnalysisWhereInput[];
    NOT?: GameAnalysisWhereInput | GameAnalysisWhereInput[];
    id?: StringFilter<'GameAnalysis'> | string;
    gameId?: StringFilter<'GameAnalysis'> | string;
    userId?: StringFilter<'GameAnalysis'> | string;
    results?: JsonFilter<'GameAnalysis'>;
    createdAt?: DateTimeFilter<'GameAnalysis'> | Date | string;
    game?: XOR<GameScalarRelationFilter, GameWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type GameAnalysisOrderByWithRelationInput = {
    id?: SortOrder;
    gameId?: SortOrder;
    userId?: SortOrder;
    results?: SortOrder;
    createdAt?: SortOrder;
    game?: GameOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };
  export type GameAnalysisWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      gameId?: string;
      AND?: GameAnalysisWhereInput | GameAnalysisWhereInput[];
      OR?: GameAnalysisWhereInput[];
      NOT?: GameAnalysisWhereInput | GameAnalysisWhereInput[];
      userId?: StringFilter<'GameAnalysis'> | string;
      results?: JsonFilter<'GameAnalysis'>;
      createdAt?: DateTimeFilter<'GameAnalysis'> | Date | string;
      game?: XOR<GameScalarRelationFilter, GameWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'gameId'
  >;
  export type GameAnalysisOrderByWithAggregationInput = {
    id?: SortOrder;
    gameId?: SortOrder;
    userId?: SortOrder;
    results?: SortOrder;
    createdAt?: SortOrder;
    _count?: GameAnalysisCountOrderByAggregateInput;
    _max?: GameAnalysisMaxOrderByAggregateInput;
    _min?: GameAnalysisMinOrderByAggregateInput;
  };
  export type GameAnalysisScalarWhereWithAggregatesInput = {
    AND?:
      | GameAnalysisScalarWhereWithAggregatesInput
      | GameAnalysisScalarWhereWithAggregatesInput[];
    OR?: GameAnalysisScalarWhereWithAggregatesInput[];
    NOT?:
      | GameAnalysisScalarWhereWithAggregatesInput
      | GameAnalysisScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'GameAnalysis'> | string;
    gameId?: StringWithAggregatesFilter<'GameAnalysis'> | string;
    userId?: StringWithAggregatesFilter<'GameAnalysis'> | string;
    results?: JsonWithAggregatesFilter<'GameAnalysis'>;
    createdAt?: DateTimeWithAggregatesFilter<'GameAnalysis'> | Date | string;
  };
  export type RatingWhereInput = {
    AND?: RatingWhereInput | RatingWhereInput[];
    OR?: RatingWhereInput[];
    NOT?: RatingWhereInput | RatingWhereInput[];
    id?: StringFilter<'Rating'> | string;
    userId?: StringFilter<'Rating'> | string;
    variant?: StringFilter<'Rating'> | string;
    category?: StringFilter<'Rating'> | string;
    rating?: IntFilter<'Rating'> | number;
    rd?: FloatFilter<'Rating'> | number;
    sigma?: FloatFilter<'Rating'> | number;
    gameCount?: IntFilter<'Rating'> | number;
    createdAt?: DateTimeFilter<'Rating'> | Date | string;
    updatedAt?: DateTimeFilter<'Rating'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type RatingOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    variant?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type RatingWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_variant_category?: RatingUserIdVariantCategoryCompoundUniqueInput;
      AND?: RatingWhereInput | RatingWhereInput[];
      OR?: RatingWhereInput[];
      NOT?: RatingWhereInput | RatingWhereInput[];
      userId?: StringFilter<'Rating'> | string;
      variant?: StringFilter<'Rating'> | string;
      category?: StringFilter<'Rating'> | string;
      rating?: IntFilter<'Rating'> | number;
      rd?: FloatFilter<'Rating'> | number;
      sigma?: FloatFilter<'Rating'> | number;
      gameCount?: IntFilter<'Rating'> | number;
      createdAt?: DateTimeFilter<'Rating'> | Date | string;
      updatedAt?: DateTimeFilter<'Rating'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId_variant_category'
  >;
  export type RatingOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    variant?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: RatingCountOrderByAggregateInput;
    _avg?: RatingAvgOrderByAggregateInput;
    _max?: RatingMaxOrderByAggregateInput;
    _min?: RatingMinOrderByAggregateInput;
    _sum?: RatingSumOrderByAggregateInput;
  };
  export type RatingScalarWhereWithAggregatesInput = {
    AND?:
      | RatingScalarWhereWithAggregatesInput
      | RatingScalarWhereWithAggregatesInput[];
    OR?: RatingScalarWhereWithAggregatesInput[];
    NOT?:
      | RatingScalarWhereWithAggregatesInput
      | RatingScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Rating'> | string;
    userId?: StringWithAggregatesFilter<'Rating'> | string;
    variant?: StringWithAggregatesFilter<'Rating'> | string;
    category?: StringWithAggregatesFilter<'Rating'> | string;
    rating?: IntWithAggregatesFilter<'Rating'> | number;
    rd?: FloatWithAggregatesFilter<'Rating'> | number;
    sigma?: FloatWithAggregatesFilter<'Rating'> | number;
    gameCount?: IntWithAggregatesFilter<'Rating'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'Rating'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Rating'> | Date | string;
  };
  export type PuzzleRatingWhereInput = {
    AND?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[];
    OR?: PuzzleRatingWhereInput[];
    NOT?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[];
    id?: StringFilter<'PuzzleRating'> | string;
    userId?: StringFilter<'PuzzleRating'> | string;
    rating?: IntFilter<'PuzzleRating'> | number;
    rd?: FloatFilter<'PuzzleRating'> | number;
    sigma?: FloatFilter<'PuzzleRating'> | number;
    gameCount?: IntFilter<'PuzzleRating'> | number;
    createdAt?: DateTimeFilter<'PuzzleRating'> | Date | string;
    updatedAt?: DateTimeFilter<'PuzzleRating'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type PuzzleRatingOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type PuzzleRatingWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId?: string;
      AND?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[];
      OR?: PuzzleRatingWhereInput[];
      NOT?: PuzzleRatingWhereInput | PuzzleRatingWhereInput[];
      rating?: IntFilter<'PuzzleRating'> | number;
      rd?: FloatFilter<'PuzzleRating'> | number;
      sigma?: FloatFilter<'PuzzleRating'> | number;
      gameCount?: IntFilter<'PuzzleRating'> | number;
      createdAt?: DateTimeFilter<'PuzzleRating'> | Date | string;
      updatedAt?: DateTimeFilter<'PuzzleRating'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId'
  >;
  export type PuzzleRatingOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: PuzzleRatingCountOrderByAggregateInput;
    _avg?: PuzzleRatingAvgOrderByAggregateInput;
    _max?: PuzzleRatingMaxOrderByAggregateInput;
    _min?: PuzzleRatingMinOrderByAggregateInput;
    _sum?: PuzzleRatingSumOrderByAggregateInput;
  };
  export type PuzzleRatingScalarWhereWithAggregatesInput = {
    AND?:
      | PuzzleRatingScalarWhereWithAggregatesInput
      | PuzzleRatingScalarWhereWithAggregatesInput[];
    OR?: PuzzleRatingScalarWhereWithAggregatesInput[];
    NOT?:
      | PuzzleRatingScalarWhereWithAggregatesInput
      | PuzzleRatingScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PuzzleRating'> | string;
    userId?: StringWithAggregatesFilter<'PuzzleRating'> | string;
    rating?: IntWithAggregatesFilter<'PuzzleRating'> | number;
    rd?: FloatWithAggregatesFilter<'PuzzleRating'> | number;
    sigma?: FloatWithAggregatesFilter<'PuzzleRating'> | number;
    gameCount?: IntWithAggregatesFilter<'PuzzleRating'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'PuzzleRating'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'PuzzleRating'> | Date | string;
  };
  export type PuzzleAttemptWhereInput = {
    AND?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[];
    OR?: PuzzleAttemptWhereInput[];
    NOT?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[];
    id?: StringFilter<'PuzzleAttempt'> | string;
    userId?: StringFilter<'PuzzleAttempt'> | string;
    puzzleId?: StringFilter<'PuzzleAttempt'> | string;
    difficulty?: StringFilter<'PuzzleAttempt'> | string;
    rating?: IntFilter<'PuzzleAttempt'> | number;
    solved?: BoolFilter<'PuzzleAttempt'> | boolean;
    usedHint?: BoolFilter<'PuzzleAttempt'> | boolean;
    createdAt?: DateTimeFilter<'PuzzleAttempt'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type PuzzleAttemptOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    puzzleId?: SortOrder;
    difficulty?: SortOrder;
    rating?: SortOrder;
    solved?: SortOrder;
    usedHint?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type PuzzleAttemptWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[];
      OR?: PuzzleAttemptWhereInput[];
      NOT?: PuzzleAttemptWhereInput | PuzzleAttemptWhereInput[];
      userId?: StringFilter<'PuzzleAttempt'> | string;
      puzzleId?: StringFilter<'PuzzleAttempt'> | string;
      difficulty?: StringFilter<'PuzzleAttempt'> | string;
      rating?: IntFilter<'PuzzleAttempt'> | number;
      solved?: BoolFilter<'PuzzleAttempt'> | boolean;
      usedHint?: BoolFilter<'PuzzleAttempt'> | boolean;
      createdAt?: DateTimeFilter<'PuzzleAttempt'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;
  export type PuzzleAttemptOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    puzzleId?: SortOrder;
    difficulty?: SortOrder;
    rating?: SortOrder;
    solved?: SortOrder;
    usedHint?: SortOrder;
    createdAt?: SortOrder;
    _count?: PuzzleAttemptCountOrderByAggregateInput;
    _avg?: PuzzleAttemptAvgOrderByAggregateInput;
    _max?: PuzzleAttemptMaxOrderByAggregateInput;
    _min?: PuzzleAttemptMinOrderByAggregateInput;
    _sum?: PuzzleAttemptSumOrderByAggregateInput;
  };
  export type PuzzleAttemptScalarWhereWithAggregatesInput = {
    AND?:
      | PuzzleAttemptScalarWhereWithAggregatesInput
      | PuzzleAttemptScalarWhereWithAggregatesInput[];
    OR?: PuzzleAttemptScalarWhereWithAggregatesInput[];
    NOT?:
      | PuzzleAttemptScalarWhereWithAggregatesInput
      | PuzzleAttemptScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PuzzleAttempt'> | string;
    userId?: StringWithAggregatesFilter<'PuzzleAttempt'> | string;
    puzzleId?: StringWithAggregatesFilter<'PuzzleAttempt'> | string;
    difficulty?: StringWithAggregatesFilter<'PuzzleAttempt'> | string;
    rating?: IntWithAggregatesFilter<'PuzzleAttempt'> | number;
    solved?: BoolWithAggregatesFilter<'PuzzleAttempt'> | boolean;
    usedHint?: BoolWithAggregatesFilter<'PuzzleAttempt'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'PuzzleAttempt'> | Date | string;
  };
  export type PuzzleRushScoreWhereInput = {
    AND?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[];
    OR?: PuzzleRushScoreWhereInput[];
    NOT?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[];
    id?: StringFilter<'PuzzleRushScore'> | string;
    userId?: StringFilter<'PuzzleRushScore'> | string;
    mode?: StringFilter<'PuzzleRushScore'> | string;
    difficulty?: StringFilter<'PuzzleRushScore'> | string;
    score?: IntFilter<'PuzzleRushScore'> | number;
    mistakes?: IntFilter<'PuzzleRushScore'> | number;
    timeLimitSeconds?: IntNullableFilter<'PuzzleRushScore'> | number | null;
    maxMistakes?: IntNullableFilter<'PuzzleRushScore'> | number | null;
    createdAt?: DateTimeFilter<'PuzzleRushScore'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type PuzzleRushScoreOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    difficulty?: SortOrder;
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrderInput | SortOrder;
    maxMistakes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type PuzzleRushScoreWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[];
      OR?: PuzzleRushScoreWhereInput[];
      NOT?: PuzzleRushScoreWhereInput | PuzzleRushScoreWhereInput[];
      userId?: StringFilter<'PuzzleRushScore'> | string;
      mode?: StringFilter<'PuzzleRushScore'> | string;
      difficulty?: StringFilter<'PuzzleRushScore'> | string;
      score?: IntFilter<'PuzzleRushScore'> | number;
      mistakes?: IntFilter<'PuzzleRushScore'> | number;
      timeLimitSeconds?: IntNullableFilter<'PuzzleRushScore'> | number | null;
      maxMistakes?: IntNullableFilter<'PuzzleRushScore'> | number | null;
      createdAt?: DateTimeFilter<'PuzzleRushScore'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;
  export type PuzzleRushScoreOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    difficulty?: SortOrder;
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrderInput | SortOrder;
    maxMistakes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: PuzzleRushScoreCountOrderByAggregateInput;
    _avg?: PuzzleRushScoreAvgOrderByAggregateInput;
    _max?: PuzzleRushScoreMaxOrderByAggregateInput;
    _min?: PuzzleRushScoreMinOrderByAggregateInput;
    _sum?: PuzzleRushScoreSumOrderByAggregateInput;
  };
  export type PuzzleRushScoreScalarWhereWithAggregatesInput = {
    AND?:
      | PuzzleRushScoreScalarWhereWithAggregatesInput
      | PuzzleRushScoreScalarWhereWithAggregatesInput[];
    OR?: PuzzleRushScoreScalarWhereWithAggregatesInput[];
    NOT?:
      | PuzzleRushScoreScalarWhereWithAggregatesInput
      | PuzzleRushScoreScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PuzzleRushScore'> | string;
    userId?: StringWithAggregatesFilter<'PuzzleRushScore'> | string;
    mode?: StringWithAggregatesFilter<'PuzzleRushScore'> | string;
    difficulty?: StringWithAggregatesFilter<'PuzzleRushScore'> | string;
    score?: IntWithAggregatesFilter<'PuzzleRushScore'> | number;
    mistakes?: IntWithAggregatesFilter<'PuzzleRushScore'> | number;
    timeLimitSeconds?:
      | IntNullableWithAggregatesFilter<'PuzzleRushScore'>
      | number
      | null;
    maxMistakes?:
      | IntNullableWithAggregatesFilter<'PuzzleRushScore'>
      | number
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'PuzzleRushScore'> | Date | string;
  };
  export type MemorySessionWhereInput = {
    AND?: MemorySessionWhereInput | MemorySessionWhereInput[];
    OR?: MemorySessionWhereInput[];
    NOT?: MemorySessionWhereInput | MemorySessionWhereInput[];
    id?: StringFilter<'MemorySession'> | string;
    userId?: StringFilter<'MemorySession'> | string;
    mode?: StringFilter<'MemorySession'> | string;
    pieceCount?: IntFilter<'MemorySession'> | number;
    memorizeTimeSeconds?: IntFilter<'MemorySession'> | number;
    correctPieces?: IntFilter<'MemorySession'> | number;
    totalPieces?: IntFilter<'MemorySession'> | number;
    accuracy?: FloatFilter<'MemorySession'> | number;
    progressiveLevel?: IntNullableFilter<'MemorySession'> | number | null;
    createdAt?: DateTimeFilter<'MemorySession'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type MemorySessionOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type MemorySessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MemorySessionWhereInput | MemorySessionWhereInput[];
      OR?: MemorySessionWhereInput[];
      NOT?: MemorySessionWhereInput | MemorySessionWhereInput[];
      userId?: StringFilter<'MemorySession'> | string;
      mode?: StringFilter<'MemorySession'> | string;
      pieceCount?: IntFilter<'MemorySession'> | number;
      memorizeTimeSeconds?: IntFilter<'MemorySession'> | number;
      correctPieces?: IntFilter<'MemorySession'> | number;
      totalPieces?: IntFilter<'MemorySession'> | number;
      accuracy?: FloatFilter<'MemorySession'> | number;
      progressiveLevel?: IntNullableFilter<'MemorySession'> | number | null;
      createdAt?: DateTimeFilter<'MemorySession'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;
  export type MemorySessionOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: MemorySessionCountOrderByAggregateInput;
    _avg?: MemorySessionAvgOrderByAggregateInput;
    _max?: MemorySessionMaxOrderByAggregateInput;
    _min?: MemorySessionMinOrderByAggregateInput;
    _sum?: MemorySessionSumOrderByAggregateInput;
  };
  export type MemorySessionScalarWhereWithAggregatesInput = {
    AND?:
      | MemorySessionScalarWhereWithAggregatesInput
      | MemorySessionScalarWhereWithAggregatesInput[];
    OR?: MemorySessionScalarWhereWithAggregatesInput[];
    NOT?:
      | MemorySessionScalarWhereWithAggregatesInput
      | MemorySessionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'MemorySession'> | string;
    userId?: StringWithAggregatesFilter<'MemorySession'> | string;
    mode?: StringWithAggregatesFilter<'MemorySession'> | string;
    pieceCount?: IntWithAggregatesFilter<'MemorySession'> | number;
    memorizeTimeSeconds?: IntWithAggregatesFilter<'MemorySession'> | number;
    correctPieces?: IntWithAggregatesFilter<'MemorySession'> | number;
    totalPieces?: IntWithAggregatesFilter<'MemorySession'> | number;
    accuracy?: FloatWithAggregatesFilter<'MemorySession'> | number;
    progressiveLevel?:
      | IntNullableWithAggregatesFilter<'MemorySession'>
      | number
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'MemorySession'> | Date | string;
  };
  export type VisionSessionWhereInput = {
    AND?: VisionSessionWhereInput | VisionSessionWhereInput[];
    OR?: VisionSessionWhereInput[];
    NOT?: VisionSessionWhereInput | VisionSessionWhereInput[];
    id?: StringFilter<'VisionSession'> | string;
    userId?: StringFilter<'VisionSession'> | string;
    trainingMode?: StringFilter<'VisionSession'> | string;
    colorMode?: StringFilter<'VisionSession'> | string;
    timeLimitSeconds?: IntFilter<'VisionSession'> | number;
    score?: IntFilter<'VisionSession'> | number;
    totalAttempts?: IntFilter<'VisionSession'> | number;
    accuracy?: FloatFilter<'VisionSession'> | number;
    avgResponseTimeMs?: IntFilter<'VisionSession'> | number;
    createdAt?: DateTimeFilter<'VisionSession'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };
  export type VisionSessionOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    trainingMode?: SortOrder;
    colorMode?: SortOrder;
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };
  export type VisionSessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: VisionSessionWhereInput | VisionSessionWhereInput[];
      OR?: VisionSessionWhereInput[];
      NOT?: VisionSessionWhereInput | VisionSessionWhereInput[];
      userId?: StringFilter<'VisionSession'> | string;
      trainingMode?: StringFilter<'VisionSession'> | string;
      colorMode?: StringFilter<'VisionSession'> | string;
      timeLimitSeconds?: IntFilter<'VisionSession'> | number;
      score?: IntFilter<'VisionSession'> | number;
      totalAttempts?: IntFilter<'VisionSession'> | number;
      accuracy?: FloatFilter<'VisionSession'> | number;
      avgResponseTimeMs?: IntFilter<'VisionSession'> | number;
      createdAt?: DateTimeFilter<'VisionSession'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;
  export type VisionSessionOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    trainingMode?: SortOrder;
    colorMode?: SortOrder;
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
    createdAt?: SortOrder;
    _count?: VisionSessionCountOrderByAggregateInput;
    _avg?: VisionSessionAvgOrderByAggregateInput;
    _max?: VisionSessionMaxOrderByAggregateInput;
    _min?: VisionSessionMinOrderByAggregateInput;
    _sum?: VisionSessionSumOrderByAggregateInput;
  };
  export type VisionSessionScalarWhereWithAggregatesInput = {
    AND?:
      | VisionSessionScalarWhereWithAggregatesInput
      | VisionSessionScalarWhereWithAggregatesInput[];
    OR?: VisionSessionScalarWhereWithAggregatesInput[];
    NOT?:
      | VisionSessionScalarWhereWithAggregatesInput
      | VisionSessionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'VisionSession'> | string;
    userId?: StringWithAggregatesFilter<'VisionSession'> | string;
    trainingMode?: StringWithAggregatesFilter<'VisionSession'> | string;
    colorMode?: StringWithAggregatesFilter<'VisionSession'> | string;
    timeLimitSeconds?: IntWithAggregatesFilter<'VisionSession'> | number;
    score?: IntWithAggregatesFilter<'VisionSession'> | number;
    totalAttempts?: IntWithAggregatesFilter<'VisionSession'> | number;
    accuracy?: FloatWithAggregatesFilter<'VisionSession'> | number;
    avgResponseTimeMs?: IntWithAggregatesFilter<'VisionSession'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'VisionSession'> | Date | string;
  };
  export type UserCreateInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateManyInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagCreateInput = {
    id?: string;
    flagCode: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutPassportFlagsInput;
  };
  export type PassportFlagUncheckedCreateInput = {
    id?: string;
    userId: string;
    flagCode: string;
    createdAt?: Date | string;
  };
  export type PassportFlagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutPassportFlagsNestedInput;
  };
  export type PassportFlagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagCreateManyInput = {
    id?: string;
    userId: string;
    flagCode: string;
    createdAt?: Date | string;
  };
  export type PassportFlagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AccountCreateInput = {
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutAccountsInput;
  };
  export type AccountUncheckedCreateInput = {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type AccountUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput;
  };
  export type AccountUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AccountCreateManyInput = {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type AccountUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AccountUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string;
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionCreateInput = {
    sessionToken: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutSessionsInput;
  };
  export type SessionUncheckedCreateInput = {
    sessionToken: string;
    userId: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type SessionUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput;
  };
  export type SessionUncheckedUpdateInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionCreateManyInput = {
    sessionToken: string;
    userId: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type SessionUpdateManyMutationInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionUncheckedUpdateManyInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VerificationTokenCreateInput = {
    identifier: string;
    token: string;
    expires: Date | string;
  };
  export type VerificationTokenUncheckedCreateInput = {
    identifier: string;
    token: string;
    expires: Date | string;
  };
  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VerificationTokenCreateManyInput = {
    identifier: string;
    token: string;
    expires: Date | string;
  };
  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AuthenticatorCreateInput = {
    credentialID: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
    user: UserCreateNestedOneWithoutAuthenticatorInput;
  };
  export type AuthenticatorUncheckedCreateInput = {
    credentialID: string;
    userId: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
  };
  export type AuthenticatorUpdateInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
    user?: UserUpdateOneRequiredWithoutAuthenticatorNestedInput;
  };
  export type AuthenticatorUncheckedUpdateInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type AuthenticatorCreateManyInput = {
    credentialID: string;
    userId: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
  };
  export type AuthenticatorUpdateManyMutationInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type AuthenticatorUncheckedUpdateManyInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type GameCreateInput = {
    id?: string;
    roomId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    white?: UserCreateNestedOneWithoutWhiteGamesInput;
    black?: UserCreateNestedOneWithoutBlackGamesInput;
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput;
  };
  export type GameUncheckedCreateInput = {
    id?: string;
    roomId?: string | null;
    whiteUserId?: string | null;
    blackUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput;
  };
  export type GameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    white?: UserUpdateOneWithoutWhiteGamesNestedInput;
    black?: UserUpdateOneWithoutBlackGamesNestedInput;
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput;
  };
  export type GameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput;
  };
  export type GameCreateManyInput = {
    id?: string;
    roomId?: string | null;
    whiteUserId?: string | null;
    blackUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
  };
  export type GameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisCreateInput = {
    id?: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    game: GameCreateNestedOneWithoutAnalysisInput;
    user: UserCreateNestedOneWithoutAnalysesInput;
  };
  export type GameAnalysisUncheckedCreateInput = {
    id?: string;
    gameId: string;
    userId: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };
  export type GameAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    game?: GameUpdateOneRequiredWithoutAnalysisNestedInput;
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput;
  };
  export type GameAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    gameId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisCreateManyInput = {
    id?: string;
    gameId: string;
    userId: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };
  export type GameAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    gameId?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingCreateInput = {
    id?: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutRatingsInput;
  };
  export type RatingUncheckedCreateInput = {
    id?: string;
    userId: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type RatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutRatingsNestedInput;
  };
  export type RatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingCreateManyInput = {
    id?: string;
    userId: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type RatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRatingCreateInput = {
    id?: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutPuzzleRatingInput;
  };
  export type PuzzleRatingUncheckedCreateInput = {
    id?: string;
    userId: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type PuzzleRatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutPuzzleRatingNestedInput;
  };
  export type PuzzleRatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRatingCreateManyInput = {
    id?: string;
    userId: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type PuzzleRatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptCreateInput = {
    id?: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutPuzzleAttemptsInput;
  };
  export type PuzzleAttemptUncheckedCreateInput = {
    id?: string;
    userId: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
  };
  export type PuzzleAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutPuzzleAttemptsNestedInput;
  };
  export type PuzzleAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptCreateManyInput = {
    id?: string;
    userId: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
  };
  export type PuzzleAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreCreateInput = {
    id?: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutPuzzleRushScoresInput;
  };
  export type PuzzleRushScoreUncheckedCreateInput = {
    id?: string;
    userId: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
  };
  export type PuzzleRushScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutPuzzleRushScoresNestedInput;
  };
  export type PuzzleRushScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreCreateManyInput = {
    id?: string;
    userId: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
  };
  export type PuzzleRushScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionCreateInput = {
    id?: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutMemorySessionsInput;
  };
  export type MemorySessionUncheckedCreateInput = {
    id?: string;
    userId: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
  };
  export type MemorySessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutMemorySessionsNestedInput;
  };
  export type MemorySessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionCreateManyInput = {
    id?: string;
    userId: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
  };
  export type MemorySessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionCreateInput = {
    id?: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutVisionSessionsInput;
  };
  export type VisionSessionUncheckedCreateInput = {
    id?: string;
    userId: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
  };
  export type VisionSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutVisionSessionsNestedInput;
  };
  export type VisionSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionCreateManyInput = {
    id?: string;
    userId: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
  };
  export type VisionSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };
  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };
  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };
  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };
  export type AccountListRelationFilter = {
    every?: AccountWhereInput;
    some?: AccountWhereInput;
    none?: AccountWhereInput;
  };
  export type SessionListRelationFilter = {
    every?: SessionWhereInput;
    some?: SessionWhereInput;
    none?: SessionWhereInput;
  };
  export type AuthenticatorListRelationFilter = {
    every?: AuthenticatorWhereInput;
    some?: AuthenticatorWhereInput;
    none?: AuthenticatorWhereInput;
  };
  export type GameListRelationFilter = {
    every?: GameWhereInput;
    some?: GameWhereInput;
    none?: GameWhereInput;
  };
  export type RatingListRelationFilter = {
    every?: RatingWhereInput;
    some?: RatingWhereInput;
    none?: RatingWhereInput;
  };
  export type PuzzleRatingNullableScalarRelationFilter = {
    is?: PuzzleRatingWhereInput | null;
    isNot?: PuzzleRatingWhereInput | null;
  };
  export type GameAnalysisListRelationFilter = {
    every?: GameAnalysisWhereInput;
    some?: GameAnalysisWhereInput;
    none?: GameAnalysisWhereInput;
  };
  export type PuzzleAttemptListRelationFilter = {
    every?: PuzzleAttemptWhereInput;
    some?: PuzzleAttemptWhereInput;
    none?: PuzzleAttemptWhereInput;
  };
  export type PuzzleRushScoreListRelationFilter = {
    every?: PuzzleRushScoreWhereInput;
    some?: PuzzleRushScoreWhereInput;
    none?: PuzzleRushScoreWhereInput;
  };
  export type MemorySessionListRelationFilter = {
    every?: MemorySessionWhereInput;
    some?: MemorySessionWhereInput;
    none?: MemorySessionWhereInput;
  };
  export type VisionSessionListRelationFilter = {
    every?: VisionSessionWhereInput;
    some?: VisionSessionWhereInput;
    none?: VisionSessionWhereInput;
  };
  export type PassportFlagListRelationFilter = {
    every?: PassportFlagWhereInput;
    some?: PassportFlagWhereInput;
    none?: PassportFlagWhereInput;
  };
  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };
  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type AuthenticatorOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type RatingOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type GameAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type PuzzleAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type PuzzleRushScoreOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type MemorySessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type VisionSessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type PassportFlagOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };
  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    emailVerified?: SortOrder;
    image?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };
  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };
  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };
  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };
  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };
  export type PassportFlagUserIdFlagCodeCompoundUniqueInput = {
    userId: string;
    flagCode: string;
  };
  export type PassportFlagCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PassportFlagMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PassportFlagMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    flagCode?: SortOrder;
    createdAt?: SortOrder;
  };
  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };
  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string;
    providerAccountId: string;
  };
  export type AccountCountOrderByAggregateInput = {
    userId?: SortOrder;
    type?: SortOrder;
    provider?: SortOrder;
    providerAccountId?: SortOrder;
    refresh_token?: SortOrder;
    access_token?: SortOrder;
    expires_at?: SortOrder;
    token_type?: SortOrder;
    scope?: SortOrder;
    id_token?: SortOrder;
    session_state?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder;
  };
  export type AccountMaxOrderByAggregateInput = {
    userId?: SortOrder;
    type?: SortOrder;
    provider?: SortOrder;
    providerAccountId?: SortOrder;
    refresh_token?: SortOrder;
    access_token?: SortOrder;
    expires_at?: SortOrder;
    token_type?: SortOrder;
    scope?: SortOrder;
    id_token?: SortOrder;
    session_state?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type AccountMinOrderByAggregateInput = {
    userId?: SortOrder;
    type?: SortOrder;
    provider?: SortOrder;
    providerAccountId?: SortOrder;
    refresh_token?: SortOrder;
    access_token?: SortOrder;
    expires_at?: SortOrder;
    token_type?: SortOrder;
    scope?: SortOrder;
    id_token?: SortOrder;
    session_state?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder;
  };
  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };
  export type SessionCountOrderByAggregateInput = {
    sessionToken?: SortOrder;
    userId?: SortOrder;
    expires?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type SessionMaxOrderByAggregateInput = {
    sessionToken?: SortOrder;
    userId?: SortOrder;
    expires?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type SessionMinOrderByAggregateInput = {
    sessionToken?: SortOrder;
    userId?: SortOrder;
    expires?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string;
    token: string;
  };
  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder;
    token?: SortOrder;
    expires?: SortOrder;
  };
  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder;
    token?: SortOrder;
    expires?: SortOrder;
  };
  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder;
    token?: SortOrder;
    expires?: SortOrder;
  };
  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };
  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };
  export type AuthenticatorUserIdCredentialIDCompoundUniqueInput = {
    userId: string;
    credentialID: string;
  };
  export type AuthenticatorCountOrderByAggregateInput = {
    credentialID?: SortOrder;
    userId?: SortOrder;
    providerAccountId?: SortOrder;
    credentialPublicKey?: SortOrder;
    counter?: SortOrder;
    credentialDeviceType?: SortOrder;
    credentialBackedUp?: SortOrder;
    transports?: SortOrder;
  };
  export type AuthenticatorAvgOrderByAggregateInput = {
    counter?: SortOrder;
  };
  export type AuthenticatorMaxOrderByAggregateInput = {
    credentialID?: SortOrder;
    userId?: SortOrder;
    providerAccountId?: SortOrder;
    credentialPublicKey?: SortOrder;
    counter?: SortOrder;
    credentialDeviceType?: SortOrder;
    credentialBackedUp?: SortOrder;
    transports?: SortOrder;
  };
  export type AuthenticatorMinOrderByAggregateInput = {
    credentialID?: SortOrder;
    userId?: SortOrder;
    providerAccountId?: SortOrder;
    credentialPublicKey?: SortOrder;
    counter?: SortOrder;
    credentialDeviceType?: SortOrder;
    credentialBackedUp?: SortOrder;
    transports?: SortOrder;
  };
  export type AuthenticatorSumOrderByAggregateInput = {
    counter?: SortOrder;
  };
  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };
  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };
  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
  export type JsonFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };
  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null;
    isNot?: UserWhereInput | null;
  };
  export type GameAnalysisNullableScalarRelationFilter = {
    is?: GameAnalysisWhereInput | null;
    isNot?: GameAnalysisWhereInput | null;
  };
  export type GameCountOrderByAggregateInput = {
    id?: SortOrder;
    roomId?: SortOrder;
    whiteUserId?: SortOrder;
    blackUserId?: SortOrder;
    variant?: SortOrder;
    gameType?: SortOrder;
    result?: SortOrder;
    resultReason?: SortOrder;
    moves?: SortOrder;
    startingFen?: SortOrder;
    timeControl?: SortOrder;
    whitePregameRating?: SortOrder;
    blackPregameRating?: SortOrder;
    whiteRatingDelta?: SortOrder;
    blackRatingDelta?: SortOrder;
    moveCount?: SortOrder;
    rated?: SortOrder;
    playedAt?: SortOrder;
    createdAt?: SortOrder;
  };
  export type GameAvgOrderByAggregateInput = {
    whitePregameRating?: SortOrder;
    blackPregameRating?: SortOrder;
    whiteRatingDelta?: SortOrder;
    blackRatingDelta?: SortOrder;
    moveCount?: SortOrder;
  };
  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder;
    roomId?: SortOrder;
    whiteUserId?: SortOrder;
    blackUserId?: SortOrder;
    variant?: SortOrder;
    gameType?: SortOrder;
    result?: SortOrder;
    resultReason?: SortOrder;
    startingFen?: SortOrder;
    whitePregameRating?: SortOrder;
    blackPregameRating?: SortOrder;
    whiteRatingDelta?: SortOrder;
    blackRatingDelta?: SortOrder;
    moveCount?: SortOrder;
    rated?: SortOrder;
    playedAt?: SortOrder;
    createdAt?: SortOrder;
  };
  export type GameMinOrderByAggregateInput = {
    id?: SortOrder;
    roomId?: SortOrder;
    whiteUserId?: SortOrder;
    blackUserId?: SortOrder;
    variant?: SortOrder;
    gameType?: SortOrder;
    result?: SortOrder;
    resultReason?: SortOrder;
    startingFen?: SortOrder;
    whitePregameRating?: SortOrder;
    blackPregameRating?: SortOrder;
    whiteRatingDelta?: SortOrder;
    blackRatingDelta?: SortOrder;
    moveCount?: SortOrder;
    rated?: SortOrder;
    playedAt?: SortOrder;
    createdAt?: SortOrder;
  };
  export type GameSumOrderByAggregateInput = {
    whitePregameRating?: SortOrder;
    blackPregameRating?: SortOrder;
    whiteRatingDelta?: SortOrder;
    blackRatingDelta?: SortOrder;
    moveCount?: SortOrder;
  };
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>
      >;
  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedJsonFilter<$PrismaModel>;
    _max?: NestedJsonFilter<$PrismaModel>;
  };
  export type GameScalarRelationFilter = {
    is?: GameWhereInput;
    isNot?: GameWhereInput;
  };
  export type GameAnalysisCountOrderByAggregateInput = {
    id?: SortOrder;
    gameId?: SortOrder;
    userId?: SortOrder;
    results?: SortOrder;
    createdAt?: SortOrder;
  };
  export type GameAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder;
    gameId?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };
  export type GameAnalysisMinOrderByAggregateInput = {
    id?: SortOrder;
    gameId?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };
  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };
  export type RatingUserIdVariantCategoryCompoundUniqueInput = {
    userId: string;
    variant: string;
    category: string;
  };
  export type RatingCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    variant?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type RatingAvgOrderByAggregateInput = {
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
  };
  export type RatingMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    variant?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type RatingMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    variant?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type RatingSumOrderByAggregateInput = {
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
  };
  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };
  export type PuzzleRatingCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type PuzzleRatingAvgOrderByAggregateInput = {
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
  };
  export type PuzzleRatingMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type PuzzleRatingMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };
  export type PuzzleRatingSumOrderByAggregateInput = {
    rating?: SortOrder;
    rd?: SortOrder;
    sigma?: SortOrder;
    gameCount?: SortOrder;
  };
  export type PuzzleAttemptCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    puzzleId?: SortOrder;
    difficulty?: SortOrder;
    rating?: SortOrder;
    solved?: SortOrder;
    usedHint?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleAttemptAvgOrderByAggregateInput = {
    rating?: SortOrder;
  };
  export type PuzzleAttemptMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    puzzleId?: SortOrder;
    difficulty?: SortOrder;
    rating?: SortOrder;
    solved?: SortOrder;
    usedHint?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleAttemptMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    puzzleId?: SortOrder;
    difficulty?: SortOrder;
    rating?: SortOrder;
    solved?: SortOrder;
    usedHint?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleAttemptSumOrderByAggregateInput = {
    rating?: SortOrder;
  };
  export type PuzzleRushScoreCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    difficulty?: SortOrder;
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrder;
    maxMistakes?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleRushScoreAvgOrderByAggregateInput = {
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrder;
    maxMistakes?: SortOrder;
  };
  export type PuzzleRushScoreMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    difficulty?: SortOrder;
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrder;
    maxMistakes?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleRushScoreMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    difficulty?: SortOrder;
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrder;
    maxMistakes?: SortOrder;
    createdAt?: SortOrder;
  };
  export type PuzzleRushScoreSumOrderByAggregateInput = {
    score?: SortOrder;
    mistakes?: SortOrder;
    timeLimitSeconds?: SortOrder;
    maxMistakes?: SortOrder;
  };
  export type MemorySessionCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrder;
    createdAt?: SortOrder;
  };
  export type MemorySessionAvgOrderByAggregateInput = {
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrder;
  };
  export type MemorySessionMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrder;
    createdAt?: SortOrder;
  };
  export type MemorySessionMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    mode?: SortOrder;
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrder;
    createdAt?: SortOrder;
  };
  export type MemorySessionSumOrderByAggregateInput = {
    pieceCount?: SortOrder;
    memorizeTimeSeconds?: SortOrder;
    correctPieces?: SortOrder;
    totalPieces?: SortOrder;
    accuracy?: SortOrder;
    progressiveLevel?: SortOrder;
  };
  export type VisionSessionCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    trainingMode?: SortOrder;
    colorMode?: SortOrder;
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
    createdAt?: SortOrder;
  };
  export type VisionSessionAvgOrderByAggregateInput = {
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
  };
  export type VisionSessionMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    trainingMode?: SortOrder;
    colorMode?: SortOrder;
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
    createdAt?: SortOrder;
  };
  export type VisionSessionMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    trainingMode?: SortOrder;
    colorMode?: SortOrder;
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
    createdAt?: SortOrder;
  };
  export type VisionSessionSumOrderByAggregateInput = {
    timeLimitSeconds?: SortOrder;
    score?: SortOrder;
    totalAttempts?: SortOrder;
    accuracy?: SortOrder;
    avgResponseTimeMs?: SortOrder;
  };
  export type AccountCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AccountCreateWithoutUserInput,
          AccountUncheckedCreateWithoutUserInput
        >
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };
  export type SessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };
  export type AuthenticatorCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuthenticatorCreateWithoutUserInput,
          AuthenticatorUncheckedCreateWithoutUserInput
        >
      | AuthenticatorCreateWithoutUserInput[]
      | AuthenticatorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuthenticatorCreateOrConnectWithoutUserInput
      | AuthenticatorCreateOrConnectWithoutUserInput[];
    createMany?: AuthenticatorCreateManyUserInputEnvelope;
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
  };
  export type GameCreateNestedManyWithoutWhiteInput = {
    create?:
      | XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
      | GameCreateWithoutWhiteInput[]
      | GameUncheckedCreateWithoutWhiteInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutWhiteInput
      | GameCreateOrConnectWithoutWhiteInput[];
    createMany?: GameCreateManyWhiteInputEnvelope;
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
  };
  export type GameCreateNestedManyWithoutBlackInput = {
    create?:
      | XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
      | GameCreateWithoutBlackInput[]
      | GameUncheckedCreateWithoutBlackInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutBlackInput
      | GameCreateOrConnectWithoutBlackInput[];
    createMany?: GameCreateManyBlackInputEnvelope;
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
  };
  export type RatingCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
      | RatingCreateWithoutUserInput[]
      | RatingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | RatingCreateOrConnectWithoutUserInput
      | RatingCreateOrConnectWithoutUserInput[];
    createMany?: RatingCreateManyUserInputEnvelope;
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
  };
  export type PuzzleRatingCreateNestedOneWithoutUserInput = {
    create?: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput;
    connect?: PuzzleRatingWhereUniqueInput;
  };
  export type GameAnalysisCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          GameAnalysisCreateWithoutUserInput,
          GameAnalysisUncheckedCreateWithoutUserInput
        >
      | GameAnalysisCreateWithoutUserInput[]
      | GameAnalysisUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | GameAnalysisCreateOrConnectWithoutUserInput
      | GameAnalysisCreateOrConnectWithoutUserInput[];
    createMany?: GameAnalysisCreateManyUserInputEnvelope;
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
  };
  export type PuzzleAttemptCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PuzzleAttemptCreateWithoutUserInput,
          PuzzleAttemptUncheckedCreateWithoutUserInput
        >
      | PuzzleAttemptCreateWithoutUserInput[]
      | PuzzleAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleAttemptCreateOrConnectWithoutUserInput
      | PuzzleAttemptCreateOrConnectWithoutUserInput[];
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope;
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
  };
  export type PuzzleRushScoreCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PuzzleRushScoreCreateWithoutUserInput,
          PuzzleRushScoreUncheckedCreateWithoutUserInput
        >
      | PuzzleRushScoreCreateWithoutUserInput[]
      | PuzzleRushScoreUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleRushScoreCreateOrConnectWithoutUserInput
      | PuzzleRushScoreCreateOrConnectWithoutUserInput[];
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope;
    connect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
  };
  export type MemorySessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          MemorySessionCreateWithoutUserInput,
          MemorySessionUncheckedCreateWithoutUserInput
        >
      | MemorySessionCreateWithoutUserInput[]
      | MemorySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MemorySessionCreateOrConnectWithoutUserInput
      | MemorySessionCreateOrConnectWithoutUserInput[];
    createMany?: MemorySessionCreateManyUserInputEnvelope;
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
  };
  export type VisionSessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          VisionSessionCreateWithoutUserInput,
          VisionSessionUncheckedCreateWithoutUserInput
        >
      | VisionSessionCreateWithoutUserInput[]
      | VisionSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | VisionSessionCreateOrConnectWithoutUserInput
      | VisionSessionCreateOrConnectWithoutUserInput[];
    createMany?: VisionSessionCreateManyUserInputEnvelope;
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
  };
  export type PassportFlagCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PassportFlagCreateWithoutUserInput,
          PassportFlagUncheckedCreateWithoutUserInput
        >
      | PassportFlagCreateWithoutUserInput[]
      | PassportFlagUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PassportFlagCreateOrConnectWithoutUserInput
      | PassportFlagCreateOrConnectWithoutUserInput[];
    createMany?: PassportFlagCreateManyUserInputEnvelope;
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
  };
  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AccountCreateWithoutUserInput,
          AccountUncheckedCreateWithoutUserInput
        >
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };
  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };
  export type AuthenticatorUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuthenticatorCreateWithoutUserInput,
          AuthenticatorUncheckedCreateWithoutUserInput
        >
      | AuthenticatorCreateWithoutUserInput[]
      | AuthenticatorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuthenticatorCreateOrConnectWithoutUserInput
      | AuthenticatorCreateOrConnectWithoutUserInput[];
    createMany?: AuthenticatorCreateManyUserInputEnvelope;
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
  };
  export type GameUncheckedCreateNestedManyWithoutWhiteInput = {
    create?:
      | XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
      | GameCreateWithoutWhiteInput[]
      | GameUncheckedCreateWithoutWhiteInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutWhiteInput
      | GameCreateOrConnectWithoutWhiteInput[];
    createMany?: GameCreateManyWhiteInputEnvelope;
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
  };
  export type GameUncheckedCreateNestedManyWithoutBlackInput = {
    create?:
      | XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
      | GameCreateWithoutBlackInput[]
      | GameUncheckedCreateWithoutBlackInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutBlackInput
      | GameCreateOrConnectWithoutBlackInput[];
    createMany?: GameCreateManyBlackInputEnvelope;
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
  };
  export type RatingUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
      | RatingCreateWithoutUserInput[]
      | RatingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | RatingCreateOrConnectWithoutUserInput
      | RatingCreateOrConnectWithoutUserInput[];
    createMany?: RatingCreateManyUserInputEnvelope;
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
  };
  export type PuzzleRatingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput;
    connect?: PuzzleRatingWhereUniqueInput;
  };
  export type GameAnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          GameAnalysisCreateWithoutUserInput,
          GameAnalysisUncheckedCreateWithoutUserInput
        >
      | GameAnalysisCreateWithoutUserInput[]
      | GameAnalysisUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | GameAnalysisCreateOrConnectWithoutUserInput
      | GameAnalysisCreateOrConnectWithoutUserInput[];
    createMany?: GameAnalysisCreateManyUserInputEnvelope;
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
  };
  export type PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PuzzleAttemptCreateWithoutUserInput,
          PuzzleAttemptUncheckedCreateWithoutUserInput
        >
      | PuzzleAttemptCreateWithoutUserInput[]
      | PuzzleAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleAttemptCreateOrConnectWithoutUserInput
      | PuzzleAttemptCreateOrConnectWithoutUserInput[];
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope;
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
  };
  export type PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PuzzleRushScoreCreateWithoutUserInput,
          PuzzleRushScoreUncheckedCreateWithoutUserInput
        >
      | PuzzleRushScoreCreateWithoutUserInput[]
      | PuzzleRushScoreUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleRushScoreCreateOrConnectWithoutUserInput
      | PuzzleRushScoreCreateOrConnectWithoutUserInput[];
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope;
    connect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
  };
  export type MemorySessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          MemorySessionCreateWithoutUserInput,
          MemorySessionUncheckedCreateWithoutUserInput
        >
      | MemorySessionCreateWithoutUserInput[]
      | MemorySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MemorySessionCreateOrConnectWithoutUserInput
      | MemorySessionCreateOrConnectWithoutUserInput[];
    createMany?: MemorySessionCreateManyUserInputEnvelope;
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
  };
  export type VisionSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          VisionSessionCreateWithoutUserInput,
          VisionSessionUncheckedCreateWithoutUserInput
        >
      | VisionSessionCreateWithoutUserInput[]
      | VisionSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | VisionSessionCreateOrConnectWithoutUserInput
      | VisionSessionCreateOrConnectWithoutUserInput[];
    createMany?: VisionSessionCreateManyUserInputEnvelope;
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
  };
  export type PassportFlagUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          PassportFlagCreateWithoutUserInput,
          PassportFlagUncheckedCreateWithoutUserInput
        >
      | PassportFlagCreateWithoutUserInput[]
      | PassportFlagUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PassportFlagCreateOrConnectWithoutUserInput
      | PassportFlagCreateOrConnectWithoutUserInput[];
    createMany?: PassportFlagCreateManyUserInputEnvelope;
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
  };
  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };
  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };
  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };
  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };
  export type AccountUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AccountCreateWithoutUserInput,
          AccountUncheckedCreateWithoutUserInput
        >
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | AccountUpsertWithWhereUniqueWithoutUserInput
      | AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?:
      | AccountUpdateWithWhereUniqueWithoutUserInput
      | AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AccountUpdateManyWithWhereWithoutUserInput
      | AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };
  export type SessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };
  export type AuthenticatorUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuthenticatorCreateWithoutUserInput,
          AuthenticatorUncheckedCreateWithoutUserInput
        >
      | AuthenticatorCreateWithoutUserInput[]
      | AuthenticatorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuthenticatorCreateOrConnectWithoutUserInput
      | AuthenticatorCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuthenticatorUpsertWithWhereUniqueWithoutUserInput
      | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuthenticatorCreateManyUserInputEnvelope;
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    disconnect?:
      | AuthenticatorWhereUniqueInput
      | AuthenticatorWhereUniqueInput[];
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    update?:
      | AuthenticatorUpdateWithWhereUniqueWithoutUserInput
      | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuthenticatorUpdateManyWithWhereWithoutUserInput
      | AuthenticatorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | AuthenticatorScalarWhereInput
      | AuthenticatorScalarWhereInput[];
  };
  export type GameUpdateManyWithoutWhiteNestedInput = {
    create?:
      | XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
      | GameCreateWithoutWhiteInput[]
      | GameUncheckedCreateWithoutWhiteInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutWhiteInput
      | GameCreateOrConnectWithoutWhiteInput[];
    upsert?:
      | GameUpsertWithWhereUniqueWithoutWhiteInput
      | GameUpsertWithWhereUniqueWithoutWhiteInput[];
    createMany?: GameCreateManyWhiteInputEnvelope;
    set?: GameWhereUniqueInput | GameWhereUniqueInput[];
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[];
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    update?:
      | GameUpdateWithWhereUniqueWithoutWhiteInput
      | GameUpdateWithWhereUniqueWithoutWhiteInput[];
    updateMany?:
      | GameUpdateManyWithWhereWithoutWhiteInput
      | GameUpdateManyWithWhereWithoutWhiteInput[];
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[];
  };
  export type GameUpdateManyWithoutBlackNestedInput = {
    create?:
      | XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
      | GameCreateWithoutBlackInput[]
      | GameUncheckedCreateWithoutBlackInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutBlackInput
      | GameCreateOrConnectWithoutBlackInput[];
    upsert?:
      | GameUpsertWithWhereUniqueWithoutBlackInput
      | GameUpsertWithWhereUniqueWithoutBlackInput[];
    createMany?: GameCreateManyBlackInputEnvelope;
    set?: GameWhereUniqueInput | GameWhereUniqueInput[];
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[];
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    update?:
      | GameUpdateWithWhereUniqueWithoutBlackInput
      | GameUpdateWithWhereUniqueWithoutBlackInput[];
    updateMany?:
      | GameUpdateManyWithWhereWithoutBlackInput
      | GameUpdateManyWithWhereWithoutBlackInput[];
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[];
  };
  export type RatingUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
      | RatingCreateWithoutUserInput[]
      | RatingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | RatingCreateOrConnectWithoutUserInput
      | RatingCreateOrConnectWithoutUserInput[];
    upsert?:
      | RatingUpsertWithWhereUniqueWithoutUserInput
      | RatingUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: RatingCreateManyUserInputEnvelope;
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    update?:
      | RatingUpdateWithWhereUniqueWithoutUserInput
      | RatingUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | RatingUpdateManyWithWhereWithoutUserInput
      | RatingUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[];
  };
  export type PuzzleRatingUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput;
    upsert?: PuzzleRatingUpsertWithoutUserInput;
    disconnect?: PuzzleRatingWhereInput | boolean;
    delete?: PuzzleRatingWhereInput | boolean;
    connect?: PuzzleRatingWhereUniqueInput;
    update?: XOR<
      XOR<
        PuzzleRatingUpdateToOneWithWhereWithoutUserInput,
        PuzzleRatingUpdateWithoutUserInput
      >,
      PuzzleRatingUncheckedUpdateWithoutUserInput
    >;
  };
  export type GameAnalysisUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          GameAnalysisCreateWithoutUserInput,
          GameAnalysisUncheckedCreateWithoutUserInput
        >
      | GameAnalysisCreateWithoutUserInput[]
      | GameAnalysisUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | GameAnalysisCreateOrConnectWithoutUserInput
      | GameAnalysisCreateOrConnectWithoutUserInput[];
    upsert?:
      | GameAnalysisUpsertWithWhereUniqueWithoutUserInput
      | GameAnalysisUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: GameAnalysisCreateManyUserInputEnvelope;
    set?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    disconnect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    delete?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    update?:
      | GameAnalysisUpdateWithWhereUniqueWithoutUserInput
      | GameAnalysisUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | GameAnalysisUpdateManyWithWhereWithoutUserInput
      | GameAnalysisUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[];
  };
  export type PuzzleAttemptUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PuzzleAttemptCreateWithoutUserInput,
          PuzzleAttemptUncheckedCreateWithoutUserInput
        >
      | PuzzleAttemptCreateWithoutUserInput[]
      | PuzzleAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleAttemptCreateOrConnectWithoutUserInput
      | PuzzleAttemptCreateOrConnectWithoutUserInput[];
    upsert?:
      | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput
      | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope;
    set?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    disconnect?:
      | PuzzleAttemptWhereUniqueInput
      | PuzzleAttemptWhereUniqueInput[];
    delete?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    update?:
      | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput
      | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PuzzleAttemptUpdateManyWithWhereWithoutUserInput
      | PuzzleAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | PuzzleAttemptScalarWhereInput
      | PuzzleAttemptScalarWhereInput[];
  };
  export type PuzzleRushScoreUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PuzzleRushScoreCreateWithoutUserInput,
          PuzzleRushScoreUncheckedCreateWithoutUserInput
        >
      | PuzzleRushScoreCreateWithoutUserInput[]
      | PuzzleRushScoreUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleRushScoreCreateOrConnectWithoutUserInput
      | PuzzleRushScoreCreateOrConnectWithoutUserInput[];
    upsert?:
      | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput
      | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope;
    set?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[];
    disconnect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    delete?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    connect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    update?:
      | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput
      | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput
      | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | PuzzleRushScoreScalarWhereInput
      | PuzzleRushScoreScalarWhereInput[];
  };
  export type MemorySessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          MemorySessionCreateWithoutUserInput,
          MemorySessionUncheckedCreateWithoutUserInput
        >
      | MemorySessionCreateWithoutUserInput[]
      | MemorySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MemorySessionCreateOrConnectWithoutUserInput
      | MemorySessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | MemorySessionUpsertWithWhereUniqueWithoutUserInput
      | MemorySessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: MemorySessionCreateManyUserInputEnvelope;
    set?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    disconnect?:
      | MemorySessionWhereUniqueInput
      | MemorySessionWhereUniqueInput[];
    delete?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    update?:
      | MemorySessionUpdateWithWhereUniqueWithoutUserInput
      | MemorySessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | MemorySessionUpdateManyWithWhereWithoutUserInput
      | MemorySessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | MemorySessionScalarWhereInput
      | MemorySessionScalarWhereInput[];
  };
  export type VisionSessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          VisionSessionCreateWithoutUserInput,
          VisionSessionUncheckedCreateWithoutUserInput
        >
      | VisionSessionCreateWithoutUserInput[]
      | VisionSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | VisionSessionCreateOrConnectWithoutUserInput
      | VisionSessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | VisionSessionUpsertWithWhereUniqueWithoutUserInput
      | VisionSessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: VisionSessionCreateManyUserInputEnvelope;
    set?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    disconnect?:
      | VisionSessionWhereUniqueInput
      | VisionSessionWhereUniqueInput[];
    delete?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    update?:
      | VisionSessionUpdateWithWhereUniqueWithoutUserInput
      | VisionSessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | VisionSessionUpdateManyWithWhereWithoutUserInput
      | VisionSessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | VisionSessionScalarWhereInput
      | VisionSessionScalarWhereInput[];
  };
  export type PassportFlagUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PassportFlagCreateWithoutUserInput,
          PassportFlagUncheckedCreateWithoutUserInput
        >
      | PassportFlagCreateWithoutUserInput[]
      | PassportFlagUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PassportFlagCreateOrConnectWithoutUserInput
      | PassportFlagCreateOrConnectWithoutUserInput[];
    upsert?:
      | PassportFlagUpsertWithWhereUniqueWithoutUserInput
      | PassportFlagUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PassportFlagCreateManyUserInputEnvelope;
    set?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    disconnect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    delete?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    update?:
      | PassportFlagUpdateWithWhereUniqueWithoutUserInput
      | PassportFlagUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PassportFlagUpdateManyWithWhereWithoutUserInput
      | PassportFlagUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[];
  };
  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AccountCreateWithoutUserInput,
          AccountUncheckedCreateWithoutUserInput
        >
      | AccountCreateWithoutUserInput[]
      | AccountUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AccountCreateOrConnectWithoutUserInput
      | AccountCreateOrConnectWithoutUserInput[];
    upsert?:
      | AccountUpsertWithWhereUniqueWithoutUserInput
      | AccountUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AccountCreateManyUserInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?:
      | AccountUpdateWithWhereUniqueWithoutUserInput
      | AccountUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AccountUpdateManyWithWhereWithoutUserInput
      | AccountUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };
  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };
  export type AuthenticatorUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuthenticatorCreateWithoutUserInput,
          AuthenticatorUncheckedCreateWithoutUserInput
        >
      | AuthenticatorCreateWithoutUserInput[]
      | AuthenticatorUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuthenticatorCreateOrConnectWithoutUserInput
      | AuthenticatorCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuthenticatorUpsertWithWhereUniqueWithoutUserInput
      | AuthenticatorUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuthenticatorCreateManyUserInputEnvelope;
    set?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    disconnect?:
      | AuthenticatorWhereUniqueInput
      | AuthenticatorWhereUniqueInput[];
    delete?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    connect?: AuthenticatorWhereUniqueInput | AuthenticatorWhereUniqueInput[];
    update?:
      | AuthenticatorUpdateWithWhereUniqueWithoutUserInput
      | AuthenticatorUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuthenticatorUpdateManyWithWhereWithoutUserInput
      | AuthenticatorUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | AuthenticatorScalarWhereInput
      | AuthenticatorScalarWhereInput[];
  };
  export type GameUncheckedUpdateManyWithoutWhiteNestedInput = {
    create?:
      | XOR<GameCreateWithoutWhiteInput, GameUncheckedCreateWithoutWhiteInput>
      | GameCreateWithoutWhiteInput[]
      | GameUncheckedCreateWithoutWhiteInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutWhiteInput
      | GameCreateOrConnectWithoutWhiteInput[];
    upsert?:
      | GameUpsertWithWhereUniqueWithoutWhiteInput
      | GameUpsertWithWhereUniqueWithoutWhiteInput[];
    createMany?: GameCreateManyWhiteInputEnvelope;
    set?: GameWhereUniqueInput | GameWhereUniqueInput[];
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[];
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    update?:
      | GameUpdateWithWhereUniqueWithoutWhiteInput
      | GameUpdateWithWhereUniqueWithoutWhiteInput[];
    updateMany?:
      | GameUpdateManyWithWhereWithoutWhiteInput
      | GameUpdateManyWithWhereWithoutWhiteInput[];
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[];
  };
  export type GameUncheckedUpdateManyWithoutBlackNestedInput = {
    create?:
      | XOR<GameCreateWithoutBlackInput, GameUncheckedCreateWithoutBlackInput>
      | GameCreateWithoutBlackInput[]
      | GameUncheckedCreateWithoutBlackInput[];
    connectOrCreate?:
      | GameCreateOrConnectWithoutBlackInput
      | GameCreateOrConnectWithoutBlackInput[];
    upsert?:
      | GameUpsertWithWhereUniqueWithoutBlackInput
      | GameUpsertWithWhereUniqueWithoutBlackInput[];
    createMany?: GameCreateManyBlackInputEnvelope;
    set?: GameWhereUniqueInput | GameWhereUniqueInput[];
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[];
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[];
    update?:
      | GameUpdateWithWhereUniqueWithoutBlackInput
      | GameUpdateWithWhereUniqueWithoutBlackInput[];
    updateMany?:
      | GameUpdateManyWithWhereWithoutBlackInput
      | GameUpdateManyWithWhereWithoutBlackInput[];
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[];
  };
  export type RatingUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<RatingCreateWithoutUserInput, RatingUncheckedCreateWithoutUserInput>
      | RatingCreateWithoutUserInput[]
      | RatingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | RatingCreateOrConnectWithoutUserInput
      | RatingCreateOrConnectWithoutUserInput[];
    upsert?:
      | RatingUpsertWithWhereUniqueWithoutUserInput
      | RatingUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: RatingCreateManyUserInputEnvelope;
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[];
    update?:
      | RatingUpdateWithWhereUniqueWithoutUserInput
      | RatingUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | RatingUpdateManyWithWhereWithoutUserInput
      | RatingUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[];
  };
  export type PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: PuzzleRatingCreateOrConnectWithoutUserInput;
    upsert?: PuzzleRatingUpsertWithoutUserInput;
    disconnect?: PuzzleRatingWhereInput | boolean;
    delete?: PuzzleRatingWhereInput | boolean;
    connect?: PuzzleRatingWhereUniqueInput;
    update?: XOR<
      XOR<
        PuzzleRatingUpdateToOneWithWhereWithoutUserInput,
        PuzzleRatingUpdateWithoutUserInput
      >,
      PuzzleRatingUncheckedUpdateWithoutUserInput
    >;
  };
  export type GameAnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          GameAnalysisCreateWithoutUserInput,
          GameAnalysisUncheckedCreateWithoutUserInput
        >
      | GameAnalysisCreateWithoutUserInput[]
      | GameAnalysisUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | GameAnalysisCreateOrConnectWithoutUserInput
      | GameAnalysisCreateOrConnectWithoutUserInput[];
    upsert?:
      | GameAnalysisUpsertWithWhereUniqueWithoutUserInput
      | GameAnalysisUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: GameAnalysisCreateManyUserInputEnvelope;
    set?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    disconnect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    delete?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    connect?: GameAnalysisWhereUniqueInput | GameAnalysisWhereUniqueInput[];
    update?:
      | GameAnalysisUpdateWithWhereUniqueWithoutUserInput
      | GameAnalysisUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | GameAnalysisUpdateManyWithWhereWithoutUserInput
      | GameAnalysisUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[];
  };
  export type PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PuzzleAttemptCreateWithoutUserInput,
          PuzzleAttemptUncheckedCreateWithoutUserInput
        >
      | PuzzleAttemptCreateWithoutUserInput[]
      | PuzzleAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleAttemptCreateOrConnectWithoutUserInput
      | PuzzleAttemptCreateOrConnectWithoutUserInput[];
    upsert?:
      | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput
      | PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PuzzleAttemptCreateManyUserInputEnvelope;
    set?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    disconnect?:
      | PuzzleAttemptWhereUniqueInput
      | PuzzleAttemptWhereUniqueInput[];
    delete?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    connect?: PuzzleAttemptWhereUniqueInput | PuzzleAttemptWhereUniqueInput[];
    update?:
      | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput
      | PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PuzzleAttemptUpdateManyWithWhereWithoutUserInput
      | PuzzleAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | PuzzleAttemptScalarWhereInput
      | PuzzleAttemptScalarWhereInput[];
  };
  export type PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PuzzleRushScoreCreateWithoutUserInput,
          PuzzleRushScoreUncheckedCreateWithoutUserInput
        >
      | PuzzleRushScoreCreateWithoutUserInput[]
      | PuzzleRushScoreUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PuzzleRushScoreCreateOrConnectWithoutUserInput
      | PuzzleRushScoreCreateOrConnectWithoutUserInput[];
    upsert?:
      | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput
      | PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PuzzleRushScoreCreateManyUserInputEnvelope;
    set?: PuzzleRushScoreWhereUniqueInput | PuzzleRushScoreWhereUniqueInput[];
    disconnect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    delete?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    connect?:
      | PuzzleRushScoreWhereUniqueInput
      | PuzzleRushScoreWhereUniqueInput[];
    update?:
      | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput
      | PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput
      | PuzzleRushScoreUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | PuzzleRushScoreScalarWhereInput
      | PuzzleRushScoreScalarWhereInput[];
  };
  export type MemorySessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          MemorySessionCreateWithoutUserInput,
          MemorySessionUncheckedCreateWithoutUserInput
        >
      | MemorySessionCreateWithoutUserInput[]
      | MemorySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | MemorySessionCreateOrConnectWithoutUserInput
      | MemorySessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | MemorySessionUpsertWithWhereUniqueWithoutUserInput
      | MemorySessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: MemorySessionCreateManyUserInputEnvelope;
    set?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    disconnect?:
      | MemorySessionWhereUniqueInput
      | MemorySessionWhereUniqueInput[];
    delete?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    connect?: MemorySessionWhereUniqueInput | MemorySessionWhereUniqueInput[];
    update?:
      | MemorySessionUpdateWithWhereUniqueWithoutUserInput
      | MemorySessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | MemorySessionUpdateManyWithWhereWithoutUserInput
      | MemorySessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | MemorySessionScalarWhereInput
      | MemorySessionScalarWhereInput[];
  };
  export type VisionSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          VisionSessionCreateWithoutUserInput,
          VisionSessionUncheckedCreateWithoutUserInput
        >
      | VisionSessionCreateWithoutUserInput[]
      | VisionSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | VisionSessionCreateOrConnectWithoutUserInput
      | VisionSessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | VisionSessionUpsertWithWhereUniqueWithoutUserInput
      | VisionSessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: VisionSessionCreateManyUserInputEnvelope;
    set?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    disconnect?:
      | VisionSessionWhereUniqueInput
      | VisionSessionWhereUniqueInput[];
    delete?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    connect?: VisionSessionWhereUniqueInput | VisionSessionWhereUniqueInput[];
    update?:
      | VisionSessionUpdateWithWhereUniqueWithoutUserInput
      | VisionSessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | VisionSessionUpdateManyWithWhereWithoutUserInput
      | VisionSessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | VisionSessionScalarWhereInput
      | VisionSessionScalarWhereInput[];
  };
  export type PassportFlagUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          PassportFlagCreateWithoutUserInput,
          PassportFlagUncheckedCreateWithoutUserInput
        >
      | PassportFlagCreateWithoutUserInput[]
      | PassportFlagUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | PassportFlagCreateOrConnectWithoutUserInput
      | PassportFlagCreateOrConnectWithoutUserInput[];
    upsert?:
      | PassportFlagUpsertWithWhereUniqueWithoutUserInput
      | PassportFlagUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: PassportFlagCreateManyUserInputEnvelope;
    set?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    disconnect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    delete?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    connect?: PassportFlagWhereUniqueInput | PassportFlagWhereUniqueInput[];
    update?:
      | PassportFlagUpdateWithWhereUniqueWithoutUserInput
      | PassportFlagUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | PassportFlagUpdateManyWithWhereWithoutUserInput
      | PassportFlagUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[];
  };
  export type UserCreateNestedOneWithoutPassportFlagsInput = {
    create?: XOR<
      UserCreateWithoutPassportFlagsInput,
      UserUncheckedCreateWithoutPassportFlagsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPassportFlagsInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutPassportFlagsNestedInput = {
    create?: XOR<
      UserCreateWithoutPassportFlagsInput,
      UserUncheckedCreateWithoutPassportFlagsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPassportFlagsInput;
    upsert?: UserUpsertWithoutPassportFlagsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutPassportFlagsInput,
        UserUpdateWithoutPassportFlagsInput
      >,
      UserUncheckedUpdateWithoutPassportFlagsInput
    >;
  };
  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<
      UserCreateWithoutAccountsInput,
      UserUncheckedCreateWithoutAccountsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
    connect?: UserWhereUniqueInput;
  };
  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };
  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<
      UserCreateWithoutAccountsInput,
      UserUncheckedCreateWithoutAccountsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput;
    upsert?: UserUpsertWithoutAccountsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAccountsInput,
        UserUpdateWithoutAccountsInput
      >,
      UserUncheckedUpdateWithoutAccountsInput
    >;
  };
  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    upsert?: UserUpsertWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutSessionsInput,
        UserUpdateWithoutSessionsInput
      >,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };
  export type UserCreateNestedOneWithoutAuthenticatorInput = {
    create?: XOR<
      UserCreateWithoutAuthenticatorInput,
      UserUncheckedCreateWithoutAuthenticatorInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticatorInput;
    connect?: UserWhereUniqueInput;
  };
  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };
  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };
  export type UserUpdateOneRequiredWithoutAuthenticatorNestedInput = {
    create?: XOR<
      UserCreateWithoutAuthenticatorInput,
      UserUncheckedCreateWithoutAuthenticatorInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuthenticatorInput;
    upsert?: UserUpsertWithoutAuthenticatorInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAuthenticatorInput,
        UserUpdateWithoutAuthenticatorInput
      >,
      UserUncheckedUpdateWithoutAuthenticatorInput
    >;
  };
  export type GameCreatemovesInput = {
    set: string[];
  };
  export type UserCreateNestedOneWithoutWhiteGamesInput = {
    create?: XOR<
      UserCreateWithoutWhiteGamesInput,
      UserUncheckedCreateWithoutWhiteGamesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutWhiteGamesInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserCreateNestedOneWithoutBlackGamesInput = {
    create?: XOR<
      UserCreateWithoutBlackGamesInput,
      UserUncheckedCreateWithoutBlackGamesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutBlackGamesInput;
    connect?: UserWhereUniqueInput;
  };
  export type GameAnalysisCreateNestedOneWithoutGameInput = {
    create?: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput;
    connect?: GameAnalysisWhereUniqueInput;
  };
  export type GameAnalysisUncheckedCreateNestedOneWithoutGameInput = {
    create?: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput;
    connect?: GameAnalysisWhereUniqueInput;
  };
  export type GameUpdatemovesInput = {
    set?: string[];
    push?: string | string[];
  };
  export type UserUpdateOneWithoutWhiteGamesNestedInput = {
    create?: XOR<
      UserCreateWithoutWhiteGamesInput,
      UserUncheckedCreateWithoutWhiteGamesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutWhiteGamesInput;
    upsert?: UserUpsertWithoutWhiteGamesInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutWhiteGamesInput,
        UserUpdateWithoutWhiteGamesInput
      >,
      UserUncheckedUpdateWithoutWhiteGamesInput
    >;
  };
  export type UserUpdateOneWithoutBlackGamesNestedInput = {
    create?: XOR<
      UserCreateWithoutBlackGamesInput,
      UserUncheckedCreateWithoutBlackGamesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutBlackGamesInput;
    upsert?: UserUpsertWithoutBlackGamesInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutBlackGamesInput,
        UserUpdateWithoutBlackGamesInput
      >,
      UserUncheckedUpdateWithoutBlackGamesInput
    >;
  };
  export type GameAnalysisUpdateOneWithoutGameNestedInput = {
    create?: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput;
    upsert?: GameAnalysisUpsertWithoutGameInput;
    disconnect?: GameAnalysisWhereInput | boolean;
    delete?: GameAnalysisWhereInput | boolean;
    connect?: GameAnalysisWhereUniqueInput;
    update?: XOR<
      XOR<
        GameAnalysisUpdateToOneWithWhereWithoutGameInput,
        GameAnalysisUpdateWithoutGameInput
      >,
      GameAnalysisUncheckedUpdateWithoutGameInput
    >;
  };
  export type GameAnalysisUncheckedUpdateOneWithoutGameNestedInput = {
    create?: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
    connectOrCreate?: GameAnalysisCreateOrConnectWithoutGameInput;
    upsert?: GameAnalysisUpsertWithoutGameInput;
    disconnect?: GameAnalysisWhereInput | boolean;
    delete?: GameAnalysisWhereInput | boolean;
    connect?: GameAnalysisWhereUniqueInput;
    update?: XOR<
      XOR<
        GameAnalysisUpdateToOneWithWhereWithoutGameInput,
        GameAnalysisUpdateWithoutGameInput
      >,
      GameAnalysisUncheckedUpdateWithoutGameInput
    >;
  };
  export type GameCreateNestedOneWithoutAnalysisInput = {
    create?: XOR<
      GameCreateWithoutAnalysisInput,
      GameUncheckedCreateWithoutAnalysisInput
    >;
    connectOrCreate?: GameCreateOrConnectWithoutAnalysisInput;
    connect?: GameWhereUniqueInput;
  };
  export type UserCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<
      UserCreateWithoutAnalysesInput,
      UserUncheckedCreateWithoutAnalysesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput;
    connect?: UserWhereUniqueInput;
  };
  export type GameUpdateOneRequiredWithoutAnalysisNestedInput = {
    create?: XOR<
      GameCreateWithoutAnalysisInput,
      GameUncheckedCreateWithoutAnalysisInput
    >;
    connectOrCreate?: GameCreateOrConnectWithoutAnalysisInput;
    upsert?: GameUpsertWithoutAnalysisInput;
    connect?: GameWhereUniqueInput;
    update?: XOR<
      XOR<
        GameUpdateToOneWithWhereWithoutAnalysisInput,
        GameUpdateWithoutAnalysisInput
      >,
      GameUncheckedUpdateWithoutAnalysisInput
    >;
  };
  export type UserUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<
      UserCreateWithoutAnalysesInput,
      UserUncheckedCreateWithoutAnalysesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput;
    upsert?: UserUpsertWithoutAnalysesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAnalysesInput,
        UserUpdateWithoutAnalysesInput
      >,
      UserUncheckedUpdateWithoutAnalysesInput
    >;
  };
  export type UserCreateNestedOneWithoutRatingsInput = {
    create?: XOR<
      UserCreateWithoutRatingsInput,
      UserUncheckedCreateWithoutRatingsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutRatingsInput;
    connect?: UserWhereUniqueInput;
  };
  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };
  export type UserUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<
      UserCreateWithoutRatingsInput,
      UserUncheckedCreateWithoutRatingsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutRatingsInput;
    upsert?: UserUpsertWithoutRatingsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutRatingsInput,
        UserUpdateWithoutRatingsInput
      >,
      UserUncheckedUpdateWithoutRatingsInput
    >;
  };
  export type UserCreateNestedOneWithoutPuzzleRatingInput = {
    create?: XOR<
      UserCreateWithoutPuzzleRatingInput,
      UserUncheckedCreateWithoutPuzzleRatingInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRatingInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutPuzzleRatingNestedInput = {
    create?: XOR<
      UserCreateWithoutPuzzleRatingInput,
      UserUncheckedCreateWithoutPuzzleRatingInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRatingInput;
    upsert?: UserUpsertWithoutPuzzleRatingInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutPuzzleRatingInput,
        UserUpdateWithoutPuzzleRatingInput
      >,
      UserUncheckedUpdateWithoutPuzzleRatingInput
    >;
  };
  export type UserCreateNestedOneWithoutPuzzleAttemptsInput = {
    create?: XOR<
      UserCreateWithoutPuzzleAttemptsInput,
      UserUncheckedCreateWithoutPuzzleAttemptsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleAttemptsInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutPuzzleAttemptsNestedInput = {
    create?: XOR<
      UserCreateWithoutPuzzleAttemptsInput,
      UserUncheckedCreateWithoutPuzzleAttemptsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleAttemptsInput;
    upsert?: UserUpsertWithoutPuzzleAttemptsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutPuzzleAttemptsInput,
        UserUpdateWithoutPuzzleAttemptsInput
      >,
      UserUncheckedUpdateWithoutPuzzleAttemptsInput
    >;
  };
  export type UserCreateNestedOneWithoutPuzzleRushScoresInput = {
    create?: XOR<
      UserCreateWithoutPuzzleRushScoresInput,
      UserUncheckedCreateWithoutPuzzleRushScoresInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRushScoresInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutPuzzleRushScoresNestedInput = {
    create?: XOR<
      UserCreateWithoutPuzzleRushScoresInput,
      UserUncheckedCreateWithoutPuzzleRushScoresInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPuzzleRushScoresInput;
    upsert?: UserUpsertWithoutPuzzleRushScoresInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutPuzzleRushScoresInput,
        UserUpdateWithoutPuzzleRushScoresInput
      >,
      UserUncheckedUpdateWithoutPuzzleRushScoresInput
    >;
  };
  export type UserCreateNestedOneWithoutMemorySessionsInput = {
    create?: XOR<
      UserCreateWithoutMemorySessionsInput,
      UserUncheckedCreateWithoutMemorySessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMemorySessionsInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutMemorySessionsNestedInput = {
    create?: XOR<
      UserCreateWithoutMemorySessionsInput,
      UserUncheckedCreateWithoutMemorySessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutMemorySessionsInput;
    upsert?: UserUpsertWithoutMemorySessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutMemorySessionsInput,
        UserUpdateWithoutMemorySessionsInput
      >,
      UserUncheckedUpdateWithoutMemorySessionsInput
    >;
  };
  export type UserCreateNestedOneWithoutVisionSessionsInput = {
    create?: XOR<
      UserCreateWithoutVisionSessionsInput,
      UserUncheckedCreateWithoutVisionSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutVisionSessionsInput;
    connect?: UserWhereUniqueInput;
  };
  export type UserUpdateOneRequiredWithoutVisionSessionsNestedInput = {
    create?: XOR<
      UserCreateWithoutVisionSessionsInput,
      UserUncheckedCreateWithoutVisionSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutVisionSessionsInput;
    upsert?: UserUpsertWithoutVisionSessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutVisionSessionsInput,
        UserUpdateWithoutVisionSessionsInput
      >,
      UserUncheckedUpdateWithoutVisionSessionsInput
    >;
  };
  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };
  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };
  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };
  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };
  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };
  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };
  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };
  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };
  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };
  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };
  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };
  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };
  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };
  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };
  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };
  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };
  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };
  export type AccountCreateWithoutUserInput = {
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type AccountUncheckedCreateWithoutUserInput = {
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput;
    create: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
  };
  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type SessionCreateWithoutUserInput = {
    sessionToken: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type SessionUncheckedCreateWithoutUserInput = {
    sessionToken: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput;
    create: XOR<
      SessionCreateWithoutUserInput,
      SessionUncheckedCreateWithoutUserInput
    >;
  };
  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type AuthenticatorCreateWithoutUserInput = {
    credentialID: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
  };
  export type AuthenticatorUncheckedCreateWithoutUserInput = {
    credentialID: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
  };
  export type AuthenticatorCreateOrConnectWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput;
    create: XOR<
      AuthenticatorCreateWithoutUserInput,
      AuthenticatorUncheckedCreateWithoutUserInput
    >;
  };
  export type AuthenticatorCreateManyUserInputEnvelope = {
    data: AuthenticatorCreateManyUserInput | AuthenticatorCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type GameCreateWithoutWhiteInput = {
    id?: string;
    roomId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    black?: UserCreateNestedOneWithoutBlackGamesInput;
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput;
  };
  export type GameUncheckedCreateWithoutWhiteInput = {
    id?: string;
    roomId?: string | null;
    blackUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput;
  };
  export type GameCreateOrConnectWithoutWhiteInput = {
    where: GameWhereUniqueInput;
    create: XOR<
      GameCreateWithoutWhiteInput,
      GameUncheckedCreateWithoutWhiteInput
    >;
  };
  export type GameCreateManyWhiteInputEnvelope = {
    data: GameCreateManyWhiteInput | GameCreateManyWhiteInput[];
    skipDuplicates?: boolean;
  };
  export type GameCreateWithoutBlackInput = {
    id?: string;
    roomId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    white?: UserCreateNestedOneWithoutWhiteGamesInput;
    analysis?: GameAnalysisCreateNestedOneWithoutGameInput;
  };
  export type GameUncheckedCreateWithoutBlackInput = {
    id?: string;
    roomId?: string | null;
    whiteUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    analysis?: GameAnalysisUncheckedCreateNestedOneWithoutGameInput;
  };
  export type GameCreateOrConnectWithoutBlackInput = {
    where: GameWhereUniqueInput;
    create: XOR<
      GameCreateWithoutBlackInput,
      GameUncheckedCreateWithoutBlackInput
    >;
  };
  export type GameCreateManyBlackInputEnvelope = {
    data: GameCreateManyBlackInput | GameCreateManyBlackInput[];
    skipDuplicates?: boolean;
  };
  export type RatingCreateWithoutUserInput = {
    id?: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type RatingUncheckedCreateWithoutUserInput = {
    id?: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type RatingCreateOrConnectWithoutUserInput = {
    where: RatingWhereUniqueInput;
    create: XOR<
      RatingCreateWithoutUserInput,
      RatingUncheckedCreateWithoutUserInput
    >;
  };
  export type RatingCreateManyUserInputEnvelope = {
    data: RatingCreateManyUserInput | RatingCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleRatingCreateWithoutUserInput = {
    id?: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type PuzzleRatingUncheckedCreateWithoutUserInput = {
    id?: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type PuzzleRatingCreateOrConnectWithoutUserInput = {
    where: PuzzleRatingWhereUniqueInput;
    create: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
  };
  export type GameAnalysisCreateWithoutUserInput = {
    id?: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    game: GameCreateNestedOneWithoutAnalysisInput;
  };
  export type GameAnalysisUncheckedCreateWithoutUserInput = {
    id?: string;
    gameId: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };
  export type GameAnalysisCreateOrConnectWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput;
    create: XOR<
      GameAnalysisCreateWithoutUserInput,
      GameAnalysisUncheckedCreateWithoutUserInput
    >;
  };
  export type GameAnalysisCreateManyUserInputEnvelope = {
    data: GameAnalysisCreateManyUserInput | GameAnalysisCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleAttemptCreateWithoutUserInput = {
    id?: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
  };
  export type PuzzleAttemptUncheckedCreateWithoutUserInput = {
    id?: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
  };
  export type PuzzleAttemptCreateOrConnectWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput;
    create: XOR<
      PuzzleAttemptCreateWithoutUserInput,
      PuzzleAttemptUncheckedCreateWithoutUserInput
    >;
  };
  export type PuzzleAttemptCreateManyUserInputEnvelope = {
    data: PuzzleAttemptCreateManyUserInput | PuzzleAttemptCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type PuzzleRushScoreCreateWithoutUserInput = {
    id?: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
  };
  export type PuzzleRushScoreUncheckedCreateWithoutUserInput = {
    id?: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
  };
  export type PuzzleRushScoreCreateOrConnectWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput;
    create: XOR<
      PuzzleRushScoreCreateWithoutUserInput,
      PuzzleRushScoreUncheckedCreateWithoutUserInput
    >;
  };
  export type PuzzleRushScoreCreateManyUserInputEnvelope = {
    data:
      | PuzzleRushScoreCreateManyUserInput
      | PuzzleRushScoreCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type MemorySessionCreateWithoutUserInput = {
    id?: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
  };
  export type MemorySessionUncheckedCreateWithoutUserInput = {
    id?: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
  };
  export type MemorySessionCreateOrConnectWithoutUserInput = {
    where: MemorySessionWhereUniqueInput;
    create: XOR<
      MemorySessionCreateWithoutUserInput,
      MemorySessionUncheckedCreateWithoutUserInput
    >;
  };
  export type MemorySessionCreateManyUserInputEnvelope = {
    data: MemorySessionCreateManyUserInput | MemorySessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type VisionSessionCreateWithoutUserInput = {
    id?: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
  };
  export type VisionSessionUncheckedCreateWithoutUserInput = {
    id?: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
  };
  export type VisionSessionCreateOrConnectWithoutUserInput = {
    where: VisionSessionWhereUniqueInput;
    create: XOR<
      VisionSessionCreateWithoutUserInput,
      VisionSessionUncheckedCreateWithoutUserInput
    >;
  };
  export type VisionSessionCreateManyUserInputEnvelope = {
    data: VisionSessionCreateManyUserInput | VisionSessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type PassportFlagCreateWithoutUserInput = {
    id?: string;
    flagCode: string;
    createdAt?: Date | string;
  };
  export type PassportFlagUncheckedCreateWithoutUserInput = {
    id?: string;
    flagCode: string;
    createdAt?: Date | string;
  };
  export type PassportFlagCreateOrConnectWithoutUserInput = {
    where: PassportFlagWhereUniqueInput;
    create: XOR<
      PassportFlagCreateWithoutUserInput,
      PassportFlagUncheckedCreateWithoutUserInput
    >;
  };
  export type PassportFlagCreateManyUserInputEnvelope = {
    data: PassportFlagCreateManyUserInput | PassportFlagCreateManyUserInput[];
    skipDuplicates?: boolean;
  };
  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput;
    update: XOR<
      AccountUpdateWithoutUserInput,
      AccountUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
  };
  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput;
    data: XOR<
      AccountUpdateWithoutUserInput,
      AccountUncheckedUpdateWithoutUserInput
    >;
  };
  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput;
    data: XOR<
      AccountUpdateManyMutationInput,
      AccountUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[];
    OR?: AccountScalarWhereInput[];
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[];
    userId?: StringFilter<'Account'> | string;
    type?: StringFilter<'Account'> | string;
    provider?: StringFilter<'Account'> | string;
    providerAccountId?: StringFilter<'Account'> | string;
    refresh_token?: StringNullableFilter<'Account'> | string | null;
    access_token?: StringNullableFilter<'Account'> | string | null;
    expires_at?: IntNullableFilter<'Account'> | number | null;
    token_type?: StringNullableFilter<'Account'> | string | null;
    scope?: StringNullableFilter<'Account'> | string | null;
    id_token?: StringNullableFilter<'Account'> | string | null;
    session_state?: StringNullableFilter<'Account'> | string | null;
    createdAt?: DateTimeFilter<'Account'> | Date | string;
    updatedAt?: DateTimeFilter<'Account'> | Date | string;
  };
  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    update: XOR<
      SessionUpdateWithoutUserInput,
      SessionUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      SessionCreateWithoutUserInput,
      SessionUncheckedCreateWithoutUserInput
    >;
  };
  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    data: XOR<
      SessionUpdateWithoutUserInput,
      SessionUncheckedUpdateWithoutUserInput
    >;
  };
  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput;
    data: XOR<
      SessionUpdateManyMutationInput,
      SessionUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
    OR?: SessionScalarWhereInput[];
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
    sessionToken?: StringFilter<'Session'> | string;
    userId?: StringFilter<'Session'> | string;
    expires?: DateTimeFilter<'Session'> | Date | string;
    createdAt?: DateTimeFilter<'Session'> | Date | string;
    updatedAt?: DateTimeFilter<'Session'> | Date | string;
  };
  export type AuthenticatorUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput;
    update: XOR<
      AuthenticatorUpdateWithoutUserInput,
      AuthenticatorUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AuthenticatorCreateWithoutUserInput,
      AuthenticatorUncheckedCreateWithoutUserInput
    >;
  };
  export type AuthenticatorUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthenticatorWhereUniqueInput;
    data: XOR<
      AuthenticatorUpdateWithoutUserInput,
      AuthenticatorUncheckedUpdateWithoutUserInput
    >;
  };
  export type AuthenticatorUpdateManyWithWhereWithoutUserInput = {
    where: AuthenticatorScalarWhereInput;
    data: XOR<
      AuthenticatorUpdateManyMutationInput,
      AuthenticatorUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type AuthenticatorScalarWhereInput = {
    AND?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[];
    OR?: AuthenticatorScalarWhereInput[];
    NOT?: AuthenticatorScalarWhereInput | AuthenticatorScalarWhereInput[];
    credentialID?: StringFilter<'Authenticator'> | string;
    userId?: StringFilter<'Authenticator'> | string;
    providerAccountId?: StringFilter<'Authenticator'> | string;
    credentialPublicKey?: StringFilter<'Authenticator'> | string;
    counter?: IntFilter<'Authenticator'> | number;
    credentialDeviceType?: StringFilter<'Authenticator'> | string;
    credentialBackedUp?: BoolFilter<'Authenticator'> | boolean;
    transports?: StringNullableFilter<'Authenticator'> | string | null;
  };
  export type GameUpsertWithWhereUniqueWithoutWhiteInput = {
    where: GameWhereUniqueInput;
    update: XOR<
      GameUpdateWithoutWhiteInput,
      GameUncheckedUpdateWithoutWhiteInput
    >;
    create: XOR<
      GameCreateWithoutWhiteInput,
      GameUncheckedCreateWithoutWhiteInput
    >;
  };
  export type GameUpdateWithWhereUniqueWithoutWhiteInput = {
    where: GameWhereUniqueInput;
    data: XOR<
      GameUpdateWithoutWhiteInput,
      GameUncheckedUpdateWithoutWhiteInput
    >;
  };
  export type GameUpdateManyWithWhereWithoutWhiteInput = {
    where: GameScalarWhereInput;
    data: XOR<
      GameUpdateManyMutationInput,
      GameUncheckedUpdateManyWithoutWhiteInput
    >;
  };
  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[];
    OR?: GameScalarWhereInput[];
    NOT?: GameScalarWhereInput | GameScalarWhereInput[];
    id?: StringFilter<'Game'> | string;
    roomId?: StringNullableFilter<'Game'> | string | null;
    whiteUserId?: StringNullableFilter<'Game'> | string | null;
    blackUserId?: StringNullableFilter<'Game'> | string | null;
    variant?: StringFilter<'Game'> | string;
    gameType?: StringFilter<'Game'> | string;
    result?: StringFilter<'Game'> | string;
    resultReason?: StringFilter<'Game'> | string;
    moves?: StringNullableListFilter<'Game'>;
    startingFen?: StringFilter<'Game'> | string;
    timeControl?: JsonFilter<'Game'>;
    whitePregameRating?: IntNullableFilter<'Game'> | number | null;
    blackPregameRating?: IntNullableFilter<'Game'> | number | null;
    whiteRatingDelta?: IntNullableFilter<'Game'> | number | null;
    blackRatingDelta?: IntNullableFilter<'Game'> | number | null;
    moveCount?: IntFilter<'Game'> | number;
    rated?: BoolFilter<'Game'> | boolean;
    playedAt?: DateTimeNullableFilter<'Game'> | Date | string | null;
    createdAt?: DateTimeFilter<'Game'> | Date | string;
  };
  export type GameUpsertWithWhereUniqueWithoutBlackInput = {
    where: GameWhereUniqueInput;
    update: XOR<
      GameUpdateWithoutBlackInput,
      GameUncheckedUpdateWithoutBlackInput
    >;
    create: XOR<
      GameCreateWithoutBlackInput,
      GameUncheckedCreateWithoutBlackInput
    >;
  };
  export type GameUpdateWithWhereUniqueWithoutBlackInput = {
    where: GameWhereUniqueInput;
    data: XOR<
      GameUpdateWithoutBlackInput,
      GameUncheckedUpdateWithoutBlackInput
    >;
  };
  export type GameUpdateManyWithWhereWithoutBlackInput = {
    where: GameScalarWhereInput;
    data: XOR<
      GameUpdateManyMutationInput,
      GameUncheckedUpdateManyWithoutBlackInput
    >;
  };
  export type RatingUpsertWithWhereUniqueWithoutUserInput = {
    where: RatingWhereUniqueInput;
    update: XOR<
      RatingUpdateWithoutUserInput,
      RatingUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      RatingCreateWithoutUserInput,
      RatingUncheckedCreateWithoutUserInput
    >;
  };
  export type RatingUpdateWithWhereUniqueWithoutUserInput = {
    where: RatingWhereUniqueInput;
    data: XOR<
      RatingUpdateWithoutUserInput,
      RatingUncheckedUpdateWithoutUserInput
    >;
  };
  export type RatingUpdateManyWithWhereWithoutUserInput = {
    where: RatingScalarWhereInput;
    data: XOR<
      RatingUpdateManyMutationInput,
      RatingUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type RatingScalarWhereInput = {
    AND?: RatingScalarWhereInput | RatingScalarWhereInput[];
    OR?: RatingScalarWhereInput[];
    NOT?: RatingScalarWhereInput | RatingScalarWhereInput[];
    id?: StringFilter<'Rating'> | string;
    userId?: StringFilter<'Rating'> | string;
    variant?: StringFilter<'Rating'> | string;
    category?: StringFilter<'Rating'> | string;
    rating?: IntFilter<'Rating'> | number;
    rd?: FloatFilter<'Rating'> | number;
    sigma?: FloatFilter<'Rating'> | number;
    gameCount?: IntFilter<'Rating'> | number;
    createdAt?: DateTimeFilter<'Rating'> | Date | string;
    updatedAt?: DateTimeFilter<'Rating'> | Date | string;
  };
  export type PuzzleRatingUpsertWithoutUserInput = {
    update: XOR<
      PuzzleRatingUpdateWithoutUserInput,
      PuzzleRatingUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      PuzzleRatingCreateWithoutUserInput,
      PuzzleRatingUncheckedCreateWithoutUserInput
    >;
    where?: PuzzleRatingWhereInput;
  };
  export type PuzzleRatingUpdateToOneWithWhereWithoutUserInput = {
    where?: PuzzleRatingWhereInput;
    data: XOR<
      PuzzleRatingUpdateWithoutUserInput,
      PuzzleRatingUncheckedUpdateWithoutUserInput
    >;
  };
  export type PuzzleRatingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRatingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput;
    update: XOR<
      GameAnalysisUpdateWithoutUserInput,
      GameAnalysisUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      GameAnalysisCreateWithoutUserInput,
      GameAnalysisUncheckedCreateWithoutUserInput
    >;
  };
  export type GameAnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: GameAnalysisWhereUniqueInput;
    data: XOR<
      GameAnalysisUpdateWithoutUserInput,
      GameAnalysisUncheckedUpdateWithoutUserInput
    >;
  };
  export type GameAnalysisUpdateManyWithWhereWithoutUserInput = {
    where: GameAnalysisScalarWhereInput;
    data: XOR<
      GameAnalysisUpdateManyMutationInput,
      GameAnalysisUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type GameAnalysisScalarWhereInput = {
    AND?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[];
    OR?: GameAnalysisScalarWhereInput[];
    NOT?: GameAnalysisScalarWhereInput | GameAnalysisScalarWhereInput[];
    id?: StringFilter<'GameAnalysis'> | string;
    gameId?: StringFilter<'GameAnalysis'> | string;
    userId?: StringFilter<'GameAnalysis'> | string;
    results?: JsonFilter<'GameAnalysis'>;
    createdAt?: DateTimeFilter<'GameAnalysis'> | Date | string;
  };
  export type PuzzleAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput;
    update: XOR<
      PuzzleAttemptUpdateWithoutUserInput,
      PuzzleAttemptUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      PuzzleAttemptCreateWithoutUserInput,
      PuzzleAttemptUncheckedCreateWithoutUserInput
    >;
  };
  export type PuzzleAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: PuzzleAttemptWhereUniqueInput;
    data: XOR<
      PuzzleAttemptUpdateWithoutUserInput,
      PuzzleAttemptUncheckedUpdateWithoutUserInput
    >;
  };
  export type PuzzleAttemptUpdateManyWithWhereWithoutUserInput = {
    where: PuzzleAttemptScalarWhereInput;
    data: XOR<
      PuzzleAttemptUpdateManyMutationInput,
      PuzzleAttemptUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type PuzzleAttemptScalarWhereInput = {
    AND?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[];
    OR?: PuzzleAttemptScalarWhereInput[];
    NOT?: PuzzleAttemptScalarWhereInput | PuzzleAttemptScalarWhereInput[];
    id?: StringFilter<'PuzzleAttempt'> | string;
    userId?: StringFilter<'PuzzleAttempt'> | string;
    puzzleId?: StringFilter<'PuzzleAttempt'> | string;
    difficulty?: StringFilter<'PuzzleAttempt'> | string;
    rating?: IntFilter<'PuzzleAttempt'> | number;
    solved?: BoolFilter<'PuzzleAttempt'> | boolean;
    usedHint?: BoolFilter<'PuzzleAttempt'> | boolean;
    createdAt?: DateTimeFilter<'PuzzleAttempt'> | Date | string;
  };
  export type PuzzleRushScoreUpsertWithWhereUniqueWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput;
    update: XOR<
      PuzzleRushScoreUpdateWithoutUserInput,
      PuzzleRushScoreUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      PuzzleRushScoreCreateWithoutUserInput,
      PuzzleRushScoreUncheckedCreateWithoutUserInput
    >;
  };
  export type PuzzleRushScoreUpdateWithWhereUniqueWithoutUserInput = {
    where: PuzzleRushScoreWhereUniqueInput;
    data: XOR<
      PuzzleRushScoreUpdateWithoutUserInput,
      PuzzleRushScoreUncheckedUpdateWithoutUserInput
    >;
  };
  export type PuzzleRushScoreUpdateManyWithWhereWithoutUserInput = {
    where: PuzzleRushScoreScalarWhereInput;
    data: XOR<
      PuzzleRushScoreUpdateManyMutationInput,
      PuzzleRushScoreUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type PuzzleRushScoreScalarWhereInput = {
    AND?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[];
    OR?: PuzzleRushScoreScalarWhereInput[];
    NOT?: PuzzleRushScoreScalarWhereInput | PuzzleRushScoreScalarWhereInput[];
    id?: StringFilter<'PuzzleRushScore'> | string;
    userId?: StringFilter<'PuzzleRushScore'> | string;
    mode?: StringFilter<'PuzzleRushScore'> | string;
    difficulty?: StringFilter<'PuzzleRushScore'> | string;
    score?: IntFilter<'PuzzleRushScore'> | number;
    mistakes?: IntFilter<'PuzzleRushScore'> | number;
    timeLimitSeconds?: IntNullableFilter<'PuzzleRushScore'> | number | null;
    maxMistakes?: IntNullableFilter<'PuzzleRushScore'> | number | null;
    createdAt?: DateTimeFilter<'PuzzleRushScore'> | Date | string;
  };
  export type MemorySessionUpsertWithWhereUniqueWithoutUserInput = {
    where: MemorySessionWhereUniqueInput;
    update: XOR<
      MemorySessionUpdateWithoutUserInput,
      MemorySessionUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      MemorySessionCreateWithoutUserInput,
      MemorySessionUncheckedCreateWithoutUserInput
    >;
  };
  export type MemorySessionUpdateWithWhereUniqueWithoutUserInput = {
    where: MemorySessionWhereUniqueInput;
    data: XOR<
      MemorySessionUpdateWithoutUserInput,
      MemorySessionUncheckedUpdateWithoutUserInput
    >;
  };
  export type MemorySessionUpdateManyWithWhereWithoutUserInput = {
    where: MemorySessionScalarWhereInput;
    data: XOR<
      MemorySessionUpdateManyMutationInput,
      MemorySessionUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type MemorySessionScalarWhereInput = {
    AND?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[];
    OR?: MemorySessionScalarWhereInput[];
    NOT?: MemorySessionScalarWhereInput | MemorySessionScalarWhereInput[];
    id?: StringFilter<'MemorySession'> | string;
    userId?: StringFilter<'MemorySession'> | string;
    mode?: StringFilter<'MemorySession'> | string;
    pieceCount?: IntFilter<'MemorySession'> | number;
    memorizeTimeSeconds?: IntFilter<'MemorySession'> | number;
    correctPieces?: IntFilter<'MemorySession'> | number;
    totalPieces?: IntFilter<'MemorySession'> | number;
    accuracy?: FloatFilter<'MemorySession'> | number;
    progressiveLevel?: IntNullableFilter<'MemorySession'> | number | null;
    createdAt?: DateTimeFilter<'MemorySession'> | Date | string;
  };
  export type VisionSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: VisionSessionWhereUniqueInput;
    update: XOR<
      VisionSessionUpdateWithoutUserInput,
      VisionSessionUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      VisionSessionCreateWithoutUserInput,
      VisionSessionUncheckedCreateWithoutUserInput
    >;
  };
  export type VisionSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: VisionSessionWhereUniqueInput;
    data: XOR<
      VisionSessionUpdateWithoutUserInput,
      VisionSessionUncheckedUpdateWithoutUserInput
    >;
  };
  export type VisionSessionUpdateManyWithWhereWithoutUserInput = {
    where: VisionSessionScalarWhereInput;
    data: XOR<
      VisionSessionUpdateManyMutationInput,
      VisionSessionUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type VisionSessionScalarWhereInput = {
    AND?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[];
    OR?: VisionSessionScalarWhereInput[];
    NOT?: VisionSessionScalarWhereInput | VisionSessionScalarWhereInput[];
    id?: StringFilter<'VisionSession'> | string;
    userId?: StringFilter<'VisionSession'> | string;
    trainingMode?: StringFilter<'VisionSession'> | string;
    colorMode?: StringFilter<'VisionSession'> | string;
    timeLimitSeconds?: IntFilter<'VisionSession'> | number;
    score?: IntFilter<'VisionSession'> | number;
    totalAttempts?: IntFilter<'VisionSession'> | number;
    accuracy?: FloatFilter<'VisionSession'> | number;
    avgResponseTimeMs?: IntFilter<'VisionSession'> | number;
    createdAt?: DateTimeFilter<'VisionSession'> | Date | string;
  };
  export type PassportFlagUpsertWithWhereUniqueWithoutUserInput = {
    where: PassportFlagWhereUniqueInput;
    update: XOR<
      PassportFlagUpdateWithoutUserInput,
      PassportFlagUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      PassportFlagCreateWithoutUserInput,
      PassportFlagUncheckedCreateWithoutUserInput
    >;
  };
  export type PassportFlagUpdateWithWhereUniqueWithoutUserInput = {
    where: PassportFlagWhereUniqueInput;
    data: XOR<
      PassportFlagUpdateWithoutUserInput,
      PassportFlagUncheckedUpdateWithoutUserInput
    >;
  };
  export type PassportFlagUpdateManyWithWhereWithoutUserInput = {
    where: PassportFlagScalarWhereInput;
    data: XOR<
      PassportFlagUpdateManyMutationInput,
      PassportFlagUncheckedUpdateManyWithoutUserInput
    >;
  };
  export type PassportFlagScalarWhereInput = {
    AND?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[];
    OR?: PassportFlagScalarWhereInput[];
    NOT?: PassportFlagScalarWhereInput | PassportFlagScalarWhereInput[];
    id?: StringFilter<'PassportFlag'> | string;
    userId?: StringFilter<'PassportFlag'> | string;
    flagCode?: StringFilter<'PassportFlag'> | string;
    createdAt?: DateTimeFilter<'PassportFlag'> | Date | string;
  };
  export type UserCreateWithoutPassportFlagsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutPassportFlagsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutPassportFlagsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutPassportFlagsInput,
      UserUncheckedCreateWithoutPassportFlagsInput
    >;
  };
  export type UserUpsertWithoutPassportFlagsInput = {
    update: XOR<
      UserUpdateWithoutPassportFlagsInput,
      UserUncheckedUpdateWithoutPassportFlagsInput
    >;
    create: XOR<
      UserCreateWithoutPassportFlagsInput,
      UserUncheckedCreateWithoutPassportFlagsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutPassportFlagsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutPassportFlagsInput,
      UserUncheckedUpdateWithoutPassportFlagsInput
    >;
  };
  export type UserUpdateWithoutPassportFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutPassportFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutAccountsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAccountsInput,
      UserUncheckedCreateWithoutAccountsInput
    >;
  };
  export type UserUpsertWithoutAccountsInput = {
    update: XOR<
      UserUpdateWithoutAccountsInput,
      UserUncheckedUpdateWithoutAccountsInput
    >;
    create: XOR<
      UserCreateWithoutAccountsInput,
      UserUncheckedCreateWithoutAccountsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAccountsInput,
      UserUncheckedUpdateWithoutAccountsInput
    >;
  };
  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutSessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
  };
  export type UserUpsertWithoutSessionsInput = {
    update: XOR<
      UserUpdateWithoutSessionsInput,
      UserUncheckedUpdateWithoutSessionsInput
    >;
    create: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutSessionsInput,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };
  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutAuthenticatorInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutAuthenticatorInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutAuthenticatorInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAuthenticatorInput,
      UserUncheckedCreateWithoutAuthenticatorInput
    >;
  };
  export type UserUpsertWithoutAuthenticatorInput = {
    update: XOR<
      UserUpdateWithoutAuthenticatorInput,
      UserUncheckedUpdateWithoutAuthenticatorInput
    >;
    create: XOR<
      UserCreateWithoutAuthenticatorInput,
      UserUncheckedCreateWithoutAuthenticatorInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutAuthenticatorInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAuthenticatorInput,
      UserUncheckedUpdateWithoutAuthenticatorInput
    >;
  };
  export type UserUpdateWithoutAuthenticatorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutAuthenticatorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutWhiteGamesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutWhiteGamesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutWhiteGamesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutWhiteGamesInput,
      UserUncheckedCreateWithoutWhiteGamesInput
    >;
  };
  export type UserCreateWithoutBlackGamesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutBlackGamesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutBlackGamesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutBlackGamesInput,
      UserUncheckedCreateWithoutBlackGamesInput
    >;
  };
  export type GameAnalysisCreateWithoutGameInput = {
    id?: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutAnalysesInput;
  };
  export type GameAnalysisUncheckedCreateWithoutGameInput = {
    id?: string;
    userId: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };
  export type GameAnalysisCreateOrConnectWithoutGameInput = {
    where: GameAnalysisWhereUniqueInput;
    create: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
  };
  export type UserUpsertWithoutWhiteGamesInput = {
    update: XOR<
      UserUpdateWithoutWhiteGamesInput,
      UserUncheckedUpdateWithoutWhiteGamesInput
    >;
    create: XOR<
      UserCreateWithoutWhiteGamesInput,
      UserUncheckedCreateWithoutWhiteGamesInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutWhiteGamesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutWhiteGamesInput,
      UserUncheckedUpdateWithoutWhiteGamesInput
    >;
  };
  export type UserUpdateWithoutWhiteGamesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutWhiteGamesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserUpsertWithoutBlackGamesInput = {
    update: XOR<
      UserUpdateWithoutBlackGamesInput,
      UserUncheckedUpdateWithoutBlackGamesInput
    >;
    create: XOR<
      UserCreateWithoutBlackGamesInput,
      UserUncheckedCreateWithoutBlackGamesInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutBlackGamesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutBlackGamesInput,
      UserUncheckedUpdateWithoutBlackGamesInput
    >;
  };
  export type UserUpdateWithoutBlackGamesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutBlackGamesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type GameAnalysisUpsertWithoutGameInput = {
    update: XOR<
      GameAnalysisUpdateWithoutGameInput,
      GameAnalysisUncheckedUpdateWithoutGameInput
    >;
    create: XOR<
      GameAnalysisCreateWithoutGameInput,
      GameAnalysisUncheckedCreateWithoutGameInput
    >;
    where?: GameAnalysisWhereInput;
  };
  export type GameAnalysisUpdateToOneWithWhereWithoutGameInput = {
    where?: GameAnalysisWhereInput;
    data: XOR<
      GameAnalysisUpdateWithoutGameInput,
      GameAnalysisUncheckedUpdateWithoutGameInput
    >;
  };
  export type GameAnalysisUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput;
  };
  export type GameAnalysisUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameCreateWithoutAnalysisInput = {
    id?: string;
    roomId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
    white?: UserCreateNestedOneWithoutWhiteGamesInput;
    black?: UserCreateNestedOneWithoutBlackGamesInput;
  };
  export type GameUncheckedCreateWithoutAnalysisInput = {
    id?: string;
    roomId?: string | null;
    whiteUserId?: string | null;
    blackUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
  };
  export type GameCreateOrConnectWithoutAnalysisInput = {
    where: GameWhereUniqueInput;
    create: XOR<
      GameCreateWithoutAnalysisInput,
      GameUncheckedCreateWithoutAnalysisInput
    >;
  };
  export type UserCreateWithoutAnalysesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutAnalysesInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutAnalysesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAnalysesInput,
      UserUncheckedCreateWithoutAnalysesInput
    >;
  };
  export type GameUpsertWithoutAnalysisInput = {
    update: XOR<
      GameUpdateWithoutAnalysisInput,
      GameUncheckedUpdateWithoutAnalysisInput
    >;
    create: XOR<
      GameCreateWithoutAnalysisInput,
      GameUncheckedCreateWithoutAnalysisInput
    >;
    where?: GameWhereInput;
  };
  export type GameUpdateToOneWithWhereWithoutAnalysisInput = {
    where?: GameWhereInput;
    data: XOR<
      GameUpdateWithoutAnalysisInput,
      GameUncheckedUpdateWithoutAnalysisInput
    >;
  };
  export type GameUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    white?: UserUpdateOneWithoutWhiteGamesNestedInput;
    black?: UserUpdateOneWithoutBlackGamesNestedInput;
  };
  export type GameUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type UserUpsertWithoutAnalysesInput = {
    update: XOR<
      UserUpdateWithoutAnalysesInput,
      UserUncheckedUpdateWithoutAnalysesInput
    >;
    create: XOR<
      UserCreateWithoutAnalysesInput,
      UserUncheckedCreateWithoutAnalysesInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAnalysesInput,
      UserUncheckedUpdateWithoutAnalysesInput
    >;
  };
  export type UserUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutRatingsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutRatingsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutRatingsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutRatingsInput,
      UserUncheckedCreateWithoutRatingsInput
    >;
  };
  export type UserUpsertWithoutRatingsInput = {
    update: XOR<
      UserUpdateWithoutRatingsInput,
      UserUncheckedUpdateWithoutRatingsInput
    >;
    create: XOR<
      UserCreateWithoutRatingsInput,
      UserUncheckedCreateWithoutRatingsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutRatingsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutRatingsInput,
      UserUncheckedUpdateWithoutRatingsInput
    >;
  };
  export type UserUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutPuzzleRatingInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutPuzzleRatingInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutPuzzleRatingInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutPuzzleRatingInput,
      UserUncheckedCreateWithoutPuzzleRatingInput
    >;
  };
  export type UserUpsertWithoutPuzzleRatingInput = {
    update: XOR<
      UserUpdateWithoutPuzzleRatingInput,
      UserUncheckedUpdateWithoutPuzzleRatingInput
    >;
    create: XOR<
      UserCreateWithoutPuzzleRatingInput,
      UserUncheckedCreateWithoutPuzzleRatingInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutPuzzleRatingInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutPuzzleRatingInput,
      UserUncheckedUpdateWithoutPuzzleRatingInput
    >;
  };
  export type UserUpdateWithoutPuzzleRatingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutPuzzleRatingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutPuzzleAttemptsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutPuzzleAttemptsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutPuzzleAttemptsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutPuzzleAttemptsInput,
      UserUncheckedCreateWithoutPuzzleAttemptsInput
    >;
  };
  export type UserUpsertWithoutPuzzleAttemptsInput = {
    update: XOR<
      UserUpdateWithoutPuzzleAttemptsInput,
      UserUncheckedUpdateWithoutPuzzleAttemptsInput
    >;
    create: XOR<
      UserCreateWithoutPuzzleAttemptsInput,
      UserUncheckedCreateWithoutPuzzleAttemptsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutPuzzleAttemptsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutPuzzleAttemptsInput,
      UserUncheckedUpdateWithoutPuzzleAttemptsInput
    >;
  };
  export type UserUpdateWithoutPuzzleAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutPuzzleAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutPuzzleRushScoresInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutPuzzleRushScoresInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutPuzzleRushScoresInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutPuzzleRushScoresInput,
      UserUncheckedCreateWithoutPuzzleRushScoresInput
    >;
  };
  export type UserUpsertWithoutPuzzleRushScoresInput = {
    update: XOR<
      UserUpdateWithoutPuzzleRushScoresInput,
      UserUncheckedUpdateWithoutPuzzleRushScoresInput
    >;
    create: XOR<
      UserCreateWithoutPuzzleRushScoresInput,
      UserUncheckedCreateWithoutPuzzleRushScoresInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutPuzzleRushScoresInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutPuzzleRushScoresInput,
      UserUncheckedUpdateWithoutPuzzleRushScoresInput
    >;
  };
  export type UserUpdateWithoutPuzzleRushScoresInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutPuzzleRushScoresInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutMemorySessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutMemorySessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    visionSessions?: VisionSessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutMemorySessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutMemorySessionsInput,
      UserUncheckedCreateWithoutMemorySessionsInput
    >;
  };
  export type UserUpsertWithoutMemorySessionsInput = {
    update: XOR<
      UserUpdateWithoutMemorySessionsInput,
      UserUncheckedUpdateWithoutMemorySessionsInput
    >;
    create: XOR<
      UserCreateWithoutMemorySessionsInput,
      UserUncheckedCreateWithoutMemorySessionsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutMemorySessionsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutMemorySessionsInput,
      UserUncheckedUpdateWithoutMemorySessionsInput
    >;
  };
  export type UserUpdateWithoutMemorySessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutMemorySessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    visionSessions?: VisionSessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type UserCreateWithoutVisionSessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorCreateNestedManyWithoutUserInput;
    whiteGames?: GameCreateNestedManyWithoutWhiteInput;
    blackGames?: GameCreateNestedManyWithoutBlackInput;
    ratings?: RatingCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagCreateNestedManyWithoutUserInput;
  };
  export type UserUncheckedCreateWithoutVisionSessionsInput = {
    id?: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | string | null;
    image?: string | null;
    flagCode?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    Authenticator?: AuthenticatorUncheckedCreateNestedManyWithoutUserInput;
    whiteGames?: GameUncheckedCreateNestedManyWithoutWhiteInput;
    blackGames?: GameUncheckedCreateNestedManyWithoutBlackInput;
    ratings?: RatingUncheckedCreateNestedManyWithoutUserInput;
    puzzleRating?: PuzzleRatingUncheckedCreateNestedOneWithoutUserInput;
    analyses?: GameAnalysisUncheckedCreateNestedManyWithoutUserInput;
    puzzleAttempts?: PuzzleAttemptUncheckedCreateNestedManyWithoutUserInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedCreateNestedManyWithoutUserInput;
    memorySessions?: MemorySessionUncheckedCreateNestedManyWithoutUserInput;
    passportFlags?: PassportFlagUncheckedCreateNestedManyWithoutUserInput;
  };
  export type UserCreateOrConnectWithoutVisionSessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutVisionSessionsInput,
      UserUncheckedCreateWithoutVisionSessionsInput
    >;
  };
  export type UserUpsertWithoutVisionSessionsInput = {
    update: XOR<
      UserUpdateWithoutVisionSessionsInput,
      UserUncheckedUpdateWithoutVisionSessionsInput
    >;
    create: XOR<
      UserCreateWithoutVisionSessionsInput,
      UserUncheckedCreateWithoutVisionSessionsInput
    >;
    where?: UserWhereInput;
  };
  export type UserUpdateToOneWithWhereWithoutVisionSessionsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutVisionSessionsInput,
      UserUncheckedUpdateWithoutVisionSessionsInput
    >;
  };
  export type UserUpdateWithoutVisionSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUpdateManyWithoutUserNestedInput;
  };
  export type UserUncheckedUpdateWithoutVisionSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    emailVerified?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    image?: NullableStringFieldUpdateOperationsInput | string | null;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    Authenticator?: AuthenticatorUncheckedUpdateManyWithoutUserNestedInput;
    whiteGames?: GameUncheckedUpdateManyWithoutWhiteNestedInput;
    blackGames?: GameUncheckedUpdateManyWithoutBlackNestedInput;
    ratings?: RatingUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRating?: PuzzleRatingUncheckedUpdateOneWithoutUserNestedInput;
    analyses?: GameAnalysisUncheckedUpdateManyWithoutUserNestedInput;
    puzzleAttempts?: PuzzleAttemptUncheckedUpdateManyWithoutUserNestedInput;
    puzzleRushScores?: PuzzleRushScoreUncheckedUpdateManyWithoutUserNestedInput;
    memorySessions?: MemorySessionUncheckedUpdateManyWithoutUserNestedInput;
    passportFlags?: PassportFlagUncheckedUpdateManyWithoutUserNestedInput;
  };
  export type AccountCreateManyUserInput = {
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type SessionCreateManyUserInput = {
    sessionToken: string;
    expires: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type AuthenticatorCreateManyUserInput = {
    credentialID: string;
    providerAccountId: string;
    credentialPublicKey: string;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports?: string | null;
  };
  export type GameCreateManyWhiteInput = {
    id?: string;
    roomId?: string | null;
    blackUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
  };
  export type GameCreateManyBlackInput = {
    id?: string;
    roomId?: string | null;
    whiteUserId?: string | null;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moves?: GameCreatemovesInput | string[];
    startingFen: string;
    timeControl: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: number | null;
    blackPregameRating?: number | null;
    whiteRatingDelta?: number | null;
    blackRatingDelta?: number | null;
    moveCount: number;
    rated?: boolean;
    playedAt?: Date | string | null;
    createdAt?: Date | string;
  };
  export type RatingCreateManyUserInput = {
    id?: string;
    variant?: string;
    category: string;
    rating?: number;
    rd?: number;
    sigma?: number;
    gameCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  export type GameAnalysisCreateManyUserInput = {
    id?: string;
    gameId: string;
    results: JsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };
  export type PuzzleAttemptCreateManyUserInput = {
    id?: string;
    puzzleId: string;
    difficulty: string;
    rating: number;
    solved: boolean;
    usedHint?: boolean;
    createdAt?: Date | string;
  };
  export type PuzzleRushScoreCreateManyUserInput = {
    id?: string;
    mode: string;
    difficulty: string;
    score: number;
    mistakes: number;
    timeLimitSeconds?: number | null;
    maxMistakes?: number | null;
    createdAt?: Date | string;
  };
  export type MemorySessionCreateManyUserInput = {
    id?: string;
    mode: string;
    pieceCount: number;
    memorizeTimeSeconds: number;
    correctPieces: number;
    totalPieces: number;
    accuracy: number;
    progressiveLevel?: number | null;
    createdAt?: Date | string;
  };
  export type VisionSessionCreateManyUserInput = {
    id?: string;
    trainingMode: string;
    colorMode: string;
    timeLimitSeconds: number;
    score: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseTimeMs: number;
    createdAt?: Date | string;
  };
  export type PassportFlagCreateManyUserInput = {
    id?: string;
    flagCode: string;
    createdAt?: Date | string;
  };
  export type AccountUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AccountUncheckedUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AccountUncheckedUpdateManyWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    access_token?: NullableStringFieldUpdateOperationsInput | string | null;
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null;
    token_type?: NullableStringFieldUpdateOperationsInput | string | null;
    scope?: NullableStringFieldUpdateOperationsInput | string | null;
    id_token?: NullableStringFieldUpdateOperationsInput | string | null;
    session_state?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionUncheckedUpdateWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type SessionUncheckedUpdateManyWithoutUserInput = {
    sessionToken?: StringFieldUpdateOperationsInput | string;
    expires?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type AuthenticatorUpdateWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type AuthenticatorUncheckedUpdateWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type AuthenticatorUncheckedUpdateManyWithoutUserInput = {
    credentialID?: StringFieldUpdateOperationsInput | string;
    providerAccountId?: StringFieldUpdateOperationsInput | string;
    credentialPublicKey?: StringFieldUpdateOperationsInput | string;
    counter?: IntFieldUpdateOperationsInput | number;
    credentialDeviceType?: StringFieldUpdateOperationsInput | string;
    credentialBackedUp?: BoolFieldUpdateOperationsInput | boolean;
    transports?: NullableStringFieldUpdateOperationsInput | string | null;
  };
  export type GameUpdateWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    black?: UserUpdateOneWithoutBlackGamesNestedInput;
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput;
  };
  export type GameUncheckedUpdateWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput;
  };
  export type GameUncheckedUpdateManyWithoutWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    blackUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameUpdateWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    white?: UserUpdateOneWithoutWhiteGamesNestedInput;
    analysis?: GameAnalysisUpdateOneWithoutGameNestedInput;
  };
  export type GameUncheckedUpdateWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    analysis?: GameAnalysisUncheckedUpdateOneWithoutGameNestedInput;
  };
  export type GameUncheckedUpdateManyWithoutBlackInput = {
    id?: StringFieldUpdateOperationsInput | string;
    roomId?: NullableStringFieldUpdateOperationsInput | string | null;
    whiteUserId?: NullableStringFieldUpdateOperationsInput | string | null;
    variant?: StringFieldUpdateOperationsInput | string;
    gameType?: StringFieldUpdateOperationsInput | string;
    result?: StringFieldUpdateOperationsInput | string;
    resultReason?: StringFieldUpdateOperationsInput | string;
    moves?: GameUpdatemovesInput | string[];
    startingFen?: StringFieldUpdateOperationsInput | string;
    timeControl?: JsonNullValueInput | InputJsonValue;
    whitePregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    blackPregameRating?: NullableIntFieldUpdateOperationsInput | number | null;
    whiteRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    blackRatingDelta?: NullableIntFieldUpdateOperationsInput | number | null;
    moveCount?: IntFieldUpdateOperationsInput | number;
    rated?: BoolFieldUpdateOperationsInput | boolean;
    playedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type RatingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    variant?: StringFieldUpdateOperationsInput | string;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    rd?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
    gameCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    game?: GameUpdateOneRequiredWithoutAnalysisNestedInput;
  };
  export type GameAnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    gameId?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type GameAnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    gameId?: StringFieldUpdateOperationsInput | string;
    results?: JsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    puzzleId?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    solved?: BoolFieldUpdateOperationsInput | boolean;
    usedHint?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PuzzleRushScoreUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    difficulty?: StringFieldUpdateOperationsInput | string;
    score?: IntFieldUpdateOperationsInput | number;
    mistakes?: IntFieldUpdateOperationsInput | number;
    timeLimitSeconds?: NullableIntFieldUpdateOperationsInput | number | null;
    maxMistakes?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type MemorySessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    mode?: StringFieldUpdateOperationsInput | string;
    pieceCount?: IntFieldUpdateOperationsInput | number;
    memorizeTimeSeconds?: IntFieldUpdateOperationsInput | number;
    correctPieces?: IntFieldUpdateOperationsInput | number;
    totalPieces?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    progressiveLevel?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type VisionSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    trainingMode?: StringFieldUpdateOperationsInput | string;
    colorMode?: StringFieldUpdateOperationsInput | string;
    timeLimitSeconds?: IntFieldUpdateOperationsInput | number;
    score?: IntFieldUpdateOperationsInput | number;
    totalAttempts?: IntFieldUpdateOperationsInput | number;
    accuracy?: FloatFieldUpdateOperationsInput | number;
    avgResponseTimeMs?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type PassportFlagUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    flagCode?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };
  export type BatchPayload = {
    count: number;
  };
  export const dmmf: runtime.BaseDMMF;
}
