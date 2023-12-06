import { GraphQLResolveInfo } from 'graphql';
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
  address: PhysicalAddress;
  email: Scalars['String'];
  googleMapsUrl: Scalars['String'];
  phone: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};

export type ContactInput = {
  address: PhysicalAddressInput;
  email: Scalars['String'];
  googleMapsUrl: Scalars['String'];
  phone: Scalars['String'];
  website?: InputMaybe<Scalars['String']>;
};

export type CreateFacilityInput = {
  contact: ContactInput;
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['ID']>>;
  mapLatitude: Scalars['Float'];
  mapLongitude: Scalars['Float'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
};

export type CreateHealthcareProfessionalInput = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds: Array<Scalars['ID']>;
  names: Array<LocalizedNameInput>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type CreateSubmissionInput = {
  googleMapsUrl?: InputMaybe<Scalars['String']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export enum Degree {
  Cnm = 'CNM',
  Dc = 'DC',
  Dds = 'DDS',
  Dmd = 'DMD',
  Dnp = 'DNP',
  Do = 'DO',
  Dpm = 'DPM',
  Dpt = 'DPT',
  Dsw = 'DSW',
  DSc = 'DSc',
  Dvm = 'DVM',
  EdD = 'EdD',
  Md = 'MD',
  Np = 'NP',
  Pa = 'PA',
  PhD = 'PhD',
  PharmD = 'PharmD',
  PsyD = 'PsyD'
}

export type DeleteResult = {
  __typename?: 'DeleteResult';
  isSuccessful: Scalars['Boolean'];
};

export type Facility = {
  __typename?: 'Facility';
  contact: Contact;
  createdDate: Scalars['String'];
  healthcareProfessionalIds: Array<Scalars['ID']>;
  id: Scalars['ID'];
  mapLatitude: Scalars['Float'];
  mapLongitude: Scalars['Float'];
  nameEn: Scalars['String'];
  nameJa: Scalars['String'];
  updatedDate: Scalars['String'];
};

export type FacilitySearchFilters = {
  contact?: InputMaybe<ContactInput>;
  createdDate?: InputMaybe<Scalars['String']>;
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['String']>>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  nameEn?: InputMaybe<Scalars['String']>;
  nameJa?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type FacilitySubmission = {
  __typename?: 'FacilitySubmission';
  contact?: Maybe<Contact>;
  healthcareProfessionalIds: Array<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
  nameEn?: Maybe<Scalars['String']>;
  nameJa?: Maybe<Scalars['String']>;
};

export type HealthcareProfessional = {
  __typename?: 'HealthcareProfessional';
  acceptedInsurance: Array<Insurance>;
  createdDate: Scalars['String'];
  degrees: Array<Degree>;
  facilityIds: Array<Scalars['ID']>;
  id: Scalars['ID'];
  names: Array<LocalizedName>;
  specialties: Array<Specialty>;
  spokenLanguages: Array<Locale>;
  updatedDate: Scalars['String'];
};

export type HealthcareProfessionalSearchFilters = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  createdDate?: InputMaybe<Scalars['String']>;
  degrees?: InputMaybe<Array<Degree>>;
  limit?: InputMaybe<Scalars['Int']>;
  names?: InputMaybe<Array<LocalizedNameInput>>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type HealthcareProfessionalSubmission = {
  __typename?: 'HealthcareProfessionalSubmission';
  acceptedInsurance?: Maybe<Array<Insurance>>;
  degrees?: Maybe<Array<Degree>>;
  facilityIds: Array<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
  names: Array<LocalizedName>;
  specialties?: Maybe<Array<Specialty>>;
  spokenLanguages: Array<Locale>;
};

export enum Insurance {
  InsuranceNotAccepted = 'INSURANCE_NOT_ACCEPTED',
  InternationalHealthInsurance = 'INTERNATIONAL_HEALTH_INSURANCE',
  JapaneseHealthInsurance = 'JAPANESE_HEALTH_INSURANCE'
}

export enum Locale {
  AkGh = 'ak_GH',
  AmEt = 'am_ET',
  ArAe = 'ar_AE',
  BmMl = 'bm_ML',
  BnBd = 'bn_BD',
  BsBa = 'bs_BA',
  CaEs = 'ca_ES',
  ChrUs = 'chr_US',
  CsCz = 'cs_CZ',
  CyGb = 'cy_GB',
  DaDk = 'da_DK',
  DeDe = 'de_DE',
  EeGh = 'ee_GH',
  ElGr = 'el_GR',
  EnUs = 'en_US',
  EsEs = 'es_ES',
  EtEe = 'et_EE',
  FaAf = 'fa_AF',
  FiFi = 'fi_FI',
  FrFr = 'fr_FR',
  GuzKe = 'guz_KE',
  HeIl = 'he_IL',
  HiIn = 'hi_IN',
  HrHr = 'hr_HR',
  HuHu = 'hu_HU',
  HyAm = 'hy_AM',
  IdId = 'id_ID',
  IgNg = 'ig_NG',
  IsIs = 'is_IS',
  ItIt = 'it_IT',
  JaJp = 'ja_JP',
  KabDz = 'kab_DZ',
  KmKh = 'km_KH',
  KnIn = 'kn_IN',
  KoKr = 'ko_KR',
  LagTz = 'lag_TZ',
  LgUg = 'lg_UG',
  LvLv = 'lv_LV',
  NbNo = 'nb_NO',
  NeNp = 'ne_NP',
  NlBe = 'nl_BE',
  PlPl = 'pl_PL',
  PtBr = 'pt_BR',
  RuRu = 'ru_RU',
  SiLk = 'si_LK',
  SqAl = 'sq_AL',
  SrCyrl = 'sr_Cyrl',
  SwKe = 'sw_KE',
  ThTh = 'th_TH',
  TlPh = 'tl_PH',
  TrTr = 'tr_TR',
  ViVn = 'vi_VN',
  ZhCn = 'zh_CN',
  ZhHk = 'zh_HK',
  ZhTw = 'zh_TW'
}

export type LocalizedName = {
  __typename?: 'LocalizedName';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  locale: Locale;
  middleName?: Maybe<Scalars['String']>;
};

export type LocalizedNameInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  locale: Locale;
  middleName?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFacility?: Maybe<Facility>;
  createHealthcareProfessional?: Maybe<HealthcareProfessional>;
  createSubmission?: Maybe<Submission>;
  deleteFacility?: Maybe<DeleteResult>;
  deleteHealthcareProfessional?: Maybe<DeleteResult>;
  deleteSubmission?: Maybe<DeleteResult>;
  updateFacility?: Maybe<Facility>;
  updateHealthcareProfessional?: Maybe<HealthcareProfessional>;
  updateSubmission?: Maybe<Submission>;
};


export type MutationCreateFacilityArgs = {
  input: CreateFacilityInput;
};


export type MutationCreateHealthcareProfessionalArgs = {
  input: CreateHealthcareProfessionalInput;
};


export type MutationCreateSubmissionArgs = {
  input: CreateSubmissionInput;
};


export type MutationDeleteFacilityArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteHealthcareProfessionalArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubmissionArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateFacilityArgs = {
  id: Scalars['ID'];
  input: UpdateFacilityInput;
};


export type MutationUpdateHealthcareProfessionalArgs = {
  id: Scalars['ID'];
  input: UpdateHealthcareProfessionalInput;
};


export type MutationUpdateSubmissionArgs = {
  id: Scalars['ID'];
  input: UpdateSubmissionInput;
};

export type OrderBy = {
  fieldToOrder: Scalars['String'];
  orderDirection: OrderDirection;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PhysicalAddress = {
  __typename?: 'PhysicalAddress';
  addressLine1En: Scalars['String'];
  addressLine1Ja: Scalars['String'];
  addressLine2En: Scalars['String'];
  addressLine2Ja: Scalars['String'];
  cityEn: Scalars['String'];
  cityJa: Scalars['String'];
  postalCode: Scalars['String'];
  prefectureEn: Scalars['String'];
  prefectureJa: Scalars['String'];
};

export type PhysicalAddressInput = {
  addressLine1En: Scalars['String'];
  addressLine1Ja: Scalars['String'];
  addressLine2En: Scalars['String'];
  addressLine2Ja: Scalars['String'];
  cityEn: Scalars['String'];
  cityJa: Scalars['String'];
  postalCode: Scalars['String'];
  prefectureEn: Scalars['String'];
  prefectureJa: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  facilities?: Maybe<Array<Maybe<Facility>>>;
  facility?: Maybe<Facility>;
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  healthcareProfessionals?: Maybe<Array<Maybe<HealthcareProfessional>>>;
  submission?: Maybe<Submission>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
};


export type QueryFacilitiesArgs = {
  filters: FacilitySearchFilters;
};


export type QueryFacilityArgs = {
  id: Scalars['ID'];
};


export type QueryHealthcareProfessionalArgs = {
  id: Scalars['ID'];
};


export type QueryHealthcareProfessionalsArgs = {
  filters: HealthcareProfessionalSearchFilters;
};


export type QuerySubmissionArgs = {
  id: Scalars['ID'];
};


export type QuerySubmissionsArgs = {
  filters: SubmissionSearchFilters;
};

export type Relationship = {
  action: RelationshipAction;
  otherEntityId: Scalars['ID'];
};

export enum RelationshipAction {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export enum Specialty {
  AllergyAndImmunology = 'ALLERGY_AND_IMMUNOLOGY',
  Anesthesiology = 'ANESTHESIOLOGY',
  Dermatology = 'DERMATOLOGY',
  DiagnosticRadiology = 'DIAGNOSTIC_RADIOLOGY',
  EmergencyMedicine = 'EMERGENCY_MEDICINE',
  FamilyMedicine = 'FAMILY_MEDICINE',
  InternalMedicine = 'INTERNAL_MEDICINE',
  MedicalGenetics = 'MEDICAL_GENETICS',
  Neurology = 'NEUROLOGY',
  NuclearMedicine = 'NUCLEAR_MEDICINE',
  ObstetricsAndGynecology = 'OBSTETRICS_AND_GYNECOLOGY',
  Ophthalmology = 'OPHTHALMOLOGY',
  Pathology = 'PATHOLOGY',
  Pediatrics = 'PEDIATRICS',
  PhysicalMedicineAndRehabilitation = 'PHYSICAL_MEDICINE_AND_REHABILITATION',
  PreventiveMedicine = 'PREVENTIVE_MEDICINE',
  Psychiatry = 'PSYCHIATRY',
  RadiationOncology = 'RADIATION_ONCOLOGY',
  Surgery = 'SURGERY',
  Urology = 'UROLOGY'
}

export type Submission = {
  __typename?: 'Submission';
  createdDate: Scalars['String'];
  facility?: Maybe<FacilitySubmission>;
  googleMapsUrl: Scalars['String'];
  healthcareProfessionalName: Scalars['String'];
  healthcareProfessionals?: Maybe<Array<HealthcareProfessionalSubmission>>;
  id: Scalars['ID'];
  isApproved: Scalars['Boolean'];
  isRejected: Scalars['Boolean'];
  isUnderReview: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  spokenLanguages: Array<Locale>;
  updatedDate: Scalars['String'];
};

export type SubmissionSearchFilters = {
  createdDate?: InputMaybe<Scalars['String']>;
  googleMapsUrl?: InputMaybe<Scalars['String']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']>;
  isApproved?: InputMaybe<Scalars['Boolean']>;
  isRejected?: InputMaybe<Scalars['Boolean']>;
  isUnderReview?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type UpdateFacilityInput = {
  contact?: InputMaybe<ContactInput>;
  healthcareProfessionalIds?: InputMaybe<Array<Relationship>>;
  mapLatitude?: InputMaybe<Scalars['Float']>;
  mapLongitude?: InputMaybe<Scalars['Float']>;
  nameEn?: InputMaybe<Scalars['String']>;
  nameJa?: InputMaybe<Scalars['String']>;
};

export type UpdateHealthcareProfessionalInput = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds?: InputMaybe<Array<Relationship>>;
  names?: InputMaybe<Array<LocalizedNameInput>>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type UpdateSubmissionInput = {
  facility?: InputMaybe<CreateFacilityInput>;
  googleMapsUrl?: InputMaybe<Scalars['String']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']>;
  healthcareProfessionals?: InputMaybe<Array<CreateHealthcareProfessionalInput>>;
  isApproved?: InputMaybe<Scalars['Boolean']>;
  isRejected?: InputMaybe<Scalars['Boolean']>;
  isUnderReview?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
  ContactInput: ContactInput;
  CreateFacilityInput: CreateFacilityInput;
  CreateHealthcareProfessionalInput: CreateHealthcareProfessionalInput;
  CreateSubmissionInput: CreateSubmissionInput;
  Degree: Degree;
  DeleteResult: ResolverTypeWrapper<DeleteResult>;
  Facility: ResolverTypeWrapper<Facility>;
  FacilitySearchFilters: FacilitySearchFilters;
  FacilitySubmission: ResolverTypeWrapper<FacilitySubmission>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  HealthcareProfessional: ResolverTypeWrapper<HealthcareProfessional>;
  HealthcareProfessionalSearchFilters: HealthcareProfessionalSearchFilters;
  HealthcareProfessionalSubmission: ResolverTypeWrapper<HealthcareProfessionalSubmission>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Insurance: Insurance;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Locale: Locale;
  LocalizedName: ResolverTypeWrapper<LocalizedName>;
  LocalizedNameInput: LocalizedNameInput;
  Mutation: ResolverTypeWrapper<{}>;
  OrderBy: OrderBy;
  OrderDirection: OrderDirection;
  PhysicalAddress: ResolverTypeWrapper<PhysicalAddress>;
  PhysicalAddressInput: PhysicalAddressInput;
  Query: ResolverTypeWrapper<{}>;
  Relationship: Relationship;
  RelationshipAction: RelationshipAction;
  Specialty: Specialty;
  String: ResolverTypeWrapper<Scalars['String']>;
  Submission: ResolverTypeWrapper<Submission>;
  SubmissionSearchFilters: SubmissionSearchFilters;
  UpdateFacilityInput: UpdateFacilityInput;
  UpdateHealthcareProfessionalInput: UpdateHealthcareProfessionalInput;
  UpdateSubmissionInput: UpdateSubmissionInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Contact: Contact;
  ContactInput: ContactInput;
  CreateFacilityInput: CreateFacilityInput;
  CreateHealthcareProfessionalInput: CreateHealthcareProfessionalInput;
  CreateSubmissionInput: CreateSubmissionInput;
  DeleteResult: DeleteResult;
  Facility: Facility;
  FacilitySearchFilters: FacilitySearchFilters;
  FacilitySubmission: FacilitySubmission;
  Float: Scalars['Float'];
  HealthcareProfessional: HealthcareProfessional;
  HealthcareProfessionalSearchFilters: HealthcareProfessionalSearchFilters;
  HealthcareProfessionalSubmission: HealthcareProfessionalSubmission;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LocalizedName: LocalizedName;
  LocalizedNameInput: LocalizedNameInput;
  Mutation: {};
  OrderBy: OrderBy;
  PhysicalAddress: PhysicalAddress;
  PhysicalAddressInput: PhysicalAddressInput;
  Query: {};
  Relationship: Relationship;
  String: Scalars['String'];
  Submission: Submission;
  SubmissionSearchFilters: SubmissionSearchFilters;
  UpdateFacilityInput: UpdateFacilityInput;
  UpdateHealthcareProfessionalInput: UpdateHealthcareProfessionalInput;
  UpdateSubmissionInput: UpdateSubmissionInput;
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  address?: Resolver<ResolversTypes['PhysicalAddress'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  googleMapsUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteResult'] = ResolversParentTypes['DeleteResult']> = {
  isSuccessful?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Facility'] = ResolversParentTypes['Facility']> = {
  contact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  healthcareProfessionalIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mapLatitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  mapLongitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacilitySubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacilitySubmission'] = ResolversParentTypes['FacilitySubmission']> = {
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType>;
  healthcareProfessionalIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  nameEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nameJa?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthcareProfessionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthcareProfessional'] = ResolversParentTypes['HealthcareProfessional']> = {
  acceptedInsurance?: Resolver<Array<ResolversTypes['Insurance']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  degrees?: Resolver<Array<ResolversTypes['Degree']>, ParentType, ContextType>;
  facilityIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['LocalizedName']>, ParentType, ContextType>;
  specialties?: Resolver<Array<ResolversTypes['Specialty']>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<ResolversTypes['Locale']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthcareProfessionalSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthcareProfessionalSubmission'] = ResolversParentTypes['HealthcareProfessionalSubmission']> = {
  acceptedInsurance?: Resolver<Maybe<Array<ResolversTypes['Insurance']>>, ParentType, ContextType>;
  degrees?: Resolver<Maybe<Array<ResolversTypes['Degree']>>, ParentType, ContextType>;
  facilityIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['LocalizedName']>, ParentType, ContextType>;
  specialties?: Resolver<Maybe<Array<ResolversTypes['Specialty']>>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<ResolversTypes['Locale']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocalizedNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocalizedName'] = ResolversParentTypes['LocalizedName']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['Locale'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFacility?: Resolver<Maybe<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<MutationCreateFacilityArgs, 'input'>>;
  createHealthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<MutationCreateHealthcareProfessionalArgs, 'input'>>;
  createSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationCreateSubmissionArgs, 'input'>>;
  deleteFacility?: Resolver<Maybe<ResolversTypes['DeleteResult']>, ParentType, ContextType, RequireFields<MutationDeleteFacilityArgs, 'id'>>;
  deleteHealthcareProfessional?: Resolver<Maybe<ResolversTypes['DeleteResult']>, ParentType, ContextType, RequireFields<MutationDeleteHealthcareProfessionalArgs, 'id'>>;
  deleteSubmission?: Resolver<Maybe<ResolversTypes['DeleteResult']>, ParentType, ContextType, RequireFields<MutationDeleteSubmissionArgs, 'id'>>;
  updateFacility?: Resolver<Maybe<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<MutationUpdateFacilityArgs, 'id' | 'input'>>;
  updateHealthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<MutationUpdateHealthcareProfessionalArgs, 'id' | 'input'>>;
  updateSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationUpdateSubmissionArgs, 'id' | 'input'>>;
};

export type PhysicalAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['PhysicalAddress'] = ResolversParentTypes['PhysicalAddress']> = {
  addressLine1En?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressLine1Ja?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressLine2En?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressLine2Ja?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cityEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cityJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prefectureEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prefectureJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  facilities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Facility']>>>, ParentType, ContextType, RequireFields<QueryFacilitiesArgs, 'filters'>>;
  facility?: Resolver<Maybe<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<QueryFacilityArgs, 'id'>>;
  healthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<QueryHealthcareProfessionalArgs, 'id'>>;
  healthcareProfessionals?: Resolver<Maybe<Array<Maybe<ResolversTypes['HealthcareProfessional']>>>, ParentType, ContextType, RequireFields<QueryHealthcareProfessionalsArgs, 'filters'>>;
  submission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<QuerySubmissionArgs, 'id'>>;
  submissions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Submission']>>>, ParentType, ContextType, RequireFields<QuerySubmissionsArgs, 'filters'>>;
};

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  facility?: Resolver<Maybe<ResolversTypes['FacilitySubmission']>, ParentType, ContextType>;
  googleMapsUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  healthcareProfessionalName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  healthcareProfessionals?: Resolver<Maybe<Array<ResolversTypes['HealthcareProfessionalSubmission']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isApproved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRejected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isUnderReview?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<ResolversTypes['Locale']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Contact?: ContactResolvers<ContextType>;
  DeleteResult?: DeleteResultResolvers<ContextType>;
  Facility?: FacilityResolvers<ContextType>;
  FacilitySubmission?: FacilitySubmissionResolvers<ContextType>;
  HealthcareProfessional?: HealthcareProfessionalResolvers<ContextType>;
  HealthcareProfessionalSubmission?: HealthcareProfessionalSubmissionResolvers<ContextType>;
  LocalizedName?: LocalizedNameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PhysicalAddress?: PhysicalAddressResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
};

