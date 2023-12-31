// import 'dotenv/config';
import { server } from './server';

server.listen(process.env.PORT || 8080, () => {
  console.log(`🚀️ Server is running with process id ${process.pid} 🚀️`);
});
