import Image from '../../../../models/image'
import { validateAndRespond } from '../../../../lib/serverhelpers'

export async function post (req, res) {
  const image = await Image.getById(req.params.id, req.user)
  await image.fromJson(req.body, req.user)
  await validateAndRespond(image, req, res)
}
