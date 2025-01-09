function getCloudinaryUrl(filename, folder = '') {
    const cloudName = 'ds2hx283s'; // Replace with your Cloudinary cloud name
    return folder
      ? `https://res.cloudinary.com/${cloudName}/uploads/${folder}/${filename}`
      : `https://res.cloudinary.com/${cloudName}/uploads/${filename}`;
}

module.exports = { getCloudinaryUrl };