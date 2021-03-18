export const notEmptyRules = (fieldIdentifier: string): CallableFunction[] => {
  return [(v: string | number): boolean | string => !!v || `${fieldIdentifier} harus diisi`];
};

export const notEmptyOptionRules = (isMultiple: boolean): CallableFunction[] => {
  return [
    (v: any): boolean | string => v.length > 0 || `${isMultiple ? 'Pilih salah satu atau lebih' : 'Pilih salah satu'}`
  ];
};
