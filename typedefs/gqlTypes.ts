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

/** The type of action recorded in an audit log entry. */
export enum ActionType {
  /** A new entity was created. */
  Create = 'CREATE',
  /** An entity was deleted. */
  Delete = 'DELETE',
  /** An existing entity was modified. */
  Update = 'UPDATE'
}

/** A record of a create, update, or delete action performed on an entity. */
export type AuditLog = {
  __typename?: 'AuditLog';
  /** The type of action that was performed (create, update, or delete). */
  actionType: ActionType;
  /** Unique identifier for this audit log entry. */
  id: Scalars['ID']['output'];
  /** JSON representation of the object after the action (null for deletes). */
  newValue?: Maybe<Scalars['String']['output']>;
  /** The type of object that was affected. */
  objectType: ObjectType;
  /** JSON representation of the object before the action (null for creates). */
  oldValue?: Maybe<Scalars['String']['output']>;
  /** The schema version used when this log entry was created. */
  schemaVersion: SchemaVersion;
  /** Identifier of the user or system that performed the action. */
  updatedBy: Scalars['String']['output'];
  /** ISO 8601 timestamp of when the action was performed. */
  updatedDate: Scalars['String']['output'];
};

/** Contact information for a facility. */
export type Contact = {
  __typename?: 'Contact';
  /** Physical mailing address. */
  address: PhysicalAddress;
  /** Email address. */
  email?: Maybe<Scalars['String']['output']>;
  /** Google Maps URL for the facility location. */
  googleMapsUrl: Scalars['String']['output'];
  /** Phone number. */
  phone: Scalars['String']['output'];
  /** Website URL. */
  website?: Maybe<Scalars['String']['output']>;
};

/** Input for providing contact information. */
export type ContactInput = {
  /** Physical mailing address. */
  address: PhysicalAddressInput;
  /** Email address. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Google Maps URL for the facility location. */
  googleMapsUrl: Scalars['String']['input'];
  /** Phone number. */
  phone: Scalars['String']['input'];
  /** Website URL. */
  website?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new facility. */
export type CreateFacilityInput = {
  /** Contact information for the facility. */
  contact: ContactInput;
  /** IDs of healthcare professionals to associate with this facility. */
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Latitude coordinate for map placement. */
  mapLatitude: Scalars['Float']['input'];
  /** Longitude coordinate for map placement. */
  mapLongitude: Scalars['Float']['input'];
  /** Name of the facility in English. */
  nameEn: Scalars['String']['input'];
  /** Name of the facility in Japanese. */
  nameJa: Scalars['String']['input'];
};

/** Input for creating a new healthcare professional. */
export type CreateHealthcareProfessionalInput = {
  /** Insurance types accepted. */
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  /** Free-text notes or instructions for patients. */
  additionalInfoForPatients?: InputMaybe<Scalars['String']['input']>;
  /** Academic or professional degrees held. */
  degrees?: InputMaybe<Array<Degree>>;
  /** IDs of facilities where this professional practices. */
  facilityIds: Array<Scalars['ID']['input']>;
  /** Localized names (e.g. English and Japanese). */
  names: Array<LocalizedNameInput>;
  /** Medical specialties practiced. */
  specialties?: InputMaybe<Array<Specialty>>;
  /** Languages the professional speaks. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

/** Input for creating a new reservation. */
export type CreateReservationInput = {
  /** ID of the user making the reservation. */
  userId: Scalars['ID']['input'];
};

/** Input for creating a new community submission. */
export type CreateSubmissionInput = {
  /** Whether to autofill facility data from the Google Maps URL. */
  autofillPlaceFromSubmissionUrl?: InputMaybe<Scalars['Boolean']['input']>;
  /** Google Maps URL for the facility. */
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  /** Name of the healthcare professional being submitted. */
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  /** Optional notes from the submitter. */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Languages spoken by the healthcare professional. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

/** Input for creating a new user. */
export type CreateUserInput = {
  /** Display name shown in the UI. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** URL of the user's profile picture. */
  profilePicUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Academic or professional degrees held by healthcare professionals. */
export enum Degree {
  /** Certified Nurse Midwife */
  Cnm = 'CNM',
  /** Doctor of Chiropractic */
  Dc = 'DC',
  /** Doctor of Dental Surgery */
  Dds = 'DDS',
  /** Doctor of Dental Medicine */
  Dmd = 'DMD',
  /** Doctor of Nursing Practice */
  Dnp = 'DNP',
  /** Doctor of Osteopathic Medicine */
  Do = 'DO',
  /** Doctor of Podiatric Medicine */
  Dpm = 'DPM',
  /** Doctor of Physical Therapy */
  Dpt = 'DPT',
  /** Doctor of Social Work */
  Dsw = 'DSW',
  /** Doctor of Science */
  DSc = 'DSc',
  /** Doctor of Veterinary Medicine */
  Dvm = 'DVM',
  /** Doctor of Education */
  EdD = 'EdD',
  /** Medical Doctor */
  Md = 'MD',
  /** Master of Public Health */
  Mph = 'MPH',
  /** Nurse Practitioner */
  Np = 'NP',
  /** Doctor of Optometry */
  Od = 'OD',
  /** Physician Assistant */
  Pa = 'PA',
  /** Doctor of Philosophy */
  PhD = 'PhD',
  /** Doctor of Pharmacy */
  PharmD = 'PharmD',
  /** Doctor of Psychology */
  PsyD = 'PsyD'
}

/** Result returned from delete mutations indicating success or failure. */
export type DeleteResult = {
  __typename?: 'DeleteResult';
  /** Whether the delete operation completed successfully. */
  isSuccessful: Scalars['Boolean']['output'];
};

/** A medical facility (hospital, clinic, etc.) registered in the Find a Doc database. */
export type Facility = {
  __typename?: 'Facility';
  /** Contact information for the facility. */
  contact: Contact;
  /** ISO 8601 timestamp of when this facility was created. */
  createdDate: Scalars['String']['output'];
  /** IDs of healthcare professionals associated with this facility. */
  healthcareProfessionalIds: Array<Scalars['ID']['output']>;
  /** Unique identifier for the facility. */
  id: Scalars['ID']['output'];
  /** Latitude coordinate for map placement. */
  mapLatitude: Scalars['Float']['output'];
  /** Longitude coordinate for map placement. */
  mapLongitude: Scalars['Float']['output'];
  /** Name of the facility in English. */
  nameEn: Scalars['String']['output'];
  /** Name of the facility in Japanese. */
  nameJa: Scalars['String']['output'];
  /** ISO 8601 timestamp of the last update to this facility. */
  updatedDate: Scalars['String']['output'];
};

/** Search filters for querying facilities. All filters are combined with AND logic. */
export type FacilitySearchFilters = {
  /** Filter by contact information. */
  contact?: InputMaybe<ContactInput>;
  /** Filter by creation date (ISO 8601). */
  createdDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by associated healthcare professional IDs. */
  healthcareProfessionalIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by associated healthcare professional name. */
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  /** Maximum number of results to return. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by facility name in English (partial match). */
  nameEn?: InputMaybe<Scalars['String']['input']>;
  /** Filter by facility name in Japanese (partial match). */
  nameJa?: InputMaybe<Scalars['String']['input']>;
  /** Number of results to skip for pagination. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Ordering rules for the results. */
  orderBy?: InputMaybe<Array<OrderBy>>;
  /** Filter by last updated date (ISO 8601). */
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

/** Facility data embedded within a submission. */
export type FacilitySubmission = {
  __typename?: 'FacilitySubmission';
  /** Submitted contact information. */
  contact?: Maybe<Contact>;
  /** IDs of healthcare professionals associated with this facility. */
  healthcareProfessionalIds: Array<Scalars['ID']['output']>;
  /** ID of an existing facility, if this submission updates one. */
  id?: Maybe<Scalars['ID']['output']>;
  /** Submitted latitude coordinate. */
  mapLatitude?: Maybe<Scalars['Float']['output']>;
  /** Submitted longitude coordinate. */
  mapLongitude?: Maybe<Scalars['Float']['output']>;
  /** Submitted facility name in English. */
  nameEn?: Maybe<Scalars['String']['output']>;
  /** Submitted facility name in Japanese. */
  nameJa?: Maybe<Scalars['String']['output']>;
};

/** A healthcare professional registered in the Find a Doc database. */
export type HealthcareProfessional = {
  __typename?: 'HealthcareProfessional';
  /** Insurance types accepted by this professional. */
  acceptedInsurance: Array<Insurance>;
  /** Free-text notes or instructions for patients. */
  additionalInfoForPatients?: Maybe<Scalars['String']['output']>;
  /** ISO 8601 timestamp of when this record was created. */
  createdDate: Scalars['String']['output'];
  /** Academic or professional degrees held. */
  degrees: Array<Degree>;
  /** IDs of facilities where this professional practices. */
  facilityIds: Array<Scalars['ID']['output']>;
  /** Unique identifier for the healthcare professional. */
  id: Scalars['ID']['output'];
  /** Localized names of the healthcare professional (e.g. English and Japanese). */
  names: Array<LocalizedName>;
  /** Medical specialties practiced. */
  specialties: Array<Specialty>;
  /** Languages the healthcare professional speaks. */
  spokenLanguages: Array<Locale>;
  /** ISO 8601 timestamp of the last update to this record. */
  updatedDate: Scalars['String']['output'];
};

/** Search filters for querying healthcare professionals. All filters are combined with AND logic. */
export type HealthcareProfessionalSearchFilters = {
  /** Filter by accepted insurance types. */
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  /** Filter by creation date (ISO 8601). */
  createdDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by degrees. */
  degrees?: InputMaybe<Array<Degree>>;
  /** Filter by specific healthcare professional IDs. */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Maximum number of results to return. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by localized names. */
  names?: InputMaybe<Array<LocalizedNameInput>>;
  /** Number of results to skip for pagination. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Ordering rules for the results. */
  orderBy?: InputMaybe<Array<OrderBy>>;
  /** Filter by specialties. */
  specialties?: InputMaybe<Array<Specialty>>;
  /** Filter by spoken languages. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
  /** Filter by last updated date (ISO 8601). */
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

/** Healthcare professional data embedded within a submission. */
export type HealthcareProfessionalSubmission = {
  __typename?: 'HealthcareProfessionalSubmission';
  /** Submitted accepted insurance types. */
  acceptedInsurance?: Maybe<Array<Insurance>>;
  /** Submitted free-text notes for patients. */
  additionalInfoForPatients?: Maybe<Scalars['String']['output']>;
  /** Submitted degrees. */
  degrees?: Maybe<Array<Degree>>;
  /** IDs of facilities where this professional practices. */
  facilityIds: Array<Scalars['ID']['output']>;
  /** ID of an existing healthcare professional, if this submission updates one. */
  id?: Maybe<Scalars['ID']['output']>;
  /** Submitted localized names. */
  names: Array<LocalizedName>;
  /** Submitted specialties. */
  specialties?: Maybe<Array<Specialty>>;
  /** Submitted spoken languages. */
  spokenLanguages: Array<Locale>;
};

/** Insurance types that healthcare professionals may accept. */
export enum Insurance {
  /** The provider does not accept any insurance. */
  InsuranceNotAccepted = 'INSURANCE_NOT_ACCEPTED',
  /** International or overseas health insurance plans. */
  InternationalHealthInsurance = 'INTERNATIONAL_HEALTH_INSURANCE',
  /** Japanese national health insurance (kokumin kenko hoken / shakai hoken). */
  JapaneseHealthInsurance = 'JAPANESE_HEALTH_INSURANCE',
  /** Travel insurance with medical coverage. */
  TravelInsurance = 'TRAVEL_INSURANCE',
  /** For patients without insurance coverage. */
  Uninsured = 'UNINSURED'
}

/** Language and region locale codes (BCP 47 style). Used to represent spoken languages. */
export enum Locale {
  /** Akan (Ghana) */
  AkGh = 'ak_GH',
  /** Amharic (Ethiopia) */
  AmEt = 'am_ET',
  /** Arabic (United Arab Emirates) */
  ArAe = 'ar_AE',
  /** Bambara (Mali) */
  BmMl = 'bm_ML',
  /** Bengali (Bangladesh) */
  BnBd = 'bn_BD',
  /** Bosnian (Bosnia and Herzegovina) */
  BsBa = 'bs_BA',
  /** Catalan (Spain) */
  CaEs = 'ca_ES',
  /** Cherokee (United States) */
  ChrUs = 'chr_US',
  /** Czech (Czech Republic) */
  CsCz = 'cs_CZ',
  /** Welsh (United Kingdom) */
  CyGb = 'cy_GB',
  /** Danish (Denmark) */
  DaDk = 'da_DK',
  /** German (Germany) */
  DeDe = 'de_DE',
  /** Ewe (Ghana) */
  EeGh = 'ee_GH',
  /** Greek (Greece) */
  ElGr = 'el_GR',
  /** English (United States) */
  EnUs = 'en_US',
  /** Spanish (Spain) */
  EsEs = 'es_ES',
  /** Estonian (Estonia) */
  EtEe = 'et_EE',
  /** Persian (Afghanistan) */
  FaAf = 'fa_AF',
  /** Finnish (Finland) */
  FiFi = 'fi_FI',
  /** French (France) */
  FrFr = 'fr_FR',
  /** Gusii (Kenya) */
  GuzKe = 'guz_KE',
  /** Hebrew (Israel) */
  HeIl = 'he_IL',
  /** Hindi (India) */
  HiIn = 'hi_IN',
  /** Croatian (Croatia) */
  HrHr = 'hr_HR',
  /** Hungarian (Hungary) */
  HuHu = 'hu_HU',
  /** Armenian (Armenia) */
  HyAm = 'hy_AM',
  /** Indonesian (Indonesia) */
  IdId = 'id_ID',
  /** Igbo (Nigeria) */
  IgNg = 'ig_NG',
  /** Icelandic (Iceland) */
  IsIs = 'is_IS',
  /** Italian (Italy) */
  ItIt = 'it_IT',
  /** Japanese (Japan) */
  JaJp = 'ja_JP',
  /** Kabyle (Algeria) */
  KabDz = 'kab_DZ',
  /** Khmer (Cambodia) */
  KmKh = 'km_KH',
  /** Kannada (India) */
  KnIn = 'kn_IN',
  /** Korean (South Korea) */
  KoKr = 'ko_KR',
  /** Langi (Tanzania) */
  LagTz = 'lag_TZ',
  /** Ganda (Uganda) */
  LgUg = 'lg_UG',
  /** Latvian (Latvia) */
  LvLv = 'lv_LV',
  /** Mongolian (Mongolia) */
  MnMn = 'mn_MN',
  /** Norwegian Bokmal (Norway) */
  NbNo = 'nb_NO',
  /** Nepali (Nepal) */
  NeNp = 'ne_NP',
  /** Dutch (Belgium) */
  NlBe = 'nl_BE',
  /** Polish (Poland) */
  PlPl = 'pl_PL',
  /** Portuguese (Brazil) */
  PtBr = 'pt_BR',
  /** Russian (Russia) */
  RuRu = 'ru_RU',
  /** Sinhala (Sri Lanka) */
  SiLk = 'si_LK',
  /** Albanian (Albania) */
  SqAl = 'sq_AL',
  /** Serbian (Cyrillic) */
  SrCyrl = 'sr_Cyrl',
  /** Swahili (Kenya) */
  SwKe = 'sw_KE',
  /** Thai (Thailand) */
  ThTh = 'th_TH',
  /** Tagalog (Philippines) */
  TlPh = 'tl_PH',
  /** Turkish (Turkey) */
  TrTr = 'tr_TR',
  /** Unspecified Language (Undefined) */
  Und = 'und',
  /** Vietnamese (Vietnam) */
  ViVn = 'vi_VN',
  /** Chinese (Simplified, China) */
  ZhCn = 'zh_CN',
  /** Chinese (Traditional, Hong Kong SAR China) */
  ZhHk = 'zh_HK',
  /** Chinese (Traditional, Taiwan) */
  ZhTw = 'zh_TW'
}

/** A person's name localized to a specific language/locale. */
export type LocalizedName = {
  __typename?: 'LocalizedName';
  /** First (given) name. */
  firstName: Scalars['String']['output'];
  /** Last (family) name. */
  lastName: Scalars['String']['output'];
  /** The locale this name is written in. */
  locale: Locale;
  /** Middle name, if applicable. */
  middleName?: Maybe<Scalars['String']['output']>;
};

/** Input for providing a localized name. */
export type LocalizedNameInput = {
  /** First (given) name. */
  firstName: Scalars['String']['input'];
  /** Last (family) name. */
  lastName: Scalars['String']['input'];
  /** The locale this name is written in. */
  locale: Locale;
  /** Middle name, if applicable. */
  middleName?: InputMaybe<Scalars['String']['input']>;
};

/** Input for autofilling a submission from a Google Maps URL during moderation. */
export type ModerationAutofillDatabaseSubmissionInput = {
  /** Google Maps URL to extract facility data from. */
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  /** ID of the submission to autofill. */
  id?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new facility record. */
  createFacility: Facility;
  /** Create a new healthcare professional record. */
  createHealthcareProfessional: HealthcareProfessional;
  /** Create a new reservation. */
  createReservation: Reservation;
  /** Create a new community submission for a healthcare professional or facility. */
  createSubmission: Submission;
  /** Create a new user account. */
  createUser: User;
  /** Delete a facility by ID. */
  deleteFacility: DeleteResult;
  /** Delete a healthcare professional by ID. */
  deleteHealthcareProfessional: DeleteResult;
  /** Delete a submission by ID. */
  deleteSubmission: DeleteResult;
  /** Autofill a submission with data from a Google Maps URL during the moderation process. */
  moderationPanelUpdateSubmission: Submission;
  /** Update an existing facility by ID. */
  updateFacility: Facility;
  /** Update an existing healthcare professional by ID. */
  updateHealthcareProfessional: HealthcareProfessional;
  /** Update an existing reservation. */
  updateReservation: Reservation;
  /** Update an existing submission by ID. */
  updateSubmission: Submission;
  /** Update an existing user by ID. */
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

/** The type of entity affected by an audited action. */
export enum ObjectType {
  /** A facility entity. */
  Facility = 'Facility',
  /** A healthcare professional entity. */
  HealthcareProfessional = 'HealthcareProfessional',
  /** A submission entity. */
  Submission = 'Submission'
}

/** Specifies a field and direction to order query results by. */
export type OrderBy = {
  /** The name of the field to sort by (e.g. 'createdDate', 'nameEn'). */
  fieldToOrder: Scalars['String']['input'];
  /** The direction to sort (ascending or descending). */
  orderDirection: OrderDirection;
};

/** Sort direction for ordering query results. */
export enum OrderDirection {
  /** Ascending order (A-Z, oldest first, lowest first). */
  Asc = 'asc',
  /** Descending order (Z-A, newest first, highest first). */
  Desc = 'desc'
}

/** A physical address with bilingual (English and Japanese) fields. */
export type PhysicalAddress = {
  __typename?: 'PhysicalAddress';
  /** Primary address line in English. */
  addressLine1En: Scalars['String']['output'];
  /** Primary address line in Japanese. */
  addressLine1Ja: Scalars['String']['output'];
  /** Secondary address line in English (e.g. building, floor). */
  addressLine2En?: Maybe<Scalars['String']['output']>;
  /** Secondary address line in Japanese (e.g. building, floor). */
  addressLine2Ja?: Maybe<Scalars['String']['output']>;
  /** City name in English. */
  cityEn: Scalars['String']['output'];
  /** City name in Japanese. */
  cityJa: Scalars['String']['output'];
  /** Postal / zip code. */
  postalCode: Scalars['String']['output'];
  /** Prefecture name in English. */
  prefectureEn: Scalars['String']['output'];
  /** Prefecture name in Japanese. */
  prefectureJa: Scalars['String']['output'];
};

/** Input for providing a physical address with bilingual fields. */
export type PhysicalAddressInput = {
  /** Primary address line in English. */
  addressLine1En: Scalars['String']['input'];
  /** Primary address line in Japanese. */
  addressLine1Ja: Scalars['String']['input'];
  /** Secondary address line in English (e.g. building, floor). */
  addressLine2En: Scalars['String']['input'];
  /** Secondary address line in Japanese (e.g. building, floor). */
  addressLine2Ja: Scalars['String']['input'];
  /** City name in English. */
  cityEn: Scalars['String']['input'];
  /** City name in Japanese. */
  cityJa: Scalars['String']['input'];
  /** Postal / zip code. */
  postalCode: Scalars['String']['input'];
  /** Prefecture name in English. */
  prefectureEn: Scalars['String']['input'];
  /** Prefecture name in Japanese. */
  prefectureJa: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Look up a single audit log entry by its ID. Returns null if not found. */
  auditLog?: Maybe<AuditLog>;
  /** Search for facilities matching the given filters. Returns an empty list if no matches. */
  facilities: Array<Facility>;
  /** Get the total count of facilities matching the given filters. Useful for pagination. */
  facilitiesTotalCount: Scalars['Int']['output'];
  /** Look up a single facility by its unique ID. Returns null if not found. */
  facility?: Maybe<Facility>;
  /** Look up a single healthcare professional by their unique ID. Returns null if not found. */
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  /** Search for healthcare professionals matching the given filters. Returns an empty list if no matches. */
  healthcareProfessionals: Array<HealthcareProfessional>;
  /** Get the total count of healthcare professionals matching the given filters. Useful for pagination. */
  healthcareProfessionalsTotalCount: Scalars['Int']['output'];
  /** Look up a single reservation by its unique ID. Returns null if not found. */
  reservation?: Maybe<Reservation>;
  /** Look up a single submission by its unique ID. Returns null if not found. */
  submission?: Maybe<Submission>;
  /** Search for submissions matching the given filters. Returns an empty list if no matches. */
  submissions: Array<Submission>;
  /** Get the total count of submissions matching the given filters. Useful for pagination. */
  submissionsTotalCount: Scalars['Int']['output'];
  /** Look up a single user by their unique ID. Returns null if not found. */
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

/** Describes a relationship change for an ID in a list — whether to add, update, or remove it. */
export type Relationship = {
  /** The action to perform on this relationship. */
  action: RelationshipAction;
  /** The ID of the related entity. */
  otherEntityId: Scalars['ID']['input'];
};

/** The action to perform on a relationship between entities. */
export enum RelationshipAction {
  /** Add a new relationship. */
  Create = 'CREATE',
  /** Remove the relationship. */
  Delete = 'DELETE',
  /** Update an existing relationship. */
  Update = 'UPDATE'
}

/** A reservation made by a user (e.g. for an appointment). */
export type Reservation = {
  __typename?: 'Reservation';
  /** ISO 8601 timestamp of when this reservation was created. */
  createdDate: Scalars['String']['output'];
  /** Unique identifier for the reservation. */
  id: Scalars['ID']['output'];
  /** Current status of the reservation. */
  status: ReservationStatus;
  /** ISO 8601 timestamp of the last update to this reservation. */
  updatedDate: Scalars['String']['output'];
  /** ID of the user who made this reservation. */
  userId: Scalars['ID']['output'];
};

/** The current status of a reservation. */
export enum ReservationStatus {
  /** The reservation is confirmed and active. */
  Booked = 'BOOKED',
  /** The reservation has been cancelled. */
  Cancelled = 'CANCELLED',
  /** The reservation has been fulfilled. */
  Completed = 'COMPLETED'
}

/** The schema version used for audit log serialization. */
export enum SchemaVersion {
  /** Version 1 of the audit log schema. */
  V1 = 'V1'
}

/** Medical specialties that a healthcare professional may practice. */
export enum Specialty {
  /** Allergy and Immunology */
  AllergyAndImmunology = 'ALLERGY_AND_IMMUNOLOGY',
  /** Anesthesiology */
  Anesthesiology = 'ANESTHESIOLOGY',
  /** Cardiology */
  Cardiology = 'CARDIOLOGY',
  /** Cosmetic Surgery */
  CosmeticSurgery = 'COSMETIC_SURGERY',
  /** Dentistry */
  Dentistry = 'DENTISTRY',
  /** Dermatology */
  Dermatology = 'DERMATOLOGY',
  /** Diagnostic Radiology */
  DiagnosticRadiology = 'DIAGNOSTIC_RADIOLOGY',
  /** Emergency Medicine */
  EmergencyMedicine = 'EMERGENCY_MEDICINE',
  /** Ear, Nose, and Throat (ENT) */
  EntSpecialist = 'ENT_SPECIALIST',
  /** Family Medicine */
  FamilyMedicine = 'FAMILY_MEDICINE',
  /** General Medicine */
  GeneralMedicine = 'GENERAL_MEDICINE',
  /** Infectious Diseases */
  InfectiousDiseases = 'INFECTIOUS_DISEASES',
  /** Internal Medicine */
  InternalMedicine = 'INTERNAL_MEDICINE',
  /** Medical Genetics */
  MedicalGenetics = 'MEDICAL_GENETICS',
  /** Neurology */
  Neurology = 'NEUROLOGY',
  /** Nuclear Medicine */
  NuclearMedicine = 'NUCLEAR_MEDICINE',
  /** Obstetrics and Gynecology */
  ObstetricsAndGynecology = 'OBSTETRICS_AND_GYNECOLOGY',
  /** Ophthalmology */
  Ophthalmology = 'OPHTHALMOLOGY',
  /** Optometry */
  Optometry = 'OPTOMETRY',
  /** Orthodontics */
  Orthodontics = 'ORTHODONTICS',
  /** Orthopedic Surgery */
  OrthopedicSurgery = 'ORTHOPEDIC_SURGERY',
  /** Otolaryngology */
  Otolaryngology = 'OTOLARYNGOLOGY',
  /** Pathology */
  Pathology = 'PATHOLOGY',
  /** Pediatrics */
  Pediatrics = 'PEDIATRICS',
  /** Pharmacy */
  Pharmacy = 'PHARMACY',
  /** Physical Medicine and Rehabilitation */
  PhysicalMedicineAndRehabilitation = 'PHYSICAL_MEDICINE_AND_REHABILITATION',
  /** Physiotherapy */
  Physiotherapy = 'PHYSIOTHERAPY',
  /** Plastic Surgery */
  PlasticSurgery = 'PLASTIC_SURGERY',
  /** Preventive Medicine */
  PreventiveMedicine = 'PREVENTIVE_MEDICINE',
  /** Proctology */
  Proctology = 'PROCTOLOGY',
  /** Psychiatry */
  Psychiatry = 'PSYCHIATRY',
  /** Radiation Oncology */
  RadiationOncology = 'RADIATION_ONCOLOGY',
  /** Sports Medicine */
  SportsMedicine = 'SPORTS_MEDICINE',
  /** General Surgery */
  Surgery = 'SURGERY',
  /** Traumatology */
  Traumatology = 'TRAUMATOLOGY',
  /** Urology */
  Urology = 'UROLOGY'
}

/** Grouping categories for medical specialties, used for filtering in the UI. */
export enum SpecialtyCategory {
  /** Children's health and pediatric specialties. */
  ChildrensHealth = 'CHILDRENS_HEALTH',
  /** Cosmetic and plastic surgery specialties. */
  CosmeticAndPlasticSurgery = 'COSMETIC_AND_PLASTIC_SURGERY',
  /** Dental specialties. */
  Dental = 'DENTAL',
  /** Dermatology specialties. */
  Dermatology = 'DERMATOLOGY',
  /** Ear, Nose, and Throat specialties. */
  Ent = 'ENT',
  /** Eye and vision care specialties. */
  EyeAndVision = 'EYE_AND_VISION',
  /** Men's health specialties. */
  MensHealth = 'MENS_HEALTH',
  /** Mental health specialties. */
  MentalHealth = 'MENTAL_HEALTH',
  /** Physical therapy specialties. */
  PhysicalTherapy = 'PHYSICAL_THERAPY',
  /** Primary care specialties. */
  PrimaryCare = 'PRIMARY_CARE',
  /** Sports medicine and rehabilitation specialties. */
  SportsAndRehab = 'SPORTS_AND_REHAB',
  /** Women's health specialties. */
  WomensHealth = 'WOMENS_HEALTH'
}

/** A community-submitted suggestion for adding or updating a healthcare professional or facility. */
export type Submission = {
  __typename?: 'Submission';
  /** Whether to autofill facility data from the Google Maps URL. */
  autofillPlaceFromSubmissionUrl?: Maybe<Scalars['Boolean']['output']>;
  /** ISO 8601 timestamp of when this submission was created. */
  createdDate: Scalars['String']['output'];
  /** Facility data included in this submission. */
  facility?: Maybe<FacilitySubmission>;
  /** Google Maps URL for the facility associated with this submission. */
  googleMapsUrl: Scalars['String']['output'];
  /** Name of the healthcare professional being submitted. */
  healthcareProfessionalName: Scalars['String']['output'];
  /** Healthcare professional data included in this submission. */
  healthcareProfessionals?: Maybe<Array<HealthcareProfessionalSubmission>>;
  /** Unique identifier for the submission. */
  id: Scalars['ID']['output'];
  /** Whether this submission has been approved by a moderator. */
  isApproved: Scalars['Boolean']['output'];
  /** Whether this submission has been rejected by a moderator. */
  isRejected: Scalars['Boolean']['output'];
  /** Whether this submission is currently under review by a moderator. */
  isUnderReview: Scalars['Boolean']['output'];
  /** Optional notes from the submitter or moderator. */
  notes?: Maybe<Scalars['String']['output']>;
  /** Languages spoken by the submitted healthcare professional. */
  spokenLanguages: Array<Locale>;
  /** ISO 8601 timestamp of the last update to this submission. */
  updatedDate: Scalars['String']['output'];
};

/** Search filters for querying submissions. All filters are combined with AND logic. */
export type SubmissionSearchFilters = {
  /** Filter by creation date (ISO 8601). */
  createdDate?: InputMaybe<Scalars['String']['input']>;
  /** Filter by Google Maps URL. */
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  /** Filter by healthcare professional name. */
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  /** Filter to approved submissions. */
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter to rejected submissions. */
  isRejected?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter to submissions under review. */
  isUnderReview?: InputMaybe<Scalars['Boolean']['input']>;
  /** Maximum number of results to return. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Number of results to skip for pagination. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Ordering rules for the results. */
  orderBy?: InputMaybe<Array<OrderBy>>;
  /** Filter by spoken languages. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
  /** Filter by last updated date (ISO 8601). */
  updatedDate?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing facility. All fields are optional — only provided fields are updated. */
export type UpdateFacilityInput = {
  /** Updated contact information. */
  contact?: InputMaybe<ContactInput>;
  /** Healthcare professional relationships to add, update, or remove. */
  healthcareProfessionalIds?: InputMaybe<Array<Relationship>>;
  /** Updated latitude coordinate. */
  mapLatitude?: InputMaybe<Scalars['Float']['input']>;
  /** Updated longitude coordinate. */
  mapLongitude?: InputMaybe<Scalars['Float']['input']>;
  /** Updated name of the facility in English. */
  nameEn?: InputMaybe<Scalars['String']['input']>;
  /** Updated name of the facility in Japanese. */
  nameJa?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating an existing healthcare professional. All fields are optional — only provided fields are updated. */
export type UpdateHealthcareProfessionalInput = {
  /** Updated accepted insurance types. */
  acceptedInsurance?: InputMaybe<Array<Insurance>>;
  /** Updated free-text notes or instructions for patients. */
  additionalInfoForPatients?: InputMaybe<Scalars['String']['input']>;
  /** Updated degrees. */
  degrees?: InputMaybe<Array<Degree>>;
  /** Facility relationships to add, update, or remove. */
  facilityIds?: InputMaybe<Array<Relationship>>;
  /** Updated localized names. */
  names?: InputMaybe<Array<LocalizedNameInput>>;
  /** Updated specialties. */
  specialties?: InputMaybe<Array<Specialty>>;
  /** Updated spoken languages. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

/** Input for updating an existing reservation. */
export type UpdateReservationInput = {
  /** New status for the reservation. */
  status: ReservationStatus;
  /** ID of the user who owns the reservation. */
  userId: Scalars['ID']['input'];
};

/** Input for updating an existing submission. Used during the moderation review process. */
export type UpdateSubmissionInput = {
  /** Whether to autofill facility data from the Google Maps URL. */
  autofillPlaceFromSubmissionUrl?: InputMaybe<Scalars['Boolean']['input']>;
  /** Facility data to associate with this submission. */
  facility?: InputMaybe<CreateFacilityInput>;
  /** Updated Google Maps URL. */
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  /** Updated healthcare professional name. */
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  /** Healthcare professional data to associate with this submission. */
  healthcareProfessionals?: InputMaybe<Array<CreateHealthcareProfessionalInput>>;
  /** Set whether the submission is approved. */
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  /** Set whether the submission is rejected. */
  isRejected?: InputMaybe<Scalars['Boolean']['input']>;
  /** Set whether the submission is under review. */
  isUnderReview?: InputMaybe<Scalars['Boolean']['input']>;
  /** Optional notes from the moderator. */
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Updated spoken languages. */
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

/** Input for updating an existing user. */
export type UpdateUserInput = {
  /** Updated display name. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** Updated profile picture URL. */
  profilePicUrl?: InputMaybe<Scalars['String']['input']>;
};

/** A registered user of the Find a Doc platform. */
export type User = {
  __typename?: 'User';
  /** ISO 8601 timestamp of when this user was created. */
  createdDate: Scalars['String']['output'];
  /** Display name shown in the UI. */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the user. */
  id: Scalars['ID']['output'];
  /** URL of the user's profile picture. */
  profilePicUrl?: Maybe<Scalars['String']['output']>;
  /** ISO 8601 timestamp of the last update to this user. */
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

