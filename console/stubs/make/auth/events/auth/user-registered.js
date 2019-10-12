'use strict'

const Event = require('@supercharge/framework/event')

/**
 * This event is fired in the sign up handler
 * once a new user registers.
 */
class UserRegistered extends Event {
  /**
   * Create a new instance that keeps the event related data.
   * This data is passed to all the event listeners.
   *
   * @param {Object} user
   */
  constructor (user) {
    super()
    this.user = user
  }

  /**
   * Returns the event identifier. Every listener for this event
   * must return the same value in their `on()` method.
   */
  emit () {
    return 'user.registered'
  }
}

module.exports = UserRegistered
