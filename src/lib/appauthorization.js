// import { RequestError } from 'txstate-node-utils/lib/error'

export default () => async function (req, res, next) {
  // throw new RequestError(403, 'Application is forbidden to use this endpoint.')
  next()
}
