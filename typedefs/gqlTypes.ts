import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ActionType {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export type AuditLog = {
  __typename?: 'AuditLog';
  actionType: ActionType;
  id: Scalars['ID']['output'];
  newValue?: Maybe<Scalars['String']['output']>;
  objectType: ObjectType;
  oldValue?: Maybe<Scalars['String']['output']>;
  schemaVersion: SchemaVersion;
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type Contact = {
  __typename?: 'Contact';
  address: PhysicalAddress;
  email?: Maybe<Scalars['String']['output']>;
  googleMapsUrl: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type ContactInput = {
  address: PhysicalAddressInput;
  email?: InputMaybe<Scalars['String']['input']>;
  googleMapsUrl: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFacilityInput = {
  contact: ContactInput;
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  mapLatitude: Scalars['Float']['input'];
  mapLongitude: Scalars['Float']['input'];
  nameEn: Scalars['String']['input'];
  nameJa: Scalars['String']['input'];
};

export type CreateHealthcareProfessionalInput = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  additionalInfoForPatients?: InputMaybe<Scalars['String']['input']>;
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds: Array<Scalars['ID']['input']>;
  names: Array<LocalizedNameInput>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type CreateReservationInput = {
  userId: Scalars['ID']['input'];
};

export type CreateSubmissionInput = {
  autofillPlaceFromSubmissionUrl?: InputMaybe<Scalars['Boolean']['input']>;
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type CreateUserInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  profilePicUrl?: InputMaybe<Scalars['String']['input']>;
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
  Mph = 'MPH',
  Np = 'NP',
  Od = 'OD',
  Pa = 'PA',
  PhD = 'PhD',
  PharmD = 'PharmD',
  PsyD = 'PsyD'
}

export type DeleteResult = {
  __typename?: 'DeleteResult';
  isSuccessful: Scalars['Boolean']['output'];
};

export type Facility = {
  __typename?: 'Facility';
  contact: Contact;
  createdDate: Scalars['String']['output'];
  healthcareProfessionalIds: Array<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  mapLatitude: Scalars['Float']['output'];
  mapLongitude: Scalars['Float']['output'];
  nameEn: Scalars['String']['output'];
  nameJa: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type FacilitySearchFilters = {
  contact?: InputMaybe<ContactInput>;
  createdDate?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['String']['input']>>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nameEn?: InputMaybe<Scalars['String']['input']>;
  nameJa?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

export type FacilitySubmission = {
  __typename?: 'FacilitySubmission';
  contact?: Maybe<Contact>;
  healthcareProfessionalIds: Array<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  mapLatitude?: Maybe<Scalars['Float']['output']>;
  mapLongitude?: Maybe<Scalars['Float']['output']>;
  nameEn?: Maybe<Scalars['String']['output']>;
  nameJa?: Maybe<Scalars['String']['output']>;
};

export type HealthcareProfessional = {
  __typename?: 'HealthcareProfessional';
  acceptedInsurance: Array<Insurance>;
  additionalInfoForPatients?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['String']['output'];
  degrees: Array<Degree>;
  facilityIds: Array<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  names: Array<LocalizedName>;
  specialties: Array<Specialty>;
  spokenLanguages: Array<Locale>;
  updatedDate: Scalars['String']['output'];
};

export type HealthcareProfessionalSearchFilters = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  createdDate?: InputMaybe<Scalars['String']['input']>;
  degrees?: InputMaybe<Array<Degree>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Array<LocalizedNameInput>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

export type HealthcareProfessionalSubmission = {
  __typename?: 'HealthcareProfessionalSubmission';
  acceptedInsurance?: Maybe<Array<Insurance>>;
  additionalInfoForPatients?: Maybe<Scalars['String']['output']>;
  degrees?: Maybe<Array<Degree>>;
  facilityIds: Array<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  names: Array<LocalizedName>;
  specialties?: Maybe<Array<Specialty>>;
  spokenLanguages: Array<Locale>;
};

export enum Insurance {
  InsuranceNotAccepted = 'INSURANCE_NOT_ACCEPTED',
  InternationalHealthInsurance = 'INTERNATIONAL_HEALTH_INSURANCE',
  JapaneseHealthInsurance = 'JAPANESE_HEALTH_INSURANCE',
  TravelInsurance = 'TRAVEL_INSURANCE',
  Uninsured = 'UNINSURED'
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
  MnMn = 'mn_MN',
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
  Und = 'und',
  ViVn = 'vi_VN',
  ZhCn = 'zh_CN',
  ZhHk = 'zh_HK',
  ZhTw = 'zh_TW'
}

export type LocalizedName = {
  __typename?: 'LocalizedName';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  locale: Locale;
  middleName?: Maybe<Scalars['String']['output']>;
};

export type LocalizedNameInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  locale: Locale;
  middleName?: InputMaybe<Scalars['String']['input']>;
};

export type ModerationAutofillDatabaseSubmissionInput = {
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFacility: Facility;
  createHealthcareProfessional: HealthcareProfessional;
  createReservation: Reservation;
  createSubmission: Submission;
  createUser: User;
  deleteFacility: DeleteResult;
  deleteHealthcareProfessional: DeleteResult;
  deleteSubmission: DeleteResult;
  moderationPanelUpdateSubmission: Submission;
  updateFacility: Facility;
  updateHealthcareProfessional: HealthcareProfessional;
  updateReservation: Reservation;
  updateSubmission: Submission;
  updateUser: User;
};


export type MutationCreateFacilityArgs = {
  input: CreateFacilityInput;
};


export type MutationCreateHealthcareProfessionalArgs = {
  input: CreateHealthcareProfessionalInput;
};


export type MutationCreateReservationArgs = {
  input: CreateReservationInput;
};


export type MutationCreateSubmissionArgs = {
  input: CreateSubmissionInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteFacilityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHealthcareProfessionalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationModerationPanelUpdateSubmissionArgs = {
  input: ModerationAutofillDatabaseSubmissionInput;
};


export type MutationUpdateFacilityArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFacilityInput;
};


export type MutationUpdateHealthcareProfessionalArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHealthcareProfessionalInput;
};


export type MutationUpdateReservationArgs = {
  input: UpdateReservationInput;
};


export type MutationUpdateSubmissionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSubmissionInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export enum ObjectType {
  Facility = 'Facility',
  HealthcareProfessional = 'HealthcareProfessional',
  Submission = 'Submission'
}

export type OrderBy = {
  fieldToOrder: Scalars['String']['input'];
  orderDirection: OrderDirection;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PhysicalAddress = {
  __typename?: 'PhysicalAddress';
  addressLine1En: Scalars['String']['output'];
  addressLine1Ja: Scalars['String']['output'];
  addressLine2En?: Maybe<Scalars['String']['output']>;
  addressLine2Ja?: Maybe<Scalars['String']['output']>;
  cityEn: Scalars['String']['output'];
  cityJa: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  prefectureEn: Scalars['String']['output'];
  prefectureJa: Scalars['String']['output'];
};

export type PhysicalAddressInput = {
  addressLine1En: Scalars['String']['input'];
  addressLine1Ja: Scalars['String']['input'];
  addressLine2En: Scalars['String']['input'];
  addressLine2Ja: Scalars['String']['input'];
  cityEn: Scalars['String']['input'];
  cityJa: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  prefectureEn: Scalars['String']['input'];
  prefectureJa: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  auditLog?: Maybe<AuditLog>;
  facilities: Array<Facility>;
  facilitiesTotalCount: Scalars['Int']['output'];
  facility?: Maybe<Facility>;
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  healthcareProfessionals: Array<HealthcareProfessional>;
  healthcareProfessionalsTotalCount: Scalars['Int']['output'];
  reservation?: Maybe<Reservation>;
  submission?: Maybe<Submission>;
  submissions: Array<Submission>;
  submissionsTotalCount: Scalars['Int']['output'];
  user?: Maybe<User>;
};


export type QueryAuditLogArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFacilitiesArgs = {
  filters: FacilitySearchFilters;
};


export type QueryFacilitiesTotalCountArgs = {
  filters: FacilitySearchFilters;
};


export type QueryFacilityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHealthcareProfessionalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHealthcareProfessionalsArgs = {
  filters: HealthcareProfessionalSearchFilters;
};


export type QueryHealthcareProfessionalsTotalCountArgs = {
  filters: HealthcareProfessionalSearchFilters;
};


export type QueryReservationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubmissionsArgs = {
  filters: SubmissionSearchFilters;
};


export type QuerySubmissionsTotalCountArgs = {
  filters: SubmissionSearchFilters;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Relationship = {
  action: RelationshipAction;
  otherEntityId: Scalars['ID']['input'];
};

export enum RelationshipAction {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE'
}

export type Reservation = {
  __typename?: 'Reservation';
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: ReservationStatus;
  updatedDate: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export enum ReservationStatus {
  Booked = 'BOOKED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED'
}

export enum SchemaVersion {
  V1 = 'V1'
}

export enum Specialty {
  AllergyAndImmunology = 'ALLERGY_AND_IMMUNOLOGY',
  Anesthesiology = 'ANESTHESIOLOGY',
  Cardiology = 'CARDIOLOGY',
  CosmeticSurgery = 'COSMETIC_SURGERY',
  Dentistry = 'DENTISTRY',
  Dermatology = 'DERMATOLOGY',
  DiagnosticRadiology = 'DIAGNOSTIC_RADIOLOGY',
  EmergencyMedicine = 'EMERGENCY_MEDICINE',
  EntSpecialist = 'ENT_SPECIALIST',
  FamilyMedicine = 'FAMILY_MEDICINE',
  GeneralMedicine = 'GENERAL_MEDICINE',
  InfectiousDiseases = 'INFECTIOUS_DISEASES',
  InternalMedicine = 'INTERNAL_MEDICINE',
  MedicalGenetics = 'MEDICAL_GENETICS',
  Neurology = 'NEUROLOGY',
  NuclearMedicine = 'NUCLEAR_MEDICINE',
  ObstetricsAndGynecology = 'OBSTETRICS_AND_GYNECOLOGY',
  Ophthalmology = 'OPHTHALMOLOGY',
  Optometry = 'OPTOMETRY',
  Orthodontics = 'ORTHODONTICS',
  OrthopedicSurgery = 'ORTHOPEDIC_SURGERY',
  Otolaryngology = 'OTOLARYNGOLOGY',
  Pathology = 'PATHOLOGY',
  Pediatrics = 'PEDIATRICS',
  Pharmacy = 'PHARMACY',
  PhysicalMedicineAndRehabilitation = 'PHYSICAL_MEDICINE_AND_REHABILITATION',
  Physiotherapy = 'PHYSIOTHERAPY',
  PlasticSurgery = 'PLASTIC_SURGERY',
  PreventiveMedicine = 'PREVENTIVE_MEDICINE',
  Proctology = 'PROCTOLOGY',
  Psychiatry = 'PSYCHIATRY',
  RadiationOncology = 'RADIATION_ONCOLOGY',
  SportsMedicine = 'SPORTS_MEDICINE',
  Surgery = 'SURGERY',
  Traumatology = 'TRAUMATOLOGY',
  Urology = 'UROLOGY'
}

export enum SpecialtyCategory {
  ChildrensHealth = 'CHILDRENS_HEALTH',
  CosmeticAndPlasticSurgery = 'COSMETIC_AND_PLASTIC_SURGERY',
  Dental = 'DENTAL',
  Dermatology = 'DERMATOLOGY',
  Ent = 'ENT',
  EyeAndVision = 'EYE_AND_VISION',
  MensHealth = 'MENS_HEALTH',
  MentalHealth = 'MENTAL_HEALTH',
  PhysicalTherapy = 'PHYSICAL_THERAPY',
  PrimaryCare = 'PRIMARY_CARE',
  SportsAndRehab = 'SPORTS_AND_REHAB',
  WomensHealth = 'WOMENS_HEALTH'
}

export type Submission = {
  __typename?: 'Submission';
  autofillPlaceFromSubmissionUrl?: Maybe<Scalars['Boolean']['output']>;
  createdDate: Scalars['String']['output'];
  facility?: Maybe<FacilitySubmission>;
  googleMapsUrl: Scalars['String']['output'];
  healthcareProfessionalName: Scalars['String']['output'];
  healthcareProfessionals?: Maybe<Array<HealthcareProfessionalSubmission>>;
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  isRejected: Scalars['Boolean']['output'];
  isUnderReview: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  spokenLanguages: Array<Locale>;
  updatedDate: Scalars['String']['output'];
};

export type SubmissionSearchFilters = {
  createdDate?: InputMaybe<Scalars['String']['input']>;
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  isRejected?: InputMaybe<Scalars['Boolean']['input']>;
  isUnderReview?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrderBy>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFacilityInput = {
  contact?: InputMaybe<ContactInput>;
  healthcareProfessionalIds?: InputMaybe<Array<Relationship>>;
  mapLatitude?: InputMaybe<Scalars['Float']['input']>;
  mapLongitude?: InputMaybe<Scalars['Float']['input']>;
  nameEn?: InputMaybe<Scalars['String']['input']>;
  nameJa?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHealthcareProfessionalInput = {
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  additionalInfoForPatients?: InputMaybe<Scalars['String']['input']>;
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds?: InputMaybe<Array<Relationship>>;
  names?: InputMaybe<Array<LocalizedNameInput>>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type UpdateReservationInput = {
  status: ReservationStatus;
  userId: Scalars['ID']['input'];
};

export type UpdateSubmissionInput = {
  autofillPlaceFromSubmissionUrl?: InputMaybe<Scalars['Boolean']['input']>;
  facility?: InputMaybe<CreateFacilityInput>;
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionals?: InputMaybe<Array<CreateHealthcareProfessionalInput>>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  isRejected?: InputMaybe<Scalars['Boolean']['input']>;
  isUnderReview?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type UpdateUserInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  profilePicUrl?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdDate: Scalars['String']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionType: ActionType;
  AuditLog: ResolverTypeWrapper<AuditLog>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contact: ResolverTypeWrapper<Contact>;
  ContactInput: ContactInput;
  CreateFacilityInput: CreateFacilityInput;
  CreateHealthcareProfessionalInput: CreateHealthcareProfessionalInput;
  CreateReservationInput: CreateReservationInput;
  CreateSubmissionInput: CreateSubmissionInput;
  CreateUserInput: CreateUserInput;
  Degree: Degree;
  DeleteResult: ResolverTypeWrapper<DeleteResult>;
  Facility: ResolverTypeWrapper<Facility>;
  FacilitySearchFilters: FacilitySearchFilters;
  FacilitySubmission: ResolverTypeWrapper<FacilitySubmission>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HealthcareProfessional: ResolverTypeWrapper<HealthcareProfessional>;
  HealthcareProfessionalSearchFilters: HealthcareProfessionalSearchFilters;
  HealthcareProfessionalSubmission: ResolverTypeWrapper<HealthcareProfessionalSubmission>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Insurance: Insurance;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Locale: Locale;
  LocalizedName: ResolverTypeWrapper<LocalizedName>;
  LocalizedNameInput: LocalizedNameInput;
  ModerationAutofillDatabaseSubmissionInput: ModerationAutofillDatabaseSubmissionInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ObjectType: ObjectType;
  OrderBy: OrderBy;
  OrderDirection: OrderDirection;
  PhysicalAddress: ResolverTypeWrapper<PhysicalAddress>;
  PhysicalAddressInput: PhysicalAddressInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Relationship: Relationship;
  RelationshipAction: RelationshipAction;
  Reservation: ResolverTypeWrapper<Reservation>;
  ReservationStatus: ReservationStatus;
  SchemaVersion: SchemaVersion;
  Specialty: Specialty;
  SpecialtyCategory: SpecialtyCategory;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Submission: ResolverTypeWrapper<Submission>;
  SubmissionSearchFilters: SubmissionSearchFilters;
  UpdateFacilityInput: UpdateFacilityInput;
  UpdateHealthcareProfessionalInput: UpdateHealthcareProfessionalInput;
  UpdateReservationInput: UpdateReservationInput;
  UpdateSubmissionInput: UpdateSubmissionInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuditLog: AuditLog;
  Boolean: Scalars['Boolean']['output'];
  Contact: Contact;
  ContactInput: ContactInput;
  CreateFacilityInput: CreateFacilityInput;
  CreateHealthcareProfessionalInput: CreateHealthcareProfessionalInput;
  CreateReservationInput: CreateReservationInput;
  CreateSubmissionInput: CreateSubmissionInput;
  CreateUserInput: CreateUserInput;
  DeleteResult: DeleteResult;
  Facility: Facility;
  FacilitySearchFilters: FacilitySearchFilters;
  FacilitySubmission: FacilitySubmission;
  Float: Scalars['Float']['output'];
  HealthcareProfessional: HealthcareProfessional;
  HealthcareProfessionalSearchFilters: HealthcareProfessionalSearchFilters;
  HealthcareProfessionalSubmission: HealthcareProfessionalSubmission;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LocalizedName: LocalizedName;
  LocalizedNameInput: LocalizedNameInput;
  ModerationAutofillDatabaseSubmissionInput: ModerationAutofillDatabaseSubmissionInput;
  Mutation: Record<PropertyKey, never>;
  OrderBy: OrderBy;
  PhysicalAddress: PhysicalAddress;
  PhysicalAddressInput: PhysicalAddressInput;
  Query: Record<PropertyKey, never>;
  Relationship: Relationship;
  Reservation: Reservation;
  String: Scalars['String']['output'];
  Submission: Submission;
  SubmissionSearchFilters: SubmissionSearchFilters;
  UpdateFacilityInput: UpdateFacilityInput;
  UpdateHealthcareProfessionalInput: UpdateHealthcareProfessionalInput;
  UpdateReservationInput: UpdateReservationInput;
  UpdateSubmissionInput: UpdateSubmissionInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type AuditLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuditLog'] = ResolversParentTypes['AuditLog']> = {
  actionType?: Resolver<ResolversTypes['ActionType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  newValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  objectType?: Resolver<ResolversTypes['ObjectType'], ParentType, ContextType>;
  oldValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schemaVersion?: Resolver<ResolversTypes['SchemaVersion'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  address?: Resolver<ResolversTypes['PhysicalAddress'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleMapsUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type DeleteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteResult'] = ResolversParentTypes['DeleteResult']> = {
  isSuccessful?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
};

export type FacilitySubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacilitySubmission'] = ResolversParentTypes['FacilitySubmission']> = {
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType>;
  healthcareProfessionalIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  mapLatitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  mapLongitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  nameEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nameJa?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type HealthcareProfessionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthcareProfessional'] = ResolversParentTypes['HealthcareProfessional']> = {
  acceptedInsurance?: Resolver<Array<ResolversTypes['Insurance']>, ParentType, ContextType>;
  additionalInfoForPatients?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  degrees?: Resolver<Array<ResolversTypes['Degree']>, ParentType, ContextType>;
  facilityIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['LocalizedName']>, ParentType, ContextType>;
  specialties?: Resolver<Array<ResolversTypes['Specialty']>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<ResolversTypes['Locale']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type HealthcareProfessionalSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthcareProfessionalSubmission'] = ResolversParentTypes['HealthcareProfessionalSubmission']> = {
  acceptedInsurance?: Resolver<Maybe<Array<ResolversTypes['Insurance']>>, ParentType, ContextType>;
  additionalInfoForPatients?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  degrees?: Resolver<Maybe<Array<ResolversTypes['Degree']>>, ParentType, ContextType>;
  facilityIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  names?: Resolver<Array<ResolversTypes['LocalizedName']>, ParentType, ContextType>;
  specialties?: Resolver<Maybe<Array<ResolversTypes['Specialty']>>, ParentType, ContextType>;
  spokenLanguages?: Resolver<Array<ResolversTypes['Locale']>, ParentType, ContextType>;
};

export type LocalizedNameResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocalizedName'] = ResolversParentTypes['LocalizedName']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['Locale'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFacility?: Resolver<ResolversTypes['Facility'], ParentType, ContextType, RequireFields<MutationCreateFacilityArgs, 'input'>>;
  createHealthcareProfessional?: Resolver<ResolversTypes['HealthcareProfessional'], ParentType, ContextType, RequireFields<MutationCreateHealthcareProfessionalArgs, 'input'>>;
  createReservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType, RequireFields<MutationCreateReservationArgs, 'input'>>;
  createSubmission?: Resolver<ResolversTypes['Submission'], ParentType, ContextType, RequireFields<MutationCreateSubmissionArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteFacility?: Resolver<ResolversTypes['DeleteResult'], ParentType, ContextType, RequireFields<MutationDeleteFacilityArgs, 'id'>>;
  deleteHealthcareProfessional?: Resolver<ResolversTypes['DeleteResult'], ParentType, ContextType, RequireFields<MutationDeleteHealthcareProfessionalArgs, 'id'>>;
  deleteSubmission?: Resolver<ResolversTypes['DeleteResult'], ParentType, ContextType, RequireFields<MutationDeleteSubmissionArgs, 'id'>>;
  moderationPanelUpdateSubmission?: Resolver<ResolversTypes['Submission'], ParentType, ContextType, RequireFields<MutationModerationPanelUpdateSubmissionArgs, 'input'>>;
  updateFacility?: Resolver<ResolversTypes['Facility'], ParentType, ContextType, RequireFields<MutationUpdateFacilityArgs, 'id' | 'input'>>;
  updateHealthcareProfessional?: Resolver<ResolversTypes['HealthcareProfessional'], ParentType, ContextType, RequireFields<MutationUpdateHealthcareProfessionalArgs, 'id' | 'input'>>;
  updateReservation?: Resolver<ResolversTypes['Reservation'], ParentType, ContextType, RequireFields<MutationUpdateReservationArgs, 'input'>>;
  updateSubmission?: Resolver<ResolversTypes['Submission'], ParentType, ContextType, RequireFields<MutationUpdateSubmissionArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
};

export type PhysicalAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['PhysicalAddress'] = ResolversParentTypes['PhysicalAddress']> = {
  addressLine1En?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressLine1Ja?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  addressLine2En?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressLine2Ja?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cityEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cityJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prefectureEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prefectureJa?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  auditLog?: Resolver<Maybe<ResolversTypes['AuditLog']>, ParentType, ContextType, Partial<QueryAuditLogArgs>>;
  facilities?: Resolver<Array<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<QueryFacilitiesArgs, 'filters'>>;
  facilitiesTotalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryFacilitiesTotalCountArgs, 'filters'>>;
  facility?: Resolver<Maybe<ResolversTypes['Facility']>, ParentType, ContextType, RequireFields<QueryFacilityArgs, 'id'>>;
  healthcareProfessional?: Resolver<Maybe<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<QueryHealthcareProfessionalArgs, 'id'>>;
  healthcareProfessionals?: Resolver<Array<ResolversTypes['HealthcareProfessional']>, ParentType, ContextType, RequireFields<QueryHealthcareProfessionalsArgs, 'filters'>>;
  healthcareProfessionalsTotalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryHealthcareProfessionalsTotalCountArgs, 'filters'>>;
  reservation?: Resolver<Maybe<ResolversTypes['Reservation']>, ParentType, ContextType, RequireFields<QueryReservationArgs, 'id'>>;
  submission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<QuerySubmissionArgs, 'id'>>;
  submissions?: Resolver<Array<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<QuerySubmissionsArgs, 'filters'>>;
  submissionsTotalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QuerySubmissionsTotalCountArgs, 'filters'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type ReservationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reservation'] = ResolversParentTypes['Reservation']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReservationStatus'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = {
  autofillPlaceFromSubmissionUrl?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  profilePicUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuditLog?: AuditLogResolvers<ContextType>;
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
  Reservation?: ReservationResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

