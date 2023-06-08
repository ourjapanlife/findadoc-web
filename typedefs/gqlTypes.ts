import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Contact = {
  __typename?: 'Contact';
  email: Scalars['String'];
  mapsLink: Scalars['String'];
  phone: Scalars['String'];
  website: Scalars['String'];
};

export type Degree = {
  __typename?: 'Degree';
  abbreviation: Scalars['String'];
  id: Scalars['ID'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
};

export type DegreeInput = {
  abbreviation: Scalars['String'];
  id: Scalars['ID'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
};

export type Facility = {
  __typename?: 'Facility';
  contact: Contact;
  healthcareProfessionals: Array<Maybe<HealthcareProfessional>>;
  id: Scalars['ID'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
};

export type HealthcareProfessional = {
  __typename?: 'HealthcareProfessional';
  acceptedInsurance: Array<Maybe<Insurance>>;
  degrees: Array<Maybe<Degree>>;
  id: Scalars['ID'];
  names: Array<Maybe<LocaleName>>;
  specialties: Array<Maybe<Specialty>>;
  spokenLanguages: Array<Maybe<SpokenLanguage>>;
};

export type HealthcareProfessionalInput = {
  acceptedInsurance: Array<InputMaybe<Insurance>>;
  degrees: Array<InputMaybe<DegreeInput>>;
  names: Array<InputMaybe<LocaleNameInput>>;
  specialties: Array<InputMaybe<SpecialtyInput>>;
  spokenLanguages: Array<InputMaybe<SpokenLanguageInput>>;
};

export enum Insurance {
  InsuranceNotAccepted = 'INSURANCE_NOT_ACCEPTED',
  InternationalHealthInsurance = 'INTERNATIONAL_HEALTH_INSURANCE',
  JapaneseHealthInsurance = 'JAPANESE_HEALTH_INSURANCE'
}

export type LocaleName = {
  __typename?: 'LocaleName';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  locale: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
};

export type LocaleNameInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  locale: Scalars['String'];
  middleName?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createHealthcareProfessional?: Maybe<HealthcareProfessional>;
  updateHealthcareProfessional?: Maybe<HealthcareProfessional>;
};


export type MutationCreateHealthcareProfessionalArgs = {
  input?: InputMaybe<HealthcareProfessionalInput>;
};


export type MutationUpdateHealthcareProfessionalArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<HealthcareProfessionalInput>;
};

export type Query = {
  __typename?: 'Query';
  degree?: Maybe<Degree>;
  degrees?: Maybe<Array<Maybe<Degree>>>;
  facilities?: Maybe<Array<Maybe<Facility>>>;
  facility?: Maybe<Facility>;
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  healthcareProfessionals?: Maybe<Array<Maybe<HealthcareProfessional>>>;
  specialties?: Maybe<Array<Maybe<Specialty>>>;
  specialty?: Maybe<Specialty>;
  spokenLanguage?: Maybe<SpokenLanguage>;
  spokenLanguages?: Maybe<Array<Maybe<SpokenLanguage>>>;
};


export type QueryDegreeArgs = {
  id: Scalars['ID'];
};


export type QueryFacilityArgs = {
  id: Scalars['ID'];
};


export type QueryHealthcareProfessionalArgs = {
  id: Scalars['ID'];
};


export type QuerySpecialtyArgs = {
  id: Scalars['ID'];
};


export type QuerySpokenLanguageArgs = {
  iso639_3: Scalars['String'];
};

export type Specialty = {
  __typename?: 'Specialty';
  id: Scalars['ID'];
  names?: Maybe<Array<Maybe<SpecialtyName>>>;
};

export type SpecialtyInput = {
  names?: InputMaybe<Array<InputMaybe<SpecialtyNameInput>>>;
};

export type SpecialtyName = {
  __typename?: 'SpecialtyName';
  locale: Scalars['String'];
  name: Scalars['String'];
};

export type SpecialtyNameInput = {
  locale: Scalars['String'];
  name: Scalars['String'];
};

export type SpokenLanguage = {
  __typename?: 'SpokenLanguage';
  iso639_3: Scalars['String'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
  nameNative: Scalars['String'];
};

export type SpokenLanguageInput = {
  iso639_3: Scalars['String'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
  nameNative: Scalars['String'];
};


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Contact: ResolverTypeWrapper<Contact>;
  Degree: ResolverTypeWrapper<Degree>;
  DegreeInput: DegreeInput;
  Facility: ResolverTypeWrapper<Facility>;
  HealthcareProfessional: ResolverTypeWrapper<HealthcareProfessional>;
  HealthcareProfessionalInput: HealthcareProfessionalInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Insurance: Insurance;
  LocaleName: ResolverTypeWrapper<LocaleName>;
  LocaleNameInput: LocaleNameInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Specialty: ResolverTypeWrapper<Specialty>;
  SpecialtyInput: SpecialtyInput;
  SpecialtyName: ResolverTypeWrapper<SpecialtyName>;
  SpecialtyNameInput: SpecialtyNameInput;
  SpokenLanguage: ResolverTypeWrapper<SpokenLanguage>;
  SpokenLanguageInput: SpokenLanguageInput;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Contact: Contact;
  Degree: Degree;
  DegreeInput: DegreeInput;
  Facility: Facility;
  HealthcareProfessional: HealthcareProfessional;
  HealthcareProfessionalInput: HealthcareProfessionalInput;
  ID: Scalars['ID'];
  LocaleName: LocaleName;
  LocaleNameInput: LocaleNameInput;
  Mutation: {};
  Query: {};
  Specialty: Specialty;
  SpecialtyInput: SpecialtyInput;
  SpecialtyName: SpecialtyName;
  SpecialtyNameInput: SpecialtyNameInput;
  SpokenLanguage: SpokenLanguage;
  SpokenLanguageInput: SpokenLanguageInput;
  String: Scalars['String'];
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mapsLink?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  website?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DegreeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Degree'] = ResolversParentTypes['Degree']> = {
  abbreviation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Facility'] = ResolversParentTypes['Facility']> = {
  contact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType>;
  healthcareProfessionals?: Resolver<Array<Maybe<ResolversTypes['HealthcareProfessional']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthcareProfessionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthcareProfessional'] = ResolversParentTypes['HealthcareProfessional']> = {
  acceptedInsurance?: Resolver<Array<Maybe<ResolversTypes['Insurance']>>, ParentType, ContextType>;
  degrees?: Resolver<Array<Maybe<ResolversTypes['Degree']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Array<Maybe<ResolversTypes['LocaleName']>>, ParentType, ContextType>;
  specialties?: Resolver<Array<Maybe<ResolversTypes['Specialty']>>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<Maybe<ResolversTypes['SpokenLanguage']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocaleNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocaleName'] = ResolversParentTypes['LocaleName']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createHealthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, Partial<MutationCreateHealthcareProfessionalArgs>>;
  updateHealthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<MutationUpdateHealthcareProfessionalArgs, 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  degree?: Resolver<Maybe<ResolversTypes['Degree']>, ParentType, ContextType, RequireFields<QueryDegreeArgs, 'id'>>;
  degrees?: Resolver<Maybe<Array<Maybe<ResolversTypes['Degree']>>>, ParentType, ContextType>;
  facilities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Facility']>>>, ParentType, ContextType>;
  facility?: Resolver<Maybe<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<QueryFacilityArgs, 'id'>>;
  healthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<QueryHealthcareProfessionalArgs, 'id'>>;
  healthcareProfessionals?: Resolver<Maybe<Array<Maybe<ResolversTypes['HealthcareProfessional']>>>, ParentType, ContextType>;
  specialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['Specialty']>>>, ParentType, ContextType>;
  specialty?: Resolver<Maybe<ResolversTypes['Specialty']>, ParentType, ContextType, RequireFields<QuerySpecialtyArgs, 'id'>>;
  spokenLanguage?: Resolver<Maybe<ResolversTypes['SpokenLanguage']>, ParentType, ContextType, RequireFields<QuerySpokenLanguageArgs, 'iso639_3'>>;
  spokenLanguages?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpokenLanguage']>>>, ParentType, ContextType>;
};

export type SpecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Specialty'] = ResolversParentTypes['Specialty']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpecialtyName']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpecialtyNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpecialtyName'] = ResolversParentTypes['SpecialtyName']> = {
  locale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpokenLanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpokenLanguage'] = ResolversParentTypes['SpokenLanguage']> = {
  iso639_3?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameNative?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Contact?: ContactResolvers<ContextType>;
  Degree?: DegreeResolvers<ContextType>;
  Facility?: FacilityResolvers<ContextType>;
  HealthcareProfessional?: HealthcareProfessionalResolvers<ContextType>;
  LocaleName?: LocaleNameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Specialty?: SpecialtyResolvers<ContextType>;
  SpecialtyName?: SpecialtyNameResolvers<ContextType>;
  SpokenLanguage?: SpokenLanguageResolvers<ContextType>;
};

