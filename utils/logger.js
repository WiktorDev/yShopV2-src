const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("DD-MM-YY H:m:s")}]:`;
  switch (type) {
    case "info": {
        console.log(`${timestamp} [${chalk.blue(type.toUpperCase())}] ${content} `);
        return;
    }
    case "ready": {
        console.log(`${timestamp} [${chalk.green(type.toUpperCase())}] ${content} `);
        return;
    }
    case 'error': {
        console.error(`${timestamp} [${chalk.red(type.toUpperCase())}] ${content} `);
        return;
    }
    case 'debug': {
        console.log(`${timestamp} [${chalk.cyan(type.toUpperCase())}] ${content} `);
        return;
    }
    case 'warn': {
        console.log(`${timestamp} [${chalk.yellow(type.toUpperCase())}] ${content} `);
        return;
    }
    
    default: {
        console.log(content)
        return;
    }
  }
};

exports.info = (...args) => this.log(...args, 'info');
exports.error = (...args) => this.log(...args, 'error');
exports.ready = (...args) => this.log(...args, 'ready');
exports.warn = (...args) => this.log(...args, 'warn');
exports.debug = (...args) => this.log(...args, 'debug');
exports.clear = (...args) => this.log(...args)