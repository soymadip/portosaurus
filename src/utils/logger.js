import chalk from 'chalk';

export const logger = {
  info: (msg) => {
    console.log(`${chalk.blue('ℹ')} ${msg}`);
  },
  success: (msg) => {
    console.log(`${chalk.green('✔')} ${msg}`);
  },
  warn: (msg) => {
    console.log(`${chalk.yellow('⚠')} ${msg}`);
  },
  error: (msg) => {
    console.error(`${chalk.red('✖')} ${msg}`);
  },
  tip: (msg) => { 
    console.log(`${chalk.cyan('💡')} ${msg}`);
  }
};
