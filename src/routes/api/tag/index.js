import Tag from '../../../models/tag'

export async function get (req, res) {
  const data = await Tag.getMany(req.user, req.query)
  res.json(data.map(t => t.full(req.user)))
}
