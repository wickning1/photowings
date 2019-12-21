import Image from '../../../../models/image'

export async function get (req, res) {
  const image = await Image.getById(req.params.id, req.user)
  res.json(image.full(req.user))
}

export async function put (req, res) {
  const image = await Image.getById(req.params.id, req.user)
  console.log(req.body)
  image.fromJson(req.body, req.user)
  await image.save()
  res.json({})
}
