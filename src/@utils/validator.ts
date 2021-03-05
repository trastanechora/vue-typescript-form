export const notEmptyRules = (fieldIdentifier: string): CallableFunction[] => {
  return [(v: string | number): boolean | string => !!v || `${fieldIdentifier} harus diisi`];
};
