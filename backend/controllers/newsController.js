const asyncHandler = require('express-async-handler');
const News = require('../models/News');

const crearNoticia = asyncHandler(async (req, res) => {
  const { title, content, category, tags, githubUrl, sourceUrl } = req.body;

  const news = new News({
    title,
    content,
    category,
    tags: tags ? tags.split(',') : [],
    githubUrl,
    sourceUrl,
    user: req.user._id,
    mainImage: req.files['mainImage'] ? req.files['mainImage'][0].path : '',
    additionalImages: req.files['additionalImages'] ? req.files['additionalImages'].map(file => file.path) : [],
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

const obtenerNoticias = asyncHandler(async (req, res) => {
  const noticias = await News.find({});
  res.json(noticias);
});

const obtenerNoticiaPorId = asyncHandler(async (req, res) => {
  const noticia = await News.findById(req.params.id);

  if (noticia) {
    res.json(noticia);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

const darMeGusta = asyncHandler(async (req, res) => {
  const noticia = await News.findById(req.params.id);

  if (noticia) {
    noticia.likes += 1;
    const updatedNews = await noticia.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

const valorarNoticia = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const noticia = await News.findById(req.params.id);

  if (noticia) {
    noticia.numReviews += 1;
    noticia.rating = (noticia.rating * (noticia.numReviews - 1) + rating) / noticia.numReviews;
    const updatedNews = await noticia.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

const actualizarNoticia = asyncHandler(async (req, res) => {
  const noticia = await News.findById(req.params.id);

  if (noticia) {
    noticia.title = req.body.title || noticia.title;
    noticia.content = req.body.content || noticia.content;
    noticia.category = req.body.category || noticia.category;
    noticia.tags = req.body.tags ? req.body.tags.split(',') : noticia.tags;
    noticia.githubUrl = req.body.githubUrl || noticia.githubUrl;
    noticia.sourceUrl = req.body.sourceUrl || noticia.sourceUrl;
    if (req.files['mainImage']) {
      noticia.mainImage = req.files['mainImage'][0].path;
    }
    if (req.files['additionalImages']) {
      noticia.additionalImages = req.files['additionalImages'].map(file => file.path);
    }

    const updatedNews = await noticia.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

const eliminarNoticia = asyncHandler(async (req, res) => {
  const noticia = await News.findById(req.params.id);

  if (noticia) {
    await noticia.remove();
    res.json({ message: 'News removed' });
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});

module.exports = {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiaPorId,
  darMeGusta,
  valorarNoticia,
  actualizarNoticia,
  eliminarNoticia
};
