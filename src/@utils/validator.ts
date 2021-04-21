import { FileType } from '../@types';

export const notEmptyRules = (fieldIdentifier: string): CallableFunction[] => {
  return [(v: string | number): boolean | string => !!v || `${fieldIdentifier} harus diisi`];
};

export const notEmptyOptionRules = (isMultiple: boolean): CallableFunction[] => {
  return [
    (v: any): boolean | string => v.length > 0 || `${isMultiple ? 'Pilih salah satu atau lebih' : 'Pilih salah satu'}`
  ];
};

export const notEmptySelectRules = (fieldIdentifier: string): CallableFunction[] => {
  return [(v: any): boolean | string => !!v.label || `${fieldIdentifier} harus diisi`];
};

export const phoneNumberRules = (fieldIdentifier: string, isRequired: boolean = true): CallableFunction[] => {
  if (isRequired) {
    return [
      (v: string): boolean | string => !!v || `${fieldIdentifier} harus diisi`,
      (v: string): boolean | string => (v && v[0] === '0') || `${fieldIdentifier} tidak valid`,
      (v: string): boolean | string => (v && /^[0-9]+$/.test(v)) || `${fieldIdentifier} hanya boleh mengandung angka.`,
      (v: string): boolean | string => (v && v.length > 9) || `${fieldIdentifier} harus lebih dari 9 digit`,
      (v: string): boolean | string => (v && v.length < 14) || `${fieldIdentifier} tidak boleh lebih dari 13 digit`
    ];
  } else {
    return [
      (v: string): boolean | string => !v || v[0] === '0' || `${fieldIdentifier} tidak valid`,
      (v: string): boolean | string => !v || /^[0-9]+$/.test(v) || `${fieldIdentifier} hanya boleh mengandung angka.`,
      (v: string): boolean | string => !v || v.length > 9 || `${fieldIdentifier} harus lebih dari 9 digit`,
      (v: string): boolean | string => !v || v.length < 14 || `${fieldIdentifier} tidak boleh lebih dari 13 digit`
    ];
  }
};

export const emailRules = (fieldIdentifier: string, isRequired: boolean = true): CallableFunction[] => {
  if (isRequired) {
    return [
      (v: string): boolean | string => !!v || `${fieldIdentifier} wajib diisi`,
      (v: string): boolean | string =>
        v && v.length > 4
          ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || `Format ${fieldIdentifier} tidak valid`
          : `${fieldIdentifier} minimal 5 karakter`
    ];
  } else {
    return [
      (v: string): boolean | string =>
        !v ||
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) ||
        `Format ${fieldIdentifier} tidak valid`
    ];
  }
};

export const numericRules = (fieldIdentifier: string, isRequired: boolean = true): CallableFunction[] => {
  if (isRequired) {
    return [
      (v: string): boolean | string => !!v || `${fieldIdentifier} wajib diisi`,
      (v: string): boolean | string => (v && /^[0-9]+$/.test(v)) || `Format ${fieldIdentifier} tidak valid`
    ];
  } else {
    return [(v: string): boolean | string => !v || /^[0-9]+$/.test(v) || `Format ${fieldIdentifier} tidak valid`];
  }
};

export const alphabetRules = (fieldIdentifier: string, isRequired: boolean = true): CallableFunction[] => {
  if (isRequired) {
    return [
      (v: string): boolean | string => !!v || `${fieldIdentifier} wajib diisi`,
      (v: string): boolean | string => (v && /^[A-Za-z\s]+$/.test(v)) || `Format ${fieldIdentifier} tidak valid`
    ];
  } else {
    return [(v: string): boolean | string => !v || /^[A-Za-z\s]+$/.test(v) || `Format ${fieldIdentifier} tidak valid`];
  }
};

export const alphanumericRules = (fieldIdentifier: string, isRequired: boolean = true): CallableFunction[] => {
  if (isRequired) {
    return [
      (v: string): boolean | string => !!v || `${fieldIdentifier} wajib diisi`,
      (v: string): boolean | string => (v && /^[\w\-\s]+$/.test(v)) || `Format ${fieldIdentifier} tidak valid`
    ];
  } else {
    return [(v: string): boolean | string => !v || /^[\w\-\s]+$/.test(v) || `Format ${fieldIdentifier} tidak valid`];
  }
};

export const fileInputRules = (
  fieldIdentifier: string,
  type: string,
  maxSize: number,
  isRequired: boolean
): CallableFunction[] => {
  if (type === 'image') {
    if (isRequired) {
      return [
        (v: Blob): boolean | string => !!v || `${fieldIdentifier} harus diisi`,
        (v: Blob): boolean | string =>
          (v && v.size < maxSize * 1000) || `Ukuran file tidak boleh melebihi ${(maxSize * 1000) / 1000000}MB`
      ];
    } else {
      return [
        (v: Blob): boolean | string =>
          !v || v.size < maxSize * 1000 || `Ukuran file tidak boleh melebihi ${(maxSize * 1000) / 1000000}MB`
      ];
    }
  } else if (type === FileType.DOCUMENT) {
    return [
      (v: Blob): boolean | string => !!v || `${fieldIdentifier} harus diisi`,
      (v: Blob): boolean | string =>
        (v && v.size < maxSize * 1000) || `Ukuran file tidak boleh melebihi ${(maxSize * 1000) / 1000000}MB`
    ];
  } else {
    return [
      (v: Blob): boolean | string => !!v || `${fieldIdentifier} harus diisi`,
      (v: Blob): boolean | string =>
        (v && v.size < maxSize * 1000) || `Ukuran file tidak boleh melebihi ${(maxSize * 1000) / 1000000}MB`
    ];
  }
};
