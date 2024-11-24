/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  newValue: Scalars['String']['output'];
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
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds: Array<Scalars['ID']['input']>;
  names: Array<LocalizedNameInput>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type CreateSubmissionInput = {
  googleMapsUrl?: InputMaybe<Scalars['String']['input']>;
  healthcareProfessionalName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
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
  Mph = 'MPH',
  Np = 'NP',
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
  id: Scalars['ID']['input'];
};


export type MutationDeleteHealthcareProfessionalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateFacilityArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFacilityInput;
};


export type MutationUpdateHealthcareProfessionalArgs = {
  id: Scalars['ID']['input'];
  input: UpdateHealthcareProfessionalInput;
};


export type MutationUpdateSubmissionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSubmissionInput;
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
  addressLine2En: Scalars['String']['output'];
  addressLine2Ja: Scalars['String']['output'];
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
  facilities?: Maybe<Array<Maybe<Facility>>>;
  facility?: Maybe<Facility>;
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  healthcareProfessionals?: Maybe<Array<Maybe<HealthcareProfessional>>>;
  submission?: Maybe<Submission>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
};


export type QueryAuditLogArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFacilitiesArgs = {
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


export type QuerySubmissionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubmissionsArgs = {
  filters: SubmissionSearchFilters;
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

export enum SchemaVersion {
  V1 = 'V1'
}

export enum Specialty {
  AllergyAndImmunology = 'ALLERGY_AND_IMMUNOLOGY',
  Anesthesiology = 'ANESTHESIOLOGY',
  Dermatology = 'DERMATOLOGY',
  DiagnosticRadiology = 'DIAGNOSTIC_RADIOLOGY',
  EmergencyMedicine = 'EMERGENCY_MEDICINE',
  FamilyMedicine = 'FAMILY_MEDICINE',
  GeneralMedicine = 'GENERAL_MEDICINE',
  InfectiousDiseases = 'INFECTIOUS_DISEASES',
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
  degrees?: InputMaybe<Array<Degree>>;
  facilityIds?: InputMaybe<Array<Relationship>>;
  names?: InputMaybe<Array<LocalizedNameInput>>;
  specialties?: InputMaybe<Array<Specialty>>;
  spokenLanguages?: InputMaybe<Array<Locale>>;
};

export type UpdateSubmissionInput = {
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

export type GetAllFacilitiesQueryVariables = Exact<{
  filters: FacilitySearchFilters;
}>;


export type GetAllFacilitiesQuery = { __typename?: 'Query', facilities?: Array<{ __typename?: 'Facility', id: string, nameEn: string, nameJa: string, mapLatitude: number, mapLongitude: number, healthcareProfessionalIds: Array<string>, createdDate: string, updatedDate: string, contact: { __typename?: 'Contact', googleMapsUrl: string, email?: string | null, phone: string, website?: string | null, address: { __typename?: 'PhysicalAddress', postalCode: string, prefectureEn: string, cityEn: string, addressLine1En: string, addressLine2En: string, prefectureJa: string, cityJa: string, addressLine1Ja: string, addressLine2Ja: string } } } | null> | null };

export type UpdateFacilityMutationVariables = Exact<{
  updateFacilityId: Scalars['ID']['input'];
  input: UpdateFacilityInput;
}>;


export type UpdateFacilityMutation = { __typename?: 'Mutation', updateFacility?: { __typename?: 'Facility', id: string, nameEn: string, nameJa: string, mapLatitude: number, mapLongitude: number, healthcareProfessionalIds: Array<string>, createdDate: string, updatedDate: string, contact: { __typename?: 'Contact', googleMapsUrl: string, email?: string | null, phone: string, website?: string | null, address: { __typename?: 'PhysicalAddress', postalCode: string, prefectureEn: string, cityEn: string, addressLine1En: string, addressLine2En: string, prefectureJa: string, cityJa: string, addressLine1Ja: string, addressLine2Ja: string } } } | null };

export type DeleteFacilityMutationVariables = Exact<{
  deleteFacilityId: Scalars['ID']['input'];
}>;


export type DeleteFacilityMutation = { __typename?: 'Mutation', deleteFacility?: { __typename?: 'DeleteResult', isSuccessful: boolean } | null };

export type GetAllHealthcareProfessionalsQueryVariables = Exact<{
  filters: HealthcareProfessionalSearchFilters;
}>;


export type GetAllHealthcareProfessionalsQuery = { __typename?: 'Query', healthcareProfessionals?: Array<{ __typename?: 'HealthcareProfessional', id: string, spokenLanguages: Array<Locale>, degrees: Array<Degree>, specialties: Array<Specialty>, acceptedInsurance: Array<Insurance>, facilityIds: Array<string>, createdDate: string, updatedDate: string, names: Array<{ __typename?: 'LocalizedName', firstName: string, middleName?: string | null, lastName: string, locale: Locale }> } | null> | null };

export type GetHealthcareProfessionalQueryVariables = Exact<{
  healthcareProfessionalId: Scalars['ID']['input'];
}>;


export type GetHealthcareProfessionalQuery = { __typename?: 'Query', healthcareProfessional?: { __typename?: 'HealthcareProfessional', id: string, specialties: Array<Specialty>, names: Array<{ __typename?: 'LocalizedName', firstName: string, lastName: string }> } | null };

export type UpdatedHealthcareProfessionalMutationVariables = Exact<{
  updateHealthcareProfessionalId: Scalars['ID']['input'];
  input: UpdateHealthcareProfessionalInput;
}>;


export type UpdatedHealthcareProfessionalMutation = { __typename?: 'Mutation', updateHealthcareProfessional?: { __typename?: 'HealthcareProfessional', id: string, spokenLanguages: Array<Locale>, degrees: Array<Degree>, specialties: Array<Specialty>, acceptedInsurance: Array<Insurance>, facilityIds: Array<string>, createdDate: string, updatedDate: string, names: Array<{ __typename?: 'LocalizedName', firstName: string, middleName?: string | null, lastName: string, locale: Locale }> } | null };

export type DeleteHealthcareProfessionalMutationVariables = Exact<{
  deleteHealthcareProfessionalId: Scalars['ID']['input'];
}>;


export type DeleteHealthcareProfessionalMutation = { __typename?: 'Mutation', deleteHealthcareProfessional?: { __typename?: 'DeleteResult', isSuccessful: boolean } | null };

export type SearchFacilitiesDropdownQueryVariables = Exact<{
  filters: FacilitySearchFilters;
}>;


export type SearchFacilitiesDropdownQuery = { __typename?: 'Query', facilities?: Array<{ __typename?: 'Facility', id: string, contact: { __typename?: 'Contact', address: { __typename?: 'PhysicalAddress', cityJa: string, cityEn: string } } } | null> | null };

export type GetAllSubmissionsQueryVariables = Exact<{
  filters: SubmissionSearchFilters;
}>;


export type GetAllSubmissionsQuery = { __typename?: 'Query', submissions?: Array<{ __typename?: 'Submission', id: string, googleMapsUrl: string, healthcareProfessionalName: string, spokenLanguages: Array<Locale>, isUnderReview: boolean, isApproved: boolean, isRejected: boolean, createdDate: string, updatedDate: string, notes?: string | null, facility?: { __typename?: 'FacilitySubmission', id?: string | null, mapLatitude?: number | null, mapLongitude?: number | null, nameEn?: string | null, nameJa?: string | null, healthcareProfessionalIds: Array<string>, contact?: { __typename?: 'Contact', googleMapsUrl: string, email?: string | null, phone: string, website?: string | null, address: { __typename?: 'PhysicalAddress', postalCode: string, prefectureEn: string, cityEn: string, addressLine1En: string, addressLine2En: string, prefectureJa: string, cityJa: string, addressLine1Ja: string, addressLine2Ja: string } } | null } | null, healthcareProfessionals?: Array<{ __typename?: 'HealthcareProfessionalSubmission', id?: string | null, spokenLanguages: Array<Locale>, degrees?: Array<Degree> | null, specialties?: Array<Specialty> | null, acceptedInsurance?: Array<Insurance> | null, facilityIds: Array<string>, names: Array<{ __typename?: 'LocalizedName', firstName: string, middleName?: string | null, lastName: string, locale: Locale }> }> | null } | null> | null };

export type UpdatedFacilitySubmissionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSubmissionInput;
}>;


export type UpdatedFacilitySubmissionMutation = { __typename?: 'Mutation', updateSubmission?: { __typename?: 'Submission', id: string, googleMapsUrl: string, healthcareProfessionalName: string, spokenLanguages: Array<Locale>, isUnderReview: boolean, isApproved: boolean, isRejected: boolean, createdDate: string, updatedDate: string, notes?: string | null, facility?: { __typename?: 'FacilitySubmission', id?: string | null, nameEn?: string | null, nameJa?: string | null, healthcareProfessionalIds: Array<string>, mapLatitude?: number | null, mapLongitude?: number | null, contact?: { __typename?: 'Contact', googleMapsUrl: string, email?: string | null, phone: string, website?: string | null, address: { __typename?: 'PhysicalAddress', postalCode: string, prefectureEn: string, cityEn: string, addressLine1En: string, addressLine2En: string, prefectureJa: string, cityJa: string, addressLine1Ja: string, addressLine2Ja: string } } | null } | null, healthcareProfessionals?: Array<{ __typename?: 'HealthcareProfessionalSubmission', id?: string | null, spokenLanguages: Array<Locale>, degrees?: Array<Degree> | null, specialties?: Array<Specialty> | null, acceptedInsurance?: Array<Insurance> | null, facilityIds: Array<string>, names: Array<{ __typename?: 'LocalizedName', firstName: string, middleName?: string | null, lastName: string, locale: Locale }> }> | null } | null };

export type SearchHealthcareProfessionalsQueryVariables = Exact<{
  filters: HealthcareProfessionalSearchFilters;
}>;


export type SearchHealthcareProfessionalsQuery = { __typename?: 'Query', healthcareProfessionals?: Array<{ __typename?: 'HealthcareProfessional', id: string, degrees: Array<Degree>, specialties: Array<Specialty>, facilityIds: Array<string>, spokenLanguages: Array<Locale>, acceptedInsurance: Array<Insurance>, createdDate: string, updatedDate: string, names: Array<{ __typename?: 'LocalizedName', lastName: string, firstName: string, middleName?: string | null, locale: Locale }> } | null> | null };

export type SearchFacilitiesQueryVariables = Exact<{
  filters: FacilitySearchFilters;
}>;


export type SearchFacilitiesQuery = { __typename?: 'Query', facilities?: Array<{ __typename?: 'Facility', id: string, nameEn: string, nameJa: string, mapLatitude: number, mapLongitude: number, healthcareProfessionalIds: Array<string>, contact: { __typename?: 'Contact', email?: string | null, googleMapsUrl: string, phone: string, website?: string | null, address: { __typename?: 'PhysicalAddress', addressLine1En: string, addressLine2En: string, addressLine1Ja: string, addressLine2Ja: string, cityJa: string, cityEn: string, prefectureJa: string, prefectureEn: string, postalCode: string } } } | null> | null };

export type CreateSubmissionMutationVariables = Exact<{
  input: CreateSubmissionInput;
}>;


export type CreateSubmissionMutation = { __typename?: 'Mutation', createSubmission?: { __typename?: 'Submission', id: string } | null };


export const GetAllFacilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFacilities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FacilitySearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facilities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureEn"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2En"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1Ja"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2Ja"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalIds"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}}]}}]}}]} as unknown as DocumentNode<GetAllFacilitiesQuery, GetAllFacilitiesQueryVariables>;
export const UpdateFacilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFacility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateFacilityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFacilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFacility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateFacilityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureEn"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2En"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1Ja"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2Ja"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalIds"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}}]}}]}}]} as unknown as DocumentNode<UpdateFacilityMutation, UpdateFacilityMutationVariables>;
export const DeleteFacilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFacility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteFacilityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFacility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteFacilityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccessful"}}]}}]}}]} as unknown as DocumentNode<DeleteFacilityMutation, DeleteFacilityMutationVariables>;
export const GetAllHealthcareProfessionalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllHealthcareProfessionals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HealthcareProfessionalSearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"degrees"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedInsurance"}},{"kind":"Field","name":{"kind":"Name","value":"facilityIds"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}}]}}]}}]} as unknown as DocumentNode<GetAllHealthcareProfessionalsQuery, GetAllHealthcareProfessionalsQueryVariables>;
export const GetHealthcareProfessionalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHealthcareProfessional"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"healthcareProfessionalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessional"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"healthcareProfessionalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}}]}}]}}]} as unknown as DocumentNode<GetHealthcareProfessionalQuery, GetHealthcareProfessionalQueryVariables>;
export const UpdatedHealthcareProfessionalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedHealthcareProfessional"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateHealthcareProfessionalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateHealthcareProfessionalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateHealthcareProfessional"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateHealthcareProfessionalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"degrees"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedInsurance"}},{"kind":"Field","name":{"kind":"Name","value":"facilityIds"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}}]}}]}}]} as unknown as DocumentNode<UpdatedHealthcareProfessionalMutation, UpdatedHealthcareProfessionalMutationVariables>;
export const DeleteHealthcareProfessionalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteHealthcareProfessional"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteHealthcareProfessionalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteHealthcareProfessional"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteHealthcareProfessionalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSuccessful"}}]}}]}}]} as unknown as DocumentNode<DeleteHealthcareProfessionalMutation, DeleteHealthcareProfessionalMutationVariables>;
export const SearchFacilitiesDropdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchFacilitiesDropdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FacilitySearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facilities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchFacilitiesDropdownQuery, SearchFacilitiesDropdownQueryVariables>;
export const GetAllSubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllSubmissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionSearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalName"}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"facility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mapLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureEn"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2En"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1Ja"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2Ja"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"degrees"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedInsurance"}},{"kind":"Field","name":{"kind":"Name","value":"facilityIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isUnderReview"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"isRejected"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<GetAllSubmissionsQuery, GetAllSubmissionsQueryVariables>;
export const UpdatedFacilitySubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatedFacilitySubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSubmissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalName"}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"facility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureEn"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2En"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1Ja"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2Ja"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalIds"}},{"kind":"Field","name":{"kind":"Name","value":"mapLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapLongitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"degrees"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedInsurance"}},{"kind":"Field","name":{"kind":"Name","value":"facilityIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isUnderReview"}},{"kind":"Field","name":{"kind":"Name","value":"isApproved"}},{"kind":"Field","name":{"kind":"Name","value":"isRejected"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<UpdatedFacilitySubmissionMutation, UpdatedFacilitySubmissionMutationVariables>;
export const SearchHealthcareProfessionalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchHealthcareProfessionals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HealthcareProfessionalSearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"names"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"degrees"}},{"kind":"Field","name":{"kind":"Name","value":"specialties"}},{"kind":"Field","name":{"kind":"Name","value":"facilityIds"}},{"kind":"Field","name":{"kind":"Name","value":"spokenLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedInsurance"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedDate"}}]}}]}}]} as unknown as DocumentNode<SearchHealthcareProfessionalsQuery, SearchHealthcareProfessionalsQueryVariables>;
export const SearchFacilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchFacilities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FacilitySearchFilters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facilities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"nameJa"}},{"kind":"Field","name":{"kind":"Name","value":"mapLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"mapLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"healthcareProfessionalIds"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2En"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1Ja"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2Ja"}},{"kind":"Field","name":{"kind":"Name","value":"cityJa"}},{"kind":"Field","name":{"kind":"Name","value":"cityEn"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureJa"}},{"kind":"Field","name":{"kind":"Name","value":"prefectureEn"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"googleMapsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"website"}}]}}]}}]}}]} as unknown as DocumentNode<SearchFacilitiesQuery, SearchFacilitiesQueryVariables>;
export const CreateSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSubmissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateSubmissionMutation, CreateSubmissionMutationVariables>;