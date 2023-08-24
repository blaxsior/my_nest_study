import { User } from 'src/users/user.entity';
import 'express';

declare module 'express' {
  interface Request {
    currentUser?: User;
  }
}
