export const dateFormatter = (date: Date, monthFormat: string = 'long'): string => {
  const options: any = { year: 'numeric', month: monthFormat, day: 'numeric' };
  const newDate = new Date(date);
  return newDate.toLocaleDateString('id-ID', options);
};
