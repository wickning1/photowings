import Image from '../../../models/image'

export async function get (req, res) {
  const { info, data } = await Image.getMany(req.user, req.query)
  res.json({ info, data: data.map(i => i.full(req.user)) })
}
