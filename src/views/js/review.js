const generateStarsHtml = (stars) => {
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= stars) {
      starsHtml += '<i class="fas fa-star"></i>';
    } else if (i === Math.ceil(stars) && stars % 1 !== 0) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    } else {
      starsHtml += '<i class="far fa-star"></i>';
    }
  }
  return starsHtml;
};

function renderReview(page = 1, limit = 5) {
  const reviewsContainer = document.getElementById("reviews-container");
  const productId = document.getElementById("productId").value;

  fetch(`/reviews-get-by-id/${productId}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      reviewsContainer.innerHTML = "";
      data.reviews.forEach((review) => {
        const reviewHtmt = ` <div class="media mb-4">
            <img src="../img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
            <div class="media-body">
              <h6>${review.user_name} - <i>${new Date(
          review.createdAt
        ).toLocaleDateString()}</i></h6>
              <div class="text-primary mb-2">
                ${generateStarsHtml(review.star)}
              </div>
              <p>${review.comment}</p>
            </div>
          </div>`;
        reviewsContainer.insertAdjacentHTML("beforeend", reviewHtmt);
      });
      $('#pagination').html('');
      let paginationHtml = '';
      paginationHtml += `
        <li class="page-item ${ data.currentPage == 1 ? 'disabled' : '' }">
          <a class="page-link" href="#" onclick="renderReview( ${ data.currentPage - 1 }, ${ limit })" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li> `
      paginationHtml += `
        <li class="page-item ${ data.currentPage == 1 ? 'active' : '' }">
          <a class="page-link" href="#" onclick="renderReview( ${ 1 }, ${ limit })">1</a>
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
                <a class="page-link" href="#" onclick="renderReview( ${ 2 }, ${ limit })">2</a>
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
                  <a class="page-link" href="#" onclick="renderReview( ${ data.totalPages - 1 }, ${ limit })">${ data.totalPages - 1 }</a>
                </li> `
            }
          }
        }
        paginationHtml += `
          <li class="page-item ${ data.currentPage == data.totalPages ? 'active' : '' }">
            <a class="page-link" href="#" onclick="renderReview( ${ data.totalPages }, ${ limit })">${ data.totalPages }</a>
          </li> `
      }
      paginationHtml += `
        <li class="page-item ${ data.currentPage == data.totalPages ? 'disabled' : '' }">
          <a class="page-link" href="#" onclick="renderReview( ${ data.currentPage + 1 }, ${ limit })" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li> `
      $('#pagination').html(paginationHtml);
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("fill-and-submit");
  const form = document.getElementById("review-form");
  const reviewButton = document.getElementById("review-button");
  const reviewsContainer = document.getElementById("reviews-container");
  const starsContainer = document.getElementById("stars-container");
  const productId = document.getElementById("productId").value;
  const limit = 5;

  let selectedStars = 3; // Default stars

  

  const updateStars = (stars) => {
    [...starsContainer.children].forEach((star, index) => {
      star.classList.remove("fas", "far");
      star.classList.add(index < stars ? "fas" : "far");
    });
  };

  // Handle star click
  starsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-star")) {
      selectedStars = parseInt(e.target.getAttribute("data-value"), 10);
      updateStars(selectedStars);
    }
  });

  testButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default form submission
    // Construct the request body in the required format
    const requestBody = {
      comment: document.getElementById("message").value || "",
      star: selectedStars,
    };
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(`${response.status} ${data.message}`);
          }
          return data;
        });
      })
      .then((data) => {
        document.getElementById("message").value = "";
        updateStars(0);
        return fetch(`/reviews-get-by-id/${productId}?page=1&limit=${ limit }`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
      })
      .then((response) => response.json())
      .then((data) => {

        reviewsContainer.innerHTML = "";
        data.reviews.forEach((review) => {
          const reviewHtml = `
            <div class="media mb-4">
              <img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
              <div class="media-body">
                <h6>${review.user_name} - <i>${new Date(
            review.createdAt
          ).toLocaleDateString()}</i></h6>
                <div class="text-primary mb-2">6
                  ${generateStarsHtml(review.star)}
                </div>
                <p>${review.comment}</p>
              </div>
            </div>
          `;
          reviewsContainer.insertAdjacentHTML("beforeend", reviewHtml);
        });
        $('#pagination').html('');
        let paginationHtml = '';
        paginationHtml += `
          <li class="page-item ${ data.currentPage == 1 ? 'disabled' : '' }">
            <a class="page-link" href="#" onclick="renderReview( ${ data.currentPage - 1 }, ${ limit })" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li> `
        paginationHtml += `
          <li class="page-item ${ data.currentPage == 1 ? 'active' : '' }">
            <a class="page-link" href="#" onclick="renderReview( ${ 1 }, ${ limit })">1</a>
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
                  <a class="page-link" href="#" onclick="renderReview( ${ 2 }, ${ limit })">2</a>
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
                    <a class="page-link" href="#" onclick="renderReview( ${ data.totalPages - 1 }, ${ limit })">${ data.totalPages - 1 }</a>
                  </li> `
              }
            }
          }
          paginationHtml += `
            <li class="page-item ${ data.currentPage == data.totalPages ? 'active' : '' }">
              <a class="page-link" href="#" onclick="renderReview( ${ data.totalPages }, ${ limit })">${ data.totalPages }</a>
            </li> `
        }
        paginationHtml += `
          <li class="page-item ${ data.currentPage == data.totalPages ? 'disabled' : '' }">
            <a class="page-link" href="#" onclick="renderReview( ${ data.currentPage + 1 }, ${ limit })" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li> `
        $('#pagination').html(paginationHtml);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert(`Error submitting review: ${error.message}`);
      });
  });
  reviewButton.addEventListener("click", renderReview(1, limit));
});
