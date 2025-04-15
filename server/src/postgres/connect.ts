import pg from 'pg';

const connection=new pg.Client({
  user: process.env.DB_USR,
  password: process.env.DB_PASSWORD,
  host:process.env.DB_HOST,
  port:parseInt(process.env.DB_PORT as string), // i hate this typescript error
  database:process.env.DB_NAME,
})

export default connection;
