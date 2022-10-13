/**
 * Get the configuration file variable name
 * @param env
 */
import config from '../config/config'

const { shortName } = config.defaultSettings

export const getConfigFileName = (_: RecordType) => {
  return `__PRODUCTION__${shortName || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '')
}
