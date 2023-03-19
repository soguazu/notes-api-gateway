import auth from './auth';
import user from './user';

function router(app, prefix = '/v1/') {
  app.use(prefix, auth);
  app.use(prefix, user);
}

export default router;
