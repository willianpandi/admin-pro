import { Hospital } from "./hospital.model";

interface _MedicoUser {
  _id: string,
  nombre: string,
  img: string,
}

interface _HospitalUser {
  _id: string,
  nombre: string,
  img: string,
}

export class Medico {
  constructor(
    public nombre: string,
    public uuid?: string,
    public img?: string,
    public usuario?: _MedicoUser,
    public hospital?: _HospitalUser,
  ){}
}
