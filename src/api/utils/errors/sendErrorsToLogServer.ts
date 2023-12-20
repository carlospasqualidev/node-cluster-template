import axios from 'axios';

interface ISendErrorsToLogServer {
  stack: any;
  extraInfo?: any;
}

export async function sendErrorsToLogServer({ stack, extraInfo }: ISendErrorsToLogServer) {
  if (
    process.env.ENVIRONMENT?.includes('Sandbox') ||
    process.env.ENVIRONMENT?.includes('Production')
  ) {
    axios.post('https://ada-logs.herokuapp.com/api/errors/create', {
      projectName: process.env.PROJECT_NAME,
      environment: process.env.ENVIRONMENT,
      side: 'Server',
      errorStack: stack,
      extraInfo,
    });
  }
}
