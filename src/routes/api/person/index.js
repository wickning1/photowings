import Person from '../../../models/person'

export async function get (req, res) {
  const data = await Person.getMany(req.user, req.query)
  res.json(data.map(t => t.full(req.user)))
}
