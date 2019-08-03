import Album from '../../../models/album'

export async function get (req, res) {
  const albums = await Album.getMany(req.user, req.query)
  res.json(albums.map(a => a.full(req.user)))
}
