import { ErrorMessage } from '../errors';

interface ICheckNeedExists {
  label: string;
  value: any;
}

export const checkCannotExists = (Vars: ICheckNeedExists[]) => {
  for (let i = 0; i < Vars.length; i++) {
    if (Vars[i].value) {
      throw new ErrorMessage({
        statusCode: '422 UNPROCESSABLE CONTENT',
        message: `A informação: ${Vars[i].label} já existe na base de dados.`,
      });
    }
  }
};
