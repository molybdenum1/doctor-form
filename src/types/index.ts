export interface IValues {
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  speciality: string;
  doctor: string;
  contact: string;
}

export interface IDoctor {
  id: string;
  name: string;
  surname: string;
  specialityId: string;
  isPediatrician: boolean;
  cityId: string;
}
export interface ICity {
  id: string;
  name: string;
}
export interface ISpecialty {
  id: string;
  name: string;
  params?: IParams;
}
export interface IParams {
  gender?: string;
  maxAge?: string;
  minAge?: string;
}
