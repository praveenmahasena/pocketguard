import cookie from 'cookie-parser';
import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import volleyball from 'volleyball';
import users from './routes/users';

const app = express()
app.use(helmet())
app.use(volleyball)
app.use(cookie())
app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers",
                "Content-Type, Authorization, cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method == "OPTIONS") {
    res.status(204).end(); // I no no wanna do again
    return
  }
  next();
})


app.use('/api/v1/users',users)

export default app;
