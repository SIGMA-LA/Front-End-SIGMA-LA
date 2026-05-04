export interface Provincia {
  cod_provincia: number
  nombre: string
  localidades?: Localidad[]
}

export interface Localidad {
  cod_localidad: number
  nombre_localidad: string
  cod_provincia: number
  provincia: Provincia
}

export interface CreateLocalidadData {
  nombre_localidad: string
  cod_provincia: number
}
