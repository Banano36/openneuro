import Counter from '../models/counter'

/**
 * Counter
 *
 * A helper library for getting persistent serial numbers.
 */
export default {
  /**
   * Get Next
   *
   * Takes any string as a type and callsback with the next
   * sequential integer for that type starting with 1.
   */
  getNext(type, callback) {
    Counter.findOne({ _id: type }).then(found => {
      if (found) {
        Counter.updateOne({ _id: type }, { $inc: { sequence_value: 1 } }).then(
          callback(found.sequence_value + 1),
        )
      } else {
        Counter.create({ _id: type, sequence_value: 1 }).then(callback(1))
      }
    })
  },
}
