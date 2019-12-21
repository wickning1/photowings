import Image from '../../../models/image'

export async function get (req, res) {
  const { info, data } = await Image.getMany(req.user, req.query)
  res.json({ info, data: data.map(i => i.full(req.user)) })
}

export async function put (req, res) {
  const ids = req.body.ids
  const images = await Image.find({ _id: ids })
  const tagcount = {}
  for (const image of images) {
    const imagehas = {}
    for (const tag of image.tags) {
      imagehas[tag] = true
      tagcount[tag] = ++tagcount[tag] || 1
    }
    for (const tag of req.body.tags) {
      if (!imagehas[tag]) image.tags.push(tag)
    }
  }
  for (const [tag, count] of Object.entries(tagcount)) {
    if (count === images.length && !req.body.tags.includes(tag)) {
      for (const image of images) {
        image.tags = image.tags.filter(tg => tg.toString() !== tag)
      }
    }
  }
  await Promise.all(images.map(img => img.save()))
  res.json({})
}
