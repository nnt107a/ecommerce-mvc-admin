const form = document.getElementById('addProductForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = document.getElementById('productThumb').files;
    Array.from(files).forEach((file) => {
        formData.append('product_thumbs', file); // Name must match the input's name attribute
      });
    const product_name = document.getElementById('productName').value;
    const product_price = document.getElementById('productPrice').value;
    const product_description = document.getElementById('productDescription').value;
    const product_color = document.getElementById('productColor').value;
    const product_size = document.getElementById('productSize').value;
    const product_type = document.getElementById('productType').value;
    const product_attributes = document.getElementById('productBrand').value;
    const product_quantity = document.getElementById('productQuantity').value;
    const product_status = document.getElementById('productStatus').value;

    try {
        const response = await fetch('/uploads-multiple', {
            method: 'POST',
            body: formData,
        });

        const uploadData = await response.json();

        if (!response.ok) {
          throw new Error(uploadData.error || 'Failed to upload image');
        }

        const fileNames = Array.from(files).map(file => file.name);
        const fileNamesString = fileNames.join(',');

        const imageUrl = fileNamesString;

        const data = {
            product_name,
            product_description,
            product_price,
            product_color,
            product_size,
            product_type,
            product_attributes,
            product_quantity,
            product_status,
            product_thumb: imageUrl, // Include the uploaded image URL
          };
        
          console.log(data);
          console.log(JSON.stringify(data));

        const addProductResponse = await fetch('/add-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const addProductData = await addProductResponse.json();

        if (!addProductResponse.ok) {
        throw new Error(addProductData.error || 'Failed to add product');
        }
    } catch (error) {
        console.log("Error uploading file: ", error);
    }
});