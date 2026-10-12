export type User = {
  id: number; // bigserial PK
  login: string; // varchar(255) UNIQUE
  first_name: string; // varchar(255)
  last_name: string; // varchar(255)
  gender: boolean | null; // boolean
  department: string | null; // text
  phone_number: string | null; // varchar(50)
  email: string; // varchar(255) UNIQUE
  avatar: string | null; // text
  joined_at: string; // timestamptz
};