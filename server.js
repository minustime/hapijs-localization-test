const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
})

const plugins = [
    {
        register: require('vision')
    },
    {
        register: require('hapi-i18n'),
        options: {
            locales: 'de',
            defaultLocale: 'de',
            directory: __dirname + '/i18n',
            updateFiles: false,
        }
    }
];

server.register(plugins, err => {
    server.views({
        engines: {
            pug: require('pug')
        },
        path: 'templates'
    });
});

server.ext('onPreResponse', (request, reply) => {

    const response = request.response;

    if(!response.isBoom) {
        return reply.continue();
    }

    return reply.view('404');
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        return reply.view('home');
    }
});

server.start(err => {
    if(err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri)
});