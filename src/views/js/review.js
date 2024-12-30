document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("fill-and-submit");
  const form = document.getElementById("review-form");
  const starsContainer = document.getElementById("stars-container");
  const reviewButton = document.getElementById("review-button");
  const reviewsContainer = document.getElementById("reviews-container");
  const productId = document.getElementById("productId").value;

  let selectedStars = 3; // Default stars

  // Handle star click
  starsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-star")) {
      selectedStars = parseInt(e.target.getAttribute("data-value"), 10);
      updateStars(selectedStars);
    }
  });

  const updateStars = (stars) => {
    [...starsContainer.children].forEach((star, index) => {
      star.classList.remove("fas", "far");
      star.classList.add(index < stars ? "fas" : "far");
    });
  };
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
  const renderReview = (e) => {
    fetch(`/reviews-get-by-id/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        reviewsContainer.innerHTML = "";
        data.metadata.reviews.forEach((review) => {
          const reviewHtmt = ` <div class="media mb-4">
              <img src="../img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
              <div class="media-body">
                <h6>${review.user_name} - <i>${new Date(
            review.date
          ).toLocaleDateString()}</i></h6>
                <div class="text-primary mb-2">
                  ${generateStarsHtml(review.star)}
                </div>
                <p>${review.comment}</p>
              </div>
            </div>`;
          reviewsContainer.insertAdjacentHTML("beforeend", reviewHtmt);
        });
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  };
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
        return fetch(`/reviews-get-by-id/${productId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        reviewsContainer.innerHTML = "";
        data.metadata.reviews.forEach((review) => {
          const reviewHtml = `
            <div class="media mb-4">
              <img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
              <div class="media-body">
                <h6>${review.user} - <i>${new Date(
            review.date
          ).toLocaleDateString()}</i></h6>
                <div class="text-primary mb-2">
                  ${generateStarsHtml(review.star)}
                </div>
                <p>${review.comment}</p>
              </div>
            </div>
          `;
          reviewsContainer.insertAdjacentHTML("beforeend", reviewHtml);
        });
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert(`Error submitting review: ${error.message}`);
      });
  });
  reviewButton.addEventListener("click", renderReview);
});
