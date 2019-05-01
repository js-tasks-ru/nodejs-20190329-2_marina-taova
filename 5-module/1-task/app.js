const Koa = require('koa');
const app = new Koa();


app.use(require('koa-static')('public'));

app.use(require('koa-bodyparser')());
const Router = require('koa-router');
const router = new Router();

let connections = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise((resolve) => {
        connections.push(resolve);

        ctx.req.on('close', () => {
            connections = connections.slice(-1);
        } )
    })
});

router.post('/publish', async (ctx, next) => {
    const { message } = ctx.request.body;

    if (!message) {
        return;
    }

    connections.forEach((res) => {
        res(message);
    })

    connections = [];

    ctx.body = { message: 'UPDATE' };
});

app.use(router.routes());

module.exports = app;
