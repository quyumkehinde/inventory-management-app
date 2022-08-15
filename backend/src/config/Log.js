import winston from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';

export const logger = winston.createLogger({
  level: 'debug',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.Console(),  // comment to disable logging error to console
    new winston.transports.File({
        filename: 'logs/log.json',
        level: 'debug'
    })
  ]
});