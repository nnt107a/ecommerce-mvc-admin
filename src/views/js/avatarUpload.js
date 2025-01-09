const form = document.getElementById('profile-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('avatar');
    formData.append('avatar', files);
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const uploadData = await response.json();

        if (!response.ok) {
          throw new Error(uploadData.error || 'Failed to upload image');
        }

        const imageUrl = uploadData.url;

        const data = {
            name,
            address,
            phone,
            avatar: imageUrl, // Include the uploaded image URL
          };

        console.log(JSON.stringify(data));

        const updateProfile = await fetch('/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const updateProfileData = await updateProfile.json();

        if (!updateProfile.ok) {
        throw new Error(updateProfileData.error || 'Failed to update profile');
        }
    } catch (error) {
        console.log("Error uploading file: ", error);
    }
});