const db = require("../../../config/db.config");
const { Sequelize } = require('sequelize');
const ClientTestimonial = db.client_testimonial;

// Function to create a new client testimonial
async function createClientTestimonial(req, res) {
  try {
    const { user_name, message, status } = req.body;
    const cover_img = req.file ? 
    `/src/uploads/cover_img/${req.file.filename}` : 
    "/src/uploads/cover_img/default.png";

    const newClientTestimonial = await ClientTestimonial.create({
       user_name, message, cover_img, status });

    return res.json({ status: true, clientTestimonial: newClientTestimonial });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to read all client testimonials
async function getClientTestimonials(req, res) {
  try {
    const clientTestimonials = await ClientTestimonial.findAll({
      attributes: [
        'id',
        'user_name',
        'message',
        'cover_img',
        'status',
        [Sequelize.literal('CONCAT("http://134.209.229.112/images/testimonial_thumbnail/", cover_img)'), 'cover_url'],
      ],
      where: {
        status: 1,
      },
    });

    if (clientTestimonials.length > 0) {
      return res.json({ status: true, clientTestimonials, message: 'All Client reviews' });
    } else {
      return res.json({ status: false, message: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports ={createClientTestimonial,getClientTestimonials}