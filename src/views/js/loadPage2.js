function hashAccountId(accountId) {
  let hash = 0;
  for (let i = 0; i < accountId.length; i++) {
      const char = accountId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 100000);
}

function loadPage(page, sortBy = '') {
    const searchQuery = document.getElementById('search').value;
  
      $.ajax({
        url: '/account',
        type: 'GET',
        data: {
          currentPage: page,
          search: searchQuery,
          sortBy: sortBy,
        },
        success: function(data) {
          console.log(data.accounts);
          // Update the product list
          $('#account-list').html('');
          data.accounts.forEach(account => {
            $('#account-list').append(`
              <tr>
                  <td class="align-middle">${ hashAccountId(account._id.toString()) }</td>
                  <td class="align-middle">${ account.name }</td>
                  <td class="align-middle">${ account.email }</td>
                  <td class="align-middle">${ new Date(account.createdAt).toLocaleString() }</td>
                  <td class="align-middle">${ account.role }</td>
                  <td class="align-middle">${ account.status }</td>
                  <td class="align-middle">
                    <a href="/account/${ account._id.toString() }" class="btn btn-primary">View</a>
                </tr>
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
  
function sortAccount(sortBy) {
    loadPage(1, sortBy);
}