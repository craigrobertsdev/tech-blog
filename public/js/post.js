// called when form submit is clicked on create post page
const createPost = async (event) => {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  const response = await fetch("/api/dashboard/post", {
    method: "POST",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

// adding logic to call comment api.
// it should show post, have a form to add a comment with title and content then below that
// on form submit it will convert that post to embedded html and call the /comment api
// api would then add that comment to the post
const addComment = async () => {
  event.preventDefault();

  const title = document.getElementById("comment-title").value;
  const content = document.getElementById("comment-content").value;

  await fetch("/api/dashboard/comment", {
    method: "POST",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });
};

const toggleAddComment = (event) => {
  console.log("toggling content");
  if ($(event.currentTarget).parent().hasClass("d-none")) {
    $(event.currentTarget).parent().removeClass("d-none");
  } else {
    $(event.currentTarget).parent().addClass("d-none");
  }
};

if (document.querySelector("#create-post")) {
  document.querySelector("#create-post").addEventListener("submit", createPost);
}

if (document.querySelector(".create-comment")) {
  document
    .querySelector(".create-comment")
    .addEventListener("submit", addComment);
}

if (document.querySelector(".toggle-comment")) {
  document
    .querySelector(".toggle-comment")
    .addEventListener("click", toggleAddComment);
}
