function loadPage(page, sortBy = '') {
  const searchQuery = document.getElementById('search').value;
  const price = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(checkbox => checkbox.value);
  const color = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(checkbox => checkbox.value);
  const size = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(checkbox => checkbox.value);
  const gender = Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(checkbox => checkbox.value);

    $.ajax({
      url: '/shop',
      type: 'GET',
      data: {
        currentPage: page,
        search: searchQuery,
        price: price,
        color: color,
        size: size,
        gender: gender,
        sortBy: sortBy,
      },
      success: function(data) {
        // Update the product list
        $('#product-list').html('');
        data.products.forEach(product => {
          $('#product-list').append(`
            <div class="col-lg-4 col-md-6 col-sm-12 pb-1">
              <div class="card product-item border-0 mb-4">
                <div
                  class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
                >
                  <img
                    class="img-fluid w-100 img-product"
                    src="${product.product_thumb}"
                    alt=""
                  />
                </div>
                <div
                  class="card-body border-left border-right text-center p-0 pt-4 pb-3"
                >
                  <h6 class="text-truncate mb-3">${product.product_name}</h6>
                  <div class="d-flex justify-content-center">
                    <h6 class="ml-2">$${product.product_price}</h6>
                    <h6 class="text-muted ml-2">
                      <del>$${Math.round(product.product_price * 1.1)}</del>
                    </h6>
                  </div>
                </div>
                <div
                  class="card-footer d-flex justify-content-between bg-light border"
                >
                  <a
                    href="./detail/${product._id} "
                    class="btn btn-sm text-dark p-0"
                  >
                    <i class="fas fa-eye text-primary mr-1"></i>View Detail
                  </a>
                  <button type="submit" class="btn btn-sm text-dark p-0" onclick="addToCart('${product._id}', 1, '${product.product_price}')">
                    <i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart
                  </button>
                </div>
              </div>
            </div>
          `);
        });

        // Update the pagination
        $('#pagination').html('');
        let paginationHtml = '';
        paginationHtml += `
          <li class="page-item ${ data.currentPage == 1 ? 'disabled' : '' }">
            <a class="page-link" href="#" onclick="loadPage(${ data.currentPage - 1 }, '${ data.sortBy }')" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li> `
        paginationHtml += `
          <li class="page-item ${ data.currentPage == 1 ? 'active' : '' }">
            <a class="page-link" href="#" onclick="loadPage(1, '${ data.sortBy }')">1</a>
          </li> `
        if (data.totalPages > 1) {
          if (data.totalPages > 2) {
            if (data.currentPage > 2 && data.currentPage < data.totalPages - 1) {
              paginationHtml += `
                <li class="page-item disabled">
                  <a class="page-link" href="#">...</a>
                </li> `
            } else {
              paginationHtml += `
                <li class="page-item ${ data.currentPage == 2 ? 'active' : '' }">
                  <a class="page-link" href="#" onclick="loadPage(2, '${ data.sortBy }')">2</a>
                </li> `
            }
            if (data.totalPages > 3) {
              if (data.totalPages > 4 && (data.currentPage <= 2 || data.currentPage >= data.totalPages - 1)) {
                paginationHtml += `
                  <li class="page-item disabled">
                    <a class="page-link" href="#">...</a>
                  </li> `
              } else if (data.totalPages > 4) {
                paginationHtml += `
                  <li class="page-item active">
                    <a class="page-link" href="#">${ data.currentPage }</a>
                  </li> `
              }
              if (data.currentPage > 2 && data.currentPage < data.totalPages - 1) {
                paginationHtml += `
                  <li class="page-item disabled">
                    <a class="page-link" href="#">...</a>
                  </li> `
              } else {
                paginationHtml += `
                  <li class="page-item ${ data.currentPage == data.totalPages - 1 ? 'active' : '' }">
                    <a class="page-link" href="#" onclick="loadPage(${ data.totalPages - 1 }, '${ data.sortBy }')">${ data.totalPages - 1 }</a>
                  </li> `
              }
            }
          }
          paginationHtml += `
            <li class="page-item ${ data.currentPage == data.totalPages ? 'active' : '' }">
              <a class="page-link" href="#" onclick="loadPage(${ data.totalPages }, '${ data.sortBy }')">${ data.totalPages }</a>
            </li> `
        }
        paginationHtml += `
          <li class="page-item ${ data.currentPage == data.totalPages ? 'disabled' : '' }">
            <a class="page-link" href="#" onclick="loadPage(${ data.currentPage + 1 }, '${ data.sortBy }')" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li> `
        $('#pagination').append(paginationHtml);
      },
      error: function(err) {
        console.error('Failed to load page:', err);
      }
    });
  }

  function sortProducts(sortBy) {
    loadPage(1, sortBy);
  }