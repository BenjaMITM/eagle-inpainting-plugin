const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Change this if your Eagle API port is different
const EAGLE_API = 'http://localhost:41595/api/v1';

module.exports = {
  async getSelectedImages() {
    // Returns [{ id, name, path, ... }]
    const res = await axios.get(`${EAGLE_API}/asset/list-selected`);
    return res.data.data || [];
  },

  async importImage(filePath) {
    // Import a local file into Eagle
    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', fileStream, path.basename(filePath));
    formData.append('name', path.basename(filePath));
    formData.append('modificationTime', stats.mtime.getTime());

    const res = await axios.post(`${EAGLE_API}/asset/create`, formData, {
      headers: formData.getHeaders()
    });
    return res.data;
  }
};