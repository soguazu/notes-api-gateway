import auth from './auth';
import user from './user';
import notification from './notification';
import file from './file';
import plan from './plan';

function router(app, prefix = '/v1/') {
  app.use(prefix, auth);
  app.use(prefix, user);
  app.use(prefix, notification);
  app.use(prefix, file);
  app.use(prefix, plan);
}

export default router;
