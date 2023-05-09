import auth from './auth';
import user from './user';
import notification from './notification';
import file from './file';
import plan from './plan';
import payment from './payment';
import subscription from './subscription';

function router(app, prefix = '/v1/') {
  app.use(prefix, auth);
  app.use(prefix, user);
  app.use(prefix, notification);
  app.use(prefix, file);
  app.use(prefix, plan);
  app.use(prefix, payment);
  app.use(prefix, payment);
  app.use(prefix, subscription);
}

export default router;
