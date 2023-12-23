import { ErrorMessage } from '../errors';

type IType = 'string' | 'int' | 'float' | 'boolean' | 'date' | 'json' | 'array' | 'time';

export interface ICheckValues {
  value: any;
  label: string;
  type: IType;
  required?: boolean;
  allowZero?: boolean;
}

export interface INeedAndCannotExist {
  label: string;
  variable: any;
}

const labelToDisplay: { [key in IType]: string } = {
  string: 'Texto',
  int: 'Número inteiro',
  float: 'Número',
  date: 'Data',
  time: 'Hora',
  array: 'Array',
  boolean: 'Booleano',
  json: 'JSON',
};

function invalidType({ label, type }: { label: string; type: IType }) {
  throw new ErrorMessage({
    statusCode: '400 BAD REQUEST',
    message: `A informação ${label} deve possuir o tipo ${labelToDisplay[type]}.`,
  });
}

function invalidTypeLength({ label, type }: { label: string; type: IType }) {
  throw new ErrorMessage({
    statusCode: '400 BAD REQUEST',
    message: `A informação ${label} ultrapassa o tamanho do tipo ${labelToDisplay[type]}.`,
  });
}

function invalidTime(time: string) {
  // Expressão regular para verificar o formato "00:00"
  const hourFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

  // Verifica se a string corresponde ao formato "00:00" e está dentro do intervalo correto
  if (hourFormat.test(time)) {
    const hourMinute = time.split(':');
    const hour = Number(hourMinute[0]);
    const minute = Number(hourMinute[1]);

    // Verifica se a hora está no intervalo de 0 a 23 e os minutos de 0 a 59
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return true; // A string está no formato e intervalo corretos
    }
  }
  return false; // A string não está no formato ou intervalo corretos
}

export function checkValues(values: ICheckValues[]) {
  values.forEach(({ label, type, value, required = true, allowZero = false }) => {
    if (required && (value === null || value === undefined || value === '')) {
      throw new ErrorMessage({
        statusCode: '400 BAD REQUEST',
        message: `Verifique o valor da informação ${label} e tente novamente.`,
      });
    }

    if (!allowZero && value === 0) {
      throw new ErrorMessage({
        statusCode: '400 BAD REQUEST',
        message: `A informação ${label} não pode ser zero.`,
      });
    }

    if (!required && (value === null || value === undefined)) return;

    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          invalidType({ label, type });
        }
        break;

      case 'int':
        if (typeof value !== 'number') {
          invalidType({ label, type });
        }

        if (!Number.isInteger(value)) {
          invalidType({ label, type });
        }

        if (value > 2147483647 || value < -2147483648) {
          invalidTypeLength({ label, type });
        }
        break;

      case 'float':
        if (typeof value !== 'number') {
          invalidType({ label, type });
        }

        if (value > 3.4e38 || value < -3.4e38) {
          invalidTypeLength({ label, type });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          invalidType({ label, type });
        }
        break;

      case 'date':
        if (typeof value === 'number') {
          invalidType({ label, type });
        }

        const checkDate = new Date(value);

        if (checkDate.toString() === 'Invalid Date') {
          invalidType({ label, type });
        }
        break;

      case 'json':
        try {
          JSON.parse(String(value));
        } catch (error) {
          invalidType({ label, type });
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          invalidType({ label, type });
        }

        if (required && !value.length) {
          throw new ErrorMessage({
            statusCode: '400 BAD REQUEST',
            message: `Verifique o valor da informação ${label} e tente novamente. 2`,
          });
        }
        break;

      case 'time':
        if (!invalidTime(value)) {
          invalidType({ label, type });
        }
        break;

      default:
        break;
    }
  });
}
