const { override } = require('customize-cra');

const fixDevServer = (config, env) => {
    console.log('Config being applied:', config.devServer);
    if (config.devServer) {
        config.devServer.allowedHosts = ['.localhost', 'localhost'];
    }
    return config;
};

module.exports = override(fixDevServer);
