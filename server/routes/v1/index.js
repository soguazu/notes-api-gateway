import auth from './auth';
import user from './user';
import notification from './notification';
import file from './file';

function router(app, prefix = '/v1/') {
  app.use(prefix, auth);
  app.use(prefix, user);
  app.use(prefix, notification);
  app.use(prefix, file);
}

export default router;
