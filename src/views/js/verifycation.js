document.addEventListener("DOMContentLoaded", () => {
  const resend = document.getElementById("resend");
  const submit = document.getElementById("submit-verifycation");
  resend.addEventListener("click", async () => {
    try {
      const response = await fetch("/email-resendVerify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Verification email resent successfully");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("An error occurred while resending the verification email.");
    }
  });
  submit.addEventListener("click", async () => {
    try {
      const inputVerify = document.getElementById("input-verifycation").value;
      console.log("Verification token fetch", inputVerify);
      const response = await fetch("/email-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationToken: inputVerify }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Verification email successfully");
      } else {
        alert(`Error not ok: ${data.error}`);
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("An error occurred while resending the verification email.", error);
    }
  });
});
