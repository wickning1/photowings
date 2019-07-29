import Image from '../../../models/image'

export async function get (req, res) {
  const images = await Image.getMany(req.user, req.query)
  res.json(images.map(i => i.full(req.user)))
}
