import {Router} from "express";

import login from "../handlers/users/login";
import register from "../handlers/users/register";
import layout from "../handlers/users/layout";
import {userMiddleware} from "../utils/middleware";
import dashboard from "../handlers/users/dashboard";
import newexpenses from "../handlers/users/newexpenses";
import correntmonth from "../handlers/users/correntmonth";
import newincome from "../handlers/users/newincome";
import income from "../handlers/users/income";
import logout from "../handlers/users/logout";
import changeusername from "../handlers/users/changeusername";

const users = Router();

users.post('/login', login)
users.post('/register', register)
users.get('/layout', userMiddleware, layout)
users.get('/dashboard', userMiddleware, dashboard)
users.get('/expenses/current-month', userMiddleware, correntmonth)
users.post('/expenses', userMiddleware, newexpenses)
users.get('/income/month', userMiddleware, income)
users.post('/income', userMiddleware, newincome)
users.get('/logout', userMiddleware, logout)
users.get('/settings/username', userMiddleware, changeusername)
users.get('/settings/password', userMiddleware, passwordreset)

export default users;
