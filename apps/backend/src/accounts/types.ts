import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface AccountsTable {
  id: Generated<number>;

  invited_by: ColumnType<number>;
  provider: ColumnType<string>;
  gender: 'male' | 'female' | 'not_set';

  user_id: ColumnType<string>;
  username: ColumnType<string>;
  first_name: ColumnType<string>;
  last_name: ColumnType<string>;
  invite_code: ColumnType<string>;
  lang_id: number | undefined
  email: ColumnType<string | undefined>;
  phone_number: ColumnType<string | undefined>;
  created_at: ColumnType<Date>;
  updated_at?: ColumnType<Date, string | undefined, never>;
  is_disabled: ColumnType<boolean>;
}

export interface AccountsBanTable {
  id: Generated<number>;
  account_id: ColumnType<number>;
  reason_id: ColumnType<number>;
  ban_type: 'temporary' | 'permanent' | 'airdrop';
  created_at: ColumnType<Date>;
  release_at: ColumnType<Date | undefined>;
}

export interface AccountBanReasonsTable {
  id: Generated<number>;
  name: ColumnType<string>;
  description: ColumnType<string>;
}

export interface LanguagesTable {
  id: Generated<number>;
  language_code: ColumnType<string>;
  is_enabled: ColumnType<boolean>;
  language_name: ColumnType<string>;
}

export type insertAccount = Insertable<AccountsTable>;
export type selectAccount = Selectable<AccountsTable>;
export type updateAccount = Updateable<AccountsTable>;

export type insertAccountBan = Insertable<AccountsBanTable>;
export type selectAccountBan = Selectable<AccountsBanTable>;
export type updateAccountBan = Updateable<AccountsBanTable>;

export type insertAccountsBanReason = Insertable<AccountsBanTable>;
export type selectAccountsBanReason = Selectable<AccountsBanTable>;
export type updateAccountsBanReason = Updateable<AccountsBanTable>;

export type insertLanguage = Insertable<LanguagesTable>;
export type selectLanguage = Selectable<LanguagesTable>;
export type updateLanguage = Updateable<LanguagesTable>;

export interface Database {
  accounts: AccountsTable;
  bans: AccountsBanTable
  reasons: AccountBanReasonsTable
  languages: LanguagesTable
}

export interface CreateAccountResponse {
  provider: 'telegram' | 'local';
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  lang: 'en' | string;
  inviteCode: string,
}


export interface FindUserResponse {
  provider: 'telegram' | 'local';
  id: number,
  userId: string;
  userName: string;
  firstName: string;
  lastName?: string;
  createdAt: Date;
  updatedAt?: Date;
  lang: 'en' | string;
  email?: string;
}
