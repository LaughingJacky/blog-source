const asyncForEach = async (array = [], callback = () => {}) => {
  for (let i = 0, n = array.length; i < n; i += 1) {
    /* eslint-disable no-await-in-loop */
    await callback(array[i], i, array)
  }
}

module.exports = asyncForEach
