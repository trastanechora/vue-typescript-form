import { FormStatus } from '@/@types';

export const dateFormatter = (date: Date, monthFormat: string = 'long'): string => {
  const options: any = { year: 'numeric', month: monthFormat, day: 'numeric' };
  const newDate = new Date(date);
  return newDate.toLocaleDateString('id-ID', options);
};

export const statusFormatter = (status: FormStatus): any => {
  switch (status) {
    case FormStatus.UNSTARTED:
      return {
        text: 'Belum Dibuka',
        icon: 'mdi-timer-sand',
        color: 'blue'
      };
    case FormStatus.OPEN:
      return {
        text: 'Terbuka',
        icon: 'mdi-circle',
        color: 'green'
      };
    case FormStatus.CLOSED:
      return {
        text: 'Tertutup',
        icon: 'mdi-close-circle',
        color: 'red'
      };
    case FormStatus.ENDED:
      return {
        text: 'Waktu Habis',
        icon: 'mdi-circle-slice-3',
        color: 'orange'
      };
    case FormStatus.DELETED:
      return {
        text: 'Dihapus',
        icon: 'mdi-delete-circle',
        color: 'grey'
      };
    default:
      break;
  }
};

export const convertBlobToByteArray = (blob: any): any => {
  const arrayPromise = new Promise(function(resolve) {
    const reader = new FileReader();

    reader.onloadend = function() {
      resolve(reader.result);
    };

    reader.readAsArrayBuffer(blob);
  });

  return arrayPromise.then(function(array: any) {
    const byteArray = new Uint8Array(array);
    return {
      byteArray: byteArray,
      type: blob.type,
      name: blob.name
    };
  });
};

export const convertByteArrayToBlob = (byteArrayObject: any): any => {
  const processedBlob: any = new Blob([byteArrayObject.byteArray], { type: byteArrayObject.type });
  processedBlob.name = byteArrayObject.name;
  return processedBlob;
};
