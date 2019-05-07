const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const User = require('./models/User');


app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.body = await User.find({});
});

router.get('/users/:id', async (ctx) => {
  const id = getId(ctx.request.url);

  const user = await User.findOne({_id: id}).catch((err) => {
    if (err) {
      return ctx.response.status = 400;
    }
  }) 

  if (!user) {
    return ctx.response.status = 404;
  }

  ctx.body = user;
});

router.patch('/users/:id', async (ctx) => {
  const id = getId(ctx.request.url);

  const { email, displayName} = ctx.request.body;
  if (!email || !/^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email)) {
    ctx.response.status = 400;
    return ctx.body = JSON.stringify({
      'errors': {
        'email': 'Некорректный email'
      }
    });
  }

  const data = await User.findByIdAndUpdate(
      id, 
      { email: email, displayName:  displayName},
      {new: true},
    )
    .catch((err => {
      ctx.response.status = 400;
      return ctx.body = getErrorMsg(err);
    }));

  ctx.body = data;

});

router.post('/users', async (ctx) => {
  const { email, displayName} = ctx.request.body;

  const data = await User.create({email, displayName}).catch((err) => {
    ctx.response.status = 400;
    return ctx.body = getErrorMsg(err);
  });
  ctx.body = data;

});

router.delete('/users/:id', async (ctx) => {
  const id = getId(ctx.request.url);

  const deleted = await User.findByIdAndDelete({_id: id});

  if (!deleted) {
    ctx.response.status = 404;
    return ctx.body = "Not found";
  }
  ctx.body = 'ok';

});

getId = (url) => {
  const path = url.split('/');
  const id = path[path.length - 1];
  return id;
}

getErrorMsg = (data) => {
  const erorrName = Object.keys(data.errors)[0];
  const textMsg = JSON.stringify({
    "errors": {
      [erorrName]: data.errors[erorrName].message
    }
  });
  return textMsg;

}

app.use(router.routes());

module.exports = app;
