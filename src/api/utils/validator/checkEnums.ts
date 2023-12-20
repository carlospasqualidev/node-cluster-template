import { checkNeedExists } from './checkNeedExists';

interface ICheckEnums {
  enums: { [key: string]: string };
  value: string;
  label: string;
}

export function checkEnums(data: ICheckEnums[]) {
  data.forEach(({ enums, label, value }) => {
    const isValid = enums[value];
    checkNeedExists([{ label, value: isValid }]);
  });
}
