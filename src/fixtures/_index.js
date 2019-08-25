import tags from './tags'

export default async function () {
  await Promise.all([
    tags()
  ])
}
