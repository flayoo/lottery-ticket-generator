import { Router } from 'express';
import { checkLogin,signIn, signUp } from './controllers/auth.controller';
import { createTicket, allTickets} from './controllers/lottery.controller';

const router = Router();

router.post('/login', signIn);
router.post('/register', signUp);
router.get('/check-login', checkLogin)
router.post('/ticket', createTicket)
router.get('/tickets', allTickets)

export default router;
