'use strict'

const Config = util('config')
const Bounce = require('bounce')
const Logger = require('./logger')
const Message = require('./mail/message')
const Transports = require('./mail/transports')

class Mailer {
  constructor() {
    this.from = Config.get('mail.from')
    this.replyTo = Config.get('mail.from')

    const driver = Config.get('mail.driver')
    const drivers = Config.get('mail.drivers')
    const transporterOptions = drivers[driver]

    const Transporter = Transports[driver]
    this.transporter = new Transporter(transporterOptions)
  }

  to(users) {
    return new Message(this).to(users)
  }

  cc(users) {
    return new Message(this).cc(users)
  }

  bcc(users) {
    return new Message(this).bcc(users)
  }

  from(address, name) {
    return new Message(this).from(address, name)
  }

  replyTo(address, name) {
    return new Message(this).replyTo(address, name)
  }

  /**
   * Send an email and don’t worry about success or failure.
   * This catches application errors (we don’t care about),
   * but still throw system errors.
   */
  async fireAndForget(mailable) {
    try {
      await this.send(mailable)
    } catch (err) {
      Bounce.rethrow(err, 'system')
    }
  }

  async send(mailable = {}) {
    if (Object.getPrototypeOf(mailable.constructor).name !== 'Mailable') {
      throw new Error('Pass a Mailable instance to the Mailer.send(mailable) method.')
    }

    const { to, cc, bcc, subject, html, text, from = this.from, replyTo = this.replyTo } = await mailable.buildMessage()
    const message = { from, to, cc, bcc, replyTo, subject, html, text }

    try {
      await this.transporter.sendMail(message)
    } catch (err) {
      Logger.error(err.message)
      throw err
    }
  }
}

module.exports = new Mailer()
