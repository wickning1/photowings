import Image from '../../../models/image'

export async function get (req, res) {
  const images = Image.getMany(req.user, req.query)
  res.json(images)
}
