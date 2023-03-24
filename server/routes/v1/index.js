import auth from './auth';
import user from './user';
import notification from './notification'

function router(app, prefix = '/v1/') {
  app.use(prefix, auth);
  app.use(prefix, user);
  app.use(prefix, notification)
}

export default router;
