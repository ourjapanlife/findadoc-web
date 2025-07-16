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

export type CreateSubmissionInput = {
  autofillPlaceFromSubmissionUrl?: InputMaybe<Scalars['Boolean']['input']>;
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

export type FacilityConnection = {
  __typename?: 'FacilityConnection';
  nodes: Array<Facility>;
  totalCount: Scalars['Int']['output'];
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

export type HealthcareProfessionalConnection = {
  __typename?: 'HealthcareProfessionalConnection';
  nodes: Array<HealthcareProfessional>;
  totalCount: Scalars['Int']['output'];
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
  createSubmission: Submission;
  deleteFacility: DeleteResult;
  deleteHealthcareProfessional: DeleteResult;
  deleteSubmission: DeleteResult;
  moderationPanelUpdateSubmission: Submission;
  updateFacility: Facility;
  updateHealthcareProfessional: HealthcareProfessional;
  updateSubmission: Submission;
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
  facilities: FacilityConnection;
  facility?: Maybe<Facility>;
  healthcareProfessional?: Maybe<HealthcareProfessional>;
  healthcareProfessionals: HealthcareProfessionalConnection;
  submission?: Maybe<Submission>;
  submissions: SubmissionConnection;
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
  Pathology = 'PATHOLOGY',
  Pediatrics = 'PEDIATRICS',
  Pharmacy = 'PHARMACY',
  PhysicalMedicineAndRehabilitation = 'PHYSICAL_MEDICINE_AND_REHABILITATION',
  Physiotherapy = 'PHYSIOTHERAPY',
  PlasticSurgery = 'PLASTIC_SURGERY',
  PreventiveMedicine = 'PREVENTIVE_MEDICINE',
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

export type SubmissionConnection = {
  __typename?: 'SubmissionConnection';
  nodes: Array<Submission>;
  totalCount: Scalars['Int']['output'];
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
